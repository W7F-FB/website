import { config } from "dotenv"
config({ path: ".env.local" })

const REPOSITORY_NAME = "world-sevens-football"
const MIGRATION_API_URL = "https://migration.prismic.io/documents"
const EXISTING_DOC_ID = "aYuMOxEAACEA6BIp" // Created in previous run
const ASSET_API_URL = "https://asset-api.prismic.io/assets"

// --- Rich Text Helpers ---

function heading1(text: string) {
  return { type: "heading1" as const, text, spans: [] }
}

function heading2(text: string) {
  return { type: "heading2" as const, text, spans: [] }
}

function heading3(text: string) {
  return { type: "heading3" as const, text, spans: [] }
}

function paragraph(text: string) {
  return { type: "paragraph" as const, text, spans: [] }
}

// --- Fetch existing image_with_text documents from Prismic ---

async function fetchExistingImageWithTextDocs(token: string) {
  const apiUrl = `https://${REPOSITORY_NAME}.cdn.prismic.io/api/v2`

  // Get the API ref
  const apiResponse = await fetch(apiUrl)
  const apiData = await apiResponse.json()
  const ref = apiData.refs[0].ref

  // Query all image_with_text documents
  const queryUrl = `${apiUrl}/documents/search?ref=${ref}&q=[[at(document.type,"image_with_text")]]&orderings=[my.image_with_text.title desc]`
  const queryResponse = await fetch(queryUrl)
  const queryData = await queryResponse.json()

  return queryData.results || []
}

// --- Upload a local file to Prismic Asset API ---

