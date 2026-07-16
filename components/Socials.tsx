import { site } from "@/lib/content";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "./icons";

const iconMap = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
};

export default function Socials() {
  return (
    <section id="volg" className="py-24 sm:py-32 border-t border-line">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-xs uppercase tracking-[0.18em] text-muted mb-10">
          Volg mij
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          {site.socials.map((s) => {
            const Icon = iconMap[s.icon as keyof typeof iconMap];
            const disabled = !s.url;
            return (
              <a
                key={s.label}
                href={disabled ? undefined : s.url}
                target={disabled ? undefined : "_blank"}
                rel={disabled ? undefined : "noopener noreferrer"}
                aria-disabled={disabled}
                tabIndex={disabled ? -1 : 0}
                className={`flex items-center gap-4 rounded-2xl glass px-6 py-5 transition-colors ${
                  disabled
                    ? "opacity-40 pointer-events-none"
                    : "hover:bg-white/[0.05]"
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold truncate">
                    {s.label}
                  </span>
                  <span className="block text-sm text-muted truncate">
                    {s.handle}
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
