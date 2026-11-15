# Blood Donor Registry System - REST API (Program 4)

**Course Outcome:** CO5 - Develop server-side applications, REST APIs, and implement authentication and data security mechanisms.  
**Technology Stack:** Node.js, Express.js, JSON Web Tokens (JWT), bcrypt, dotenv.

---

## 1. Project Overview

Program 4 implements a complete RESTful API for the **Blood Donor Registry System** using **Express.js**. It features modular MVC-style architecture, full CRUD operations on blood donor records, custom middleware for logging and data validation, password hashing with **bcrypt**, stateless authentication with **JWT**, and centralized error handling.

Data persistence is handled through structured JSON storage (`data/donors.json` and `data/users.json`) with proper error handling, maintaining clean separation between donor records and authentication users without requiring an external database.

---

## 2. Directory Structure

```text
Program 4/
│
├── server.js                      # Express application entry point & route mounting
├── package.json                   # Project metadata, scripts, and dependencies
├── .env                           # Environment configuration (PORT, JWT_SECRET)
├── .env.example                   # Template environment file with placeholders
├── README.md                      # Complete documentation, API guide & Postman samples
├── test.js                        # Automated end-to-end test suite
│
├── data/
│   ├── donors.json                # JSON file storage for blood donor records
│   └── users.json                 # JSON file storage for user accounts & bcrypt hashes
│
├── routes/
│   ├── donorRoutes.js             # Route endpoints for Blood Donor CRUD operations
│   └── authRoutes.js              # Route endpoints for user registration & login
│
├── middleware/
│   ├── logger.js                  # Custom HTTP request logging middleware
│   ├── validation.js              # Donor & user registration input validation
│   ├── authMiddleware.js          # JWT verification & route protection middleware
│   └── errorHandler.js            # Centralized 404 & global error handling
│
└── controllers/
    ├── donorController.js         # Business logic & file I/O for donor CRUD
    └── authController.js          # Registration (bcrypt) & Login (JWT) logic
```

---

## 3. Technology Implementation Breakdown

| Component | Implemented In | Description |
| :--- | :--- | :--- |
| **Express.js Server** | `server.js` | Configures Express app, loads environment variables, registers global middlewares (`express.json()`, `requestLogger`), defines base route `/`, mounts modular routers, and handles server lifecycle. |
| **CRUD Operations** | `controllers/donorController.js`, `routes/donorRoutes.js` | Complete Create (`POST /api/donors`), Read (`GET /api/donors`, `GET /api/donors/:id`), Update (`PUT /api/donors/:id`), and Delete (`DELETE /api/donors/:id`) operations. |
| **Request Logging Middleware** | `middleware/logger.js` | Logs HTTP method, requested URL, and ISO timestamp for every incoming request before calling `next()`. |
| **Input Validation Middleware** | `middleware/validation.js` | Verifies presence and format of required fields: name, age (18–65), phone number (10 digits), blood group (A+, A-, B+, B-, AB+, AB-, O+, O-), and availability. Returns HTTP 400 Bad Request with descriptive errors if invalid. |
| **Bcrypt Password Hashing** | `controllers/authController.js` | `bcrypt.hash(password, 10)` securely hashes passwords before saving to `data/users.json`. `bcrypt.compare()` safely verifies passwords during login. Plain-text passwords are never stored or returned. |
| **JWT Authentication** | `controllers/authController.js`, `middleware/authMiddleware.js` | `jwt.sign()` generates a signed token upon successful login. `authenticateToken` middleware inspects the `Authorization: Bearer <token>` header, verifies the signature using `process.env.JWT_SECRET`, and attaches `req.user`. |
| **Protected Route** | `server.js` (`GET /api/protected`) | Route guarded by `authenticateToken`. Only requests with valid tokens receive access and the decoded user payload. |
| **Centralized Error Handling** | `middleware/errorHandler.js` | Catches unhandled errors, JSON syntax errors, JWT verification errors, and handles 404 Not Found for undefined routes. |

---

## 4. Setup and Execution

### Step 1: Open Terminal in Program 4 Directory
```bash
cd "D:\web_dev\BloodDonorRegistry\Program 4"
```

### Step 2: Install Dependencies
```bash
npm install
```
*(Dependencies: `express`, `bcrypt`, `bcryptjs`, `jsonwebtoken`, `dotenv`)*

### Step 3: Configure Environment Variables
Verify `.env` exists (copied from `.env.example` if needed):
```env
PORT=4000
JWT_SECRET=blood_donor_registry_secret_key_2026_secure
```

### Step 4: Start the Server
```bash
npm start
```
*Or using Node directly:*
```bash
node server.js
```

