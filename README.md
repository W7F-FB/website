# W7F Website

This project uses Sanity CMS for content management alongside a Next.js frontend.

## Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for commit messages. All commits should use the format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types include:
- `feat:` - new features
- `fix:` - bug fixes
- `docs:` - documentation updates
- `style:` - formatting changes
- `refactor:` - code refactoring
- `test:` - adding tests
- `chore:` - maintenance tasks

## Content Management System (CMS)

This project uses **Sanity CMS** for headless content management, providing a powerful and flexible backend for managing website content.

### Architecture
- **Sanity Studio**: Located in `studio-website/` directory - a customizable content editing interface
- **Frontend**: Next.js application in the main directory that fetches content from Sanity
- **Content Delivery**: Real-time content updates via Sanity's Content Lake

### Key Features
- **Structured Content**: Define custom schemas for flexible content modeling
- **Real-time Collaboration**: Multiple editors can work simultaneously
- **GROQ Queries**: Powerful query language for fetching exactly the data you need
- **Image CDN**: Automatic image optimization and transformations
- **Version Control**: Built-in revision history for all content changes

### Development Workflow
1. **Schema Definition**: Define content types in `studio-website/schemaTypes/`
2. **Content Creation**: Use Sanity Studio to create and manage content
3. **Frontend Integration**: Query content using GROQ in Next.js components
4. **Live Updates**: Content changes appear immediately on the frontend

### Documentation & Resources
- [Sanity Documentation](https://www.sanity.io/docs) - Complete guide to Sanity CMS
- [GROQ Documentation](https://www.sanity.io/docs/groq) - Query language reference
- [Sanity Studio Documentation](https://www.sanity.io/docs/sanity-studio) - Studio customization guide
- [Next.js Integration](https://www.sanity.io/docs/nextjs) - Sanity + Next.js best practices
- [Image URLs](https://www.sanity.io/docs/image-urls) - Image optimization and transformations

## Image Optimization

When working with Sanity images, always use `auto=format` parameter for optimal image delivery (includes AVIF support):

```javascript
const imageUrl = urlFor(image)
  .width(800)
  .height(600)
  .auto('format') // Enables AVIF + automatic format selection
  .url()
```

This ensures images are served in the most efficient format supported by each browser (AVIF → WebP → JPEG/PNG).

## Component Conventions

All components in this project follow consistent patterns for maintainability and type safety:

### Structure
- Import React and utilities at the top
- Use `React.forwardRef` for proper ref forwarding
- Accept `React.ComponentProps<"element">` for full HTML element support
- Destructure `className` and spread remaining props

### Styling
- Use the `cn` utility from `@/lib/utils` for class merging
- Always accept and merge `className` prop with base styles

### Example
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const MyComponent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="my-component"
      className={cn("base-styles", className)}
      {...props}
    />
  )
})

MyComponent.displayName = "MyComponent"

export { MyComponent }
```

### Exports
- Use named exports in curly braces
- Set `displayName` for better debugging
