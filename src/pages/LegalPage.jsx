const copy = {
  "Privacy policy": ["We respect your privacy.", "Coffee Hub uses the information you provide to process orders, improve your experience, and communicate about your account. We do not sell personal information."],
  "Terms & conditions": ["A simple promise between us.", "By using Coffee Hub, you agree to provide accurate order information, use the service lawfully, and review your order details before placing it. Prices and availability may change."],
};

export default function LegalPage({ title }) {
  const [intro, body] = copy[title] || copy["Privacy policy"];
  return <main className="min-h-screen bg-[#fffaf6] px-4 py-14 sm:px-6 lg:px-8"><article className="mx-auto max-w-3xl rounded-3xl border border-[#eadfd6] bg-white p-7 shadow-[0_18px_40px_rgba(73,44,31,0.05)] sm:p-12"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b2763f]">Coffee Hub</p><h1 className="mt-3 text-4xl font-black text-[#2a1d17]">{title}</h1><h2 className="mt-10 text-xl font-black text-[#2a1d17]">{intro}</h2><p className="mt-4 text-base leading-8 text-[#725d51]">{body}</p><h2 className="mt-8 text-xl font-black text-[#2a1d17]">Questions?</h2><p className="mt-4 text-base leading-8 text-[#725d51]">Reach our team through the Contact page and we will be happy to help.</p></article></main>;
}
