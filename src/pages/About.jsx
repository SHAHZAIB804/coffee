const teamMembers = [
  { name: "Aisha Rahman", role: "Head Roaster" },
  { name: "Noah Ali", role: "Barista Trainer" },
  { name: "Leah Khan", role: "Customer Experience Lead" },
  { name: "Zain Ahmed", role: "Sustainability Director" },
];

export default function About() {
  return (
    <div className="bg-[#fffaf6] text-[#2a1d17]">
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8a6a5e]">Our Story</p>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl">Built on craft, care, and community.</h1>
            <p className="mt-6 text-lg leading-8 text-[#5f4a42]">
              Coffee Hub began with one simple mission: to bring extraordinary coffee to everyday routines.
              We travel the world for ethically sourced beans, roast in small batches, and serve with the warmth
              of a neighborhood café.
            </p>
            <p className="mt-4 text-lg leading-8 text-[#5f4a42]">
              From seed-to-sip, every decision is guided by quality, sustainability, and a love for meaningful coffee culture.
            </p>
          </div>

          <div className="overflow-hidden rounded-[30px] shadow-[0_25px_60px_rgba(74,53,41,0.12)]">
            <img
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80"
              alt="Coffee roastery"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#f2e7dd] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              ["12+", "Years of coffee craft"],
              ["40k+", "Cups served monthly"],
              ["100%", "Ethically sourced beans"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[28px] border border-[#eadcc8] bg-white p-8 text-center shadow-sm">
                <div className="text-4xl font-black text-[#2a1d17]">{value}</div>
                <div className="mt-3 text-[#5f4a42]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8a6a5e]">Meet the team</p>
          <h2 className="mt-3 text-4xl font-black text-[#2a1d17]">Baristas with a passion for perfection</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {teamMembers.map((member) => (
            <div key={member.name} className="overflow-hidden rounded-[28px] border border-[#f0e7df] bg-white shadow-[0_18px_38px_rgba(95,75,61,0.05)]">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
                alt={member.name}
                className="h-72 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#2a1d17]">{member.name}</h3>
                <p className="mt-1 text-[#7a6155]">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

