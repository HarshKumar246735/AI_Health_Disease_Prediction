# HealthPredict

> **Understand Your Health Risks. Make Informed Decisions.**

A full-stack web application that gives **educational health-risk estimates** for 10 conditions. It is built to showcase full-stack engineering: a React front end, a Node/Express API with JWT auth and role-based access, MongoDB persistence, PDF reports, user and admin dashboards, and a small Python service that runs simple classical ML models.

> **Medical disclaimer.** This platform provides educational risk estimates based on the information entered by the user. It is not a medical diagnosis and should not replace professional medical advice.

## Features

- Landing page, register/login, protected routes, profile and password change
- JWT authentication, bcrypt password hashing, `USER` / `ADMIN` roles
- 10 conditions, each with a form generated from that model's own feature schema
- Result page with risk gauge, plain-language influence factors and general health information
- Saved history with search, filters, sorting, pagination and delete
- PDF report per assessment
- User dashboard (Recharts) and admin area: users, assessments, model info, analytics, system status
- Skeleton loaders, empty/error states, friendly error messages, toasts, accessible forms
- Responsive layouts for desktop, tablet and mobile

## Tech stack

| Layer | Tech |
|---|---|
| Client | React 18, Vite, React Router, Axios, Recharts, plain CSS (no UI framework) |
| API | Node.js, Express, Mongoose, JWT, bcryptjs, Helmet, CORS, express-rate-limit, PDFKit |
| ML service | Python, FastAPI, pandas, numpy, scikit-learn (Logistic Regression), joblib |
| Database | MongoDB (Atlas in production) |
| Hosting | Vercel (client), Render (API and ML service), MongoDB Atlas |

## Architecture

```text
Browser -> Vercel (React) -> Render (Node/Express API) -> MongoDB Atlas
                                      |
                                      +-> Render (FastAPI ML service)
```

The ML service owns the feature schema for every condition (`ml-service/schemas.py`). The API exposes it at `/api/diseases`, and the client builds each form from it, so forms and models cannot drift apart.

## Folder structure

```text
HealthPredict/
├── client/        React app (src/components, pages, css, services, context, hooks, utils)
├── server/        Express API (config, controllers, middleware, models, routes, services, utils, scripts)
├── ml-service/    FastAPI service (schemas.py, predictor.py, app.py, training/, models/, data/)
├── documentation/ API.md, DEPLOYMENT.md, DATASETS.md, TESTING.md
├── render.yaml    Optional Render blueprint
└── README.md
```

## Local development

Prerequisites: Node 18+, Python 3.10+, a MongoDB instance (local or Atlas).

### 1. ML service

```bash
cd ml-service
python -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Download the datasets (see `documentation/DATASETS.md`), save them in `ml-service/data/`, then train:

```bash
python training/train_all.py         # or one at a time: python training/train_heart.py
uvicorn app:app --reload --port 8000
```

Training writes `models/<id>.joblib` and `models/<id>.json` (metrics). The API will answer `503` for any condition whose model is not trained yet. Commit the `models/` files if you deploy to Render (they are small).

### 2. API

```bash
cd server
npm install
cp .env.example .env     # fill in MONGODB_URI, JWT_SECRET, CLIENT_URL, ML_SERVICE_URL
npm run seed:admin       # creates the admin from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev
```

Optional development data: `npm run seed:demo` (and `npm run seed:demo:clear`). Demo rows are flagged `isDemo` and produced by the real ML service from random inputs, so they populate charts but mean nothing medically.

### 3. Client

```bash
cd client
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
npm run dev
```

## Environment variables

| File | Variable | Purpose |
|---|---|---|
| `client/.env` | `VITE_API_URL` | API base URL including `/api` |
| `server/.env` | `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `ML_SERVICE_URL`, `ML_API_KEY` | API configuration |
| `server/.env` | `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used only by `seed:admin` |
| `ml-service/.env` | `PORT`, `MODEL_PATH`, `ML_API_KEY` | ML service configuration |

Never commit `.env` files. Only the `.env.example` files are tracked.

## API overview

See `documentation/API.md` for full details.

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PUT /api/auth/profile`, `PUT /api/auth/change-password`
- **Diseases:** `GET /api/diseases`, `GET /api/diseases/:id`
- **Predictions:** `POST /api/predictions`, `GET /api/predictions`, `GET /api/predictions/:id`, `GET /api/predictions/:id/report`, `DELETE /api/predictions/:id`
- **Dashboard:** `GET /api/dashboard/stats`, `GET /api/dashboard/recent`
- **Admin (ADMIN only):** users, assessments, stats, models, system

## Deployment

Step-by-step instructions for MongoDB Atlas, the two Render services and Vercel are in `documentation/DEPLOYMENT.md`. The client ships a `vercel.json` rewrite so refreshing any route (for example `/dashboard`) does not 404.

## Models and evaluation

Each model is a scikit-learn pipeline (median imputation, standard scaling, Logistic Regression). Training scripts compute accuracy, precision, recall, F1 and ROC AUC on a held-out 20% split and store them with the model; the admin "Diseases" page shows them. **These numbers describe performance on a public research dataset, not real-world clinical accuracy.**

## Screenshots

Add screenshots here after running the app (landing page, dashboard, result page, admin).

## Future improvements

- Email-based password reset and email verification
- Refresh tokens and httpOnly cookie sessions
- Automated tests (API integration tests, component tests)
- Additional conditions through new entries in `ml-service/schemas.py`
- Calibration and cross-validation reporting in the training scripts

## Medical disclaimer

HealthPredict does not diagnose conditions, prescribe medication or replace professional care. Always consult a qualified healthcare professional for medical evaluation.
