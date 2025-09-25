"use client"

import * as React from "react"
import * as Select from "@radix-ui/react-select"
import { ChevronDown, ChevronUp, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function TopicSelect({
  value,
  onValueChange,
}: { value: string; onValueChange: (val: string) => void }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Select.Root
      value={value}
      onValueChange={onValueChange}
      open={open}
      onOpenChange={setOpen}
    >
      <Select.Trigger
        className={cn(
          "flex w-full items-center justify-between border-b border-white py-3 px-3 text-white text-sm uppercase font-bold focus:outline-none"
        )}
      >
        <Select.Value placeholder="Select an option" />
        <Select.Icon>
          {open ? (
            <ChevronUp className="h-5 w-5 text-white" />
          ) : (
            <ChevronDown className="h-5 w-5 text-white" />
          )}
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="z-50 mt-2 w-[var(--radix-select-trigger-width)] rounded-md border border-[#fff3]} bg-[oklch(0.145_0_0)] shadow-lg"
          position="popper"
        >
          <Select.ScrollUpButton className="flex items-center justify-center py-2 text-white">
            <ChevronUp className="h-4 w-4" />
          </Select.ScrollUpButton>

          <Select.Viewport className="p-2">
            {[
              { value: "career", label: "I want to learn about career opportunities" },
              { value: "tickets", label: "I have questions regarding tickets" },
              { value: "media", label: "I have a media inquiry" },
              { value: "club", label: "I want to participate with my club" },
              { value: "partnership", label: "I want to discuss a partnership" },
              { value: "vip", label: "I want to learn about VIP experiences" },
              { value: "other", label: "Something else" },
            ].map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded px-3 py-2 text-sm text-white",
                  "hover:bg-[oklch(0.18_0_0)]",
                  "focus:outline-none focus:ring-0"
                )}
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check className="h-4 w-4 text-white" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>

          <Select.ScrollDownButton className="flex items-center justify-center py-2 text-white">
            <ChevronDown className="h-4 w-4" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
