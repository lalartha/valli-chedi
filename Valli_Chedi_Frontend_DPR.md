# 🌿 Valli Chedi — Frontend Implementation DPR

## 1. Purpose

Build a clean, minimal, funny frontend for Valli Chedi and connect it to the already-built backend.

The frontend's signature feature is a progressively growing virtual creeper/vine. Its growth must be driven by backend data such as `growthPoints`, `growthLevel`, and `growthPercentage`.

> **The work itself isn't the Valli. Everything that happens because of the work is.**

The frontend visualizes the mess. The backend remains the source of truth.

---

## 2. Visual Direction

### Style

- Minimal
- Spacious
- White-dominant
- Sap-green primary accent
- Earthy brown secondary accent
- Soft rounded cards
- Slightly hand-drawn botanical illustrations
- Modern SaaS dashboard structure
- Humour through microcopy rather than clutter

Avoid neon colors, dark-dashboard styling, excessive gradients, excessive cards, dense charts, and constant animations.

### Palette

```css
:root {
  --sap-green: #4F7F32;
  --sap-green-dark: #365D24;
  --sap-green-light: #EAF2E3;
  --brown: #765238;
  --brown-dark: #523724;
  --brown-light: #EFE5DA;
  --white: #FFFFFF;
  --off-white: #FAFAF7;
  --text-primary: #1E241B;
  --text-secondary: #6C7267;
  --border: #E6E8E0;
}
```

Use roughly 70–80% white/off-white, 10–15% sap green, and 5–10% brown.

---

## 3. Recommended Frontend Stack

- React
- Vite or the frontend framework already selected for the project
- React Router
- TanStack Query for server state
- Lucide React for icons
- Framer Motion for subtle plant/UI animation
- Recharts only if statistics need charts
- CSS/Tailwind depending on the existing project setup

Do not introduce a new framework if the existing frontend scaffold already has one.

---

# 4. Main Layout

Desktop:

```text
┌──────────────────────────────────────────────────────────────┐
│ Sidebar │                     Dashboard                      │
│         │                                                     │
│ Logo    │ Hey, Artha 👋                                      │
│         │ Your valli chedi is growing...                     │
│ Home    │                                                     │
│         │       VALLI SCORE                                  │
│ Activity│          437 / 1000                                │
│         │                                                     │
│ Chain   │              🌿 Valli Chedi                        │
│         │                                                     │
│ Remind  │ ┌────────────────┐ ┌───────────────────────────┐   │
│         │ │ Growth         │ │ Achan Check-in            │   │
│ Stats   │ │ Level 5        │ │ 02h 17m                   │   │
│         │ │ ─────●────     │ │ [I Called Achan ✓]        │   │
│ Settings│ └────────────────┘ └───────────────────────────┘   │
│         │                                                     │
│         │ ┌────────────────┐ ┌───────────────────────────┐   │
│         │ │ Active Vallis  │ │ Next Event                │   │
│         │ │ 12             │ │ NSS Camp                  │   │
│         │ └────────────────┘ └───────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

On mobile, convert the sidebar into a bottom navigation and stack cards vertically.

---

# 5. Navigation

Desktop sidebar:

1. Home
2. My Activities
3. Valli Chain
4. Reminders
5. Stats
6. Settings

Use simple Lucide icons. Active navigation should use sap-green background with white icon/text.

---

# 6. Dashboard

The dashboard should answer only:

1. How much Valli do I have?
2. How grown is my chedi?
3. What is currently causing trouble?
4. Do I need to call Achan?
5. What is coming next?

Everything else goes to separate pages.

---

# 7. Valli Score

Display:

```text
VALLI SCORE

437 / 1000

AVERAGE

Not out of control yet.
But it wants to be.
```

Example backend response:

```json
{
  "totalVallis": 43,
  "activeVallis": 12,
  "growthPoints": 437,
  "growthLevel": 5,
  "growthPercentage": 54,
  "severity": "GROWING"
}
```

Never calculate the final score independently in the frontend.

---

# 8. Virtual Valli Chedi

This is the signature UI.

Do not create separate static screenshots for every level. Build the plant as an SVG/component or layered assets.

Backend:

```text
growthPoints
growthLevel
growthPercentage
        ↓
