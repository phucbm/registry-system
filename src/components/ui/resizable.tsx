"use client";

import * as React from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { cn } from "@/lib/utils";

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof PanelGroup>) => (
    <PanelGroup className={cn("flex h-full data-[panel-group-direction=vertical]:flex-col", className)} {...props} />
);

const ResizablePanel = Panel;

const ResizableHandle = ({ withHandle, className, ...props }: React.ComponentProps<typeof PanelResizeHandle> & { withHandle?: boolean }) => (
    <PanelResizeHandle
        className={cn("relative flex w-px items-center justify-center bg-[var(--border)] after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2", className)}
        {...props}
    >
        {withHandle && (
            <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-[var(--border)] bg-[var(--accent)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/>
                </svg>
            </div>
        )}
    </PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
