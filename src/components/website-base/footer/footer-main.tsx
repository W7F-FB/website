import * as React from "react"
import { FaFacebookF, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6"
import { Logo } from "@/components/website-base/logo"
import { getPoliciesForNav } from "@/sanity/queries/policies"
import {
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
} from "./footer"
import FormFooterSubscribe from "@/components/forms/form-footer-subscribe"

async function PolicyLinks() {
  const policies = await getPoliciesForNav()
  if (!policies?.length) return null
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {policies.map((p) => (
        <FooterPolicyLink
          key={p.slug}
          href={p.pdfUrl || `/info/${p.slug}`}
          isPdf={!!p.pdfUrl}
        >
          {p.name}
        </FooterPolicyLink>
      ))}
    </div>
  )
}

const FooterMain = React.forwardRef<HTMLElement, React.ComponentProps<"footer">>(({ className, ...props }, ref) => {
  return (
    <Footer ref={ref} className={className} {...props}>
      <FooterBrand>
        <Logo className="w-full h-auto" color="white" variant="2-lines" />
        <FooterSocialLinks>
          <FooterSocialLink 
            href="https://www.facebook.com/profile.php?id=61574253312771"
            icon={FaFacebookF}
            label="Follow us on Facebook"
          />
          <FooterSocialLink 
            href="https://www.instagram.com/worldsevens_/"
            icon={FaInstagram}
            label="Follow us on Instagram"
          />
          <FooterSocialLink 
            href="https://x.com/worldsevens_"
            icon={FaXTwitter}
            label="Follow us on X"
          />
          <FooterSocialLink 
            href="https://www.tiktok.com/@worldsevens"
            icon={FaTiktok}
            label="Follow us on TikTok"
          />
        </FooterSocialLinks>
      </FooterBrand>
      
      <FooterColumn>
        <FooterListHeading>Events & Tickets</FooterListHeading>
        <FooterList>
          <FooterLink href="/">Fort Lauderdale, FL</FooterLink>
          <FooterLink href="/">Estoril, Portugal</FooterLink>
        </FooterList>
      </FooterColumn>
      
      <FooterColumn className="col-span-2">
        <FooterListHeading>Company</FooterListHeading>
        <FooterList>
          <FooterLink href="/">Shop</FooterLink>
          <FooterLink href="/">Who We Are</FooterLink>
          <FooterLink href="/">News</FooterLink>
          <FooterLink href="/">FAQs</FooterLink>
          <FooterLink href="/">Contact</FooterLink>
        </FooterList>
      </FooterColumn>

      <FooterColumn className="col-span-4">
        <FormFooterSubscribe />
      </FooterColumn>
      
      <FooterBottom>
        <FooterCopyright>Copyright 2025 World Sevens Football</FooterCopyright>
        <PolicyLinks />
      </FooterBottom>
    </Footer>
  )
})

FooterMain.displayName = "FooterMain"

export { FooterMain }
export { FooterMain as Footer }
