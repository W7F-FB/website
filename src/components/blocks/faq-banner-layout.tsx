'use client';

import { useEffect, useRef } from 'react';
import { useMeasure } from 'react-use';
import { W7FLineBanner } from '@/components/blocks/W7F-line-banner';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImageItem {
    url: string;
    altText: string;
}

interface FAQBannerLayoutProps {
    bannerClassName?: string;
    children: React.ReactNode;
    images?: ImageItem[];
}

export function FAQBannerLayout({ bannerClassName, children, images }: FAQBannerLayoutProps) {
    const [faqRef, { height: faqHeight }] = useMeasure<HTMLDivElement>();
    const initialHeightRef = useRef<number | null>(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        if (!isMobile && faqHeight && initialHeightRef.current === null) {
            initialHeightRef.current = faqHeight;
        }
    }, [faqHeight, isMobile]);

    const bannerHeight = !isMobile && initialHeightRef.current ? initialHeightRef.current : null;

    return (
        <div className="grid grid-cols-12 gap-8">
            <div
                className={cn("col-span-4", bannerClassName)}
                style={bannerHeight ? { height: `${bannerHeight}px` } : undefined}
            >
                <W7FLineBanner className="w-full h-full overflow-hidden p-12" images={images} />
            </div>
            <div ref={faqRef} className="col-span-8">
                {children}
            </div>
        </div>
    );
}

