"use client";

import { Plus, StickyNote, Paperclip } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useClaimStore } from "@/store/use-claim-store";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  afterStepId: string;
}

export function AddDynamicNodeButton({ afterStepId }: Props) {
  const [open, setOpen] = useState(false);
  const addDynamicNode = useClaimStore((s) => s.addDynamicNode);

  const handleAdd = (kind: "NOTE" | "ATTACHMENT") => {
    if (kind === "NOTE") {
      addDynamicNode(afterStepId, {
        id: crypto.randomUUID(),
        kind: "NOTE",
        author: "Müşteri Temsilcisi", // mockup
        createdAt: new Date().toISOString(),
        content: "Sisteme yeni bir ara not eklendi. Sigortalı ile görüşüldü.",
      });
    } else {
      addDynamicNode(afterStepId, {
        id: crypto.randomUUID(),
        kind: "ATTACHMENT",
        author: "Müşteri Temsilcisi", // mockup
        createdAt: new Date().toISOString(),
        fileName: "ek-tutanak.pdf",
        fileType: "application/pdf",
        fileSize: 1024 * 1024 * 2.4,
      });
    }
    setOpen(false);
  };

  return (
    <div className="relative flex justify-start ml-5 mb-2 h-6 z-10 group/adder opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
      <Popover open={open} onOpenChange={setOpen}>
        {/*
         * Base UI PopoverTrigger renders its own <button> element.
         * Positioned to sit perfectly on top of the vertical connector line.
         */}
        <PopoverTrigger
          id={`add-dynamic-node-${afterStepId}`}
          aria-label="Araya not/ekle"
          className={cn(
            "flex items-center justify-center h-6 w-6 rounded-full cursor-pointer",
            "bg-background border border-primary/40 text-primary shadow-sm",
            "hover:bg-primary/10 hover:border-primary/60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            "absolute -left-3 top-0",
            open && "bg-primary text-primary-foreground border-primary hover:bg-primary hover:text-primary-foreground"
          )}
        >
          <Plus className="h-3.5 w-3.5" />
        </PopoverTrigger>

        <PopoverContent
          className="w-48 p-1 border-primary/20 shadow-xl"
          align="start"
          side="right"
          sideOffset={12}
        >
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="justify-start gap-2 h-9 px-3 text-xs font-medium"
              onClick={() => handleAdd("NOTE")}
            >
              <StickyNote className="h-3.5 w-3.5 text-blue-400" /> Not Ekle
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-2 h-9 px-3 text-xs font-medium"
              onClick={() => handleAdd("ATTACHMENT")}
            >
              <Paperclip className="h-3.5 w-3.5 text-purple-400" /> Ek Ekle
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
