import type { BlogPost } from '../components/blog/BlogCard';

// Import avatar images
import sarahAvatar from '../assets/images/avatars/sarah.png';
import michaelAvatar from '../assets/images/avatars/michael.png';
import emilyAvatar from '../assets/images/avatars/emily.png';
import jamesAvatar from '../assets/images/avatars/james.png';
import robertAvatar from '../assets/images/avatars/robert.png';

// Import blog images
import globalHealthImg from '../assets/images/blog/global-health.png';
import digitalHealthImg from '../assets/images/blog/digital-health.png';
import communityHealthImg from '../assets/images/blog/community-health.png';
import healthEquityImg from '../assets/images/blog/health-equity.png';

// Placeholder for missing images
const placeholderImage = 'https://placehold.co/600x400/e2e8f0/475569?text=Blog+Image';

export const blogPosts: BlogPost[] = [
  {
    id: 'global-health-challenges-2024',
    title: 'Emerging Global Health Challenges in 2024',
    excerpt: 'An analysis of the most pressing public health issues facing communities worldwide and strategies for addressing them effectively.',
    date: 'March 15, 2024',
    author: {
      name: 'Dr. Sarah Johnson',
      avatar: sarahAvatar
    },
    category: 'Global Health',
    readTime: '8 min read',
    imageUrl: globalHealthImg
  },
  {
    id: 'digital-health-innovations',
    title: 'Digital Innovations Transforming Public Health',
    excerpt: 'Exploring how technological advancements and digital solutions are revolutionizing healthcare delivery and public health monitoring.',
    date: 'March 10, 2024',
    author: {
      name: 'Michael Chen',
      avatar: michaelAvatar
    },
    category: 'Technology',
    readTime: '6 min read',
    imageUrl: digitalHealthImg
  },
  {
    id: 'community-health-programs',
    title: 'Successful Community Health Programs: Case Studies',
    excerpt: 'Examining successful community health initiatives and the key factors that contributed to their positive outcomes.',
    date: 'March 5, 2024',
    author: {
      name: 'Dr. Emily Williams',
      avatar: emilyAvatar
    },
    category: 'Community Health',
    readTime: '10 min read',
    imageUrl: communityHealthImg
  },
  {
    id: 'health-equity-challenges',
    title: 'Addressing Health Equity in Urban Settings',
    excerpt: 'Investigating the challenges and solutions for promoting health equity in rapidly growing urban environments.',
    date: 'February 28, 2024',
    author: {
      name: 'James Wilson',
      avatar: jamesAvatar
    },
    category: 'Health Equity',
    readTime: '7 min read',
    imageUrl: healthEquityImg
  },
  {
    id: 'pandemic-preparedness',
    title: 'Lessons Learned: Improving Pandemic Preparedness',
    excerpt: 'Reflecting on recent global health challenges and outlining strategies for better pandemic preparedness.',
    date: 'February 20, 2024',
    author: {
      name: 'Dr. Robert Kim',
      avatar: robertAvatar
    },
    category: 'Preparedness',
    readTime: '9 min read',
    imageUrl: placeholderImage // Using placeholder since pandemic-prep.jpg is missing
  }
]; 