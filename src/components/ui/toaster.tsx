import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast
          key={id}
          {...props}
          className="backdrop-blur-md bg-white/10 text-white border border-white/10 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl"
        >
          <div className="flex flex-col gap-1 px-1">
            {title && (
              <ToastTitle className="text-base font-semibold tracking-wide">
                {title}
              </ToastTitle>
            )}
            {description && (
              <ToastDescription className="text-sm opacity-90">
                {description}
              </ToastDescription>
            )}
          </div>
          {action && <div className="ml-4">{action}</div>}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
