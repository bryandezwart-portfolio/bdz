import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

let cachedAccent: string | null = null;

export function useCmsAccent(): string {
  const [accent, setAccent] = useState<string>(cachedAccent ?? cmsConfig.accentColor);

  useEffect(() => {
    if (cachedAccent) {
      setAccent(cachedAccent);
      return;
    }
    fetch("/api/cms/save")
      .then((r) => r.json())
      .then((d) => {
        const color = d?.accentColor ?? cmsConfig.accentColor;
        cachedAccent = color;
        setAccent(color);
      })
      .catch(() => {});
  }, []);

  return accent;
}
