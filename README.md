# 🔗 tinieurlz — URL Shortener & Analytics Dashboard

**tinieurlz** is a full-stack URL shortening web app with real-time analytics, QR code generation, and device/browser breakdowns. Built with React, Express, and MongoDB, it provides a sleek, responsive UI with JWT-based authentication and detailed link insights.

---

## 🚀 Features

- 🔐 JWT Authentication (Sign up / Login)
- 🔗 Shorten long URLs
- 📈 Per-link analytics:
  - Clicks over time (line chart)
  - Device/browser breakdown (bar chart)
- 📎 Custom short URLs (optional enhancement)
- 📷 QR Code generation
- 🎨 Responsive UI (ShadCN + TailwindCSS)

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
tinieurlz/
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
npm start
```

Create a `.env` file with:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=cloud_api_key
CLOUDINARY_API_SECRET=cloud_api_secret
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Create a `.env` file with:

```env
VITE_API_BASE_URL=base_uri (localhost for local dev)
CLOUDINARY_CLOUD_NAME=cloud_name
```

---

## Test Credentials

```bash
email: intern@dacoid.com
password: Test123
```

## ✨ Future Enhancements

- ✅ Custom alias for short URLs
- ⏳ Expiration date picker UI
- 📥 Export analytics as CSV
- 🔎 Filter analytics by date
- 📊 Pie chart toggle

## 👨‍💻 Author

Built with 💙 by [Atif Moin](https://github.com/iamatifmoin)

---
