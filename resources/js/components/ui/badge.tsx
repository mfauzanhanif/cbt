import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-base border-2 border-border px-2.5 py-0.5 text-xs font-base whitespace-nowrap transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-main text-main-foreground shadow-xs",
        secondary: "bg-secondary-background text-foreground shadow-xs",
        neutral: "bg-secondary-background text-foreground shadow-xs",
        destructive: "bg-destructive text-white shadow-xs",
        outline: "bg-transparent text-foreground",
        ghost: "bg-transparent text-foreground hover:bg-main/20",
        link: "text-foreground underline-offset-4 hover:underline",
        success: "bg-emerald-400 text-black shadow-xs",
        warning: "bg-amber-400 text-black shadow-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
