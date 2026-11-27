import Image from "next/image";
import { getSession } from "@/lib/cms-auth";
import { redirect } from "next/navigation";
import { cmsConfig } from "@/lib/cms-config";
import BackButton from "./BackButton";
import fs from "fs";
import path from "path";

function getSiteContent() {
  try {
    const f = path.join(process.cwd(), "public", "site-content.json");
    return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch { return {}; }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/cms/login");

  const content = getSiteContent();
  const logoSrc = content.logoUrl ?? cmsConfig.logo.src;
  const siteName = content.siteName ?? cmsConfig.siteName;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "0 2rem", height: 96, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0a0a0a", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <a href="/cms/dashboard" style={{ display: "flex", alignItems: "center" }}>
            <Image src={logoSrc} alt={cmsConfig.logo.alt} width={280} height={80} style={{ objectFit: "contain" }} />
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.78rem", color: "#444" }}>CMS · {siteName}</span>
          <a href={cmsConfig.siteUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.78rem", color: "#555", textDecoration: "none" }}>
            Bekijk live →
          </a>
          <form action="/api/cms/logout" method="POST">
            <button type="submit" style={{ fontSize: "0.78rem", color: "#555", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              Uitloggen
            </button>
          </form>
        </div>
      </header>

      {/* Content */}
      <main style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
        <BackButton />
        {children}
      </main>
    </div>
  );
}
