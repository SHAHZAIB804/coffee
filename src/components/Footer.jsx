

import { Link } from "react-router-dom"
import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaLeaf } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-coffee-800 to-coffee-900 text-white pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2">
              <FaLeaf className="text-3xl text-coffee-200" />
              <span className="text-2xl font-bold text-white">
                Waffels
              </span>
            </Link>
            <p className="text-coffee-200 leading-relaxed">
              Coffee experiences since 2015.
            </p>
            
            <div className="flex gap-4 pt-2">
              {[
                { icon: <FaFacebook className="w-5 h-5" />, url: "#" },
                { icon: <FaInstagram className="w-5 h-5" />, url: "#" },
                { icon: <FaTwitter className="w-5 h-5" />, url: "#" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.url} 
                  className="p-2 bg-coffee-700 hover:bg-coffee-600 rounded-full transition-all hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-5 text-white flex items-center gap-2">
              <span className="w-3 h-3 bg-coffee-300 rounded-full"></span>
              Explore
            </h3>
            <ul className="space-y-3">
              {[
                { path: "/", name: "Home" },
                { path: "/menu", name: "Our Menu" },
                { path: "/shop", name: "Shop" },
                { path: "/blog", name: "Blog" },
                { path: "/contact", name: "Contact" }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-coffee-200 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-coffee-300 rounded-full"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-5 text-white flex items-center gap-2">
              <span className="w-3 h-3 bg-coffee-300 rounded-full"></span>
              Visit Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="p-2 bg-coffee-700 rounded-lg">
                  <FaMapMarkerAlt className="text-coffee-200" />
                </div>
                <div>
                  <p className="font-medium">Mandi Bahauddin</p>
                  <p className="text-coffee-200">Pakistan,Mamdi Bahauddin</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-coffee-700 rounded-lg">
                  <FaPhone className="text-coffee-200" />
                </div>
                <a href="tel:+923170789020" className="hover:text-white">
                  +92 317 0789020
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-coffee-700 rounded-lg">
                  <FaEnvelope className="text-coffee-200" />
                </div>
                <a href="mailto:hello@brewhaven.com" className="hover:text-white">
                  hello@waffels.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-5 text-white flex items-center gap-2">
              <span className="w-3 h-3 bg-coffee-300 rounded-full"></span>
              Newsletter
            </h3>
            <p className="text-coffee-200 mb-5">
              Join our newsletter for special offers.
            </p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full px-4 py-3 rounded-lg bg-coffee-700 border border-coffee-600 text-white placeholder-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-400"
              />
              <button 
                type="submit" 
                className="w-full bg-coffee-600 hover:bg-coffee-700 text-white py-3 px-6 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-coffee-700 text-center">
          <p className="text-coffee-300">
            © {new Date().getFullYear()} Waffels. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}