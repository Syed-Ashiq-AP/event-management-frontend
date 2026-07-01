# Event Management System - Frontend

## Overview

The frontend provides a modern web interface for organizers and participants to manage events.

It is built using **React**, **TypeScript**, and **Vite**, with reusable components and responsive layouts.

---

# Tech Stack

- React
- TypeScript
- Vite
- Better Auth Client
- Vitest
- React Testing Library
- jsdom
- CSS
- Component-based Architecture

---

# Features

- User Authentication
- Dashboard
- Event Listing
- Event Registration
- Organizer Dashboard
- Participant Dashboard
- Certificate Viewer
- Responsive UI
- Protected Pages

---

# Folder Structure

```
frontend/
│
├── components
│   ├── forms
│   │   └── event.tsx
│   ├── header.tsx
│   └── ui
│       ├── avatar.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── date-time-input.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── empty.tsx
│       ├── field.tsx
│       ├── input-group.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── popover.tsx
│       ├── profile.tsx
│       ├── scroll-area.tsx
│       ├── separator.tsx
│       ├── skeleton.tsx
│       ├── sonner.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       └── textarea.tsx
├── components.json
├── global.d.ts
├── hooks
│   └── use-user.tsx
├── index.html
├── lib
│   ├── providers.ts
│   └── utils.ts
├── package-lock.json
├── package.json
├── public
│   ├── favicon.svg
│   └── icons.svg
├── README.md
├── src
│   ├── App.tsx
│   ├── assets
│   ├── index.css
│   ├── main.tsx
│   └── pages
│       ├── certificatesPage.tsx
│       ├── eventsPage.tsx
│       ├── homePage.tsx
│       ├── login.tsx
│       ├── organizePage.tsx
│       ├── organizerEvents.tsx
│       ├── overviewPage.tsx
│       ├── participantEvents.tsx
│       ├── registationsPage.tsx
│       └── signup.tsx
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite-env.d.ts
└── vite.config.ts
```

---

# Application Flow

User

↓

Login

↓

Dashboard

↓

Browse Events

↓

Register

↓

View Registrations

↓

Download Certificate

---

# Pages

- Home
- Login
- Signup
- Events
- Organizer Events
- Participant Events
- Registrations
- Certificates
- Organizer Dashboard
- Overview

---

# Components

Reusable UI Components

- Header
- Forms
- Buttons
- Cards
- Dialogs
- Calendar
- Tables
- Charts
- Inputs
- Avatar
- Dropdown Menu
- Tabs

---

# Hooks

- User Authentication Hook
- Session Management

---

# Environment Variables

```
VITE_API_URL=http://localhost:5000
```

---

# Installation

```bash
npm install
```

---

# Start Development Server

```bash
npm run dev
```

---

# Build Project

```bash
npm run build
```

---

# Testing

The frontend uses **Vitest** with **React Testing Library** and **jsdom** for component and page testing.

Test configuration:

- `vite.config.ts` configures Vitest with the `jsdom` environment.
- `src/__test__/setup.ts` loads `@testing-library/jest-dom`.
- `tsconfig.test.json` gives test files access to Vitest globals, jest-dom matchers, app globals, and the `@/*` path alias.
- `tsconfig.app.json` excludes test files from the production TypeScript build.

Current test coverage includes:

- App unauthenticated redirect flow
- Login page rendering and credential submit
- Sign-up page rendering and role selection before social sign-up
- Header navigation for participant and organizer roles
- Events page participant and organizer views
- Event creation form submit
- Registrations page rendering
- Certificates page rendering
- Organizer overview analytics rendering

Run tests once:

```bash
npm run test:run
```

Run tests in watch mode:

```bash
npm run test
```

Run tests with coverage:

```bash
npm run coverage
```

Type-check test files:

```bash
npx tsc -p tsconfig.test.json --noEmit
```

---

# Preview Production Build

```bash
npm run preview
```

---

# Authentication

Authentication is handled through Better Auth.

The frontend:

- Redirects users to login
- Maintains authenticated sessions
- Protects restricted pages
- Displays user information after login

---

# User Roles

Organizer

- Create Events
- Manage Events
- View Registrations
- Generate Certificates

Participant

- View Events
- Register for Events
- View Registrations
- Download Certificates

---

# Responsive Design

The application is optimized for:

- Desktop
- Tablet
- Mobile

---

# Future Improvements

- Dark Mode
- Push Notifications
- QR Scanner
- Event Filtering

---

# Author

Syed Ashiq
