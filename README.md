# MissionMate

A goal tracking and mission management application built with React and Node.js.

## Features

- User Authentication with JWT
- Goal Setting and Tracking
- Real-time Chat
- AI-powered Motivational Quotes
- Progress Visualization

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
- Copy `.env.example` to `.env`
- Fill in your environment variables

3. Start the development server:
```bash
npm start
```

4. Run tests:
```bash
npm test
```

## Docker

Build the image:
```bash
docker build -t missionmate .
```

Run the container:
```bash
docker run -p 3000:3000 missionmate
```

## Deployment

The application can be deployed using Kubernetes. Configuration files are in the `kubernetes` directory.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
