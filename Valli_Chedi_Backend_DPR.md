# VALLI CHEDI — Backend Detailed Project Report (DPR)

> **Tagline:** Permission granted. Consequences pending.
>
> **Backend mission:** Track the chain of responsibilities, permissions, travel, time conflicts, home responsibilities, communication and consequences that make a user's "valli" grow.
>
> **Frontend vision:** A virtual `valli chedi` (creeper/vine) grows progressively across the screen as the user's Valli state increases. The backend provides the data and logic that controls that growth.

---

## 1. Project Identity

| Item | Description |
|---|---|
| Project | Valli Chedi |
| Type | Humorous web application / Useless Project |
| Primary focus | Backend-first implementation |
| Frontend | To be developed later |
| Backend | Node.js + Express |
| Database | PostgreSQL via Supabase |
| Authentication | Supabase Auth |
| API style | REST |
| Notifications | Web Push / service worker + backend scheduling |
| Deployment | Vercel / Render / Railway |
| Core visual concept | A growing virtual vine/creeper |

### Core idea

A **Valli** is not necessarily a bad decision.

It is the chain of things that happens because of something else.

Example:

```text
NSS Programme
    ↓
Planning
    ↓
Faculty permission
    ↓
Principal permission
    ↓
Volunteer coordination
    ↓
Travel
    ↓
Missed class
    ↓
Late return
    ↓
Missed household responsibility
    ↓
Family questions
    ↓
Future permission becomes harder
    ↓
🌿 VALLI
```

The backend models this chain.

---

# 2. Problem Statement

People often take on multiple responsibilities, activities and commitments at the same time. One activity can create secondary tasks, scheduling conflicts, permission requirements, travel complications, missed household responsibilities and communication obligations.

These interconnected consequences are difficult to visualize as a single chain.

**Valli Chedi** deliberately over-engineers this everyday problem into a humorous system that records each "valli", calculates its fictional severity, connects related consequences, manages reminders and converts the accumulated state into a virtual plant-growth value.

> **The work itself isn't the valli. Everything that happens because of the work is.**

---

# 3. Project Objectives

## Primary objectives

1. Build a backend capable of recording activities and Vallis.
2. Detect secondary consequences from activities.
3. Calculate a fictional Valli score using deterministic rules.
4. Model chains of connected Vallis.
5. Detect overlapping commitments.
6. Calculate permission difficulty using notice period and destination.
7. Manage overnight-trip communication reminders.
8. Specifically support recurring "Call Achan" reminders for overnight stays.
9. Maintain a cumulative Valli growth state.
10. Expose clean REST APIs for a future frontend.
11. Keep the backend independent from frontend rendering.

## Secondary objectives

- Make the data humorous and visually useful.
- Allow future analytics and Valli history.
- Make the system extensible for additional Valli rules.
- Avoid making AI a requirement for core functionality.

---

# 4. Scope

## In scope

- User accounts
- Activity creation
- Activity categories
- Valli generation
- Valli severity
- Valli chains
- Permission analysis
- Notice-period analysis
- Distance-based fictional scoring
- Overnight detection
- Achan check-in reminders
- Time-collision detection
- Home-responsibility debt
- Valli growth calculation
- Valli history
- Valli resolution
- REST APIs

## Out of scope for the initial backend

- Complex AI prediction
- Real psychological profiling
- Actual prediction of parents' reactions
- Real-world family relationship scoring
- Automatic location tracking
- Automatic phone-call detection
- Automatic access to call logs
- Fully automated route/navigation services
- Social networking

All consequence scores are **fictional, rule-based comedy mechanics**.

---

# 5. Recommended Technology Stack

## Backend

- Node.js
- Express.js
- JavaScript initially
- REST API

## Database

- Supabase PostgreSQL

## Authentication

- Supabase Auth

## Scheduling / reminders

- Backend scheduled jobs
- Web Push
- Browser service worker

