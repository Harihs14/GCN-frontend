import React from 'react';
import { motion } from 'framer-motion';

const LoadingAnimation = () => {
  const circleVariants = {
    hidden: { 
      opacity: 0,
      scale: 0
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.6, 0.8, 0.6],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const documentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  // Generate random documents for the animation
  const generateDocuments = () => {
    const documents = [];
    for (let i = 0; i < 6; i++) {
      documents.push(
        <motion.div
          key={i}
          custom={i}
          variants={documentVariants}
          initial="hidden"
          animate="visible"
          className="absolute"
          style={{
            width: `${Math.random() * 40 + 20}px`,
            height: `${Math.random() * 30 + 30}px`,
            backgroundColor: i % 3 === 0 ? '#3b82f6' : '#60a5fa',
            borderRadius: '4px',
            transform: `rotate(${Math.random() * 60 - 30}deg)`,
            left: `calc(50% + ${Math.random() * 160 - 80}px)`,
            top: `calc(50% + ${Math.random() * 160 - 80}px)`,
            zIndex: 1
          }}
        />
      );
    }
    return documents;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px]">
      <div className="relative w-60 h-60 flex items-center justify-center">
        {/* Background blur circle */}
        <motion.div
          variants={circleVariants}
          initial="hidden"
          animate="visible"
          className="absolute w-40 h-40 rounded-full bg-blue-500/30 filter blur-xl"
        />
        
        {/* Pulse effect */}
        <motion.div
          variants={pulseVariants}
          animate="pulse"
          className="absolute w-48 h-48 rounded-full border-2 border-blue-500/50"
        />
        
        {/* Second pulse effect */}
        <motion.div
          variants={pulseVariants}
          animate="pulse"
          className="absolute w-56 h-56 rounded-full border-2 border-blue-400/40"
          style={{ animationDelay: "0.5s" }}
        />
        
        {/* Documents floating around */}
        {generateDocuments()}
        
        {/* Center shield icon */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
              />
            </svg>
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-xl font-medium text-white"
      >
        Searching for Compliance...
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-2 text-gray-400 text-center max-w-xs"
      >
        We're analyzing relevant frameworks and standards to provide you with the most accurate information.
      </motion.div>
    </div>
  );
};

export default LoadingAnimation; 