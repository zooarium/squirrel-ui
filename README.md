# Squirrel

Squirrel is a modern community portal designed to connect people through shared moments, announcements, and essential community services. Built with a focus on ease of use and visual storytelling, it features a Pinterest-inspired masonry layout and multi-language support.

## 🚀 Features

- **Visual Community Feed**: A dynamic masonry grid showcasing community posts.
- **Category-Based Filtering**: Easily navigate through different types of content:
  - Shradhanjali (Memorial)
  - Matrimonial
  - Engagement & Birth Announcements
  - Birthdays & Anniversaries
  - Achievements
  - Blood Requirements
  - Community Events
  - Medical & Health
- **Responsive Design**: Optimized for all devices, from mobile phones to large desktops.
- **Infinite Scrolling**: Seamlessly explore content without pagination.
- **Community Interaction**: Post detail modals for deeper engagement.

## 🖼️ Image Recommendations

To maintain a high-quality and consistent masonry grid, we recommend the following for post images:

- **Aspect Ratio**: Portrait orientation works best (e.g., **3:4** or **2:3** ratio).
- **Dimensions**: Minimum width of **600px**. Recommended size is **600x800px**.
- **File Format**: **JPEG** or **WebP** for optimal compression.
- **File Size**: Aim for under **200KB** per image to ensure fast loading and smooth infinite scrolling.

## 🛠️ Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router 7
- **Testing**: Vitest & React Testing Library
- **Linting & Formatting**: ESLint & Prettier

## 📦 Getting Started

### Prerequisites

- Node.js (check `.nvmrc` for version)
- npm

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

### Build

Build for production:

```bash
npm run build
```

### Testing

Run tests once:

```bash
npm run test
```

## 📂 Project Structure

```
squirrel-ui/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page-level components
│   ├── test/            # Test setup and utilities
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── public/              # Public assets and mock images
└── ...                  # Configuration files (vite, tailwind, eslint, etc.)
```

## 🤝 Contributing

Contributions are welcome! Please ensure you follow the existing coding style and run linting/formatting before submitting changes.

## TODO

- Use tauri (https://github.com/tauri-apps/tauri)

## Andriod app

```
export CAPACITOR_ANDROID_STUDIO_PATH=/opt/android-studio/bin/studio
npx cap copy
npx cap open android
```

---

## Turborepo

Built with ❤️ by [Phoenix Code Labs](https://github.com/hirenchhatbar).
