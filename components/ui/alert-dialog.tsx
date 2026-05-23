"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"

function AlertDialog({ ...props }: Dialog.Root.Props) {
  return <Dialog.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogContent({
  className,
  children,
  ...props
}: Dialog.Popup.Props) {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop
        className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0"
      />
      <Dialog.Popup
        data-slot="alert-dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lg transition-all duration-150 data-ending-style:opacity-0 data-ending-style:scale-95 data-starting-style:opacity-0 data-starting-style:scale-95",
          className
        )}
        {...props}
      >
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  )
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 mb-4", className)}
      {...props}
    />
  )
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6", className)}
      {...props}
    />
  )
}

function AlertDialogTitle({ className, ...props }: Dialog.Title.Props) {
  return (
    <Dialog.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold text-plant-text", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({ className, ...props }: Dialog.Description.Props) {
  return (
    <Dialog.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-plant-muted", className)}
      {...props}
    />
  )
}

function AlertDialogCancel({ className, children, ...props }: React.ComponentProps<"button">) {
  return (
    <Dialog.Close
      render={
        <button
          data-slot="alert-dialog-cancel"
          className={cn(
            "px-4 py-2.5 rounded-xl border border-plant-border text-plant-text text-sm font-medium hover:bg-plant-surface transition-colors",
            className
          )}
          {...props}
        >
          {children}
        </button>
      }
    />
  )
}

function AlertDialogAction({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="alert-dialog-action"
      className={cn(
        "px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
        className
      )}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
}
