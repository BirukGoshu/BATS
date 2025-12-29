# Bingo Fashion - Frontend Application

A production-ready React.js frontend for Bingo Fashion, a clothing manufacturing, fashion design, and online sales platform.

## Features

- 👤 User Management (Registration, Login, Profile)
- 👕 Product Management (Clothing products with categories, sizes, colors)
- 🎨 Design Management (Fashion design upload and gallery)
- 🛒 Shopping Cart & Checkout
- 💳 Payment Integration
- 📦 Order Management & Tracking
- 👨‍💼 Role-based Dashboards (Admin, Designer, Customer)

## Tech Stack

- React.js 18
- React Router v6
- Axios for API calls
- Tailwind CSS for styling
- Context API for state management
- T Authentication

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Build

```bash
npm run build
```

## Backend Integration

This frontend is designed to work with a Django Rest Framework backend. Update the API base URL in `src/services/api.js` to match your backend server.

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── services/      # API service layers
├── context/       # React Context providers
├── routes/        # Route configuration
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
└── assets/        # Static assets
```


