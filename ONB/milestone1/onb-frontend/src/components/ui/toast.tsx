"use client";

import React from "react";

type ToastVariant = "default" | "success" | "destructive";

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastInternal = Required<ToastOptions> & { id: string };

type ToastContextValue = {
  toast: (options: ToastOptions) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastInternal[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).slice(2);
    const next: ToastInternal = {
      id,
      title: options.title ?? "",
      description: options.description ?? "",
      variant: options.variant ?? "default",
      durationMs: options.durationMs ?? 3500,
    };
    setToasts((prev) => [...prev, next]);
    window.setTimeout(() => dismiss(id), next.durationMs);
  }, [dismiss]);

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function Toaster({ toasts, onDismiss }: { toasts: ToastInternal[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-sm sm:max-w-md sm:right-4 sm:left-auto sm:translate-x-0 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onClose={() => onDismiss(t.id)} />)
      )}
    </div>
  );
}

function ToastCard({ toast, onClose }: { toast: ToastInternal; onClose: () => void }) {
  const variantStyles = toast.variant === "destructive"
    ? "border-red-500/30 bg-red-500/10 text-red-200"
    : toast.variant === "success"
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
    : "border-border bg-card/80 text-foreground";

  const icon = toast.variant === "destructive"
    ? (
      <svg className="size-4" viewBox="0 0 24 24"><path fill="currentColor" d="M11 7h2v6h-2V7m0 8h2v2h-2v-2M1 21h22L12 2L1 21Z"/></svg>
    ) : toast.variant === "success" ? (
      <svg className="size-4" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
    ) : (
      <svg className="size-4" viewBox="0 0 24 24"><path fill="currentColor" d="M13 13h-2V7h2m0 8h-2v-2h2m-1-13A10 10 0 1 0 22 12 10 10 0 0 0 12 0Z"/></svg>
    );

  return (
    <div className={`animate-fade-in-up rounded-lg border p-3 sm:p-4 shadow-md backdrop-blur flex items-start gap-3 ${variantStyles}`}>
      <div className="mt-1 shrink-0 opacity-80">{icon}</div>
      <div className="flex-1 min-w-0">
        {toast.title && <div className="font-semibold text-sm leading-5">{toast.title}</div>}
        {toast.description && <div className="text-xs sm:text-sm opacity-90 mt-0.5 leading-5">{toast.description}</div>}
      </div>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
        <svg className="size-4" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
    </div>
  );
}


