# SWIFTSHIP TRACKER — PROJECT DOCUMENTATION

**Project Title**: SwiftShip Tracker: Centralized Parcel Management and Real-Time Logistics System  
**Technology Stack**: Node.js, Express.js, Prisma ORM, SQLite, React 18, Vite, Socket.IO, Leaflet Maps, Recharts, Tailwind CSS.  
**Academic Year**: 2026  

---

## 1. Executive Introduction
SwiftShip Tracker is an enterprise-grade logistics and parcel tracking web application built to streamline end-to-end package dispatches, real-time tracking updates, agent assignments, support ticketing, and operational executive analytics.

---

## 2. Problem Statement
Traditional courier systems suffer from:
- Scattered and uncoordinated parcel records.
- Delayed or manual delivery status updates.
- Lack of transparency in transit locations and delivery ETA.
- Inability for customers to get instant, accurate tracking information without support calls.
- Absence of centralized operational monitoring dashboards for management.

---

## 3. Proposed Solution
SwiftShip Tracker provides a unified logistics management system featuring:
- Role-based authorization (`CUSTOMER`, `DELIVERY_AGENT`, `SUPPORT`, `ADMIN`).
- Automated tracking number generation (`SST-YYYYMMDD-XXXXX`).
- Validated state machine transitions for parcel lifecycle.
- Socket.IO WebSockets for instant, real-time push updates.
- Interactive Leaflet Maps showing origin, current location, and destination pins with route polylines.
- DB-Aware AI Parcel Assistant that parses query intent and retrieves verified database records.
- Operational analytics charts built with Recharts.

---

## 4. User Roles & System Matrix

| Role | Core Permissions & Capabilities |
|---|---|
| **CUSTOMER** | Book parcels, view own shipments, track live status/location, receive real-time alerts, raise support tickets, chat with AI assistant. |
| **DELIVERY_AGENT** | View assigned shipments, execute status transitions (`BOOKED` → `PICKED_UP` → `IN_TRANSIT` → `OUT_FOR_DELIVERY` → `DELIVERED`), log delivery notes. |
| **SUPPORT** | Global shipment search, customer lookup, update support ticket status, log resolution notes. |
| **ADMIN** | Executive analytics dashboard, user CRUD, agent reassignment workspace, CSV report export, system settings. |

---

## 5. Parcel Lifecycle & State Machine
Valid transitions strictly enforced by backend middleware:
```
BOOKED
  ↓
PICKED_UP
  ↓
IN_TRANSIT
  ↓
OUT_FOR_DELIVERY
  ↓
DELIVERED
```
Alternative states: `CANCELLED`, `DELIVERY_FAILED`, `RETURNED`.

Invalid transitions (e.g. `DELIVERED` → `IN_TRANSIT`) are rejected by backend validation logic unless overridden by System Admin.

---

## 6. Database Entity-Relationship Model (Prisma Schema)

- **User**: `id`, `name`, `email`, `password` (hashed), `phone`, `role`, `address`, `city`, `state`, `pincode`, `isActive`.
- **Sender**: `id`, `name`, `phone`, `email`, `address`, `city`, `state`, `pincode`, `country`.
- **Receiver**: `id`, `name`, `phone`, `email`, `address`, `city`, `state`, `pincode`, `country`.
- **Parcel**: `id`, `trackingNumber` (unique index), `senderId`, `receiverId`, `createdById`, `assignedAgentId`, `packageDescription`, `weight`, `length`, `width`, `height`, `status`, `priority`, `currentLocation`, `estimatedDeliveryDate`, `shippingCost`, `paymentStatus`, `bookingDate`, `pickedUpAt`, `deliveredAt`, `notes`.
- **TrackingEvent**: `id`, `parcelId`, `status`, `location`, `message`, `updatedById`, `timestamp`.
- **Notification**: `id`, `userId`, `parcelId`, `title`, `message`, `type`, `isRead`, `createdAt`.
- **SupportTicket**: `id`, `userId`, `parcelId`, `subject`, `description`, `status`, `priority`, `assignedToId`, `resolution`, `createdAt`.

---

## 7. AI Parcel Assistant Architecture

The AI assistant uses intent-matching algorithms coupled with live Prisma database queries:
1. User prompt received at `POST /api/ai/chat`.
2. Tracking number detected via regular expression matching `SST-YYYYMMDD-XXXXX`.
3. Database query retrieves parcel record, sender, receiver, assigned agent, and tracking events.
4. Response synthesis generates exact, accurate status, current location, ETA, weight specs, or agent details.

---

## 8. Real-Time Tracking Architecture
Socket.IO connects clients to tracking rooms:
- Client joins room `parcel_SST-20261002-10001`.
- When delivery agent executes status update at `PUT /api/parcels/:id/status`, backend emits `status_updated`.
- Frontend automatically re-fetches latest tracking timeline and updates Leaflet map position without refreshing the page.

---

## 9. Test Cases & Verification Report

| Test ID | Flow Description | Input / Action | Expected Result | Status |
|---|---|---|---|---|
| TC-01 | User Registration | Customer details | JWT token & profile created | PASS |
| TC-02 | User Login | Valid credentials | Authenticates & redirects to role dashboard | PASS |
| TC-03 | Parcel Booking | Multi-step form submission | Generates `SST-20261002-XXXXX` & initial event | PASS |
| TC-04 | Public Tracking | Search tracking ID | Renders timeline & Leaflet route map | PASS |
| TC-05 | Agent Assignment | Admin selects agent | Updates parcel agent ID & notifies agent | PASS |
| TC-06 | Status Transition | Agent updates status | Appends tracking event & triggers Socket.IO event | PASS |
| TC-07 | Invalid Transition | Agent attempts DELIVERED → IN_TRANSIT | Backend rejects invalid transition | PASS |
| TC-08 | AI Query | Ask "Where is SST-20261002-10001?" | Returns verified database record details | PASS |
| TC-09 | CSV Export | Admin clicks export | Downloads `swiftship_parcels_report.csv` | PASS |

---

## 10. Conclusion & Future Scope
SwiftShip Tracker demonstrates a modern, scalable logistics management system built with robust architecture and clean design. Future scope includes integration with mobile driver apps, automated SMS gateways, and enterprise multi-warehouse routing optimization algorithms.
