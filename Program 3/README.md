# Program 3: Blood Donor Registry System

**Course Outcome:** CO4  
**Technology:** Node.js (Core Modules Only)  
**External Dependencies:** None (Zero npm dependencies)

---

## 1. Project Overview

Program 3 is a server-side RESTful API utility for managing **Blood Donor Registry** records. It is implemented purely using Node.js built-in core modules, without third-party frameworks like Express.js or external databases.

Data persistence is handled through a local JSON file (`donors.json`), and system events are dispatched via Node.js `EventEmitter` to log real-time notifications to the terminal whenever donors are added, updated, or deleted.

---

## 2. Node.js Core Modules Architecture

| Core Module | File Location | Purpose & Implementation Details |
|---|---|---|
| **`http`** | `server.js` | Built-in HTTP server (`http.createServer`) routing REST endpoints, status codes (`200`, `201`, `400`, `404`, `405`, `500`), and headers. |
| **Streams** | `server.js` | Request body parsing using Node.js Readable Streams (`req.on('data')`, `req.on('end')`, `req.on('error')`). |
| **`fs`** | `donorManager.js` | Asynchronous file I/O (`fs.promises.readFile`, `fs.promises.writeFile`) for persistent JSON CRUD operations and handling missing file (`ENOENT`) or corrupted JSON cases. |
| **`path`** | `donorManager.js` | Cross-platform safe path construction using `path.join(__dirname, 'donors.json')`. |
| **`events`** | `events.js`, `donorManager.js` | Custom `EventEmitter` instance emitting and handling `donorAdded`, `donorUpdated`, and `donorDeleted` events with terminal notifications. |

---

## 3. Project Directory Structure

```text
Program 3/
├── donors.json         # JSON data store for donor records
├── donorManager.js     # Data layer: CRUD operations, fs/path handling, validation, event triggers
├── events.js           # Event layer: EventEmitter setup and terminal notification listeners
├── package.json        # Project metadata and start/test scripts (no external dependencies)
├── README.md           # Documentation, API reference, and testing guide
├── server.js           # Presentation layer: Native http server, stream parsing, API routing
└── test.js             # Automated test suite verifying all routes, status codes, and events
```

---

## 4. Donor Data Model

Each donor record strictly follows this schema:

| Field | Type | Description / Validation |
|---|---|---|
| `id` | String | Unique donor identifier (e.g. `"101"`, `"102"`, auto-generated if omitted) |
| `fullName` | String | Full name of the donor (min 2 characters) |
| `age` | Number | Donor age (must be an integer between 18 and 65) |
| `gender` | String | Gender (`Male`, `Female`, `Other`) |
| `bloodGroup` | String | Blood type (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`) |
| `phoneNumber` | String | 10-digit mobile number (e.g. `9876543210`) |
| `city` | String | City name (min 2 characters) |
| `availabilityStatus` | String | Current donation status (`Available` or `Unavailable`) |

---

## 5. How to Run the Server

### Prerequisites
- Node.js (version 18 or higher recommended; works on v24+)

### Terminal Commands

1. **Navigate to the Program 3 directory:**
   ```powershell
   cd "D:\web_dev\BloodDonorRegistry\Program 3"
   ```

2. **Start the HTTP Server:**
   ```powershell
   npm start
   ```
   *Alternatively:*
   ```powershell
   node server.js
   ```

3. **Console Output on Server Start:**
   ```text
   ==================================================
   Blood Donor Registry Server running on port 5000
   Server URL: http://localhost:5000
   Available API Endpoints:
     GET    http://localhost:5000/donors
     GET    http://localhost:5000/donors/:id
     POST   http://localhost:5000/donors
     PUT    http://localhost:5000/donors/:id
     DELETE http://localhost:5000/donors/:id
   ==================================================
   ```

4. **Run Automated Test Suite (Optional):**
   ```powershell
   npm test
   ```
   Runs 22 automated test cases verifying all endpoints, validations, errors, and event emissions.

---

## 6. Complete API Reference & Postman Guide

### Base URL:
`http://localhost:5000`

---

### Endpoint 1: Get All Donors
- **Method:** `GET`
- **URL:** `http://localhost:5000/donors`
- **Description:** Returns all registered donors.
- **Expected Status:** `200 OK`
- **Sample Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "101",
      "fullName": "Aarav Sharma",
      "age": 28,
      "gender": "Male",
      "bloodGroup": "O+",
      "phoneNumber": "9876543210",
      "city": "Mumbai",
      "availabilityStatus": "Available"
    },
    {
      "id": "102",
      "fullName": "Priya Patel",
      "age": 24,
      "gender": "Female",
      "bloodGroup": "A+",
      "phoneNumber": "9123456780",
      "city": "Ahmedabad",
      "availabilityStatus": "Available"
    },
    {
      "id": "103",
      "fullName": "Rahul Verma",
      "age": 32,
      "gender": "Male",
      "bloodGroup": "B-",
      "phoneNumber": "9988776655",
      "city": "Pune",
      "availabilityStatus": "Unavailable"
    }
  ]
}
```

---

### Endpoint 2: Get Donor by ID
- **Method:** `GET`
- **URL:** `http://localhost:5000/donors/101`
- **Description:** Retrieves details of a specific donor.
- **Expected Status:** `200 OK`
- **Sample Response:**
```json
{
  "success": true,
  "data": {
    "id": "101",
    "fullName": "Aarav Sharma",
    "age": 28,
    "gender": "Male",
    "bloodGroup": "O+",
    "phoneNumber": "9876543210",
    "city": "Mumbai",
    "availabilityStatus": "Available"
  }
}
```
*If ID does not exist (e.g., `/donors/999`):*
- **Status:** `404 Not Found`
```json
{
  "success": false,
  "error": "Donor with ID '999' not found."
}
```

