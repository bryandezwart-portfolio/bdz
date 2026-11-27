"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Role = "master" | "client" | "seo";

const NAV = [
  { label: "Overzicht",    href: "/cms/dashboard",                key: "overview",     roles: ["master", "client", "seo"] },
  { label: "Teksten",      href: "/cms/dashboard/teksten",        key: "teksten",      roles: ["master", "client", "seo"] },
  { label: "Beelden",      href: "/cms/dashboard/beelden",        key: "beelden",      roles: ["master", "client", "seo"] },
  { label: "SEO",          href: "/cms/dashboard/seo",            key: "seo",          roles: ["master", "seo"] },
  { label: "Socials",      href: "/cms/dashboard/socials",        key: "socials",      roles: ["master", "client"] },
  { label: "Releases",     href: "/cms/dashboard/releases",       key: "releases",     roles: ["master", "seo"] },
  { label: "Media",        href: "/cms/dashboard/media",          key: "media",        roles: ["master", "client"] },
  { label: "Gebruikers",   href: "/cms/dashboard/gebruikers",     key: "gebruikers",   roles: ["master"] },
  { label: "Instellingen", href: "/cms/dashboard/instellingen",   key: "instellingen", roles: ["master"] },
] as const;

export default function DashboardNav({
  tabs,
  accent,
  role,
}: {
  tabs: Record<string, boolean>;
  accent: string;
  role: Role;
}) {
  const pathname = usePathname();

  const visible = NAV.filter((n) => {
    // Controleer of de tab ingeschakeld is in cmsConfig
    if (n.key !== "overview" && tabs[n.key] === false) return false;
    // Controleer of de rol toegang heeft
    return (n.roles as readonly string[]).includes(role);
  });

  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 0.75rem" }}>
      {visible.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "block",
              padding: "0.6rem 1rem",
              borderRadius: 8,
              fontSize: "0.85rem",
              fontWeight: active ? 600 : 400,
              color: active ? "#fff" : "#888",
              background: active ? `${accent}22` : "transparent",
              borderLeft: active ? `3px solid ${accent}` : "3px solid transparent",
              textDecoration: "none",
              transition: "all 0.15s",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
