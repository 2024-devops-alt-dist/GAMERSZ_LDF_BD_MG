# Backend Service

## Project Overview

A Node.js/Express backend service with MongoDB Atlas integration, featuring:

- TypeScript support
- MongoDB Atlas connection
- Health check endpoint
- Environment variable configuration
- CORS support
- Graceful shutdown handling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- mongosh (MongoDB Shell)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts         # MongoDB connection configuration
│   └── server.ts              # Main application entry point
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Documentation
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

1. Create a `.env` file:

```bash
cp .env.example .env
```

2. Configure your `.env` file with your MongoDB Atlas credentials:

```
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password

PORT=3000
```

### 3. MongoDB Atlas Configuration

1. Create a MongoDB Atlas cluster if you haven't already
2. Whitelist your IP address in MongoDB Atlas:
   - Navigate to Network Access in MongoDB Atlas
   - Add your current IP address
3. Create a database user:
   - Go to Database Access
   - Create a new user with appropriate permissions

### 4. Running the Application

#### Development Mode

```bash
npm run dev
```

This starts the server with hot-reload enabled.

#### Production Build

```bash
npm run build
npm start
```

### 5. Available Endpoints

#### Health Check

- **GET** `/health`
- Returns server and MongoDB connection status
- Example response:

```json
{
	"status": "ok",
	"timestamp": "2024-02-20T10:00:00.000Z",
	"database": "connected"
}
```

### 6. Monitoring and Debugging

#### Connection Diagnostics

The application performs several checks during startup:

- Environment variable validation
- DNS resolution check
- HTTPS connectivity test
- MongoDB connection test

Watch the console output for detailed diagnostics:

```
Environment Check:
──────────────────────────────
Server Port: 3000
MongoDB Username: ✓
MongoDB Password: ✓
──────────────────────────────
```

#### Common Issues and Solutions

1. **Connection Reset (ECONNRESET)**

   - Verify IP whitelist in MongoDB Atlas
   - Check network/firewall settings
   - Ensure valid credentials in `.env`

2. **Authentication Failed**

   - Double-check username/password in `.env`
   - Verify database user permissions

3. **Network Connectivity**
   Test MongoDB connectivity:
   ```bash
   mongosh "mongodb+srv://your-cluster.mongodb.net/" --eval "db.runCommand({ping: 1})"
   ```

### 7. Development Guidelines

#### Code Style

- Use TypeScript for all new files
- Maintain consistent error handling
- Add comments for complex logic
- Use async/await for asynchronous operations

#### Error Handling

The application implements comprehensive error handling:

- Environment validation
- Database connection errors
- Request processing errors
- Graceful shutdown

#### Shutdown Handling

The application handles graceful shutdown for:

- SIGINT (Ctrl+C)
- SIGTERM (system termination)

### 8. Security Notes

- Never commit `.env` file
- Keep MongoDB Atlas IP whitelist updated
- Regularly rotate database passwords
- Use least-privilege access principles
- Enable MongoDB Atlas network security features

### 9. Contributing

1. Create a feature branch
2. Implement changes
3. Update tests and documentation
4. Submit a pull request

### 10. License

ISC License
