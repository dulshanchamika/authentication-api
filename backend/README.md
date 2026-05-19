# 🔐 Auth API - Scalable SaaS Authentication Microservice

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)
[![Database: Neon](https://img.shields.io/badge/Database-Neon_PostgreSQL-00E599.svg)](https://neon.tech/)

A production-ready, fully Dockerized Authentication Microservice built with Node.js, Express, and Drizzle ORM. It features advanced security with Arcjet, seamless database branching with Neon Local, and comprehensive user management.

---

## 🚀 Key Features

- **🔐 Robust Authentication**: Secure Sign-Up, Sign-In, and Sign-Out flows using JWT and HttpOnly cookies.
- **🛡️ Advanced Security**: Integrated with **Arcjet** for:
  - 🛡️ **Shield**: Protection against common attacks (SQLi, XSS).
  - 🤖 **Bot Detection**: Automated request blocking.
  - 🚦 **Rate Limiting**: Intelligent sliding window rate limits.
- **💎 Database Power**: Powered by **Neon PostgreSQL** and **Drizzle ORM**:
  - 🌿 **Neon Local Proxy**: Ephemeral database branching for development.
  - 📜 **Drizzle Migrations**: Version-controlled schema management.
- **🐳 Fully Dockerized**: Optimized Docker configurations for both development (with hot reload) and production.
- **👨‍👩‍👧‍👦 User Management**: Complete CRUD operations with Role-Based Access Control (RBAC).
- **📝 Quality & Testing**:
  - 🧪 Comprehensive testing suite with **Jest** and **Supertest**.
  - 🪵 Professional logging with **Winston** and **Morgan**.
  - 🧹 Clean code enforced by **ESLint** and **Prettier**.

---

## 🛠️ Tech Stack

- **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
- **Database**: [Neon PostgreSQL](https://neon.tech/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Security**: [Arcjet](https://arcjet.com/), [Helmet](https://helmetjs.github.io/), [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Validation**: [Zod](https://zod.dev/)
- **Infrastructure**: [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/)
- **Testing**: [Jest](https://jestjs.io/), [Supertest](https://github.com/ladjs/supertest)

---

## 📋 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- [Node.js 18+](https://nodejs.org/) (if running locally without Docker).
- A [Neon](https://neon.tech/) account and API key.

---

## 🏗️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dulshanchamika/saas-api.git
cd saas-api
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.development
```

Edit `.env.development`:

- `NEON_API_KEY`: Your Neon API key.
- `NEON_PROJECT_ID`: Your Neon project ID.
- `ARCJET_KEY`: Your Arcjet application key.

### 3. Run in Development Mode

The easiest way to start is using the provided development script:

```bash
# On Linux/macOS
./scripts/dev.sh

# Or using npm
npm run dev:docker
```

This will:

- Spin up the `auth-neon-local` proxy.
- Create an ephemeral database branch.
- Start the application with hot-reload at `http://localhost:3000`.

---

## 🧪 Running Tests

The project includes a comprehensive test suite covering routes and security middleware.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

---

## 🚢 Production Deployment

For production, the app connects directly to the Neon Cloud database without the local proxy.

1. Prepare `.env.production`.
2. Run the production script:

```bash
./scripts/prod.sh
```

Or manually:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 🛣️ API Endpoints

### Auth

- `POST /api/auth/sign-up` - Create a new account.
- `POST /api/auth/sign-in` - Authenticate and get session.
- `POST /api/auth/sign-out` - Clear session cookies.

### Users

- `GET /api/users` - List all users (Admin only).
- `GET /api/users/:id` - Get user profile.
- `PUT /api/users/:id` - Update user profile.
- `DELETE /api/users/:id` - Remove user (Admin only).

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).
