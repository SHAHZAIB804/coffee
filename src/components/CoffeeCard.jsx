import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiPlus, FiStar, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function CoffeeCard({ coffee }) {
  const { addToCart } = useCart();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleAdd = () => {
    // Normalize properties for cart context
    const cartItem = {
      ...coffee,
      id: coffee._id || coffee.id,
      image: coffee.imageUrl ? `${apiUrl}${coffee.imageUrl}` : coffee.image,
    };
    addToCart(cartItem, 1);
  };

  const imageUrl = coffee.imageUrl ? `${apiUrl}${coffee.imageUrl}` : coffee.image;
  const productId = coffee._id || coffee.id;
  const categoryName = typeof coffee.category === 'object' ? coffee.category?.name : coffee.category;
  const price = coffee.discountPrice ? coffee.discountPrice : coffee.price;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-[28px] border border-[#f0e7df] bg-white shadow-[0_20px_40px_rgba(73,44,31,0.08)] flex flex-col"
    >
      <div className="relative h-64 overflow-hidden bg-gray-100 flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={coffee.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5c4033] backdrop-blur-sm shadow-sm">
          {categoryName || 'Uncategorized'}
        </span>
        {coffee.discountPrice && (
          <span className="absolute right-4 top-4 rounded-full bg-amber-600 px-3 py-1 text-[10px] font-bold text-white shadow-sm">
            Sale
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-semibold text-[#2a1d17]">{coffee.name}</h3>
            <p className="mt-1 text-sm text-[#7a6155] line-clamp-2">{coffee.description}</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-[#5c4033] block">${Number(price).toFixed(2)}</span>
            {coffee.discountPrice && (
              <span className="text-xs text-gray-400 line-through">${Number(coffee.price).toFixed(2)}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-[#7a6155] mb-4">
          <div className="flex items-center gap-1.5">
            <FiStar className="fill-[#f59e0b] text-[#f59e0b]" />
            <span className="font-medium text-[#2a1d17]">{coffee.rating || '4.9'}</span>
            <span>({coffee.reviewCount || '120'})</span>
          </div>
          {coffee.isFeatured && (
            <span className="rounded-full bg-[#f7efe8] px-2.5 py-1 text-[11px] font-medium text-[#7a6155]">
              Featured
            </span>
          )}
        </div>

        <div className="mt-auto space-y-3">
          <Link
            to={`/product/${productId}`}
            className="block text-center text-sm font-semibold text-[#8a6a5e] transition hover:text-[#2a1d17]"
          >
            View details
          </Link>

          <button
            onClick={handleAdd}
            disabled={!coffee.isAvailable || coffee.stock === 0}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#5c4033] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#442d25] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiShoppingCart />
            {(!coffee.isAvailable || coffee.stock === 0) ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
