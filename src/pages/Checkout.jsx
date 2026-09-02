import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowLeft, FaCheck, FaCcMastercard, FaCcVisa, FaCreditCard,
  FaLock, FaShieldAlt, FaTruck, FaUniversity,
} from "react-icons/fa";
import { MdAccountBalanceWallet, MdLocalCafe, MdPayments } from "react-icons/md";
import { useCart } from "../context/CartContext";

const steps = ["Cart", "Checkout", "Payment", "Confirmation"];
const paymentMethods = [
  { id: "card", label: "Credit Card", description: "Visa, Mastercard or Amex", icon: FaCreditCard },
  { id: "debit", label: "Debit Card", description: "Pay securely with your bank card", icon: FaCreditCard },
  { id: "visa", label: "Visa", description: "Fast and familiar checkout", icon: FaCcVisa },
  { id: "mastercard", label: "Mastercard", description: "Protected card payment", icon: FaCcMastercard },
  { id: "jazzcash", label: "JazzCash", description: "Pay from your mobile wallet", icon: MdAccountBalanceWallet },
  { id: "easypaisa", label: "EasyPaisa", description: "Simple mobile payment", icon: MdPayments },
  { id: "bank", label: "Bank Transfer", description: "Transfer directly from your bank", icon: FaUniversity },
  { id: "cod", label: "Cash on Delivery", description: "Pay when your coffee arrives", icon: FaTruck },
];
const initialDetails = { name: "", email: "", phone: "", address: "", city: "", postal: "", notes: "" };
const initialCard = { holder: "", number: "", expiry: "", cvv: "" };
const money = (value) => `$${value.toFixed(2)}`;
const digitsOnly = (value) => value.replace(/\D/g, "");

function Field({ label, name, value, onChange, placeholder, type = "text", error, className = "" }) {
  return <label className={`block ${className}`}>
    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#725d51]">{label}</span>
    <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} aria-invalid={Boolean(error)} className={`w-full rounded-xl border bg-[#fffdfb] px-4 py-3.5 text-sm text-[#2a1d17] outline-none transition placeholder:text-[#b7a69a] focus:border-[#c88d4b] focus:ring-4 focus:ring-[#c88d4b]/10 ${error ? "border-red-400" : "border-[#eadfd6]"}`} />
    {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
  </label>;
}

