import { getSession } from "@/lib/cms-auth";
import { cmsConfig } from "@/lib/cms-config";
import { DashboardCard } from "./DashboardCard";
import fs from "fs";
import path from "path";

function getSiteContent() {
  try {
    const f = path.join(process.cwd(), "public", "site-content.json");
    return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch { return {}; }
}

export default async function DashboardPage() {
  const session = await getSession();
  const t = cmsConfig.tabs;
  const content = getSiteContent();
  const accent = content.accentColor ?? cmsConfig.accentColor;
  const siteName = content.siteName ?? cmsConfig.siteName;
  return (
    <div>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Welkom{session ? `, ${session.username}` : ""}
      </h1>
      <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "2rem" }}>
        Beheer de inhoud van <strong style={{ color: "#aaa" }}>{siteName}</strong>
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
        maxWidth: 740,
      }}>
        {t.teksten && (
          <DashboardCard title="Teksten" desc="Paginateksten, titels en beschrijvingen aanpassen" href="/cms/dashboard/teksten" accent={accent} />
        )}
        {t.media && (
          <DashboardCard title="Media" desc="Foto's en video's uploaden en beheren" href="/cms/dashboard/media" accent={accent} />
        )}
        {t.beelden && (
          <DashboardCard title="Beelden" desc="Hero video, achtergrond en profielfoto beheren" href="/cms/dashboard/beelden" accent={accent} />
        )}
        {t.seo && (
          <DashboardCard title="SEO" desc="Paginatitel, omschrijving en trefwoorden instellen" href="/cms/dashboard/seo" accent={accent} />
        )}
        {t.releases && (
          <DashboardCard title="Releases" desc="Muziekreleases en albuminfo beheren" href="/cms/dashboard/releases" accent={accent} />
        )}
        {t.socials && (
          <DashboardCard title="Socials" desc="Social media links en kanalen instellen" href="/cms/dashboard/socials" accent={accent} />
        )}
        {t.instellingen && (
          <DashboardCard title="Instellingen" desc="Logo, kleuren en site-instellingen" href="/cms/dashboard/instellingen" accent={accent} />
        )}
        {session?.role === "master" && t.gebruikers && (
          <DashboardCard title="Gebruikers" desc="Klant-accounts aanmaken en beheren" href="/cms/dashboard/gebruikers" accent={accent} />
        )}
      </div>
    </div>
  );
}
