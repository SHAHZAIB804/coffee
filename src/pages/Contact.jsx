import React from "react";

export default function Contact() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-6">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-lg w-full border border-amber-200">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-amber-900">
          ☕ Contact Us
        </h1>
        <p className="text-center text-amber-700 mb-8">
          Have a question or just want to say hi?  
          Fill out the form below and we’ll get back to you soon.
        </p>
        <form className="space-y-5">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-200 shadow-sm"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-200 shadow-sm"
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-200 shadow-sm resize-none"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-lg font-semibold text-lg shadow-md transform hover:scale-[1.02] transition duration-200"
          >
            📩 Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
