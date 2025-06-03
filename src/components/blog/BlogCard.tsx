import React from 'react';
import { Link } from 'react-router-dom';

interface Author {
  name: string;
  avatar?: string;
}

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  author: string | Author;
  image: string;
  imageAlt: string;
  category: string;
  readTime: string;
  slug: string;
}

const getAuthorName = (author: string | Author): string => {
  if (typeof author === 'string') return author;
  return author.name || 'Anonymous';
};

const getAuthorInitials = (author: string | Author): string => {
  const authorName = getAuthorName(author);
  if (!authorName) return 'A';
  
  return authorName
    .split(' ')
    .map(name => name[0])
    .filter(initial => initial)
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAuthorAvatar = (author: string | Author): string | null => {
  if (typeof author === 'object' && author.avatar) {
    return author.avatar;
  }
  return null;
};

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  excerpt,
  date,
  author,
  image,
  imageAlt,
  category,
  readTime,
  slug
}) => {
  const authorName = getAuthorName(author);
  const authorInitials = getAuthorInitials(author);
  const authorAvatar = getAuthorAvatar(author);

  return (
    <Link to={`/blog/${slug}`} className="block group">
      <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 md:h-64 overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <span className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
              {category}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span>{date}</span>
            <span className="mx-2">•</span>
            <span>{readTime} read</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {excerpt}
          </p>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="sr-only">{authorName}</span>
              {authorAvatar ? (
                <img 
                  src={authorAvatar} 
                  alt={authorName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {authorInitials}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">{authorName}</p>
              <div className="flex space-x-1 text-sm text-gray-500">
                <span>Author</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard; 