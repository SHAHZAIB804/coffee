import React from "react";

export default function Menu() {
  const menuItems = [
    { name: "Espresso", price: "$3.50", description: "Strong and bold shot of coffee." },
    { name: "Latte", price: "$4.50", description: "Smooth espresso with steamed milk." },
    { name: "Cappuccino", price: "$4.00", description: "Espresso topped with rich milk foam." },
    { name: "Mocha", price: "$4.75", description: "Chocolate flavored coffee delight." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5ebe0] to-[#e6ccb2] flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-lg max-w-3xl w-full p-8 border border-[#d4a373]">
        {/* Title */}
        <h1 className="text-5xl font-extrabold mb-6 text-center text-[#7f5539]">
          ☕ Our Menu
        </h1>
        <p className="text-center text-[#9c6644] mb-10 italic">
          Freshly brewed, just for you.
        </p>

        {/* Menu List */}
        <ul className="space-y-6">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-4 bg-[#f8f5f2] rounded-lg shadow hover:shadow-md transition-shadow duration-300 hover:bg-[#e6ccb2] cursor-pointer"
            >
              <div>
                <span className="text-2xl font-semibold text-[#7f5539]">
                  {item.name}
                </span>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <span className="text-xl font-bold text-[#9c6644]">
                {item.price}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