## Deployment

Recommended:

```text
Frontend later → Vercel
Backend → Vercel / Render
Database → Supabase
```

The backend should remain deployable independently.

---

# 6. High-Level Architecture

```text
                         USER
                           │
                           ↓
                       FRONTEND
                      (later)
                           │
                      REST API
                           │
                           ↓
                 ┌──────────────────┐
                 │     EXPRESS      │
                 │   API SERVER     │
                 └────────┬─────────┘
                          │
        ┌─────────────────┼──────────────────┐
        ↓                 ↓                  ↓
 Permission Engine   Valli Engine       Reminder Engine
        │                 │                  │
        ↓                 ↓                  ↓
 Distance Engine    Consequence Engine   Check-in Engine
        │                 │                  │
        └─────────────────┼──────────────────┘
                          ↓
                    PostgreSQL
                    / Supabase
                          │
                          ↓
                    Valli State
                          │
                          ↓
                  Frontend growth data
                          │
                          ↓
                  🌿 VALLI CHEDI 🌿
```

---

# 7. Core Backend Modules

## 7.1 Activity Engine

Responsible for:

- Creating activities
- Updating activities
- Tracking start/end time
- Tracking location
- Tracking overnight status
- Tracking return-home status
- Linking activities to Vallis

Examples:

- NSS camp
- College programme
- Volunteer meeting
- Online meeting
- Trip
- Friend outing
- Community event

---

## 7.2 Valli Engine

Responsible for:

- Creating Vallis
- Assigning categories
- Calculating severity
- Calculating growth points
- Linking Vallis to activities
- Resolving Vallis
- Creating Valli chains

---

## 7.3 Permission Engine

Calculates a fictional permission difficulty using:

- Notice period
- Destination distance
- Overnight status
- Recent activities
- Pending responsibilities

Example:

```text
Destination: Bengaluru
Notice: 1 day
Overnight: Yes

Permission difficulty: 9/10
```

This is a comedic simulation, not a real prediction.

---

## 7.4 Collision Engine

Detects overlapping activities.

Example:

```text
18:00–20:00  NSS Meeting
19:00–21:00  Online Meeting
20:00–21:00  Dinner/Home responsibility
```

Result:

```text
⚠️ VALLI COLLISION DETECTED
Overlapping commitments: 3
Collision score: 8/10
```

---

## 7.5 Consequence Engine

Converts activity conditions into fictional consequences.

Example:

```text
Late permission
        +
Overnight trip
        +
Long-distance travel
        +
Pending home responsibility
        ↓
Multiple Vallis generated
```

---

## 7.6 Reminder Engine

Responsible for:

- Creating reminders
- Scheduling reminders
- Recording completion
- Detecting missed check-ins
- Escalating reminder severity
- Deactivating reminders when no longer required

---

# 8. Database Schema

Recommended initial tables:

```text
users
activities
vallis
valli_events
permissions
reminders
home_debt
valli_state
growth_events
```

---

# 9. `users` Table

Stores minimal user information.

```text
users
-------------------------
id
name
created_at
updated_at
```

Example:

```json
{
  "id": "USER-001",
  "name": "Artha"
}
```

Do not store unnecessary personal information.

---

# 10. `activities` Table

Represents something the user is doing.

```text
activities
-------------------------
id
user_id
title
category
start_time
end_time
location
district
state
overnight
return_home_time
returned_home
status
created_at
updated_at
```

### Suggested categories

```text
RESPONSIBILITY
COLLEGE
NSS
COMMUNITY
MEETING
PERSONAL
TRAVEL
FAMILY
OTHER
```

### Example

```json
{
  "title": "NSS Camp",
  "category": "NSS",
  "location": "Kozhikode",
  "district": "Kozhikode",
  "state": "Kerala",
  "overnight": true,
  "returned_home": false
}
```

---

# 11. `vallis` Table

Main Valli records.

