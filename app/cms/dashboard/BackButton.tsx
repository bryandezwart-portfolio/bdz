"use client";
import { usePathname } from "next/navigation";

export default function BackButton() {
  const path = usePathname();
  const isDashboard = path === "/cms/dashboard";
  if (isDashboard) return null;

  return (
    <a
      href="/cms/dashboard"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        fontSize: "0.78rem",
        color: "#555",
        textDecoration: "none",
        marginBottom: "1.5rem",
        padding: "0.35rem 0.75rem",
        border: "1px solid #222",
        borderRadius: 6,
        background: "#111",
      }}
    >
      ← Terug naar dashboard
    </a>
  );
}
