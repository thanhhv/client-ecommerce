"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState } from "react";
import { useSessionRestore } from "@/lib/hooks/useAuth";
import CartSyncer from "@/components/layout/CartSyncer";

function SessionRestorer() {
  useSessionRestore();
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60 * 1000 } },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionRestorer />
      <CartSyncer />
      {children}
      <Toaster
        position="top-center"
        gap={8}
        toastOptions={{
          classNames: {
            toast:
              'rounded-2xl border shadow-lg text-sm font-medium min-w-[260px] max-w-[380px]',
            success:
              '!bg-green-50 !border-green-200 !text-green-800',
            error:
              '!bg-red-50 !border-red-200 !text-red-700',
            warning:
              '!bg-amber-50 !border-amber-200 !text-amber-800',
            info:
              '!bg-blue-50 !border-blue-200 !text-blue-800',
            icon: 'text-green-600',
          },
        }}
      />
    </QueryClientProvider>
  );
}