```text
vallis
-------------------------
id
user_id
activity_id
category
title
description
severity
status
growth_points
created_at
resolved_at
```

### Valli categories

```text
RESPONSIBILITY
PERMISSION
TRAVEL
HOME
TIME_COLLISION
COMMUNICATION
NOTICE_PERIOD
COLLEGE
FAMILY
PERSONAL
OTHER
```

### Example

```json
{
  "category": "PERMISSION",
  "title": "Asked permission one day before",
  "severity": 8,
  "status": "ACTIVE",
  "growth_points": 12
}
```

---

# 12. `valli_events` Table

Tracks how a Valli develops.

```text
valli_events
-------------------------
id
valli_id
event_type
description
points
timestamp
```

Example:

```text
NSS Camp
    ↓
Permission required       +4
    ↓
Asked late                +8
    ↓
Travel                    +3
    ↓
Missed class              +3
    ↓
Late home                 +4
```

This table allows a complete Valli Chain.

---

# 13. `permissions` Table

Stores permission analysis.

```text
permissions
-------------------------
id
activity_id
requested_at
required_by
destination
district
state
distance_level
notice_days
notice_score
difficulty_score
status
created_at
```

Possible status:

```text
PENDING
GRANTED
DENIED
CONDITIONAL
CANCELLED
```

---

# 14. `reminders` Table

Stores communication reminders.

```text
reminders
-------------------------
id
user_id
activity_id
type
recipient
interval_hours
next_trigger
last_triggered
last_completed
active
created_at
updated_at
```

For the Achan system:

```text
type = PARENT_CHECKIN
recipient = ACHAN
interval_hours = 5
```

---

# 15. `home_debt` Table

A deliberately humorous representation of pending household responsibilities.

```text
home_debt
-------------------------
id
user_id
activity_id
reason
points
status
created_at
resolved_at
```

Examples:

```text
Missed helping with dinner       +2
Did not complete assigned chore +3
Away all weekend                +5
Online meeting during dinner    +2
Came home late                  +4
```

This is a game mechanic, not an actual measurement of family relationships.

---

# 16. `valli_state` Table

Stores the user's current aggregate state.

```text
valli_state
-------------------------
user_id
total_points
active_vallis
resolved_vallis
growth_level
growth_percentage
severity
last_updated
```

Example:

```json
{
  "total_points": 684,
  "active_vallis": 12,
  "resolved_vallis": 31,
  "growth_level": 7,
  "growth_percentage": 82,
  "severity": "OVERGROWN"
}
```

---

# 17. `growth_events` Table

Stores every event that changes the plant's growth.

```text
growth_events
-------------------------
id
user_id
valli_id
growth_points
growth_type
timestamp
```

Example:

```text
Late permission      +8
Missed class         +3
Late return          +4
Missed check-in      +3
```

This makes it possible for the future frontend to animate individual branches/leaves.

---

# 18. Valli Scoring Engine

Use deterministic rules.

Basic formula:

```text
VALLI SCORE =
Base Score
+ Notice Penalty
+ Distance Penalty
+ Overnight Penalty
+ Collision Penalty
+ Pending Responsibility
+ Communication Penalty
+ Recent Activity Multiplier
```

Example:

```text
Base                  2
Late permission       8
Distance              7
Overnight             3
Home responsibility   4
Communication         3
-----------------------
Total                27
```

---

# 19. Severity Levels

Use a simple 1–10 severity scale.

```text
1–2  → Harmless
3–4  → Mild
5–6  → Growing
7–8  → Serious
9    → Critical
10   → Absolute Valli
```

Example output:

```text
VALLI SEVERITY: 9/10

Status:
🚨 CRITICAL

The chedi has noticed.
```

---

# 20. Notice Period Engine

Calculate:

```text
notice_days =
required_date - permission_requested_date
```

Suggested fictional scoring:

