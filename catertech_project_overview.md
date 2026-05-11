
# Catertech Website — Project Overview

## What Is This Project
Full design + development of Catertech's new website. B2B + B2C platform
serving corporate clients (hotels, event companies, restaurants) and general
customers in UAE. Built with Next.js, Neon (Postgres), Cloudflare R2, NextAuth.

## Tech Stack
- Frontend: Next.js 16 (App Router)
- Database: Neon.tech (PostgreSQL)
- Image Storage: Cloudflare R2
- Auth: NextAuth.js (credentials + OTP)
- Email: Resend (free tier)
- Hosting: Hetzner VPS + Coolify
- CDN: Cloudflare (free)
- Language: English (primary) + Arabic RTL (secondary)
- Styling: Tailwind CSS

## Key Docs In This Workspace
- PROJECT_OVERVIEW.md → this file, start here
- BRD.md → business requirements, pages, features
- TECHNICAL.md → stack, DB schema, API routes, env vars
- FRONTEND.md → pages, components, UI rules, animations
- BACKEND.md → API routes, auth flow, OTP, image upload, RFQ logic

## Project Folder Structure
/app
  /[locale]         → i18n routing (en + ar)
  /(public)         → all public pages
  /(admin)          → admin panel, protected by role
  /api              → all API routes
/components
  /ui               → reusable UI components
  /layout           → header, footer, nav
  /sections         → page-specific sections
/lib
  db.js             → Neon postgres connection
  auth.js           → NextAuth config
  r2.js             → Cloudflare R2 upload helper
  resend.js         → email helper
/public
  /images           → static images, logos
/locales
  en.json           → English strings
  ar.json           → Arabic strings

## Business Context
- Company: Catertech, Dubai, founded 2005
- Services: Catering Equipment Supply, Event Equipment Rental, Kitchen Equipment ,Event Management & Planning 
- Target Users: Corporate clients (hotels, venues, F&B), General buyers
- Two buying paths: Browse & Rent (shop/cart/RFQ) and Trade & Corporate (enquiry/RFQ forms)
- Partner: Deseri & Smart Electronics (LED + audio systems, shown on Home + Contact)

## Languages
- Default: English (LTR)
- Secondary: Arabic (RTL)
- Toggle in header switches language, URL changes to /ar/...
- All text via i18n JSON files, no hardcoded strings

## Roles
- user → general public buyer
- corporate → trade/corporate account
- admin → Catertech staff, full admin panel access

