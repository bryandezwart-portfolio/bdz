

import { vereistInloggen } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import BeheerNav from "@/components/BeheerNav";
import Link from "next/link";

export default async function BeheerDashboard() {
  await vereistInloggen();

  // Statistieken ophalen
  const [
    { count: portfolioAantal },
    { count: berichtenAantal },
    { count: berichtenOngelezen },
  ] = await Promise.all([
    supabaseAdmin.from("portfolio").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("contactberichten").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("contactberichten").select("*", { count: "exact", head: true }).eq("gelezen", false),
  ]);

  const kaarten = [
    { href: "/beheer/pakketten",   label: "Pakketten",       icon: "💶", tel: null,            info: "Prijzen aanpassen" },
    { href: "/beheer/teksten",     label: "Teksten",         icon: "✏️", tel: null,            info: "Alle paginateksten" },
    { href: "/beheer/media",       label: "Media",           icon: "🖼️", tel: null,            info: "Foto's & video's" },
    { href: "/beheer/portfolio",   label: "Portfolio",       icon: "🎨", tel: portfolioAantal, info: "projecten" },
    { href: "/beheer/bedrijf",     label: "Bedrijfsgegevens",icon: "🏢", tel: null,            info: "Contactinfo" },
    { href: "/beheer/seo",         label: "SEO",             icon: "🔍", tel: null,            info: "Per pagina" },
    { href: "/beheer/recensies",   label: "Recensies",       icon: "⭐", tel: null,            info: "Klantquotes" },
    { href: "/beheer/berichten",   label: "Berichten",       icon: "✉️", tel: berichtenAantal, info: `${berichtenOngelezen ?? 0} ongelezen`, urgent: (berichtenOngelezen ?? 0) > 0 },
    { href: "/beheer/overeenkomsten", label: "Overeenkomsten", icon: "🤝", tel: null,            info: "Whitelabel teksten" },
    { href: "/beheer/privacy",     label: "Privacybeleid",   icon: "🔒", tel: null,            info: "Tekst bewerken" },
    { href: "/beheer/voorwaarden", label: "Voorwaarden",     icon: "📄", tel: null,            info: "Tekst bewerken" },
  ];

  return (
    <div className="flex min-h-screen">
      <BeheerNav />

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-white/50 mt-1">Welkom terug, Bryan. Wat wil je aanpassen?</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {kaarten.map((k) => (
              <Link
                key={k.href}
                href={k.href}
                className="group bg-white/5 hover:bg-white/8 border border-white/8 hover:border-[#3a6bb3]/40 rounded-2xl p-5 transition-all"
              >
                <div className="text-2xl mb-3">{k.icon}</div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-sm text-white group-hover:text-[#5b8fe0] transition-colors">{k.label}</div>
                    <div className={`text-xs mt-0.5 ${k.urgent ? "text-orange-400" : "text-white/40"}`}>{k.info}</div>
                  </div>
                  {k.tel !== null && (
                    <div className={`text-lg font-bold ${k.urgent ? "text-orange-400" : "text-[#5b8fe0]"}`}>
                      {k.tel}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Snelle link naar site */}
          <div className="mt-8 bg-[#3a6bb3]/10 border border-[#3a6bb3]/20 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-white">Jouw website</div>
              <div className="text-xs text-white/50 mt-0.5">brandingtotaal.com</div>
            </div>
            <Link
              href="/"
              target="_blank"
              className="bg-[#3a6bb3] hover:bg-[#2f5fae] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              Bekijk live →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
