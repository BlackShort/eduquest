# Proctoring Service

A microservice-based backend API for managing proctoring sessions and events in an online examination system.

## Overview

This service is part of a larger proctoring ecosystem and provides APIs for:
- Recording proctoring violation events
- Managing exam sessions and scoring
- Tracking student behavior during exams
- Providing faculty/admin access to session data

## Features

### Student Features
- Submit proctoring events during exam sessions
- Complete exam sessions

### Faculty/Admin Features
- View detailed session information with events
- Access student exam history
- Review exam session summaries
- Update session status (ACTIVE, COMPLETED, FLAGGED, CLEARED)

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Gateway-based (expects headers from API Gateway)

## Violation Detection Types

The service tracks the following violation types:
- `NO_FACE` - No face detected (weight: 1)
- `MULTIPLE_FACES` - Multiple faces detected (weight: 4)
- `PHONE_DETECTED` - Phone/mobile device detected (weight: 6)
- `LAPTOP_DETECTED` - Additional laptop detected (weight: 5)
- `LIP_MOVEMENT_TALKING` - Lip movement/talking detected (weight: 3)
- `TAB_SWITCH` - Tab switching behavior (weight: 2)

Sessions are automatically flagged when the suspicion score reaches 20 points.

## Installation

```bash
# Install dependencies
npm install

# Create .env file with required variables (see Environment Variables section below)

# Start the service
npm start

# Development mode with auto-reload
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB connection string (replace with your database URI)
MONGO_URI=mongodb://localhost:27017/proctor-service

# Server port (optional, defaults to 4004)
PORT=4004
```

## API Endpoints

### Health Check
```
GET /health
```

### Student Endpoints
```
POST /proctor/events
POST /proctor/sessions/:sessionId/complete
```

### Faculty/Admin Endpoints
```
GET /proctor/sessions/:sessionId
GET /proctor/students/:studentId/exams/:examId
GET /proctor/exams/:examId/sessions
PATCH /proctor/sessions/:sessionId/status
```

## Authentication

This service expects authentication to be handled by an API Gateway. Required headers:
- `student-id`: For student requests
- `user-role`: For role-based access (admin, faculty, student)

## Data Models

### ProctorSession
- Tracks exam sessions
- Stores violation counts and suspicion scores
- Maintains session status and timestamps

### ProctorEvent
- Records individual proctoring events
- Includes event type, confidence, and metadata
- Timestamped for timeline reconstruction

## Scoring System

Each violation type has an assigned weight. The suspicion score is calculated as:
```
score = weight × confidence
```

When a session's total suspicion score reaches or exceeds 20, it is automatically flagged.

## Architecture Notes

This service is designed to work in a microservices architecture and focuses solely on:
- Event storage and retrieval
- Session management
- Scoring logic

**This service does NOT include:**
- Frontend applications
- AI/ML detection systems
- Video/audio capture
- Real-time streaming
- Media storage

These components should be provided by separate services in the ecosystem.

## Project Structure

```
proctor-service/
├── config/
│   └── db-config.js          # Database connection
├── controllers/
│   └── proctor.controller.js # Request handlers
├── middleware/
│   ├── authFromGateway.js    # Gateway auth middleware
│   ├── errorHandler.js       # Error handling
│   └── requireRole.js        # Role-based access
├── models/
│   ├── ProctorEvent.js       # Event schema
│   └── ProctorSession.js     # Session schema
├── routes/
│   └── proctor.routes.js     # Route definitions
├── services/
│   └── proctor.service.js    # Business logic
├── utils/
│   └── scoring.js            # Scoring configuration
├── server.js                 # Application entry point
└── package.json
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev
```

## API Usage Examples

### Submit a Proctoring Event
```bash
curl -X POST http://localhost:4004/proctor/events \
  -H "Content-Type: application/json" \
  -H "student-id: student123" \
  -d '{
    "examId": "exam456",
    "sessionId": "session789",
    "eventType": "MULTIPLE_FACES",
    "confidence": 0.95,
    "metadata": { "faceCount": 2 },
    "timestamp": "2024-01-15T10:30:00Z"
  }'
```

### Complete a Session
```bash
curl -X POST http://localhost:4004/proctor/sessions/session789/complete \
  -H "student-id: student123"
```

### Get Session Details (Faculty)
```bash
curl -X GET http://localhost:4004/proctor/sessions/session789 \
  -H "user-role: faculty"
```

### Get Exam Sessions Summary (Faculty)
```bash
curl -X GET http://localhost:4004/proctor/exams/exam456/sessions \
  -H "user-role: faculty"
```

### Update Session Status (Admin)
```bash
curl -X PATCH http://localhost:4004/proctor/sessions/session789/status \
  -H "Content-Type: application/json" \
  -H "user-role: admin" \
  -d '{ "status": "CLEARED" }'
```

## Contributing

This is a backend service component. When contributing:
1. Maintain the microservices architecture
2. Keep endpoints RESTful
3. Update documentation for API changes
4. Follow existing code structure

## Support

For questions or issues, please refer to the main project documentation or contact the development team.