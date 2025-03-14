# Gamerz - Private Discussion Platform for Gamers

A secure and user-friendly platform that allows gamers to gather in dedicated chat rooms for their favorite games. The goal is to facilitate the discovery of players for a match, enabling them to quickly find someone to play with.

## Project Overview

Gamerz is a private platform where gamers can exchange information in real-time about their favorite games and easily find teammates. To ensure a healthy and motivating environment, each player must submit an application and be approved by an administrator before fully participating in the chat rooms.

### Key Features

- **Secure Registration and Login:**

  - HTTP-only cookies for secure authentication
  - Registration with a motivational text justifying the desire to join
  - Admin approval system for new registrations

- **Real-Time Chat Rooms:**

  - Dedicated chat room for each game
  - Socket.io for real-time communication
  - Persistent message storage in MongoDB

- **User and Role Management:**
  - Players can view chat rooms once registered but can only join after approval
  - Administrators can manage users (approval, deletion, banning)

## Technical Stack

- **Backend:**

  - Express.js with TypeScript
  - JWT authentication with HTTP-only cookies
  - MongoDB with Mongoose ODM
  - Socket.io for real-time communication

- **Frontend:**
  - React with TypeScript
  - React Hook Form with Zod validation
  - React Router for navigation

## Project Structure

```
backend/
├── src/
│   ├── app.ts             # Express application setup
│   │   └── database.ts    # MongoDB connection setup
│   ├── server.ts          # Server startup and database connection
│   ├── config/            # Configuration files
│   │   └── database.ts    # MongoDB connection setup
│   ├── controllers/       # Request handlers
│   │   ├── auth.ts        # Authentication controllers
│   │   └── chatrooms.ts   # Chatroom controllers
│   ├── middlewares/       # Express middlewares
│   │   └── authMiddleware.ts # Authentication middleware
│   ├── models/            # Mongoose models
│   │   ├── ChatRoom.ts    # ChatRoom model
│   │   ├── Message.ts     # Message model
│   │   └── User.ts        # User model
│   ├── routes/            # Express routes
│   │   ├── auth.ts        # Authentication routes
│   │   └── chatrooms.ts   # Chatroom routes
│   ├── scripts/           # Utility scripts
│   │   └── seed.ts        # Database seeding script
│   ├── types/             # TypeScript type definitions
│   │   └── jwt.d.ts       # JWT payload type definition
│   └── utils/             # Utility functions
│       └── socket.ts      # Socket.io setup
├── .env                   # Environment variables
└── package.json           # Dependencies and scripts
```

### Key Files and Their Responsibilities

- **app.ts**: Configures the Express application, middleware, and routes. This file is responsible for setting up the application but doesn't start the server.

- **server.ts**: The main entry point that imports the app from app.ts, connects to MongoDB, and starts the server. It also handles graceful shutdown and defines the health check endpoint.

- **config/database.ts**: Handles the MongoDB connection setup for both the native MongoDB driver and Mongoose ODM.

- **scripts/seed.ts**: A utility script to initialize the database with test data for development and testing.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user

  - Request: `{ username, email, password, motivation }`
  - Response: `{ message }`

- `POST /api/auth/login` - Login a user

  - Request: `{ email, password }`
  - Response: `{ message, user: { id, username, email, role, status } }`
  - Sets HTTP-only cookie with JWT token

- `POST /api/auth/logout` - Logout a user
  - Response: `{ message }`
  - Clears HTTP-only cookie

### Chatrooms

- `GET /api/chatrooms` - Get all chatrooms

  - Response: `{ message, data: [chatrooms] }`
  - Requires authentication (any status)

- `GET /api/chatrooms/:id` - Get a single chatroom
  - Response: `{ message, data: chatroom }`
  - Requires authentication (any status)

## Testing with curl

You can test the API endpoints using curl commands. Here are some examples:

### Health Check

```bash
curl http://localhost:3000/health
```

### Authentication

#### Register a new user

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123", "motivation": "I love gaming!"}' \
  http://localhost:3000/api/auth/register
```

#### Login

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}' \
  -c cookies.txt \
  http://localhost:3000/api/auth/login
```

This saves the authentication cookie to a file called `cookies.txt`.

#### Logout

```bash
curl -X POST -b cookies.txt http://localhost:3000/api/auth/logout
```

### Chatrooms

#### Get all chatrooms

```bash
curl -b cookies.txt http://localhost:3000/api/chatrooms
```

#### Get a single chatroom

```bash
curl -b cookies.txt http://localhost:3000/api/chatrooms/CHATROOM_ID
```

Replace `CHATROOM_ID` with an actual MongoDB ObjectId from the database.

### Alternative Authentication Method

Instead of using cookies, you can also use the Authorization header:

```bash
# Extract token from login response
TOKEN=$(curl -X POST -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}' \
  http://localhost:3000/api/auth/login | jq -r '.token')

# Use token in Authorization header
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/chatrooms
```

Note: This requires `jq` to be installed for JSON parsing.

## User Status Flow

1. **Registration:** User registers with username, email, password, and motivation

   - Status: `pending`
   - Can view chatrooms but cannot join or send messages

2. **Admin Approval:** Admin approves the user

   - Status: `approved`
   - Can view, join, and send messages in chatrooms

3. **Rejection/Banning:** Admin rejects or bans the user
   - Status: `rejected` or `banned`
   - Cannot log in

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/gamerz.git
   cd gamerz
   ```

2. Install dependencies

   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:

   ```
   # MongoDB Configuration
   MONGODB_USERNAME=your_mongodb_username
   MONGODB_PASSWORD=your_mongodb_password

   # Server Configuration
   PORT=3000

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRY=24h
   ```

4. Seed the database with initial data (optional)

   ```bash
   npm run seed
   ```

   This will create an admin user, a test player, and some test chatrooms.

5. Start the development server

   ```bash
   npm run dev
   ```

6. The server will be running at http://localhost:3000

## Development Scripts

- `npm run dev` - Start the development server with hot reloading
- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server
- `npm run seed` - Seed the database with initial data

## License

This project is licensed under the MIT License - see the LICENSE file for details.
