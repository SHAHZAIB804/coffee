import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function CoffeeCard({ coffee }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(coffee);
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
      whileHover={{ y: -4 }}
    >
      

<img src="./src/assets/coffee.jpeg" alt="" srcset="" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{coffee.name}</h3>
        <p className="text-gray-600 mb-3">
          ${Number(coffee.price).toFixed(2)}
        </p>

        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
        >
          <FiPlus className="text-lg" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
