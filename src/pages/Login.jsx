import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup && !formData.name) {
      alert("Please enter your full name.");
      return;
    }

    if (!formData.email || !formData.password) {
      alert("Please enter your email and password.");
      return;
    }

    onLogin();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(217,166,104,0.24),_transparent_35%),linear-gradient(135deg,#1d120d_0%,#3e2b21_45%,#744e38_100%)] px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-white/90 shadow-[0_30px_80px_rgba(17,9,7,0.35)] backdrop-blur-sm">
        <div className="bg-[#1d120d] px-8 pb-8 pt-10 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0d7b9] text-3xl text-[#1d120d]">☕</div>
          <h1 className="text-3xl font-black">Coffee Hub</h1>
          <p className="mt-2 text-sm text-[#d8c5b6]">Elevate your daily coffee ritual</p>
        </div>

        <div className="px-8 py-8">
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-full bg-[#f7efe8] p-1">
            <button
              type="button"
              onClick={() => setIsSignup(false)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!isSignup ? "bg-[#1d120d] text-white" : "text-[#5c4033]"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsSignup(true)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isSignup ? "bg-[#1d120d] text-white" : "text-[#5c4033]"}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-[#2a1d17]">Full Name</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  className="w-full rounded-lg border border-[#e6d6c8] bg-[#fffaf6] px-4 py-3 text-[#2a1d17] outline-none transition focus:border-[#d9a668]"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#2a1d17]">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#e6d6c8] bg-[#fffaf6] px-4 py-3 text-[#2a1d17] outline-none transition focus:border-[#d9a668]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-[#2a1d17]">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-[#e6d6c8] bg-[#fffaf6] px-4 py-3 text-[#2a1d17] outline-none transition focus:border-[#d9a668]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#d9a668] px-4 py-3 font-semibold text-[#1d120d] transition hover:bg-[#e4b677]"
            >
              {isSignup ? "Create Account" : "Login"}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center text-sm text-[#7a6155]">
            <div>Demo access: use any valid email and password.</div>
            <div>
              <Link to="/signup" className="font-semibold text-[#5c4033]">Create an account</Link>
              <span className="mx-2">•</span>
              <Link to="/forgot-password" className="font-semibold text-[#5c4033]">Forgot password?</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
