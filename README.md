# Frontend

This frontend provides the UI for searching large lab datasets across joined lab and test tables, applying the required filters, choosing sort options, and showing the returned data in a table layout.

## Tech Stack

- `React`: component-based UI.
- `Vite`: fast frontend dev server and build tool.
- `Fetch API`: calls the backend endpoints.
- `CSS`: custom responsive styling for the dashboard layout.

## Folder Flow

- `src/App.jsx`: main screen with table selection, filters, sorting, and results rendering.
- `src/api.js`: wrapper around backend API calls.
- `src/styles.css`: visual design and responsive layout.
- `src/main.jsx`: React entry point.

## How The Frontend Works

1. On load, the app requests `GET /api/config`.
2. The backend returns the datasets, columns, and allowed filters.
3. The user selects either Biological or Chemical data, types in the main search bar, and fills filters like `State`, `City`, `Lab Name`, `Product`, `Labs Type`, `Test`, and `Test + Method`.
4. Clicking `Search` or `Load Data` sends a `POST /api/data` request.
5. The backend returns the matching rows, count, and total pages.
6. The frontend renders the current page in a table and allows moving between pages.

## Environment Setup

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=http://localhost:4000
```

## Run

```bash
npm install
npm run dev
```

## Features

- Table selector driven by backend config
- Dedicated lab search form
- Main search bar across multiple columns
- State dropdown options loaded from the backend
- Lab type dropdown mapped to `disciplineName`
- Sort column + direction
- Row limit control
- Pagination support for large data volumes
- Responsive table layout
- Error handling for failed API requests

## Important Note

The frontend does not connect to Supabase directly. It only talks to the backend API. This keeps your Supabase service role key protected on the server side.
