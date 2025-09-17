import * as React from "react"
import { FaFacebookF, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6"
import { Logo } from "@/components/website-base/logo"
import { getPoliciesForNav } from "@/sanity/queries/policies"
import { getFooterData } from "@/sanity/queries/siteSettings"
import {
  Footer,
  FooterBrand,
  FooterSocialLinks,
  FooterSocialLink,
  FooterPolicyLink,
  FooterBottom,
  FooterCopyright,
} from "../../ui/footer"
import FormFooterSubscribe from "@/components/forms/form-footer-subscribe"
import { H3 } from "../typography"
import { FooterColumns } from "./footer-columns"
import { FooterFast } from "./footer-fast"

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

  const sanityConfig = {
    projectId: '439zkmb5',
    dataset: 'production',
    baseUrl: '/studio',
  }

  return (
    <div>
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
            {footerData && (
              <FooterColumns
                documentId={footerData._id}
                documentType={footerData._type}
                columns={footerData.footerColumns}
                {...sanityConfig}
              />
            )}
          </div>

          <div className="flex-grow flex justify-end">
            <div className="w-full lg:w-auto lg:flex-1 lg:max-w-[25rem] mt-4">
              <H3 className="mb-2">Keep up with us</H3>
              <p className="mb-4">Stay updated on W7F news, tickets, giveaways, merchandise and more.</p>
              <FormFooterSubscribe />
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
