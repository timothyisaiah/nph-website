import React from 'react';

interface ErrorIllustrationProps {
  type?: '404' | '500' | 'offline';
}

const ErrorIllustration: React.FC<ErrorIllustrationProps> = ({ type = '404' }) => {
  if (type === '500') {
    return (
      <svg className="w-64 h-64 mx-auto mb-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#3B82F6" strokeWidth="2"/>
        <path d="M9 9L15 15M15 9L9 15" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }

  if (type === 'offline') {
    return (
      <svg className="w-64 h-64 mx-auto mb-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#3B82F6" strokeWidth="2"/>
      </svg>
    );
  }

  // Default 404 illustration
  return (
    <svg className="w-64 h-64 mx-auto mb-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.27489 15L12 20L20.7251 15M3.27489 9L12 14L20.7251 9L12 4L3.27489 9Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 14L12 20" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default ErrorIllustration; 