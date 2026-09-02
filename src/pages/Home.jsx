import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCoffee, FiTruck, FiStar, FiGift } from "react-icons/fi";
import Hero from "../components/Hero";
import CoffeeCard from "../components/CoffeeCard";
import coffeeData from "../data/coffeeData";

const categories = [
  { name: "Espresso", desc: "Bold and concentrated" },
  { name: "Cold Brew", desc: "Smooth and refreshing" },
  { name: "Signature", desc: "Chef-crafted icons" },
  { name: "Seasonal", desc: "Fresh limited drops" },
];

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
  const bestSellers = coffeeData.slice(0, 4);

  return (
    <div className="bg-[#f9f4ee] text-[#2a1d17]">
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8a6a5e]">Discover</p>
          <h2 className="mt-3 text-4xl font-black text-[#2a1d17] sm:text-5xl">Featured categories</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((item, index) => (
            <motion.div
              key={item.name}
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
              <p className="mt-2 text-[#7a6155]">{item.desc}</p>
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
              <CoffeeCard key={coffee.id} coffee={coffee} />
            ))}
          </div>
        </div>
      </section>

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

          <div className="overflow-hidden rounded-[32px] bg-[#f7efe8] p-6 shadow-[0_20px_40px_rgba(81,57,46,0.08)]">
            <div className="mb-4 inline-flex rounded-full bg-[#e8d7c7] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#5c4033]">
              Limited offer
            </div>
            <h3 className="text-3xl font-black text-[#2a1d17]">Roastery Box</h3>
            <p className="mt-4 text-[#6e534a]">
              3 premium beans, tasting notes, and brewing guides included in every curated box.
            </p>
            <div className="mt-6 rounded-[24px] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm uppercase tracking-[0.18em] text-[#8a6a5e]">From</div>
                  <div className="text-3xl font-black text-[#2a1d17]">$29</div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80"
                  alt="Coffee subscription box"
                  className="h-24 w-24 rounded-2xl object-cover"
                />
              </div>
            </div>
            <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#5c4033] px-5 py-3 font-semibold text-white transition hover:bg-[#442d25]">
              Shop subscription <FiArrowRight />
            </Link>
          </div>
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

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[32px] bg-gradient-to-r from-[#2a1d17] to-[#4b342c] p-8 text-white shadow-[0_30px_90px_rgba(74,53,41,0.28)] sm:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d9a668]">Stay in the loop</p>
              <h2 className="mt-4 text-4xl font-black">Fresh roasts. Better mornings.</h2>
            </div>
            <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-white placeholder:text-white/60 outline-none focus:border-[#d9a668]"
              />
              <button className="rounded-full bg-[#d9a668] px-6 py-3 font-semibold text-[#1d120d] transition hover:bg-[#e4b677]">
                Join now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
