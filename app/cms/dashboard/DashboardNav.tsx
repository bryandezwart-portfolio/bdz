"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Overzicht", href: "/cms/dashboard", key: "overview", masterOnly: false },
  { label: "Teksten", href: "/cms/dashboard/teksten", key: "teksten", masterOnly: false },
  { label: "Media", href: "/cms/dashboard/media", key: "media", masterOnly: false },
  { label: "SEO", href: "/cms/dashboard/seo", key: "seo", masterOnly: false },
  { label: "Gebruikers", href: "/cms/dashboard/gebruikers", key: "gebruikers", masterOnly: true },
  { label: "Instellingen", href: "/cms/dashboard/instellingen", key: "instellingen", masterOnly: true },
];

export default function DashboardNav({ tabs, accent, role }: { tabs: { teksten: boolean; media: boolean; seo: boolean }; accent: string; role: string }) {
  const pathname = usePathname();
  const isMasterSection = (key: string) => key === "gebruikers" || key === "instellingen";
  const visible = NAV.filter((n) => {
    if (n.masterOnly) return role === "master";
    if (n.key === "overview") return true;
    return tabs[n.key as keyof typeof tabs];
  });

  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 0.75rem" }}>
      {visible.map((item, i) => {
        const active = pathname === item.href;
        const showDivider = i > 0 && isMasterSection(item.key) && !isMasterSection(visible[i - 1].key);
        return (
          <div key={item.href}>
            {showDivider && <div style={{ height: 1, background: "#222", margin: "0.5rem 0.25rem" }} />}
            <Link href={item.href} style={{ display: "block", padding: "0.6rem 1rem", borderRadius: 8, fontSize: "0.85rem", fontWeight: active ? 600 : 400, color: active ? "#fff" : "#888", background: active ? `${accent}22` : "transparent", borderLeft: active ? `3px solid ${accent}` : "3px solid transparent", textDecoration: "none", transition: "all 0.15s" }}>
              {item.label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
