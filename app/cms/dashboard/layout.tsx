import { getSession } from "@/lib/cms-auth";
import { redirect } from "next/navigation";
import { cmsConfig } from "@/lib/cms-config";
import Image from "next/image";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/cms/login");

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "system-ui, sans-serif", color: "#fff" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", height: 60, background: "#111", borderBottom: "1px solid #222", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href="/cms/dashboard" style={{ display: "flex", alignItems: "center" }}>
            <Image src={cmsConfig.logo.src} alt={cmsConfig.logo.alt} width={120} height={36} style={{ objectFit: "contain" }} />
          </a>
          <span style={{ color: "#444", fontSize: "0.75rem" }}>CMS · {cmsConfig.siteName}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <a
            href={cmsConfig.siteUrl ?? "https://bryandezwart.nl"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: "none", border: "1px solid #333", color: "#aaa", borderRadius: 6, padding: "0.3rem 0.8rem", fontSize: "0.78rem", cursor: "pointer", textDecoration: "none" }}
          >
            Bekijk live →
          </a>
          <form action="/api/cms/logout" method="POST">
            <button type="submit" style={{ background: "none", border: "1px solid #333", color: "#888", borderRadius: 6, padding: "0.3rem 0.8rem", fontSize: "0.78rem", cursor: "pointer" }}>Uitloggen</button>
          </form>
        </div>
      </header>
      <main style={{ padding: "2rem" }}>{children}</main>
    </div>
  );
}
