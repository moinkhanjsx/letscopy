import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="flex justify-between items-center py-4 sm:py-6">
          <Link to="/" className="text-xl sm:text-2xl font-bold transition-all duration-300 hover:scale-105 flex items-center gap-1">
            <span className="logo-gradient">
              Lets Copy
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            {user ? (
              <>
                <Link
                  to="/create"
                  className="btn btn-primary flex items-center gap-1 sm:gap-2 text-sm sm:text-base mx-1"
                >
                  <Plus size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">New Copy</span>
                  <span className="sm:hidden">New</span>
                </Link>
                
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-white font-medium">
                    <User size={16} />
                    <span>{user.username}</span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline flex items-center gap-1 sm:gap-2 text-sm sm:text-base mx-1"
                  >
                    <LogOut size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Logout</span>
                    <span className="sm:hidden">Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 sm:gap-4">
                <Link to="/login" className="btn btn-outline text-sm sm:text-base mx-1">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-sm sm:text-base mx-1">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 