# Blood Donor Registry System — Program 5
## Full Stack MERN Application (Course Outcome: CO6)

A full-stack, responsive Blood Donor Registry web application built with **React.js**, **Node.js**, **Express.js**, and **MongoDB Atlas** using **Mongoose ODM**. This project fulfills the final practical assignment (Program 5) for Course Outcome **CO6**.

---

## 🌟 Technologies Used

- **Frontend:** React 18, React Router v6, HTML5, Modern CSS3 (Red & White Medical Theme), Fetch API
- **Backend:** Node.js, Express.js, REST API Architecture
- **Database:** MongoDB Atlas Cloud Database, Mongoose ODM
- **Middleware & Security:** CORS (Cross-Origin Resource Sharing), Dotenv (Environment Variables), Centralized Error Handler
- **Build Tools:** Vite 5, npm

---

## 📁 Project Directory Structure

```text
Program 5/
├── client/                     # React.js Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable Functional Components
│   │   │   ├── BloodGroupStats.jsx
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   ├── DonorTable.jsx
│   │   │   ├── EditModal.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Notification.jsx
│   │   │   └── StatCard.jsx
│   │   ├── pages/              # Application Route Pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DonorList.jsx
│   │   │   └── RegisterDonor.jsx
│   │   ├── services/           # Backend API Integration Layer
│   │   │   └── api.js
│   │   ├── App.css             # Red & White Professional Responsive Styles
│   │   ├── App.jsx             # Router & Main App Layout
│   │   └── main.jsx            # React DOM Entry Point
│   ├── .env                    # Frontend Environment Variables
│   ├── .env.example            # Environment Template
│   ├── index.html              # HTML5 Web Page
│   ├── package.json            # Client Dependencies & Scripts
│   ├── vercel.json             # Vercel Deployment Configuration
│   └── vite.config.js          # Vite Configuration & Dev Proxy
├── server/                     # Express.js REST API Backend
│   ├── config/
│   │   └── db.js               # MongoDB Atlas Connection with Mongoose
│   ├── controllers/
│   │   └── donorController.js  # Business Logic & CRUD Operations
│   ├── middleware/
│   │   └── errorHandler.js     # Centralized Error & 404 Handlers
│   ├── models/
│   │   └── Donor.js            # Mongoose Schema & Data Validations
│   ├── routes/
│   │   ├── donorRoutes.js      # /api/donors CRUD Routes
│   │   └── statsRoutes.js      # /api/stats Analytics Routes
│   ├── .env                    # Server Environment Variables
│   ├── .env.example            # Environment Template
│   ├── package.json            # Server Dependencies & Scripts
│   ├── server.js               # Express Server Entry Point
│   └── test.js                 # Automated Integration Test Suite
├── .gitignore                  # Git Ignore Rules
└── README.md                   # Complete Documentation
```

---

## 🗄️ MongoDB Database Schema

The `Donor` model is created using Mongoose Schema (`server/models/Donor.js`) with comprehensive schema validation:

| Field Name | Type | Validation / Rules | Description |
| :--- | :--- | :--- | :--- |
| `fullName` | `String` | Required, trimmed, min: 2, max: 100 | Full name of donor |
| `age` | `Number` | Required, min: 18, max: 65 | Donor eligible age limits |
| `gender` | `String` | Required, enum: `['Male', 'Female', 'Other']` | Donor gender |
| `bloodGroup`| `String` | Required, uppercase, enum: `['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']` | Standard ABO & Rh blood group |
| `phoneNumber`| `String` | Required, regex validation (10–15 digits) | Contact phone number |
| `city` | `String` | Required, trimmed, min: 2 | City / locality of donor |
| `availabilityStatus` | `String` | Required, enum: `['Available', 'Unavailable']`, default: `'Available'` | Active donation availability |
| `createdAt` | `Date` | Default: `Date.now` | Registration timestamp |

---

## 🌐 REST API Endpoints Specification

All API endpoints return standard JSON responses with HTTP status codes:

### 1. Donors API (`/api/donors`)

- **`GET /api/donors`**
  - **Description:** Retrieve all donors with optional filtering.
  - **Query Parameters:**
    - `search`: Case-insensitive regex match on donor name or city.
    - `bloodGroup`: Exact match (e.g. `O+`, `A-`).
    - `city`: Case-insensitive match on city.
    - `availabilityStatus`: `Available` or `Unavailable`.
  - **Response:** `200 OK` — `{ success: true, count: N, data: [...] }`

- **`GET /api/donors/:id`**
  - **Description:** Retrieve a single donor by MongoDB `_id`.
  - **Response:** `200 OK` — `{ success: true, data: {...} }`
  - **Errors:** `400 Bad Request` (Invalid ObjectId), `404 Not Found` (Donor not found).

