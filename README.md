# StudyLens Web Platform

The StudyLens Web Platform is a dashboard and analytics tool for users of the StudyLens desktop application. It provides a secure way for users to manage their accounts and visualize their study session performance data.

## Features

- **Authentication System**: Secure user registration, login, and session management
- **User Dashboard**: Visual overview of study performance with key metrics
- **Session Logs**: Detailed table of all study sessions with sorting capabilities
- **Privacy-Focused**: Works seamlessly with the StudyLens desktop application that processes webcam data locally

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: NextAuth.js with JWT
- **Visualization**: Chart.js

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/studylens-web.git
   cd studylens-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/studylens
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/src/app`: Next.js app router pages
- `/src/components`: Reusable UI components
- `/src/models`: MongoDB data models
- `/src/lib`: Utility functions and libraries
- `/src/providers`: Context providers (Auth, etc.)
- `/public`: Static assets

## API Endpoints

- **POST /api/register**: Create a new user account
- **POST /api/auth/[...nextauth]**: Authentication routes (login, session)
- **GET /api/sessions**: Fetch user's study sessions
- **POST /api/sessions**: Create a new study session 

## Security

This application implements several security best practices:

- Password hashing with bcrypt
- JWT-based authentication with HttpOnly cookies
- Server-side session validation
- Input validation
- HTTPS enforcement in production

## Data Flow

1. User studies with the StudyLens desktop application
2. Desktop app analyzes webcam feed locally to track focus, drowsiness, etc.
3. User manually sends aggregated statistical data to the web platform
4. Web platform stores this data and provides visualization and analysis

## License

This project is licensed under the MIT License - see the LICENSE file for details.
