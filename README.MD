# FixItNow
> Your Trusted Home Service Platform

## About
FixItNow is a backend API for a home services marketplace connecting customers with skilled technicians (plumbing, electrical, cleaning, painting, etc.). The platform handles user management, service browsing, booking, payments via Stripe/SSLCommerz, and reviews.

## Tech Stack
- **Node.js + Express** - Backend framework
- **TypeScript** - Type safety
- **Prisma** + PostgreSQL - ORM & database
- **JWT + bcryptjs** - Authentication
- **Stripe** - Payment processing
- **pnpm** - Package manager

## Prerequisites
- Node.js (v18+)
- PostgreSQL
- pnpm (recommended) or npm

## Quick Start

```bash
# Clone repository
git clone https://github.com/hussainali2023/fixit_backend.git
cd fixit_backend

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL, JWT secret, Stripe keys

# Setup database
pnpm prisma generate
pnpm prisma migrate dev --name init
pnpm prisma db seed

# Start development server
pnpm dev