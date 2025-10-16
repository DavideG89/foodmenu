'use client';

import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cn } from '@/lib/utils';

type ToastOptions = {
  title?: string;
  description?: string;
  duration?: number;
};

type ToastInternal = ToastOptions & { id: string };

type ToastContextValue = {
  toast: (options: ToastOptions) => void;
};

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<ToastInternal[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = React.useCallback((options: ToastOptions) => {
    const id = `toast-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev, { id, ...options }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            duration={toast.duration ?? 3000}
            onOpenChange={(open) => {
              if (!open) {
                removeToast(toast.id);
              }
            }}
            defaultOpen
            className={cn(
              'pointer-events-auto relative flex w-[320px] flex-col gap-1 rounded-xl bg-white p-4 shadow-soft ring-1 ring-black/5'
            )}
          >
            {toast.title ? (
              <ToastPrimitive.Title className="text-base font-semibold text-text">
                {toast.title}
              </ToastPrimitive.Title>
            ) : null}
            {toast.description ? (
              <ToastPrimitive.Description className="text-sm text-text/80">
                {toast.description}
              </ToastPrimitive.Description>
            ) : null}
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-24 right-4 z-[100] flex max-h-screen w-full max-w-[320px] flex-col gap-3 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
