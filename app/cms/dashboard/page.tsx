import { getSession } from "@/lib/cms-auth";
import { cmsConfig } from "@/lib/cms-config";
import { DashboardCard } from "./DashboardCard";

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
          <DashboardCard title="Teksten" desc="Paginateksten, titels en beschrijvingen aanpassen" href="/cms/dashboard/teksten" accent={cmsConfig.accentColor} />
        )}
        {cmsConfig.tabs.media && (
          <DashboardCard title="Media" desc="Foto's en video's uploaden en beheren" href="/cms/dashboard/media" accent={cmsConfig.accentColor} />
        )}
        {cmsConfig.tabs.seo && (
          <DashboardCard title="SEO" desc="Paginatitel, omschrijving en trefwoorden instellen" href="/cms/dashboard/seo" accent={cmsConfig.accentColor} />
        )}
      </div>
    </div>
  );
}
