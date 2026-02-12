import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Import local logo file with the correct path
import logoImage from '../../../../assets/Logo/skillHouse.png';

const Logo = ({ className = "" }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    console.error("Logo image failed to load");
    setImageError(true);
  };

  return (
    <Link to='/' className={`flex items-center ${className}`}>
      {imageError ? (
        // Fallback when image fails to load
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-slate-900 font-bold text-lg">
            S
          </div>
          <span className="text-xl font-bold text-slate-100">
            SkillHOUSE
          </span>
        </div>
      ) : (
        <img 
          src={logoImage} 
          alt="SkillHOUSE Logo" 
          className="h-12 w-auto object-contain transition-transform hover:scale-105"
          onError={handleImageError}
          loading="eager"
        />
      )}
    </Link>
  );
};

export default Logo;
