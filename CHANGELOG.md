# Changelog

Every release that goes to production gets a section here.
The Deploy workflow copies the section into the GitHub Release notes, so write it for humans.

Versions follow `MAJOR.MINOR.PATCH`:
- **PATCH** (1.0.0 -> 1.0.1): fixes and small text or photo changes
- **MINOR** (1.0.0 -> 1.1.0): new sections or features
- **MAJOR** (1.0.0 -> 2.0.0): a full redesign

## [Unreleased]

## [1.0.0] - 2026-11-27

First live version of the Lokseva Doodh Dairy website.

### Added
- Hero "The taste Sambhajinagar grew up on." with blended milk-can photo and animated milk ribbons
- Sticky header with tap-to-call (+91 95189 35481) and dark/light mode toggle
- About statement with key facts: 50 years, wholesale, retail, home delivery
- Services: wholesale supply, retail counter, home delivery, weddings and festivals
- "From our counter": 8 colour-coded product tabs with photos and smooth open/close
- Why choose us, Google reviews link, address with map, live open/closed hours, service area
- Phone-first layout with a Call / WhatsApp / Map bar on mobile
- Local SEO: LocalBusiness structured data, meta description

### Pipeline
- CI checks on every pull request, automatic deploys of `develop` to `/dev/` and `main` to production
- Versioned builds with `build-info.json`, automatic tag and GitHub Release per version
