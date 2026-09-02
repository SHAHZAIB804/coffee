export default function Contact() {
  return (
    <div className="bg-[#fffaf6] text-[#2a1d17]">
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[30px] bg-[#1d120d] p-8 text-white shadow-[0_30px_80px_rgba(42,29,23,0.2)] sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d9a668]">Contact</p>
            <h1 className="mt-4 text-4xl font-black">Let’s brew something great.</h1>
            <p className="mt-5 text-[#d8c5b6]">
              Whether you want a café consultation, catering, or just a coffee chat, our team is here to help.
            </p>

            <div className="mt-8 space-y-5 text-[#f2e7dd]">
              <div>
                <div className="text-sm uppercase tracking-[0.18em] text-[#d9a668]">Visit us</div>
                <div className="mt-1 text-lg">Mandi Bahauddin, Punjab, Pakistan</div>
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.18em] text-[#d9a668]">Call</div>
                <div className="mt-1 text-lg">+92 317 0789020</div>
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.18em] text-[#d9a668]">Email</div>
                <div className="mt-1 text-lg">hello@coffeehub.com</div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-[#f0e7df] bg-white p-8 shadow-[0_18px_38px_rgba(95,75,61,0.05)] sm:p-10">
            <form className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#2a1d17]">Name</label>
                  <input type="text" placeholder="Your name" className="w-full rounded-xl border border-[#e6d6c8] bg-[#fffaf6] px-4 py-3 outline-none focus:border-[#d9a668]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#2a1d17]">Email</label>
                  <input type="email" placeholder="you@example.com" className="w-full rounded-xl border border-[#e6d6c8] bg-[#fffaf6] px-4 py-3 outline-none focus:border-[#d9a668]" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#2a1d17]">Subject</label>
                <input type="text" placeholder="How can we help?" className="w-full rounded-xl border border-[#e6d6c8] bg-[#fffaf6] px-4 py-3 outline-none focus:border-[#d9a668]" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#2a1d17]">Message</label>
                <textarea rows="5" placeholder="Tell us more..." className="w-full resize-none rounded-xl border border-[#e6d6c8] bg-[#fffaf6] px-4 py-3 outline-none focus:border-[#d9a668]" />
              </div>

              <button type="submit" className="w-full rounded-full bg-[#5c4033] px-4 py-3 font-semibold text-white transition hover:bg-[#442d25]">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

