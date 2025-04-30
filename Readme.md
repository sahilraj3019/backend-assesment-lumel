# Sales Analyzer backend - Node.js API

This project is a backend API server built with **Node.js**, **Express**, and **Sequelize**, designed to handle large CSV sales datasets, normalize and store the data, and expose powerful revenue analysis endpoints.

---

## Prerequisites

| Tool            | Version        |
|-----------------|----------------|
| Node.js         | >= 18.x        |
| npm             | >= 9.x         |
| PostgreSQL (or SQLite) | >= 13.x (or latest) |

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/sales-analyzer-nodejs.git
cd sales-analyzer-nodejs

# 2. Install dependencies
npm install

# 3. Configure DB
# (Ensure your .env contains correct DB credentials for Sequelize)

# 4. Run migrations/sync models
node src/utils/syncDatabase.js

# 5. Start the server
node src/app.js
