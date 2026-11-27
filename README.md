# Lokseva Doodh Dairy website

Website for Lokseva Doodh Dairy, Gulmandi, Chhatrapati Sambhajinagar, built and released with a CI/CD pipeline on GitHub Actions and GitHub Pages.

| Environment | Branch | URL |
|---|---|---|
| Production | `main` | https://safishareque.github.io/gpt-test/ |
| Development | `develop` | https://safishareque.github.io/gpt-test/dev/ |

What is live right now: open `/build-info.json` on either URL.

## Repository layout

```
site/                  everything visitors download (the only folder that gets published)
  index.html
  assets/css/site.css
  assets/js/site.js    products list, accordion, hours, theme toggle
  images/              photos
scripts/
  build.mjs            builds site/ for one environment into _site/
  check.mjs            quality checks run on every pull request
.github/workflows/
  ci.yml               runs checks on pull requests
  deploy.yml           builds and deploys develop -> /dev/ and main -> /
VERSION                current version (1.0.0)
CHANGELOG.md           release notes, one section per version
docs/CICD-GUIDE.md     how the pipeline works, step by step
docs/IMAGES.md         photo names and sizes
```

## Everyday commands

```bash
node scripts/check.mjs
```

```bash
node scripts/build.mjs --env development --out _site
```

```bash
python3 -m http.server 8000 -d _site
```

Then open http://localhost:8000.

Read [docs/CICD-GUIDE.md](docs/CICD-GUIDE.md) for the full workflow.
