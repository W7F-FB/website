import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const HIGHLIGHT_BUCKET = process.env.HIGHLIGHT_BUCKET ?? "match-highlights";
const IS_DEV = process.env.NODE_ENV === "development";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
  },
  global: {
    headers: {
      "X-Client-Info": "highlight-ingest",
    },
  },
});

function getExtensionFromUrl(url: string, fallback: string): string {
  try {
    const u = new URL(url);
    const pathname = u.pathname;
    const idx = pathname.lastIndexOf(".");
    if (idx !== -1 && idx < pathname.length - 1) {
      const ext = pathname.substring(idx);
      if (
        /^\.(mp4|mov|mkv|webm|mpg|mpeg|m4v|jpg|jpeg|png|webp|gif)$/i.test(ext)
      ) {
        return ext.toLowerCase();
      }
    }
  } catch {
    return fallback;
  }
  return fallback;
}

async function fetchAsBlob(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to download ${url}: ${res.status} ${res.statusText}`
    );
  }
  const contentType = res.headers.get("content-type") ?? undefined;
  const blob = await res.blob();
  return { blob, contentType };
}

function inferExtFromContentType(ct: string | undefined, fallback = ".bin") {
  if (!ct) return fallback;
  const map: Record<string, string> = {
    "video/mp4": ".mp4",
    "video/quicktime": ".mov",
    "video/x-matroska": ".mkv",
    "video/webm": ".webm",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  return map[ct.toLowerCase()] ?? fallback;
}

function toPathSafe(id: string): string {
  return id.replace(/[^A-Za-z0-9._-]/g, "_");
}

export interface HighlightIngestPayload {
  provider_clip_id: string;
  opta_match_id: string;
  opta_event_id: string;
  opta_competition_id: string;
  video_source_url: string;
  thumbnail_source_url?: string;
}

export async function ingestHighlight(payload: HighlightIngestPayload) {
  const required: (keyof HighlightIngestPayload)[] = [
    "provider_clip_id",
    "opta_match_id",
    "opta_event_id",
    "opta_competition_id",
    "video_source_url",
  ];

  for (const k of required) {
    if (!payload[k]) {
      throw new Error(`Missing field: ${k}`);
    }
  }

  const providerClipId = toPathSafe(payload.provider_clip_id);

  if (IS_DEV) console.log(`Downloading video from: ${payload.video_source_url}`);
  const videoDownload = await fetchAsBlob(payload.video_source_url);
  if (IS_DEV) {
    console.log(
      `Video downloaded: ${videoDownload.blob.size} bytes, content-type: ${videoDownload.contentType}`
    );
  }
  let videoExt = getExtensionFromUrl(payload.video_source_url, ".mp4");
  if (videoExt === ".mp4" && videoDownload.contentType) {
    const hinted = inferExtFromContentType(
      videoDownload.contentType,
      videoExt
    );
    if (hinted) videoExt = hinted;
  }

  const clipPath = `clips/${providerClipId}${videoExt}`;

  if (IS_DEV) {
    console.log(`Uploading video to Supabase: ${clipPath} (${(videoDownload.blob.size / 1024 / 1024).toFixed(2)} MB)...`);
  }
  const uploadStartTime = Date.now();
  
  try {
    const { data: signedUrl, error: signedUrlError } = await supabase.storage
      .from(HIGHLIGHT_BUCKET)
      .createSignedUploadUrl(clipPath);

    if (signedUrlError || !signedUrl) {
      throw new Error(`Failed to get signed upload URL: ${signedUrlError?.message}`);
    }

    if (IS_DEV) console.log(`Got signed upload URL, uploading directly...`);

    const uploadResponse = await fetch(signedUrl.signedUrl, {
      method: 'PUT',
      body: videoDownload.blob,
      headers: {
        'Content-Type': videoDownload.contentType ?? 'video/mp4',
        'x-upsert': 'true',
      },
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(
        `Upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`
      );
    }

    if (IS_DEV) {
      const uploadDuration = ((Date.now() - uploadStartTime) / 1000).toFixed(2);
      console.log(`Video upload completed successfully in ${uploadDuration}s`);
    }
  } catch (err) {
    if (IS_DEV) {
      const uploadDuration = ((Date.now() - uploadStartTime) / 1000).toFixed(2);
      console.error(`Upload failed after ${uploadDuration}s:`, err);
    }
    throw new Error(
      `Failed to upload video: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  let thumbPath: string | null = null;
  let thumbPublicUrl: string | null = null;

  if (payload.thumbnail_source_url) {
    try {
      if (IS_DEV) console.log(`Downloading thumbnail from: ${payload.thumbnail_source_url}`);
      const thumbDownload = await fetchAsBlob(
        payload.thumbnail_source_url
      );
      if (IS_DEV) {
        console.log(
          `Thumbnail downloaded: ${thumbDownload.blob.size} bytes, content-type: ${thumbDownload.contentType}`
        );
      }
      
      let thumbExt = getExtensionFromUrl(payload.thumbnail_source_url, ".jpg");
      if (thumbDownload.contentType) {
        const hinted = inferExtFromContentType(
          thumbDownload.contentType,
          thumbExt
        );
        if (hinted) thumbExt = hinted;
      }

      thumbPath = `thumbs/${providerClipId}${thumbExt}`;

      const { data: thumbSignedUrl, error: thumbSignedUrlError } = await supabase.storage
        .from(HIGHLIGHT_BUCKET)
        .createSignedUploadUrl(thumbPath);

      if (thumbSignedUrlError || !thumbSignedUrl) {
        if (IS_DEV) console.warn("Failed to get signed upload URL for thumbnail, skipping");
        thumbPath = null;
      } else {
        const thumbUploadResponse = await fetch(thumbSignedUrl.signedUrl, {
          method: 'PUT',
          body: thumbDownload.blob,
          headers: {
            'Content-Type': thumbDownload.contentType ?? 'image/jpeg',
            'x-upsert': 'true',
          },
        });

        if (!thumbUploadResponse.ok) {
          if (IS_DEV) console.warn(`Thumbnail upload failed: ${thumbUploadResponse.status}, continuing without thumbnail`);
          thumbPath = null;
        } else {
          if (IS_DEV) console.log("Thumbnail uploaded successfully");
        }
      }
    } catch (e) {
      if (IS_DEV) {
        console.error("Thumbnail processing error:", e);
        console.warn("Thumbnail processing failed, continuing without thumbnail");
      }
      thumbPath = null;
    }
  }

  const vPub = supabase.storage
    .from(HIGHLIGHT_BUCKET)
    .getPublicUrl(clipPath).data.publicUrl;

  if (!vPub) {
    throw new Error("Failed to resolve video public URL");
  }

  if (thumbPath) {
    const tPubData = supabase.storage
      .from(HIGHLIGHT_BUCKET)
      .getPublicUrl(thumbPath).data;
    thumbPublicUrl = tPubData.publicUrl ?? null;
  }

  const insertPayload = {
    provider: "partner",
    provider_id: providerClipId,
    opta_match_id: payload.opta_match_id,
    opta_competition_id: payload.opta_competition_id,
    opta_event_id: payload.opta_event_id,
    video_url: vPub,
    thumbnail_url: thumbPublicUrl || "",
    status: "ready",
    updated_at: new Date().toISOString().replace("Z", ""),
  };

  const { data: inserted, error: insErr } = await supabase
    .from("Match Highlights")
    .insert(insertPayload)
    .select()
    .single();

  if (insErr) {
    throw new Error(`Failed to insert record: ${insErr.message}`);
  }

  return inserted;
}

