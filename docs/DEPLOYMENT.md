# Matn Quiz — Deployment Guide

## Goal

Deploy Matn Quiz as a frontend-only Next.js application.

## Recommended Target

Vercel is the recommended default target because Matn Quiz uses Next.js App Router.

Other possible targets:

- Netlify with a Next.js-compatible setup
- Cloudflare Pages with a Next.js-compatible setup
- Static hosting only after confirming the selected host supports the generated output

## Required Environment Variable

NEXT_PUBLIC_SITE_URL=https://your-production-domain.com

This value is used for:

- Canonical URL
- Sitemap URL
- Robots sitemap URL
- Metadata base URL
- Deployment smoke checks

## Local Release Verification

Run these commands before deployment:

pnpm test
pnpm run lint
pnpm run build
pnpm run smoke:production
pnpm run smoke:deployment
pnpm run verify:phase16

## Deployment Flow

1. Push the project to GitHub.
2. Connect the repository to the hosting platform.
3. Set NEXT_PUBLIC_SITE_URL in the hosting dashboard.
4. Use pnpm install for dependencies.
5. Use pnpm run build for production build.
6. Deploy the generated Next.js production output.
7. Run smoke checks after each release.

## CI

The GitHub Actions workflow runs:

- tests
- lint
- build
- production smoke check
- deployment smoke check
