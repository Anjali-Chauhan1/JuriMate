import { Link, useLocation } from "react-router-dom";
import { Scale, MessageSquareText, FileText, Users } from "lucide-react";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-neutral-900/90 backdrop-blur-xl border-b border-neutral-800 shadow-md">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <Scale className="w-6 h-6 text-white group-hover:text-brand-300 transition-all" />
          <span className="text-2xl font-black text-white tracking-tight group-hover:text-brand-400 transition">
            JuriMate
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
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
      </nav>
    </header>
  );
}
