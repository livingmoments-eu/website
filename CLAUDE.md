# Living Moments UG — Website Projekt

## Wer ist Julia?
Julia Gehring, Geschäftsführerin der Living Moments UG (haftungsbeschränkt).
Selbstständige Immobilienberaterin im Verkauf bei Engel & Völkers Residential München City (seit 18.08.2025).
Kontakt: gehring@livingmoments.eu | julia.gehring@engelvoelkers.com | Tel: +49 151 57008986
Adresse: Heimstättenstr. 20, 80805 München | Büro: Residenzstraße 23, 80333 München
Handelsregister: HRB 304847, Amtsgericht München

## Zwei Dienstleistungen unter einer Marke
1. **Immobilienberatung** (Verkauf, Kauf, Bewertung) — selbstständig für Engel & Völkers Residential München City. Fokus: Schwabing, München. Farming-Gebiete 108 + 128. NUR Wohnimmobilien (Wohnungen, DHH, EFH). Kein Commercial.
2. **Event-Organisation** — Unternehmern & Unternehmerinnen (EO-Netzwerk, Corporate). Ganz München.

## Technischer Stack
- **Statisches HTML/CSS/JS** — kein CMS, kein Framework, maximale Einfachheit
- **GitHub** — Repository (Ben richtet einmalig ein)
- **Vercel** — Deployment, auto-deploy bei git push
- **Domain** — livingmoments.eu (registriert bei Squarespace, DNS → Vercel)
- **Kein**: Newsletter, Blog, Kalender, Squarespace-Builder

## Design-Grundregeln (→ DESIGN_GUIDE.md für Details)
- Split-Screen-Konzept: Immobilien = Creme/Ivory (#F0EDE8) | Events = Near-Black (#1A1A1A)
- Gold-Akzent: #C9A96E (Logofarbe)
- Logo: Zwei Versionen — dark (Gold + Weiß auf #1A1A1A) + light (Gold + Schwarz auf Weiß)
- Typography: Ultra-thin Geometric Sans-Serif, sehr weiter Letter-Spacing, All Caps für Brand
- Serife für große Überschriften (Display), Sans-Serif für Fließtext

## Pflichtseiten & Inhalte
- **Hero**: Split-Screen (Immobilien links | Events rechts) + klare CTAs
- **Über mich**: Eine Person, zwei Welten — CliftonStrengths + Reiss-Profil-basiert
- **Immobilien**: Leistungen, VERKAUFT-Showcase, aktuelle Listings (E&V URLs), Calendly
- **Events**: Leistungen, Portfolio/Referenzen, Kontakt
- **Testimonials**: Sammeln mit Julia — Platzhalter anlegen
- **Impressum**: LM UG Daten (auto-gefüllt)
- **Datenschutzerklärung**: DSGVO-konform, cookie-minimal

## SEO & LLM-Optimierung
- Semantisches HTML (h1-h6, article, section, main, nav)
- JSON-LD structured data (LocalBusiness, Person, Service)
- Meta tags: title, description, og:*, geo-tags
- Fokus-Keywords: "Immobilienmaklerin München Schwabing", "Wohnung verkaufen München", "Event Organisation München Unternehmen"
- Deutsch only

## E&V Compliance (Website)
- Julia **darf** sich als E&V Immobilienberaterin bezeichnen
- Julia **darf** auf E&V Listings verlinken (externe URLs)
- Julia **darf NICHT** das E&V Logo auf ihrer eigenen Website verwenden (ohne schriftliche Genehmigung)
- Julia **darf NICHT** E&V Exposé-Fotos oder Objekttexte verwenden (gehören E&V)
- Klare Trennung: LM UG = Unternehmensmarke (Events + Dach) | E&V = Arbeitgeber für Immobilien
- Keine Aussagen, die E&V binden könnten
- Fotos für Immobilien-Sektion: KI-generiert oder lizenzfreie Stockfotos (KEINE E&V Objektfotos)

## Wie Julia Updates macht
Julia arbeitet mit Claude Code. Sie beschreibt die Änderung in natürlicher Sprache — Claude setzt um.
Kein GitHub-Wissen nötig. Ben kümmert sich um: Repo anlegen, Vercel verbinden, Domain-DNS.

## Memory-Dateien
Alle projektrelevanten Memories liegen unter:
`~/.claude/projects/-Users-juliatrollinger-Claude-Website/memory/`

Relevante E&V-Memories (aus dem E&V-Projekt):
`~/.claude/projects/-Users-juliatrollinger-Claude-E-V/memory/`

## Wichtige Designentscheidungen
- Kein echter Property-Foto → KI-generierte Immobilienbilder
- Event-Fotos: Julia hat eigene Fotos
- Kein Headshot noch vorhanden → Platzhalter mit Stil-Konzept
- Tippgeber-Konzept auf der Website andeuten (dezent)
- Calendly: Einbetten für Erstgespräch-Buchung (Immobilien)
- Sprache: Deutsch only
- Referenzseiten (Stil-Inspiration): tschmidt.properties, voelker.immo
