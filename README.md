# Ronak Video Editor Portfolio

A full-stack portfolio web application for **Ronak**, a professional video editor. Designed as a clean, scalable monorepo with independent React (Vite) frontend and Node.js/Express backend services.

> **Current Status:** Phase 1 — Project Foundation Only (routing, shared layout placeholders, backend server setup, database connection, error handling, and health check).

---

## Tech Stack

### Frontend
- **React.js** (JavaScript)
- **Vite**
- **Tailwind CSS**
- **React Router DOM**
- **Axios**
- **Framer Motion**
- **Lucide React**

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (MongoDB Atlas in production)
- **JWT** + **HTTP-only cookies** + **bcryptjs** (prepared for authentication phase)
- **dotenv** & **cors**

### Infrastructure & Media
- **Media Storage:** Cloudinary (all portfolio videos and images will be hosted externally via Cloudinary in later phases; none are stored on the application server)
- **Hosting:** Hostinger (Frontend & Backend)
- **Version Control:** GitHub

---

## Folder Structure

```text
ronak-video-portfolio/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/          # Static UI assets (no server-hosted media)
│   │   ├── components/      # Shared components (Navbar, Footer)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── layouts/         # Page layout wrappers (MainLayout)
│   │   ├── pages/           # Public pages (About, Projects, Contact)
│   │   ├── services/        # Axios API client & service modules
│   │   └── utils/           # Constants and helper utilities
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/              # Env, database, CORS, Cloudinary config
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Error handling & route middleware
│   ├── models/              # Mongoose schemas (future phases)
│   ├── routes/              # API route definitions
│   ├── services/            # Business & integration services
│   ├── utils/               # ApiError, ApiResponse helpers
│   ├── .env.example
│   ├── app.js               # Express application setup
│   ├── package.json
│   └── server.js            # Server entry point
│
├── .env.example
├── .gitignore
└── README.md
```

---

## Public Routes

| Route       | Page     | Description                     |
| ----------- | -------- | ------------------------------- |
| `/`         | About Me | Main landing / About Me page    |
| `/projects` | Projects | Portfolio video showcase        |
| `/contact`  | Contact  | Contact information & enquiry   |

---

## Installation Instructions

Clone the repository and install dependencies independently for both `frontend` and `backend`:

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ../frontend
npm install
```

---

## Environment Variable Setup

Root reference variables are listed in `.env.example`. Configure separate `.env` files for each app before running in full mode:

1. **Backend (`backend/.env`):**
   Copy `backend/.env.example` to `backend/.env` and fill in your `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `CLOUDINARY_*` values.
2. **Frontend (`frontend/.env`):**
   Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_BASE_URL` (defaults to `http://localhost:5000/api` in development).

> **Security Note:** Never commit `.env` files. Only `.env.example` files with placeholder values are tracked in Git.

---

## Running in Development

Frontend and backend run independently in separate terminals:

### Backend Development Command
```bash
cd backend
npm run dev
```
- Runs on `http://localhost:5000` (configurable via `PORT`).
- Health check endpoint: `GET http://localhost:5000/api/health`

### Frontend Development Command
```bash
cd frontend
npm run dev
```
- Runs on `http://localhost:5173`.

---

## Future Deployment Notes (Hostinger)

- **Frontend:** Build static production assets via `cd frontend && npm run build` (outputs to `frontend/dist/`). Deploy the `dist/` build to Hostinger Static / Web Hosting with SPA fallback routing (`/* -> /index.html`).
- **Backend:** Deploy `backend/` as a Node.js application on Hostinger (or Node.js hosting plan) with `npm start` (`node server.js`).
- **Environment & CORS:** Set production environment variables (`NODE_ENV=production`, `MONGO_URI` pointing to MongoDB Atlas, `CLIENT_URL` pointing to the live Hostinger domain, `JWT_SECRET`, and `CLOUDINARY_*` keys) in the Hostinger control panel.
- **Cookies in Production:** Ensure HTTPS is enabled on the live domain so HTTP-only cookies work reliably with `secure: true` and appropriate `sameSite` configuration.
