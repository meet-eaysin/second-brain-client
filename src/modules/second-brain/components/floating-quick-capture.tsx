import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Brain } from "lucide-react";
import { QuickCapture } from "./quick-capture";
import { cn } from "@/lib/utils";

interface FloatingQuickCaptureProps {
  className?: string;
}

export function FloatingQuickCapture({ className }: FloatingQuickCaptureProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Keyboard shortcut to open quick capture
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + N to open quick capture
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "N") {
        e.preventDefault();
        // Trigger the quick capture dialog
        const button = document.querySelector(
          "[data-quick-capture-trigger]"
        ) as HTMLButtonElement;
        if (button) {
          button.click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0",
        className
      )}
    >
      <QuickCapture
        trigger={
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
            data-quick-capture-trigger
          >
            <div className="relative">
              <Plus className="h-6 w-6 transition-transform group-hover:scale-110" />
              <Brain className="h-3 w-3 absolute -top-1 -right-1 opacity-60" />
            </div>
            <span className="sr-only">Quick Capture (Cmd+Shift+N)</span>
          </Button>
        }
      />

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
          Quick Capture (⌘⇧N)
        </div>
      </div>
    </div>
  );
}
