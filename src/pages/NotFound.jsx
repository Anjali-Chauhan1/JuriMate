import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-700 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-black text-brand-700">404</h1>
        <p className="mt-2 text-gray-900">The page you’re looking for doesn’t exist.</p>
        <Link to="/" className="inline-block mt-6 px-5 py-3 rounded-xl bg-brand-600 text-white hover:bg-brand-700">
          Go Home
        </Link>
      </div>
    </div>
  );
}