- **`POST /api/donors`**
  - **Description:** Register a new donor with schema validation.
  - **Request Body:** JSON containing `fullName`, `age`, `gender`, `bloodGroup`, `phoneNumber`, `city`, `availabilityStatus`.
  - **Response:** `201 Created` — `{ success: true, message: "...", data: {...} }`
  - **Errors:** `400 Bad Request` with field-level validation messages.

- **`PUT /api/donors/:id`**
  - **Description:** Update an existing donor record.
  - **Request Body:** Fields to update.
  - **Response:** `200 OK` — `{ success: true, message: "...", data: {...} }`
  - **Errors:** `400 Bad Request`, `404 Not Found`.

- **`DELETE /api/donors/:id`**
  - **Description:** Permanently remove a donor record from MongoDB.
  - **Response:** `200 OK` — `{ success: true, message: "...", data: {...} }`
  - **Errors:** `400 Bad Request`, `404 Not Found`.

### 2. Statistics API (`/api/stats`)

- **`GET /api/stats`**
  - **Description:** Returns aggregate metrics for the dashboard.
  - **Response:** `200 OK`
    ```json
    {
      "success": true,
      "data": {
        "totalDonors": 24,
        "availableDonors": 18,
        "unavailableDonors": 6,
        "bloodGroupStats": {
          "A+": { "total": 5, "available": 4 },
          "A-": { "total": 2, "available": 1 },
          "B+": { "total": 6, "available": 5 },
          "B-": { "total": 1, "available": 1 },
          "AB+": { "total": 3, "available": 2 },
          "AB-": { "total": 1, "available": 0 },
          "O+": { "total": 4, "available": 3 },
          "O-": { "total": 2, "available": 2 }
        },
        "recentDonors": [...],
        "cities": ["Ahmedabad", "Bangalore", "Delhi", "Mumbai", "Pune"]
      }
    }
    ```

---

## 💻 Local Setup & Execution Instructions

### Step 1: Install Backend Dependencies
Open a terminal and navigate to `server/`:
```bash
cd "d:\web_dev\BloodDonorRegistry\Program 5\server"
npm install
```

### Step 2: Configure Environment Variables

1. **Backend (`server/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/blood_donor_registry?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```
*(Replace `<username>` and `<password>` with your MongoDB Atlas database user credentials).*

2. **Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Run the Backend Server
```bash
cd "d:\web_dev\BloodDonorRegistry\Program 5\server"
npm start
# or for auto-reload during development:
npm run dev
```
Backend will start on: **`http://localhost:5000`**

### Step 4: Install Frontend Dependencies & Run
In a second terminal window:
```bash
cd "d:\web_dev\BloodDonorRegistry\Program 5\client"
npm install
npm run dev
```
Frontend will launch at: **`http://localhost:5173`**

### Step 5: Run Automated Tests
To verify all REST API endpoints, MongoDB connection, validation rules, and CORS configuration:
```bash
cd "d:\web_dev\BloodDonorRegistry\Program 5\server"
npm test
```

---

## 🚀 Deployment Guide

### A. Backend Deployment on Render

1. Create a free account on [Render](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository or use Public Git Repo.
4. Set the following configuration:
   - **Root Directory:** `Program 5/server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/blood_donor_registry?retryWrites=true&w=majority`
   - `CLIENT_URL`: `https://your-frontend-domain.vercel.app`
6. Click **Deploy Web Service**.
7. Copy the assigned URL (e.g. `https://blood-donor-registry-api.onrender.com`).

### B. Frontend Deployment on Vercel

1. Create a free account on [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your Git repository.
4. Set the **Root Directory** to `Program 5/client`.
5. Framework Preset: **Vite**.
6. Build and Output Settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
7. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://blood-donor-registry-api.onrender.com/api` (Render backend URL).
8. Click **Deploy**.
9. The site will be live with SPA client-side routing rewrites handled by `client/vercel.json`.

---

## 🎯 Verification Checklist

- [x] Full stack integration: React frontend communicating with Express backend.
- [x] MongoDB Atlas persistence using Mongoose ODM.
- [x] Complete REST API endpoints implemented (GET, POST, PUT, DELETE, Stats).
- [x] Input validations for age (18-65), blood groups, phone numbers, and cities.
- [x] Professional Red & White medical theme with responsive layout.
- [x] Dashboard with live counters, blood group inventory grid, and recent donors.
- [x] Search by name and multi-criteria filters (blood group, city, availability).
- [x] In-place editing via modal and permanent deletion with confirmation.
- [x] CORS middleware configured for cross-origin security.
- [x] Separate `.env` and `.env.example` configurations.
- [x] Vercel and Render deployment configurations included.
- [x] Existing programs (Program 1, 2, 3, 4) left completely untouched.
