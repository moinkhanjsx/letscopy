# Personal Posts App

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application where registered users can create, store, and manage their personal text posts — similar to reusable prompts or notes.

## Features

- 🔐 **JWT Authentication**: Secure user registration and login
- ✍️ **Create Posts**: Write and save personal text posts with titles and content
- 📋 **Copy to Clipboard**: One-click copy functionality for easy reuse
- 🔍 **Search Posts**: Find your posts quickly with search functionality
- ✏️ **Edit Posts**: Update existing posts with full editing capabilities
- 🗑️ **Delete Posts**: Remove posts you no longer need
- 📱 **Responsive Design**: Modern, clean UI that works on all devices
- 🔒 **Private Data**: Users can only see their own posts
- ⚡ **Real-time Feedback**: Toast notifications for all actions

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Custom CSS** - Modern styling with utility classes

## Project Structure

```
personal-posts-app/
├── server/
│   ├── index.js              # Main server file
│   ├── models/
│   │   ├── User.js           # User model
│   │   └── Post.js           # Post model
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   └── posts.js          # Post CRUD routes
│   └── middleware/
│       └── auth.js           # JWT authentication middleware
├── client/
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js     # Navigation component
│   │   │   ├── Login.js      # Login form
│   │   │   ├── Register.js   # Registration form
│   │   │   ├── Dashboard.js  # Posts dashboard
│   │   │   ├── CreatePost.js # Create post form
│   │   │   └── EditPost.js   # Edit post form
│   │   ├── contexts/
│   │   │   └── AuthContext.js # Authentication context
│   │   ├── App.js            # Main app component
│   │   ├── index.js          # React entry point
│   │   ├── index.css         # Global styles
│   │   └── App.css           # App-specific styles
│   └── package.json          # Frontend dependencies
├── package.json              # Backend dependencies
├── env.example               # Environment variables template
└── README.md                 # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd personal-posts-app
```

### 2. Install dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Setup
```bash
# Copy the environment template
cp env.example .env

# Edit .env file with your configuration
MONGODB_URI=mongodb://localhost:27017/personal-posts-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

### 4. Start the application

#### Development (both frontend and backend)
```bash
npm run dev
```

#### Production
```bash
# Build the frontend
npm run build

# Start the server
npm start
```

#### Individual servers
```bash
# Backend only
npm run server

# Frontend only
npm run client
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Posts
- `GET /api/posts` - Get all posts for authenticated user
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

## Usage

1. **Register/Login**: Create an account or sign in with existing credentials
2. **Create Posts**: Click "New Post" to create your first post
3. **Manage Posts**: View all your posts on the dashboard
4. **Copy Content**: Click the copy icon to copy post content to clipboard
5. **Edit Posts**: Click the edit icon to modify existing posts
6. **Delete Posts**: Click the delete icon to remove posts
7. **Search**: Use the search bar to find specific posts

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **Private Data**: Users can only access their own posts
- **CORS Protection**: Configured for secure cross-origin requests

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub. # Lets Copy - Personal Text Posts Manager

A full-stack MERN application for creating, storing, and managing personal text posts with authentication, categories, and tags.

## 🚀 Features

- **User Authentication** - JWT-based login/register system
- **Post Management** - Create, edit, delete, and organize posts
- **Categories & Tags** - Organize posts with categories and tags
- **Copy to Clipboard** - One-click copy functionality
- **Search & Filter** - Find posts quickly with search and filters
- **Responsive Design** - Mobile-first design that works on all devices
- **Modern UI** - Beautiful glass morphism design with gradients

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router, Axios, React Hot Toast
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB with Mongoose
- **Styling**: Custom CSS with mobile-first responsive design
- **Performance**: Code splitting, memoization, caching

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Setup
1. Clone the repository
```bash
git clone https://github.com/moinkhanjsx/letscopy.git
cd letscopy
```

2. Install dependencies
```bash
npm run install-all
```

3. Create environment file
```bash
# Create .env file in root directory
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

4. Start development server
```bash
npm run dev
```

## 🌐 Deployment

### Vercel + Railway Deployment

1. **Deploy Backend to Railway:**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Add environment variables:
     - `JWT_SECRET` = your secret key
     - `MONGODB_URI` = your MongoDB Atlas connection string
     - `NODE_ENV` = production

2. **Deploy Frontend to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable:
     - `REACT_APP_API_URL` = your Railway backend URL
   - Deploy!

## 📱 Usage

1. Register a new account
2. Create your first post
3. Add categories and tags for organization
4. Use the copy button to copy post content
5. Search and filter your posts
6. Edit or delete posts as needed

## 🔧 Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run server` - Start backend only
- `npm run client` - Start frontend only

## 📄 License

MIT License
