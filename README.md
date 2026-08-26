# Kofi

A full-stack coffee e-commerce application built with React and TypeScript.

## Overview

Kofi is a full-stack e-commerce application for browsing and purchasing coffee products. It includes user auth, shopping cart, Stripe integration and an admin dashboard

## Features

### Customer

- User registration and authentication
- Browse coffee products
- Order history and status tracking
- Shopping cart
- Stripe checkout

### Administration

- Order management
- Product management

## Tech Stack

### Frontend

- React
- Tailwind
- TanStack Query
- React Router

### Backend

- Hono
- Zod
- Drizzle ORM w/ Turso

## Development

```bash
git clone https://github.com/laNuez/coffee-shop.git
cd coffee-shop
bun install
bun run dev
```

### Environment variables

Copy the example environment files and fill in the required values:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

You'll need Stripe, Turso, and an S3-compatible/R2 bucket.

The app is deployed to Cloudflare Workers with Cloudflare R2 for image storage.

### Database

```bash
cd server
bun run db:migrate
```

## Testing

Configure the test database in `server/.env.test`
From the `server` directory, run:

```bash
bun run db:test:migrate
```

Built using the [bhvr](https://github.com/stevedylandev/bhvr) template.
