'use client';

import * as React from 'react';
import { motion, type Transition, type HTMLMotionProps } from 'motion/react';
import { useMeasure } from 'react-use';

import { cn } from '@/lib/utils';
import {
  MotionHighlight,
  MotionHighlightItem,
} from '@/components/ui/motion-highlight';
import { Button } from '@/components/ui/button';

// Tabs Component
type TabsContextType<T extends string> = {
  activeValue: T;
  handleValueChange: (value: T) => void;
  registerTrigger: (value: T, node: HTMLElement | null) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TabsContext = React.createContext<TabsContextType<any> | undefined>(
  undefined,
);

function useTabs<T extends string = string>(): TabsContextType<T> {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
}

type BaseTabsProps = React.ComponentProps<'div'> & {
  children: React.ReactNode;
};

type UnControlledTabsProps<T extends string = string> = BaseTabsProps & {
  defaultValue?: T;
  value?: never;
  onValueChange?: never;
};

type ControlledTabsProps<T extends string = string> = BaseTabsProps & {
  value: T;
  onValueChange?: (value: T) => void;
  defaultValue?: never;
};

type TabsProps<T extends string = string> =
  | UnControlledTabsProps<T>
  | ControlledTabsProps<T>;

function Tabs<T extends string = string>({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  ...props
}: TabsProps<T>) {
  const [activeValue, setActiveValue] = React.useState<T | undefined>(
    defaultValue ?? undefined,
  );
  const triggersRef = React.useRef(new Map<string, HTMLElement>());
  const initialSet = React.useRef(false);
  const isControlled = value !== undefined;

  React.useEffect(() => {
    if (
      !isControlled &&
      activeValue === undefined &&
      triggersRef.current.size > 0 &&
      !initialSet.current
    ) {
      const firstTab = Array.from(triggersRef.current.keys())[0];
      setActiveValue(firstTab as T);
      initialSet.current = true;
    }
  }, [activeValue, isControlled]);

  const registerTrigger = (value: string, node: HTMLElement | null) => {
    if (node) {
      triggersRef.current.set(value, node);
      if (!isControlled && activeValue === undefined && !initialSet.current) {
        setActiveValue(value as T);
        initialSet.current = true;
      }
    } else {
      triggersRef.current.delete(value);
    }
  };

  const handleValueChange = (val: T) => {
    if (!isControlled) setActiveValue(val);
    else onValueChange?.(val);
  };

  return (
    <TabsContext.Provider
      value={{
        activeValue: (value ?? activeValue)!,
        handleValueChange,
        registerTrigger,
      }}
    >
      <div
        data-slot="tabs"
        className={cn('flex flex-col gap-2', className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

type TabsListProps = React.ComponentProps<'div'> & {
  children: React.ReactNode;
  activeClassName?: string;
  transition?: Transition;
};

function TabsList({
  children,
  className,
  activeClassName,
  transition = {
    type: 'spring',
    stiffness: 500,
    damping: 40,
  },
  ...props
}: TabsListProps) {
  const { activeValue } = useTabs();

  return (
    <div className="pr-6">
      <MotionHighlight
        controlledItems
        className={cn('bg-muted', activeClassName)}
        value={activeValue}
        transition={transition}
      >
        <div
          role="tablist"
          data-slot="tabs-list"
          className={cn(
            'bg-muted/50 gap-1.5 origin-bottom-left -skew-x-[var(--skew-btn)] text-muted-foreground/75 inline-flex h-10 w-fit items-center justify-center p-1.5',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </MotionHighlight>
    </div>
  );
}

type TabsTriggerProps = React.ComponentProps<typeof Button> & {
  value: string;
  children: React.ReactNode;
};

function TabsTrigger({
  value,
  children,
  className,
  ...props
}: TabsTriggerProps) {
  const { activeValue, handleValueChange, registerTrigger } = useTabs();

  const localRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    registerTrigger(value, localRef.current);
    return () => registerTrigger(value, null);
  }, [value, registerTrigger]);

  return (
    <MotionHighlightItem value={value} className="size-full">
      <Button
        ref={localRef}
        data-slot="tabs-trigger"
        role="tab"
        onClick={() => handleValueChange(value)}
        data-state={activeValue === value ? 'active' : 'inactive'}
        className={cn(
          'size-full font-semibold text-lg hover:text-foreground data-[state=active]:text-foreground text-inherit  z-[1] bg-transparent hover:bg-muted/30 ',
          className,
        )}
        {...props}
      >
        <span className="skew-x-[var(--skew-btn)] will-change-transform [backface-visibility:hidden]">
          {children}
        </span>
      </Button>
    </MotionHighlightItem>
  );
}

type TabsContentsProps = HTMLMotionProps<'div'> & {
  children: React.ReactNode;
  transition?: Transition;
};

function TabsContents({
  children,
  className,
  transition = {
    type: 'spring',
    stiffness: 500,
    damping: 40,
  },
  ...props
}: TabsContentsProps) {
  const [contentRef, { height }] = useMeasure<HTMLDivElement>();

  return (
    <motion.div
      data-slot="tabs-contents"
      className={cn('relative overflow-hidden', className)}
      animate={{ height: height || 'auto' }}
      transition={transition}
      {...props}
    >
      <div ref={contentRef} className="relative">
        {children}
      </div>
    </motion.div>
  );
}

type TabsContentProps = HTMLMotionProps<'div'> & {
  value: string;
  children: React.ReactNode;
};

function TabsContent({
  children,
  value,
  className,
  ...props
}: TabsContentProps) {
  const { activeValue } = useTabs();
  const isActive = activeValue === value;
  return (
    <motion.div
      role="tabpanel"
      data-slot="tabs-content"
      className={cn(className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      style={{
        pointerEvents: isActive ? 'auto' : 'none',
        position: isActive ? 'relative' : 'absolute',
        inset: isActive ? undefined : 0
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContents,
  TabsContent,
  useTabs,
  type TabsContextType,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentsProps,
  type TabsContentProps,
};