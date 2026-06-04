# BookVault — Secure Cloud Library Management System

BookVault is a high-performance, single-screen cloud administrative console designed for university libraries. It enables head librarians and library staff to catalogue book inventories, onboard library patrons, issue checkout loans, log outstanding fine payments, and generate live analytical metrics in a consolidated UI.

Powered by a **Persistent Local Database engine**, BookVault ensures state changes (such as added books, newly registered library members, overdue transactions, and fine payments) survive page refreshes and browser crash events.

---

## 🔑 Administrative Access Portal

For secure local environments, BookVault implements an administrative sign-in portal. Access can be granted via seeded sample personnel or via custom-registered users on the fly.

### Preserved Seed Accounts (Sample Crew):
*   **Owner / Super Admin Role:**
    *   **Email:** `sarah.jenkins@bookvault.org`
    *   **Password:** `sarah_pass_2026`
*   **Circulation Desk Staff:**
    *   **Email:** `james.carter@bookvault.org`
    *   **Password:** `james_circ_desk`
*   **Database Associate:**
    *   **Email:** `elena.r@bookvault.org`
    *   **Password:** `elena_db_pass`

---

## 🛡️ Core Highlights & Capabilities

*   **Pristine UI / UX:** High-contrast layout optimized with a **Slate Obsidian theme**, interactive hover states, dynamic dashboard indicators, and custom alerts.
*   **Database Panel:** A dedicated maintenance view to monitor counts of specific tables (Books, Patrons, Loans, Reservations, Fines), download JSON database snapshots, or restore the platform to clean factory-seeded conditions.
*   **Administrative Onboarding:** Dynamic registration of new administrative accounts directly on the landing screen, instantly persistent across visits.
*   **Fine & Loan Calibration:** Fine policies, Grace Periods, and maximum fine locks can be tuned inside Settings, altering active dashboard metrics instantly.

---

## 💻 How to Run Locally

Follow these quick commands to spin up BookVault on your local hardware node.

### 1. Prerequisites
Ensure you have the latest LTS version of [Node.js](https://nodejs.org/) installed on your computer.

### 2. Enter the Workspace Directory
Initialize a terminal shell inside the directory where the source code is located:
```bash
cd bookvault-app
```

### 3. Install Dependencies
Retrieve all React, Vite, and utility framework elements from npm:
```bash
npm install
```

### 4. Direct Dev Boot
Ignite the Vite-powered development server to host the workspace locally:
```bash
npm run dev
```

During boot progress, Vite binds to **port 3000**. Open your preferred internet browser and load:
*   [http://localhost:3000](http://localhost:3000)

### 5. Build for Production
To bundle and compile the application assets for high-velocity standalone production hosting:
```bash
npm run build
```

The production assets will compile cleanly inside the custom `./dist` directory.

---

## 📂 Active Storage Schema

The system emulates custom database queries and tables utilizing the browser's persistent `localStorage` indices. The tables are structured under the following keys:

1.  `bookvault_books` — Catalog of materials, copies, and classifications.
2.  `bookvault_members` — Active university student profile records, phone credentials, and account statuses.
3.  `bookvault_issues` — Dispatch logs representing active loans and expected return dates.
4.  `bookvault_reservations` — Holds and backlog queues.
5.  `bookvault_fines` — Accounting ledger representing unresolved penalty bills.
6.  `bookvault_operators` — Persistent record representing registered credential keys for administrative staff.
7.  `bookvault_notifications` — Live notification triggers and alarm cues.
