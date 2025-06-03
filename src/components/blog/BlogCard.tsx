import React from 'react';
import { Link } from 'react-router-dom';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  readTime: string;
  imageUrl?: string;
}

const BlogCard: React.FC<BlogPost> = ({
  id,
  title,
  excerpt,
  date,
  author,
  category,
  readTime,
  imageUrl,
}) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-full">
              {category}
            </span>
          </div>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
          <span>{date}</span>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 line-clamp-2 hover:text-blue-600">
          <Link to={`/blog/${id}`}>{title}</Link>
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {author.avatar && (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm text-gray-600">{author.name}</span>
          </div>
          <Link
            to={`/blog/${id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard; 