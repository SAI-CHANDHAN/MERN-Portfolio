const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Skill = require('../models/Skill');
const Contact = require('../models/Contact');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample data - FIXED: Added isActive field
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@portfolio.com',
    password: 'admin123',
    role: 'admin',
    isActive: true, // ADDED: This field was missing
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    isActive: true, // ADDED: This field was missing
  },
];

const sampleSkills = [
  // Frontend
  { name: 'React', category: 'Frontend', level: 90, icon: 'FaReact' },
  { name: 'JavaScript', category: 'Frontend', level: 95, icon: 'FaJs' },
  { name: 'TypeScript', category: 'Frontend', level: 85, icon: 'SiTypescript' },
  { name: 'HTML5', category: 'Frontend', level: 95, icon: 'FaHtml5' },
  { name: 'CSS3', category: 'Frontend', level: 90, icon: 'FaCss3Alt' },
  { name: 'Tailwind CSS', category: 'Frontend', level: 88, icon: 'SiTailwindcss' },
  { name: 'Next.js', category: 'Frontend', level: 85, icon: 'SiNextdotjs' },
  { name: 'Vue.js', category: 'Frontend', level: 75, icon: 'FaVuejs' },
  
  // Backend
  { name: 'Node.js', category: 'Backend', level: 90, icon: 'FaNodeJs' },
  { name: 'Express.js', category: 'Backend', level: 88, icon: 'SiExpress' },
  { name: 'MongoDB', category: 'Database', level: 85, icon: 'SiMongodb' },
  { name: 'PostgreSQL', category: 'Database', level: 80, icon: 'SiPostgresql' },
  { name: 'MySQL', category: 'Database', level: 78, icon: 'SiMysql' },
  { name: 'Python', category: 'Backend', level: 82, icon: 'FaPython' },
  { name: 'Django', category: 'Backend', level: 75, icon: 'SiDjango' },
  
  // DevOps & Tools
  { name: 'Git', category: 'Tools', level: 92, icon: 'FaGitAlt' },
  { name: 'Docker', category: 'DevOps', level: 80, icon: 'FaDocker' },
  { name: 'AWS', category: 'Cloud', level: 75, icon: 'FaAws' },
  { name: 'Linux', category: 'Tools', level: 85, icon: 'FaLinux' },
  { name: 'Figma', category: 'Design', level: 78, icon: 'FaFigma' },
];

const sampleProjects = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with user authentication, payment integration, and admin dashboard.',
    longDescription: 'This comprehensive e-commerce platform features a modern React frontend with a Node.js backend. It includes user authentication, product management, shopping cart functionality, payment processing with Stripe, and an admin dashboard for managing orders and inventory.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe API', 'JWT'],
    image: 'https://via.placeholder.com/600x400',
    liveUrl: 'https://ecommerce-demo.com',
    githubUrl: 'https://github.com/username/ecommerce-platform',
    status: 'completed',
    featured: true,
    category: 'Web Application',
  },
  {
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates and team collaboration features.',
    longDescription: 'Built with React and Socket.io for real-time collaboration, this task management app allows teams to create, assign, and track tasks. Features include drag-and-drop kanban boards, real-time notifications, file attachments, and project analytics.',
    technologies: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'Express'],
    image: 'https://via.placeholder.com/600x400',
    liveUrl: 'https://taskapp-demo.com',
    githubUrl: 'https://github.com/username/task-management',
    status: 'completed',
    featured: true,
    category: 'Web Application',
  },
  {
    title: 'Weather Dashboard',
    description: 'A responsive weather dashboard with location-based forecasts and interactive maps.',
    longDescription: 'This weather dashboard provides current weather conditions and forecasts using OpenWeatherMap API. Features include location search, interactive maps, weather alerts, and historical weather data visualization.',
    technologies: ['React', 'OpenWeatherMap API', 'Chart.js', 'Tailwind CSS'],
    image: 'https://via.placeholder.com/600x400',
    liveUrl: 'https://weather-dashboard-demo.com',
    githubUrl: 'https://github.com/username/weather-dashboard',
    status: 'completed',
    featured: false,
    category: 'Web Application',
  },
  {
    title: 'Social Media Dashboard',
    description: 'Analytics dashboard for social media management with data visualization.',
    longDescription: 'A comprehensive social media analytics dashboard that aggregates data from multiple platforms. Features include post scheduling, engagement analytics, audience insights, and automated reporting.',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Chart.js'],
    image: 'https://via.placeholder.com/600x400',
    liveUrl: 'https://social-dashboard-demo.com',
    githubUrl: 'https://github.com/username/social-dashboard',
    status: 'in-progress',
    featured: false,
    category: 'Dashboard',
  },
];

