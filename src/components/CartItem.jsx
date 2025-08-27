import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div>
          <h4 className="font-semibold text-gray-900">{item.name}</h4>
          <p className="text-gray-600">
            ${item.price.toFixed(2)} × {item.quantity}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="px-3 py-1 bg-gray-200 rounded"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="min-w-[2rem] text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
          aria-label="Increase quantity"
        >
          +
        </button>
        <button
          onClick={() => removeFromCart(item.id)}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
