import { getSession } from "@/lib/cms-auth";
import { cmsConfig } from "@/lib/cms-config";
import DashboardCards from "./DashboardCards";

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
      <DashboardCards tabs={cmsConfig.tabs} accent={cmsConfig.accentColor} />
    </div>
  );
}
