import * as React from "react"
import { FaFacebookF, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/website-base/logo"
import { getPoliciesForNav } from "@/cms/queries/policies"
import { getFooterData } from "@/cms/queries/website"
import { getVisibleSponsors } from "@/cms/queries/sponsors"
import FormFooterSubscribe from "@/components/forms/form-footer-subscribe"
import { SponsorLogo } from "@/components/blocks/sponsor-logo"

import {
  Footer,
  FooterBrand,
  FooterSocialLinks,
  FooterSocialLink,
  FooterPolicyLink,
  FooterBottom,
  FooterCopyright,
} from "../../ui/footer"
import { H3 } from "../typography"

import { FooterColumns } from "./footer-columns"
import { FooterFast } from "./footer-fast"
import { PrivacyChoicesButton } from "./privacy-choices-button"

async function PolicyLinks() {
  const policies = await getPoliciesForNav()
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {policies?.map((p) => (
        <FooterPolicyLink
          key={p.slug}
          href={p.pdfUrl || `/resources/${p.slug}`}
          isPdf={!!p.pdfUrl}
        >
          {p.name}
        </FooterPolicyLink>
      ))}
    </div>
  )
}

const FooterMain = React.forwardRef<HTMLElement, React.ComponentProps<"footer">>(async ({ className, ...props }, ref) => {
  const footerData = await getFooterData()
  const sponsors = await getVisibleSponsors()

  return (
    <div className="mt-24">
      <Footer ref={ref} className={className} {...props}>
        <div className="flex flex-wrap gap-x-12 gap-y-16 lg:gap-x-16">
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

          <div className="flex flex-col md:flex-row flex-wrap gap-x-12 gap-y-16 lg:gap-x-24 mt-4">
            {footerData?.footerMenus && (
              <FooterColumns
                columns={footerData.footerMenus}
              />
            )}
          </div>

          <div className="flex-grow flex justify-end">
            <div className="w-full lg:w-auto lg:flex-1 lg:max-w-[25rem] mt-4">
              <H3 className="mb-2">Keep up with us</H3>
              <p className="mb-4 text-muted-foreground">Stay updated on W7F news, tickets, giveaways, merchandise and more.</p>
              <FormFooterSubscribe />
            </div>
          </div>
        </div>

        <div className={cn("flex flex-wrap items-center gap-10 border-y border-border/50 py-8 mt-14", sponsors.length <= 3 ? "justify-end" : "justify-around")}>
          {sponsors.map((sponsor) => (
            <SponsorLogo
              key={sponsor.id}
              sponsor={sponsor}
            />
          ))}
        </div>

        <FooterFast />
        <PrivacyChoicesButton />
        <FooterBottom>
          <FooterCopyright>Copyright 2025 World Sevens Football</FooterCopyright>
          <div className="flex flex-wrap items-center gap-6">
            <PolicyLinks />
          </div>
        </FooterBottom>
      </Footer>
    </div>
  )
})

FooterMain.displayName = "FooterMain"

export { FooterMain }
export { FooterMain as Footer }
