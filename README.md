# SwiftShip Tracker 📦🚀

> **Centralized Parcel Management & Real-Time Logistics Platform with DB-Aware AI Assistance**

SwiftShip Tracker is a full-stack logistics and parcel management platform built with **Node.js, Express, Prisma ORM with SQLite, React (Vite), Socket.IO, Leaflet Maps, and Recharts**. It supports end-to-end parcel dispatches, multi-role user dashboards (Customer, Delivery Agent, Support Staff, System Admin), real-time WebSocket notifications, and an AI parcel tracking assistant connected directly to the system database.

---

## 🌟 Key Features

### 👤 1. Role-Based Access & Dashboards
- **CUSTOMER**: Book parcels via multi-step wizard, track live route milestones on Leaflet maps, interact with DB-aware AI Assistant, raise support tickets, and view notification alerts.
- **DELIVERY_AGENT**: Access assigned parcel worklist, execute valid status transitions (`BOOKED` → `PICKED_UP` → `IN_TRANSIT` → `OUT_FOR_DELIVERY` → `DELIVERED`), update hub locations, log delivery notes, and track daily performance stats.
- **SUPPORT**: Global shipment search, customer inquiry lookup, process support tickets, log resolution notes, and assign support priorities.
- **ADMIN**: Executive Recharts analytics dashboard (shipment status pie chart, city volume bar chart, agent completion metrics), user management, parcel reassignment workspace, system settings, and CSV report export.

### 📦 2. Parcel Lifecycle & Audit Event History
Valid state machine transitions enforced:
```
BOOKED → PICKED_UP → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED
(Also supports: CANCELLED, DELIVERY_FAILED, RETURNED)
```
Every status update generates a permanent `TrackingEvent` record, updates live hub locations, and triggers customer notifications.

### ⚡ 3. Real-Time WebSocket Updates
Powered by Socket.IO rooms (`parcel_SST-XXXXX`). When a delivery agent updates a parcel status or location, connected customers see instant visual tracking updates without page reloads.

### 🤖 4. DB-Aware AI Parcel Assistant
Floating conversational chatbot (`SwiftShip AI`) that parses intent and queries real database records for parcel status, current location, estimated delivery date (ETA), package weight/specs, and assigned delivery agent contact details.

### 🗺️ 5. Interactive Route Maps
Uses Leaflet and OpenStreetMap to render interactive origin, live in-transit location, and destination pins connected by polyline routes.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Leaflet / React-Leaflet, Socket.IO Client.
- **Backend**: Node.js, Express.js, Prisma ORM, Socket.IO, JWT Authentication, bcryptjs password hashing.
- **Database**: SQLite (`dev.db`), zero external DB setup required.

---

## 🔑 Demo Credentials

All accounts use the standard password: `password123`

| Role | Email | Name / Notes |
|---|---|---|
| **System Admin** | `admin@swiftship.demo` | Executive Admin Console |
| **Support Staff** | `support@swiftship.demo` | Anitha Support Specialist |
| **Delivery Agent 1** | `agent1@swiftship.demo` | Karthik Raja (Chennai Depot) |
| **Delivery Agent 2** | `agent2@swiftship.demo` | Murugan S (Coimbatore Yard) |
| **Delivery Agent 3** | `agent3@swiftship.demo` | Priya V (Tirunelveli Hub) |
| **Customer 1** | `customer1@swiftship.demo` | Arun Kumar |
| **Customer 2** | `customer2@swiftship.demo` | Deepa Ramesh |

---

## 🚀 How to Run the Application

### 1. Install Dependencies
```bash
# From workspace root (c:\NM)
npm run install:all
```

### 2. Seed Database
```bash
# Seed demo Admin, Support, Agents, Customers, Parcels, Events, Notifications & Support Tickets
npm run seed
```

### 3. Start Backend & Frontend
```bash
# Terminal 1: Start Express Backend (Port 5000)
npm run dev:backend

# Terminal 2: Start Vite Frontend (Port 3000)
npm run dev:frontend
```
Open **`http://localhost:3000`** in your browser.

---

## 🧪 Testing the Complete End-to-End Flow

1. Open `http://localhost:3000` and sign in using **Customer Demo** (`customer1@swiftship.demo` / `password123`).
2. Click **Book Parcel**, fill sender/receiver details, select Express priority, and submit.
3. System generates a unique tracking number (e.g. `SST-20261002-XXXXX`).
4. Log out and sign in as **System Admin** (`admin@swiftship.demo` / `password123`).
5. Open **Manage Parcels** and assign **Karthik Raja** (`agent1@swiftship.demo`).
6. Sign in as **Delivery Agent** (`agent1@swiftship.demo` / `password123`).
7. Open **Assigned Parcels** and update status from `BOOKED` → `PICKED_UP` → `IN_TRANSIT` → `OUT_FOR_DELIVERY` → `DELIVERED`.
8. Open the **AI Assistant** widget at the bottom right and ask: *"Where is my parcel SST-20261002-10001?"* to see live database responses.

---

## 📄 Documentation
For detailed college viva documentation, architectural data flow diagrams, schema entity relations, and test reports, see [`PROJECT_DOCUMENTATION.md`](file:///c:/NM/PROJECT_DOCUMENTATION.md).
