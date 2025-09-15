# Real-Time Chat Application Backend

## Overview

This is the backend for a modern, real-time chat application inspired by
WhatsApp's sleek and intuitive design. Built with **NestJS** and powered
by **Socket.IO** for real-time communication, it provides a robust,
scalable, and secure foundation for private messaging, user profile
management, and friend interactions. The backend integrates **MongoDB**
for persistent data storage and **Redis** for real-time user status
caching, ensuring a seamless experience even at scale. With a focus on
**TypeScript** for type safety and a modular architecture, this project
is designed for maintainability and extensibility.

Key highlights: - **Real-Time Messaging**: Instant message delivery with
read receipts and typing indicators. - **Secure Authentication**:
JWT-based authentication with token validation for HTTP and WebSocket
endpoints. - **User Profiles**: Rich profile management with name,
profile picture, and friend lists. - **Scalable Design**: Redis-powered
status tracking and MongoDB for flexible data modeling. - **Elegant
Error Handling**: Custom WebSocket filters to handle unauthenticated
connections gracefully.

This backend powers a WhatsApp-like chat experience with a dark-themed,
modern UI, delivering both functionality and aesthetics.

## Features

### 1. Authentication & Security

-   **User Registration**: Sign up with username, email, and password.
    Supports OTP-based verification for secure onboarding.
-   **Login**: JWT token generation for HTTP and WebSocket
    authentication. Token passed via query params (`userId`).
-   **Password Recovery**: Forgot password flow with OTP-based reset.
-   **Security Measures**:
    -   Passwords hashed using bcrypt.
    -   JWT validation for protected routes and socket connections.
    -   Rate limiting on auth endpoints to prevent brute-force attacks.
    -   Custom WebSocket exception filter to handle unauthenticated
        socket connections and prevent crashes.

### 2. Profile Management

-   **Profile Retrieval**: Fetch user data split into:
    -   `user`: Contains `userId` (number) and `email` (string).
    -   `mongoUser`: Includes `name` (string), `profilepic` (string,
        optional), and `friends` (array of populated friend objects with
        `name` and `profilepic`).
-   **Profile Updates**:
    -   Update display name via `/user/name` (PUT).
    -   Upload profile picture via `/user/addprofilepic` (POST,
        multipart form-data).
    -   Delete profile picture via `/user/deleteprofilepic` (DELETE).
-   **Friend Management**:
    -   Fetch friend list with populated `name` and `profilepic`.
    -   Real-time online/offline status updates for friends using Redis.

### 3. Real-Time Chat

-   **WebSocket Gateway**: Uses Socket.IO (`@nestjs/platform-socket.io`)
    for bidirectional communication.
-   **Room-Based Messaging**:
    -   Dynamic room creation based on user pairs (`userId` and
        `friendId`).
    -   Join/leave rooms with `joinRoom` and `leaveRoom` events.
    -   Fetch chat history for rooms on join (`chatHistory` event).
-   **Message Features**:
    -   Send/receive text messages with metadata (`roomId`, `senderId`,
        `senderName`, `content`, `type`, `status`, `createdAt`).
    -   Message status tracking: `sending`, `sent`, `delivered`, `seen`.
    -   Real-time read receipts via `readMessage` and `messageSeen`
        events.
    -   Bulk status updates for messages when a friend joins the room
        (`seenMessages`).
-   **Typing Indicators**: Emit `typing` event to show "Typing..."
    status in real-time.
-   **Notifications**: Emit `newMessageNotification` for messages
    received outside the active chat.

### 4. Online Status & Presence

-   **Redis Integration**: Cache user online/offline status for fast
    lookups.
-   **Real-Time Updates**: Emit `userStatus` events to notify friends of
    status changes.
-   **Online Friends**: Fetch list of online friends via
    `getOnlineFriends` event.

### 5. Error Handling

-   **WebSocket Exception Filter**: Custom filter (`WsExceptionFilter`)
    catches errors like unauthenticated socket connections, emits
    structured error responses, and prevents server crashes.
-   **HTTP Error Handling**: Global exception filters for consistent API
    error responses.
-   **Logging**: NestJS logger for debugging socket and HTTP events.

### 6. API Endpoints

-   **Auth**:
    -   `POST /api/login`: Authenticate and return JWT token and userId.
    -   `POST /user/register`: Register new user with OTP verification.
    -   `POST /user/verifyotp`: Verify OTP for signup or reset.
    -   `POST /user/forgetPassword`: Initiate password reset.
    -   `POST /user/resetPassword`: Reset password with OTP.
-   **Profile**:
    -   `GET /user/profile`: Fetch user and mongoUser data
        (authenticated).
    -   `PUT /user/name`: Update display name.
    -   `POST /user/addprofilepic`: Upload profile picture.
    -   `DELETE /user/deleteprofilepic`: Remove profile picture.
-   **Chat**:
    -   `GET /chat/friends`: Fetch friends list with populated data.

### 7. Scalability & Performance

