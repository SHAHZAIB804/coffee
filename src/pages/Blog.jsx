import React from "react";

export default function Blog() {
  const posts = [
    { id: 1, title: "The Art of Brewing Coffee", date: "Aug 5, 2025" },
    { id: 2, title: "Top 5 Coffee Beans in the World", date: "Jul 20, 2025" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Blog</h1>
      {posts.map((post) => (
        <div key={post.id} className="mb-4 border-b pb-2">
          <h2 className="text-2xl font-semibold">{post.title}</h2>
          <p className="text-gray-500">{post.date}</p>
        </div>
      ))}
    </div>
  );
}
