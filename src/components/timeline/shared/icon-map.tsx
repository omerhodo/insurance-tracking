import {
  Truck,
  FolderOpen,
  ClipboardList,
  ShieldCheck,
  Calculator,
  Banknote,
  FileText,
  HelpCircle,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

/** Maps the icon slug strings from mock data to Lucide components. */
const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  truck: Truck,
  "folder-open": FolderOpen,
  "clipboard-list": ClipboardList,
  "shield-check": ShieldCheck,
  calculator: Calculator,
  banknote: Banknote,
  "file-text": FileText,
};

interface NodeIconProps extends LucideProps {
  slug: string;
}

/** Resolves an icon slug to its Lucide component. Falls back to HelpCircle. */
export function NodeIcon({ slug, ...props }: NodeIconProps) {
  const Icon = ICON_MAP[slug] ?? HelpCircle;
  return <Icon {...props} />;
}
