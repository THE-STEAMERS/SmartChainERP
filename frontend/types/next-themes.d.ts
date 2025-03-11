// filepath: c:\Users\joshua karthik\OneDrive\Desktop\jeev\SmartChainERP2\frontend\types\next-themes.d.ts
declare module "next-themes" {
    import * as React from "react";
  
    export interface ThemeProviderProps {
      children?: React.ReactNode;
      attribute?: string;
      defaultTheme?: string;
      enableSystem?: boolean;
      enableColorScheme?: boolean;
      forcedTheme?: string;
      storageKey?: string;
      themes?: string[];
      value?: string;
    }
  
    export class ThemeProvider extends React.Component<ThemeProviderProps> {}
  }