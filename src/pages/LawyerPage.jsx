import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LAWYERS } from "../utils/dummyData";
import { useMemo, useState,useEffect } from "react";
import { motion } from "framer-motion";

export default function LawyerPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
 
  const list = useMemo(() => {
    return LAWYERS.filter((l) => {
      const okQ = q
        ? l.name.toLowerCase().includes(q.toLowerCase()) ||
          l.specialty.toLowerCase().includes(q.toLowerCase())
        : true;
      const okF = filter === "All" ? true : l.specialty === filter;
      return okQ && okF;
    });
  }, [q, filter]);

  const specialties = ["All", ...new Set(LAWYERS.map((l) => l.specialty))];

  return (
    <>
      <Navbar />
     <section className="min-h-screen bg-[#050507] text-white py-20 px-6 md:px-10 relative overflow-hidden">
  
  <div className="absolute inset-0 bg-linear-to-br from-white/10 via-gray-300/10 to-transparent blur-3xl pointer-events-none" />

  <div className="max-w-7xl mx-auto relative z-10">
   
    <motion.h1
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="text-4xl md:text-5xl font-extrabold mb-6 text-center text-white"
    >
      Find Your Lawyer
    </motion.h1>

    <p className="text-gray-400 text-center mb-12 text-lg max-w-2xl mx-auto">
      Connect with top-rated legal experts across India — find your ideal match by
      specialty, expertise, or rating.
    </p>

  
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name or specialty..."
        className="flex-1 min-w-60 rounded-xl border border-gray-700bg-white/10 text-gray-200 px-4 py-3  placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/70 transition"
      />
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="rounded-xl border border-gray-700 px-4 py-3 text-white bg-gray-500"
      >
        {specialties.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {list.length > 0 ? (
        list.map((l, i) => (
          <motion.div
            key={l.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/10 text-gray-200 border border-gray-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:shadow-white/20 hover:-translate-y-1 transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{l.name}</h3>
              <span className="text-xs px-2 py-1 bg-white/10 text-gray-200 border border-white/20 rounded">
                {l.specialty}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              ⭐ {l.rating} · {l.cases} cases handled
            </p>

            <div className="mt-4 border-t border-gray-700/70 pt-4">
              <p className="text-2xl font-bold text-white/90">₹ {l.price}</p>
              <p className="text-gray-500 text-sm mt-1">per consultation</p>
            </div>

            <button
              onClick={() => alert(`Booking request sent to ${l.name}`)}
              className="group relative mt-6 w-full px-5 py-3 rounded-xl font-semibold text-black bg-white hover:bg-gray-200 transition overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <span className="relative z-10">Book Consultation</span>
            </button>
          </motion.div>
        ))
      ) : (
        <p className="text-center text-gray-400 col-span-full py-10">
          No lawyers found matching your search.
        </p>
      )}
    </div>
  </div>
</section>

    <Footer/>
    </>
  );
}
