# 🎬 CineList — Movie Watchlist App

A simplified MERN stack app to track, review, and organize movies.

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, React Router v6, Tailwind CSS |
| Backend  | Node.js, Express.js                 |
| Database | MongoDB + Mongoose                  |
| Auth     | JWT (jsonwebtoken) + bcryptjs       |

---

## Project Structure

```
movie-watchlist/
├── server/
│   ├── index.js              # Express entry point
│   ├── middleware/
│   │   └── auth.js           # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Profile.js        # One-to-One with User
│   │   ├── Movie.js
│   │   ├── Genre.js
│   │   ├── Watchlist.js      # Many-to-Many: Users ↔ Movies
│   │   └── Review.js         # One-to-Many: User → Reviews
│   └── routes/
│       ├── auth.js           # /api/auth/register, /login
│       ├── movies.js         # /api/movies  (CRUD, search, filter)
│       ├── genres.js         # /api/genres
│       ├── watchlist.js      # /api/watchlist
│       ├── reviews.js        # /api/reviews
│       └── profile.js        # /api/profile/me
└── client/
    └── src/
        ├── api.js            # Axios instance with JWT interceptor
        ├── context/
        │   ├── AuthContext.jsx   # user, token, login, logout
        │   └── MovieContext.jsx  # movies, search, genres, filters
        ├── components/
        │   ├── Navbar.jsx
        │   ├── MovieCard.jsx
        │   ├── StarRating.jsx
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── Home.jsx
            ├── LoginRegister.jsx  # Login + Register in one (tabs)
            ├── Dashboard.jsx
            ├── Movies.jsx         # Search + Genre filter + Pagination
            ├── MovieDetail.jsx    # Watchlist buttons + Reviews
            ├── MovieForm.jsx      # Add/Edit (admin only)
            ├── Watchlist.jsx      # Status management
            └── Profile.jsx
```

---

## Setup & Run

### 1. Install backend dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and set MONGO_URI and JWT_SECRET
```

### 3. Install frontend dependencies
```bash
cd client
npm install
```

### 4. Install Tailwind in client
```bash
cd client
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 5. Run both servers
```bash
# From root — runs backend (port 5000) + frontend (port 3000) together
npm run dev:full
```

Or separately:
```bash
npm run dev          # backend only
cd client && npm start  # frontend only
```

---

## API Endpoints

### Auth
| Method | Endpoint             | Description       |
|--------|----------------------|-------------------|
| POST   | /api/auth/register   | Register user     |
| POST   | /api/auth/login      | Login, get JWT    |

### Movies
| Method | Endpoint             | Auth     | Description           |
|--------|----------------------|----------|-----------------------|
| GET    | /api/movies          | Public   | List, search, filter  |
| GET    | /api/movies/:id      | Public   | Movie details         |
| POST   | /api/movies          | Admin    | Create movie          |
| PUT    | /api/movies/:id      | Admin    | Update movie          |
| DELETE | /api/movies/:id      | Admin    | Delete movie          |

### Watchlist (all protected)
| Method | Endpoint             | Description                    |
|--------|----------------------|--------------------------------|
| GET    | /api/watchlist       | Get my watchlist               |
| POST   | /api/watchlist       | Add movie to watchlist         |
| PUT    | /api/watchlist/:id   | Update status                  |
| DELETE | /api/watchlist/:id   | Remove from watchlist          |

### Reviews
| Method | Endpoint                   | Description         |
|--------|----------------------------|---------------------|
| GET    | /api/reviews/movie/:movieId| Get movie reviews   |
| POST   | /api/reviews               | Write a review      |
| PUT    | /api/reviews/:id           | Update your review  |
| DELETE | /api/reviews/:id           | Delete your review  |

### Profile (protected)
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| GET    | /api/profile/me      | Get my profile     |
| PUT    | /api/profile/me      | Update my profile  |

---

## Data Relationships

```
User ──1:1──► Profile
User ──1:N──► Reviews
User ──M:N──► Movies  (via Watchlist)
Genre ──1:N──► Movies (via genreIds array)
```

---

## Roles

- **user** (default): browse, watchlist, reviews, profile
- **admin**: all of the above + add/edit/delete movies and genres
