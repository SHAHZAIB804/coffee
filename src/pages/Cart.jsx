import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) {
    return <h2 className="text-center text-xl mt-10">🛒 Your cart is empty!</h2>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.map((item) => (
        <div key={item.id} className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg mb-3">
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p>${item.price} × {item.quantity}</p>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={clearCart}
        className="mt-4 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-900"
      >
        Clear Cart
      </button>
    </div>
  );
}
