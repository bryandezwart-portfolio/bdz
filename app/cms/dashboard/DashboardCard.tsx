"use client";

export function DashboardCard({ title, desc, href, accent }: { title: string; desc: string; href: string; accent: string }) {
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
