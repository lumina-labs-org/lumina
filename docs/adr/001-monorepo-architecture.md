# ADR-001 — Monorepo Architecture

## Status

Accepted

## Context

Lumina is a platform composed of multiple products and services:

- Web application for organizers and public event pages
- Mobile application for attendees
- Admin application for Lumina internal operations
- API service
- Worker service for background jobs
- Shared packages such as UI, config, types and SDK

Because these parts are strongly related and will evolve together, keeping them in a single repository makes it easier to share code, enforce standards and maintain consistency across the platform.

## Decision

We will use a monorepo architecture.
Initial structure:

```txt
apps/
  web/
  mobile/

services/
  api/
  worker/

packages/
  ui/
  config/
  types/
  sdk/

docs/
  adr/
  product/

  The web application will contain both public pages and dashboard experiences. Access will be controlled by roles such as admin_master and admin_manager.
