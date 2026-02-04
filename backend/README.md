# Online Food Delivery System - Backend

## Overview
This is the backend API for the Online Food Delivery System, built with Node.js, Express, and MySQL. It provides a complete RESTful API for managing users, restaurants, menu items, orders, and more.

## Features
- User authentication with JWT tokens
- Role-based access control (Customer, Admin, Driver)
- Restaurant and menu management
- Order processing with real-time status updates
- Cart functionality
- Review and rating system
- Security features including rate limiting, XSS protection, and SQL injection prevention
- Comprehensive API documentation

## Technology Stack
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MySQL**: Relational database management system
- **JWT**: Token-based authentication
- **Bcrypt.js**: Password hashing
- **Express Validator**: Request validation
- **Helmet**: Security headers
- **Morgan**: HTTP request logging
- **Express Rate Limit**: Rate limiting

## Prerequisites
- Node.js v14 or higher
- MySQL v8.0 or higher
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the backend directory:
```bash
cd backend
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory and configure the environment variables:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=online_resturant
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
PORT=3000
FRONTEND_URL=http://localhost:5173
```

5. Set up the database:
```bash
# Create the database and tables using the schema.sql file
mysql -u root -p < database/schema.sql
```

6. Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

## Project Structure
```
src/
├── config/              # Configuration files
├── controllers/         # Request handlers
├── middleware/          # Custom middleware
├── models/             # Data models (future enhancement)
├── routes/             # API route definitions
├── services/           # Business logic layer (future enhancement)
├── utils/              # Utility functions
├── validations/        # Validation schemas
└── server.js           # Application entry point
```

## API Documentation
Detailed API documentation can be found in [API_DOCS.md](API_DOCS.md).

## Security
The backend implements several security measures:
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting to prevent abuse
- XSS and SQL injection protection
- HTTP security headers with Helmet.js
- CORS configuration
- Password hashing with bcrypt

Detailed security documentation can be found in [SECURITY.md](SECURITY.md).

## Database Schema
The database schema is defined in [database/schema.sql](database/schema.sql). It includes 22 tables with proper relationships and indexing.

## Architecture
The system follows a modular architecture with clear separation of concerns. Detailed architecture documentation can be found in [ARCHITECTURE.md](ARCHITECTURE.md).

## Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| DB_HOST | Database host | localhost |
| DB_USER | Database user | root |
| DB_PASSWORD | Database password | ahmad@wais12 |
| DB_NAME | Database name | online_resturant |
| JWT_SECRET | Secret for JWT signing | fallback_secret_key |
| JWT_REFRESH_SECRET | Secret for refresh token signing | fallback_refresh_secret_key |
| PORT | Server port | 3000 |
| FRONTEND_URL | Allowed frontend origin | http://localhost:5173 |

## Scripts
- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon
- `npm test`: Run tests (if available)

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License
MIT License

## Contact
For support or inquiries, please contact the development team.