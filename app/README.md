# Bryan de Zwart — persoonlijke website

Een donkere, Apple-achtige profielpagina, gebouwd met Next.js.

---

## Inhoudsopgave

1. [Lokaal bekijken (optioneel)](#1-lokaal-bekijken-optioneel)
2. [Site hosten op Vercel](#2-site-hosten-op-vercel)
3. [Domeinnaam bij Strato koppelen aan Vercel](#3-domeinnaam-bij-strato-koppelen-aan-vercel)
4. [Zelf teksten, foto's en logo aanpassen](#4-zelf-teksten-fotos-en-logo-aanpassen)
5. [Hulp nodig?](#5-hulp-nodig)

---

## 1. Lokaal bekijken (optioneel)

Wil je de site eerst op je eigen computer zien voordat je 'm online zet?

1. Installeer [Node.js](https://nodejs.org) (versie 18 of hoger) als je dat nog niet hebt.
2. Open een terminal in deze projectmap.
3. Voer uit:
   ```
   npm install
   npm run dev
   ```
4. Ga naar `http://localhost:3000` in je browser.

Je kunt deze stap ook overslaan en direct naar stap 2.

---

## 2. Site hosten op Vercel

Vercel is het platform gemaakt door de makers van Next.js — gratis voor persoonlijke sites zoals deze.

1. Zet dit project in een **GitHub-repository**:
   - Ga naar [github.com](https://github.com) en maak (indien nodig) een gratis account.
   - Maak een nieuwe, lege repository aan, bijvoorbeeld genaamd `bryan-de-zwart-site`.
   - Upload de inhoud van deze map naar die repository. Makkelijkste manier: installeer [GitHub Desktop](https://desktop.github.com), open deze projectmap daarin, en klik op "Publish repository".

2. Ga naar [vercel.com](https://vercel.com) en maak een gratis account aan (kan direct inloggen met je GitHub-account).

3. Klik op **"Add New" → "Project"**.

4. Kies je zojuist aangemaakte GitHub-repository (`bryan-de-zwart-site`) en klik op **"Import"**.

5. Vercel herkent automatisch dat het een Next.js-project is. Je hoeft niets aan te passen — klik op **"Deploy"**.

6. Na ongeveer 1 minuut is je site live op een adres zoals `bryan-de-zwart-site.vercel.app`. Bewaar dit adres, dat heb je in de volgende stap nodig.

Elke keer dat je hierna een wijziging naar GitHub pusht (bijvoorbeeld na het aanpassen van een tekst), bouwt Vercel automatisch een nieuwe versie van de site.

---

## 3. Domeinnaam bij Strato koppelen aan Vercel

Nu koppel je je eigen domeinnaam (die bij Strato staat) aan de Vercel-site.

### Stap A — Domein toevoegen in Vercel

1. Ga in Vercel naar je project → tabblad **"Settings" → "Domains"**.
2. Typ je domeinnaam in (bijvoorbeeld `bryandezwart.nl`) en klik op **"Add"**.
3. Vercel laat nu de DNS-instellingen zien die je moet invoeren. Meestal zijn dat:
   - Een **A-record** die verwijst naar `76.76.21.21`
   - Een **CNAME-record** voor `www` dat verwijst naar `cname.vercel-dns.com`

   (De exacte waarden staan altijd actueel in je eigen Vercel-scherm — gebruik die, ze kunnen wijzigen.)

### Stap B — DNS instellen bij Strato

1. Log in op [strato.nl](https://www.strato.nl) met je account.
2. Ga naar **"Mijn producten"** (of "Domeins") en kies je domeinnaam.
3. Zoek naar **"DNS-instellingen"** of **"DNS-beheer"**.
4. Voeg de volgende records toe (of pas bestaande aan):

   | Type  | Naam / Host | Waarde                  |
   |-------|-------------|--------------------------|
   | A     | @           | 76.76.21.21              |
   | CNAME | www         | cname.vercel-dns.com     |

   > Let op: als er al een A-record op "@" staat (vaak wijst dat standaard naar een Strato-parkeerpagina), moet je die eerst verwijderen voordat je de nieuwe toevoegt.

5. Sla de wijzigingen op.

### Stap C — Wachten en controleren

- DNS-wijzigingen kunnen tussen de **10 minuten en 24 uur** duren om overal door te komen.
- Ga terug naar Vercel → Settings → Domains. Zodra Vercel het domein herkent, zie je een groen vinkje ✅ en wordt er automatisch een gratis SSL-certificaat aangemaakt (het slotje/https).
- Daarna is je site bereikbaar op je eigen domeinnaam.

---

## 4. Zelf teksten, foto's en logo aanpassen

Alle tekst en links staan overzichtelijk in **één bestand**: `lib/content.ts`. Je hoeft de rest van de code niet aan te raken.

Open dat bestand en pas bijvoorbeeld aan:

- `name`, `titles`, `bio` — je naam, functietitels en bio-tekst
- `radio` en `label` — teksten en links naar Radio Muziekstad en Bryan de Zwart Music
- `socials` — je Facebook-, Instagram- en LinkedIn-links. Zodra je persoonlijke Instagram live is, vul je gewoon de `url` in bij dat blokje.

**Een foto vervangen:**
1. Zet je nieuwe foto in de map `public/`.
2. Pas in `lib/content.ts` het pad aan bij `photo.src`, bijvoorbeeld `"/nieuwe-foto.png"`.

**Een logo toevoegen:**
Op dit moment staat er een tekstlogo ("BdZ") in de navigatiebalk, in `components/Nav.tsx`. Wil je een echt beeldmerk gebruiken? Zet het logo-bestand (bij voorkeur een `.png` of `.svg` met transparante achtergrond) in `public/`, en vervang in `components/Nav.tsx` de tekst `BdZ` door een `<Image src="/jouw-logo.png" ... />` component. Als je dit liever niet zelf doet: stuur je logo en ik werk het voor je bij.

**Wijzigingen live zetten:**
Na het aanpassen van een bestand: sla het op, push de wijziging naar GitHub (via GitHub Desktop bijvoorbeeld: "Commit" → "Push"). Vercel bouwt daarna automatisch een nieuwe versie — meestal binnen een minuut zichtbaar op je site.

---

## 5. Hulp nodig?

Loop je vast bij het opzetten van GitHub, Vercel of de DNS bij Strato — of wil je dat ik een tekst, foto of het logo voor je aanpas? Laat het gewoon weten.