function Progress({ activeStep }) {
  return <div className="mb-10 flex items-start justify-between">
    {steps.map((step, index) => {
      const complete = index < activeStep;
      const active = index === activeStep;
      return <div key={step} className="relative flex flex-1 flex-col items-center gap-2 text-center last:flex-none sm:flex-row sm:gap-3 sm:text-left">
        {index > 0 && <div className={`absolute right-1/2 top-4 hidden h-px w-full -translate-y-1/2 sm:block ${complete ? "bg-[#c88d4b]" : "bg-[#eadfd6]"}`} />}
        <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${complete ? "bg-[#c88d4b] text-white" : active ? "bg-[#2a1d17] text-white ring-4 ring-[#ead8c6]" : "border border-[#ddcec1] bg-[#fffaf6] text-[#8e786a]"}`}>{complete ? <FaCheck /> : index + 1}</div>
        <span className={`hidden text-xs font-bold uppercase tracking-[0.1em] sm:block ${active ? "text-[#2a1d17]" : "text-[#9b887c]"}`}>{step}</span>
      </div>;
    })}
  </div>;
}

function PaymentCard({ card, brand }) {
  return <motion.div layout className="relative h-52 overflow-hidden rounded-2xl bg-[#2a1d17] p-6 text-white shadow-[0_20px_45px_rgba(42,29,23,0.25)]">
    <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full border-[28px] border-[#c88d4b]/30" />
    <div className="relative flex items-center justify-between"><MdLocalCafe className="text-2xl text-[#e8bd88]" /><span className="text-xs font-semibold tracking-[0.2em] text-white/60">COFFEE HUB</span></div>
    <div className="relative mt-8 text-xl tracking-[0.18em]">{card.number || "•••• •••• •••• ••••"}</div>
    <div className="relative mt-6 flex items-end justify-between text-[10px] uppercase tracking-[0.14em] text-white/60"><div><span className="block">Card holder</span><strong className="mt-1 block text-xs tracking-normal text-white">{card.holder || "YOUR NAME"}</strong></div><div><span className="block">Expires</span><strong className="mt-1 block text-xs tracking-normal text-white">{card.expiry || "MM/YY"}</strong></div><div className="text-2xl text-white">{brand === "visa" ? <FaCcVisa /> : brand === "mastercard" ? <FaCcMastercard /> : <FaCreditCard />}</div></div>
  </motion.div>;
}

function Confirmation({ order, total }) {
  return <motion.main initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[75vh] items-center justify-center bg-[linear-gradient(135deg,#fffaf6,#f3e4d5)] px-4 py-16"><div className="w-full max-w-xl rounded-3xl border border-white bg-white/80 p-8 text-center shadow-[0_24px_70px_rgba(65,42,26,0.1)] backdrop-blur-md"><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.15 }} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#dcefd5] text-3xl text-[#4f8846]"><FaCheck /></motion.div><p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#b2763f]">04 / Confirmation</p><h1 className="mt-3 text-4xl font-black text-[#2a1d17]">Order successful.</h1><p className="mt-3 text-[#725d51]">Your coffee is being prepared with care.</p><div className="mt-8 grid gap-3 rounded-2xl bg-[#fff8ed] p-5 text-left text-sm text-[#725d51] sm:grid-cols-3"><div><span className="block text-xs uppercase tracking-wider">Order number</span><strong className="mt-1 block text-[#2a1d17]">{order.number}</strong></div><div><span className="block text-xs uppercase tracking-wider">Delivery</span><strong className="mt-1 block text-[#2a1d17]">30–45 minutes</strong></div><div><span className="block text-xs uppercase tracking-wider">Paid via</span><strong className="mt-1 block text-[#2a1d17]">{order.method}</strong></div></div><p className="mt-5 text-lg font-black text-[#2a1d17]">Total paid {money(total)}</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button type="button" onClick={() => window.print()} className="rounded-full border border-[#d8c5b6] px-6 py-3 text-sm font-bold text-[#2a1d17]">Download invoice</button><Link to="/menu" className="rounded-full bg-[#2a1d17] px-6 py-3 text-sm font-bold text-white">Continue shopping</Link></div></div></motion.main>;
}

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const [method, setMethod] = useState("card");
  const [details, setDetails] = useState(initialDetails);
  const [card, setCard] = useState(initialCard);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isPlacing, setIsPlacing] = useState(false);
  const [order, setOrder] = useState(null);
  const subtotal = Number(totalPrice) || 0;
  const delivery = cart.length ? 6 : 0;
  const tax = Math.max(0, (subtotal - discount) * 0.05);
  const total = Math.max(0, subtotal - discount + delivery + tax);
  const cardDigits = digitsOnly(card.number);
  const brand = cardDigits.startsWith("4") ? "visa" : cardDigits.startsWith("5") ? "mastercard" : "card";

  const updateDetails = (event) => setDetails((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  const updateCard = (event) => {
    const { name, value } = event.target;
    let formatted = value;
    if (name === "number") formatted = digitsOnly(value).slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (name === "expiry") formatted = digitsOnly(value).slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");
    if (name === "cvv") formatted = digitsOnly(value).slice(0, 4);
    setCard((previous) => ({ ...previous, [name]: formatted }));
  };
  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "BREW10") { setDiscount(subtotal * 0.1); setCouponMessage("BREW10 applied: 10% off your order"); }
    else { setDiscount(0); setCouponMessage(coupon ? "That code is not valid" : "Enter a coupon code first"); }
  };
  const validate = () => {
    const nextErrors = {};
    ["name", "email", "phone", "address", "city", "postal"].forEach((field) => { if (!details[field].trim()) nextErrors[field] = "This field is required"; });
    if (details.email && !/^\S+@\S+\.\S+$/.test(details.email)) nextErrors.email = "Enter a valid email";
    if (["card", "debit", "visa", "mastercard"].includes(method)) {
      if (cardDigits.length < 16) nextErrors.number = "Enter a 16-digit card number";
      if (card.holder.trim().length < 2) nextErrors.holder = "Enter the card holder name";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) nextErrors.expiry = "Use MM/YY format";
      if (card.cvv.length < 3) nextErrors.cvv = "Enter your CVV";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };
  const placeOrder = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setIsPlacing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: `CH-${Date.now().toString().slice(-8)}`,
          customer: {
            name: details.name,
            email: details.email,
            phone: details.phone,
            address: details.address,
            city: details.city,
            postal: details.postal,
            notes: details.notes
          },
          items: cart,
          pricing: {
            subtotal,
            discount,
            delivery,
            tax,
            total
          },
          paymentMethod: paymentMethods.find((item) => item.id === method)?.label,
        }),
      });

      if (!response.ok) throw new Error('Order placement failed');

      const data = await response.json();
      setOrder({ number: data.order.orderId, method: data.order.paymentMethod });
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };
  const orderItems = useMemo(() => cart, [cart]);

  if (order) return <Confirmation order={order} total={total} />;
  if (!cart.length) return <div className="mx-auto max-w-xl px-4 py-24 text-center"><div className="rounded-3xl border border-[#eadfd6] bg-white p-10 shadow-[0_18px_50px_rgba(65,42,26,0.08)]"><MdLocalCafe className="mx-auto text-5xl text-[#c88d4b]" /><h1 className="mt-5 text-3xl font-black text-[#2a1d17]">Your checkout is waiting</h1><p className="mt-3 text-[#725d51]">Add a coffee to your cart before continuing.</p><Link to="/menu" className="mt-7 inline-flex rounded-full bg-[#2a1d17] px-6 py-3 font-bold text-white">Explore the menu</Link></div></div>;

  return <motion.main initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-[linear-gradient(135deg,#fffaf6_0%,#f8eee5_48%,#f3e4d5_100%)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><div className="mx-auto max-w-7xl"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><Link to="/cart" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#806a5d] hover:text-[#2a1d17]"><FaArrowLeft /> Back to cart</Link><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b2763f]">Coffee Hub checkout</p><h1 className="mt-2 text-4xl font-black tracking-tight text-[#2a1d17] sm:text-5xl">Complete your order.</h1></div><div className="flex items-center gap-2 rounded-full border border-[#eadfd6] bg-white/60 px-4 py-2 text-xs font-bold text-[#725d51]"><FaLock className="text-[#b2763f]" /> Secure checkout</div></div><Progress activeStep={2} /><form onSubmit={placeOrder} className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]"><div className="space-y-6"><section className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[0_18px_50px_rgba(65,42,26,0.07)] backdrop-blur-md sm:p-7"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b2763f]">01 / Delivery</p><h2 className="mt-1 text-2xl font-black text-[#2a1d17]">Where should we deliver?</h2></div><FaTruck className="text-2xl text-[#c88d4b]" /></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Full name" name="name" value={details.name} onChange={updateDetails} placeholder="Alex Morgan" error={errors.name} /><Field label="Email address" name="email" value={details.email} onChange={updateDetails} placeholder="alex@example.com" type="email" error={errors.email} /><Field label="Phone number" name="phone" value={details.phone} onChange={updateDetails} placeholder="+1 555 000 0000" error={errors.phone} /><Field label="City" name="city" value={details.city} onChange={updateDetails} placeholder="New York" error={errors.city} /><Field label="Delivery address" name="address" value={details.address} onChange={updateDetails} placeholder="Street, building and apartment" error={errors.address} className="sm:col-span-2" /><Field label="Postal code" name="postal" value={details.postal} onChange={updateDetails} placeholder="10001" error={errors.postal} /><Field label="Delivery notes (optional)" name="notes" value={details.notes} onChange={updateDetails} placeholder="Leave at the front desk" className="sm:col-span-2" /></div><div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#fff8ed] px-4 py-3 text-sm text-[#725d51]"><FaTruck className="shrink-0 text-[#c88d4b]" /><span>Estimated delivery: <strong className="text-[#2a1d17]">30–45 minutes</strong></span></div></section><section className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[0_18px_50px_rgba(65,42,26,0.07)] backdrop-blur-md sm:p-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b2763f]">02 / Payment</p><h2 className="mt-1 text-2xl font-black text-[#2a1d17]">Choose how to pay</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{paymentMethods.map((item) => { const Icon = item.icon; const selected = method === item.id; return <motion.button whileTap={{ scale: 0.98 }} key={item.id} type="button" onClick={() => setMethod(item.id)} className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${selected ? "border-[#c88d4b] bg-[#fff5e8] shadow-[0_8px_22px_rgba(200,141,75,0.12)]" : "border-[#eadfd6] bg-white/60 hover:border-[#d4b18c]"}`}><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${selected ? "bg-[#2a1d17] text-[#e8bd88]" : "bg-[#f5ece4] text-[#8b6d5c]"}`}><Icon className="text-xl" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-[#2a1d17]">{item.label}</span><span className="mt-0.5 block text-xs text-[#8e786a]">{item.description}</span></span><span className={`h-4 w-4 rounded-full border-2 ${selected ? "border-[5px] border-[#c88d4b]" : "border-[#cdbbad]"}`} /></motion.button>; })}</div>{["card", "debit", "visa", "mastercard"].includes(method) && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-7 grid gap-6 overflow-hidden lg:grid-cols-[1fr_300px]"><div className="order-2 grid gap-4 sm:grid-cols-2 lg:order-1"><Field label="Card holder name" name="holder" value={card.holder} onChange={updateCard} placeholder="Alex Morgan" error={errors.holder} className="sm:col-span-2" /><Field label="Card number" name="number" value={card.number} onChange={updateCard} placeholder="1234 5678 9012 3456" error={errors.number} className="sm:col-span-2" /><Field label="Expiry date" name="expiry" value={card.expiry} onChange={updateCard} placeholder="MM/YY" error={errors.expiry} /><Field label="CVV" name="cvv" value={card.cvv} onChange={updateCard} placeholder="123" type="password" error={errors.cvv} /></div><div className="order-1 lg:order-2"><PaymentCard card={card} brand={brand} /><p className="mt-3 flex items-center justify-center gap-2 text-xs text-[#8e786a]"><FaShieldAlt className="text-[#c88d4b]" /> Your payment details are encrypted</p></div></motion.div>}</section><div className="grid gap-3 text-xs text-[#725d51] sm:grid-cols-3"><div className="flex items-center gap-2"><FaLock className="text-[#b2763f]" /> SSL secured</div><div className="flex items-center gap-2"><FaShieldAlt className="text-[#b2763f]" /> 256-bit encryption</div><div className="flex items-center gap-2"><FaCheck className="text-[#b2763f]" /> Money-back guarantee</div></div></div><aside className="h-fit rounded-3xl bg-[#2a1d17] p-5 text-white shadow-[0_25px_65px_rgba(42,29,23,0.22)] sm:p-7 xl:sticky xl:top-24"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e8bd88]">03 / Review</p><h2 className="mt-1 text-2xl font-black">Your order</h2></div><MdLocalCafe className="text-3xl text-[#e8bd88]" /></div><div className="mt-6 space-y-4">{orderItems.map((item) => <div key={item.id} className="flex gap-3 border-b border-white/10 pb-4"><img src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{item.name}</p><p className="mt-1 text-xs text-[#d8c5b6]">{item.quantity} × {money(Number(item.price))}</p></div><p className="text-sm font-semibold">{money(Number(item.price) * item.quantity)}</p></div>)}</div><div className="mt-6 flex gap-2"><input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Coupon code" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white outline-none placeholder:text-[#bba99d] focus:border-[#e8bd88]" /><button type="button" onClick={applyCoupon} className="rounded-xl bg-[#e8bd88] px-4 text-sm font-bold text-[#2a1d17] transition hover:bg-[#f1cd9e]">Apply</button></div>{couponMessage && <p className={`mt-2 text-xs ${discount ? "text-[#bfe3b1]" : "text-[#f4a7a0]"}`}>{couponMessage}</p>}<div className="mt-6 space-y-3 text-sm text-[#d8c5b6]"><div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="flex justify-between"><span>Discount</span><span className="text-[#bfe3b1]">-{money(discount)}</span></div><div className="flex justify-between"><span>Delivery</span><span>{money(delivery)}</span></div><div className="flex justify-between"><span>Tax / VAT</span><span>{money(tax)}</span></div></div><div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5"><span className="text-sm text-[#d8c5b6]">Grand total</span><strong className="text-3xl font-black text-[#e8bd88]">{money(total)}</strong></div><button disabled={isPlacing} type="submit" className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#e8bd88] px-4 py-4 font-black text-[#2a1d17] transition hover:bg-[#f1cd9e] disabled:cursor-wait disabled:opacity-60">{isPlacing ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-[#2a1d17] border-t-transparent" /> Placing order...</> : <>Place order <FaCheck /></>}</button><p className="mt-4 text-center text-xs text-[#bba99d]">By placing your order, you agree to our terms of service.</p></aside></form></div></motion.main>;
}
