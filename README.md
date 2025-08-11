
# Token MVP Demo (Frontend-only)

This is a frontend-only React + Vite demo of a token booking system for one hospital with 10 doctors.
It simulates live token progression and lets you book tokens in three modes: Next, Time, or Specific Token Number.

## Run locally
1. Install dependencies
```
cd token-mvp-demo
npm install
```

2. Run dev server
```
npm run dev
```

3. Open the URL printed by Vite (usually http://localhost:5173)

## Features
- Search doctors
- Simulated live token progression per doctor
- Book Next / Book by Time / Book specific token
- Cancel bookings from user panel
- Doctor statuses: active / break / emergency / on_leave (data can be edited in src/data.js)

This is a demo (frontend-only) and does not persist bookings. Use it to demo flows and UX.
