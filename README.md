# WARENOVA - Inventory Management System

WARENOVA is a comprehensive, modern Inventory Management application designed to streamline warehouse operations. Built with a robust React frontend and an Express/PostgreSQL backend, it provides real-time insights, operational tracking, and a dynamic user interface for smooth inventory operations.

## Features
- **Dashboard & KPIs**: Real-time tracking of inventory metrics and key performance indicators.
- **Inventory Management**: View, add, and manage product details.
- **Operations Tracking**: Manage and track receipts and deliveries efficiently.
- **Responsive UI**: A highly responsive, modern interface built with TailwindCSS and Framer Motion.
- **Data Visualization**: Interactive charts for inventory analysis using Recharts.

## Tech Stack
### Frontend
- **React 19**
- **Vite**
- **TailwindCSS**
- **Framer Motion**
- **Recharts**
- **Axios**
- **React Router DOM**

### Backend
- **Node.js**
- **Express.js**
- **PostgreSQL** (`pg` driver)
- **CORS**
- **dotenv**

## Folder Structure
- `Frontend_1/`: Contains the React UI and frontend assets.
- `Backend2/` (or `backend/`): Contains the Express.js server and database interactions.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) database

### Installation & Setup

#### 1. Setup the Backend
Navigate to the backend directory and install dependencies:
```bash
cd Backend2
# or cd backend
npm install
```

Create a `.env` file in the backend directory with your PostgreSQL connection string and environment variables:
```env
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/warenova
```

Start the backend server:
```bash
npm run dev
```

#### 2. Setup the Frontend
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd Frontend_1
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The application should now be running locally. You can access the frontend at the URL provided by Vite (typically `http://localhost:5173`).

## Team Members
- **Team Lead:** Utkarsh Kumar Singh
- **Members:** Ronit Soni, Nitish, Priyabrata

---
*Created for OddoXIndus Hackathon*
