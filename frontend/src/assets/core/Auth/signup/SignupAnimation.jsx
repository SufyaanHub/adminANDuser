import React, { useEffect, useRef } from 'react';
import { Lightbulb, BookOpen, Users, Award } from 'lucide-react';

const SignupAnimation = () => {
  const iconContainerRef = useRef(null);
  
  useEffect(() => {
    if (!iconContainerRef.current) return;
    
    const interval = setInterval(() => {
      const icons = iconContainerRef.current?.querySelectorAll('.floating-icon');
      
      if (icons) {
        icons.forEach((icon) => {
          const xPos = Math.random() * 80 + 10; // 10–90%
          const yPos = Math.random() * 80 + 10; // 10–90%
          
          if (icon instanceof HTMLElement) {
            icon.style.transition = 'all 3s ease-in-out';
            icon.style.left = `${xPos}%`;
            icon.style.top = `${yPos}%`;
          }
        });
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      {/* Background gradient circles */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-purple-400 rounded-full filter blur-3xl opacity-20"></div>
      
      {/* Floating icons */}
      <div ref={iconContainerRef} className="absolute inset-0">
        <div className="floating-icon absolute transition-all duration-1000 text-white opacity-80" style={{ left: '20%', top: '30%' }}>
          <Lightbulb size={32} className="filter drop-shadow-lg" />
        </div>
        <div className="floating-icon absolute transition-all duration-1000 text-white opacity-80" style={{ left: '70%', top: '20%' }}>
          <BookOpen size={32} className="filter drop-shadow-lg" />
        </div>
        <div className="floating-icon absolute transition-all duration-1000 text-white opacity-80" style={{ left: '30%', top: '70%' }}>
          <Users size={32} className="filter drop-shadow-lg" />
        </div>
        <div className="floating-icon absolute transition-all duration-1000 text-white opacity-80" style={{ left: '60%', top: '60%' }}>
          <Award size={32} className="filter drop-shadow-lg" />
        </div>
      </div>
      
      {/* Center content */}
      <div className="relative z-10 text-center p-8">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <BookOpen size={64} className="text-blue-600" />
        </div>
        <h2 className="text-white text-2xl font-bold mb-4">Join Our Learning Community</h2>
        <p className="text-blue-100 max-w-sm">
          Connect with experts, find courses that match your goals, and take your skills to the next level.
        </p>
      </div>
    </div>
  );
};

export default SignupAnimation;
