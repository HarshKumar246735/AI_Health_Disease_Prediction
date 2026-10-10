# Deployment: MongoDB Atlas + Render + Vercel

Deploy in this order, because each step needs the URL from the previous one.

## 1. MongoDB Atlas
1. Create a free cluster, then a database user (username + password).
2. Network Access: allow `0.0.0.0/0` (Render has no fixed IPs) or Render's outbound IPs.
3. Connect > Drivers: copy the connection string, put your password in it and add a database name, e.g. `mongodb+srv://USER:PASS@cluster.mongodb.net/healthpredict`. This is `MONGODB_URI`.

## 2. ML service on Render
Train the models locally first and **commit `ml-service/models/*.joblib` and `*.json`** (the service loads them from disk).

New > Web Service > connect your GitHub repo:
- Root Directory: `ml-service`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
- Environment: `PYTHON_VERSION=3.11.9`, optional `ML_API_KEY=<random string>`

Copy the service URL, e.g. `https://healthpredict-ml.onrender.com`. Check `/health`.

## 3. Node API on Render
New > Web Service, same repo:
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`
- Environment variables:
  - `NODE_ENV=production`
  - `MONGODB_URI` from step 1
  - `JWT_SECRET` a long random string
  - `ML_SERVICE_URL` from step 2 (no trailing slash)
  - `ML_API_KEY` same value as the ML service, if you set one
  - `CLIENT_URL` your Vercel URL (set it after step 4, then redeploy). Several origins can be comma-separated.

Create the admin once from the Render shell (or locally with the production `MONGODB_URI`): set `ADMIN_EMAIL` and `ADMIN_PASSWORD`, then run `npm run seed:admin`.

## 4. React client on Vercel
Import the repo:
- Root Directory: `client`
- Framework preset: Vite (build `npm run build`, output `dist`)
- Environment variable: `VITE_API_URL=https://<your-api>.onrender.com/api`

`client/vercel.json` rewrites every path to `index.html`, so refreshing `/dashboard`, `/history`, `/admin` etc. works.

Then go back to Render and set the API's `CLIENT_URL` to the final Vercel URL (no trailing slash) and redeploy.

## 5. CORS
The API only accepts browser requests from the origins in `CLIENT_URL`. If you see CORS errors, check for a trailing slash, `http` vs `https`, or a preview-deployment URL that is not listed.

## Notes
- Free Render services sleep when idle; the first request can take about a minute. The API allows 60 s for ML calls to cover this.
- Nothing in the code hardcodes localhost; local URLs live only in `.env` files.
