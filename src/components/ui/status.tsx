import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type StatusProps = HTMLAttributes<HTMLDivElement>;

export const Status = forwardRef<HTMLDivElement, StatusProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center gap-2 rounded-none px-2.5 py-0.5 text-xs font-semibold font-headers uppercase border border-border bg-muted/50',
        className
      )}
      {...props}
    />
  )
);
Status.displayName = 'Status';

export type StatusIndicatorProps = HTMLAttributes<HTMLSpanElement>;

export const StatusIndicator = ({
  className,
  ...props
}: StatusIndicatorProps) => (
  <span className={cn('relative flex size-2', className)} {...props}>
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
    <span className="relative inline-flex size-full rounded-full bg-current" />
  </span>
);
