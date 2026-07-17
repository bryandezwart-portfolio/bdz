// ============================================================================
// SITE-INHOUD — pas hier tekst, links en instellingen aan.
// Je hoeft NERGENS anders in de code iets te wijzigen om teksten of
// links te updaten. Sla dit bestand op, commit + push (of upload opnieuw
// naar Vercel) en de site wordt automatisch bijgewerkt.
// ============================================================================

export const site = {
  name: "Bryan de Zwart",
  titles: ["Radio-DJ bij Radio Muziekstad", "Eigenaar van Bryan de Zwart Music"],

  // Korte zin die bovenaan de pagina (in de browser-tab) verschijnt
  metaTitle: "Bryan de Zwart — Radio-DJ & Label Owner",
  metaDescription:
    "Bryan de Zwart — presentator van De Wakker & Wel Show bij Radio Muziekstad en eigenaar van platenmaatschappij Bryan de Zwart Music.",

  // Bio-tekst, mag uit meerdere alinea's bestaan
  bio: [
    "Hey hallo! Ik ben Bryan de Zwart, eigenaar van platenmaatschappij Bryan de Zwart Music en radio-DJ bij Radio Muziekstad.",
    "Elke ochtend presenteer ik De Wakker & Wel Show — de show die je wakker maakt en je dag goed op gang helpt.",
  ],

  photo: {
    src: "/bryan-de-zwart.png",
    alt: "Portret van Bryan de Zwart met koptelefoon om zijn nek",
  },

  logo: {
    src: "/bryan-logo.png",
    alt: "Bryan de Zwart logo",
  },

  // De twee 'projecten' van Bryan
  radio: {
    label: "Op de radio",
    name: "Radio Muziekstad",
    show: "De Wakker & Wel Show",
    description:
      "Elke ochtend zet ik de toon: goede muziek, een vrolijk praatje en de perfecte start van je dag. Luister live mee.",
    url: "https://muziekstad.nl",
    cta: "Beluister Radio Muziekstad",
  },

  label: {
    label: "Het label",
    name: "Bryan de Zwart Music",
    description:
      "Mijn platenmaatschappij, waar muziek en artiesten alle ruimte krijgen om te groeien. Ontdek de releases en artiesten.",
    url: "https://bdzmusic.nl",
    cta: "Bekijk Bryan de Zwart Music",
  },

  // Social links. Laat 'url' leeg ("") om een icoon als "binnenkort" te tonen.
  socials: [
    {
      label: "Facebook — Bryan de Zwart Music",
      handle: "@BryanDeZwartMusic",
      url: "https://www.facebook.com/BryanDeZwartMusic/",
      icon: "facebook",
    },
    {
      label: "Facebook — Persoonlijk",
      handle: "@bryandezwart.nl",
      url: "https://www.facebook.com/bryandezwart.nl/",
      icon: "facebook",
    },
    {
      label: "Instagram — Bryan de Zwart Music",
      handle: "@bryandezwartmusic.nl",
      url: "https://www.instagram.com/bryandezwartmusic.nl",
      icon: "instagram",
    },
    {
      label: "Instagram — Persoonlijk",
      handle: "Binnenkort beschikbaar",
      url: "",
      icon: "instagram",
    },
    {
      label: "LinkedIn",
      handle: "Bryan de Zwart",
      // Let op: controleer deze URL zelf even in je browser — LinkedIn
      // profiel-links hebben meestal het formaat /in/gebruikersnaam.
      url: "https://www.linkedin.com/in/bryan-de-zwart1983",
      icon: "linkedin",
    },
  ],

  footerNote: "Radio-DJ · Label owner · Ochtendmens",
};

export type Site = typeof site;
