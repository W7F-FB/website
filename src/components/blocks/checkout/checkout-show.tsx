"use client"
import { TicketTypes } from "@/components/blocks/checkout/ticket-types";
import { SquadUpCheckout } from "@/components/blocks/checkout/squadupp-checkout";
import { Section } from "@/components/website-base/padding-containers";

export function CheckoutShow() {
    return (
        <Section padding="lg" id="tickets">
            <div className="grid grid-cols-1 md:grid-cols-[30rem_1fr] gap-4">
                <div className="md:sticky md:mb-26 md:top-36 md:self-start">
                    <TicketTypes />
                </div>
                <div>
                    <SquadUpCheckout />
                </div>
            </div>
        </Section>
    )
}