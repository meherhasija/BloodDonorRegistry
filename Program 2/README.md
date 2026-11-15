# Program 2: Blood Donor Registry System

**Course Outcome:** CO3 — Full Stack Development  
**Technology Stack:** React 18, JSX, JavaScript (ES6+), CSS3, and React Router DOM v6  
**Folder:** `D:\web_dev\BloodDonorRegistry\Program 2\`

---

## 🩸 Project Overview

Program 2 is a single-page React web application designed for managing a **Blood Donor Registry System**. It features a modern, clean **red-and-white hospital/Red-Cross theme** and implements client-side state management, multi-page routing, full CRUD operations (Create, Read, Update, Delete), real-time search & filtering, and browser `localStorage` persistence.

---

## 🚀 How to Run the Application

### 1. Open Terminal and Navigate to Program 2
```bash
cd "D:\web_dev\BloodDonorRegistry\Program 2"
```

### 2. Install Dependencies (if not already installed)
```bash
npm install
```

### 3. Start the Vite Development Server
```bash
npm run dev
```

### 4. Open in Browser
Open your browser and visit:
```
http://localhost:5173/
```

---

## ✨ Features Implemented

### 1. 📊 Interactive Dashboard (`/`)
- **Metric Cards (KPIs):** Total registered donors, available donors, unavailable donors, and total blood types tracked.
- **Blood Group Inventory & Availability Matrix:** Real-time breakdown across all 8 major blood groups (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`) showing total count, available count, percentage bar, and one-click filtering.
- **Recently Registered Donors:** Compact preview of recent additions with quick links.
- **Donation Guidelines:** Medical criteria reference (age 18–65, weight, donation intervals).

### 2. 📝 Donor Registration Form (`/register`)
- Comprehensive form fields:
  - **Full Name** (text, validation for alphabets & min 3 chars)
  - **Age** (number, validation for 18 to 65 years)
  - **Gender** (select: Male, Female, Other)
  - **Blood Group** (select: A+, A-, B+, B-, AB+, AB-, O+, O-)
  - **Phone Number** (tel, validation for 10-digit mobile number)
  - **City / Location** (text, min 2 chars)
  - **Availability Status** (interactive switch toggle)
- Real-time inline validation with error messages under each field.
- Prevents invalid submissions with clear error cues.
- Auto-redirects to the Donor Directory upon successful registration.

### 3. 📋 Donor Directory & Management (`/donors`)
- **Responsive Data Table:** Lists donor details, blood group tag, contact phone link, city, live availability pill, and action buttons.
- **Real-Time Search:** Search dynamically by donor name, city, or phone number.
- **Multi-Filter Bar:**
  - Filter by Blood Group (`All`, `A+`, `A-`, `B+`, etc.)
  - Filter by Availability (`All`, `Available Only`, `Unavailable Only`)
  - Sort by (`Newest`, `Oldest`, `Name A-Z`, `Age Lowest`, `Age Highest`)
  - One-click "Reset Filters" button.
- **Interactive In-Place Editing:** Modal dialog allowing instant updates to donor information with full validation.
- **One-Click Availability Toggle:** Click any donor's status pill directly in the table to toggle their status between Available and Unavailable.
- **Secure Deletion:** Danger confirmation modal dialog before permanently removing records.
- **Empty State Views:** Informative feedback when no records match current filter criteria.

### 4. 💾 Persistent LocalStorage
- Donor records are stored in browser `localStorage` under the key `blood_donor_registry_records`.
- Pre-populated with realistic initial sample donors so the system is immediately evaluable.
- State persists across page refreshes, tab closures, and browser restarts.

---

## 🎓 Demonstration of Required React Concepts (CO3)

| React Concept | Implementation Location | Explanation |
| :--- | :--- | :--- |
| **Reusable Functional Components** | `components/Navbar.jsx`<br>`components/StatCard.jsx`<br>`components/BloodGroupStats.jsx`<br>`components/DonorForm.jsx`<br>`components/DonorTable.jsx`<br>`components/EditModal.jsx`<br>`components/Notification.jsx` | Modularity and separation of concerns. `StatCard` is reused 4 times on the dashboard; `DonorForm` is reused for both registration and modal editing. |
| **JSX Syntax** | All `.jsx` files in `src/` | Writing HTML-like structures inside JavaScript with dynamic expressions `{...}` and class attributes `className`. |
| **Props** | Passed across `App.jsx` ➔ Pages ➔ Components | Passing data and callback functions (e.g., `donors`, `totalDonors`, `onSubmit`, `onEdit`, `onDelete`, `onToggleStatus`). |
| **`useState` Hook** | `App.jsx`, `DonorForm.jsx`, `DonorList.jsx`, `Notification.jsx` | Manages donor records array, form input values, validation error states, active search terms, filter dropdowns, modal open/close states, and toast notifications. |
| **`useEffect` Hook** | `App.jsx`, `DonorForm.jsx`, `DonorList.jsx`, `EditModal.jsx`, `Notification.jsx` | Synchronizing `donors` array to `localStorage` on change; pre-filling form values in edit mode; auto-dismissing toast notifications after 4 seconds; listening for ESC key to close modal. |
| **Conditional Rendering** | `DonorTable.jsx`, `EditModal.jsx`, `Notification.jsx`, `DonorForm.jsx` | - Renders empty state card when `donors.length === 0`.<br>- Returns `null` when `isOpen` or `notification` is falsy.<br>- Green badge for `Available` vs gray for `Unavailable`.<br>- Displays inline validation error text only when errors exist. |
| **Event Handling** | `DonorForm.jsx`, `DonorList.jsx`, `DonorTable.jsx` | - `onChange` for inputs and select controls.<br>- `onSubmit` with `e.preventDefault()` for form submission.<br>- `onClick` for filter resetting, modal dismiss, deleting donors, and toggling availability. |
| **React Router DOM** | `App.jsx`, `Navbar.jsx`, `Dashboard.jsx`, `DonorList.jsx` | `BrowserRouter`, `Routes`, `Route`, `NavLink` for active nav link highlighting, `Link` for internal routing, `useNavigate` for programmatic redirects, and `useSearchParams` for URL query string sync. |

---

## 📁 Project Structure

```
Program 2/
├── package.json               # Dependencies and scripts (vite, react, react-router-dom)
├── vite.config.js             # Vite build & server configuration
├── index.html                 # HTML shell with Google Fonts & favicon
├── README.md                  # Comprehensive documentation and viva guide
└── src/
    ├── main.jsx               # React DOM root entrypoint
    ├── App.jsx                # Root component, router config, global state & handlers
    ├── App.css                # Red & white theme styles, animations, responsive rules
    ├── index.css              # Reset and CSS variables
    ├── utils/
    │   └── storage.js         # localStorage helpers, initial seed data, constants
    ├── components/
    │   ├── Navbar.jsx          # Header with logo, stats, and NavLink navigation
    │   ├── StatCard.jsx        # Reusable metric card
    │   ├── BloodGroupStats.jsx # 8-blood group distribution & availability matrix
    │   ├── DonorForm.jsx       # Reusable form with live validation for Add & Edit
    │   ├── DonorTable.jsx      # Clean data table with badges, links, and actions
    │   ├── EditModal.jsx       # Modal dialog for in-place donor editing
    │   └── Notification.jsx    # Auto-dismissing toast alert banner
    └── pages/
        ├── Dashboard.jsx       # Overview page with metrics, blood group grid, recent donors
        ├── RegisterDonor.jsx   # Dedicated donor registration page with guidelines
        └── DonorList.jsx       # Searchable, filterable, sortable donor directory
```
