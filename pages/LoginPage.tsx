
import React, { useState } from 'react';
import { PillIcon, AtSymbolIcon, LockClosedIcon, UserIcon } from '../components/icons/Icons';

interface LoginPageProps {
  onLogin: (email: string) => void;
  onGuestLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGuestLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onLogin(email);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 transition-all">
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 bg-blue-500 rounded-full text-white">
            <PillIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">MediMind</h1>
          <p className="text-gray-500">Your smart medication companion.</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-center text-gray-700">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          
          <div className="relative">
            <AtSymbolIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          <div className="relative">
            <LockClosedIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
          {isSignUp && (
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        <button
            onClick={onGuestLogin}
            className="w-full bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 flex items-center justify-center space-x-2 transition"
        >
            <UserIcon className="w-5 h-5"/>
            <span>Continue as Guest</span>
        </button>

        <p className="text-sm text-center text-gray-600">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
