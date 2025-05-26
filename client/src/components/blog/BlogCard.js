import { Link } from 'react-router-dom';
import { Calendar, Clock, User } from 'lucide-react';

const BlogCard = ({ blog, featured = false }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${featured ? 'lg:col-span-2' : ''}`}>
      {blog.image && (
        <div className="relative overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className={`w-full object-cover transition-transform duration-300 hover:scale-105 ${
              featured ? 'h-64' : 'h-48'
            }`}
          />
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {blog.category}
            </span>
          </div>
          {featured && (
            <div className="absolute top-4 right-4">
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{blog.readTime} min read</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>Admin</span>
          </div>
        </div>
        
        <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 ${
          featured ? 'text-2xl' : 'text-xl'
        }`}>
          <Link 
            to={`/blog/${blog._id}`}
            className="hover:text-blue-600 transition-colors duration-200"
          >
            {blog.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.excerpt}
        </p>
        
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-gray-500 text-sm">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        <Link
          to={`/blog/${blog._id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
        >
          Read More
          <svg
            className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;