| Notice | Score |
|---|---:|
| 30+ days | 0 |
| 14–29 days | 1 |
| 7–13 days | 2 |
| 4–6 days | 4 |
| 2–3 days | 6 |
| 1 day | 8 |
| Same day | 10 |

Example:

```text
Event: Bengaluru Trip
Notice: 1 day

Notice Valli: 8/10
```

Humorous response:

> You knew about this earlier.
> You simply chose not to tell anyone.

---

# 21. Distance Valli Engine

Use a fictional distance category instead of requiring a complex map API.

```text
LEVEL 1 → Same college
LEVEL 2 → Same district
LEVEL 3 → Nearby district
LEVEL 4 → Other Kerala district
LEVEL 5 → Far Kerala district
LEVEL 6 → Northern Kerala
LEVEL 7 → Very far destination
LEVEL 8 → Outside Kerala
LEVEL 9 → Another state
LEVEL 10 → Extremely far / international
```

Example:

```text
Kollam college       → 1
Another Kollam place → 2
Nearby district      → 3
Kozhikode/Wayanad    → high
Bengaluru             → very high
```

These values are fictional and customizable.

---

# 22. Overnight Engine

When an activity is created:

```text
if overnight == true
    activate overnight logic
```

Overnight logic can create:

- Overnight Valli
- Communication requirement
- Achan check-in reminder
- Additional travel Valli

---

# 23. Achan Check-In Protocol

This is a major feature.

## Rule

The system should only activate the reminder when:

```text
activity.overnight == TRUE
AND
returned_home == FALSE
```

It should not activate for normal day trips.

### Example

```text
Going to college
→ No reminder

Going to event
→ Returning tonight
→ No reminder

Overnight camp
→ Achan protocol ON

Returned home
→ Achan protocol OFF
```

---

# 24. Achan Reminder Lifecycle

```text
Activity created
       ↓
Overnight = YES
       ↓
Create PARENT_CHECKIN reminder
       ↓
Wait 5 hours
       ↓
Notify user
       ↓
"Call Achan"
       ↓
User confirms call
       ↓
Record check-in
       ↓
Schedule next 5-hour check
       ↓
Repeat while away
       ↓
User marks "I'm home"
       ↓
Deactivate reminder
```

---

# 25. Reminder Notification Levels

The reminders can become increasingly dramatic.

### First missed interval

> 📞 Achan Check  
> You haven't called Achan in 5 hours.  
> Please call now.

### Second missed interval

> ⚠️ ACHAN VALLI  
> You REALLY should call Achan.

### Repeated missed check-ins

> 🚨 VALLI ESCALATION  
> Communication protocol has been neglected.

These messages are intentionally humorous.

---

# 26. Check-In API

### Confirm check-in

```http
POST /api/reminders/:id/checkin
```

Request:

```json
{
  "completedAt": "2026-09-04T20:00:00"
}
```

Response:

```json
{
  "status": "COMPLETED",
  "nextCheckIn": "2026-09-05T01:00:00"
}
```

---

# 27. Stop Reminder API

```http
POST /api/reminders/:id/stop
```

Reason:

```json
{
  "reason": "RETURNED_HOME"
}
```

Response:

```json
{
  "active": false,
  "message": "Achan protocol deactivated."
}
```

---

# 28. Valli Collision Engine

The engine checks whether activities overlap.

Pseudo-logic:

```javascript
if (
  activityA.start < activityB.end &&
  activityB.start < activityA.end
) {
    collisionDetected = true;
}
```

For every collision:

```text
Create TIME_COLLISION Valli
Calculate collision points
Create Valli Event
Update growth
```

Example:

```text
NSS meeting       18:00–20:00
Online meeting    19:00–21:00
Dinner            20:00–21:00

Result:
3 overlapping commitments
Collision severity: HIGH
```

---

# 29. Valli Chain Engine

A Valli can create additional Vallis.

Example:

