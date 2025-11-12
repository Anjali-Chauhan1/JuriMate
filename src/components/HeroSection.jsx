import { motion } from "framer-motion";
import justiceBGimg from "../assets/justiceBGimg.webp";
import { useEffect } from "react";

export default function HeroSection() {
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  return (
    <section
      className="relative h-screen overflow-hidden text-white flex flex-col md:flex-row items-center justify-center px-6 md:px-16 bg-cover bg-center"
      style={{
        backgroundImage: `url(${justiceBGimg})`,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent"></div>

      <div className="relative z-10 md:w-1/2 text-center md:text-left space-y-8">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-brand-400"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Understand any legal document
          <br />
          <span className="text-white">in minutes, not hours</span>
        </motion.h1>

        <motion.p
          className="text-gray-300 text-lg max-w-md mx-auto md:mx-0 leading-relaxed"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
        >
          Upload contracts, policies, or T&amp;Cs — get instant AI-powered summaries,
          risk highlights, and key takeaways. Then chat live or connect with verified lawyers.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4 pt-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
        >
          <a
            href="#document"
            className="px-6 py-3  rounded-xl border border-gray-600 hover:bg-white/10 transition-all hover:scale-105"
          >
            Start Analysis
          </a>
        </motion.div>
      </div>

      <motion.div
        className="hidden md:block md:w-1/2 h-full"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      ></motion.div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black/90 to-transparent"></div>
    </section>
  );
}
