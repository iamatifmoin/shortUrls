# 🔗 tinieurlz — URL Shortener & Analytics Dashboard

**tinieurlz** is a full-stack URL shortening web app with real-time analytics, QR code generation, and device/browser breakdowns. Built with React, Express, and MongoDB, it provides a sleek, responsive UI with JWT-based authentication and detailed link insights.

---

## 🚀 Features

- 🔐 JWT Authentication (Sign up / Login)
- 🔗 Shorten long URLs (with optional expiration)
- 📈 Per-link analytics:
  - Clicks over time (line chart)
  - Device/browser breakdown (bar chart)
- 📅 Created date + Expiration status
- 📎 Custom short URLs (optional enhancement)
- 📷 QR Code generation
- 🎨 Responsive black & white UI (ShadCN + TailwindCSS)

---

## 🧱 Tech Stack

| Layer    | Tech                                       |
| -------- | ------------------------------------------ |
| Frontend | React, React Router, TailwindCSS, Chart.js |
| Backend  | Node.js, Express.js                        |
| Database | MongoDB (Mongoose ODM)                     |
| Auth     | JWT                                        |
| Extras   | QR Code generation, ShadCN UI components   |

---

## 📂 Project Structure

```
tinieulz/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/ui/   # ShadCN UI
│   │   ├── pages/           # Dashboard, LandingPage, Analytics
│   │   ├── context/         # AuthContext
│   │   └── App.jsx
├── server/                  # Express backend
│   ├── models/              # Mongoose schemas (URL, Click, User)
│   ├── routes/              # Auth, URL, Clicks
│   └── index.js             # Entry point
```

---

## 📦 Installation

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/tinieurlz.git
cd tinieurlz
```

### 2. Backend Setup

```bash
cd server
npm install
npm run dev
```

Create a `.env` file with:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🔑 Authentication

- JWT stored in localStorage
- Auth context tracks user session
- Redirects to login if trying to shorten or view analytics while unauthenticated

---

## 🌐 API Overview

### POST `/api/auth/login`

Authenticate user and return JWT.

### POST `/api/urls`

Create a short URL (requires JWT).

### GET `/api/urls/:id`

Get info for a specific short URL.

### GET `/api/clicks/:id`

Get all click data for that URL.

---

## 📊 Analytics Page

Each short URL has a detailed analytics page (`/link/:id`) showing:

- 📅 Clicks over time (Line chart)
- 📱 Devices/Browsers used (Bar chart)
- 🔗 Original vs Short URL
- ⏰ Created at + Expiration status
- 🔙 “Back to Dashboard” button

---

## 📸 QR Code

When a URL is created, a QR code is generated using the short URL and displayed in the dashboard.

---

## ✨ Future Enhancements

- ✅ Custom alias for short URLs
- ⏳ Expiration date picker UI
- 📥 Export analytics as CSV
- 🔎 Filter analytics by date
- 📊 Pie chart toggle

---

## 🛡 License

MIT License. Feel free to use, modify, and contribute.

---

## 👨‍💻 Author

Built with 💙 by [Atif Moin](https://github.com/iamatifmoin)

---
