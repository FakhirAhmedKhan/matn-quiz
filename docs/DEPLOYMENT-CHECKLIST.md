# Matn Quiz — Deployment Checklist

## Before Deployment

- [ ] NEXT_PUBLIC_SITE_URL is set to the real production domain
- [ ] pnpm test passes
- [ ] pnpm run lint passes
- [ ] pnpm run build passes
- [ ] pnpm run smoke:production passes
- [ ] pnpm run smoke:deployment passes
- [ ] README is updated
- [ ] DEPLOYMENT.md is updated
- [ ] RELEASE-CHECKLIST.md is updated
- [ ] GitHub Actions workflow exists

## Hosting Setup

- [ ] Repository connected to hosting provider
- [ ] Production branch selected
- [ ] Environment variables configured
- [ ] Build command configured
- [ ] Output behavior confirmed for selected hosting provider
- [ ] Production domain connected
- [ ] HTTPS enabled

## After Deployment

- [ ] Homepage loads
- [ ] Manifest loads
- [ ] Robots route loads
- [ ] Sitemap route loads
- [ ] Quiz generation works
- [ ] Save history works
- [ ] Import/export JSON works
- [ ] Resume study session works
- [ ] Mobile layout checked
- [ ] Keyboard navigation checked