---

### Endpoint 3: Register a New Donor
- **Method:** `POST`
- **URL:** `http://localhost:5000/donors`
- **Headers:** `Content-Type: application/json`
- **Description:** Adds a new donor record, saves it to `donors.json`, and triggers the `donorAdded` event.
- **Request Body (raw JSON):**
```json
{
  "fullName": "Sneha Kulkarni",
  "age": 26,
  "gender": "Female",
  "bloodGroup": "B+",
  "phoneNumber": "9876543219",
  "city": "Nashik",
  "availabilityStatus": "Available"
}
```
- **Expected Status:** `201 Created`
- **Sample Response:**
```json
{
  "success": true,
  "message": "Donor registered successfully.",
  "data": {
    "id": "104",
    "fullName": "Sneha Kulkarni",
    "age": 26,
    "gender": "Female",
    "bloodGroup": "B+",
    "phoneNumber": "9876543219",
    "city": "Nashik",
    "availabilityStatus": "Available"
  }
}
```
- **Terminal Event Notification Log:**
```text
--------------------------------------------------
[NOTIFICATION: EVENT EMITTED -> donorAdded]
Timestamp : 2026-11-15T09:16:04.068Z
Donor ID  : 104
Name      : Sneha Kulkarni
Blood Grp : B+
Status    : Available
City      : Nashik
Action    : Donor has been registered in the system.
--------------------------------------------------
```

---

### Endpoint 4: Update Donor Details
- **Method:** `PUT`
- **URL:** `http://localhost:5000/donors/104`
- **Headers:** `Content-Type: application/json`
- **Description:** Updates fields of an existing donor and triggers the `donorUpdated` event.
- **Request Body (raw JSON):**
```json
{
  "city": "Pune",
  "availabilityStatus": "Unavailable"
}
```
- **Expected Status:** `200 OK`
- **Sample Response:**
```json
{
  "success": true,
  "message": "Donor with ID '104' updated successfully.",
  "data": {
    "id": "104",
    "fullName": "Sneha Kulkarni",
    "age": 26,
    "gender": "Female",
    "bloodGroup": "B+",
    "phoneNumber": "9876543219",
    "city": "Pune",
    "availabilityStatus": "Unavailable"
  }
}
```
- **Terminal Event Notification Log:**
```text
--------------------------------------------------
[NOTIFICATION: EVENT EMITTED -> donorUpdated]
Timestamp : 2026-11-15T09:16:04.137Z
Donor ID  : 104
Name      : Sneha Kulkarni
Blood Grp : B+
Status    : Unavailable
City      : Pune
Action    : Donor details have been successfully updated.
--------------------------------------------------
```

---

### Endpoint 5: Delete a Donor
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/donors/104`
- **Description:** Deletes donor by ID and triggers the `donorDeleted` event.
- **Expected Status:** `200 OK`
- **Sample Response:**
```json
{
  "success": true,
  "message": "Donor with ID '104' deleted successfully.",
  "data": {
    "id": "104",
    "fullName": "Sneha Kulkarni",
    "age": 26,
    "gender": "Female",
    "bloodGroup": "B+",
    "phoneNumber": "9876543219",
    "city": "Pune",
    "availabilityStatus": "Unavailable"
  }
}
```
- **Terminal Event Notification Log:**
```text
--------------------------------------------------
[NOTIFICATION: EVENT EMITTED -> donorDeleted]
Timestamp : 2026-11-15T09:16:04.175Z
Donor ID  : 104
Name      : Sneha Kulkarni
Blood Grp : B+
Action    : Donor has been removed from the registry.
--------------------------------------------------
```

---

## 7. Error Handling & Validation Tests

### A. Validation Failure (Invalid Age or Phone)
- **Method:** `POST /donors`
- **Request Body:**
```json
{
  "fullName": "Test",
  "age": 16,
  "gender": "Male",
  "bloodGroup": "X+",
  "phoneNumber": "123",
  "city": "Mumbai",
  "availabilityStatus": "Available"
}
```
- **Status:** `400 Bad Request`
- **Response:**
```json
{
  "success": false,
  "error": "age must be an integer between 18 and 65 years. bloodGroup must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-. phoneNumber must be a valid 10-digit number (e.g., 9876543210)."
}
```

### B. Malformed JSON Body
- **Method:** `POST /donors`
- **Request Body:** `{ malformed json`
- **Status:** `400 Bad Request`
- **Response:**
```json
{
  "success": false,
  "error": "Invalid JSON format in request body."
}
```

### C. Resource Not Found
- **Method:** `GET /donors/999`
- **Status:** `404 Not Found`
- **Response:**
```json
{
  "success": false,
  "error": "Donor with ID '999' not found."
}
```

### D. Method Not Allowed
- **Method:** `PATCH /donors`
- **Status:** `405 Method Not Allowed`
- **Response:**
```json
{
  "success": false,
  "error": "Method PATCH not allowed on /donors"
}
```
