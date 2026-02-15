# Vyaya-UI AI Agent Context

This document provides context and guidelines for AI agents working on the Vyaya-UI codebase.

## 🎯 Project Overview

Vyaya-UI is a React-based Expense Tracker application with a distinct "Matrix" theme. It allows users to manage transactions (income/expense), categorize them, and view financial summaries. The project prioritizes a high-contrast, hacker-aesthetic UI.

## 🎨 Design Guidelines

- **Theme**: "The Matrix" (Cyberpunk/Hacker aesthetic).
- **Color Palette**:
  - **Background**: Black (`bg-black`).
  - **Text**: Bright Green (`text-green-400`, `#4ade80`).
  - **Accents**: Darker Green (`border-green-600`, `bg-green-900/20`).
  - **Errors**: Red (`text-red-500`, `border-red-500`).
- **Typography**: Monospace font (`font-mono`) for all text.
- **Components**:
  - **Checkboxes**: MUST use the custom `.matrix-checkbox` class for a consistent green border/checkmark style. Do NOT use default browser checkboxes.
  - **Inputs/Selects**: Black background, Green text, Green border. Focus states should have a green glow/shadow.
  - **Date Inputs**: Use `[&::-webkit-calendar-picker-indicator]:invert` to ensure the calendar icon is visible against the black background.
  - **Modals**: Black background with opacity (`bg-black/80`), blurred backdrop (`backdrop-blur-sm`), and green borders.
  - **Effects**: Use `text-shadow-glow` for headings and `MatrixRain` component for background ambiance.

## 🛠️ Tech Stack & Conventions

- **React 19**: Uses functional components and hooks.
- **Tailwind CSS 4**: Modern styling approach. Look at `package.json` and `vite.config.js` for setup.
- **Vite**: Fast development and build tool.

## 📁 Key Components

- `MasonryGrid.jsx`: The heart of the landing page. Handles data fetching (mocked), infinite scroll logic, and layout columns.
- `PostCard.jsx`: Individual post item. Note: Post titles are currently hidden by design.
- `PostModal.jsx`: Full-screen view of a post details.
- `Header.jsx`: Contains navigation, category filtering, and the More Menu.

## 🖼️ Mock Data & Images

- The project currently uses mock data generated in `MasonryGrid.jsx`.
- Mock images are stored in `public/images/mock/[Category]/`.
- When adding categories, ensure local images exist or provide a fallback URL pattern.

## 📝 Coding Standards

- **Naming**: Use PascalCase for components and camelCase for variables/functions.
- **Formatting**: Adhere to Prettier and ESLint rules. Run `npm run format` and `npm run lint`.
- **Modals**: Handle body overflow (`hidden`/`auto`) when opening/closing modals to prevent background scrolling.

## 🚀 Common Tasks

- **Adding a Category**: Update `MOCK_CATEGORIES` in `MasonryGrid.jsx` and add titles to `CATEGORY_TITLES`.
- **New Page**: Create component in `src/pages/`, add route in `App.jsx`, and link in `Header.jsx` or `Footer.jsx`.
