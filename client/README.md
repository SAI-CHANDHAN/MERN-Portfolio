# Portfolio MERN

A full-stack portfolio application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring a modern admin dashboard, blog system, and project showcase.

## 🚀 Features

### Frontend (Client)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI/UX**: Clean, professional interface
- **Blog System**: Read and browse blog posts
- **Project Showcase**: Display projects with details and images
- **Contact Form**: Get in touch functionality
- **SEO Optimized**: Meta tags and structured data
- **Loading States**: Smooth user experience with loading indicators
- **Error Handling**: 404 page and error boundaries

### Backend (Server)
- **RESTful API**: Well-structured API endpoints
- **Authentication**: JWT-based auth system
- **File Upload**: Cloudinary integration for image uploads
- **Data Validation**: Comprehensive input validation
- **Security**: CORS, rate limiting, and security headers
- **Database**: MongoDB with Mongoose ODM
- **Admin Panel**: Full CRUD operations for content management

### Admin Dashboard
- **Content Management**: Create, read, update, delete blogs and projects
- **Analytics**: Basic analytics and insights
- **User Management**: Admin authentication
- **Image Upload**: Direct image upload to Cloudinary
- **Rich Text Editor**: Enhanced content creation

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - Image storage and optimization
- **Bcrypt** - Password hashing
- **Joi** - Data validation

## 📁 Project Structure

```
portfolio-mern/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── pages/         # Page components
│       ├── context/       # React Context
│       ├── hooks/         # Custom hooks
│       └── utils/         # Utility functions
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── scripts/         # Utility scripts
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio-mern.git
   cd portfolio-mern
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Variables**
   
   Create a `.env` file in the server directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLIENT_URL=http://localhost:3000
   ```

5. **Run the application**
   
   Start the server (from server directory):
   ```bash
   npm run dev
   ```
   
   Start the client (from client directory):
   ```bash
   npm start
   ```

6. **Seed the database (optional)**
   ```bash
   cd server
   npm run seed
   ```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Blog
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:slug` - Get blog post by slug
- `POST /api/blog` - Create blog post (admin)
- `PUT /api/blog/:id` - Update blog post (admin)
- `DELETE /api/blog/:id` - Delete blog post (admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (admin)

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill (admin)
- `PUT /api/skills/:id` - Update skill (admin)
- `DELETE /api/skills/:id` - Delete skill (admin)

### Upload
- `POST /api/upload` - Upload image to Cloudinary

### Analytics
- `GET /api/analytics` - Get basic analytics (admin)

## 🔧 Development

### Code Style
- ESLint for JavaScript linting
- Prettier for code formatting
- Consistent naming conventions

### Testing
```bash
# Run client tests
cd client
npm test

# Run server tests
cd server
npm test
```

### Build for Production
```bash
# Build client
cd client
npm run build

# Start production server
cd server
npm start
```

## 🚀 Deployment

### Heroku Deployment
1. Create a Heroku app
2. Set environment variables in Heroku
3. Connect your GitHub repository
4. Enable automatic deployments

### Environment Variables for Production
Make sure to set all required environment variables in your hosting platform.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- Website: [yourwebsite.com](https://yourwebsite.com)
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [@yourprofile](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- [React.js](https://reactjs.org/) - The web framework used
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Cloudinary](https://cloudinary.com/) - Image management

## 📞 Support

If you have any questions or need help, please open an issue or contact me directly.

---

Made with ❤️ by [Your Name]