import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaLeaf } from "react-icons/fa";

export default function Footer() {
  const socialLinks = [
    { icon: <FaFacebookF />, href: "#" },
    { icon: <FaInstagram />, href: "#" },
    { icon: <FaTwitter />, href: "#" },
  ];

  return (
    <footer className="bg-[#1d120d] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="mb-6 flex items-center gap-3 text-2xl font-bold">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0d7b9] text-[#1d120d]">
                <FaLeaf />
              </span>
              <span>Coffee Hub</span>
            </Link>
            <p className="max-w-xs text-[#d8c5b6]">
              Premium coffee experiences designed for mindful mornings and meaningful gatherings.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  aria-label="Social media"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-[#d9a668] hover:text-[#d9a668]"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">Explore</h3>
            <ul className="space-y-3 text-[#d8c5b6]">
              {[
                ["Home", "/"],
                ["Menu", "/menu"],
                ["Shop", "/shop"],
                ["Blog", "/blog"],
                ["Contact", "/contact"],
                ["FAQs", "/faqs"],
                ["Orders", "/orders"],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="transition hover:text-[#d9a668]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">Visit Us</h3>
            <ul className="space-y-4 text-[#d8c5b6]">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-[#d9a668]" />
                <span>Mandi Bahauddin, Punjab, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-[#d9a668]" />
                <a href="tel:+923170789020" className="hover:text-[#d9a668]">+92 317 0789020</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-[#d9a668]" />
                <a href="mailto:hello@coffeehub.com" className="hover:text-[#d9a668]">hello@coffeehub.com</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">Helpful links</h3>
            <ul className="space-y-3 text-[#d8c5b6]">
              <li><Link to="/privacy" className="transition hover:text-[#d9a668]">Privacy policy</Link></li>
              <li><Link to="/terms" className="transition hover:text-[#d9a668]">Terms & conditions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">Newsletter</h3>
            <p className="mb-4 text-[#d8c5b6]">Get first access to seasonal roasts and exclusive offers.</p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-[#d8c5b6] outline-none ring-0 transition focus:border-[#d9a668]"
              />
              <button type="submit" className="w-full rounded-full bg-[#d9a668] px-4 py-3 font-semibold text-[#1d120d] transition hover:bg-[#e4b677]">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-[#d8c5b6]">
          © {new Date().getFullYear()} Coffee Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}