# API reference

Base URL: `{API}/api`. Authenticated routes need `Authorization: Bearer <token>`. Errors look like `{ "message": "...", "errors": { "field": "..." } }`.

## Auth
| Method | Path | Body | Notes |
|---|---|---|---|
| POST | /auth/register | name, email, password | Always creates role `USER`. Returns `{ token, user }` |
| POST | /auth/login | email, password | Returns `{ token, user }` |
| GET | /auth/me | | Returns `{ user, totalAssessments }` |
| PUT | /auth/profile | name, email | |
| PUT | /auth/change-password | currentPassword, newPassword | |

## Diseases (auth)
| GET | /diseases | List with `featureCount` |
| GET | /diseases/:id | `{ disease: { features: [...] }, insights }` |

## Predictions (auth, own records only)
| POST | /predictions | `{ disease, inputData }` -> 201 `{ assessment }`. 400 with `errors` for invalid inputs, 503 if the ML service is unavailable |
| GET | /predictions | Query: `page, limit, search, disease, risk (Low/Moderate/High), sort (newest/oldest/probability)` |
| GET | /predictions/:id | `{ assessment, features, insights }` |
| GET | /predictions/:id/report | PDF download |
| DELETE | /predictions/:id | |

## Dashboard (auth)
| GET | /dashboard/stats | totals, risk distribution, per-condition counts, 14-day history |
| GET | /dashboard/recent | last 5 assessments |

## Admin (role ADMIN)
| GET | /admin/stats | totals, today, high-risk, active users, growth, activity, popularity, risk distribution |
| GET | /admin/users | Query: `page, limit, search, role` (includes `assessmentCount`) |
| GET | /admin/users/:id | user, assessment count, recent assessments |
| PUT | /admin/users/:id/role | `{ role }` (cannot change your own) |
| DELETE | /admin/users/:id | Also deletes their assessments (cannot delete yourself) |
| GET | /admin/assessments | Query: `page, limit, search, disease, risk` |
| GET | /admin/assessments/:id | |
| DELETE | /admin/assessments/:id | |
| GET | /admin/models | ML model metadata and metrics |
| GET | /admin/system | database / ML reachability |

## ML service (internal)
`GET /health`, `GET /schemas`, `GET /schemas/{id}`, `POST /predict {disease, inputs}`, `GET /models/info`. If `ML_API_KEY` is set, send it as `x-api-key`.

Prediction response:
```json
{ "prediction": "Higher Risk", "probability": 72.5, "riskLevel": "High",
  "explanation": "...", "factors": [{ "feature": "chol", "label": "Serum cholesterol", "direction": "increases", "impact": 0.84 }],
  "inputs": { } }
```
Risk levels: Low below 35%, Moderate 35-65%, High 65% and above.
