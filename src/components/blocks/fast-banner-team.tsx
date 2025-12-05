"use client"

import { useEffect, useRef, useState } from "react"
import { LinePattern } from "@/components/blocks/line-pattern"
import { cn } from "@/lib/utils"

interface FastBannerTeamProps {
    name: string
    color: string
    className?: string
    targetContrast?: number
}

function hexToRgb(hex: string): [number, number, number] {
    const cleaned = hex.replace("#", "")
    const r = parseInt(cleaned.slice(0, 2), 16)
    const g = parseInt(cleaned.slice(2, 4), 16)
    const b = parseInt(cleaned.slice(4, 6), 16)
    return [r, g, b]
}

function oklchToRgb(l: number, c: number, h: number): [number, number, number] {
    const hRad = (h * Math.PI) / 180
    const a = c * Math.cos(hRad)
    const b = c * Math.sin(hRad)
    
    const L = l + 0.3963377774 * a + 0.2158037573 * b
    const M = l - 0.1055613458 * a - 0.0638541728 * b
    const S = l - 0.0894841775 * a - 1.2914855480 * b
    
    const l3 = L * L * L
    const m3 = M * M * M
    const s3 = S * S * S
    
    const r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3
    const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3
    const bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3
    
    const toSrgb = (x: number) => {
        if (x <= 0) return 0
        if (x >= 1) return 255
        return Math.round((x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055) * 255)
    }
    
    return [toSrgb(r), toSrgb(g), toSrgb(bl)]
}

function parseOklch(oklch: string): [number, number, number] | null {
    const match = oklch.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/)
    if (!match) return null
    return [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])]
}

function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
        const s = c / 255
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(l1: number, l2: number): number {
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)
}

function blendColors(fg: [number, number, number], bg: [number, number, number], opacity: number): [number, number, number] {
    return [
        Math.round(fg[0] * opacity + bg[0] * (1 - opacity)),
        Math.round(fg[1] * opacity + bg[1] * (1 - opacity)),
        Math.round(fg[2] * opacity + bg[2] * (1 - opacity))
    ]
}

function findOpacityForContrast(
    fgHex: string, 
    bgHex: string, 
    targetContrast: number
): number {
    const fg = hexToRgb(fgHex)
    const bg = hexToRgb(bgHex)
    const bgLuminance = getLuminance(...bg)
    
    let low = 0.05
    let high = 1.0
    
    for (let i = 0; i < 20; i++) {
        const mid = (low + high) / 2
        const blended = blendColors(fg, bg, mid)
        const blendedLuminance = getLuminance(...blended)
        const contrast = getContrastRatio(blendedLuminance, bgLuminance)
        
        if (contrast > targetContrast) {
            high = mid
        } else {
            low = mid
        }
    }
    
    return Math.round(high * 100) / 100
}

export function FastBannerTeam({ name, color, className, targetContrast = 1.4 }: FastBannerTeamProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    const [fontSize, setFontSize] = useState(48)
    const [opacity, setOpacity] = useState(1)
    const [bgColor, setBgColor] = useState("#0a0a0a")

    useEffect(() => {
        const bg = getComputedStyle(document.documentElement).getPropertyValue("--background").trim()
        if (bg.startsWith("#")) {
            setBgColor(bg)
        } else if (bg.startsWith("oklch")) {
            const parsed = parseOklch(bg)
            if (parsed) {
                const [r, g, b] = oklchToRgb(...parsed)
                setBgColor(`#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`)
            }
        }
    }, [])

    useEffect(() => {
        if (!color || !color.startsWith("#")) return
        const calculatedOpacity = findOpacityForContrast(color, bgColor, targetContrast)
        setOpacity(calculatedOpacity)
    }, [color, bgColor, targetContrast])

    useEffect(() => {
        const container = containerRef.current
        const text = textRef.current
        if (!container || !text) return

        const fit = () => {
            const containerHeight = container.clientHeight - 64
            const containerWidth = container.clientWidth - 64
            
            let size = 100
            const minSize = 16
            
            while (size > minSize) {
                text.style.fontSize = `${size}px`
                const textHeight = text.scrollHeight
                const textWidth = text.scrollWidth
                
                if (textHeight <= containerHeight && textWidth <= containerWidth) {
                    break
                }
                size -= 2
            }
            
            setFontSize(size)
        }

        fit()

        const observer = new ResizeObserver(fit)
        observer.observe(container)

        return () => observer.disconnect()
    }, [name])

    const adjustedColor = color ? `${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")}` : undefined

    return (
        <div ref={containerRef} className={cn("flex-grow self-stretch relative overflow-hidden", className)}>
            <LinePattern fill={adjustedColor} className="absolute inset-0">
                <div 
                    ref={textRef}
                    className="absolute top-8 left-8 writing-mode-vrl font-headers leading-none italic font-black text-background text-stroke-[1px] select-none uppercase"
                    style={{ 
                        WebkitTextStrokeColor: adjustedColor,
                        fontSize: `${fontSize}px`
                    }}
                >
                    {name}
                </div>
            </LinePattern>
        </div>
    )
}
