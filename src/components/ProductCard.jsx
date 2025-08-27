import { motion } from "framer-motion";
import { useCart } from "../context/CartContext.jsx";
import { FiShoppingCart } from "react-icons/fi";

export default function ProductCard({ product }) {
  const { add } = useCart();

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      {/* Product Image with Hover Effect */}
      <div className="relative overflow-hidden h-56">
        <motion.img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-white/90 text-coffee-700 text-xs font-medium px-2.5 py-0.5 rounded-full backdrop-blur-sm">
          {product.category}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {product.title}
          </h3>
          <span className="text-xl font-bold text-coffee-600 ml-2">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Rating (Optional) */}
        <div className="flex items-center mt-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < product.rating?.rate ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-500 ml-1">
            ({product.rating?.count || 0})
          </span>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={() => {
            add(product, 1);
            // You could add a toast notification here
          }}
          className="w-full flex items-center justify-center gap-2 bg-coffee-600 hover:bg-coffee-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200"
          whileTap={{ scale: 0.95 }}
        >
          <FiShoppingCart className="text-lg" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}