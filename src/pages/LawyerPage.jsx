import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LAWYERS } from "../utils/dummyData";
import { useMemo, useState } from "react";

export default function LawyerPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");

  const list = useMemo(() => {
    return LAWYERS.filter((l) => {
      const okQ = q ? (l.name.toLowerCase().includes(q.toLowerCase()) || l.specialty.toLowerCase().includes(q.toLowerCase())) : true;
      const okF = filter === "All" ? true : l.specialty === filter;
      return okQ && okF;
    });
  }, [q, filter]);

  const specialties = ["All", ...new Set(LAWYERS.map((l) => l.specialty))];

  return (
    <>
      <Navbar />
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Find your lawyer</h1>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or specialty..."
            className="flex-1 min-w-[220px] rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
          >
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((l) => (
            <div key={l.id} className="border rounded-2xl p-6 bg-white shadow-soft">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{l.name}</h3>
                <span className="text-xs px-2 py-0.5 bg-brand-100 text-brand-700 rounded">
                  {l.specialty}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">⭐ {l.rating} · {l.cases} cases</p>
              <p className="mt-4 text-lg font-bold">₹ {l.price}</p>
              <button
                onClick={() => alert(`Booking request sent to ${l.name}`)}
                className="mt-4 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 w-full"
              >
                Book Consultation
              </button>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