```text
ACTIVITY
"NSS Camp"

      ↓

VALLI #1
Permission

      ↓

VALLI #2
Travel

      ↓

VALLI #3
Missed class

      ↓

VALLI #4
Late home

      ↓

VALLI #5
Home responsibility

      ↓

VALLI #6
Communication
```

Every node is stored as a separate Valli/Event and linked through the original activity or parent Valli.

---

# 30. Permission Difficulty

Example formula:

```text
difficulty =
notice_score
+ distance_score
+ overnight_score
+ recent_activity_score
+ pending_home_score
```

Normalize the result to:

```text
0–10
```

Example:

```text
Notice: 1 day             → 8
Bengaluru                 → 10
Overnight                 → 3
Recent activity           → 4
Pending home responsibility → 4

Raw score = 29
Normalized difficulty = 10/10
```

Output:

> Permission difficulty: **EXTREME**
>
> Recommended notice: 28 days
> Actual notice: 1 day
>
> You have successfully converted a simple permission request into a Valli.

---

# 31. Valli Multiplier

The system can account for accumulated activity.

Example:

```text
New outing
+
Recent outside activities
+
Pending responsibilities
+
Late notice
=
Valli multiplier
```

Possible output:

```text
Base Valli: 2
Recent activity: +3
Responsibility load: +4
Late notice: +8

Final: 17
```

Displayed as:

> Recreational credibility: critically low.

All numbers are fictional.

---

# 32. Home Responsibility System

A user can manually record a pending responsibility.

Example:

```json
{
  "reason": "Help with dinner",
  "points": 2
}
```

The backend adds it to `home_debt`.

When completed:

```http
POST /api/home-debt/:id/resolve
```

The debt is marked resolved.

---

# 33. Valli Growth Engine

This converts Valli points into a frontend-friendly growth state.

Example:

```text
0–50       Seed
51–150     Sprout
151–300    Small Vine
301–500    Growing Chedi
501–750    Overgrown
751–1000   Valli Takeover
1000+      Uncontained
```

The backend should return:

```json
{
  "growthPoints": 684,
  "growthLevel": 7,
  "growthPercentage": 82,
  "status": "OVERGROWN"
}
```

---

# 34. Frontend Contract

The frontend should NOT calculate Valli logic.

It should simply request:

```http
GET /api/valli-state
```

Example response:

```json
{
  "totalVallis": 43,
  "activeVallis": 12,
  "growthPoints": 684,
  "growthLevel": 7,
  "growthPercentage": 82,
  "severity": "OVERGROWN",
  "activeReminders": 1,
  "warnings": [
    "Achan check-in pending",
    "2 responsibilities overlapping",
    "Permission requested late"
  ]
}
```

The frontend can translate this into:

```text
growthLevel 1 → small plant
growthLevel 5 → multiple vines
growthLevel 10 → screen takeover
```

---

# 35. Future Frontend Vision

The eventual frontend should begin clean:

```text
        🌱
```

As Valli increases:

```text
       🌱
      🌿
     🌿🌿
```

Then:

```text
🌿──────────────🌿
      🌿
   🌿     🌿
```

Eventually:

```text
🌿🌿🌿🌿🌿🌿🌿🌿🌿
🌿  DASHBOARD      🌿
🌿     🌿🌿        🌿
🌿 VALLI STATE     🌿
🌿🌿🌿🌿🌿🌿🌿🌿🌿
```

At maximum:

> **VALLI CHEDI HAS ESCAPED CONTROL.**

The backend is responsible for providing the growth data; the frontend is responsible for making the growth visually ridiculous.

---

# 36. REST API Specification

## Users

```http
POST   /api/users
GET    /api/users/:id
```

## Activities

```http
POST   /api/activities
GET    /api/activities
GET    /api/activities/:id
PUT    /api/activities/:id
DELETE /api/activities/:id
```

## Vallis

