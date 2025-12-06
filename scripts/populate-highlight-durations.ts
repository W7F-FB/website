import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function getVideoDuration(url: string): Promise<number | null> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) {
      console.log(`  Failed to fetch HEAD for ${url}: ${response.status}`);
      return null;
    }

    const contentLength = response.headers.get("content-length");
    if (!contentLength) {
      console.log(`  No content-length header for ${url}`);
    }

    const rangeResponse = await fetch(url, {
      headers: { Range: "bytes=0-1000000" },
    });

    if (!rangeResponse.ok && rangeResponse.status !== 206) {
      console.log(`  Failed to fetch range for ${url}: ${rangeResponse.status}`);
      return null;
    }

    const buffer = await rangeResponse.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const duration = extractMp4Duration(bytes);
    return duration;
  } catch (error) {
    console.log(`  Error fetching ${url}:`, error);
    return null;
  }
}

function extractMp4Duration(bytes: Uint8Array): number | null {
  let offset = 0;

  while (offset < bytes.length - 8) {
    const size = (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
    const type = String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);

    if (size === 0 || size > bytes.length - offset) break;

    if (type === "moov") {
      return parseMoovAtom(bytes, offset + 8, size - 8);
    }

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

    if (type === "mvhd") {
      return parseMvhdAtom(bytes, offset + 8, size - 8);
    }

    offset += size;
  }

  return null;
}

function parseMvhdAtom(bytes: Uint8Array, start: number, length: number): number | null {
  if (length < 20) return null;

  const version = bytes[start];

  let timescale: number;
  let duration: number;

  if (version === 0) {
    timescale = (bytes[start + 12] << 24) | (bytes[start + 13] << 16) | (bytes[start + 14] << 8) | bytes[start + 15];
    duration = (bytes[start + 16] << 24) | (bytes[start + 17] << 16) | (bytes[start + 18] << 8) | bytes[start + 19];
  } else {
    timescale = (bytes[start + 20] << 24) | (bytes[start + 21] << 16) | (bytes[start + 22] << 8) | bytes[start + 23];
    duration =
      (bytes[start + 24] << 24) | (bytes[start + 25] << 16) | (bytes[start + 26] << 8) | bytes[start + 27];
  }

  if (timescale === 0) return null;

  return duration / timescale;
}

async function main() {
  console.log("Fetching highlights without duration...");

  const { data: highlights, error } = await supabase
    .from("Match Highlights")
    .select("id, video_url, duration_seconds")
    .is("duration_seconds", null);

  if (error) {
    console.error("Error fetching highlights:", error);
    process.exit(1);
  }

  console.log(`Found ${highlights?.length || 0} highlights to process\n`);

  if (!highlights || highlights.length === 0) {
    console.log("No highlights need duration updates.");
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const highlight of highlights) {
    console.log(`Processing ID ${highlight.id}...`);

    const duration = await getVideoDuration(highlight.video_url);

    if (duration !== null) {
      const { error: updateError } = await supabase
        .from("Match Highlights")
        .update({ duration_seconds: duration })
        .eq("id", highlight.id);

      if (updateError) {
        console.log(`  Failed to update: ${updateError.message}`);
        failCount++;
      } else {
        console.log(`  Duration: ${duration.toFixed(2)}s`);
        successCount++;
      }
    } else {
      console.log(`  Could not determine duration`);
      failCount++;
    }
  }

  console.log(`\nComplete! Updated: ${successCount}, Failed: ${failCount}`);
}

main();

