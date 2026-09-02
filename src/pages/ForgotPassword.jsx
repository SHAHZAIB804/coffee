import { Link } from "react-router-dom";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(217,166,104,0.24),_transparent_35%),linear-gradient(135deg,#1d120d_0%,#3e2b21_45%,#744e38_100%)] px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-white/90 shadow-[0_30px_80px_rgba(17,9,7,0.35)] backdrop-blur-sm">
        <div className="bg-[#1d120d] px-8 pb-8 pt-10 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0d7b9] text-3xl text-[#1d120d]">🔒</div>
          <h1 className="text-3xl font-black">Reset password</h1>
          <p className="mt-2 text-sm text-[#d8c5b6]">We’ll send reset instructions</p>
        </div>

        <div className="px-8 py-8">
          {submitted ? (
            <div className="text-center">
              <p className="text-lg font-semibold text-[#2a1d17]">Check your email.</p>
              <p className="mt-3 text-[#5f4a42]">A password reset link has been sent to {email}.</p>
              <Link to="/" className="mt-6 inline-block rounded-full bg-[#d9a668] px-5 py-3 font-semibold text-[#1d120d]">
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#2a1d17]">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-[#e6d6c8] bg-[#fffaf6] px-4 py-3 outline-none focus:border-[#d9a668]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#d9a668] px-4 py-3 font-semibold text-[#1d120d] transition hover:bg-[#e4b677]"
              >
                Send reset link
              </button>

              <div className="text-center text-sm text-[#7a6155]">
                Remembered it? <Link to="/" className="font-semibold text-[#5c4033]">Login</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
