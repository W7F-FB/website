import React from 'react';

import { cn } from '@/lib/utils';

interface ClipPathsProps {
  className?: string;
}

export const ClipPaths: React.FC<ClipPathsProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 5110.991 2421.331"
      width="0"
      height="0"
      className={cn('absolute h-0 w-0', className)}
    >
      <defs>
        <clipPath id="WatercolorMask" clipPathUnits="objectBoundingBox">
          <path
            d="M0,1 V0 h0.959 c0,0.021,0,0.042,0,0.062 c-0.001,0.188,-0.008,0.376,-0.023,0.561 c-0.003,0.035,-0.006,0.071,-0.009,0.106 l0.001,0.001,0.072,-0.063 c-0.001,0.019,-0.002,0.039,-0.004,0.058 c-0.006,0.082,-0.017,0.195,-0.028,0.274"
          />
        </clipPath>
        <clipPath id="WatercolorMaskDown" clipPathUnits="objectBoundingBox">
          <path
            d="M1,0 H0 s0,0.959,0,0.959 c0.021,0,0.042,0,0.062,0 c0.188,-0.001,0.376,-0.008,0.561,-0.023 c0.035,-0.003,0.071,-0.006,0.106,-0.009 l0.001,0.001,-0.063,0.072 c0.019,-0.001,0.039,-0.002,0.058,-0.004 c0.082,-0.006,0.195,-0.017,0.274,-0.028 L1,0 h0"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

// Utility function to get clip path URL
export const getClipPathUrl = (id: string) => `url(#${id})`;

// Available clip path IDs
export const CLIP_PATHS = {
  WATERCOLOR_MASK: 'WatercolorMask',
  WATERCOLOR_MASK_DOWN: 'WatercolorMaskDown',
} as const;

export type ClipPathId = typeof CLIP_PATHS[keyof typeof CLIP_PATHS];
