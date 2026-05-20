# 🔐 Secure Authentication Monorepo (Express, React, Drizzle, Neon, Arcjet)

This repository contains a full-stack, production-grade secure User Authentication Application. It is architected as a monorepo featuring a decoupled **Node.js Express backend**, a **Vite React frontend**, a local database sandbox proxy, and pre-configured deployment templates for **Google Cloud Platform (GCP) Cloud Run**.

---

## 🚀 Key Architectural Features

- **Modern Tech Stack**: React (Vite, TailwindCSS) frontend & Node.js (Express, Winston, Zod) backend.
- **Enterprise-grade Security (Arcjet)**: Advanced application security featuring Bot Detection, sliding-window Rate Limiting, and a dynamic WAF Shield.
- **Stateless Database ORM (Drizzle & Neon)**: Built using Drizzle ORM integrated with the serverless Neon PostgreSQL HTTP driver.
- **Programmatic Self-Healing Migrations**: The backend automatically detects pending schemas on boot in production environments and applies SQL updates instantly.
- **Dynamic 12-Factor Routing (Nginx)**: The frontend container uses Nginx's runtime environment template interpolation (`BACKEND_URL`). You compile the frontend once, and deploy it to any cloud target dynamically without rebuilds, bypassing all CORS issues.

---

## 📂 Project Organization

```text
auth-api/
├── backend/                  # 🧠 Express API backend
│   ├── Dockerfile            # Production-optimized Node.js container setup
│   ├── src/                  # Express controllers, middlewares, and services
│   └── drizzle/              # Generated database migration scripts (.sql)
├── frontend/                 # 🎨 React frontend application
│   ├── Dockerfile            # Production Nginx + Static assets container setup
│   ├── nginx.conf            # Proxy-pass template for dynamic BACKEND_URL routing
│   └── src/                  # React UI components & axios clients
├── scripts/                  # ⚙️ DevOps Automation Scripts
│   ├── dev.sh / dev.ps1      # Local sandbox environment launcher (inc. Neon DB proxy)
│   └── prod.sh / prod.ps1    # Local production building & staging simulator
└── docker-compose.yml        # Multi-container local compose orchestration
```

---

## 🛠️ Local Development Sandbox

We provide customized DevOps scripts under `scripts/` to launch a fully configured offline developer sandbox with a single command. 

This sandbox launches the frontend, the backend, and spins up a local database container running **Neon Local PgBouncer proxy** (automatically running schema migrations on launch).

### Launch Sandbox (Linux/macOS/Git Bash):
```bash
chmod +x ./scripts/dev.sh
./scripts/dev.sh
```

### Launch Sandbox (Windows PowerShell):
```powershell
./scripts/dev.ps1
```

Once running, access your components at:
* **Frontend UI**: `http://localhost:5173`
* **Backend API**: `http://localhost:3000`
* **Local Postgres Database**: Port `5432`

---

## 🧪 Production Staging Simulation

To build your optimized production images locally and run them as they would perform in the cloud (connecting to your Neon Cloud database):

### Run Local Production Simulation (Linux/macOS/Git Bash):
```bash
chmod +x ./scripts/prod.sh
./scripts/prod.sh
```

### Run Local Production Simulation (Windows PowerShell):
```powershell
./scripts/prod.ps1
```

Access local production staging at:
* **Production UI**: `http://localhost:80`
* **Local Backend API**: `http://localhost:3000`

---

## ☁️ Google Cloud Platform (GCP) Deployment

This codebase is pre-configured and optimized to run on **GCP Cloud Run** out-of-the-box. 

We have written a dedicated, step-by-step blueprint detailing Google Artifact Registry setup, local docker compilation/tagging, and zero-configuration Cloud Run deployments.

👉 **View the step-by-step GCP Deployment Guide**:  
See the detailed [GCP Deployment Guide](C:/Users/dulsh/.gemini/antigravity/brain/b094bb66-fc5a-49fd-a9b0-961b835690d9/artifacts/gcp_deployment.md) in the project artifacts directory.

### Quick Deploy Sequence Overview:

1. **Build & Push Backend**:
   ```bash
   docker build --target production -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/auth-app/backend:latest ./backend
   docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/auth-app/backend:latest
   ```
2. **Deploy Backend to Cloud Run** (Port 3000):
   ```bash
   gcloud run deploy auth-backend \
       --image=us-central1-docker.pkg.dev/YOUR_PROJECT_ID/auth-app/backend:latest \
       --port=3000 \
       --set-env-vars="NODE_ENV=production,DATABASE_URL=your_neon_url_without_channel_binding"
   ```
3. **Build & Push Frontend**:
   ```bash
   docker build --target production -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/auth-app/frontend:latest ./frontend
   docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/auth-app/frontend:latest
   ```
4. **Deploy Frontend to Cloud Run** (Port 8080) with Backend URL:
   ```bash
   gcloud run deploy auth-frontend \
       --image=us-central1-docker.pkg.dev/YOUR_PROJECT_ID/auth-app/frontend:latest \
       --port=8080 \
       --set-env-vars="BACKEND_URL=https://YOUR_BACKEND_SERVICE_URL"
   ```

---

## 🛡️ Operational Best Practices

1. **Logs**: We configured Winston to stream JSON logs to stdout in production, integrating natively with GCP Cloud Logging. Avoid local file-system writing to prevent container crashes under non-privileged security policies.
2. **Database URLs**: When deploying to serverless targets, ensure your production database string *does not* contain TCP-specific flags like `channel_binding=require` since query translation occurs over serverless HTTPS fetch endpoints.
3. **Build Independence**: Never bake your backend API URL into frontend bundles. Use Nginx's runtime reverse proxy parameters (`BACKEND_URL`) to allow immediate environment migrations and avoid CORS validation challenges.
