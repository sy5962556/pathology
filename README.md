# 🔬 PathLab — Pathology Lab Management System

A modern, feature-rich pathology laboratory management application built with **React** and **Vite**. PathLab streamlines lab workflows by providing an intuitive interface for managing patients, test reports, and lab analytics — all wrapped in a sleek glassmorphic UI.

---

## ✨ Features

| Module             | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| **Dashboard**      | At-a-glance overview of lab activity, recent reports, and key metrics       |
| **Patient Management** | Add, search, and manage patient records with status tracking            |
| **Test Reports**   | Create, view, edit, and download test reports with full CRUD support        |
| **Analytics**      | Visual charts and insights powered by Recharts                             |
| **PDF Generation** | Download polished lab reports as PDF using jsPDF + html2canvas             |
| **Toast Notifications** | Real-time feedback on user actions                                    |

---

## 🛠️ Tech Stack

- **Frontend:** React 19, React Router v7
- **Build Tool:** Vite 7
- **Charts:** Recharts
- **Icons:** Lucide React
- **PDF Export:** jsPDF, html2canvas
- **Styling:** Vanilla CSS with glassmorphism design

---

## 📁 Project Structure

```
pathology/
├── public/                   # Static assets
├── src/
│   ├── assets/               # Images & media
│   ├── components/           # Reusable UI components
│   │   ├── Layout.jsx        # App shell (sidebar + header + content)
│   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   ├── Header.jsx        # Top header with search & actions
│   │   ├── Modal.jsx         # Reusable modal dialog
│   │   ├── GlobalModals.jsx  # App-wide modals (Add Patient, New Report)
│   │   ├── PDFGenerator.jsx  # PDF report generation
│   │   └── Toast.jsx         # Toast notification system
│   ├── context/
│   │   └── AppDataContext.jsx # Global state management
│   ├── pages/
│   │   ├── Dashboard.jsx     # Dashboard overview
│   │   ├── Patients.jsx      # Patient directory
│   │   ├── Tests.jsx         # Test reports listing
│   │   ├── Analytics.jsx     # Analytics & charts
│   │   ├── ReportView.jsx    # Full report viewer
│   │   └── EditReport.jsx    # Full-page report editor
│   ├── App.jsx               # Root component & routing
│   ├── main.jsx              # App entry point
│   └── index.css             # Global styles & design tokens
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pathology.git
cd pathology

# Install dependencies
npm install
```

### Development

```bash
# Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**.

### Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## 🗺️ Routes

| Path               | Page            | Description                    |
|--------------------|-----------------|---------------------------------|
| `/`                | Dashboard       | Home / overview                 |
| `/patients`        | Patients        | Patient directory               |
| `/tests`           | Test Reports    | All test reports                |
| `/report/:id`      | Report View     | View a single report            |
| `/edit-report/:id` | Edit Report     | Edit an existing report         |
| `/analytics`       | Analytics       | Charts & lab insights           |
| `/settings`        | Settings        | *(Coming soon)*                 |

---

## 📜 Available Scripts

| Command            | Description                          |
|--------------------|--------------------------------------|
| `npm run dev`      | Start Vite dev server with HMR       |
| `npm run build`    | Create production build              |
| `npm run preview`  | Preview the production build locally |
| `npm run lint`     | Run ESLint on the codebase           |

---

## 📄 License

This project is private and not currently licensed for public distribution.
