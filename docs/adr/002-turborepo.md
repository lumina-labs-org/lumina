# ADR-002 — Turborepo

## Status

Accepted

## Context

Lumina will be built as a monorepo with multiple applications and shared packages.

We need a tool to orchestrate tasks such as development, build, lint and test across the repository.

The main alternatives considered were:

- Turborepo
- Nx

## Decision

We will use Turborepo.

Turborepo fits Lumina because it is lightweight, focused and less opinionated. It helps with task orchestration and caching without hiding too much of the monorepo structure.

This matches the goal of the project: learning architecture and engineering decisions by building the platform step by step.

## Consequences

Positive:

- Simple mental model
- Good fit with pnpm workspaces
- Fast task execution with caching
- Less framework lock-in
- Forces us to understand the monorepo structure

Negative:

- Less built-in guidance than Nx
- More manual setup
- We must define our own conventions

## Notes

Nx remains a valid alternative for larger teams or projects that need stronger generators, dependency graph tooling and boundary enforcement from day one.
