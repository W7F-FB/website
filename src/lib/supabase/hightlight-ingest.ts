import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const HIGHLIGHT_BUCKET = process.env.HIGHLIGHT_BUCKET ?? "match-highlights";

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

const VIDEO_EXTENSIONS = /\.(mp4|mov|mkv|webm|mpg|mpeg|m4v)/i;
const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|gif)/i;

function extractMediaUrlAndMetadata(fullUrl: string, isVideo: boolean): { mediaUrl: string; metadata: string } {
  const extensionRegex = isVideo ? VIDEO_EXTENSIONS : IMAGE_EXTENSIONS;
  const match = fullUrl.match(extensionRegex);
  
  if (match && match.index !== undefined) {
    const endOfExtension = match.index + match[0].length;
    const mediaUrl = fullUrl.substring(0, endOfExtension);
    const metadata = fullUrl.substring(endOfExtension);
    return { mediaUrl, metadata };
  }
  
  return { mediaUrl: fullUrl, metadata: "" };
}

function parseMetadataFromPath(metadataPath: string): Record<string, string> {
  const decoded = decodeURIComponent(metadataPath);
  console.log("[WCS Ingest] Decoded metadata path:", decoded);
  
  const result: Record<string, string> = {};
  
  const paramMatch = decoded.match(/wsc_highlight_(.+)$/);
  if (paramMatch) {
    const paramString = paramMatch[1];
    console.log("[WCS Ingest] Param string:", paramString);
    
    const params = new URLSearchParams(paramString);
    params.forEach((value, key) => {
      result[key] = value;
    });
  }
  
  console.log("[WCS Ingest] Parsed metadata:", result);
  return result;
}

