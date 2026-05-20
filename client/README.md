# Quantale Lab: Web Client

This directory contains the Next.js frontend application for the **Quantale Lab** algebraic engine. It provides a visual, highly interactive "Combat Arena" interface to evaluate abstract algebra properties (such as Distributivity, Adjunction, and Monoidal Composition) in the domain of Chess skill progression.

> For the full project overview, mathematical theory, and backend details, please refer to the [Root README](../README.md) and the [Server README](../server/README.md).

## Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** TailwindCSS
* **Animation:** Framer Motion
* **Icons:** Lucide React

## Project Structure

This project follows modern Next.js `src/` directory conventions:

```text
client/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router (layout.tsx, page.tsx, globals.css)
│   ├── components/         # React UI Components (CombatArena, LatticeGraph, TerminalPanel, etc.)
│   ├── lib/                # Shared utilities and the unified API Client (api.ts)
│   └── types/              # Global TypeScript definitions (types.ts)
├── .env.local              # Local environment variables
└── tsconfig.json           # TypeScript configuration
```

## Setup & Installation

### 1. Configure Environment
By default, the client looks for the FastAPI backend at `http://127.0.0.1:8000`. You can configure this by modifying the `.env.local` file at the root of the `client` directory:
```env
NEXT_PUBLIC_API_URL='http://127.0.0.1:8000'
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

## Features

* **Dynamic Rosters:** Automatically fetches elements from the Python backend to build selectable interactive cards.
* **Algebraic Terminal Console:** A custom-built, fully animated terminal that visualizes the raw computational logic and mathematical proofs returned by the backend.
* **Real-time Lattice Graphs:** Visualizes the $Q$ poset structures and highlights operational results.