Frontend plant renderer
        ↓
🌿 visual growth
```

Suggested levels:

```text
1  Tiny Sprout
2  Small Vine
3  Visible Creeper
4  Branching
5  Growing Chedi
6  Large Vine
7  Overgrown
8  Spreading
9  Room Takeover
10 Absolute Valli
```

The requested default visual should look approximately like Level 5: clearly grown, but not yet ridiculous.

Suggested component:

```jsx
<ValliChedi
  growthLevel={state.growthLevel}
  growthPercentage={state.growthPercentage}
  severity={state.severity}
/>
```

The component must only visualize state. It must not calculate backend business rules.

---

# 9. Plant Animation

When growth changes:

```text
new branch appears
      ↓
new leaf grows
      ↓
small bounce
      ↓
settles
```

Use subtle 700–1200ms transitions.

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Do not constantly animate the plant.

---

# 10. Growth Card

Example:

```text
VALLI CHEDI GROWTH

Level 5

The vine is spreading nicely.

────────────●────────────

1       3       5       7       10
Seed    Sprout  Growing Overgrown Takeover
```

Backend provides the level and percentage. The frontend only renders them.

---

# 11. Achan Check-In

Show this card only when an active overnight activity has an active Achan reminder.

Example:

```text
ACHAN CHECK-IN

Next check-in in

02h 17m

Last check-in:
3h 43m ago

[ I Called Achan ✓ ]

Every 5 hours. Or else...
```

Critical rule:

```text
overnight = true
AND
returned_home = false
AND
reminder.active = true
```

The backend decides whether the reminder exists.

The frontend does not create or schedule the reminder itself.

---

# 12. Achan Check-In Flow

```text
Create overnight activity
        ↓
Backend creates reminder
        ↓
Frontend fetches reminder
        ↓
Display countdown
        ↓
Notification becomes due
        ↓
User clicks "I Called Achan"
        ↓
POST /api/reminders/:id/checkin
        ↓
Backend resets next trigger
        ↓
Frontend refreshes reminder
```

Endpoints expected from the current backend design:

```http
GET  /api/reminders
POST /api/reminders/:id/checkin
POST /api/reminders/:id/stop
```

If the actual backend uses different paths, adapt the frontend service layer instead of changing the UI.

---

# 13. Countdown

The backend's `next_trigger` is the source of truth.

Example:

```json
{
  "next_trigger": "2026-09-05T01:20:00Z"
}
```

Calculate the displayed countdown locally from the server timestamp. Do not call the backend every second.

Refresh server state periodically and after mutations.

---

# 14. Next Event

Example:

```text
NEXT EVENT

NSS Camp

Kozhikode • 2 Days

[ Overnight ]

Permission asked:
1 day before
```

Use the real activity returned by the backend.

Possible endpoint:

```http
GET /api/activities
```

---

# 15. Active Vallis

Example:

```text
ACTIVE VALLIS

Bengaluru Trip        +29
Permission Valli

NSS Camp Preparation  +18
Responsibility Valli

Online Meeting Clash  +14
Time Collision Valli

Missed Dinner          +8
Home Valli
```

Use:

```http
GET /api/vallis
```

Do not hard-code demo entries in production.

---

# 16. Valli Chain Page

This page should visualize causality.

Example:

```text
NSS CAMP
   │
   ├── Permission
   │      └── Asked 1 day before
   │
   ├── Travel
   │      └── Outside district
   │
   ├── Overnight
   │      └── Achan check-in
   │
   ├── Home responsibility
   │
   └── Time collision
```

Use a vertical timeline/tree with:

- icon
- title
- category
- points
- timestamp
- status

---

# 17. Activity Creation

Fields:

```text
Activity title
Category
Start date/time
End date/time
Location
District
State
Overnight?
Expected return time
```

If overnight is selected, the backend decides whether the Achan Check-In Protocol activates.

---

# 18. Permission Analyzer

Optional dashboard/page feature:

```text
Destination
Purpose
Date
Departure
Return
Notice date
```

Send:

```http
POST /api/permissions/analyze
```

Expected response concept:

```json
{
  "distanceLevel": 8,
  "noticeDays": 1,
  "noticeScore": 8,
  "difficultyScore": 9,
  "status": "CRITICAL"
}
```

Render:

```text
PERMISSION DIFFICULTY