async function fetchAsBlob(url: string) {
  console.log("[WCS Ingest] Fetching:", url);
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

function generateClipId(): string {
  return `clip_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

function getExtensionFromUrl(url: string, fallback: string): string {
  const match = url.match(/\.(mp4|mov|mkv|webm|mpg|mpeg|m4v|jpg|jpeg|png|webp|gif)$/i);
  return match ? match[0].toLowerCase() : fallback;
}

function extractMp4Duration(bytes: Uint8Array): number | null {
  let offset = 0;
  while (offset < bytes.length - 8) {
    const size = (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
    const type = String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);
    if (size === 0 || size > bytes.length - offset) break;
    if (type === "moov") return parseMoovAtom(bytes, offset + 8, size - 8);
    offset += size;
  }
  return null;
}

function parseMoovAtom(bytes: Uint8Array, start: number, length: number): number | null {
  let offset = start;
  const end = start + length;
  while (offset < end - 8 && offset < bytes.length - 8) {
    const size = (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
    const type = String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);
    if (size === 0 || size > end - offset) break;
    if (type === "mvhd") return parseMvhdAtom(bytes, offset + 8);
    offset += size;
  }
  return null;
}

function parseMvhdAtom(bytes: Uint8Array, start: number): number | null {
  const version = bytes[start];
  let timescale: number, duration: number;
  if (version === 0) {
    timescale = (bytes[start + 12] << 24) | (bytes[start + 13] << 16) | (bytes[start + 14] << 8) | bytes[start + 15];
    duration = (bytes[start + 16] << 24) | (bytes[start + 17] << 16) | (bytes[start + 18] << 8) | bytes[start + 19];
  } else {
    timescale = (bytes[start + 20] << 24) | (bytes[start + 21] << 16) | (bytes[start + 22] << 8) | bytes[start + 23];
    duration = (bytes[start + 24] << 24) | (bytes[start + 25] << 16) | (bytes[start + 26] << 8) | bytes[start + 27];
  }
  if (timescale === 0) return null;
  return duration / timescale;
}

async function getVideoDurationFromBlob(blob: Blob): Promise<number | null> {
  try {
    const buffer = await blob.arrayBuffer();
    return extractMp4Duration(new Uint8Array(buffer));
  } catch {
    return null;
  }
}

export interface HighlightIngestPayload {
  video_source_url: string;
  thumbnail_source_url: string;
}

export async function ingestHighlight(payload: HighlightIngestPayload) {
  console.log("[WCS Ingest] Starting ingest with payload:", JSON.stringify(payload, null, 2));
  
  if (!payload.video_source_url) {
    throw new Error("Missing field: video_source_url");
  }
  if (!payload.thumbnail_source_url) {
    throw new Error("Missing field: thumbnail_source_url");
  }

  const { mediaUrl: videoUrl, metadata: videoMetadata } = extractMediaUrlAndMetadata(payload.video_source_url, true);
  console.log("[WCS Ingest] Extracted video URL:", videoUrl);
  console.log("[WCS Ingest] Extracted video metadata path:", videoMetadata);

  const metadata = parseMetadataFromPath(videoMetadata);
  
  const clipId = generateClipId();
  console.log("[WCS Ingest] Generated clip ID:", clipId);

  console.log("[WCS Ingest] Downloading video from:", videoUrl);
  const videoDownload = await fetchAsBlob(videoUrl);
  console.log("[WCS Ingest] Video downloaded:", videoDownload.blob.size, "bytes, content-type:", videoDownload.contentType);

  const videoDuration = await getVideoDurationFromBlob(videoDownload.blob);
  console.log("[WCS Ingest] Video duration:", videoDuration ? `${videoDuration.toFixed(2)}s` : "unknown");
  
  let videoExt = getExtensionFromUrl(videoUrl, ".mp4");
  if (videoExt === ".mp4" && videoDownload.contentType) {
    const hinted = inferExtFromContentType(videoDownload.contentType, videoExt);
    if (hinted) videoExt = hinted;
  }

  const clipPath = `clips/${clipId}${videoExt}`;
  console.log("[WCS Ingest] Uploading video to Supabase:", clipPath, `(${(videoDownload.blob.size / 1024 / 1024).toFixed(2)} MB)`);

  const uploadStartTime = Date.now();
  
  try {
    const { data: signedUrl, error: signedUrlError } = await supabase.storage
      .from(HIGHLIGHT_BUCKET)
      .createSignedUploadUrl(clipPath);

    if (signedUrlError || !signedUrl) {
      console.error("[WCS Ingest] Failed to get signed URL:", signedUrlError);
      throw new Error(`Failed to get signed upload URL: ${signedUrlError?.message}`);
    }

    console.log("[WCS Ingest] Got signed upload URL, uploading...");

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
      console.error("[WCS Ingest] Upload failed:", uploadResponse.status, errorText);
      throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`);
    }

    const uploadDuration = ((Date.now() - uploadStartTime) / 1000).toFixed(2);
    console.log("[WCS Ingest] Video upload completed in", uploadDuration, "s");
  } catch (err) {
    const uploadDuration = ((Date.now() - uploadStartTime) / 1000).toFixed(2);
    console.error("[WCS Ingest] Video upload failed after", uploadDuration, "s:", err);
    throw new Error(`Failed to upload video: ${err instanceof Error ? err.message : String(err)}`);
  }

  let thumbPath: string | null = null;
  let thumbPublicUrl: string | null = null;

  try {
    const { mediaUrl: thumbnailUrl } = extractMediaUrlAndMetadata(payload.thumbnail_source_url, false);
    console.log("[WCS Ingest] Downloading thumbnail from:", thumbnailUrl);
    
    const thumbDownload = await fetchAsBlob(thumbnailUrl);
    console.log("[WCS Ingest] Thumbnail downloaded:", thumbDownload.blob.size, "bytes, content-type:", thumbDownload.contentType);
    
    let thumbExt = getExtensionFromUrl(thumbnailUrl, ".jpg");
    if (thumbDownload.contentType) {
      const hinted = inferExtFromContentType(thumbDownload.contentType, thumbExt);
      if (hinted) thumbExt = hinted;
    }

    thumbPath = `thumbs/${clipId}${thumbExt}`;
    console.log("[WCS Ingest] Uploading thumbnail to:", thumbPath);

    const { data: thumbSignedUrl, error: thumbSignedUrlError } = await supabase.storage
      .from(HIGHLIGHT_BUCKET)
      .createSignedUploadUrl(thumbPath);

    if (thumbSignedUrlError || !thumbSignedUrl) {
      console.error("[WCS Ingest] Failed to get thumbnail signed URL:", thumbSignedUrlError);
      throw new Error(`Failed to get signed upload URL for thumbnail: ${thumbSignedUrlError?.message}`);
    }

    const thumbUploadResponse = await fetch(thumbSignedUrl.signedUrl, {
      method: 'PUT',
      body: thumbDownload.blob,
      headers: {
        'Content-Type': thumbDownload.contentType ?? 'image/jpeg',
        'x-upsert': 'true',
      },
    });

    if (!thumbUploadResponse.ok) {
      const errorText = await thumbUploadResponse.text();
      console.error("[WCS Ingest] Thumbnail upload failed:", thumbUploadResponse.status, errorText);
      throw new Error(`Thumbnail upload failed: ${thumbUploadResponse.status} - ${errorText}`);
    }
    
    console.log("[WCS Ingest] Thumbnail uploaded successfully");
  } catch (e) {
    console.error("[WCS Ingest] Thumbnail processing error:", e);
    throw new Error(`Failed to upload thumbnail: ${e instanceof Error ? e.message : String(e)}`);
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
    provider_id: clipId,
    opta_match_id: metadata.opta_match_id || "",
    opta_competition_id: metadata.opta_competition_id || "",
    opta_event_id: metadata.opta_event_id || "",
    video_url: vPub,
    thumbnail_url: thumbPublicUrl || "",
    duration_seconds: videoDuration,
    status: "ready",
    updated_at: new Date().toISOString().replace("Z", ""),
  };

  console.log("[WCS Ingest] Inserting record:", JSON.stringify(insertPayload, null, 2));

  const { data: inserted, error: insErr } = await supabase
    .from("Match Highlights")
    .insert(insertPayload)
    .select()
    .single();

  if (insErr) {
    console.error("[WCS Ingest] Database insert failed:", insErr);
    throw new Error(`Failed to insert record: ${insErr.message}`);
  }

  console.log("[WCS Ingest] Successfully inserted record:", inserted);
  return inserted;
}
