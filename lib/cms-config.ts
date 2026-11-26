// ─────────────────────────────────────────────
//  CMS CONFIG — pas dit aan per klantsite
// ─────────────────────────────────────────────

export const cmsConfig = {
  // Logo op de loginpagina (zet bestand in /public)
  logo: {
    src: "/logo-brandingtotaal.png",
    alt: "Branding Totaal",
    width: 180,
  },

  // Naam van de site (zichtbaar in dashboard)
  siteName: "Branding Totaal",

  // URL van de live site (voor "Bekijk live" knop)
  siteUrl: "https://bryandezwart.nl",

  // Kleur van de knop / accenten
  accentColor: "#9ca3af",

  // Gebruikers — voeg per site een eigen user toe
  users: [
    {
      username: "master",
      passwordEnvKey: "CMS_MASTER_PASSWORD",
      role: "master" as const,
    },
    {
      username: "klant",
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
