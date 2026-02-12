import React from 'react';
import LoginForm from './LoginForm';
import { Bookmark } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
    
      
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
              <Bookmark size={32} />
            </div>
            
            <p className="mt-2 text-sm text-gray-600">
              Your gateway 
            </p>
          </div>
          
          <div className="mt-8 rounded-xl bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl sm:p-10">
            <LoginForm />
          </div>
          
          <div className="mt-6 text-center text-xs text-gray-600">
            <p>© {new Date().getFullYear()} SkillHOUSE. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
