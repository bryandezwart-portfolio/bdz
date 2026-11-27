import { getSession } from "@/lib/cms-auth";
import { redirect } from "next/navigation";
import { cmsConfig } from "@/lib/cms-config";
import Image from "next/image";
import DashboardNav from "./DashboardNav";
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
  const accent = content.accentColor ?? cmsConfig.accentColor;
  const logoSrc = content.logoUrl ?? cmsConfig.logo.src;
  const siteName = content.siteName ?? cmsConfig.siteName;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "system-ui, sans-serif", color: "#fff" }}>
      {/* Topbar */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        height: 60,
        background: "#111",
        borderBottom: "1px solid #222",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Image
            src={logoSrc}
            alt={cmsConfig.logo.alt}
            width={120}
            height={36}
            style={{ objectFit: "contain" }}
          />
          <span style={{ color: "#444", fontSize: "0.75rem" }}>CMS · {siteName}</span>
        </div>
        <form action="/api/cms/logout" method="POST">
          <button
            type="submit"
            style={{
              background: "none",
              border: "1px solid #333",
              color: "#888",
              borderRadius: 6,
              padding: "0.3rem 0.8rem",
              fontSize: "0.78rem",
              cursor: "pointer",
            }}
          >
            Uitloggen
          </button>
        </form>
      </header>

      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <aside style={{
          width: 200,
          minHeight: "calc(100vh - 60px)",
          background: "#111",
          borderRight: "1px solid #222",
          padding: "1.5rem 0",
          flexShrink: 0,
        }}>
          <DashboardNav tabs={cmsConfig.tabs} accent={accent} />
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: "2rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
