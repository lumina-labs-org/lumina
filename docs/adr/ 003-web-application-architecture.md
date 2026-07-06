# ADR-003 — Single Web Application

## Status

Accepted

---

## Context

Lumina provides two different experiences through the web platform.

The first one is public-facing and allows attendees to browse events, purchase tickets and manage their registrations.

The second one is the organizer workspace, where event managers create and operate events through dashboards and administrative tools.

Initially we considered splitting these experiences into two independent web applications.

Examples:

- lumina.com
- dashboard.lumina.com

However, both experiences share the same:

- Authentication
- Design System
- SDK
- API
- Routing
- Session
- User model
- Organization model

Maintaining separate applications would increase operational complexity without delivering significant benefits at the current stage of the product.

---

## Decision

Lumina will have a single web application.

The application will contain two major experiences:

- Public Area
- Organizer Workspace

Access will be controlled through authentication and user roles.

---

## Why?

Because we are building a startup.

At this stage we value:

- simplicity
- fast development
- shared code
- low maintenance cost

more than complete separation between products.

---

## Future

If Lumina grows and dedicated teams are created for each experience, the public website may eventually become an independent application.

This decision can be revisited without impacting the platform architecture.

---

## Consequences

Positive

- Less duplicated code
- Simpler deployment
- Unified authentication
- Easier maintenance
- Shared Design System

Negative

- Larger Next.js project
- More responsibility inside the same application
- Requires good route organization

---

## Notes

Inside the web application we will organize the project using route groups.

Example:

app/

    (public)/

    (dashboard)/

This keeps the project modular while preserving a single deployment.