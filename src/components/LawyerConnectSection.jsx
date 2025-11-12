import { Link } from "react-router-dom";
import { LAWYERS } from "../utils/dummyData";

export default function LawyerConnectSection() {
  return (
 <section
  id="lawyers"
  className="bg-[#050507] text-white py-20 px-6 md:px-10 relative overflow-hidden"
>
  
  <div className="absolute inset-0 bg-linear-to-br from-white/10 via-gray-300/10 to-transparent blur-3xl pointer-events-none" />

  <div className="max-w-7xl mx-auto relative z-10">
    {/* Section Header */}
    <div className="mb-12 text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white">
        Connect with a Lawyer
      </h2>
      <p className="text-gray-400 mt-3 text-lg">
        Find top legal specialists by category and book your consultation instantly.
      </p>
    </div>

    {/* Lawyer Cards */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {LAWYERS.slice(0, 3).map((l) => (
        <div
          key={l.id}
          className="bg-white/10 border border-white/20  rounded-2xl p-6 backdrop-blur-xl shadow-lg hover:shadow-white/20 hover:-translate-y-1 transition"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{l.name}</h3>
            <span className="text-xs px-2 py-1 bg-white/10 text-gray-200 border border-white/20 rounded">
              {l.specialty}
            </span>
          </div>

          {/* Stats */}
          <p className="text-sm text-gray-400 mt-2">
            ⭐ {l.rating} · {l.cases} cases handled
          </p>

          {/* Price */}
          <p className="mt-4 text-xl font-bold text-white/90">₹ {l.price}</p>

          {/* Button */}
          <Link
            to="/lawyers"
            className="mt-6 inline-block w-full text-center px-6 py-3 rounded-xl font-semibold bg-white text-black hover:bg-gray-200 transition"
          >
            View & Connect
          </Link>
        </div>
      ))}
    </div>

    {/* Browse All */}
    <div className="text-center mt-12">
      <Link
        to="/lawyers"
        className="px-6 py-3 rounded-xl font-medium border border-gray-700 text-white hover:border-white/70 hover:bg-gray-900 transition"
      >
        Browse All Lawyers
      </Link>
    </div>
  </div>
</section>

  );
}