### Step 5: Run Automated Tests
```bash
npm test
```
*Or:*
```bash
node test.js
```
The test suite executes 44 automated assertions covering all CRUD endpoints, validation checks, bcrypt hashing, JWT issuance, route protection, and error handlers.

---

## 5. API Endpoints Reference

### Base URL: `http://localhost:4000`

### Summary Table

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/` | API status, info & available endpoints | No |
| `GET` | `/api/donors` | Retrieve all registered donors (filterable) | No |
| `GET` | `/api/donors/:id` | Retrieve single donor by ID | No |
| `POST` | `/api/donors` | Register a new donor (validated) | No |
| `PUT` | `/api/donors/:id` | Update an existing donor by ID | No |
| `DELETE` | `/api/donors/:id` | Delete a donor by ID | No |
| `POST` | `/api/auth/register` | Register user (hashes password with bcrypt) | No |
| `POST` | `/api/auth/login` | Login user & receive signed JWT | No |
| `GET` | `/api/protected` | Test protected resource | **Yes (Bearer JWT)** |

---

## 6. Postman Requests & Sample Responses

### 1. Root & Health Check
- **Method:** `GET`
- **URL:** `http://localhost:4000/`
- **Response:** `200 OK`
```json
{
  "project": "Blood Donor Registry System",
  "program": "Program 4 - REST API with Express.js, JWT and bcrypt",
  "courseOutcome": "CO5",
  "status": "Server is running",
  "port": 4000,
  "endpoints": { ... }
}
```

---

### 2. Retrieve All Donors
- **Method:** `GET`
- **URL:** `http://localhost:4000/api/donors`
- **Optional Query Filters:**
  - `http://localhost:4000/api/donors?bloodGroup=O+`
  - `http://localhost:4000/api/donors?city=Bengaluru`
  - `http://localhost:4000/api/donors?availabilityStatus=Available`
- **Response:** `200 OK`
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "fullName": "Rahul Sharma",
      "age": 28,
      "gender": "Male",
      "bloodGroup": "O+",
      "phoneNumber": "9876543210",
      "city": "Bengaluru",
      "availabilityStatus": "Available"
    },
    {
      "id": 2,
      "fullName": "Priya Patel",
      "age": 24,
      "gender": "Female",
      "bloodGroup": "A+",
      "phoneNumber": "9876543211",
      "city": "Mumbai",
      "availabilityStatus": "Available"
    },
    {
      "id": 3,
      "fullName": "Amit Verma",
      "age": 35,
      "gender": "Male",
      "bloodGroup": "B-",
      "phoneNumber": "9876543212",
      "city": "Delhi",
      "availabilityStatus": "Unavailable"
    }
  ]
}
```

---

### 3. Retrieve Donor by ID
- **Method:** `GET`
- **URL:** `http://localhost:4000/api/donors/1`
- **Response (Found):** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "Rahul Sharma",
    "age": 28,
    "gender": "Male",
    "bloodGroup": "O+",
    "phoneNumber": "9876543210",
    "city": "Bengaluru",
    "availabilityStatus": "Available"
  }
}
```
- **Response (Not Found):** `404 Not Found`
```json
{
  "success": false,
  "message": "Donor with ID 999 not found."
}
```

---

### 4. Register a New Donor
- **Method:** `POST`
- **URL:** `http://localhost:4000/api/donors`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "fullName": "Sneha Reddy",
  "age": 26,
  "gender": "Female",
  "bloodGroup": "O-",
  "phoneNumber": "9876501234",
  "city": "Hyderabad",
  "availabilityStatus": "Available"
}
```
- **Response:** `201 Created`
```json
{
  "success": true,
  "message": "New blood donor registered successfully.",
  "data": {
    "id": 4,
    "fullName": "Sneha Reddy",
    "age": 26,
    "gender": "Female",
    "bloodGroup": "O-",
    "phoneNumber": "9876501234",
    "city": "Hyderabad",
    "availabilityStatus": "Available"
  }
}
```

---

### 5. Input Validation Error (Invalid Input)
- **Method:** `POST`
- **URL:** `http://localhost:4000/api/donors`
- **Headers:** `Content-Type: application/json`
- **Request Body (Invalid: age under 18, invalid phone, missing blood group):**
```json
{
  "fullName": "Kiran Rao",
  "age": 16,
  "gender": "Male",
  "phoneNumber": "123",
  "city": "Chennai",
  "availabilityStatus": "Available"
}
```
- **Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Validation Failed: Age must be an integer between 18 and 65 years. Blood Group is required and must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-. Phone Number must be a valid 10-digit number.",
  "errors": [
    "Age must be an integer between 18 and 65 years.",
    "Blood Group is required and must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-.",
    "Phone Number must be a valid 10-digit number."
  ]
}
```

---

### 6. Update Donor by ID
- **Method:** `PUT`
- **URL:** `http://localhost:4000/api/donors/1`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "fullName": "Rahul Sharma",
  "age": 29,
  "gender": "Male",
  "bloodGroup": "O+",
  "phoneNumber": "9876543210",
  "city": "Bengaluru",
  "availabilityStatus": "Unavailable"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Donor with ID 1 updated successfully.",
  "data": {
    "id": 1,
    "fullName": "Rahul Sharma",
    "age": 29,
    "gender": "Male",
    "bloodGroup": "O+",
    "phoneNumber": "9876543210",
    "city": "Bengaluru",
    "availabilityStatus": "Unavailable"
  }
}
```

---

### 7. Delete Donor by ID
- **Method:** `DELETE`
- **URL:** `http://localhost:4000/api/donors/4`
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Donor with ID 4 deleted successfully.",
  "data": {
    "id": 4,
    "fullName": "Sneha Reddy",
    "age": 26,
    "gender": "Female",
    "bloodGroup": "O-",
    "phoneNumber": "9876501234",
    "city": "Hyderabad",
    "availabilityStatus": "Available"
  }
}
```

---

### 8. User Registration (Password Hashed with bcrypt)
- **Method:** `POST`
- **URL:** `http://localhost:4000/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "username": "dr_arun",
  "password": "secureHospitalPassword123",
  "email": "arun@redcross.org",
  "fullName": "Dr. Arun Kumar",
  "role": "doctor"
}
```
- **Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully with hashed password.",
  "data": {
    "id": 3,
    "username": "dr_arun",
    "email": "arun@redcross.org",
    "fullName": "Dr. Arun Kumar",
    "role": "doctor",
    "createdAt": "2026-11-15T10:35:00.000Z"
  }
}
```
*(Notice: The password field is omitted from the response, and in `data/users.json` it is stored as a bcrypt hash like `$2b$10$...`)*

