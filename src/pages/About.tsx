import React from 'react';
import { Link } from 'react-router-dom';
import { images } from '../assets/images';
import companyLogo from '../assets/Company-logo.jpg';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Section - Company Overview + Slogan */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              {/* Company Logo */}
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={companyLogo}
                  alt="NPH Solutions Logo" 
                  className="w-16 h-16 object-contain rounded-lg shadow-md"
                />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  About NPH Solutions Ltd
                </h1>
              </div>

              {/* Company Description */}
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed">
                  NPH SOLUTIONS LTD is a limited liability company registered in Uganda to fill a void in Africa's public health research. The vision of NPH Solutions is to make public health data and information available to inform policies, programs, and actions that improve population health.
                </p>
              </div>

              {/* Slogan */}
              <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Slogan</h2>
                <blockquote className="text-xl md:text-2xl italic text-blue-700 font-medium">
                  "Unlocking health data for community and policy action"
                </blockquote>
              </div>

              {/* Call to Action */}
              <div className="pt-4">
                <Link 
                  to="/services" 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Explore Our Services
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Column - Visual Element */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={`${images.about.url}?w=800&h=600&fit=crop&crop=center`}
                  alt={images.about.alt}
                  className="w-full h-96 md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Data-Driven Public Health
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Empowering communities through accessible health information and evidence-based solutions.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">100+</div>
                  <div className="text-sm text-gray-600">Projects Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional sections can be added here */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Learn More?
          </h2>
          <p className="text-gray-600 mb-8">
            Discover how we can help transform public health data into actionable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/services" 
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Our Services
            </Link>
            <Link 
              to="/contact" 
              className="px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;