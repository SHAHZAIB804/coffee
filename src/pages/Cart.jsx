import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, clearCart, totalPrice, updateQuantity } = useCart();

  const subtotal = Number(totalPrice) || 0;
  const delivery = cart.length ? 6 : 0;
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + delivery + tax;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="rounded-[32px] border border-dashed border-[#d7c3b2] bg-white p-12 shadow-[0_18px_38px_rgba(95,75,61,0.04)]">
          <div className="text-6xl">🛒</div>
          <h2 className="mt-6 text-3xl font-black text-[#2a1d17]">Your cart is empty</h2>
          <p className="mt-3 text-[#5f4a42]">Add your favorite coffee to get started.</p>
          <Link to="/menu" className="mt-6 inline-flex rounded-full bg-[#5c4033] px-6 py-3 font-semibold text-white hover:bg-[#442d25]">
            Explore menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8a6a5e]">Your cart</p>
        <h1 className="mt-3 text-4xl font-black text-[#2a1d17]">Ready for checkout</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col gap-5 rounded-[28px] border border-[#f0e7df] bg-white p-5 shadow-[0_18px_38px_rgba(95,75,61,0.04)] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {item.image && (
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
                )}
                <div>
                  <h3 className="text-xl font-semibold text-[#2a1d17]">{item.name}</h3>
                  <p className="text-[#5f4a42]">${Number(item.price).toFixed(2)} each</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center overflow-hidden rounded-full border border-[#e6d6c8] bg-[#fffaf6]">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-2 text-lg font-semibold text-[#2a1d17]">-</button>
                  <span className="min-w-[2rem] text-center text-sm font-semibold text-[#2a1d17]">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-2 text-lg font-semibold text-[#2a1d17]">+</button>
                </div>

                <button onClick={() => removeFromCart(item.id)} className="rounded-full bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-[30px] bg-[#1d120d] p-6 text-white shadow-[0_25px_60px_rgba(42,29,23,0.2)]">
          <h2 className="text-2xl font-bold">Order summary</h2>

          <div className="mt-6 space-y-4 text-[#f2e7dd]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>${delivery.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-lg font-bold">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          <div className="mt-6 rounded-2xl bg-white/5 p-3">
            <input
              type="text"
              placeholder="Promo code"
              className="w-full bg-transparent px-3 py-2 text-white placeholder:text-[#d8c5b6] outline-none"
            />
          </div>

          <Link to="/checkout" className="mt-6 block rounded-full bg-[#d9a668] px-4 py-3 text-center font-semibold text-[#1d120d] transition hover:bg-[#e4b677]">
            Proceed to checkout
          </Link>

          <button onClick={clearCart} className="mt-3 w-full rounded-full border border-white/15 px-4 py-3 font-semibold text-white hover:bg-white/5">
            Clear cart
          </button>
        </aside>
      </div>
    </div>
  );
}

