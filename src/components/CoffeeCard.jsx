import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiPlus, FiStar, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function CoffeeCard({ coffee }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(coffee, 1);
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-[28px] border border-[#f0e7df] bg-white shadow-[0_20px_40px_rgba(73,44,31,0.08)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={coffee.image}
          alt={coffee.name}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5c4033] backdrop-blur-sm">
          {coffee.category}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-[#2a1d17]">{coffee.name}</h3>
            <p className="mt-1 text-sm text-[#7a6155]">{coffee.description}</p>
          </div>
          <span className="text-xl font-bold text-[#5c4033]">${Number(coffee.price).toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-[#7a6155]">
          <div className="flex items-center gap-1.5">
            <FiStar className="fill-[#f59e0b] text-[#f59e0b]" />
            <span className="font-medium text-[#2a1d17]">{coffee.rating}</span>
            <span>({coffee.reviewCount || 0})</span>
          </div>
          <span className="rounded-full bg-[#f7efe8] px-2.5 py-1 text-[11px] font-medium text-[#7a6155]">
            Popular
          </span>
        </div>

        <Link
          to={`/product/${coffee.id}`}
          className="block text-center text-sm font-semibold text-[#8a6a5e] transition hover:text-[#2a1d17]"
        >
          View details
        </Link>

        <button
          onClick={handleAdd}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#5c4033] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#442d25]"
        >
          <FiShoppingCart />
          Add to Cart
        </button>
      </div>
    </motion.article>
  );
}