```http
POST   /api/vallis
GET    /api/vallis
GET    /api/vallis/:id
PUT    /api/vallis/:id
POST   /api/vallis/:id/resolve
GET    /api/vallis/:id/chain
```

## Permission

```http
POST   /api/permissions/analyze
GET    /api/permissions/:activityId
```

## Valli State

```http
GET    /api/valli-state
```

## Growth

```http
GET    /api/growth
GET    /api/growth/history
```

## Reminders

```http
POST   /api/reminders
GET    /api/reminders
POST   /api/reminders/:id/checkin
POST   /api/reminders/:id/stop
```

## Home Debt

```http
POST   /api/home-debt
GET    /api/home-debt
POST   /api/home-debt/:id/resolve
```

---

# 37. Example End-to-End Request

## Input

User creates:

```json
{
  "title": "Bengaluru Trip",
  "category": "PERSONAL",
  "destination": "Bengaluru",
  "state": "Karnataka",
  "startTime": "2026-09-10T08:00:00",
  "endTime": "2026-09-12T20:00:00",
  "overnight": true,
  "permissionRequestedAt": "2026-09-09T20:00:00"
}
```

## Backend processing

```text
1. Validate activity
2. Calculate notice period
3. Calculate distance level
4. Detect overnight
5. Check activity collisions
6. Check pending home responsibilities
7. Analyze permission difficulty
8. Generate relevant Vallis
9. Generate Valli events
10. Calculate growth points
11. Update Valli state
12. Create Achan check-in reminder
13. Return complete result
```

---

# 38. Example Backend Response

```json
{
  "activity": {
    "id": "ACT-102",
    "title": "Bengaluru Trip",
    "overnight": true
  },

  "permission": {
    "difficulty": 10,
    "noticeScore": 8,
    "distanceScore": 10
  },

  "vallisCreated": [
    {
      "category": "PERMISSION",
      "severity": 8,
      "growthPoints": 15
    },
    {
      "category": "TRAVEL",
      "severity": 7,
      "growthPoints": 10
    },
    {
      "category": "OVERNIGHT",
      "severity": 5,
      "growthPoints": 6
    }
  ],

  "reminder": {
    "enabled": true,
    "type": "PARENT_CHECKIN",
    "recipient": "ACHAN",
    "intervalHours": 5
  },

  "valliState": {
    "growthPoints": 684,
    "growthLevel": 7,
    "growthPercentage": 82
  }
}
```

---

# 39. Suggested Backend Folder Structure

```text
valli-chedi-backend/
│
├── src/
│   ├── controllers/
│   │   ├── activityController.js
│   │   ├── valliController.js
│   │   ├── permissionController.js
│   │   ├── reminderController.js
│   │   └── homeDebtController.js
│   │
│   ├── routes/
│   │   ├── activityRoutes.js
│   │   ├── valliRoutes.js
│   │   ├── permissionRoutes.js
│   │   ├── reminderRoutes.js
│   │   └── homeDebtRoutes.js
│   │
│   ├── services/
│   │   ├── valliEngine.js
│   │   ├── consequenceEngine.js
│   │   ├── permissionEngine.js
│   │   ├── collisionEngine.js
│   │   ├── reminderEngine.js
│   │   └── growthEngine.js
│   │
│   ├── models/
│   │   ├── userModel.js
│   │   ├── activityModel.js
│   │   ├── valliModel.js
│   │   ├── reminderModel.js
│   │   └── homeDebtModel.js
│   │
│   ├── utils/
│   │   ├── scoring.js
│   │   ├── distance.js
│   │   └── noticePeriod.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   │
│   └── server.js
│
├── database/
│   └── schema.sql
│
├── .env.example
├── package.json
└── README.md
```

---

# 40. Backend Development Phases

## Phase 1 — Project Setup

- Initialize Node.js
- Install Express
- Configure environment variables
- Connect Supabase
- Create basic server
- Create health-check endpoint