-   **Modular Architecture**: NestJS modules (`AuthModule`,
    `UserModule`, `ChatModule`) for clean separation of concerns.
-   **Redis Caching**: Efficiently tracks user statuses to reduce
    database load.
-   **MongoDB**: Flexible schema for messages and profiles, with
    populated friend data.
-   **Type Safety**: TypeScript interfaces for `Message`, `UserData`,
    and WebSocket payloads.

## Tech Stack

-   **Framework**: NestJS (v10+) - Modular, scalable Node.js framework.
-   **Language**: TypeScript - For type-safe code and better developer
    experience.
-   **Database**:
    -   **MongoDB** (via Mongoose): Stores users, profiles, messages,
        and friends.
    -   **Redis**: Caches online/offline statuses.
-   **WebSocket**: Socket.IO (`@nestjs/platform-socket.io`) for
    real-time features.
-   **Authentication**: JWT (jsonwebtoken), bcrypt for password hashing.
-   **File Uploads**: Multer for handling profile picture uploads.
-   **HTTP Client**: Axios for internal API calls.
-   **Validation**: Class-validator for input validation.
-   **Logging**: Built-in NestJS logger, with Winston as an optional
    extension.
-   **API Docs**: Swagger (optional, can be enabled for endpoint
    documentation).

## Installation & Setup

### Prerequisites

-   Node.js (v18+)
-   MongoDB (local or MongoDB Atlas)
-   Redis (local or cloud)
-   NestJS CLI: `npm i -g @nestjs/cli`

### Steps

1. **Clone the Repository**:

```bash
git clone https://github.com/SrabanMondal/ChatAppBackend
cd ChatAppBackend
```

2. **Install Dependencies**:

```bash
npm install
```

3. **Environment Configuration**: Create `.env` in the root like below:

```js
  SQL_URI: string;
  PORT: number;
  NODE_ENV: 'DEV' | 'PROD';
  FRONTEND: string;
  JWT: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  MONGO_URI: string;
  REDIS_PASS: string;
```

4. **Start Services**:

    - Run MongoDB: `mongod`
    - Run Redis: `redis-server`
    - Or use cloud equivalents (MongoDB Atlas, Redis Cloud).

5. **Run the Application**:

```bash
npm run start:dev  # Development with hot reload
npm run start:prod # Production mode
```

6. **Access**:

    - HTTP API: `http://localhost:3000`
    - WebSocket: `ws://localhost:3000` (with `userId` query param)

## Usage

### Authentication

- **Login**: `POST /api/login` with `{ email, password }` to get JWT
    and `userId`.
- **Register**: `POST /user/register` with
    `{ username, email, password }`.
- **OTP Verification**: `POST /user/verifyotp` with `{ otp }`.
- **Password Reset**: `POST /user/forgetPassword` and
    `POST /user/resetPassword`.

### Profile Management

-   **Get Profile**: `GET /user/profile` (requires JWT).
-   **Update Name**: `PUT /user/name` with `{ name }`.
-   **Profile Picture**: `POST /user/addprofilepic` (multipart) and
    `DELETE /user/deleteprofilepic`.

### Chat

-   **Connect Socket**: Use Socket.IO client with `userId` in query:

    ``` javascript
    const socket = io('http://localhost:3000', { query: { userId: '123' } });
    ```

-   **Events**:

    -   `joinRoom`: `{ recieverId }` to join a chat room.
    -   `sendMessage`: Send messages with
        `{ roomId, senderId, senderName, content, type }`.
    -   `readMessage`: Mark message as read with `{ message }`.
    -   `typing`: Emit typing status with `{ roomId, isTyping }`.
    -   `getOnlineFriends`: Fetch online friends for a user.

### Friends

- **Get Friends**: `GET /chat/friends` to retrieve friend list with
    `name` and `profilepic`.

## Error Handling

- **WebSocket Errors**: Custom `WsExceptionFilter` catches
    unauthenticated connections, emits structured errors
    (`{ status, message, code, timestamp, data }`), and disconnects
    gracefully.
- **HTTP Errors**: Standard NestJS exception handling with JSON
    responses.


## Deployment

- **Docker**: Create a `Dockerfile` for containerization.
- **Platforms**: Deploy on AWS, DigitalOcean, or Render.
- **Scaling**: Use Redis cluster for high traffic; PM2 for process
    management.
- **CI/CD**: GitHub Actions for automated testing and deployment.

## Contributing

1.  Fork the repo.
2.  Create a branch: `git checkout -b feature/your-feature`.
3.  Commit: `git commit -m 'Add your feature'`.
4.  Push: `git push origin feature/your-feature`.
5.  Submit a Pull Request.

## Future Improvements

-   Add message search functionality.
-   Support multimedia messages (images, videos).
-   Implement group chats.
-   Enhance rate limiting and security headers.
-   Add API versioning.

## License

GNU License - see [LICENSE](LICENSE) for details.

## Contact

Ping me for issues or suggestions! Built with passion for real-time
apps.
