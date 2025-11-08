import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-z-50 min-h-full bg-white/80 backdrop-blur shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black text-brand-700 group-hover:text-brand-600 transition">JuriMate</span>
          <span className="text-xs px-20  py-0.5 rounded bg-brand-100 text-brand-700">beta</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <a href="/#document" className="hover:text-brand-600">Start</a>
          <a href="/#analysis" className="hover:text-brand-600">Analysis</a>
          <a href="/#chat" className="hover:text-brand-600">Chat</a>
          <Link to="/lawyers" className="hover:text-brand-600">Lawyers</Link>
        </div>
       <div>
          <a
            href="/#document"
            className="px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"
          >
            Start Analysis
          </a>
        </div>
      </nav>
      <div className="h-1 bg-linear-to-r from-brand-600/20 via-transparent to-brand-600/20" />
      {/* tiny active indicator when on /lawyers */}
      {pathname === "/lawyers" && (
        <div cl assName="w-full bg-brand-50 text-center text-xs text-brand-700 py-1">
          Browse verified lawyers & book a consult
        </div>
      )}
    </header>
  );
}
