import * as React from "react"
import { cn } from "@/lib/utils"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

export function Container({ className, as: Component = "div", ...props }: ContainerProps) {
  const Comp = Component as any;
  return (
    <Comp
      className={cn("mx-auto w-full max-w-5xl px-6 lg:px-8", className)}
      {...props}
    />
  )
}
