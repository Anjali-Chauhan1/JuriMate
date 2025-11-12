export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-900/95 backdrop-blur-md text-gray-400">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-brand-400">JuriMate</span>. All rights reserved.
        </p>
        
        <div className="text-sm flex items-center gap-6">
          <a
            href="#"
            className="hover:text-brand-400 transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-brand-400 transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="hover:text-brand-400 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
      
    </footer>
  );
}
