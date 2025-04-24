import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaShieldAlt, 
  FaLock, 
  FaFileContract, 
  FaBalanceScale, 
  FaCheckCircle, 
  FaDatabase,
  FaGlobe,
  FaUserShield
} from 'react-icons/fa';

const ComplianceVisual = ({ query = '' }) => {
  // Determine which compliance icons to show based on the query
  const getComplianceIcons = () => {
    const query_lower = query.toLowerCase();
    
    // Default icons
    let icons = [
      { icon: FaShieldAlt, color: 'from-blue-500 to-blue-700', label: 'Security' },
      { icon: FaLock, color: 'from-gray-600 to-gray-800', label: 'Privacy' },
      { icon: FaFileContract, color: 'from-green-500 to-green-700', label: 'Compliance' },
      { icon: FaBalanceScale, color: 'from-purple-500 to-purple-700', label: 'Regulations' }
    ];
    
    // Add specific icons based on query content
    if (query_lower.includes('gdpr') || query_lower.includes('privacy')) {
      icons = [
        { icon: FaUserShield, color: 'from-blue-500 to-blue-700', label: 'GDPR' },
        { icon: FaLock, color: 'from-gray-600 to-gray-800', label: 'Privacy' },
        ...icons.slice(2)
      ];
    } else if (query_lower.includes('iso') || query_lower.includes('27001')) {
      icons = [
        { icon: FaShieldAlt, color: 'from-blue-500 to-blue-700', label: 'ISO' },
        { icon: FaCheckCircle, color: 'from-green-500 to-green-700', label: 'Certification' },
        ...icons.slice(2)
      ];
    } else if (query_lower.includes('data') || query_lower.includes('storage')) {
      icons = [
        { icon: FaDatabase, color: 'from-blue-500 to-blue-700', label: 'Data' },
        { icon: FaLock, color: 'from-gray-600 to-gray-800', label: 'Security' },
        ...icons.slice(2)
      ];
    }
    
    return icons;
  };
  
  const icons = getComplianceIcons();
  
  return (
    <div className="relative w-full h-32 md:h-40 mb-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-50 rounded-xl"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a10_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a10_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
      
      {/* Animated glow elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-500/5 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      ></motion.div>
      
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-purple-500/5 blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      ></motion.div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="flex space-x-4 md:space-x-8">
          {icons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5
              }}
              className="flex flex-col items-center"
            >
              <motion.div 
                className={`w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, 5, -5, 0],
                  transition: { duration: 0.5 }
                }}
                animate={{
                  y: [0, -5, 0],
                  boxShadow: [
                    '0 4px 6px rgba(0, 0, 0, 0.1)', 
                    '0 10px 15px rgba(0, 0, 0, 0.2)', 
                    '0 4px 6px rgba(0, 0, 0, 0.1)'
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
              >
                <item.icon size={24} className="text-white" />
              </motion.div>
              <motion.span 
                className="mt-2 text-xs text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {item.label}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Connecting lines */}
      {icons.length > 1 && Array.from({ length: icons.length - 1 }).map((_, index) => (
        <motion.div
          key={`line-${index}`}
          className="absolute top-1/2 h-0.5 bg-gradient-to-r from-gray-600 to-gray-700 transform -translate-y-1/2 z-0"
          style={{
            left: `calc(${25 + (index * 50 / (icons.length - 1))}% - 2rem)`,
            width: `calc(${50 / (icons.length - 1)}% + 4rem)`
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.3 }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
        />
      ))}
      
      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-xl border border-gray-700"
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(100, 100, 255, 0)',
            '0 0 0 10px rgba(100, 100, 255, 0.1)',
            '0 0 0 20px rgba(100, 100, 255, 0)',
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
    </div>
  );
};

export default ComplianceVisual;
