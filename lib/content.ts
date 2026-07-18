export const site = {
  name: "Bryan de Zwart",
  titles: ["Radio-DJ bij Radio Muziekstad", "Eigenaar van Bryan de Zwart Music"],

  metaTitle: "Bryan de Zwart — Radio-DJ & Label Owner",
  metaDescription:
    "Bryan de Zwart — presentator van De Wakker & Wel Show bij Radio Muziekstad en eigenaar van platenmaatschappij Bryan de Zwart Music.",

  bio: [
   "Hey hallo! Ik ben Bryan de Zwart, oprichter van platenlabel Bryan de Zwart Music. Via het label breng ik muziek en artiesten naar buiten die er wat mij betreft nog te weinig gehoord worden.",
"Naast het label sta ik elke ochtend achter de knoppen bij Radio Muziekstad, waar ik De Wakker & Wel Show presenteer — de show die je wakker maakt en je dag goed op gang helpt.",
  ],

  photo: {
    src: "/bryan-de-zwart.png",
    alt: "Portret van Bryan de Zwart met koptelefoon om zijn nek",
  },

  logo: {
    src: "/bryan-logo.png",
    alt: "Bryan de Zwart logo",
  },

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
      url: "https://www.instagram.com/bdzmusic.nl",
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
      url: "https://www.linkedin.com/in/bryandezwart/",
      icon: "linkedin",
    },
  ],

  footerNote: "Radio-DJ · Label owner · Muziekliefhebber met hart voor het vak",
};

export type Site = typeof site;
