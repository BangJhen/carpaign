"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

type SelectContextType = {
  labels: Record<string, React.ReactNode>;
  registerLabel: (value: any, label: React.ReactNode) => void;
};

const SelectCustomContext = React.createContext<SelectContextType | null>(null);

const KNOWN_LABELS: Record<string, string> = {
  dealer: "Dealer",
  single_unit: "Satu Unit Kendaraan",
  multiple_units: "Beberapa Unit Kendaraan",
  footage_only: "Pengambilan Footage Saja",
  edit_only: "Editing Saja",
  footage_and_edit: "Pengambilan Footage + Editing",
  publish: "Video dipublikasikan di akun kreator",
  file: "File video diserahkan kepada dealer",
  both: "Keduanya (Distribusi & Aset Konten)",
  visit: "Kunjungan ke Dealer",
  remote: "Produksi Jarak Jauh",
  all: "Semua",
  newest: "Terbaru",
  highest_pay: "Bayaran Tertinggi",
  lowest_pay: "Bayaran Terendah",
  payment: "Pencairan Dana Saldo",
  campaign: "Masalah Submit Campaign",
  account: "Kendala Akun dan Profil",
  other: "Lainnya",
  clipping: "Clipping",
  ugc: "UGC/Review",
  videographer: "Videographer/Edit",
  "test-drive": "Test Drive",
  topup: "Top Up Saldo dan Faktur Pajak",
  review: "Verifikasi Konten dan Submisi Kreator",
  inventory: "Inventory Kendaraan Showroom",
  toyota: "Toyota",
  honda: "Honda",
  hyundai: "Hyundai",
  BCA: "BCA",
  Mandiri: "Mandiri",
  BRI: "BRI",
  BNI: "BNI",
  "CIMB Niaga": "CIMB Niaga",
  BSI: "BSI",
  GoPay: "GoPay",
  OVO: "OVO",
  DANA: "DANA",
};

function extractLabels(node: React.ReactNode, acc: Record<string, React.ReactNode> = {}) {
  React.Children.forEach(node, (child) => {
    if (!React.isValidElement(child)) return;
    const props = child.props as any;
    if (!props) return;

    if (props.value !== undefined) {
      const label = props.label !== undefined ? props.label : props.children;
      if (label !== undefined) {
        acc[props.value] = label;
        acc[String(props.value)] = label;
      }
    }

    if (props.children) {
      extractLabels(props.children, acc);
    }
  });
  return acc;
}

function Select({
  children,
  items: itemsProp,
  ...props
}: SelectPrimitive.Root.Props<any, any>) {
  const extractedLabels = React.useMemo(() => {
    const map: Record<string, React.ReactNode> = {};
    extractLabels(children, map);
    return map;
  }, [children]);

  const [dynamicLabels, setDynamicLabels] = React.useState<Record<string, React.ReactNode>>({});

  const registerLabel = React.useCallback((value: any, label: React.ReactNode) => {
    if (value != null && label != null) {
      setDynamicLabels((prev) => (prev[value] === label ? prev : { ...prev, [value]: label, [String(value)]: label }));
    }
  }, []);

  const mergedLabels = React.useMemo(() => {
    const base: Record<string, React.ReactNode> = { ...extractedLabels, ...dynamicLabels };
    if (itemsProp && !Array.isArray(itemsProp)) {
      Object.assign(base, itemsProp);
    }
    return base;
  }, [extractedLabels, dynamicLabels, itemsProp]);

  return (
    <SelectCustomContext.Provider value={{ labels: mergedLabels, registerLabel }}>
      <SelectPrimitive.Root items={mergedLabels} {...props}>
        {children}
      </SelectPrimitive.Root>
    </SelectCustomContext.Provider>
  );
}

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({ className, placeholder, children: childrenProp, ...props }: SelectPrimitive.Value.Props) {
  const ctx = React.useContext(SelectCustomContext);

  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left truncate text-white", className)}
      placeholder={placeholder}
      {...props}
    >
      {(val: any) => {
        if (val == null || val === "") return placeholder ?? null;
        if (typeof childrenProp === "function") return childrenProp(val);
        if (childrenProp != null) return childrenProp;

        const strVal = String(val);

        // 1. Check extracted/registered labels in context
        if (ctx?.labels) {
          if (ctx.labels[val] !== undefined && ctx.labels[val] !== null) return ctx.labels[val];
          if (ctx.labels[strVal] !== undefined && ctx.labels[strVal] !== null) return ctx.labels[strVal];
        }

        // 2. If val is a generic key like "all", "default", "none" and placeholder exists, use placeholder
        if (placeholder && (strVal === "all" || strVal === "default" || strVal === "none")) {
          return placeholder;
        }

        // 3. Fallback to KNOWN_LABELS
        if (typeof val === "string" && KNOWN_LABELS[val]) return KNOWN_LABELS[val];
        if (KNOWN_LABELS[strVal]) return KNOWN_LABELS[strVal];

        // 4. Fallback to placeholder if provided
        if (placeholder) return placeholder;

        return val;
      }}
    </SelectPrimitive.Value>
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent py-2.5 pr-3 pl-3.5 text-sm transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-10 data-[size=sm]:h-8 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground shrink-0" />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            "relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-[280px] max-w-[calc(100vw-2rem)] origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-xl bg-[#1a1c20] p-1.5 text-popover-foreground shadow-2xl border border-white/10 ring-1 ring-white/5 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List className="p-1 space-y-0.5">{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-xs font-semibold text-white/50", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  value,
  ...props
}: SelectPrimitive.Item.Props) {
  const ctx = React.useContext(SelectCustomContext);

  React.useEffect(() => {
    if (value != null && children != null) {
      ctx?.registerLabel(value, children);
    }
  }, [value, children, ctx]);

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      value={value}
      label={typeof children === "string" ? children : undefined}
      className={cn(
        "relative flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg py-2.5 px-3 text-sm outline-hidden select-none transition-colors hover:bg-white/10 focus:bg-white/10 focus:text-white data-highlighted:bg-white/10 data-highlighted:text-white not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex-1 text-left whitespace-normal break-words leading-snug">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none flex size-4 items-center justify-center shrink-0 text-primary" />
        }
      >
        <CheckIcon className="pointer-events-none size-4 text-primary" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon
      />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon
      />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
