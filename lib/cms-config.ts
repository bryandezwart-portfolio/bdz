// ─────────────────────────────────────────────
//  CMS CONFIG — pas dit aan per klantsite
// ─────────────────────────────────────────────

export const cmsConfig = {
  logo: {
    src: "/logo-brandingtotaal.png",
    alt: "Branding Totaal",
    width: 180,
  },

  siteName: "Branding Totaal",
  siteUrl: "https://bryandezwart.nl",
  accentColor: "#9ca3af",

  // Standaard media — ingesteld door Branding Totaal, altijd beschikbaar
  defaultMedia: {
    heroVideo:   "/bdz-nov.mp4",
    heroBgImage: "", // wordt ingevuld zodra jij de eerste upload doet
  },

  // Max uploads per sectie door de klant
  maxClientUploads: {
    heroVideo:   2,
    heroBgImage: 1,
  },

  users: [
    { username: "master",  passwordEnvKey: "CMS_MASTER_PASSWORD",  role: "master" as const },
    { username: "klant",   passwordEnvKey: "CMS_CLIENT_PASSWORD",   role: "client" as const },
  ],

  tabs: {
    teksten: true,
    media:   true,
    seo:     true,
  },
};

export type CmsUser = (typeof cmsConfig.users)[number];
