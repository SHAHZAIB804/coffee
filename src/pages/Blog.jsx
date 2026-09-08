const posts = [
  {
    id: 1,
    title: "The Art of Brewing the Perfect Pour Over",
    date: "Aug 5, 2025",
    excerpt: "A guide to grind size, bloom time, and water flow for a sweeter, cleaner cup.",
    image: "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Top 5 Single-Origin Beans Worth Trying",
    date: "Jul 20, 2025",
    excerpt: "From floral Ethiopian lots to chocolatey Colombian roasts, discover your next favorite origin.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "How We Roast for Balance, Body, and Flavor",
    date: "Jun 11, 2025",
    excerpt: "Learn how small batch roasting creates an even, layered cup with a crisp finish.",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80",
  },
];

export default function Blog() {
  return (
    <div className="bg-[#fffaf6] text-[#2a1d17]">
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8a6a5e]">Journal</p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">Coffee stories and brewing inspiration</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="overflow-hidden rounded-[28px] border border-[#f0e7df] bg-white shadow-[0_18px_38px_rgba(95,75,61,0.05)]">
              <img src={post.image} alt={post.title} className="h-64 w-full object-cover" />
              <div className="p-6">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a6a5e]">{post.date}</p>
                <h2 className="mt-3 text-2xl font-bold text-[#2a1d17]">{post.title}</h2>
                <p className="mt-4 text-[#5f4a42]">{post.excerpt}</p>
                <button className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#5c4033]">Read Article</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

