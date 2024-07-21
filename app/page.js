import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-100">
      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 mb-6">
            Embrace the little things
          </h1>
          <p className="text-2xl sm:text-3xl md:text-4xl text-indigo-600 mb-10">
            Share your progress, inspire other women
          </p>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            A platform for women to share their achievements and progress with a supportive community.
          </p>
          <Link href="/login" className="bg-indigo-600 text-white px-10 py-4 rounded-md text-xl font-medium hover:bg-indigo-700 transition-colors">
            Join Our Community
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
