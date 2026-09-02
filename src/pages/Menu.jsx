import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiStar } from "react-icons/fi";
import { io } from "socket.io-client";
import CoffeeCard from "../components/CoffeeCard";

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    const socket = io(apiUrl);
    socket.on('product:created', () => fetchProducts());
    socket.on('product:updated', () => fetchProducts());
    socket.on('product:deleted', () => fetchProducts());
    socket.on('category:created', () => fetchCategories());
    socket.on('category:updated', () => fetchCategories());
    socket.on('category:deleted', () => fetchCategories());

    return () => socket.disconnect();
  }, [apiUrl]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/products?available=true`);
      if (res.ok) setProducts(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/categories`);
      if (res.ok) setCategories(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = useMemo(() => {
    const result = products.filter((coffee) => {
      const catName = coffee.category?.name || "Uncategorized";
      const matchesCategory = selectedCategory === "All" || catName === selectedCategory;
      const matchesSearch = coffee.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return [...result].sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      
      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    });
  }, [search, selectedCategory, sortBy, products]);

  const catNames = ["All", ...categories.map(c => c.name)];

  return (
    <div className="bg-[#fffaf6] text-[#2a1d17] min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8a6a5e]">Our menu</p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">Curated coffee for every moment</h1>
        </div>

        <div className="mb-8 rounded-[28px] border border-[#f0e7df] bg-white p-4 shadow-[0_18px_38px_rgba(95,75,61,0.04)] md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-xl items-center gap-3 rounded-full border border-[#e6d6c8] bg-[#fffaf6] px-4 py-3 w-full lg:w-[400px]">
              <FiSearch className="text-[#7a6155]" />
              <input
                aria-label="Search menu"
                type="text"
                placeholder="Search drinks, flavors, categories"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-[#2a1d17] outline-none placeholder:text-[#8a6a5e]"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-[#5f4a42]">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-[#e6d6c8] bg-[#fffaf6] px-4 py-2 text-[#2a1d17] outline-none"
              >
                <option value="popular">Popularity</option>
                <option value="rating">Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {catNames.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "bg-[#5c4033] text-white"
                    : "border border-[#e6d6c8] bg-[#fffaf6] text-[#5f4a42] hover:border-[#d9a668]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between text-sm text-[#7a6155]">
          <div className="flex items-center gap-2">
            <FiStar className="fill-[#f59e0b] text-[#f59e0b]" />
            <span>{filteredItems.length} drinks available</span>
          </div>
        </div>

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((coffee) => <CoffeeCard key={coffee._id} coffee={coffee} />)
          ) : (
            <div className="col-span-full rounded-[28px] border border-dashed border-[#d7c3b2] bg-[#fffaf6] p-10 text-center text-[#5f4a42]">
              No drinks match your search. Try another keyword or category.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

