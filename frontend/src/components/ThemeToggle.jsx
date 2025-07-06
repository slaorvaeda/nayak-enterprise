"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync <html> class to 'light' or 'dark'
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    if (resolvedTheme) {
      html.classList.add(resolvedTheme);
      console.log("HTML class updated to:", html.className);
    };
  }, [resolvedTheme, mounted]);

  if (!mounted) return null; // Prevent SSR mismatch

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative cursor-pointer ${
            resolvedTheme === "dark"
              ? "hover:bg-gray-800"
              : "hover:bg-gray-100"
          }`}
        >
          <Sun
            className={`h-[1.2rem] w-[1.2rem] transition-all ${
              resolvedTheme === "dark"
                ? "scale-0 rotate-90 absolute"
                : "scale-100 rotate-0"
            }`}
          />
          <Moon
            className={`h-[1.2rem] w-[1.2rem] transition-all absolute ${
              resolvedTheme === "dark"
                ? "scale-100 rotate-0"
                : "scale-0 rotate-90"
            }`}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={`mt-2 rounded-md shadow-md transition-colors duration-300 ${
          resolvedTheme === "dark"
            ? "bg-black/80 text-white"
            : "bg-white text-black"
        }`}
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
