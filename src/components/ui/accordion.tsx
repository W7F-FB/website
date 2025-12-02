"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"

import { cn } from "@/lib/utils"
import { CaretRightIcon } from "@/components/website-base/icons"
import { Separator } from "@/components/ui/separator"
import { LinePattern } from "../blocks/line-pattern"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <div>
      <AccordionPrimitive.Item
        data-slot="accordion-item"
        className={cn("hover:bg-primary/1 data-[state=open]:bg-primary/1", className)}
        {...props}
      />
      <Separator variant="gradient" gradientDirection="toRight" />
    </div>
  )
}

function AccordionTrigger({
  className,
  children,
  plusMinus,
  bgLines,
  iconClass,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  plusMinus?: boolean
  bgLines?: boolean
  iconClass?: string
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group relative md:text-xl text-base px-4 cursor-pointer relative focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-6 font-headers text-left font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          plusMinus ? "[&[data-state=open]_.vertical-bar]:rotate-90" : "[&[data-state=open]>svg]:rotate-[270deg]",
          className
        )}
        {...props}
      >
        {bgLines && (
          <div className="bg-background absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <LinePattern patternSize={5} className="group-hover:bg-muted/10 absolute top-0 left-0 h-[100vh] w-[100vh]" />
            <Separator variant="gradient" gradientDirection="toRight" className="!w-0 group-[&[data-state=open]]:!w-full transition-[width] duration-300 absolute bottom-0" />
          </div>
        )}
        <div className="relative z-10">
          {children}
        </div>
        {plusMinus ? (
          <div className={cn("relative size-4 shrink-0  pointer-events-none", iconClass)}>
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-muted-foreground -translate-y-1/2" />
            <div className="vertical-bar absolute left-1/2 top-0 h-full w-[2px] bg-muted-foreground -translate-x-1/2 transition-transform duration-200" />
          </div>
        ) : (
          <CaretRightIcon className={cn("text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200 rotate-90", iconClass)} />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-base"
      {...props}
    >
      <div className={cn("pt-0 px-8 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
