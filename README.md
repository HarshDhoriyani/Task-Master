# Task Management System

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)

A premium, full-stack Task Management System featuring a highly interactive Kanban board, real-time drag-and-drop, and a stunning glassmorphism UI.

## ✨ Features

- **Fluid Drag-and-Drop**: Smoothly move tasks between "To Do", "In Progress", and "Done" columns.
- **Premium UI**: Glassmorphism aesthetic, sleek gradients, and smooth micro-animations.
- **Themes**: Switch between Light, Dark, and Auto (System) modes, and customize the glow with different accent colors (Purple, Emerald, Rose, Blue).
- **Advanced Task Fields**: Set Priority Levels (Low, Medium, High) and Due Dates.
- **Smart Dashboard**: Track progress visually and filter/search tasks in real-time.
- **Zero-Config Database**: Uses a local SQLite database file, so no complex database server installation is required.

## 🛠️ Tech Stack

**Frontend:**
- [React](https://reactjs.org/) (via Vite)
- Vanilla CSS (for custom glassmorphism & themes)
- `@hello-pangea/dnd` (for Drag-and-Drop)
- `react-hot-toast` (for notifications)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- `sqlite3` (Database)
- `helmet` (Security Headers)
- `dotenv` (Environment Config)

## 🚀 Getting Started

Because this is a full-stack application, you need to run both the backend server and the frontend server simultaneously in two separate terminals.

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v16 or higher recommended)

### 1. Setup & Start Backend

Open a terminal and navigate to the `backend` folder:

```bash
cd backend
npm install
node server.js
```
*The backend server will start on `http://localhost:3001` and automatically create the SQLite database file if it doesn't exist.*

### 2. Setup & Start Frontend

Open a **second** terminal and navigate to the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```
*The frontend will start (usually on `http://localhost:5173`). Open this URL in your browser to start using the app!*

## 📂 Project Structure

```text
Task Management Project/
├── backend/
│   ├── database.sqlite    # Auto-generated database file
│   ├── server.js          # Express API server & SQLite logic
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # React components (Board, Columns, Cards)
│   │   ├── App.jsx        # Main React application & Theme logic
│   │   └── index.css      # Global CSS variables & Glassmorphism styles
│   ├── index.html         # HTML entry point (imports Google Fonts)
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
└── .gitignore
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👤 Author

**Harsh Dhoriyani**

- GitHub: [@HarshDhoriyani](https://github.com/HarshDhoriyani)
