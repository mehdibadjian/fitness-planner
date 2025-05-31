"use client"

import { useState } from "react"

interface ToastProps {
  title: string
  description: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    const id = Date.now()
    setToasts((prev) => [...prev, props])

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((_, i) => i !== 0))
    }, 3000)

    return id
  }

  const Toaster = () => {
    if (toasts.length === 0) return null

    return (
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t, i) => (
          <div
            key={i}
            className={`p-4 rounded-md shadow-md animate-in slide-in-from-right ${
              t.variant === "destructive" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
          >
            <div className="font-medium">{t.title}</div>
            <div className="text-sm">{t.description}</div>
          </div>
        ))}
      </div>
    )
  }

  return { toast, Toaster }
}
