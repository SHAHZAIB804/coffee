import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const questions = [
  ["How long does delivery take?", "Most local orders arrive within 30–45 minutes. You will see an estimated time at checkout."],
  ["Can I customize my drink?", "Yes. Open any item from the menu to choose size and milk type before adding it to your cart."],
  ["What payment methods do you accept?", "We accept major cards, Visa, Mastercard, JazzCash, EasyPaisa, bank transfer, and cash on delivery."],
  ["Can I change or cancel an order?", "Contact us as soon as possible. We can usually help before the bar begins preparing your order."],
  ["Do you offer rewards?", "Every order earns Brew Rewards points. Your profile keeps track of your balance and progress."],
];

export default function Faqs() {
  const [open, setOpen] = useState(0);
  return <main className="min-h-screen bg-[#fffaf6] px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl"><p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[#b2763f]">Need a little clarity?</p><h1 className="mt-3 text-center text-4xl font-black text-[#2a1d17]">Frequently asked questions</h1><div className="mt-10 space-y-3">{questions.map(([question, answer], index) => <div key={question} className="overflow-hidden rounded-2xl border border-[#eadfd6] bg-white"><button type="button" onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-[#2a1d17]"><span>{question}</span><FiChevronDown className={`shrink-0 transition ${open === index ? "rotate-180 text-[#b2763f]" : ""}`} /></button>{open === index && <p className="px-5 pb-5 text-sm leading-7 text-[#725d51]">{answer}</p>}</div>)}</div></div></main>;
}
