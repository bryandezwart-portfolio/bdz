// ─────────────────────────────────────────────
//  CMS CONFIG — pas dit aan per klantsite
// ─────────────────────────────────────────────

export const cmsConfig = {
  // Logo op de loginpagina (zet bestand in /public)
  logo: {
    src: "/branding-totaal-logo.png", // ← verander naar klant-logo
    alt: "Branding Totaal",
    width: 180,
  },

  // Naam van de site (zichtbaar in dashboard)
  siteName: "Mijn Website",

  // URL van de live site (knop "Bekijk live" in dashboard)
  siteUrl: "https://www.bryandezwart.nl",

  // Kleur van de knop / accenten
  accentColor: "#e63946",

  // E-mailadressen voor de master (wachtwoord vergeten)
  // Reset-link gaat naar ALLE adressen hieronder
  masterEmails: [
    "info@bdzbookings.nl",
    // Voeg hier extra backup-emails toe:
    // "backup@jouwdomein.nl",
  ],

  // Afzender voor alle CMS-emails
  fromEmail: "noreply@brandingtotaal.com",
  fromName: "Branding Totaal CMS",

  // Gebruikers — voeg per site een eigen user toe
  // Master-login werkt altijd op ELKE site
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

  // Welke velden zichtbaar zijn in instellingen en teksten
  enabledFields: {
    logo: true,
    spotify: true,
    footer: true,
    heroNames: true,
    heroSubtitle: true,
    heroTags: true,
    aboutTitle: true,
    aboutIntro: true,
    cards: true,
    cardsCount: 4,
  },

  // Welke tabs zichtbaar zijn in het dashboard
  tabs: {
    teksten: true,
    media: true,
    seo: true,
    beelden: true,
    gebruikers: true,
    instellingen: true,
    releases: true,
    socials: true,
  },

  // Welke secties actief zijn (voor beelden/media pagina)
  enabledSections: {
    heroVideo: true,
    heroBgImage: true,
    profilePhoto: true,
  } as Record<string, boolean>,

  // Standaard media-URLs per sectie (leeg = geen standaard)
  defaultMedia: {
    heroVideo: "",
    heroBgImage: "",
    profilePhoto: "",
  } as Record<string, string>,

  // Max uploads per sectie voor klanten
  maxClientUploads: {
    heroVideo: 1,
    heroBgImage: 2,
    profilePhoto: 1,
  } as Record<string, number>,
};

export type CmsUser = (typeof cmsConfig.users)[number];
