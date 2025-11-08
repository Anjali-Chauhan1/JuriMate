import { Link } from "react-router-dom";
import { LAWYERS } from "../utils/dummyData";

export default function LawyerConnectSection() {
  return (
    <section id="lawyers" className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Connect with a lawyer</h2>
          <p className="text-gray-600">Find specialists by category and book a consult.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LAWYERS.slice(0, 3).map((l) => (
            <div key={l.id} className="border rounded-2xl p-6 bg-white shadow-soft">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{l.name}</h3>
                <span className="text-xs px-2 py-0.5 bg-brand-100 text-brand-700 rounded">
                  {l.specialty}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">⭐ {l.rating} · {l.cases} cases</p>
              <p className="mt-4 text-lg font-bold">₹ {l.price}</p>
              <Link
                to="/lawyers"
                className="mt-4 inline-block px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700"
              >
                View & Connect
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/lawyers"
            className="px-5 py-3 rounded-xl border hover:bg-white shadow-soft"
          >
            Browse all lawyers
          </Link>
        </div>
      </div>
    </section>
  );
}
