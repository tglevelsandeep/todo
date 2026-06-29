# 📋 Todo Application

A full-stack Todo application with authentication, built with **Next.js** and **Node.js/Express**.

## 🏗 Architecture

| Component | Tech |
|-----------|------|
| Frontend | Next.js 15 (App Router) |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Proxy | Nginx |
| Containers | Docker + Docker Compose |
| CI/CD | GitHub Actions |

## 📁 Project Structure

```
todo/
├── backend/              # Express REST API
│   └── src/
│       ├── config/       # DB connection
│       ├── models/       # Mongoose schemas
│       ├── services/     # Business logic
│       ├── controllers/  # Request handlers
│       ├── routes/       # Route definitions
│       └── middlewares/  # Auth & error handling
├── frontend/             # Next.js App
│   └── src/app/
│       ├── login/        # Sign-in page
│       ├── signup/       # Sign-up page
│       └── dashboard/    # Todo list (CRUD)
├── nginx/                # Reverse proxy config
├── docker-compose.yml    # Multi-container setup
└── .github/workflows/    # CI/CD pipeline
```

## 🚀 Quick Start

### With Docker (Recommended)

```bash
# Clone the repo
git clone <repo-url> && cd todo

# Start all services
docker-compose up --build

# Open http://localhost in your browser
```

### Without Docker (Development)

**Backend:**
```bash
cd backend
cp .env.example .env     # Edit with your MongoDB URI + JWT secret
npm install
npm run dev               # Starts on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev               # Starts on http://localhost:3000
```

> **Note:** You need a running MongoDB instance. Update `MONGO_URI` in `.env` accordingly.

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ✗ | Create account |
| `POST` | `/api/auth/login` | ✗ | Sign in → JWT |
| `GET` | `/api/todos` | ✓ | List user's todos |
| `POST` | `/api/todos` | ✓ | Create a todo |
| `DELETE` | `/api/todos/:id` | ✓ | Delete a todo |
| `PATCH` | `/api/todos/:id/toggle` | ✓ | Toggle complete |
| `GET` | `/api/health` | ✗ | Health check |

**Auth header:** `Authorization: Bearer <token>`

## 🔒 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend port |
| `MONGO_URI` | `mongodb://mongo:27017/todo-app` | MongoDB connection string |
| `JWT_SECRET` | — | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | `7d` | Token expiration |

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| `nginx` | 80 | Reverse proxy (entry point) |
| `frontend` | 3000 | Next.js app |
| `backend` | 5000 | Express API |
| `mongo` | 27017 | MongoDB |

## ⚙️ CI/CD

The GitHub Actions pipeline (`.github/workflows/ci-cd.yml`):
- **CI**: Runs on every push/PR — lints and builds both frontend and backend
- **CD**: On `main` branch merge — builds Docker images and pushes to Docker Hub

**Required Secrets:**
- `DOCKER_HUB_USERNAME`
- `DOCKER_HUB_TOKEN`

## 📄 License

MIT
