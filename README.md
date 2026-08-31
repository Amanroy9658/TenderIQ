# TenderIQ

Agentic AI system that helps companies determine whether they are realistically qualified to bid on a tender.

## Overview
TenderIQ is an investigation and qualification engine. Given a tender document and company evidence, it extracts requirements, matches evidence, calculates qualification states (PASS/FAIL/NEEDS_REVIEW), and traces every decision back to its source.

## Architecture
- **Frontend**: Next.js App Router (apps/frontend)
- **Backend**: NestJS + Prisma + PostgreSQL (apps/backend)
- **Shared**: TypeScript DTOs and models (packages/shared)

## Running locally
1. `docker-compose up -d` to start the database.
2. `npm install`
3. `npm run dev`