Expected:

```http
GET /health
```

Response:

```json
{
  "status": "ok",
  "service": "valli-chedi-backend"
}
```

---

## Phase 2 — Database

Create:

- users
- activities
- vallis
- valli_events
- permissions
- reminders
- home_debt
- valli_state
- growth_events

Add:

- primary keys
- foreign keys
- timestamps
- indexes where needed

---

## Phase 3 — Activity API

Implement:

```text
Create activity
List activities
Get activity
Update activity
Delete activity
```

---

## Phase 4 — Valli Engine

Implement:

- Valli creation
- Severity
- Growth points
- Categories
- Valli events
- Valli chains

---

## Phase 5 — Permission Engine

Implement:

- Notice period
- Distance level
- Overnight
- Recent activity
- Pending responsibility
- Difficulty score

---

## Phase 6 — Collision Engine

Implement:

- Time overlap detection
- Collision Valli
- Collision severity
- Growth updates

---

## Phase 7 — Achan Check-In

Implement:

- Overnight detection
- Reminder creation
- 5-hour interval
- Check-in confirmation
- Missed check-in
- Escalation
- Stop on return home

---

## Phase 8 — Growth Engine

Implement:

- Total growth points
- Growth level
- Percentage
- Active Valli count
- Growth history

---

## Phase 9 — API Testing

Test using:

- Postman
- Thunder Client
- REST Client
- curl

Test all edge cases.

---

# 41. Important Edge Cases

## Activity cancelled

No future reminders should remain active.

## User returns early

Achan reminder should stop immediately.

## User extends trip

Reminder should continue.

## User changes overnight to false

Achan reminder should be deactivated.

## Activity crosses midnight

The system should still correctly identify overnight status.

## Two activities overlap

Generate one or more collision events without duplicate explosions.

## Permission requested exactly on event date

Notice score = maximum.

## User resolves Valli

Growth history should remain intact.

The Valli should disappear from `active_vallis` but not from historical records.

---

# 42. Data Integrity Rules

1. Every activity belongs to a user.
2. Every Valli should be linked to a user.
3. A Valli may optionally belong to an activity.
4. Every reminder should belong to a user.
5. An overnight Achan reminder should reference its activity.
6. Resolved Vallis should not be deleted.
7. Growth events should be append-only.
8. Historical records should remain available.
9. Reminder duplication should be prevented.
10. The frontend should never be able to directly modify calculated Valli points.

---

# 43. Security

Minimum security requirements:

- Supabase authentication
- User-specific database access
- Environment variables for secrets
- No API keys in frontend code
- Input validation
- Rate limiting
- CORS configuration
- Error handling
- Authorization middleware

A user should only access their own Valli data.

---

# 44. Privacy

The application may contain personal activity information.

Therefore:

- Store only necessary information.
- Do not collect call logs.
- Do not access contacts.
- Do not record actual phone calls.
- Do not track location continuously.
- Do not claim to know how a family member will react.
- Keep fictional consequence scores clearly labeled as game mechanics.

The Achan reminder should simply tell the user:

> "Call Achan."

It should not attempt to call Achan automatically.

---

# 45. Why AI Is Optional

AI can be added later for humorous interpretation.

Example:

User enters:

> "I have a college programme tomorrow but I forgot to tell my parents and now I want to go."

AI could classify it as:

```text
Category: PERMISSION
Notice: VERY_LATE
Severity: HIGH
```

However, AI should not be responsible for the core calculations.

The core Valli engine should remain deterministic.

This makes the project:

- Easier to test
- Easier to explain
- More reliable
- Faster to develop

---

# 46. Future AI Extension

Optional endpoint:

```http
POST /api/valli/analyze-text
```

Input:

```json
{
  "text": "I told them I would be back by 7 but the programme ended at 9."
}
```

Possible output:

