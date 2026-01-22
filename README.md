# MePass Clone - Event Booking Platform

A full-stack MERN (MongoDB, Express, React, Node.js) clone of mepass.in - an event ticketing platform with city-based event discovery.

## Features

- 🏙️ **City-based event filtering** - Select your city to view local events
- 🎫 **Event discovery** - Hero carousel + grid of event cards
- 🔐 **JWT Authentication** - Secure login & registration
- 📅 **Event booking** - Book tickets for events
- 👤 **User dashboard** - View booking history
- 🎪 **Organizer dashboard** - Create and manage events

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Tailwind CSS |
| Backend | Express.js, Node.js |
| Database | MongoDB with Mongoose |
| Authentication | JWT (jsonwebtoken) |
| Styling | Tailwind CSS 3.4 |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Start MongoDB

Make sure MongoDB is running locally on `mongodb://localhost:27017` or update the connection string in `server/.env`.

### 2. Install & Run Backend

```bash
cd server
npm install
npm run dev
```

Server runs on http://localhost:5000

### 3. Seed Database

Open in browser or use curl:
```
POST http://localhost:5000/api/seed
```

This creates:
- 8 cities (Mumbai, Delhi, Bangalore, etc.)
- Admin user: admin@mepass.in / admin123
- Organizer user: organizer@mepass.in / organizer123

### 4. Install & Run Frontend

```bash
cd client
npm install
npm start
```

App runs on http://localhost:3000

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@mepass.in | admin123 |
| Organizer | organizer@mepass.in | organizer123 |
| User | Register a new account | - |

## Project Structure

```
mepass-clone/
├── server/                 # Backend API
│   ├── config/            # Database config
│   ├── middleware/        # Auth middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── server.js          # Entry point
│   └── package.json
│
└── client/                 # React Frontend
    ├── public/
    ├── src/
    │   ├── components/    # React components (.jsx)
    │   ├── context/       # Auth & City contexts
    │   ├── pages/         # Page components
    │   ├── App.js         # Main app with routing
    │   └── index.css      # Tailwind CSS
    ├── tailwind.config.js
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - List events (filter by city, category)
- `GET /api/events/featured` - Get featured events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (organizer)
- `PUT /api/events/:id` - Update event (organizer)
- `DELETE /api/events/:id` - Delete event (organizer)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - Get user's bookings

### Cities
- `GET /api/cities` - List all cities
- `POST /api/cities` - Add city (admin)

## License

This project is for educational purposes only.
