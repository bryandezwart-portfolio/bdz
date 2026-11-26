import { getSession } from "@/lib/cms-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cmsConfig } from "@/lib/cms-config";

const CARDS = [
  { emoji: "✏️",  title: "Teksten",      sub: "Alle paginateksten",    href: "/cms/dashboard/teksten",      masterOnly: false },
  { emoji: "🖼️", title: "Media",        sub: "Foto's & video's",       href: "/cms/dashboard/media",        masterOnly: false },
  { emoji: "🎨",  title: "Beelden",      sub: "Video & achtergrond",        href: "/cms/dashboard/beelden",      masterOnly: false },
  { emoji: "🔍",  title: "SEO",          sub: "Per pagina",             href: "/cms/dashboard/seo",          masterOnly: false },
  { emoji: "🎵",  title: "Releases",     sub: "Singles & shows",        href: "/cms/dashboard/releases",     masterOnly: false },
  { emoji: "💬",  title: "Socials",      sub: "Links & handles",        href: "/cms/dashboard/socials",      masterOnly: false },
  { emoji: "⚙️", title: "Instellingen", sub: "Logo, footer & Spotify", href: "/cms/dashboard/instellingen", masterOnly: true  },
  { emoji: "👥",  title: "Gebruikers",   sub: "Toegang beheren",        href: "/cms/dashboard/gebruikers",   masterOnly: true  },
];

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/cms/login");

  const visible = CARDS.filter((c) => !c.masterOnly || session.role === "master");
  const accent = cmsConfig.accentColor;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.3rem" }}>Dashboard</h1>
      <p style={{ color: "#555", fontSize: "0.85rem", marginBottom: "2rem" }}>
        Welkom terug, {session.role === "master" ? "Bryan" : "gebruiker"}. Wat wil je aanpassen?
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {visible.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{ display: "block", background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "1.4rem 1.25rem", textDecoration: "none", color: "#fff" }}
          >
            <div style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>{card.emoji}</div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.2rem" }}>{card.title}</div>
            <div style={{ color: "#555", fontSize: "0.78rem" }}>{card.sub}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "1rem 1.5rem" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.15rem" }}>Jouw website</div>
          <div style={{ color: "#555", fontSize: "0.78rem" }}>bryandezwart.nl</div>
        </div>
        <a href="https://bryandezwart.nl" target="_blank" rel="noopener noreferrer" style={{ background: accent, color: "#fff", borderRadius: 8, padding: "0.5rem 1.1rem", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
          Bekijk live →
        </a>
      </div>
    </div>
  );
}
