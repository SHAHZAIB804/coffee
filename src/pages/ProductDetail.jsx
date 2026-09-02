import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingBag, FiStar } from "react-icons/fi";
import coffeeData from "../data/coffeeData";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = coffeeData.find((item) => String(item.id) === productId);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("Regular");
  const [milk, setMilk] = useState("Whole milk");
  const [added, setAdded] = useState(false);

  if (!product) return <div className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-3xl font-black text-[#2a1d17]">Coffee not found</h1><Link to="/menu" className="mt-6 inline-flex rounded-full bg-[#5c4033] px-6 py-3 font-bold text-white">Back to menu</Link></div>;

  const customized = { ...product, name: `${product.name} · ${size}`, quantity };
  const add = (buyNow = false) => { addToCart(customized, quantity); setAdded(true); if (buyNow) navigate("/cart"); };

  return <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-[#fffaf6] px-4 py-10 sm:px-6 lg:px-8 lg:py-16"><div className="mx-auto max-w-6xl"><Link to="/menu" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#806a5d] hover:text-[#2a1d17]"><FiArrowLeft /> Back to menu</Link><div className="grid gap-10 lg:grid-cols-2 lg:items-center"><div className="overflow-hidden rounded-[32px] shadow-[0_25px_60px_rgba(73,44,31,0.13)]"><img src={product.image} alt={product.name} className="h-[420px] w-full object-cover sm:h-[540px]" /></div><div><span className="rounded-full bg-[#f4e8dc] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#8a6a5e]">{product.category}</span><h1 className="mt-5 text-4xl font-black text-[#2a1d17] sm:text-5xl">{product.name}</h1><div className="mt-4 flex items-center gap-2 text-sm text-[#7a6155]"><FiStar className="fill-[#f59e0b] text-[#f59e0b]" /><strong className="text-[#2a1d17]">{product.rating}</strong> ({product.reviewCount} reviews)<span className="ml-2 text-2xl font-black text-[#5c4033]">${product.price.toFixed(2)}</span></div><p className="mt-6 text-lg leading-8 text-[#725d51]">{product.description} Crafted with carefully sourced beans for a balanced, memorable cup.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-[#2a1d17]">Size<select value={size} onChange={(event) => setSize(event.target.value)} className="mt-2 block w-full rounded-xl border border-[#e6d6c8] bg-white px-4 py-3 font-normal outline-none focus:border-[#d9a668]"><option>Regular</option><option>Large</option><option>Extra large</option></select></label><label className="text-sm font-bold text-[#2a1d17]">Milk type<select value={milk} onChange={(event) => setMilk(event.target.value)} className="mt-2 block w-full rounded-xl border border-[#e6d6c8] bg-white px-4 py-3 font-normal outline-none focus:border-[#d9a668]"><option>Whole milk</option><option>Oat milk</option><option>Almond milk</option><option>None</option></select></label></div><div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm"><div className="flex items-center gap-4"><span className="text-sm font-bold text-[#2a1d17]">Quantity</span><div className="flex items-center overflow-hidden rounded-full border border-[#e6d6c8]"><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="p-3 text-[#5c4033]"><FiMinus /></button><span className="min-w-8 text-center font-bold">{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)} className="p-3 text-[#5c4033]"><FiPlus /></button></div></div><span className="text-xl font-black text-[#5c4033]">${(product.price * quantity).toFixed(2)}</span></div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => add(false)} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#5c4033] px-5 py-3 font-bold text-[#5c4033] hover:bg-[#f7efe8]"><FiShoppingBag /> {added ? "Added to cart" : "Add to cart"}</button><button type="button" onClick={() => add(true)} className="flex-1 rounded-full bg-[#5c4033] px-5 py-3 font-bold text-white hover:bg-[#442d25]">Buy now</button></div><p className="mt-5 text-sm text-[#8a6a5e]">Free delivery on orders over $40 · Prepared fresh for you</p></div></div></div></motion.main>;
}
