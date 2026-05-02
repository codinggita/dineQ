<div align="center">

<img src="https://img.shields.io/badge/QueueBite-v1.0.0-teal?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE2IDJhMTQgMTQgMCAxIDAgMCAyOEExNCAxNCAwIDAgMCAxNiAyem0wIDI0YTEwIDEwIDAgMSAxIDAtMjAgMTAgMTAgMCAwIDEgMCAyMHoiLz48L3N2Zz4=" alt="QueueBite" />

# 🍽️ DineQ

### Real-Time Restaurant Queue & Pre-Order Management System

*Skip the wait. Order ahead. Dine smarter.*

## 🔗 Important Links

🚀 **Live App**  
👉 https://dineq.netlify.app/login  

📡 **API Documentation (Postman)**  
👉 https://documenter.getpostman.com/view/50839202/2sBXqKnfFA  

🎨 **Figma Design**  
👉 https://www.figma.com/design/QPgP6519eyDxz2V8Dw6Nll/DineQ?node-id=0-1&t=cuEZn2wzXNTZafWz-1  

🎥 **Project Demo (YouTube)**  
👉 https://www.youtube.com/watch?v=CXlneDR6fG8  

---


[🎨 Figma Design](#-figma-design) -  [🚀 Features](#-features) -  [🏗️ Architecture](#️-architecture) -  [📁 Folder Structure](#-folder-structure) -  [⚡ Quick Start](#-quick-start) -  [🔌 API Reference](#-api-reference)

</div>

***

## 📌 Problem Statement

Every weekend, thousands of diners walk up to popular restaurants during peak hours — only to face one of the most frustrating experiences in modern dining:

> *"Your wait will be around 30-40 minutes."*

This estimate is vague, untracked, and often wrong. Customers stand outside with no visibility, no updates, and no way to be productive while they wait. Many simply walk away — directly hurting restaurant revenue.

### 😤 The Pain Points

| Pain Point | Who Suffers | Business Impact |
|---|---|---|
| 30–60 min waits with no accurate ETA | Customers | Customer walks away |
| Staff give vague verbal estimates | Both | Loss of trust |
| No way to join a queue remotely | Customers | Lost revenue for restaurant |
| Cannot pre-order while waiting | Both | Slower table turnover |
| No visibility into other restaurants' queues | Customers | Random walk-ins, repeated waits |
| Manual queue management via pen & paper | Staff | Errors, missed no-shows |

### 💡 The Root Cause

There is **no real-time, digital bridge** between a restaurant's queue state and the customer's phone. The information asymmetry forces customers to make blind decisions and forces restaurants to rely on inefficient, manual processes.

***

## ✅ The Solution — QueueBite

**QueueBite** is a full-stack, real-time web application that creates a live, bidirectional information channel between customers and restaurant staff using **WebSockets**.

### How It Solves Each Problem

- **Accurate ETAs** — Wait times are computed dynamically: `avg_seating_time × queue_position`. Updated live every time a customer is seated or leaves.
- **Remote Queue Joining** — Customers join a virtual queue from their phone before even leaving home. Their position is reserved instantly.
- **Pre-Ordering While Waiting** — A built-in menu lets customers browse and order from the queue. Food is ready the moment they sit down.
- **Live Notifications** — Socket.io pushes real-time alerts: "You're next!", "Your table is ready — claim within 5 minutes."
- **Restaurant Discovery** — A public-facing discovery page shows all nearby restaurants with live queue lengths and wait times so customers can make informed decisions.
- **Digital Staff Dashboard** — Restaurant staff get a clean Kanban-style queue board to seat, skip, or ping customers — replacing pen and paper entirely.

***

## 🚀 Features

### 👤 Customer Interface (Mobile-First)
- 🔍 **Restaurant Discovery** — Browse nearby restaurants with live "18 min wait" badges
- 📲 **Virtual Queue** — Join a queue remotely with one tap; get a confirmed position number
- 🍜 **Pre-Order Menu** — Browse the full menu and add items to your order while waiting
- 📍 **Live Queue Tracker** — See your real-time position, ETA countdown, and order status
- 🔔 **Push Notifications** — Get alerted when you are next in line or your table is ready
- ❌ **No-Show Protection** — 5-minute claim window with auto-release if not responded to

### 🧑‍💼 Restaurant Staff Dashboard (Desktop-Optimized)
- 📋 **Queue Board** — Kanban-style live queue with customer name, party size, and wait time
- ✅ **One-Click Actions** — Seat, Skip, or Mark No-Show with instant queue recalculation
- 🛎️ **Pre-Order View** — See linked orders for each customer before they sit down
- 📢 **Broadcast Ping** — Send a direct notification to any customer's phone
- ⏱️ **Wait Time Control** — Manually override the displayed wait time when needed
- 📊 **Live KPIs** — Customers in queue, avg wait time, tables available — all live

***

## 📸 Project Screenshots

### 🧭 Customer Experience

<div align="center">
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724564/Screenshot_2026-05-02_174439_xnilyb.png" width="250"/>
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724575/Screenshot_2026-05-02_174453_usrapb.png" width="250"/>
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724592/Screenshot_2026-05-02_174512_niuchx.png" width="250"/>
</div>

<div align="center">
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724604/Screenshot_2026-05-02_174731_jobeux.png" width="250"/>
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724637/Screenshot_2026-05-02_174750_si67du.png" width="250"/>
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724652/Screenshot_2026-05-02_174807_knspvc.png" width="250"/>
</div>

---

### 🧑‍💼 Staff Dashboard

<div align="center">
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724670/Screenshot_2026-05-02_174838_yz8kuy.png" width="300"/>
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724689/Screenshot_2026-05-02_174902_tlmnui.png" width="300"/>
</div>

<div align="center">
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724700/Screenshot_2026-05-02_174926_jtr4lw.png" width="300"/>
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724714/Screenshot_2026-05-02_174943_wt6wmj.png" width="300"/>
</div>

---

### ⚙️ Additional Views

<div align="center">
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724728/Screenshot_2026-05-02_174957_rgy5fw.png" width="250"/>
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724741/Screenshot_2026-05-02_175014_soq2bn.png" width="250"/>
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724757/Screenshot_2026-05-02_175031_uhsm7c.png" width="250"/>
</div>

<div align="center">
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724770/Screenshot_2026-05-02_175043_uae4vb.png" width="250"/>
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724781/Screenshot_2026-05-02_175107_ff4odx.png" width="250"/>
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724794/Screenshot_2026-05-02_175114_ch48uy.png" width="250"/>
</div>

---

### 🌟 Highlight Screen

<div align="center">
  <img src="https://res.cloudinary.com/dzmso2ukz/image/upload/v1777724803/Screenshot_2026-05-02_175134_h3vxes.png" width="600"/>
</div>

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        QueueBite System                         │
│                                                                 │
│   ┌───────────────┐    HTTP REST    ┌─────────────────────┐    │
│   │  React.js     │ ◄────────────► │   Express.js API    │    │
│   │  Frontend     │                │   Node.js Backend   │    │
│   │  (Vite)       │  Socket.io WS  │                     │    │
│   │               │ ◄────────────► │   Socket.io Server  │    │
│   └───────┬───────┘                └──────────┬──────────┘    │
│           │                                   │                │
│   ┌───────▼───────┐                ┌──────────▼──────────┐    │
│   │  Tailwind CSS │                │   MongoDB (Atlas)   │    │
│   │  Zustand      │                │   Mongoose ODM      │    │
│   │  React Router │                │                     │    │
│   └───────────────┘                └─────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Real-Time Socket Flow

```
Customer joins queue
        │
        ▼
  socket.emit("join_queue", { restaurantId, partySize })
        │
        ▼
  Server: joinQueueService() → saves to MongoDB → recalculates all positions
        │
        ├──► io.to("restaurant:id").emit("queue_updated", fullQueue)
        │         └── Staff dashboard board re-renders live
        │
        └──► socket.to(customerSocketId).emit("table_ready")
                  └── Customer's phone shows "Your table is ready! 🎉"
```

### Socket Events Reference

| Event | Direction | Payload | Purpose |
|---|---|---|---|
| `join_queue` | Client → Server | `{ restaurantId, customerId, partySize }` | Customer joins queue |
| `queue_updated` | Server → All in room | `{ queue[], avgWaitTime }` | Broadcast updated queue |
| `table_ready` | Server → Customer | `{ message, claimWindow }` | Alert specific customer |
| `preorder_received` | Client → Server | `{ queueId, items[] }` | Customer places pre-order |
| `no_show` | Staff → Server | `{ queueEntryId }` | Remove and recalculate |
| `wait_time_update` | Staff → Server | `{ restaurantId, newWaitTime }` | Manual ETA override |

***

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend UI** | React.js 18 + Vite | Fast HMR, component-based, hooks-first |
| **Styling** | Tailwind CSS v3 | Utility-first, consistent design tokens |
| **State Management** | Zustand | Lightweight, no boilerplate, socket-friendly |
| **Routing** | React Router v6 | Declarative, role-based protected routes |
| **Real-Time** | Socket.io (client) | Bidirectional, rooms, reconnect logic built-in |
| **Backend** | Node.js + Express.js | Non-blocking I/O ideal for socket-heavy apps |
| **WebSockets** | Socket.io (server) | Room-based broadcasting for restaurant isolation |
| **Database** | MongoDB + Mongoose | Flexible schema for queue/order state mutations |
| **Auth** | JWT + bcryptjs | Stateless auth, role-based (customer / staff) |
| **Validation** | Zod | Schema validation for API and socket payloads |
| **HTTP Client** | Axios | Interceptors for auth tokens + error handling |

***

## 🎨 Figma Design

> Full UI/UX design covering Customer Mobile Flow and Staff Dashboard.

**URL:** https://www.figma.com/design/QPgP6519eyDxz2V8Dw6Nll/DineQ?node-id=0-1&t=cuEZn2wzXNTZafWz-1

[

**Design covers:**
- 📱 Customer Mobile Flow (Discovery → Queue → Pre-Order → Live Tracker)
- 🖥️ Staff Desktop Dashboard (Queue Board → Orders → Broadcast)
- 🎨 Design System (Colors, Typography, Components, Spacing tokens)
- 🌙 Light & Dark Mode variants

> **Note:** Replace the Figma link above with your actual published Figma file URL.

***

## 📁 Folder Structure

### Frontend — `queuebite-frontend/`

```
queuebite-frontend/
│
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── manifest.json
│
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── ui/                        # Atomic components
│   │   │   ├── Button.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Skeleton.jsx           # Shimmer loader
│   │   │   ├── Toast.jsx
│   │   │   └── Avatar.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AppShell.jsx
│   │   │   ├── MobileShell.jsx        # Customer bottom-nav layout
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── BottomNav.jsx
│   │   │
│   │   ├── queue/
│   │   │   ├── QueueCard.jsx
│   │   │   ├── QueueBadge.jsx         # "Position #3 • ~12 min"
│   │   │   ├── WaitTimeTicker.jsx     # tabular-nums countdown
│   │   │   └── EmptyQueue.jsx
│   │   │
│   │   ├── restaurant/
│   │   │   ├── RestaurantCard.jsx
│   │   │   ├── RestaurantHeader.jsx
│   │   │   └── LiveWaitBadge.jsx      # Pulsing live indicator
│   │   │
│   │   ├── menu/
│   │   │   ├── MenuSection.jsx
│   │   │   ├── MenuItem.jsx
│   │   │   └── CartDrawer.jsx         # Slide-up cart sheet
│   │   │
│   │   └── notifications/
│   │       ├── NotificationBell.jsx
│   │       └── NotificationItem.jsx
│   │
│   ├── pages/
│   │   ├── customer/                  # Mobile-first pages
│   │   │   ├── DiscoverPage.jsx
│   │   │   ├── RestaurantPage.jsx
│   │   │   ├── QueueStatusPage.jsx    # Live tracker
│   │   │   ├── MenuPage.jsx
│   │   │   └── OrderConfirmPage.jsx
│   │   │
│   │   ├── staff/                     # Desktop-optimized pages
│   │   │   ├── StaffDashboard.jsx
│   │   │   ├── QueueBoardPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── BroadcastPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   │
│   │   └── shared/
│   │       ├── LoginPage.jsx
│   │       ├── RegisterPage.jsx
│   │       └── NotFoundPage.jsx
│   │
│   ├── hooks/
│   │   ├── useSocket.js               # Socket.io connection + listeners
│   │   ├── useQueue.js                # Queue join/leave/position state
│   │   ├── useRestaurants.js          # Fetch + cache restaurant list
│   │   ├── useCart.js                 # Pre-order cart state
│   │   ├── useNotifications.js        # Toast + bell manager
│   │   └── useAuth.js                 # Auth state + role detection
│   │
│   ├── context/
│   │   ├── SocketContext.jsx          # Single global socket instance
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── NotificationContext.jsx
│   │
│   ├── services/
│   │   ├── api.js                     # Axios base instance
│   │   ├── restaurantService.js
│   │   ├── queueService.js
│   │   ├── orderService.js
│   │   └── authService.js
│   │
│   ├── socket/
│   │   ├── socketClient.js            # io() initialization
│   │   └── socketEvents.js            # Exported event name constants
│   │
│   ├── store/
│   │   ├── queueStore.js              # Zustand: queue position, ETA, status
│   │   ├── restaurantStore.js
│   │   ├── orderStore.js
│   │   └── notificationStore.js
│   │
│   ├── routes/
│   │   ├── AppRouter.jsx
│   │   ├── CustomerRoutes.jsx
│   │   └── StaffRoutes.jsx
│   │
│   ├── utils/
│   │   ├── formatWaitTime.js
│   │   ├── getQueuePosition.js
│   │   ├── cn.js                      # clsx + tailwind-merge
│   │   └── constants.js
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── animations.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── .env.example
├── tailwind.config.js
├── vite.config.js
├── index.html
└── package.json
```

***

### Backend — `queuebite-backend/`

```
queuebite-backend/
│
├── src/
│   ├── config/
│   │   ├── db.js                      # MongoDB connection
│   │   ├── env.js                     # Validates env variables
│   │   └── corsOptions.js
│   │
│   ├── models/
│   │   ├── User.model.js              # { name, email, password, role }
│   │   ├── Restaurant.model.js        # { name, address, cuisine, menu[], avgWaitTime }
│   │   ├── Queue.model.js             # { restaurant, customer, position, status, socketId }
│   │   └── Order.model.js             # { queue, items[], totalAmount, status }
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── restaurant.controller.js
│   │   ├── queue.controller.js
│   │   └── order.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js            # JWT, bcrypt, token refresh
│   │   ├── restaurant.service.js      # Live wait time calculation
│   │   ├── queue.service.js           # Add/remove, recalculate positions
│   │   └── order.service.js           # Create, link, update orders
│   │
│   ├── routes/
│   │   ├── index.js                   # Mounts all routers at /api/v1
│   │   ├── auth.routes.js
│   │   ├── restaurant.routes.js
│   │   ├── queue.routes.js
│   │   └── order.routes.js
│   │
│   ├── socket/
│   │   ├── index.js                   # Socket.io server init + getIO()
│   │   ├── socketEvents.js            # Event name constants (mirrors frontend)
│   │   ├── handlers/
│   │   │   ├── queueHandler.js        # join_queue → queue_updated → table_ready
│   │   │   ├── orderHandler.js        # preorder_received → staff room ping
│   │   │   └── notificationHandler.js # broadcast_ping → targeted emit
│   │   └── rooms.js                   # restaurantRoom(), staffRoom(), customerRoom()
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js         # JWT verification
│   │   ├── role.middleware.js         # requireRole("staff")
│   │   ├── validate.middleware.js     # Zod schema validation
│   │   ├── errorHandler.middleware.js # Global error formatter
│   │   └── rateLimiter.middleware.js  # Rate limiting on /auth, /queue
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── queue.validator.js
│   │   └── order.validator.js
│   │
│   ├── utils/
│   │   ├── ApiError.js                # new ApiError(404, "Not Found")
│   │   ├── ApiResponse.js             # Uniform { success, data, message }
│   │   ├── asyncHandler.js            # try/catch wrapper for async routes
│   │   ├── calculateWaitTime.js       # avgSeatingTime × position → ETA
│   │   └── generateToken.js           # JWT access + refresh tokens
│   │
│   ├── jobs/
│   │   ├── noShowCleanup.job.js       # Cron: expire queue entries after 5 min
│   │   └── waitTimeRecalculator.job.js
│   │
│   └── app.js                         # Express app: middleware + routes
│
├── server.js                          # HTTP server + Socket.io + DB connect
├── .env
├── .env.example
└── package.json
```

***

## ⚡ Quick Start

### Prerequisites
- Node.js >= 20.x
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- npm or pnpm

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/queuebite.git
cd queuebite
```

### 2. Setup Backend

```bash
cd queuebite-backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start dev server
npm run dev
# Server runs on http://localhost:5000
```

### 3. Setup Frontend

```bash
cd queuebite-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api/v1
# Set VITE_SOCKET_URL=http://localhost:5000

# Start dev server
npm run dev
# App runs on http://localhost:5173
```

### Environment Variables

**Backend `.env`**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/queuebite
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend `.env`**
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

***

## 🔌 API Reference

### Auth Routes — `/api/v1/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register new user (customer or staff) |
| `POST` | `/login` | Public | Login and receive JWT tokens |
| `POST` | `/logout` | Auth | Invalidate refresh token |

### Restaurant Routes — `/api/v1/restaurants`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Get all restaurants with live wait times |
| `GET` | `/:id` | Public | Get single restaurant with menu and queue |
| `POST` | `/` | Staff | Create new restaurant |
| `PATCH` | `/:id` | Staff | Update restaurant info or avg wait time |

### Queue Routes — `/api/v1/queue`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/join` | Customer | Join a restaurant's virtual queue |
| `GET` | `/:restaurantId` | Auth | Get full queue for a restaurant |
| `PATCH` | `/:id/seat` | Staff | Mark customer as seated |
| `PATCH` | `/:id/no-show` | Staff | Mark as no-show and recalculate |
| `DELETE` | `/:id` | Customer | Leave the queue |

### Order Routes — `/api/v1/orders`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/` | Customer | Place a pre-order linked to queue entry |
| `GET` | `/:queueId` | Auth | Get order details for a queue entry |
| `PATCH` | `/:id/status` | Staff | Update order status (preparing, ready) |

***

## 📬 Postman API Documentation

Explore and test all API endpoints interactively using Postman:

👉 **Live Documentation:**  
https://documenter.getpostman.com/view/50839202/2sBXqKnfFA

### What’s Included:
- 🔐 Auth APIs (Register/Login)
- 🍽️ Restaurant APIs
- 📊 Queue Management APIs
- 🧾 Order APIs
- 📡 Example Requests & Responses

> You can directly import or test endpoints without setting up the backend locally.

## 🗂️ Database Schema

### Queue Document
```json
{
  "_id": "ObjectId",
  "restaurant": "ObjectId → Restaurant",
  "customer": "ObjectId → User",
  "position": 3,
  "partySize": 2,
  "status": "waiting | seated | no_show | left",
  "socketId": "socket_abc123",
  "joinedAt": "2026-04-22T10:00:00Z",
  "estimatedWaitMinutes": 18
}
```

### Order Document
```json
{
  "_id": "ObjectId",
  "queue": "ObjectId → Queue",
  "restaurant": "ObjectId → Restaurant",
  "items": [
    { "name": "Paneer Tikka", "qty": 2, "price": 280 }
  ],
  "totalAmount": 560,
  "status": "pending | preparing | ready | served"
}
```

***

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/live-map-view`
3. Commit your changes: `git commit -m "feat: add live map view for nearby restaurants"`
4. Push to the branch: `git push origin feature/live-map-view`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

***

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

***

## 👤 Author

**Pritesh**
- GitHub: [BachhavPritesh](https://github.com/BachhavPritesh)
- LinkedIn: [linkedin.com/in/pritesh-bachhav-233148396](https://www.linkedin.com/in/pritesh-bachhav-233148396/)

***

<div align="center">

Built with ❤️ to solve a real problem — one queue at a time.

⭐ Star this repo if you found it helpful!

</div>
