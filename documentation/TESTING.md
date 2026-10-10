# Test checklist

Run these locally after training the models, then again against your production URLs.

**Authentication:** register; login; logout; wrong password shows a friendly message; visiting `/dashboard` while signed out redirects to `/login`; a USER visiting `/admin` is redirected.

**User:** dashboard stats and charts load (and show empty states with no data); run an assessment for each of the 10 conditions; invalid inputs (out of range, blank) show field errors; result page shows gauge and disclaimer; download PDF; history search, filters, sort and pagination; delete an assessment; update profile; change password.

**Admin:** login as admin; stats and charts; user search/filter, view, change role, delete (not yourself); assessment search/filter/view/delete; Diseases page shows metrics for trained models; Settings shows database and ML status; a normal user token gets 403 from `/api/admin/*`.

**ML / resilience:** stop the ML service and submit an assessment (expect "We couldn't complete the assessment right now"); delete one `.joblib` file and confirm only that condition returns 503.

**UI:** check 1440, 1200, 1024, 768, 480 and 360 px widths; keyboard-tab through forms and the sidebar; confirm focus rings are visible.

**Deployment:** refresh `/dashboard` on Vercel (no 404); confirm Vercel -> Render API -> Atlas and API -> ML service work end to end.
