"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { label: "Overzicht",    href: "/cms/dashboard",             key: "overview",     masterOnly: false },
  { label: "Teksten",      href: "/cms/dashboard/teksten",     key: "teksten",      masterOnly: false },
  { label: "Media",        href: "/cms/dashboard/media",       key: "media",        masterOnly: false },
  { label: "SEO",          href: "/cms/dashboard/seo",         key: "seo",          masterOnly: false },
  { label: "Socials",      href: "/cms/dashboard/socials",     key: "socials",      masterOnly: false },
  { label: "Gebruikers",   href: "/cms/dashboard/gebruikers",  key: "gebruikers",   masterOnly: true  },
  { label: "Instellingen", href: "/cms/dashboard/instellingen",key: "instellingen", masterOnly: true  },
];

interface DashboardNavProps {
  role: "master" | "client";
  allowedTabs?: string[];
}

export default function DashboardNav({ role, allowedTabs }: DashboardNavProps) {
  const pathname = usePathname();

  const visible = NAV.filter((item) => {
    if (item.masterOnly && role !== "master") return false;
    if (role !== "master" && allowedTabs && !allowedTabs.includes(item.key) && item.key !== "overview") return false;
    return true;
  });

  return (
    <nav style={{
      display: "flex",
      gap: "0.25rem",
      flexWrap: "wrap",
      marginBottom: "2rem",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      paddingBottom: "0.75rem",
    }}>
      {visible.map((item) => {
        const active = pathname === item.href || (item.href !== "/cms/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.key}
            href={item.href}
            style={{
              padding: "0.4rem 0.9rem",
              borderRadius: "6px",
              fontSize: "0.8rem",
              letterSpacing: "0.06em",
              textDecoration: "none",
              background: active ? "rgba(156,163,175,0.15)" : "transparent",
              color: active ? "#9ca3af" : "rgba(240,240,240,0.5)",
              border: active ? "1px solid rgba(156,163,175,0.3)" : "1px solid transparent",
              transition: "all 0.15s ease",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
