# Vyaya-UI AI Agent Context

This document provides context and guidelines for AI agents working on the Vyaya-UI codebase.

## 🎯 Project Overview

Vyaya-UI is a community-focused React application. It uses a "Masonry" layout to display various community-related posts. The project prioritizes a clean, Pinterest-like UI.

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
