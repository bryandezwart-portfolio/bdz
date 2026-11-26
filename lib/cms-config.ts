// ─────────────────────────────────────────────
//  CMS CONFIG — pas dit aan per klantsite
// ─────────────────────────────────────────────

export const cmsConfig = {
  // Logo op de loginpagina (zet bestand in /public)
  logo: {
    src: "/logo-brandingtotaal.png", // ← verander naar klant-logo
    alt: "Branding Totaal",
    width: 180,
  },

  // Naam van de site (zichtbaar in dashboard)
  siteName: "Branding Totaal",

  // Kleur van de knop / accenten
  accentColor: "#9ca3af",

  // Gebruikers — voeg per site een eigen user toe
  // Master-login werkt altijd op ELKE site
  users: [
    {
      username: "master",
      // Zet MASTER_PASSWORD in .env.local
      passwordEnvKey: "CMS_MASTER_PASSWORD",
      role: "master" as const,
    },
    {
      username: "klant",
      // Zet CMS_CLIENT_PASSWORD in .env.local
      passwordEnvKey: "CMS_CLIENT_PASSWORD",
      role: "client" as const,
    },
  ],

  // Welke tabs zichtbaar zijn in het dashboard
  tabs: {
    teksten: true,
    media: true,
    seo: true,
  },
};

export type CmsUser = (typeof cmsConfig.users)[number];