---

### 9. User Login & JWT Generation
- **Method:** `POST`
- **URL:** `http://localhost:4000/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Authentication successful. JWT generated.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYmxvb2RyZWdpc3RyeS5vcmciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3OTQ3Mzg3NjgsImV4cCI6MTc5NDc0MjM2OH0.XXXXXXXXXX",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@bloodregistry.org",
    "role": "admin"
  }
}
```

---

### 10. Access Protected Route (Valid JWT)
- **Method:** `GET`
- **URL:** `http://localhost:4000/api/protected`
- **Headers:**  
  `Authorization: Bearer <paste_token_here>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Access granted! You have reached the protected Blood Donor Registry route.",
  "authenticatedUser": {
    "id": 1,
    "username": "admin",
    "email": "admin@bloodregistry.org",
    "role": "admin",
    "iat": 1794738768,
    "exp": 1794742368
  }
}
```

---

### 11. Access Protected Route Without Token / Invalid Token
- **Method:** `GET`
- **URL:** `http://localhost:4000/api/protected`
- **No Headers (or invalid token)**
- **Response (Missing Token):** `401 Unauthorized`
```json
{
  "success": false,
  "message": "Access denied. No authentication token provided. Please include Authorization header."
}
```
- **Response (Invalid/Expired Token):** `401 Unauthorized`
```json
{
  "success": false,
  "message": "Invalid or expired token. Authentication failed.",
  "error": "jwt malformed"
}
```

---

### 12. Centralized 404 Route Handler
- **Method:** `GET`
- **URL:** `http://localhost:4000/api/unknown-service`
- **Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Resource not found: Cannot GET /api/unknown-service"
}
```

---

## 7. Viva / Exam Questions & Concepts Summary

1. **Why use Express.js instead of core `http`?**  
   Express simplifies routing, provides built-in and third-party middleware support, handles request bodies and headers easily, and provides clean error-handling mechanisms.

2. **What is Middleware in Express?**  
   Middleware functions have access to the request (`req`), response (`res`), and the `next` function in the application’s request-response cycle. They can execute code, make changes to request/response objects, end the cycle, or pass control using `next()`.

3. **What is bcrypt and why use salt rounds?**  
   `bcrypt` is an adaptive one-way hashing function designed for passwords. Salt rounds (e.g., 10) add random salt data to prevent rainbow table attacks and make brute-force cracking computationally expensive.

4. **What is a JWT and how does it work?**  
   JSON Web Token consists of three parts separated by dots: Header, Payload, and Signature (`header.payload.signature`). It is stateless—the server verifies the signature using a secret key without needing server-side session memory.

5. **Where are passwords stored?**  
   In `data/users.json`, exclusively as bcrypt hashes (never in plain text). Even if the file is viewed, original passwords cannot be reversed.
