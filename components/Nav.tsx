import { site } from "@/lib/content";

export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mt-4 flex items-center justify-between rounded-full glass px-5 py-3">
          <a
            href="#top"
            className="font-display font-extrabold tracking-tight text-sm"
          >
            BdZ
          </a>
          <nav className="hidden sm:flex items-center gap-7 text-sm text-muted">
            <a href="#over-mij" className="hover:text-ink transition-colors">
              Over mij
            </a>
            <a href="#radio" className="hover:text-ink transition-colors">
              Radio
            </a>
            <a href="#label" className="hover:text-ink transition-colors">
              Label
            </a>
            <a href="#volg" className="hover:text-ink transition-colors">
              Volg mij
            </a>
          </nav>
          <a
            href={site.radio.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium bg-ink text-bg rounded-full px-4 py-1.5 hover:opacity-85 transition-opacity"
          >
            Live luisteren
          </a>
        </div>
      </div>
    </header>
  );
}
