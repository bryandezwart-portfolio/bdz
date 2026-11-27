import { getSession } from "@/lib/cms-auth";
import { cmsConfig } from "@/lib/cms-config";
import { DashboardCard } from "./DashboardCard";

export default async function DashboardPage() {
  const session = await getSession();
  const t = cmsConfig.tabs;

  return (
    <div>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Welkom{session ? `, ${session.username}` : ""}
      </h1>
      <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "2rem" }}>
        Beheer de inhoud van <strong style={{ color: "#aaa" }}>{cmsConfig.siteName}</strong>
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {t.teksten && (
          <DashboardCard title="Teksten" desc="Paginateksten, titels en beschrijvingen aanpassen" href="/cms/dashboard/teksten" accent={cmsConfig.accentColor} />
        )}
        {t.media && (
          <DashboardCard title="Media" desc="Foto's en video's uploaden en beheren" href="/cms/dashboard/media" accent={cmsConfig.accentColor} />
        )}
        {t.beelden && (
          <DashboardCard title="Beelden" desc="Hero video, achtergrond en profielfoto beheren" href="/cms/dashboard/beelden" accent={cmsConfig.accentColor} />
        )}
        {t.seo && (
          <DashboardCard title="SEO" desc="Paginatitel, omschrijving en trefwoorden instellen" href="/cms/dashboard/seo" accent={cmsConfig.accentColor} />
        )}
        {t.releases && (
          <DashboardCard title="Releases" desc="Muziekreleases en albuminfo beheren" href="/cms/dashboard/releases" accent={cmsConfig.accentColor} />
        )}
        {t.socials && (
          <DashboardCard title="Socials" desc="Social media links en kanalen instellen" href="/cms/dashboard/socials" accent={cmsConfig.accentColor} />
        )}
        {t.instellingen && (
          <DashboardCard title="Instellingen" desc="Logo, kleuren en site-instellingen" href="/cms/dashboard/instellingen" accent={cmsConfig.accentColor} />
        )}
        {session?.role === "master" && t.gebruikers && (
          <DashboardCard title="Gebruikers" desc="Klant-accounts aanmaken en beheren" href="/cms/dashboard/gebruikers" accent={cmsConfig.accentColor} />
        )}
      </div>
    </div>
  );
}
