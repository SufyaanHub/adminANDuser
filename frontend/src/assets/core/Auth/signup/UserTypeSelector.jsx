import React from 'react';

const UserTypeSelector = ({ userType, setUserType }) => {
  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <p className="text-sm font-medium text-slate-700">Select your account type:</p>
      <div className="flex p-1 w-full max-w-xs mx-auto bg-slate-100 rounded-lg">
        <button
          type="button"
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
            userType === 'student'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          onClick={() => setUserType('student')}
        >
          👤 Normal User
        </button>
        <button
          type="button"
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
            userType === 'instructor'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          onClick={() => setUserType('instructor')}
        >
          👨‍💼 Admin
        </button>
      </div>
    </div>
  );
};

export default UserTypeSelector;
