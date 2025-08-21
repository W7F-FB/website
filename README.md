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

## Content Management

- **Studio**: Located in `studio-website/` directory
- **Frontend**: Next.js application in the main directory

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
- Include `data-slot` attribute for component identification

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
