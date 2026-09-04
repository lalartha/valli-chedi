# 🌿 Valli Chedi — Backend

> **Permission granted. Consequences pending.**

Backend API for Valli Chedi — a humorous web application that tracks the chain of consequences from activities and responsibilities, converting them into a virtual growing vine/creeper.

## What is a Valli?

A Valli is not necessarily a bad decision. It is the chain of things that happens because of something else.

```
NSS Programme → Planning → Faculty permission → Principal permission
→ Volunteer coordination → Travel → Missed class → Late return
→ Missed household responsibility → Family questions
→ Future permission becomes harder → 🌿 VALLI
```

## Quick Start

### 1. Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 2. Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Supabase credentials
```

### 3. Database

Run the SQL files in your Supabase SQL Editor:

1. `database/schema.sql` — Creates all tables, indexes, and RLS policies
2. `database/seed.sql` — (Optional) Loads demo data

### 4. Run

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 5. Verify

```bash
curl http://localhost:3000/health
```

Expected:
```json
{
  "status": "ok",
  "service": "valli-chedi-backend",
  "tagline": "Permission granted. Consequences pending."
}
```

## API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Sign in |

### Activities (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/activities` | Create activity + run consequence pipeline |
| GET | `/api/activities` | List activities |
| GET | `/api/activities/:id` | Get activity |
| PUT | `/api/activities/:id` | Update activity |
| DELETE | `/api/activities/:id` | Cancel activity |

### Vallis (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/vallis` | Create manual Valli |
| GET | `/api/vallis` | List Vallis |
| GET | `/api/vallis/:id` | Get Valli + events |
| PUT | `/api/vallis/:id` | Update Valli |
| POST | `/api/vallis/:id/resolve` | Resolve Valli |
| GET | `/api/vallis/:id/chain` | Get Valli chain |

### Permissions (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/permissions/analyze` | Analyze permission difficulty |
| GET | `/api/permissions/:activityId` | Get permission record |

### Reminders (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reminders` | Create reminder |
| GET | `/api/reminders` | List reminders |
| POST | `/api/reminders/:id/checkin` | Confirm check-in |
| POST | `/api/reminders/:id/stop` | Stop reminder |

### Home Debt (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/home-debt` | Record home debt |
| GET | `/api/home-debt` | List home debts |
| POST | `/api/home-debt/:id/resolve` | Resolve home debt |

### Growth / Valli State (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/valli-state` | Get aggregate Valli state |
| GET | `/api/growth` | Get growth summary |
| GET | `/api/growth/history` | Get growth event history |

## Architecture

```
ACTIVITY → Consequence Engine → Vallis → Growth Points → Valli State → 🌿
                  │
    ┌─────────────┼──────────────┐
    ↓             ↓              ↓
Permission    Collision      Overnight
 Engine        Engine        Detection
    ↓             ↓              ↓
 Distance     Time-Overlap    Achan
  Engine       Vallis       Reminder
```

## Core Philosophy

> You didn't choose the valli. You chose responsibility. The valli came free.

---

Built with 🌿 and unnecessary complexity.
