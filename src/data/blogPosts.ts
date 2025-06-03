import type { BlogPost } from '../components/blog/BlogCard';

export const blogPosts: BlogPost[] = [
  {
    id: 'global-health-challenges-2024',
    title: 'Emerging Global Health Challenges in 2024',
    excerpt: 'An analysis of the most pressing public health issues facing communities worldwide and strategies for addressing them effectively.',
    date: 'March 15, 2024',
    author: {
      name: 'Dr. Sarah Johnson',
      avatar: '/images/avatars/sarah.jpg'
    },
    category: 'Global Health',
    readTime: '8 min read',
    imageUrl: '/images/blog/global-health.jpg'
  },
  {
    id: 'digital-health-innovations',
    title: 'Digital Innovations Transforming Public Health',
    excerpt: 'Exploring how technological advancements and digital solutions are revolutionizing healthcare delivery and public health monitoring.',
    date: 'March 10, 2024',
    author: {
      name: 'Michael Chen',
      avatar: '/images/avatars/michael.jpg'
    },
    category: 'Technology',
    readTime: '6 min read',
    imageUrl: '/images/blog/digital-health.jpg'
  },
  {
    id: 'community-health-programs',
    title: 'Successful Community Health Programs: Case Studies',
    excerpt: 'Examining successful community health initiatives and the key factors that contributed to their positive outcomes.',
    date: 'March 5, 2024',
    author: {
      name: 'Dr. Emily Williams',
      avatar: '/images/avatars/emily.jpg'
    },
    category: 'Community Health',
    readTime: '10 min read',
    imageUrl: '/images/blog/community-health.jpg'
  },
  {
    id: 'health-equity-challenges',
    title: 'Addressing Health Equity in Urban Settings',
    excerpt: 'Investigating the challenges and solutions for promoting health equity in rapidly growing urban environments.',
    date: 'February 28, 2024',
    author: {
      name: 'James Wilson',
      avatar: '/images/avatars/james.jpg'
    },
    category: 'Health Equity',
    readTime: '7 min read',
    imageUrl: '/images/blog/health-equity.jpg'
  },
  {
    id: 'pandemic-preparedness',
    title: 'Lessons Learned: Improving Pandemic Preparedness',
    excerpt: 'Reflecting on recent global health challenges and outlining strategies for better pandemic preparedness.',
    date: 'February 20, 2024',
    author: {
      name: 'Dr. Robert Kim',
      avatar: '/images/avatars/robert.jpg'
    },
    category: 'Preparedness',
    readTime: '9 min read',
    imageUrl: '/images/blog/pandemic-prep.jpg'
  }
]; 