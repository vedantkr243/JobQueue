# Mini Job Queue Dashboard

## Overview
This project is a simple full-stack dashboard for managing jobs in a queue. It uses React for the frontend, NestJS for the backend API, and PostgreSQL for persistent storage.

## Tech Stack
Frontend:
- React
- Vite
- CSS

Backend:
- NestJS
- TypeScript
- TypeORM

Database:
- PostgreSQL

## Features
- Create jobs
- View jobs
- Filter jobs
- Update job status
- Delete jobs
- Status counts
- Validation
- Error handling
- Concurrency-safe status update

## Project Structure
```text
job-queue-dashboard/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── ...
├── backend/
│   ├── src/
│   │   ├── jobs/
│   │   │   ├── job.entity.ts
│   │   │   ├── jobs.controller.ts
│   │   │   ├── jobs.service.ts
│   │   │   └── create-job.dto.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   ├── package.json
│   └── ...
└── README.md
```

## PostgreSQL Setup
Create a database in PostgreSQL:

```sql
CREATE DATABASE job_queue;
```

Then set the connection values in the backend `.env` file:

```env
DATABASE_URL=...
```

## Backend Setup
```bash
cd backend
npm install
npm run start:dev
```

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
Backend:
- DATABASE_URL

Frontend:
- VITE_API_URL

## API Endpoints
### POST /jobs
Create a new job.

Example request:
```json
{
  "id": "Your Job id",
  "title": "Title of your job",
  "type": "Type of ypur job"
}
```

### GET /jobs
Return all jobs.

### PATCH /jobs/:id/status
Update a job status.

Example request:
```json
{
  "status": "running"
}
```

### DELETE /jobs/:id
Delete a job.

## Status Flow
The allowed job flow is:
- pending → running → completed
- pending → failed
- running → failed

Completed and failed jobs cannot change status.

## Concurrency Handling
The status transition is checked on the backend instead of trusting the React frontend. The database update also checks the current status. Therefore, if two requests try to start the same pending job at the same time, only the request that successfully changes the pending row can update it.

## Assumptions and Trade-offs
- PostgreSQL is used for persistence.
- No authentication is required because it is not part of the assignment.
- No real background worker is implemented.
- No real-time synchronization is implemented.
- Frontend filtering is used.
- The project intentionally uses a small structure because the assignment is small.

## Improvements With More Time
- Automated tests
- Authentication
- Redis/BullMQ for real job processing
- WebSockets for real-time updates
- Better logging
- Production database migrations

## Deployment
Add the actual deployed URLs here before publishing:

Frontend URL: [Add actual deployed frontend URL]
Backend URL: [Add actual deployed backend URL]
