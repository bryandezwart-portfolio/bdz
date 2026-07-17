import Image from "next/image";
import { site } from "@/lib/content";
import Waveform from "./Waveform";

export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src={site.logo.src}
            alt={site.logo.alt}
            width={87}
            height={36}
            className="h-5 w-auto"
          />
          <span className="text-sm text-muted">{site.footerNote}</span>
        </div>
        <div className="flex items-center gap-4">
          <Waveform />
          <span className="text-xs text-muted">
            © {new Date().getFullYear()} {site.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