```json
{
  "category": "LATE_RETURN",
  "severity": 7,
  "suggestedPoints": 10
}
```

The user should confirm before permanently creating the Valli.

---

# 47. Analytics

Future backend analytics can calculate:

```text
Total Vallis
Active Vallis
Resolved Vallis
Largest Valli
Most common category
Average severity
Most common trigger
Most missed check-in
Most common collision
Total growth
```

Example:

```text
🌿 VALLI ANALYTICS

Total Vallis: 43
Largest category: Permission
Most common trigger: Late notice
Most common collision: Meeting + Home
Achan check-ins missed: 3
Current growth: 82%
```

---

# 48. Demo Scenario

For a project presentation, use one exaggerated scenario.

### Step 1

Create:

> "Bengaluru trip"

### Step 2

Set:

```text
Notice: 1 day
Overnight: Yes
Pending home responsibility: Yes
Recent activities: High
```

### Step 3

Backend generates:

```text
Permission Valli
Travel Valli
Overnight Valli
Home Valli
```

### Step 4

Achan protocol activates.

```text
CALL ACHAN EVERY 5 HOURS
```

### Step 5

Miss one check-in.

Backend creates:

```text
Communication Valli
```

### Step 6

Growth increases.

```text
🌱 → 🌿 → 🌿🌿 → 🌿🌿🌿
```

### Step 7

Frontend eventually shows the entire screen being taken over.

---

# 49. MVP Definition

The backend MVP is complete when it can:

- [ ] Create an activity
- [ ] Store activity
- [ ] Analyze notice period
- [ ] Analyze destination level
- [ ] Detect overnight activity
- [ ] Generate Vallis
- [ ] Calculate severity
- [ ] Calculate growth points
- [ ] Store Valli history
- [ ] Return current Valli state
- [ ] Create Achan reminder for overnight activity
- [ ] Confirm a check-in
- [ ] Stop reminder after returning home
- [ ] Detect activity collisions
- [ ] Resolve Vallis

---

# 50. Stretch Goals

- [ ] Valli graph
- [ ] Valli analytics
- [ ] AI text analyzer
- [ ] Kerala map integration
- [ ] Animated growth events
- [ ] Multiple reminder recipients
- [ ] Valli achievements
- [ ] Random Valli generator
- [ ] Valli leaderboard
- [ ] Export Valli history
- [ ] Social sharing
- [ ] "Valli of the Day"

---

# 51. Final Product Concept

The backend is essentially a **Valli state machine**.

```text
                     ACTIVITY
                         ↓
                ┌────────────────┐
                │ Analyze inputs  │
                └───────┬────────┘
                        ↓
        ┌───────────────┼────────────────┐
        ↓               ↓                ↓
   Permission        Schedule        Overnight
        ↓               ↓                ↓
     Travel         Collision         Achan
        ↓               ↓                ↓
        └───────────────┼────────────────┘
                        ↓
                 CONSEQUENCES
                        ↓
                    VALLIS
                        ↓
                 GROWTH POINTS
                        ↓
                  VALLI STATE
                        ↓
                   FRONTEND
                        ↓
                🌿🌿🌿🌿🌿🌿
```

---

# 52. Final Vision

**Valli Chedi is a deliberately over-engineered system for managing the consequences of having responsibilities.**

The backend does not try to solve the user's life.

It records the mess.

It connects the mess.

It calculates the mess.

It reminds the user about the mess.

And finally:

> **It grows the mess into a plant.**

The ultimate frontend goal is that the user starts with a tiny seed and, through accumulated activities and consequences, eventually ends up with a screen completely consumed by a ridiculous virtual creeper.

### Final tagline options

**Primary:**
> **Permission granted. Consequences pending.**

**Alternative:**
> **You should've asked earlier.**

**Alternative:**
> **Every valli has a consequence.**

**Core philosophy:**
> **You didn't choose the valli. You chose responsibility. The valli came free.**
