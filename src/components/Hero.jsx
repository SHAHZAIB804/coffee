import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiPlay } from "react-icons/fi";

export default function Hero({ data = {} }) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const heading = data.heading || "Crafted for coffee lovers.";
  const subheading = data.subheading || "Freshly roasted every morning";
  const description = data.description || "Experience boutique coffee blends, slow-roasted beans, and handcrafted drinks made to elevate every moment.";
  const buttonText = data.buttonText || "Explore Menu";
  const buttonLink = data.buttonLink || "/menu";
  const imageUrl = data.imageUrl ? `${apiUrl}${data.imageUrl}` : "https://images.unsplash.com/photo-1498804103079-a4f3fe7a4f0e?auto=format&fit=crop&w=1800&q=80";

  return (
    <section className="relative flex min-h-[720px] items-center overflow-hidden bg-[#1d120d]">
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt="Hero background"
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1d120d]/90 via-[#1d120d]/70 to-[#1d120d]/40" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-[#f7efe8] backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#d9a668]" />
            {subheading}
          </div>

          <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            {heading}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#eaded4]">
            {description}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to={buttonLink}
              className="inline-flex items-center gap-2 rounded-full bg-[#d9a668] px-7 py-3.5 text-base font-semibold text-[#1d120d] transition hover:bg-[#e4b677]"
            >
              {buttonText}
              <FiArrowRight />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-8 text-sm text-[#eaded4]">
            <div>
              <p className="text-2xl font-bold text-white">12k+</p>
              <span>Cups served</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">4.9/5</p>
              <span>Customer rating</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">24/7</p>
              <span>Barista care</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative justify-self-end"
        >
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-md">
            <img
              src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80"
              alt="Coffee cup"
              className="h-[440px] w-full rounded-[24px] object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-5 rounded-2xl bg-[#f7efe8] px-4 py-3 shadow-xl">
            <div className="text-xs uppercase tracking-[0.2em] text-[#7a6155]">Today’s special</div>
            <div className="mt-1 text-2xl font-black text-[#2a1d17]">$6.90</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}