import * as React from "react"
import Link from "next/link"
import { IconType } from "react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PaddingGlobal } from "@/components/website-base/padding-containers"
import { H4 } from "@/components/website-base/typography"

const Footer = React.forwardRef<HTMLElement, React.ComponentProps<"footer">>(({ className, children, ...props }, ref) => {
  return (
    <footer ref={ref} className={cn("bg-muted/50 pt-16", className)} {...props}>
      <PaddingGlobal>
        {children}
      </PaddingGlobal>
    </footer>
  )
})

Footer.displayName = "Footer"

function FooterBrand({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("w-full  lg:max-w-xs lg:mr-24", className)} {...props}>
      {children}
    </div>
  )
}

function FooterSocialLinks({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex gap-2 mt-6", className)} {...props}>
      {children}
    </div>
  )
}

function FooterColumn({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}

function FooterLinkList({
  className,
  children,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav className={cn("mt-6 justify-self-start", className)} {...props}>
      {children}
    </nav>
  )
}

function FooterList({
  className,
  children,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul className={cn("flex flex-col gap-2", className)} {...props}>
      {children}
    </ul>
  )
}

function FooterBottom({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("w-full flex flex-wrap justify-between gap-4 py-8 border-t border-border/50", className)} {...props}>
      {children}
    </div>
  )
}

function FooterCopyright({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground/50", className)} {...props}>
      {children}
    </p>
  )
}

function FooterListHeading({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <H4 className={cn("mb-4 whitespace-nowrap", className)} {...props}>
      {children}
    </H4>
  )
}

function FooterLink({ 
  href, 
  children,
  className,
  ...props
}: { 
  href: string; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <li>
      <Button 
        asChild 
        variant="link" 
        className={cn(
          "font-body font-normal text-lg group/footer-link text-primary hover:no-underline text-muted-foreground hover:text-foreground justify-start p-0 h-auto",
          className
        )}
        {...props}
      >
        <Link href={href} className="relative">
          <div className="pointer-events-none absolute -skew-x-30 bottom-[12%] h-[1.5px] w-0 group-hover/footer-link:w-full transition-width ease-in-out-cubic duration-150 bg-current origin-left"></div>
          <div className="relative">{children}</div>
        </Link>
      </Button>
    </li>
  )
}

function FooterSocialLink({ 
  href, 
  icon: Icon,
  label,
  className,
  ...props
}: { 
  href: string; 
  icon: IconType;
  label: string;
  className?: string;
}) {
  return (
    <Button 
      asChild 
      variant="ghost" 
      size="icon"
      className={cn("w-12 h-12 text-white hover:text-primary hover:bg-transparent", className)}
      {...props}
    >
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label={label}
      >
        <Icon className="!w-6 !h-6" />
      </a>
    </Button>
  )
}

function FooterPolicyLink({ 
  href, 
  children, 
  isPdf = false,
  className,
  ...props
}: { 
  href: string; 
  children: React.ReactNode;
  isPdf?: boolean;
  className?: string;
}) {
  const linkClass = cn("text-sm text-muted-foreground/50 hover:text-muted-foreground", className)
  
  if (isPdf) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className={linkClass}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={linkClass} {...props}>
      {children}
    </Link>
  )
}

export {
  Footer,
  FooterBrand,
  FooterSocialLinks,
  FooterColumn,
  FooterLinkList,
  FooterList,
  FooterListHeading,
  FooterLink,
  FooterSocialLink,
  FooterPolicyLink,
  FooterBottom,
  FooterCopyright,
}
