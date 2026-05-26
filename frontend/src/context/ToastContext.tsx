import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { CheckCircle2, Info, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastTone = "success" | "error" | "info"

type Toast = {
  id: string
  title: string
  description?: string
  tone: ToastTone
}

type ToastContextValue = {
  toast: (toast: Omit<Toast, "id">) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((nextToast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { ...nextToast, id }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id))
    }, 3800)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((item) => {
          const Icon = icons[item.tone]

          return (
            <div
              key={item.id}
              className={cn(
                "glass-panel animate-in fade-in slide-in-from-top-2 rounded-lg p-4",
                item.tone === "error" && "border-red-400/30",
                item.tone === "success" && "border-emerald-400/30"
              )}
            >
              <div className="flex gap-3">
                <Icon className="mt-0.5 size-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider")
  }

  return context
}