█████████░ 9/10

Critical

You knew about this.
You simply chose tomorrow.
```

---

# 19. Reminders Page

Show active and completed reminders.

```text
ACTIVE REMINDERS

☎ Achan Check-In
Every 5 hours
Next: 02h 17m
[Called]

Completed
...
```

---

# 20. Statistics Page

Keep it minimal.

Show:

```text
Total Vallis       43
Growth Points      437
Active             12
Resolved           31

Most common Valli  Permission
Highest Valli      Travel
```

Optional single chart:

```text
Valli Growth Over Time
```

Do not turn the app into an analytics dashboard.

---

# 21. API Architecture

Do not put fetch calls directly inside every component.

Use:

```text
src/
├── api/
│   ├── client.js
│   ├── activities.js
│   ├── vallis.js
│   ├── permissions.js
│   ├── reminders.js
│   └── growth.js
│
├── hooks/
│   ├── useValliState.js
│   ├── useVallis.js
│   ├── useActivities.js
│   └── useReminders.js
│
├── components/
├── pages/
├── assets/
└── App.jsx
```

---

# 22. Central API Client

Example:

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
```

Production URL must come from environment configuration.

---

# 23. Environment Variables

Development:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Production:

```env
VITE_API_BASE_URL=https://YOUR-BACKEND-DOMAIN/api
```

Never put server-only secrets in frontend environment variables.

---

# 24. API Services

Example:

```js
export const getValliState = () =>
  apiRequest("/valli-state");

export const getVallis = () =>
  apiRequest("/vallis");

export const getActivities = () =>
  apiRequest("/activities");

export const getReminders = () =>
  apiRequest("/reminders");

export const checkInReminder = (id) =>
  apiRequest(`/reminders/${id}/checkin`, {
    method: "POST"
  });
```

Keep endpoint knowledge inside the API layer.

---

# 25. Frontend Data Flow

Dashboard startup:

```text
Authenticate
    ↓
Load user
    ↓
Load Valli State
    ↓
Load Vallis
    ↓
Load Activities
    ↓
Load Reminders
    ↓
Render dashboard
```

Fetch independent resources in parallel where possible:

```js
Promise.all([
  getValliState(),
  getVallis(),
  getActivities(),
  getReminders()
]);
```

TanStack Query can manage this more cleanly.

---

# 26. Synchronization

Use three mechanisms.

### A. Initial fetch

Load current backend state when the page opens.

### B. Refetch after mutations

Example:

```text
"I Called Achan"
      ↓
POST request
      ↓
Backend updates reminder
      ↓
Frontend uses response
      ↓
Refetch reminder/state
```

### C. Periodic refresh

Use approximately 30–60 seconds for dashboard server state.

Countdown itself updates locally every second.

If the backend later supports WebSockets/Supabase Realtime, add realtime synchronization as an upgrade.

---

# 27. Backend Source of Truth

The frontend must NOT independently calculate:

- Valli score
- Growth points
- Permission difficulty
- Notice score
- Distance score
- Home debt
- Collision score
- Reminder activation
- Reminder schedule
- Severity

Correct architecture:

```text
Frontend
   ↓
request
   ↓
Backend
   ↓
business logic
   ↓
database
   ↓
response
   ↓
Frontend visualization
```

---

# 28. Data Adapter Layer

If the backend returns snake_case while the UI uses camelCase, normalize once.

Backend:

```json
{
  "growth_points": 437,
  "growth_level": 5
}
```

Frontend model:

```js
{
  growthPoints: 437,
  growthLevel: 5
}
```

Example:

```js
function mapValliState(data) {
  return {
    totalVallis: data.total_vallis,
    activeVallis: data.active_vallis,
    growthPoints: data.growth_points,
    growthLevel: data.growth_level,
    growthPercentage: data.growth_percentage,
    severity: data.severity
  };
}
```