const sampleBlogs = [
  {
    title: 'Getting Started with React Hooks',
    content: 'React Hooks have revolutionized the way we write React components. In this comprehensive guide, we\'ll explore the most commonly used hooks and how they can simplify your code.\n\n## useState Hook\n\nThe useState hook allows you to add state to functional components:\n\n```javascript\nconst [count, setCount] = useState(0);\n```\n\n## useEffect Hook\n\nThe useEffect hook lets you perform side effects in functional components:\n\n```javascript\nuseEffect(() => {\n  document.title = `Count: ${count}`;\n}, [count]);\n```\n\nHooks provide a more direct API to the React concepts you already know.',
    excerpt: 'Learn how React Hooks can simplify your component logic and make your code more reusable.',
    category: 'React',
    tags: ['React', 'Hooks', 'JavaScript', 'Frontend'],
    image: 'https://via.placeholder.com/800x400',
    published: true,
    featured: true,
    readTime: 8,
  },
  {
    title: 'Building RESTful APIs with Node.js and Express',
    content: 'Building robust APIs is crucial for modern web applications. In this tutorial, we\'ll create a RESTful API using Node.js and Express.\n\n## Setting up Express\n\nFirst, let\'s set up our Express server:\n\n```javascript\nconst express = require(\'express\');\nconst app = express();\n\napp.use(express.json());\n\napp.listen(3000, () => {\n  console.log(\'Server running on port 3000\');\n});\n```\n\n## Creating Routes\n\nWe\'ll create CRUD operations for our API:\n\n```javascript\n// GET all items\napp.get(\'/api/items\', (req, res) => {\n  res.json(items);\n});\n\n// POST new item\napp.post(\'/api/items\', (req, res) => {\n  const newItem = req.body;\n  items.push(newItem);\n  res.status(201).json(newItem);\n});\n```',
    excerpt: 'Learn how to build scalable RESTful APIs using Node.js, Express, and MongoDB.',
    category: 'Backend',
    tags: ['Node.js', 'Express', 'API', 'Backend'],
    image: 'https://via.placeholder.com/800x400',
    published: true,
    featured: true,
    readTime: 12,
  },
  {
    title: 'CSS Grid vs Flexbox: When to Use Which',
    content: 'CSS Grid and Flexbox are both powerful layout systems, but they serve different purposes. Let\'s explore when to use each one.\n\n## CSS Grid - For 2D Layouts\n\nCSS Grid is perfect for creating complex, two-dimensional layouts:\n\n```css\n.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-gap: 20px;\n}\n```\n\n## Flexbox - For 1D Layouts\n\nFlexbox excels at one-dimensional layouts and alignment:\n\n```css\n.flex-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n```\n\n## When to Use Which\n\n- Use Grid for overall page layout\n- Use Flexbox for component-level layout\n- Grid for 2D control, Flexbox for 1D control',
    excerpt: 'Understanding the differences between CSS Grid and Flexbox and when to use each layout system.',
    category: 'CSS',
    tags: ['CSS', 'Grid', 'Flexbox', 'Layout'],
    image: 'https://via.placeholder.com/800x400',
    published: true,
    featured: false,
    readTime: 6,
  },
  {
    title: 'Introduction to MongoDB and Mongoose',
    content: 'MongoDB is a popular NoSQL database, and Mongoose provides a elegant solution for object modeling. Let\'s explore how to get started.\n\n## Installing MongoDB and Mongoose\n\n```bash\nnpm install mongodb mongoose\n```\n\n## Connecting to MongoDB\n\n```javascript\nconst mongoose = require(\'mongoose\');\n\nmongoose.connect(\'mongodb://localhost:27017/myapp\', {\n  useNewUrlParser: true,\n  useUnifiedTopology: true\n});\n```\n\n## Creating Schemas\n\n```javascript\nconst userSchema = new mongoose.Schema({\n  name: { type: String, required: true },\n  email: { type: String, required: true, unique: true },\n  createdAt: { type: Date, default: Date.now }\n});\n\nconst User = mongoose.model(\'User\', userSchema);\n```',
    excerpt: 'Get started with MongoDB and Mongoose for building robust Node.js applications.',
    category: 'Database',
    tags: ['MongoDB', 'Mongoose', 'Database', 'Node.js'],
    image: 'https://via.placeholder.com/800x400',
    published: false,
    featured: false,
    readTime: 10,
  },
];

const sampleContacts = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    subject: 'Website Development Inquiry',
    message: 'Hi, I\'m interested in having a website developed for my small business. Could we discuss the requirements and pricing?',
  },
  {
    name: 'Bob Smith',
    email: 'bob@company.com',
    subject: 'Collaboration Opportunity',
    message: 'Hello, I came across your portfolio and was impressed by your work. I have a project that might be a good fit for collaboration.',
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah@startup.com',
    subject: 'Full-Stack Developer Position',
    message: 'We are looking for a full-stack developer to join our team. Your skills seem to align perfectly with what we need.',
  },
];

// FIXED: Let the User model handle password hashing instead of manual hashing
const seedUsers = async () => {
  try {
    await User.deleteMany({});
    
    // Create users one by one to let the User model handle password hashing
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save(); // This will trigger the pre-save middleware to hash the password
    }
    
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

const seedSkills = async () => {
  try {
    await Skill.deleteMany({});
    await Skill.insertMany(sampleSkills);
    console.log('Skills seeded successfully');
  } catch (error) {
    console.error('Error seeding skills:', error);
  }
};

const seedProjects = async () => {
  try {
    await Project.deleteMany({});
    await Project.insertMany(sampleProjects);
    console.log('Projects seeded successfully');
  } catch (error) {
    console.error('Error seeding projects:', error);
  }
};

const seedBlogs = async () => {
  try {
    await Blog.deleteMany({});
    await Blog.insertMany(sampleBlogs);
    console.log('Blogs seeded successfully');
  } catch (error) {
    console.error('Error seeding blogs:', error);
  }
};

const seedContacts = async () => {
  try {
    await Contact.deleteMany({});
    await Contact.insertMany(sampleContacts);
    console.log('Contacts seeded successfully');
  } catch (error) {
    console.error('Error seeding contacts:', error);
  }
};

// Main seed function
const seedAll = async () => {
  await connectDB();
  
  console.log('Starting database seeding...');
  
  await seedUsers();
  await seedSkills();
  await seedProjects();
  await seedBlogs();
  await seedContacts();
  
  console.log('Database seeding completed!');
  process.exit(0);
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedAll();
}

module.exports = {
  seedUsers,
  seedSkills,
  seedProjects,
  seedBlogs,
  seedContacts,
  seedAll,
};