# 📚 Book Tracking and Blog System

A modern full-stack web application that combines a book tracking system with a blogging platform. Built with Next.js, Node.js, and MongoDB.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-green)

## ✨ Features

### 📖 Book Tracking
- Track your reading progress
- Manage your reading list
- Set reading goals
- View reading statistics
- Categorize books (Reading, Want to Read, Completed)
- Track pages read and completion dates

### 📝 Blog System
- Create and manage blog posts
- Categorize posts
- Search functionality
- Rich text editing
- Image upload support

### 👤 User Management
- User registration and authentication
- JWT-based authentication
- Role-based access control (Admin/User)
- Profile management
- Secure password handling

## 🛠 Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT
- bcrypt

### Security
- Helmet.js
- CORS protection
- Rate limiting
- XSS protection
- Input validation

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18.0.0)
- MongoDB (>= 4.4)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/OzenKerem/book-tracking-blog-system.git
cd book-tracking-blog-system
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Environment Setup

Create `.env` files in both frontend and backend directories:

Backend `.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

Frontend `.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the application

Development mode:
```bash
# Start backend
cd backend
npm run dev

# Start frontend (in a new terminal)
cd frontend
npm run dev
```

Production mode:
```bash
# Build frontend
cd frontend
npm run build

# Start both services
cd ..
npm run start
```

## 📁 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── styles/
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   └── package.json
└── package.json
```

## 🔒 Default Admin Account

The system comes with a default admin account:
- Email: yonetici@gmail.com
- Password: Kerem7575.
- Username: Yönetici
- Role: admin

⚠️ **Important**: Change these credentials in production!

## 🌟 Key Features

1. **Dual Database Mode**
   - Works with MongoDB when connected
   - Falls back to in-memory database when MongoDB is unavailable

2. **Responsive Design**
   - Mobile-first approach
   - Beautiful UI with Tailwind CSS
   - Smooth animations with Framer Motion

3. **Security Features**
   - JWT authentication
   - Password hashing
   - Rate limiting
   - XSS protection
   - CORS configuration

4. **Performance**
   - Server-side rendering
   - Optimized assets
   - Efficient database queries

## 📝 API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login - User login
GET /api/auth/logout - User logout
GET /api/auth/me - Get current user
```

### Books
```
GET /api/books - List all books
POST /api/books - Add new book
PUT /api/books/:id - Update book
DELETE /api/books/:id - Delete book
GET /api/books/stats - Get reading statistics
```

### Blog
```
GET /api/posts - List all posts
POST /api/posts - Create new post
PUT /api/posts/:id - Update post
DELETE /api/posts/:id - Delete post
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

Kerem Özen Çifçi
- GitHub: [@OzenKerem](https://github.com/OzenKerem)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB team for the reliable database
- All contributors and users of this project