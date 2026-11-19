# 🍬 Sweety – Blood Glucose Tracker (MERN + PostgreSQL / Supabase)

**Sweety** is a clinical-grade blood glucose journal and analytics web application designed for diabetes patients to log up to 4 meal-milestone readings per day and inspect daily, month-to-date, and previous-month statistical reports.

Built with **Node.js + Express REST API**, **Live Cloud Supabase (PostgreSQL)**, and a **React 19 + Vite** frontend styled with an elegant, modern **Rose Red** theme (with an interactive 4-theme switcher), featuring fluid **GSAP** animated metric counters and **Recharts** glycemic trend curves.

---

## 📸 Key Features

1. **Authentication & Tenant Isolation (Zero-IDOR)**
   * Register with Name, Email, and Password.
   * Passwords securely hashed with `bcrypt` (10 rounds).
   * Stateless JWT Bearer token authentication. Patients only ever access their own health records.

2. **The 4 Clinical Daily Meal Slots**
   * `Morning (fasting)`
   * `After breakfast`
   * `After lunch`
   * `After dinner`

3. **Strict Validation Engine (Database & Application Enforced)**
   * **Value is required**: `"Please enter a glucose value."`
   * **Valid whole number 40–600**: `"Value must be between 40 and 600 mg/dl."`
   * **Only 1 reading per slot per day**: `"You already have an [Slot Name] reading for this date."`
   * **Maximum 4 readings per day**: `"You can add only 4 readings per day."`
   * **Date cannot be in the future**: `"Date cannot be in the future."`

4. **Clinical Statistical Reports**
   * **Daily Report**: Selected date's Highest, Lowest, Average (rounded to 1 decimal), and Count + itemized slotted readings list.
   * **Month-to-Date (MTD)**: 1st of month to selected date.
   * **Previous Month**: The entire preceding calendar month.
   * **Friendly Zero-State**: Clean empty card placeholders when no data exists.

5. **Motion & Visual Analytics**
   * **Rose Red Primary Theme**: Authentic light rose / coral theme with an instant toggle for **Sage Green**, **Ocean Blue**, and **Royal Purple**.
   * **GSAP Number Counters**: Glucose averages, highs, and lows animate from `0.0` counting up to the target value like a flow.
   * **Recharts Trend Curve**: Continuous 30-day glucose line with shaded 70–140 mg/dL target zone boundaries.
   * **Donut Distribution Chart**: Percentage of readings in healthy target range vs. elevated vs. low.

---

## 🛠️ Tech Stack

* **Frontend**: React 19 / 18, Vite, Tailwind CSS, Lucide Icons, GSAP, Recharts.
* **Backend**: Node.js, Express, `@supabase/supabase-js`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`.
* **Database**: Live Supabase PostgreSQL (`mrcundazfshhgyxainld.supabase.co`) with relational integrity and composite unique constraints.
* **Testing**: Jest + Supertest integration test suite (5/5 tests passing).

---

## 🚀 Quick Start Guide

### 1. Database Connection (Live Cloud Supabase)
The database is already configured and seeded in your live Supabase project:
* **Project URL**: `https://mrcundazfshhgyxainld.supabase.co`
* **Status**: Connected, seeded with 168 realistic glucose readings across 45 days.

---

### 2. Demo Account Credentials

* **Email:** `demo@sweety.app`
* **Password:** `Password123!`

*(You can also click the **"Use Demo Account"** button on the sign-in modal for 1-click autofill!)*

---

### 3. Running the App Locally

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Vite runs on http://localhost:3000
```

Open `http://localhost:3000` in your browser.

---

### 4. Running the Tests

Verify all 5 validation rules and authentication security:
```bash
cd server
npm test
```

---

### 5. Re-seeding Demo Data (Optional)

If you ever want to reset the test database with a fresh 45-day cycle:
```bash
cd server
npm run seed
```

---

## 📝 Notes & Architectural Assumptions

1. **Date Granularity**: Readings are indexed by `(user_id, reading_date, slot)`. The `reading_date` is stored as an ISO `DATE` (`YYYY-MM-DD`) based on the patient's local timezone.
2. **Clinical Boundaries**: Enforced as whole numbers strictly between `40` and `600` mg/dL per ADA clinical standards.
3. **What I'd improve with more time**:
   * Add a Doctor / Endocrinologist role with patient assignment and PDF export.
   * Background reminders using BullMQ/Redis for patients with $< 4$ readings at 8:00 PM.
   * Direct CGM (Continuous Glucose Monitor) Dexcom/Libre CSV file import.