async function uploadAsset(
  filePath: string,
  fileName: string,
  token: string
): Promise<{ id: string; url: string; width: number; height: number } | null> {
  const fs = await import("fs")
  const path = await import("path")

  const fullPath = path.resolve(filePath)
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠️  File not found: ${fullPath}, skipping upload`)
    return null
  }

  const fileBuffer = fs.readFileSync(fullPath)
  const ext = path.extname(fileName).toLowerCase()
  const mimeTypes: Record<string, string> = {
    ".avif": "image/avif",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
  }
  const mimeType = mimeTypes[ext] || "application/octet-stream"

  const formData = new FormData()
  const blob = new Blob([fileBuffer], { type: mimeType })
  formData.append("file", blob, fileName)

  try {
    const response = await fetch(ASSET_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        repository: REPOSITORY_NAME,
        "x-api-key": token,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.warn(`  ⚠️  Asset upload failed for ${fileName}: ${response.status} ${errorText}`)
      return null
    }

    const result = await response.json()
    return {
      id: result.id,
      url: result.url,
      width: result.width || 1200,
      height: result.height || 630,
    }
  } catch (error) {
    console.warn(`  ⚠️  Asset upload error for ${fileName}: ${error}`)
    return null
  }
}

// --- Build Slice Data ---

function buildSubpageHeroSlice(heroImage: { id: string; url: string; width: number; height: number } | null) {
  const imageData = heroImage
    ? {
        id: heroImage.id,
        url: heroImage.url,
        alt: "Social Impact Hero",
        copyright: null,
        dimensions: { width: heroImage.width, height: heroImage.height },
        edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
      }
    : null

  return {
    slice_type: "subpage_hero",
    slice_label: null,
    variation: "default",
    version: "initial",
    primary: {
      subtitle: "Global",
      heading: [heading1("Social Impact")],
      description: [
        paragraph(
          "World Sevens Football is committed to making a positive impact on the world through our community programs, youth development, and global football initiatives that extend beyond the pitch."
        ),
      ],
      ...(imageData ? { image: imageData } : {}),
    },
    items: [],
  }
}

function buildTextBlockSlice(headingText: string) {
  return {
    slice_type: "text_block",
    slice_label: null,
    variation: "default",
    version: "initial",
    primary: {
      heading: [heading2(headingText)],
      body: [],
    },
    items: [],
  }
}

function buildImageWithTextSlice(doc: {
  data: {
    heading?: string
    title?: string
    description: unknown[]
    image: { id?: string; url?: string; alt?: string; dimensions?: { width: number; height: number } }
    align_image?: string
  }
}, index: number) {
  return {
    slice_type: "image_with_text",
    slice_label: null,
    variation: "default",
    version: "initial",
    primary: {
      eyebrow: doc.data.heading || "",
      title: [heading3(doc.data.title || "")],
      description: doc.data.description || [],
      image_position: index % 2 === 0 ? "left" : "right",
      image: doc.data.image
        ? {
            id: doc.data.image.id || "",
            url: doc.data.image.url || "",
            alt: doc.data.image.alt || "Section image",
            copyright: null,
            dimensions: doc.data.image.dimensions || { width: 800, height: 600 },
            edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
          }
        : null,
    },
    items: [],
  }
}

function buildLogoListSlice(
  logoAssets: Array<{ id: string; url: string; width: number; height: number; name: string } | null>
) {
  const logos = logoAssets
    .filter((a): a is NonNullable<typeof a> => a !== null)
    .map((asset) => ({
      logo: {
        id: asset.id,
        url: asset.url,
        alt: asset.name,
        copyright: null,
        dimensions: { width: asset.width, height: asset.height },
        edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
      },
      name: asset.name,
    }))

  return {
    slice_type: "logo_list",
    slice_label: null,
    variation: "default",
    version: "initial",
    primary: {
      heading: [],
      description: [
        paragraph(
          "For our inaugural tournament in Estoril, Portugal, our three Community Champions include CAIS, Benfica Foundation, and Girls for Girls Portugal:"
        ),
      ],
      logos,
    },
    items: [],
  }
}

function buildNewsListSlice() {
  return {
    slice_type: "news_list",
    slice_label: null,
    variation: "default",
    version: "initial",
    primary: {
      heading: [heading2("Keep Reading")],
      category: "Social Impact",
    },
    items: [],
  }
}

// --- Main ---

async function main() {
  const writeToken = process.env.PRISMIC_WRITE_TOKEN
  if (!writeToken) {
    console.error("PRISMIC_WRITE_TOKEN environment variable is required in .env.local")
    process.exit(1)
  }

  console.log("Migrating Social Impact page to Prismic...\n")

  // 1. Fetch existing image_with_text documents
  console.log("1. Fetching existing image_with_text documents...")
  const imageWithTextDocs = await fetchExistingImageWithTextDocs(writeToken)
  console.log(`   Found ${imageWithTextDocs.length} documents`)

  // 2. Upload hero image
  await new Promise((r) => setTimeout(r, 2000)) // rate limit delay
  console.log("2. Uploading hero image...")
  const heroImage = await uploadAsset(
    "public/images/static-media/social-impact.avif",
    "social-impact-hero.avif",
    writeToken
  )
  if (heroImage) {
    console.log(`   ✅ Hero image uploaded (id: ${heroImage.id})`)
  } else {
    console.log("   ⚠️  Hero image skipped - add manually in Prismic dashboard")
  }

  // 3. Upload champion logos
  console.log("3. Uploading champion logos...")
  const championFiles = [
    { file: "public/images/champions/68306970b8959b05c822e2a4_Benficia Foundation.svg", name: "Benfica Foundation" },
    { file: "public/images/champions/68306970b76752371213b8c6_Camada.svg", name: "CAIS" },
    { file: "public/images/champions/68306970d05914ebb11087af_Girlsforgirls.svg", name: "Girls for Girls Portugal" },
  ]

  const logoAssets: Array<{ id: string; url: string; width: number; height: number; name: string } | null> = []
  for (const { file, name } of championFiles) {
    await new Promise((r) => setTimeout(r, 2000)) // rate limit delay
    const asset = await uploadAsset(file, `champion-${name.toLowerCase().replace(/\s+/g, "-")}.svg`, writeToken)
    if (asset) {
      console.log(`   ✅ ${name} logo uploaded`)
      logoAssets.push({ ...asset, name })
    } else {
      console.log(`   ⚠️  ${name} logo skipped`)
      logoAssets.push(null)
    }
  }

  // 4. Build slices
  console.log("4. Building slice data...")
  const slices = [
    buildSubpageHeroSlice(heroImage),
    buildTextBlockSlice("Our Initiatives"),
    // ImageWithText slices from existing documents
    ...imageWithTextDocs.map((doc: { data: { heading?: string; title?: string; description: unknown[]; image: { id?: string; url?: string; alt?: string; dimensions?: { width: number; height: number } }; align_image?: string } }, idx: number) => buildImageWithTextSlice(doc, idx)),
    buildLogoListSlice(logoAssets),
    buildNewsListSlice(),
  ]
  console.log(`   Built ${slices.length} slices`)

  // 5. Create page document
  console.log("5. Creating page document...")
  const data: Record<string, unknown> = {
    slices,
    meta_title: "Social Impact - World Sevens Football",
    meta_description:
      "Discover how World Sevens Football is making a positive impact through community programs, youth development, and global football initiatives that extend beyond the pitch.",
  }

  try {
    const response = await fetch(`${MIGRATION_API_URL}/${EXISTING_DOC_ID}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${writeToken}`,
        repository: REPOSITORY_NAME,
        "Content-Type": "application/json",
        "x-api-key": writeToken,
      },
      body: JSON.stringify({
        uid: "social-impact",
        type: "page",
        lang: "en-us",
        title: "Social Impact",
        data,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`\n❌ Failed to create page: ${response.status} ${response.statusText}`)
      console.error(`   ${errorText}`)
    } else {
      const result = await response.json()
      console.log(`\n✅ Social Impact page updated successfully!`)
      console.log(`   Document ID: ${result.id || EXISTING_DOC_ID}`)
      console.log(`   UID: social-impact`)
      console.log(`\n   Note: Remember to publish the document in the Prismic dashboard.`)
    }
  } catch (error) {
    console.error(`\n❌ Error creating page: ${error}`)
  }
}

main().catch(console.error)
