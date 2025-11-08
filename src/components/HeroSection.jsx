
export default function HeroSection() {
  return (
    <section className="h-screen bg-linear-to-b from-brand-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          Understand any legal document in minutes
        </h1>
       
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Upload a policy, contract, or T&amp;C. Get a plain-English summary, a color-coded risk score,
          key points, and live chat for your doubts—then connect with the right lawyer.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a href="#document" className="px-5 py-3 rounded-xl bg-brand-600 text-white hover:bg-brand-700 shadow-soft">
            Start analysis
          </a>
          <a href="#analysis" className="px-5 py-3 rounded-xl border hover:bg-gray-50">
            See features
          </a>
        </div>
      </div>
    </section>
  );
}
