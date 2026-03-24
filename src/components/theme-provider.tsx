"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Fix for type issues in some Next.js setups
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}