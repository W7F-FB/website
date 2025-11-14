import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns";
import numeral from "numeral";
import type { BlogDocument } from "../../prismicio-types";
import type { BlogMetadata } from "@/components/blocks/posts/post";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function relativeDateRange(startDate: string | Date | null | undefined, endDate: string | Date | null | undefined): 'past' | 'present' | 'future' | null {
  if (!startDate || !endDate) return null
 
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
 
  start.setUTCHours(0, 0, 0, 0)
  end.setUTCHours(23, 59, 59, 999)
  now.setUTCHours(12, 0, 0, 0)
 
  if (now < start) {
    return 'future'
  } else if (now >= start && now <= end) {
    return 'present'
  } else {
    return 'past'
  }
}

export function formatDateRange(startDate: string | Date | null | undefined, endDate: string | Date | null | undefined): string {
  if (!startDate || !endDate) return ''
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  const startMonth = start.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
  const endMonth = end.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
  const startDay = start.getUTCDate()
  const endDay = end.getUTCDate()
  const year = start.getUTCFullYear()
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${year}`
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
  }
}

export function cleanCountryCode(countryCode: string | null | undefined): string | null {
  if (!countryCode) return null
  
  // Remove all invisible Unicode characters that Sanity visual editing adds
  return countryCode
    .replace(/[\u200B-\u200F\uFEFF\u2060-\u2064]/g, '') // Zero-width spaces, joiners, etc.
    .replace(/[\u202A-\u202E]/g, '') // Text direction marks
    .trim()
    .toLowerCase()
}

/**
 * Converts a slug to a readable title using smart formatting rules
 * This function handles common slug patterns and formats them properly
 */
function slugToTitle(slug: string): string {
  // Handle special cases first
  const specialCases: Record<string, string> = {
    'faqs': 'FAQs',
    'api': 'API',
    'ui': 'UI',
    'ux': 'UX',
    'seo': 'SEO',
    'css': 'CSS',
    'js': 'JavaScript',
    'ts': 'TypeScript',
  };
  
  // Check for exact matches in special cases
  if (specialCases[slug.toLowerCase()]) {
    return specialCases[slug.toLowerCase()];
  }
  
  // Smart formatting: split on hyphens/underscores and capitalize
  return slug
    .split(/[-_]/)
    .map(word => {
      const lowerWord = word.toLowerCase();
      // Check if this word is in special cases
      if (specialCases[lowerWord]) {
        return specialCases[lowerWord];
      }
      // Standard capitalization
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export function generateBreadcrumbs(pathname: string) {
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ label: "Home", href: "/" }];
  
  let currentPath = "";
  for (const path of paths) {
    currentPath += `/${path}`;
    const label = slugToTitle(path);
    breadcrumbs.push({ label, href: currentPath });
  }
  
  return breadcrumbs;
}

export function createGrainGradientBackground(
  overlayColor = "#c4c4c4",
  accentColor = "#708e53", 
  shadowColor = "#242424"
) {
  // Use consistent fallback colors for SSR/client consistency
  const resolveColor = (color: string) => {
    if (color.startsWith('var(')) {
      // Use consistent fallback colors instead of checking window
      return color.replace('var(--muted)', '#f5f5f5')
                  .replace('var(--primary)', '#1a1a1a')
                  .replace('var(--accent)', '#1a1a1a');
    }
    return color;
  };

  const resolvedOverlay = resolveColor(overlayColor);
  const resolvedAccent = resolveColor(accentColor);
  const resolvedShadow = resolveColor(shadowColor);

  const svg = `<svg width="1600" height="1600" viewBox="0 0 1600 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1600" height="1600" fill="#000000"/>
    <rect width="1600" height="1600" fill="${resolvedOverlay}" fill-opacity="0.3615796519203419"/>
    <g clip-path="url(#clip0_50_327)">
      <g filter="url(#filter0_f_50_327)">
        <rect x="328" y="429" width="1070" height="872" fill="${resolvedAccent}"/>
        <rect x="0" y="618" width="1034" height="837" fill="${resolvedShadow}"/>
      </g>
    </g>
    <g style="mix-blend-mode:overlay">
      <rect width="1600" height="1600" fill="url(#pattern0)" fill-opacity="0.75"/>
      <rect x="0" y="0" width="1600" height="1600" style="fill:gray; stroke:transparent; filter: url(#feTurb02)" />
    </g>
    <defs>
      <filter id="feTurb02" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence baseFrequency="0.7" numOctaves="3" seed="0" result="out1"/>
        <feComposite in="out1" in2="SourceGraphic" operator="in" result="out2"/>
        <feBlend in="SourceGraphic" in2="out2" mode="overlay" result="out3"/>
      </filter>
      <filter id="filter0_f_50_327" x="0" y="0" width="1600" height="1600" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feGaussianBlur stdDeviation="250" result="effect1_foregroundBlur_50_327"/>
      </filter>
      <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="0.08375" height="0.08375">
        <use href="#image0_50_327" transform="scale(0.001)"/>
      </pattern>
      <clipPath id="clip0_50_327">
        <rect width="1600" height="1600" fill="white"/>
      </clipPath>
    </defs>
  </svg>`;
  
  const encodedSvg = encodeURIComponent(svg);
  return `url("data:image/svg+xml,${encodedSvg}")`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "MMM d, yyyy"); 
    // e.g. 2025-09-19 → September 19, 2025
  } catch {
    return dateString; // fallback in case of invalid date
  }
}

export function formatCurrencyInWords(amount: number): string {
  const absAmount = Math.abs(amount)
  
  if (absAmount >= 1000000000) {
    const billions = absAmount / 1000000000
    const formatted = numeral(billions).format(billions % 1 === 0 ? '0' : '0.0')
    return `$${formatted} Billion`
  }
  
  if (absAmount >= 1000000) {
    const millions = absAmount / 1000000
    const formatted = numeral(millions).format(millions % 1 === 0 ? '0' : '0.0')
    return `$${formatted} Million`
  }
  
  if (absAmount >= 1000) {
    const thousands = absAmount / 1000
    const formatted = numeral(thousands).format(thousands % 1 === 0 ? '0' : '0.0')
    return `$${formatted} Thousand`
  }
  
  return numeral(amount).format('$0,0')
}

export function mapBlogDocumentToMetadata(blog: BlogDocument): BlogMetadata {
  return {
    slug: blog.uid ?? "",
    title: blog.data.title ?? "Untitled",
    excerpt: blog.data.excerpt ?? null,
    image: blog.data.image?.url ?? undefined,
    category: blog.data.category ?? null,
    author: blog.data.author ?? null,
    date: blog.data.date ?? null,
  }
}

export function formatGameDate(startTime: string | Date | null | undefined): { day: string; month: string; time: string } {
  if (!startTime) return { day: "", month: "", time: "" }
  
  try {
    const date = new Date(startTime)
    const day = date.getUTCDate().toString()
    const month = date.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase()
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/New_York",
    })
    const time = timeFormatter.format(date)
    return { day, month, time }
  } catch {
    return { day: "", month: "", time: "" }
  }
}
