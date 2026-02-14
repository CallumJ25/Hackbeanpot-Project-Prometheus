# Project Prometheus 🔥

**Financial education for everyone.**

## Quick Start

### 1. Install Node.js
Download and install from [nodejs.org](https://nodejs.org/) (LTS version recommended)

### 2. Install dependencies
Open a terminal in this folder and run:
```bash
npm install --legacy-peer-deps
```

### 3. Start the dev server
```bash
npm run dev
```

### 4. Open in browser
Go to `http://localhost:5173`

---

## Project Structure

```
project-prometheus/
├── index.html              # Entry HTML
├── package.json            # Dependencies
├── vite.config.js          # Vite config
├── tailwind.config.js      # Tailwind config
└── src/
    ├── main.jsx            # App entry (with Router)
    ├── App.jsx             # Routes & state management
    ├── index.css           # Styles + Tailwind
    ├── PageLayout.jsx      # Navigation components
    ├── components.jsx      # Shared UI components
    ├── config.js           # Constants
    ├── stockData.js        # Stock data
    ├── educationalData.js  # Quizzes & lessons
    ├── utils.js            # Sound & storage helpers
    ├── StockSimulation.jsx # Simulation game
    └── pages/
        ├── Home.jsx        # Landing page
        ├── Module1.jsx     # Chart Reading
        ├── Module2.jsx     # Key Metrics
        ├── Module3.jsx     # Psychology
        ├── Module4.jsx     # Common Mistakes
        ├── Simulation.jsx  # Stock Simulation
        └── Conclusion.jsx  # Final page
```

## Pages

| Page | Route | Content |
|------|-------|---------|
| Home | `/` | Intro, problem, mission |
| Module 1 | `/module/1` | Chart Reading |
| Module 2 | `/module/2` | Key Metrics |
| Module 3 | `/module/3` | Psychology |
| Module 4 | `/module/4` | Common Mistakes |
| Simulation | `/simulation` | Stock picking game |
| Conclusion | `/conclusion` | Summary & score |

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Deploying

Build for production:
```bash
npm run build
```

Deploy the `dist/` folder to Vercel, Netlify, or GitHub Pages.

---

**Made with ❤️ for financial literacy**
