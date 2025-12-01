"use client"
import { TicketTypes } from "@/components/blocks/checkout/ticket-types";
import { SquadUpCheckout } from "@/components/blocks/checkout/squadupp-checkout";
import { Section } from "@/components/website-base/padding-containers";

export function CheckoutShow() {
    return (
        <Section padding="lg">
            <div className="grid grid-cols-[30rem_1fr] gap-4">
                <div className="sticky mb-26 top-36 self-start">
                    <TicketTypes />
                </div>
                <div>
                    <SquadUpCheckout />
                </div>
            </div>
        </Section>
    )
}