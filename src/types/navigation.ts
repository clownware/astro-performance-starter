// src/types/navigation.ts
export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
  icon?: string;
  order?: number;
}