This prevents API naming differences from spreading through the UI.

---

# 29. Authentication

If the existing backend uses Supabase Auth:

```text
Frontend session
      ↓
Access token
      ↓
Authorization: Bearer <token>
      ↓
Express backend
      ↓
User-specific data
```

Do not create a second authentication system.

Never expose a Supabase service-role key in the browser.

---

# 30. Notifications

For Achan Check-In, the ideal architecture is:

```text
Backend scheduler
      ↓
Reminder due
      ↓
Web Push
      ↓
Browser notification
      ↓
User opens Valli Chedi
      ↓
Check in
```

The browser should not be responsible for the authoritative five-hour schedule.

A service worker can handle push notifications.

---

# 31. Error / Loading / Empty States

Loading:

> 🌱 Growing the chedi...

Backend error:

> The chedi lost connection to reality.

Button:

```text
[ Try again ]
```

No Vallis:

> No vallis yet.  
> Enjoy the peace while it lasts.

No reminders:

> Nobody needs you every five hours. Yet.

Keep these states visually minimal.

---

# 32. Funny Copy

Use humour selectively.

Low:

> You're doing fine. Suspiciously fine.

Medium:

> The vine has noticed your calendar.

High:

> This is no longer a plant. This is a situation.

Critical:

> Permission granted. Consequences pending.

Do not make every label a joke.

---

# 33. Responsive Design

Breakpoints:

```text
Mobile  < 768px
Tablet  768–1024px
Desktop > 1024px
```

Mobile:

- bottom navigation
- single-column cards
- plant remains the hero
- compact header

Never allow horizontal scrolling.

---

# 34. Accessibility

Implement:

- semantic HTML
- keyboard navigation
- visible focus states
- ARIA labels
- adequate contrast
- reduced-motion support
- text equivalents for plant growth
- clear button labels

For example, never communicate Level 5 only through the illustration. Also show:

```text
Level 5 — Growing
437 growth points
54% through current level
```

---

# 35. Component Structure

```text
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── MobileNav.jsx
│   │   └── Header.jsx
│   │
│   ├── valli/
│   │   ├── ValliChedi.jsx
│   │   ├── ValliScore.jsx
│   │   ├── GrowthLevel.jsx
│   │   ├── ValliList.jsx
│   │   └── ValliChain.jsx
│   │
│   ├── reminders/
│   │   ├── ReminderCard.jsx
│   │   ├── AchanCheckIn.jsx
│   │   └── ReminderList.jsx
│   │
│   ├── activities/
│   │   ├── ActivityCard.jsx
│   │   ├── ActivityForm.jsx
│   │   └── ActivityList.jsx
│   │
│   └── common/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Badge.jsx
│       ├── Loading.jsx
│       └── EmptyState.jsx
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Activities.jsx
│   ├── ValliChain.jsx
│   ├── Reminders.jsx
│   ├── Statistics.jsx
│   └── Settings.jsx
│
├── api/
├── hooks/
├── utils/
├── assets/
└── App.jsx
```

---

# 36. Routes

```text
/
    Dashboard

/activities
    Activities

/activities/new
    Create Activity

/valli-chain
    Valli Chain

/reminders
    Reminders

/stats
    Statistics

/settings
    Settings
```

---

# 37. Development Plan

## Phase 1 — Scaffold

- initialize frontend
- configure environment variables
- routing
- global theme
- layout

## Phase 2 — Static UI

Build with temporary data:

- sidebar
- dashboard
- score
- plant
- growth card
- Achan card
- next event
- active vallis
- wisdom

Do not integrate backend yet.

## Phase 3 — Plant System

- SVG/component plant
- levels
- growth percentage
- subtle animations
- responsive rendering

## Phase 4 — API Integration

Connect:

```text
/valli-state
/vallis
/activities
/reminders
```

## Phase 5 — Achan Check-In

- countdown
- check-in API
- refresh
- active/inactive states
- notification support

## Phase 6 — Activities

- create
- update
- list
- detail
- validation

## Phase 7 — Valli Chain

- causal timeline
- event details
- severity
- points

## Phase 8 — Stats

