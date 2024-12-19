// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year

  return (
    <footer className="bg-gray-100 text-gray-500 px-6 py-4">
      <div className="container mx-auto flex justify-center items-center">
        <p className="text-sm">&copy; {currentYear} Danpav1. All rights reserved.</p>
        {/* Add more elements here (TOS, privacy policy, etc) */}
      </div>
    </footer>
  );
};

export default Footer;
