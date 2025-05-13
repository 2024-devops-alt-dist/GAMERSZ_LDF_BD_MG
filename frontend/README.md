# 🚀 Frontend Vite + React + TypeScript + TailwindCSS

This is a **modern frontend** project built with [Vite](https://vitejs.dev/), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [TailwindCSS](https://tailwindcss.com/), featuring routing via `react-router-dom` and styled components using `daisyUI`.

## 📦 Tech Stack & Dependencies.

- **Vite** – Fast build tool and development server.
- **React 19** – Component-based UI library.
- **TypeScript** – Static type checking for JavaScript.
- **TailwindCSS 4 + daisyUI** – Utility-first CSS + prebuilt components.
- **React Router DOM 7** – Declarative routing system.
- **ESLint** – Code linter for consistency and quality.

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) / [npm](https://www.npmjs.com/) / [yarn](https://yarnpkg.com/)

> ⚠️ This README uses `npm` commands. If you use `pnpm` or `yarn`, adjust accordingly.

## 🚀 Getting Started

Clone the repository and install dependencies:

    git clone https://github.com/your-username/your-repo.git
    cd frontend
    npm install

## 📁 Project Structure (simplified)

    frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── routes/
    │   ├── App.tsx
    │   └── main.tsx
    ├── index.html
    ├── tsconfig.json
    └── vite.config.ts

## 🧪 Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the local development server   |
| `npm run build`   | Build the project for production     |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint to check for code issues  |

## 🎨 Styling with TailwindCSS + daisyUI

Tailwind is configured with `@tailwindcss/vite`, and `daisyUI` provides a set of customizable pre-styled components.

## 📁 Routing with React Router v7

The app uses `react-router-dom` v7 for client-side routing, supporting nested routes, lazy loading, and more.

## 🧹 Linting

This project uses ESLint with React and TypeScript plugins. Run `npm run lint` to check for code quality issues.

## 📌 Notes

- The project is set up using ES Modules (`"type": "module"`).
- Make sure your editor (like VSCode) is configured to work with TypeScript for the best developer experience.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
