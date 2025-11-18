"use client";

import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}
