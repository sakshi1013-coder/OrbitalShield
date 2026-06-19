# OrbitalShield – Space Traffic Management & Collision Avoidance Platform

OrbitalShield is a production-quality Space Operations Mission Control dashboard designed to monitor satellites, space stations, launch vehicles, orbital debris, deep-space missions, and commercial spaceflight operations. 

The platform continuously collects simulated telemetry and logs orbital conflicts to help mission operators coordinate collision avoidance maneuvers in real-time.

---

## 🌟 Key Features

1. **Mission Dashboard:** Aerospace telemetry visualization with real-time statistics, active alert counts, orbital distributions, and dynamic charts for mission tracking.
2. **Satellite Constellation Manager:** Complete CRUD interface to register, edit, view, and retire satellites with altitude, velocity, and health monitoring.
3. **Mission Control Operations:** Operates scheduled, active, delayed, and completed space missions mapped to specific satellite payloads.
4. **Collision Risk Engine:** Core analysis engine comparing active satellite orbits against cataloged space debris to flag high-risk (< 5km) and medium-risk (5–15km) conflicts, auto-generating operational alerts for high-risk threats.
5. **Real-time Telemetry Stream:** A simulation deck generating battery levels, signal strengths, temperatures, and CPU metrics of all active satellites.
6. **Orbital Debris Catalog:** Tracks cataloged space debris with origin countries, sizes, tracking statuses, and risk tags.
7. **Active Alert Center:** Hub for operators to review flagged collision risks and resolve them with notes.
8. **System Audit Logs:** A read-only audit log trail keeping track of all dashboard operations.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion (for staggered entries and transitions), Recharts (HUD charts).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose schemas for robust data modelling).
- **Styling:** Custom CSS glassmorphism, responsive floating navbar/sidebar layout.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/sakshi1013-coder/OrbitalShield.git
   cd OrbitalShield
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file inside `backend/` with the following variables:
   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/orbitalshield
   NODE_ENV=development
   ```
   Start the backend development server:
   ```bash
   npm run dev
   ```
   *Note: On the first boot, the backend will auto-seed the MongoDB database with realistic satellite, debris, mission, and telemetry records.*

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Access the dashboard at `http://localhost:3000`.

---

## 🛸 UI/UX Design

The application presents a futuristic Space Operations atmosphere:
- **Cinematic Atmosphere:** Drifting nebula gas clouds, color-mixed twinkling starfields, floating particles, and interactive shooting stars.
- **Glowing Planet Element:** 20-30% partially visible Earth in the bottom-right corner with atmospheric pulse lighting.
- **HUD Glassmorphism:** Semitransparent glass cards, floating navigation sidebar, and transparent top navbar with live UTC clock telemetry.
