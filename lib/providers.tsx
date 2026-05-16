"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState } from "react";
import { useSessionRestore } from "@/lib/hooks/useAuth";

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
      {children}
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
