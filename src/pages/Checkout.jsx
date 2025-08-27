import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    // In a real app, you would:
    // 1. Process payment
    // 2. Send order to backend
    // 3. Clear cart
    alert(`Order placed successfully! Total: $${totalPrice.toFixed(2)}`);
    clearCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-16 px-4 max-w-2xl"
    >
      <h1 className="text-3xl font-bold mb-8 text-coffee-900">Checkout</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-coffee-800">
          Order Summary
        </h2>
        
        <div className="mb-6 space-y-4">
          {cart.map(item => (
            <div 
              key={item.id} 
              className="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-lg font-bold mb-6 pt-4 border-t border-gray-200">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-coffee-800">
          Payment Information
        </h2>
        
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Card Number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Expiry Date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="CVV"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-lg font-medium transition-colors"
        >
          Place Order
        </button>
      </div>
    </motion.div>
  );
}