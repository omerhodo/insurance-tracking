"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  if (!mounted) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/40 bg-card/60 hover:bg-muted/60 transition-colors text-xs font-semibold",
          open && "bg-muted/80 ring-2 ring-primary/20"
        )}
      >
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        {i18n.language.toLocaleUpperCase()}
      </PopoverTrigger>
      <PopoverContent className="w-32 p-1" align="end" sideOffset={8}>
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeLanguage("tr")}
            className={cn(
              "justify-start font-medium",
              i18n.language === "tr" && "bg-primary/10 text-primary"
            )}
          >
            🇹🇷 Türkçe
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeLanguage("en")}
            className={cn(
              "justify-start font-medium",
              i18n.language === "en" && "bg-primary/10 text-primary"
            )}
          >
            🇬🇧 English
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
