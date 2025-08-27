import React from "react";
import CoffeeCard from "../components/CoffeeCard";

export default function Shop() {
  const coffees = [
    { id: 1, name: "Espresso Beans", price: 15, image: "/images/beans.jpg" },
    { id: 2, name: "Latte Mug", price: 10, image: "/images/mug.jpg" },
    { id: 3, name: "French Press", price: 25, image: "/images/frenchpress.jpg" },
  ];

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {coffees.map((coffee) => (
        <CoffeeCard key={coffee.id} coffee={coffee} />
      ))}
    </div>
  );
}
