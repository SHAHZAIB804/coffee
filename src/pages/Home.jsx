import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCoffee, FiTruck, FiStar, FiGift } from "react-icons/fi";
import { io } from "socket.io-client";
import Hero from "../components/Hero";
import CoffeeCard from "../components/CoffeeCard";

const reasons = [
  {
    icon: <FiCoffee className="text-2xl" />,
    title: "Ethically sourced beans",
    text: "We partner with grower communities that prioritize quality and sustainability.",
  },
  {
    icon: <FiTruck className="text-2xl" />,
    title: "Fast local delivery",
    text: "Enjoy pickup or doorstep delivery in under 30 minutes across the city.",
  },
  {
    icon: <FiStar className="text-2xl" />,
    title: "Barista-approved quality",
    text: "Every roast is crafted to deliver rich, layered flavor and premium texture.",
  },
  {
    icon: <FiGift className="text-2xl" />,
    title: "Curated subscriptions",
    text: "Select your favorite roasts and get monthly freshness delivered automatically.",
  },
];

const reviews = [
  { name: "Amina T.", text: "The best latte in town. Rich, smooth, and beautifully balanced." },
  { name: "Zahid R.", text: "Coffee Hub has become my daily ritual. The quality is exceptional." },
  { name: "Sara K.", text: "Premium flavor, clean design, and the order experience feels effortless." },
];

export default function Home() {
  const [heroData, setHeroData] = useState({});
  const [promoData, setPromoData] = useState({ isActive: false });
  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchData();

    const socket = io(apiUrl);
    socket.on('setting:updated', () => fetchSettings());
    socket.on('section:updated', () => fetchSections());
    socket.on('product:updated', () => fetchProducts());
    socket.on('product:created', () => fetchProducts());
    socket.on('product:deleted', () => fetchProducts());
    socket.on('category:updated', () => fetchCategories());

    return () => socket.disconnect();
  }, [apiUrl]);

  const fetchData = async () => {
    fetchSettings();
    fetchSections();
    fetchProducts();
    fetchCategories();
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        if (data.hero) setHeroData(data.hero);
        if (data.promo) setPromoData(data.promo);
      }
    } catch (e) {}
  };

  const fetchSections = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/sections`);
      if (res.ok) setSections(await res.json());
    } catch (e) {}
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/products?available=true`);
      if (res.ok) setProducts(await res.json());
    } catch (e) {}
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/categories`);
      if (res.ok) setCategories(await res.json());
    } catch (e) {}
  };

  const bestSellers = products.filter(p => p.isFeatured).slice(0, 4);
  if (bestSellers.length === 0) bestSellers.push(...products.slice(0, 4));

  return (
    <div className="bg-[#f9f4ee] text-[#2a1d17]">
      <Hero data={heroData} />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8a6a5e]">Discover</p>
          <h2 className="mt-3 text-4xl font-black text-[#2a1d17] sm:text-5xl">Featured categories</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-[30px] border border-[#eee1d5] bg-white p-7 shadow-[0_14px_34px_rgba(78,49,35,0.05)]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#f7efe8] text-xl text-[#5c4033]">
                ☕
              </div>
              <h3 className="text-xl font-semibold text-[#2a1d17]">{item.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[#f2e7dd] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8a6a5e]">Best sellers</p>
              <h2 className="mt-3 text-4xl font-black text-[#2a1d17]">Signature favorites</h2>
            </div>
            <Link to="/menu" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#5c4033]">
              View full menu <FiArrowRight />
            </Link>
          </div>

          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {bestSellers.map((coffee) => (
              <CoffeeCard key={coffee._id} coffee={coffee} />
            ))}
          </div>
        </div>
      </section>

      {/* Render Dynamic Sections */}
      {sections.map(section => (
        <section key={section._id} className="py-20 bg-[#fffaf6]">
           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <h2 className="mt-3 text-4xl font-black text-[#2a1d17]">{section.title}</h2>
                  {section.content?.description && (
                     <p className="mt-2 text-[#7a6155] max-w-2xl">{section.content.description}</p>
                  )}
                </div>
              </div>
              <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
                {products.filter(p => section.content?.productIds?.includes(p._id)).map((coffee) => (
                  <CoffeeCard key={coffee._id} coffee={coffee} />
                ))}
              </div>
           </div>
        </section>
      ))}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] bg-[#2a1d17] p-8 text-white shadow-[0_30px_80px_rgba(42,29,23,0.18)] sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d9a668]">Why choose us</p>
            <h2 className="mt-4 text-4xl font-black">Crafted for your everyday ritual.</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {reasons.map((reason) => (
                <div key={reason.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f7efe8] text-[#2a1d17]">
                    {reason.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#e8d9d0]">{reason.text}</p>
                </div>
              ))}
            </div>
          </div>

          {promoData.isActive ? (
            <div className="overflow-hidden rounded-[32px] bg-[#f7efe8] p-6 shadow-[0_20px_40px_rgba(81,57,46,0.08)] relative">
              {promoData.imageUrl && (
                 <img src={`${apiUrl}${promoData.imageUrl}`} alt="Promo background" className="absolute inset-0 w-full h-full object-cover opacity-30" />
              )}
              <div className="relative z-10">
                <div className="mb-4 inline-flex rounded-full bg-[#e8d7c7] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#5c4033]">
                  Special Offer
                </div>
                <h3 className="text-3xl font-black text-[#2a1d17]">{promoData.heading || 'Promo'}</h3>
                <p className="mt-4 text-[#6e534a]">
                  {promoData.description}
                </p>
                <div className="mt-6 rounded-[24px] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm uppercase tracking-[0.18em] text-[#8a6a5e]">Discount</div>
                      <div className="text-3xl font-black text-[#2a1d17]">{promoData.discount}</div>
                    </div>
                  </div>
                </div>
                <Link to="/menu" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#5c4033] px-5 py-3 font-semibold text-white transition hover:bg-[#442d25]">
                  {promoData.buttonText || 'Shop Now'} <FiArrowRight />
                </Link>
              </div>
            </div>
          ) : (
             <div className="overflow-hidden rounded-[32px] bg-[#f7efe8] p-6 shadow-[0_20px_40px_rgba(81,57,46,0.08)]">
                <h3 className="text-3xl font-black text-[#2a1d17] mt-10">Join our newsletter</h3>
                <p className="mt-4 text-[#6e534a]">Get exclusive updates and offers.</p>
             </div>
          )}
        </div>
      </section>

      <section className="bg-[#fffaf6] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8a6a5e]">Testimonials</p>
            <h2 className="mt-3 text-4xl font-black text-[#2a1d17]">Lovers of our roast</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.name} className="rounded-[28px] border border-[#f0e7df] bg-white p-7 shadow-[0_18px_38px_rgba(95,75,61,0.05)]">
                <div className="mb-4 flex gap-1 text-[#f59e0b]">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="fill-current" />
                  ))}
                </div>
                <p className="text-base leading-7 text-[#5f4a42]">“{review.text}”</p>
                <div className="mt-6 font-semibold text-[#2a1d17]">{review.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
