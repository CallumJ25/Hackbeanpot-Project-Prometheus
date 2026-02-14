# Project Prometheus 🔥

**Financial education for everyone.**

## Quick Start

### 1. Install Node.js
Download and install from [nodejs.org](https://nodejs.org/) (LTS version recommended)

### 2. Install dependencies
Open a terminal in this folder and run:
```bash
npm install
```

### 3. Start the dev server
```bash
npm run dev
```

### 4. Open in browser
Go to `http://localhost:5173`

That's it! The page will auto-refresh when you save changes.

---

## Project Structure

```
project-prometheus/
├── index.html              # Entry HTML
├── package.json            # Dependencies
├── vite.config.js          # Vite config
├── tailwind.config.js      # Tailwind config
├── postcss.config.js       # PostCSS config
└── src/
    ├── main.jsx            # App entry point
    ├── App.jsx             # Main component
    ├── index.css           # Styles + Tailwind
    ├── config.js           # Constants
    ├── stockData.js        # Stock data
    ├── educationalData.js  # Quizzes & lessons
    ├── utils.js            # Sound & storage
    ├── components.jsx      # UI components
    └── StockSimulation.jsx # Simulation game
```

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## VS Code Extensions (Recommended)

- **ES7+ React/Redux/React-Native snippets** - React shortcuts
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **Prettier** - Code formatting

## Deploying

Build for production:
```bash
npm run build
```

This creates a `dist/` folder you can deploy to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting

---

**Made with ❤️ for financial literacy**
