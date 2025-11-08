export default function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} LawVerse. All rights reserved.</p>
        <div className="text-sm text-gray-500 flex items-center gap-4">
          <a href="#" className="hover:text-brand-600">Privacy</a>
          <a href="#" className="hover:text-brand-600">Terms</a>
          <a href="#" className="hover:text-brand-600">Contact</a>
        </div>
      </div>
    </footer>
  );
}
