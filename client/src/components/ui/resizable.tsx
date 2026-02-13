import { Tally1Icon } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      // className={cn(
      //   "bg-transparent focus-visible:ring-orange-500 relative 
      // flex w-px items-center justify-center 
      
      // after:absolute after:inset-y-0 after:left-1/2 
      // after:w-1 after:-translate-x-1/2 
      // focus-visible:ring-1 focus-visible:ring-offset-1 
      // focus-visible:outline-hidden 

      // aria-[orientation=horizontal]:h-px 
      // aria-[orientation=horizontal]:w-full 
      // aria-[orientation=horizontal]:after:left-0 
      // aria-[orientation=horizontal]:after:h-1 
      // aria-[orientation=horizontal]:after:w-full 
      // aria-[orientation=horizontal]:after:translate-x-0 
      // aria-[orientation=horizontal]:after:-translate-y-1/2 
      // [&[aria-orientation=horizontal]>div]:rotate-90", className
      // )}
      className={cn(
        "group relative flex items-center justify-center bg-transparent focus:outline-none",

        // Vertical default
        "w-0.5 cursor-col-resize",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2 after:bg-transparent after:transition-all",

        // Horizontal override
        "aria-[orientation=horizontal]:h-0.5",
        "aria-[orientation=horizontal]:w-full",
        "aria-[orientation=horizontal]:cursor-row-resize",
        "aria-[orientation=horizontal]:after:left-0",
        "aria-[orientation=horizontal]:after:top-1/2",
        "aria-[orientation=horizontal]:after:h-0.5",
        "aria-[orientation=horizontal]:after:w-full",
        "aria-[orientation=horizontal]:after:-translate-y-1/2",
        "aria-[orientation=horizontal]:after:translate-x-0",
        "[&[aria-orientation=horizontal]>div]:rotate-90",

        // Hover
        "hover:after:bg-blue-500",

        // Drag active
        "data-[resize-handle-state=drag]:after:bg-neutral-200",

        className
      )}

      {...props}
    >
      {withHandle && (
        <div className="bg-neutral-600 z-10 flex h-6 items-center justify-center rounded-xs">
          <Tally1Icon className="w-0.5 h-px" />
        </div>
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