- real backend statistics
- one simple growth chart

## Phase 9 — Polish

- mobile
- accessibility
- errors
- loading
- empty states
- animation tuning
- performance

---

# 38. Testing

Test:

- dashboard loads
- plant renders all levels
- growth percentage updates
- Achan reminder appears only when appropriate
- countdown works
- check-in request succeeds
- activity creation works
- backend errors display correctly
- empty states work
- mobile layout works
- authentication works
- data belongs to the correct user

Critical integration test:

```text
Create overnight activity
       ↓
Backend creates reminder
       ↓
Frontend refreshes
       ↓
Achan card appears
       ↓
Check-in
       ↓
Backend resets reminder
       ↓
Frontend updates
```

---

# 39. Edge Cases

### Returned home

If:

```text
returned_home = true
```

the active Achan card must disappear/deactivate after backend state refresh.

### No overnight activity

Do not show the Achan reminder as an active requirement.

### Multiple overnight activities

Do not create duplicate reminders from the frontend.

### Backend unavailable

Show a small retry state instead of destroying the whole dashboard.

### Zero growth

Render a tiny sprout.

### Maximum growth

Render the maximum plant state and use copy such as:

> The chedi has exceeded reasonable limits.

---

# 40. Visual Asset Strategy

Recommended asset structure:

```text
assets/valli/
├── soil.svg
├── stem.svg
├── leaves.svg
├── branch.svg
├── sprout.svg
└── stages/
    ├── level-1.svg
    ├── level-2.svg
    ├── level-3.svg
    ├── level-4.svg
    ├── level-5.svg
    ├── level-6.svg
    └── level-7.svg
```

Prefer reusable SVG/layered components over large raster images.

The plant should remain crisp at different screen sizes.

---

# 41. Performance

- Do not reload the whole dashboard every second.
- Countdown updates locally.
- Cache server state.
- Refetch after mutations.
- Keep plant assets lightweight.
- Avoid hundreds of DOM nodes for plant leaves.
- Lazy-load statistics if necessary.
- Avoid unnecessary animation.

---

# 42. Important Antigravity Rules

When giving this DPR to Antigravity, instruct it:

1. First inspect the existing frontend/backend structure.
2. Do not rewrite the backend.
3. Do not invent API endpoints if the backend already provides them.
4. Map the actual backend response fields to frontend models.
5. Build the UI with mock data first if API integration is not immediately clear.
6. Keep all API calls in an API/service layer.
7. Keep all business calculations in the backend.
8. Make the plant visualization data-driven.
9. Match the sap-green/white/brown visual language.
10. Keep the dashboard intentionally minimal.
11. Do not fill empty space with unnecessary widgets.
12. Preserve responsive behaviour.
13. Test every API integration against the actual backend.
14. Add loading, error, and empty states.
15. Never expose secrets in frontend code.

---

# 43. Definition of Done

The frontend is complete when:

- [ ] Minimal white/sap-green/brown UI implemented
- [ ] Dashboard matches the approved visual direction
- [ ] Virtual Valli Chedi renders dynamically
- [ ] Plant growth follows backend state
- [ ] Valli score comes from backend
- [ ] Growth level comes from backend
- [ ] Active Vallis come from backend
- [ ] Next activity comes from backend
- [ ] Achan Check-In comes from backend
- [ ] Check-in button updates backend
- [ ] Overnight logic remains backend-controlled
- [ ] API calls are centralized
- [ ] Authentication is integrated
- [ ] Loading/error/empty states work
- [ ] Mobile layout works
- [ ] Accessibility basics work
- [ ] Valli Chain uses real backend data
- [ ] Statistics use real backend data
- [ ] Demo/mock data is removed from production paths

---

# 44. Final Product Philosophy

The frontend should NOT feel like a generic productivity dashboard.

It should feel like:

> **A beautifully designed dashboard for a plant that should not be this large.**

The UI stays calm and minimal while the backend becomes increasingly ridiculous.

**The plant is the joke.  
The backend is the bureaucracy.  
The dashboard is the evidence.**

### Final tagline

**Permission granted. Consequences pending. 🌿**
