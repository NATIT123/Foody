# Foody - Restaurant Discovery & Food Ordering Platform

A full-stack web application that enables users to discover restaurants, browse menus, place orders, and leave reviews. Built with modern web technologies including React, Redux, Node.js, and MongoDB.

## 🚀 Features

### Core Functionality

- **Restaurant Discovery**: Search and filter restaurants by location, cuisine, and ratings [1](#0-0)
- **User Authentication**: Secure login/register system with JWT tokens [2](#0-1)
- **Food Ordering**: Add items to cart and place orders with delivery information [3](#0-2)
- **Reviews & Ratings**: Multi-criteria rating system for restaurants [4](#0-3)
- **Restaurant Management**: Restaurant owners can manage their establishments and menus [5](#0-4)
- **Admin Dashboard**: Administrative interface for managing users and restaurants [6](#0-5)

## 🛠 Tech Stack

### Frontend

- **React** 17/18/19 - UI library [7](#0-6)
- **Redux Toolkit** - State management [8](#0-7)
- **React Router** v6 - Navigation and routing [9](#0-8)
- **Bootstrap** & **Ant Design** - UI components [10](#0-9)
- **Axios** - HTTP client [11](#0-10)

### Backend

- **Node.js** with **Express** - Server framework [12](#0-11)
- **MongoDB** with **Mongoose** - Database [13](#0-12)
- **JWT** - Authentication [14](#0-13)
- **Cloudinary** - Image storage [15](#0-14)
- **AWS Personalize** - Recommendation system [16](#0-15)

## 📁 Project Structure

```
foody/
├── frontend/foody/          # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── redux/          # Redux store and slices
│   │   ├── services/       # API service layer
│   │   └── css/           # Styling files
│   └── package.json
└── backend/                # Node.js backend API
    ├── src/
    │   ├── controllers/    # Route controllers
    │   ├── models/        # Database models
    │   ├── repo/          # Repository layer
    │   └── services/      # Business logic
    └── package.json
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Frontend Setup

```bash
cd frontend/foody
npm install
npm start  # Runs on port 3001
```

### Backend Setup

```bash
cd backend
npm install
npm run dev  # Development mode with nodemon
```

### Environment Variables

Create `.env` files in both frontend and backend directories with necessary configuration:

**Frontend** [17](#0-16) :

```
REACT_APP_BASE_URL=http://localhost:8080
```

**Backend**: Configure MongoDB connection, JWT secrets, Cloudinary, and AWS credentials.

## 🔧 Key Features Implementation

### Restaurant Search & Filtering

The application implements comprehensive search functionality with location-based filtering and category selection [18](#0-17) .

### Shopping Cart System

Redux-powered cart management with persistent state across sessions [19](#0-18) .

### Order Processing

Complete order workflow from cart to checkout with delivery information collection [20](#0-19) .

### Rating System

Multi-dimensional rating system calculating average scores from quality, service, location, price, and space ratings [21](#0-20) .

## 📱 Responsive Design

The application is fully responsive with mobile-first design principles, featuring collapsible navigation and optimized layouts for various screen sizes [22](#0-21) .

## 🔐 Authentication & Authorization

Secure authentication system with role-based access control supporting regular users, restaurant owners, and administrators [23](#0-22) .

## 📊 Admin Dashboard

Comprehensive admin interface for managing users, restaurants, and monitoring platform statistics [24](#0-23) .

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## Notes

The Foody platform represents a complete restaurant discovery and ordering ecosystem with sophisticated features like personalized recommendations, multi-criteria ratings, and comprehensive admin controls. The architecture follows modern best practices with clear separation between frontend and backend concerns, making it maintainable and scalable.

Wiki pages you might want to explore:

- [Frontend Architecture (NATIT123/Foody)](/wiki/NATIT123/Foody#2.1)
- [Core Features (NATIT123/Foody)](/wiki/NATIT123/Foody#3)
- [Food Items & Ordering (NATIT123/Foody)](/wiki/NATIT123/Foody#3.4)
