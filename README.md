# FitPlanHub

A fitness plan management platform connecting trainers with users.

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:3000`

**Environment Variables** (create `.env` file):

```
MONGODB_URI=mongodb://localhost:27017/fitplanHub
PORT=3000
JWT_SECRET=your_secret_key
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

**Prerequisites**: Node.js, MongoDB running locally

---

## Features

**Trainers:**

- Create fitness plans (exercise routines + meal plans)
- Manage and delete plans
- Set pricing and duration

**Users:**

- Browse and follow trainers
- Subscribe to plans
- View personalized feed from followed trainers

---

## API Endpoints

### Auth

```
POST /api/auth/signup          Register new user
POST /api/auth/login           Login user
```

### Plans

```
POST   /api/plans              Create plan (trainer only)
GET    /api/plans              Get all plans
GET    /api/plans/my           Get your plans (trainer)
GET    /api/plans/:id          Get plan details
DELETE /api/plans/:id          Delete plan (trainer)
```

### Users

```
POST /api/users/subscribe/:planId   Subscribe to plan
POST /api/users/follow/:trainerId   Follow trainer
POST /api/users/unfollow/:trainerId Unfollow trainer
GET  /api/users/feed                Get personalized feed
GET  /api/users/trainers            Get all trainers
```

---

## How It Works

1. **Authentication**: JWT-based auth with role selection (Trainer/User)
2. **Trainers** create comprehensive plans with:
   - Exercise plans (weeks → days → exercises)
   - Meal plans (daily meals)
   - Supplements, recovery & lifestyle tips
3. **Users** follow trainers and subscribe to plans
4. **Feed System**: Users see plans only from followed trainers
5. **Access Control**: Full plan content visible only to subscribers

---

## Tech Stack

**Backend**: Node.js, Express, MongoDB, JWT  
**Frontend**: React, Vite, Tailwind CSS, Axios

---

## Database Models

**User**: email, password, name, role (trainer/user), followedTrainers, purchasedPlans

**Plan**: title, description, price, duration, trainer, planContent (overview, exercisePlan, mealPlan, extras)

---

## Testing

Import `fitPlanHub.postman_collection.json` into Postman for API testing.
