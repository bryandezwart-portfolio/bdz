import { getSession } from "@/lib/cms-auth";
import { cmsConfig } from "@/lib/cms-config";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Welkom{session ? `, ${session.username}` : ""}
      </h1>
      <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "2rem" }}>
        Beheer de inhoud van <strong style={{ color: "#aaa" }}>{cmsConfig.siteName}</strong>
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {cmsConfig.tabs.teksten && (
          <Card title="Teksten" desc="Paginateksten, titels en beschrijvingen aanpassen" href="/cms/dashboard/teksten" accent={cmsConfig.accentColor} />
        )}
        {cmsConfig.tabs.media && (
          <Card title="Media" desc="Foto's en video's uploaden en beheren" href="/cms/dashboard/media" accent={cmsConfig.accentColor} />
        )}
        {cmsConfig.tabs.seo && (
          <Card title="SEO" desc="Paginatitel, omschrijving en trefwoorden instellen" href="/cms/dashboard/seo" accent={cmsConfig.accentColor} />
        )}
      </div>
    </div>
  );
}

function Card({ title, desc, href, accent }: { title: string; desc: string; href: string; accent: string }) {
  return (
    <a
      href={href}
      style={{
        display: "block",
        width: 220,
        padding: "1.5rem",
        background: "#111",
        border: "1px solid #222",
        borderRadius: 12,
        textDecoration: "none",
        color: "inherit",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = accent)}
      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "#222")}
    >
      <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.4rem" }}>{title}</h2>
      <p style={{ fontSize: "0.78rem", color: "#666", lineHeight: 1.5, margin: 0 }}>{desc}</p>
    </a>
  );
}
