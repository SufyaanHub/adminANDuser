
import React from 'react';
import SignupForm from '../assets/core/Auth/signup/SignupForm';
import SignupAnimation from '../assets/core/Auth/signup/SignupAnimation';

const SignupPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex flex-col p-8 md:p-12 lg:p-16 justify-center">
        <div className="max-w-md mx-auto w-full">
        

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              Welcome
            </h1>
            <p className="text-lg text-slate-600">
              ADMIN AND USER
            </p>
          </div>

          <SignupForm />
        </div>
      </div>

      {/* Animation Section */}
      <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center p-12">
        <SignupAnimation />
      </div>
    </div>
  );
};

export default SignupPage;
