# Haven — Curated Luxury Stays & AI Concierge

<div align="center">

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br />

**"Stay differently."**  
*A boutique luxury hospitality platform pairing handpicked architectural sanctuaries with an intelligent AI travel concierge.*

[Live Demo](http://localhost:5173) · [Explore Stays](#-curated-stay-catalog) · [AI Concierge](#-ai-concierge--smart-search) · [Host Dashboard](#-host-management--analytics) · [Setup Guide](#-getting-started)

</div>

---

## 📖 Overview

**Haven** is a high-end luxury stays platform engineered with **React 18**, **TypeScript**, **Tailwind CSS**, and **OpenAI**. Inspired by premium architectural journals and bespoke travel clubs, Haven reimagines vacation rental discovery by replacing rigid checkbox filters with an intuitive, conversational AI concierge capable of turning feelings and moods into tailored travel itineraries.

Built as a standalone, vendor-independent application with full client-side persistence and zero reliance on proprietary cloud backends.

---

## ✨ Key Features

### 🤖 AI Travel Concierge & Smart Search
* **Floating AI Concierge (`gpt-4o-mini`):** A floating, multi-turn assistant that understands complex, qualitative vacation prompts (e.g. *"A secluded mountain cabin for 4 with a hot tub and scenic views under $500/night"*) and responds with a curated shortlist and tailored daily itinerary.
* **Smart Natural Language Search:** Search properties using natural conversational phrases on the Explore page with real-time semantic matching.
* **AI Listing Copy Helper:** Helps prospective hosts write evocative luxury titles, compelling descriptions, and generates recommended nightly rates based on property amenities and location.
* **Smart Offline Resilience:** Includes a heuristic fallback engine ensuring all AI features continue responding gracefully with zero runtime crashes even without an API key or when offline.

### 🏡 Curated Stay Catalog & Discovery
* **Handpicked Luxury Stays:** Catalog of 12 distinct luxury retreats across Greece, Italy, France, Norway, Japan, Maldives, Indonesia, and Spain.
* **Interactive Category Filtering:** Explore by mood and topography — *Beachfront*, *Cabins*, *Villas*, *City*, and *Countryside*.
* **Multi-Parameter Search:** Real-time price slider, guest counters, search keywords, and granular amenity filters (infinity pools, private chefs, sauna, ocean views).
* **Location & Recommendations:** "Around this stay" local points of interest guide and "Similar stays" recommendation engine on every property page.

### 📅 Booking & Private Viewing Scheduler
* **Seamless Reservation Flow:** Interactive date range picker with automatic night count calculation, dynamic pricing breakdown, and instant reservation confirmation with unique reference codes.
* **Private Viewing Appointments:** Schedule virtual video tours or in-person private viewings with time-slot management and downloadable calendar invite (`.ics`) integration.
* **Interactive Refund & Cancellation Calculator:** Transparent policy breakdowns (*Flexible*, *Moderate*, *Strict*) with a live refund calculator based on check-in lead times.

### 📊 Host Management & Analytics
* **Host with Us Landing Portal:** Dedicated public onboarding page detailing curation standards, host benefits, 3-step application flow, and partnership FAQs.
* **Administrative Host Dashboard:**
  * **Revenue & Booking Analytics:** Visual Area Charts showing monthly revenue trajectory, confirmed booking volume, and average guest rating.
  * **Listing CRUD Manager:** Create, edit, and delete luxury listings with real-time image preview and AI copywriting assistance.
  * **Reservation Pipeline:** Manage booking status (`pending`, `confirmed`, `cancelled`).
  * **Calendar Slot Blocker:** Block out inspection and viewing slots directly on the schedule.

### 💬 Guest Workspace & Messaging
* **My Trips Dashboard:** Unified guest portal tracking upcoming reservations, completed stays, scheduled viewings, and saved favorites.
* **Guest-Host Messaging Inbox:** Direct two-way messaging system with persistent conversation threads and simulated host responses.
* **Favorites System:** One-click wishlisting with instant state synchronization across cards, detail pages, and dashboards.

### 🎨 Luxury Editorial Design System
* **Bespoke Typography:** Pairing **Fraunces** (a contemporary, high-contrast serif for display headings) with **Inter** (for crisp, functional interface copy).
* **Light & Dark Luxury Palettes:** Tailored color tokens (`Ink`, `Champagne`, `Sand`, `Mist`) with instant, flicker-free theme switching via `next-themes`.
* **Micro-Interactions & Transitions:** Fluid page entrances, accordion reveals, and modal animations powered by `framer-motion` and `canvas-confetti`.
* **Interactive Brand Assets:** Dedicated press kit featuring copyable hex swatches, typography scale, and SVG emblem monograms.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Framework & Core** | [React 18.3](https://reactjs.org/), [TypeScript 5.5](https://www.typescriptlang.org/), [Vite 6](https://vitejs.dev/) |
| **Styling & Design** | [Tailwind CSS 3.4](https://tailwindcss.com/), Radix UI Primitives, Lucide React Icons |
| **Motion & UX** | [Framer Motion 11](https://www.framer.com/motion/), Canvas Confetti, Embla Carousel |
| **AI Integration** | [OpenAI API](https://platform.openai.com/) (`gpt-4o-mini`) + Built-in Heuristic Fallback Engine |
| **Data Visualization** | [Recharts 2.x](https://recharts.org/) (Interactive area charts and analytics) |
| **State & Persistence** | Browser `localStorage` client with full CRUD mock entities (`client.ts`), React Context |
| **Routing** | [React Router v6](https://reactrouter.com/) with Protected Routes and Layout wraps |
| **Linting & Quality** | ESLint 9, TypeScript Strict Mode (`tsc --noEmit`) |

---

## 📁 Project Structure

```text
haven/
├── public/                     # Static assets and web manifests
├── src/
│   ├── api/
│   │   └── client.ts           # Standalone client with localStorage persistence & mock entities
│   ├── components/
│   │   ├── ai/                 # AI Concierge, Smart Search, and AI Listing Helper
│   │   ├── booking/            # Date pickers and reservation widgets
│   │   ├── layout/             # Sticky Navbar, Footer, and Page Layout wrappers
│   │   ├── listings/           # Property cards, lightboxes, and listing forms
│   │   ├── places/             # Nearby attractions and stay recommendation cards
│   │   ├── search/             # Filter panels, search bars, and category selectors
│   │   └── ui/                 # Reusable Radix UI & design system primitives
│   ├── hooks/                  # Custom React hooks (window size, responsive helpers)
│   ├── lib/
│   │   ├── AuthContext.jsx     # Authentication and session state
│   │   ├── FavoritesContext.jsx# Persistent saved listings context
│   │   ├── ThemeContext.jsx    # Light/Dark mode state management
│   │   ├── constants.js        # Curated image pools, amenities, and categories
│   │   ├── curatedStays.ts     # Curated initial catalog (12 flagship stays)
│   │   ├── format.js           # Currency, date, and reference formatters
│   │   ├── openai.ts           # OpenAI client integration & heuristic fallbacks
│   │   └── seo.js              # Dynamic page title and meta tags hook
│   ├── pages/                  # Route views (Home, Explore, ListingDetail, Host, etc.)
│   ├── types/                  # Strict TypeScript definitions for AI & Listings
│   ├── App.tsx                 # Application router & route protection
│   ├── main.tsx                # React root entrypoint
│   └── index.css               # Tailwind CSS theme variables & typography
├── .env.local                  # Local environment configuration (OpenAI API key)
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Design tokens & color system
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.js              # Vite build setup with path aliases
```

---

## 🚀 Getting Started

### Prerequisites

* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/haven.git
cd haven
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables (Optional)

Create a `.env.local` file in the root directory:

```env
# Optional: Provide your OpenAI API key for live GPT-4o-mini features
VITE_OPENAI_API_KEY=sk-proj-yourOpenAiApiKeyHere
```

> **Note:** If no API key is supplied, Haven automatically falls back to its built-in intelligent heuristic engine, allowing full exploration of the AI Concierge, Smart Search, and Listing Helper with zero configuration and zero crashes.

### 4. Start Local Development Server

```bash
npm run dev
```

Navigate to `http://localhost:5173` to explore Haven.

---

## 🧪 Testing & Verification

Run the full automated test and verification suite:

```bash
# Type safety check
npm run typecheck

# Code formatting and linting
npm run lint

# Production bundle build
npm run build
```

---

## 👤 Author

**John Romeo Galan**
* GitHub: [@jrbgalan](https://github.com/jrbgalan)
* Portfolio: [Crafted as a Flagship Luxury Portfolio Project]

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
