# Program 1: Blood Donor Registry System

**Course:** Full Stack Development Laboratory (3rd Year Practical Assignment)  
**Technology Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+), Fetch API, JSON Server  
**Theme:** Professional Medical Red & White Theme  

---

## 1. Project Overview

The **Blood Donor Registry System** is a single-page web application designed to connect voluntary blood donors with individuals and hospitals in need of urgent transfusions. It demonstrates core front-end and mock back-end concepts without reliance on external front-end frameworks (like React) or server frameworks (like Express).

### Key Features Implemented:
1. **Donor Registration & Validation**:
   - Captures Full Name, Age (18–65), Gender, Blood Group, Phone Number (10 digits), City, and Availability Status.
   - Comprehensive client-side validation with instant inline error feedback.
2. **REST API Communication with Fetch API (`async/await`)**:
   - **GET**: View all registered donors and populate the dashboard.
   - **POST**: Register a new donor.
   - **PUT**: Update existing donor records.
   - **DELETE**: Remove a donor with confirmation dialog.
3. **Interactive Search & Filtering**:
   - Real-time search by Donor Name.
   - Multi-criteria filter by Blood Group (A+, A-, B+, B-, AB+, AB-, O+, O-).
   - Filter by City (substring, case-insensitive).
   - "Reset Filters" button.
4. **Clean UI & Loading/Error Feedback**:
   - Red and white medical theme with status pills (Available/Unavailable) and blood drop badges.
   - Live summary metrics (Total Donors, Available Now, Unavailable).
   - Loading spinners during API calls and alert banners for success/error notifications.

---

## 2. Project Structure

```
Program1/
├── index.html       # HTML5 structure (registration form, filters, donor table, stats)
├── style.css        # Red & white responsive CSS styling (grid, badges, alerts)
├── script.js        # Vanilla JS logic: DOM manipulation, Fetch API CRUD, validation
├── db.json          # Mock REST database pre-populated with sample donor records
├── package.json     # Node.js project manifest & startup scripts
└── README.md        # Documentation, execution commands, and viva preparation
```

---

## 3. How to Run the Application

Follow these exact terminal commands to run both the mock API server and the frontend.

### Step 1: Open Terminal in the `Program1` Directory

```powershell
cd d:\web_dev\BloodDonorRegistry\Program1
```

### Step 2: Install JSON Server

If `json-server` is not already installed locally, install it:

```powershell
npm install
```

*(Alternatively, you can run JSON Server directly without installing using `npx json-server --watch db.json --port 3000`)*

### Step 3: Start the JSON Server (Mock REST API)

In your first terminal window, start the server:

```powershell
npm run server
```

The server will start at:
- **REST Endpoint:** `http://localhost:3000/donors`
- **Home:** `http://localhost:3000`

> **Note:** Keep this terminal running in the background.

---

### Step 4: Start the Frontend Application

Open a **second terminal** window:

#### Option A: Open directly in your Default Web Browser (Easiest)

On Windows PowerShell:
```powershell
start index.html
```

#### Option B: Serve via a Local HTTP Server (Recommended)

Using Node's `npx serve`:
```powershell
npx serve -l 5000 .
```
Then open `http://localhost:5000` in your web browser.

Or using Python's built-in HTTP server:
```powershell
python -m http.server 5000
```
Then open `http://localhost:5000` in your web browser.

---

## 4. REST API Endpoint Specification

The mock REST API runs on `http://localhost:3000/donors`:

| Operation | HTTP Method | Endpoint | Request Body | Response Status |
|---|---|---|---|---|
| **Get All Donors** | `GET` | `/donors` | *None* | `200 OK` (Array of Donors) |
| **Get Donor by ID** | `GET` | `/donors/:id` | *None* | `200 OK` (Single Donor) |
| **Add New Donor** | `POST` | `/donors` | JSON Object with donor details | `201 Created` |
| **Update Donor** | `PUT` | `/donors/:id` | JSON Object with updated details | `200 OK` |
| **Delete Donor** | `DELETE` | `/donors/:id` | *None* | `200 OK` |

### Sample JSON Payload (for POST / PUT):
```json
{
  "fullName": "Rahul Sharma",
  "age": 28,
  "gender": "Male",
  "bloodGroup": "O+",
  "phone": "9876543210",
  "city": "Bengaluru",
  "isAvailable": true
}
```

---

## 5. Form Validation Rules

| Field | Rule | Error Message Displayed |
|---|---|---|
| **Full Name** | Required, letters and spaces only, 3 to 50 characters | *"Name must be 3-50 letters only."* |
| **Age** | Required, integer between 18 and 65 (medical donor eligibility) | *"Donor age must be between 18 and 65."* |
| **Gender** | Required, must select Male, Female, or Other | *"Please select a gender."* |
| **Blood Group** | Required, must select one of 8 ABO/Rh groups | *"Please select a blood group."* |
| **Phone Number** | Required, 10-digit number starting with 6, 7, 8, or 9 | *"Enter a valid 10-digit mobile number (starts with 6-9)."* |
| **City** | Required, letters and spaces, minimum 2 characters | *"City must contain at least 2 letters."* |
| **Availability** | Boolean dropdown (`true` = Available, `false` = Unavailable) | Selected from dropdown |

---

## 6. Practical Exam Viva Questions & Answers

### Q1: What is JSON Server and why is it used?
**Answer:** JSON Server is a lightweight Node.js tool that creates a full fake REST API with zero coding using a simple JSON file (`db.json`). It provides standard CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) simulating a real backend database.

### Q2: What is the Fetch API and how is it different from XMLHttpRequest?
**Answer:** The Fetch API is a modern, native browser interface for making asynchronous HTTP requests. Unlike `XMLHttpRequest`, which uses callback functions and event handlers, Fetch is Promise-based and integrates seamlessly with `async/await` syntax, resulting in cleaner and more readable code.

### Q3: Explain the difference between `PUT` and `POST` HTTP methods.
**Answer:**
- **POST** is used to create a new resource on the server. It is non-idempotent (sending the same POST request multiple times creates multiple records).
- **PUT** is used to replace or update an existing resource at a specific URI (`/donors/:id`). It is idempotent (making identical PUT requests produces the exact same server state).

### Q4: Why do we use `async` and `await` with `fetch`?
**Answer:** Network requests are asynchronous and take an unpredictable amount of time to complete. `async/await` allows asynchronous code to be written and read like synchronous code. It pauses function execution until the Promise resolves without blocking the browser's main UI thread.

### Q5: How is client-side form validation implemented here?
**Answer:** We listen to the form `submit` event, prevent default page reload using `event.preventDefault()`, and validate values against regular expressions (`/^[a-zA-Z\s]{3,50}$/`, `/^[6-9]\d{9}$/`) and range checks (`age >= 18 && age <= 65`). If invalid, red border classes and inline error spans are rendered; otherwise, the Fetch request is triggered.

### Q6: How does search and filtering work without re-fetching every time?
**Answer:** Upon initial page load, `loadDonors()` fetches the records from the server and stores them in a global variable `allDonors`. When the user types in the search box or changes dropdowns, `applyFilters()` executes JavaScript's native array `.filter()` method on `allDonors` in memory, instantly updating the DOM table with matching results.
