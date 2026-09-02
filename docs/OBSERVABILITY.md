# Matn Quiz — Observability Guide

## Goal

Phase 17 adds observability readiness for Matn Quiz.

The app is frontend-only, so monitoring focuses on:

- client event modeling
- local event summary utilities
- performance budget definitions
- deployment/build smoke checks
- release monitoring documentation

## Verification Commands

pnpm test
pnpm run lint
pnpm run build
pnpm run monitoring:report
pnpm run monitoring:budget
pnpm run verify:phase17
