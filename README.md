# Resume → Role — corrected role-based build

## Frontend

```bash
npm install
npm run dev
```

The frontend reads the backend URL from `VITE_API_URL`. Default:
`http://localhost:5000`.

If Vite runs on port 5176, the backend CORS configuration already allows both 5173 and 5176.

## Backend

1. Copy `backend/.env.example` to `backend/.env`.
2. Put your real MongoDB URI and JWT secret in `backend/.env`.
3. Start:

```bash
cd backend
npm install
npm run dev
```

Health check:
`http://localhost:5000/api/health`

## Roles

The application supports three persisted MongoDB roles:

- `candidate` → Candidate dashboard
- `student` → Student dashboard
- `recruiter` → Recruiter dashboard

Login sends the selected role to the backend. The backend compares it with the real MongoDB role and refuses a mismatch instead of silently logging the user in as a candidate.

## Google Sheets

Role/registration submission continues to use the existing Google Apps Script helper. The URL can be overridden with `VITE_SHEETS_SCRIPT_URL`.

## Resume persistence

Resumes are stored in MongoDB through `/api/resumes`. They are not stored only in React state or localStorage, so refresh/logout/login does not require another upload as long as the same MongoDB user account is used.

## Important

This ZIP intentionally does **not** contain `node_modules` or a real `backend/.env`. Install dependencies locally and add your private MongoDB/JWT values using the example file.
