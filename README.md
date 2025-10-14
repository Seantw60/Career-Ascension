🎴 Career Ascension

Career Ascension is a card-based career simulation game built with React + Vite.
Players progress through different job levels by using their skills strategically to defeat "Job Cards" (enemies), while managing limited resources, random events, and time constraints.

🚀 Features

Card-Based Combat System

Jobs appear with health points and required skills.

Players use Skill Cards to attack and complete jobs.

Skill Cards have limited uses, cooldowns, and exhaustion mechanics.

Randomized Events

Positive and negative career events (training, networking, interviews, etc.) affect the player’s deck and progress.

Career Progression

Jobs are categorized into levels:

Entry-Level

Intermediate / Senior Staff

Mid-Level

Management

Executive / Senior Management

Game Systems

Timer for each job encounter (fail if time runs out).

Turn log to track actions (last 10 turns).

Score system for successful/failed jobs.

Game Over triggers if all cards are exhausted.

Menus

Start Menu (Play, Settings, Quit).

Options Menu (Audio, Theme, customizable settings).

Game Over screen with restart option.

🏗️ Tech Stack

React
 — UI library

Vite
 — fast build tool & dev server

Framer Motion
 — animations


CSS Modules (or plain CSS) — styling

📂 Project Structure
src/
├── assets/             # images, icons, sounds
├── components/         
│   ├── cards/          # JobCard, SkillCard, EventCard
│   ├── layout/         # Playfield, PlayerHand, TurnLog, Deck, etc.
│   ├── menu/           # StartMenu, OptionsMenu, Settings
│   └── ui/             # Buttons and UI helpers
├── data/               # static skill, job, and event definitions
├── utils/              # helper functions (shuffle, timers, storage)
├── App.jsx             # root component
├── App.css             # global styles
└── main.jsx            # entry point

⚙️ Getting Started

Clone the repository and install dependencies:

git clone <repo-url>
cd career-ascension
npm install
npm run dev

🎮 How to Play

Start a new game from the Start Menu.

A Job Card will appear in the center.

Use your Skill Cards from your hand to deal damage and complete the job before the timer runs out.

Manage your deck, cooldowns, and exhausted skills carefully.

Random Events may help or hinder your progress.

Climb the career ladder from Entry-Level to Executive!

🛠️ Development Notes

Modular component design (easy to extend with new cards, jobs, or events).

Game data stored in src/data/data.js for easy editing.

Settings saved via browser local storage.

Future improvements may include difficulty modes, additional event types, and sound effects.

📜 License

This project is for educational and personal use.
Feel free to fork and modify for your own projects.


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
