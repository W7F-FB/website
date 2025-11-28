import * as React from "react"
import Image from "next/image"
import { FaFacebookF, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6"

import { Logo } from "@/components/website-base/logo"
import { getPoliciesForNav } from "@/cms/queries/policies"
import { getFooterData } from "@/cms/queries/website"
import FormFooterSubscribe from "@/components/forms/form-footer-subscribe"

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
import Link from "next/link"

async function PolicyLinks() {
  const policies = await getPoliciesForNav()
  if (!policies?.length) return null
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {policies.map((p) => (
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

          <div className="flex flex-wrap gap-x-12 gap-y-16 lg:gap-x-24  mt-4">
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
              <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
                <Image
                  src="/images/decorative/visit-lauderdale.svg"
                  alt="Visit Lauderdale Logo"
                  width={100}
                  height={100}
                  style={{ height: "auto" }}
                />
                <Link href="https://www.stubhub.com/world-sevens-football-tickets/grouping/150588776?categoryPageType=Sports&isLeafCategory=True&categoryId=150588776&lat=40.736&lon=-74.006" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/images/decorative/stubhub-logo.svg"
                    alt="StubHub Logo"
                    width={100}
                    height={100}
                    style={{ height: "auto" }}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <FooterFast />

        <FooterBottom>
          <FooterCopyright>Copyright 2025 World Sevens Football</FooterCopyright>
          <PolicyLinks />
        </FooterBottom>
      </Footer>
    </div>
  )
})

FooterMain.displayName = "FooterMain"

export { FooterMain }
export { FooterMain as Footer }
