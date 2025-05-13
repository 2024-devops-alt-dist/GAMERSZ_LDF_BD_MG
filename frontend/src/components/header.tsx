import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <header className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4">
        <h1 className="text-2xl font-bold">Gamerz</h1>

        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <a href="#" className="hover:underline">
                ChatList
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>

            {user ? (
              <div className="flex items-center space-x-4 bg-gray-700 px-4 py-2 rounded-md shadow-md">
                <img
                  src={user.photoUrl}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <div className="text-sm text-left">
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-gray-300 text-xs">
                    {user.status || 'Online'}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="ml-2 btn btn-sm btn-outline text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-3">
                <button
                  onClick={handleLoginClick}
                  className="btn btn-sm btn-outline text-white"
                >
                  Login
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="btn btn-sm btn-outline text-white"
                >
                  Register
                </button>
              </div>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
