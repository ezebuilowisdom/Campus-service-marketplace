# Campus Service Marketplace (Final Year Project)

An academic-grade, production-ready multi-vendor service marketplace where university students discover, book, pay for, and review services (tutoring, repairs, laundry, hair styling, photography) offered by other student vendors, backed by a secure Escrow Payout & Wallet architecture.

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Escrow & Wallet Ledger Mechanics](#-escrow--wallet-ledger-mechanics)
3. [Tech Stack & Architecture](#-tech-stack--architecture)
4. [Production Directory Structure](#-production-directory-structure)
5. [Database Schema Relationships](#-database-schema-relationships)
6. [API Route Endpoints](#-api-route-endpoints)
7. [Installation & Local Setup](#-installation--local-setup)

---

## 🎓 Project Overview
* **The Problem**: Students struggle to find trusted on-campus services. Most services are advertised via volatile methods like WhatsApp status posts, word of mouth, or Telegram group listings. Students cannot easily search, filter, compare ratings, or pay securely.
* **The Solution**: A centralized on-campus marketplace featuring advanced filters, live communication drawers, ratings, and a secure **escrow payment wallet**.
* **Role Types**:
  1. **Customer (Student)**: Book slots, secure payments in escrow, confirm delivery, and leave ratings/reviews.
  2. **Service Provider**: Create a public profile, list services (title, duration, pricing, building location), track real-time wallet balances, and request payout withdrawals.
  3. **Administrator**: Monitor platform metrics, moderate reported users, approve student provider verification badges, and process GTBank / Access bank withdrawals.

---

## 🔒 Escrow & Wallet Ledger Mechanics
To guarantee trust within a student ecosystem, the application uses an **escrow transaction system**:

```
[Customer Books Service]
           ↓
[Provider Accepts Booking Slot]
           ↓
[Customer pays Gateway (Stripe/Paystack)] ──> Triggers "escrow_hold" Wallet Transaction
                                         ──> Amount locked in Provider's "escrow_balance"
           ↓
[Provider delivers service] ──> Marks Booking as "Completed"
           ↓
[Customer Confirms Delivery] ──> Deducts from Provider's "escrow_balance"
                             ──> Deducts Platform Fee (e.g., 5% system fee)
                             ──> Adds remaining funds to Provider's "balance" (Usable)
                             ──> Triggers "escrow_release" Transaction Ledger
           ↓
[Provider Payout Withdrawal] ──> Provider submits GTBank/Zenith account details
                             ──> Admin approves withdrawal -> cash released
```

---

## 🛠️ Tech Stack & Architecture
* **Frontend**: React.js (Vite), Tailwind CSS (class-based Dark/Light toggles), Framer Motion (page animations), React Icons.
* **Backend**: Node.js, Express.js REST API.
* **Database & BaaS**: Supabase (PostgreSQL tables, indexes, triggers, and sync).
* **Payment integrations**: stripe-js & paystack-payout models simulated via Checkout Simulator.

---

## 📂 Production Directory Structure
```
STUDENT SERVICE MARKET/
│
├── client/                     # Vite + React Frontend Client
│   ├── public/                 # Static Assets
│   ├── src/
│   │   ├── components/         # Reusable Layout Elements (Navbar, ThemeToggle)
│   │   ├── pages/              # Core Application Router Pages (Landing, Dashboards)
│   │   ├── App.jsx             # Authentication Routing Guard
│   │   ├── index.css           # Tailwind + Glassmorphism rules
│   │   └── main.jsx            # Mounting Entrance
│   ├── tailwind.config.js      # Color Palettes configurations
│   └── vite.config.js          # Port & API proxy settings
│
├── server/                     # Node.js + Express API Backend
│   ├── src/
│   │   ├── config/             # Supabase Client Init
│   │   ├── controllers/        # Business Logic Controllers (auth, bookings, escrow)
│   │   ├── middlewares/        # Authentication, Error handling, Zod Validators
│   │   └── routes/             # REST Route mappings
│   ├── .env                    # Active Port & Supabase API secrets
│   ├── .env.example            # Environment variables template
│   └── server.js               # Express application entry point
│
└── supabase/                   # Supabase Database Migrations
    ├── schema.sql              # Table, constraints, trigger functions definitions
    └── seed.sql                # Categories lookup & mock provider data seeding
```

---

## 🗄️ Database Schema Relationships
The schema comprises 28 tables. Below are the primary tables:
* `profiles` linked to Supabase `auth.users` on `id UUID`.
* `roles` linked to `profiles` via `role_id` (admin, provider, customer).
* `providers` and `customers` extends `profiles` via `id REFERENCES profiles(id) ON DELETE CASCADE`.
* `services` references `providers(id)` and `categories(id)`.
* `bookings` references `customers(id)`, `services(id)`, and `booking_status(id)`.
* `payments` references `bookings(id)` (records transaction references and `escrow_status`).
* `wallets` and `wallet_transactions` maps to `profiles(id)` tracking `balance` and `escrow_balance`.

---

## 📡 API Route Endpoints

### 🔐 Authentication Routes (`/api/auth`)
* `POST /signup`: Creates auth user, synchronizes profile and sets default wallet.
* `POST /login`: Logs in user and returns session JWT.
* `GET /profile`: Retrieves user profile and wallet balance (requires auth).

### 💼 Services Routes (`/api/services`)
* `GET /`: Lists active services (supports query search, category filters, price sorting).
* `GET /categories`: Lists all available campus service categories.
* `GET /:id`: Retrieves detailed service card including provider stats & locations.
* `POST /`: Lists new service on marketplace (Providers only).
* `DELETE /:id`: Removes service listing (Providers only).

### 🗓️ Bookings Routes (`/api/bookings`)
* `POST /`: Places service booking request (Customers only).
* `GET /`: Fetches bookings list (role-restricted view).
* `PUT /:id/status`: Transitions status: `accept`, `reject`, `complete`, `confirm` (escrow release).

### 💳 Payments & Wallet Routes (`/api/payments` & `/api/wallets`)
* `POST /payments/checkout`: Checkout session simulator that marks bookings paid and places funds in escrow.
* `GET /wallets`: Fetches wallet balances.
* `POST /wallets/withdraw`: Provider request payout.

### 🛡️ Admin Routes (`/api/admin`)
* `GET /stats`: Dashboard analytics and logs.
* `GET /verifications`: View pending verification ID files.
* `PUT /verifications/:id`: Approve provider badge.
* `PUT /users/:userId/status`: Block/Suspend users.
* `PUT /withdrawals/:id`: Approve GTBank payouts.

---

## 🚀 Installation & Local Setup

### Prerequisite
Ensure [Node.js](https://nodejs.org) is installed on your computer.

### Step 1: Clone or Open Workspace
Ensure terminal commands are executed in the project folders:
```powershell
# Open terminal inside:
c:\Users\HP CORE i5 8TH GEN\Desktop\STUDENT SERVICE MARKET
```

### Step 2: Setup Database (Supabase)
1. Register/Login on [Supabase](https://supabase.com).
2. Create a new project.
3. Open the **SQL Editor** in your Supabase project dashboard.
4. Copy the contents of `supabase/schema.sql` and run the script to create tables and triggers.
5. Copy the contents of `supabase/seed.sql` and run it to pre-populate categories and lookup tables.

### Step 3: Setup Backend Server
1. Navigate to `/server` directory.
2. Run install commands to pull dependencies.
3. Create `.env` from `.env.example` and fill in your Supabase project URL and anon keys.
4. Run server:
```bash
cd server
npm install
npm run dev
```

### Step 4: Setup Frontend Client
1. Navigate to `/client` directory.
2. Run install commands to pull dependencies.
3. Run React local Vite dev server:
```bash
cd client
npm install
npm run dev
```
4. Access client in browser at: `http://localhost:3000`
