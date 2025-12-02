import { Link, useLocation } from "react-router-dom";
import { Scale, MessageSquareText, FileText, Users, User, LogOut, Settings } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-neutral-900/90 backdrop-blur-xl border-b border-neutral-800 shadow-md">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2 group">
          <Scale className="w-6 h-6 text-white group-hover:text-brand-300 transition-all" />
          <span className="text-2xl font-black text-white tracking-tight group-hover:text-brand-400 transition">
            JuriMate
          </span>
        </Link>

       
        <div className="flex items-center gap-8 text-sm font-medium">
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/#document"
              className="flex items-center gap-1 text-gray-300 hover:text-brand-400 transition-colors"
            >
              <FileText size={14} /> Start
            </a>
            <a
              href="/#analysis"
              className="flex items-center gap-1 text-gray-300 hover:text-brand-400 transition-colors"
            >
              <Scale size={14} /> Analysis
            </a>
            <a
              href="/#chat"
              className="flex items-center gap-1 text-gray-300 hover:text-brand-400 transition-colors"
            >
              <MessageSquareText size={14} /> Chat
            </a>
            <Link
              to="/lawyers"
              className="flex items-center gap-1 text-gray-300 hover:text-brand-400 transition-colors"
            >
              <Users size={14} /> Lawyers
            </Link>
          </div>

        
          {isAuthenticated ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
              >
                <div className="w-8 h-8 bg-gray-800 border border-gray-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="hidden sm:block font-medium">
                  {user?.name || 'Profile'}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-50">
                  <div className="p-3 border-b border-neutral-700">
                    <p className="text-white font-medium">{user?.name || 'User'}</p>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-neutral-700 flex items-center gap-2 transition-colors">
                      <Settings size={16} />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
