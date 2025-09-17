import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
  // If CSS variables are passed, resolve them
  const resolveColor = (color: string) => {
    if (color.startsWith('var(')) {
      if (typeof window !== 'undefined') {
        const varName = color.slice(4, -1); // Remove 'var(' and ')'
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      }
      // Fallback for SSR or when window is not available
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
