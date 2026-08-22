# TripPilot Backend - Foundation

Welcome to the backend server for **TripPilot**! This service provides a clean, modular foundation built with TypeScript and Express to support our Odoo x LDCE Ahmedabad Hackathon 2026 project.

## Tech Stack

- **Runtime:** Node.js (TypeScript)
- **Framework:** Express.js
- **Database ORM:** Drizzle ORM
- **Database Driver:** postgres (PostgreSQL)
- **Validation:** Zod
- **Utilities:** dotenv, cors

## Getting Started

### 1. Prerequisites

Make sure you have Node.js (version 18+ or 20+ recommended) and npm installed.

### 2. Install Dependencies

Install runtime and development packages:

```bash
cd server
npm install
```

### 3. Environment Setup

Create a `.env` file in the `server` directory. You can copy the template:

```bash
cp .env.example .env
```

Define the configuration values (default values shown below):

```env
PORT=4000
DATABASE_URL=your_postgresql_database_url
```

*Note: The server will still boot up and run health checks even if `DATABASE_URL` is not defined.*

## Available Commands

Here are the NPM scripts configured for development and production:

- **Run Development Mode (Hot Reloading)**
  ```bash
  npm run dev
  ```
- **Typecheck code (TypeScript Validation)**
  ```bash
  npm run typecheck
  ```
- **Compile TypeScript to JavaScript (Build)**
  ```bash
  npm run build
  ```
- **Run Production Server (from build output)**
  ```bash
  npm run start
  ```

## API Testing

### Health Check

To verify the backend server is running correctly, access the health check endpoint:

- **URL:** `GET http://localhost:4000/api/health`
- **Expected JSON Response:**
  ```json
  {
    "success": true,
    "message": "TripPilot API is running"
  }
  ```
