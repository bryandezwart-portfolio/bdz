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

  // ── Beelden ──────────────────────────────────
  enabledSections: {
    heroVideo:    true,
    heroBgImage:  true,
    profilePhoto: true,
  },

  defaultMedia: {
    heroVideo:    "/bdz-nov.mp4",
    heroBgImage:  "",
    profilePhoto: "/bryandezwart-official.avif",
  },

  maxClientUploads: {
    heroVideo:    2,
    heroBgImage:  1,
    profilePhoto: 1,
  },

  // ── Teksten ───────────────────────────────────
  enabledFields: {
    heroNames:    true,
    heroSubtitle: true,
    heroTags:     true,
    aboutTitle:   true,
    aboutIntro:   true,
    cards:        true,
    cardsCount:   4,
    logo:         true,
    spotify:      true,
    footer:       true,
  },

  // ── Tabs ──────────────────────────────────────
  tabs: {
    teksten: true,
    media:   true,
    seo:     true,
  },

  // ── Gebruikers ────────────────────────────────
  users: [
    { username: "master",  passwordEnvKey: "CMS_MASTER_PASSWORD",  role: "master" as const },
    { username: "klant",   passwordEnvKey: "CMS_CLIENT_PASSWORD",   role: "client" as const },
  ],
};

export type CmsUser = (typeof cmsConfig.users)[number];
