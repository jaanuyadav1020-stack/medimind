
import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  const [user, setUser] = useState<{ email: string } | null>(null);

  const handleLogin = (email: string) => {
    setUser({ email });
  };

  const handleLogout = () => {
    setUser(null);
  };
  
  const handleGuestLogin = () => {
    setUser({ email: 'guest@medimind.com' });
  };

  return (
    <div className="min-h-screen font-sans">
      {user ? (
        <HomePage user={user} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} onGuestLogin={handleGuestLogin} />
      )}
    </div>
  );
};

export default App;
