import Image from "next/image";
import { getSession } from "@/lib/cms-auth";
import { redirect } from "next/navigation";
import { cmsConfig } from "@/lib/cms-config";
import BackButton from "./BackButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/cms/login");

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "0 2rem", height: 96, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0a0a0a", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <a href="/cms/dashboard" style={{ display: "flex", alignItems: "center" }}>
            <Image src={cmsConfig.logo.src} alt={cmsConfig.logo.alt} width={280} height={80} style={{ objectFit: "contain" }} />
          </a>
          
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
