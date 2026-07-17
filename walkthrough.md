# Project Walkthrough - Campus Service Marketplace

We have successfully designed and built a production-ready, full-stack Campus Service Marketplace. Below is a walkthrough of what has been implemented and how it operates.

---

## 📂 Summary of Implementation

We structured the workspace into a clean, modern monorepo:
1. **`supabase/`**:
   - `schema.sql`: Contains definitions for 28 tables, triggers for automated profile sync and rating recalculation, indexes, constraints, and audit logging.
   - `seed.sql`: Populates student-focused categories (tutoring, repairs, laundry, hair styling), mock profiles, portfolios, and sample bookings/escrows.
2. **`server/` (Express.js API)**:
   - `server.js`: Entry point incorporating security middle-wares (Helmet, CORS headers, rate-limiting) and logging. Registering custom `/api/ai` endpoints.
   - `src/config/`: Initializer for Supabase anonymous and admin client connections.
   - `src/middlewares/`: Express JWT session extraction, role verification guards (RBAC), and Zod input validators.
   - `src/controllers/` & `src/routes/`: CRUD endpoints for custom Auth, Gigs listings, booking states transitions, wallet balances payouts, instant chat simulation, and administrative user suspension moderation.
   - **`aiController.js` & `aiRoutes.js` [NEW]**: Parses natural language inputs, extracts category tags, budget price limits (e.g. *under $50*), and quality demands (*"best"*), querying active database listings to return conversational answers alongside interactive recommended cards.
3. **`client/` (React.js + Vite + Tailwind)**:
   - Configuration: Custom theme definitions, Outfit Google Font integration, class-based Dark Mode.
   - Reusable Components:
     - `AIAssistantWidget.jsx` **[NEW]**: Interactive floating chat drawer in the corner of all pages. Features natural language querying, pre-loaded suggestion pills, and a built-in slot booking trigger.
   - Core Pages:
     - `LandingPage.jsx`: Hero search, category filter cards, service grid cards, and slot Booking Request Modal.
     - `Auth.jsx`: Uniform login/register panel with customer department and provider bio inputs.
     - `CustomerDashboard.jsx`: Bookings history status trackers, Paystack/Stripe Payment checkout simulator, escrow release triggers, star reviews, and mock live chat drawers.
     - `ProviderDashboard.jsx`: Wallet earnings indicators, GTBank withdrawal forms, listings manager, and portfolio item galleries.
     - `AdminDashboard.jsx`: User suspension toggles, provider verification badge reviewer, and withdrawal approval panel.
     - `AboutUs.jsx` **[NEW]**: Apple-inspired vision showcase displaying platform mission and escrow trust guarantees.
     - `ContactUs.jsx` **[NEW]**: Support desk details card grid and interactive ticket submission form.
     - `ServicesCatalog.jsx` **[NEW]**: Dedicated directory featuring a multi-parameters filter sidebar (Category select, Price caps, Location type, Min rating) and inline slot booking.

---

## 🧪 Step-by-Step Local Execution & Testing

Follow these quick commands to start and test your final year project:

### 1. Database Setup
1. Create a project at [Supabase](https://supabase.com).
2. Go to your Supabase project's **SQL Editor**.
3. Copy the contents of `supabase/schema.sql` and run the script.
4. Copy the contents of `supabase/seed.sql` and run it.

### 2. Launch Backend API Server
Configure `server/.env` with your Supabase credentials:
```env
PORT=5000
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
JWT_SECRET=demo_secret_key_98745
```
Open a terminal in the root and run:
```powershell
cd server
npm install
npm run dev
```
*The server will boot on port 5000, displaying: `📡 Server running in development mode on port 5000`.*

### 3. Launch React Frontend App
Open a second terminal window in the root and run:
```powershell
cd client
npm install
npm run dev
```
*The React + Vite client will boot on port 3000.*

### 4. Interactive Simulation Walkthrough
1. **Access**: Open `http://localhost:3000` in your web browser.
2. **AI Assistant Testing**:
   - In the bottom-right corner, click the floating brain/AI icon. The chat assistant slides open.
   - Click the suggestion pill **"Best Web Developer"**. The assistant will reply that David Adebayo is the top-rated provider, rendering David's service card in-chat.
   - Type *"Show me hair styling under $30"* in the input and submit. The assistant parses the budget ($30) and category (Hair Dressing), displaying the **Wig Installation** service ($25).
   - Click the **Book** button on the card. An embedded confirmation modal opens. Choose a date and time to place a booking request instantly!
3. **Menu Navigation**:
   - Click **Services** in the navbar to open the catalog. Filter by *Online* location mode, or set a maximum price filter to search gigs.
   - Click **About** and **Contact** to inspect the Apple-style vision statements and support ticketing form.
4. **Escrow Booking Flow**:
   - Log in or register as a **Student Customer**.
   - Browse the homepage, choose a service (e.g. *Vite + React Web App Portfolio*), click "Book Your Slot", select a date and time, fill in requirements, and submit.
   - Log out, log back in as **David Adebayo (Provider)**: `dave.dev@campusmarketplace.edu`. Under "Incoming Bookings", you will see the pending request. Click **Accept**.
   - Log back in as the **Student Customer**. Navigate to "My Bookings", see the status changed to *Accepted*. Click **Pay into Escrow**. Enter test card details and submit. The booking status changes to *Paid (Escrow Hold)*.
   - Log in as **David Adebayo (Provider)**. You will see the $120.00 added to your *Escrow Holding Balance*. Click **Mark Job Complete**.
   - Log in as the **Student Customer**. Under "My Bookings", click **Confirm & Release**. This releases the escrow balance. The review modal will slide open—submit your rating!
   - Log in as **David Adebayo (Provider)**. You will see the escrow hold balance cleared and the earnings added to your usable balance, ready for withdrawal.
