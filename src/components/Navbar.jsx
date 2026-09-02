// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { FiMenu, FiX } from 'react-icons/fi';
// import { motion, AnimatePresence } from 'framer-motion';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 10) {
//         setScrolled(true);
//       } else {
//         setScrolled(false);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const mobileMenuVariants = {
//     hidden: { opacity: 0, y: -20 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2
//       }
//     }
//   };

//   const menuItemVariants = {
//     hidden: { opacity: 0, y: -10 },
//     visible: { opacity: 1, y: 0 }
//   };

//   return (
//     <nav className={`fixed w-full z-50 transition-all duration-300 ${
//       scrolled 
//         ? 'bg-white shadow-lg text-coffee-dark' 
//         : 'bg-coffee-dark text-white'
//     }`}>
//       <div className="container mx-auto px-4 py-3">
//         <div className="flex justify-between items-center">
//           {/* Logo/Brand */}
//           <Link 
//             to="/" 
//             className="text-2xl font-bold flex items-center"
//           >
//             <span className={`mr-2 ${
//               scrolled ? 'text-coffee-dark' : 'text-coffee-light'
//             }`}>☕</span>
//             <span className={`${
//               scrolled 
//                 ? 'text-coffee-dark' 
//                 : 'bg-gradient-to-r from-coffee-light to-coffee-gold bg-clip-text text-transparent'
//             }`}>
//               Brew Haven
//             </span>
//           </Link>
          
//           {/* Desktop Navigation */}
//           <div className="hidden md:flex space-x-8">
//             {['Home', 'Menu', 'Shop', 'Blog', 'Contact'].map((item) => (
//               <Link
//                 key={item}
//                 to={`/${item.toLowerCase()}`}
//                 className={`relative group px-2 py-1 transition-colors duration-300 ${
//                   scrolled 
//                     ? 'text-coffee-dark hover:text-coffee-medium' 
//                     : 'text-coffee-light hover:text-white'
//                 }`}
//               >
//                 {item}
//                 <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${
//                   scrolled ? 'bg-coffee-medium' : 'bg-coffee-light'
//                 } group-hover:w-full transition-all duration-300`}></span>
//               </Link>
//             ))}
//           </div>

//           {/* Mobile Menu Button */}
//           <button 
//             className={`md:hidden text-2xl p-2 rounded-lg transition-colors duration-200 focus:outline-none ${
//               scrolled 
//                 ? 'hover:bg-gray-100 focus:ring-coffee-medium' 
//                 : 'hover:bg-coffee-darker focus:ring-coffee-light'
//             }`}
//             onClick={() => setIsOpen(!isOpen)}
//             aria-label="Toggle menu"
//           >
//             {isOpen ? (
//               <FiX className={scrolled ? 'text-coffee-dark' : 'text-coffee-light'} />
//             ) : (
//               <FiMenu className={scrolled ? 'text-coffee-dark' : 'text-coffee-light'} />
//             )}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         <AnimatePresence>
//           {isOpen && (
//             <motion.div
//               initial="hidden"
//               animate="visible"
//               exit="hidden"
//               variants={mobileMenuVariants}
//               className={`md:hidden rounded-lg mt-2 p-4 shadow-xl ${
//                 scrolled ? 'bg-dark' : 'bg-coffee-darker'
//               }`}
//             >
//               {['Home', 'Menu', 'Shop', 'Blog', 'Contact'].map((item) => (
//                 <motion.div
//                   key={item}
//                   variants={menuItemVariants}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <Link
//                     to={`/${item.toLowerCase()}`}
//                     className={`block py-3 px-4 rounded-md transition-colors duration-200 ${
//                       scrolled
//                         ? 'text-coffee-dark hover:bg-gray-100'
//                         : 'text-coffee-dark hover:bg-coffee-dark hover:text-white'
//                     }`}
//                     onClick={() => setIsOpen(false)}
//                   >
//                     {item}
//                   </Link>
//                 </motion.div>
//               ))}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



///////////////////////////////////


import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiMenu, FiX, FiShoppingCart, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-[#fffaf4]/90 shadow-[0_10px_30px_rgba(47,31,25,0.08)] backdrop-blur-md' : 'bg-[#1d120d] text-white'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${scrolled ? 'bg-[#f8efe7] text-[#5c4033]' : 'bg-[#f0d7b9] text-[#1d120d]'}`}>
              ☕
            </span>
            <span className={scrolled ? 'text-[#2a1d17]' : 'text-white'}>Coffee Hub</span>
          </Link>
        </motion.div>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <motion.div key={link.name} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to={link.path}
                  className={`relative px-2 py-1 text-sm font-medium transition ${
                    isActive ? 'text-[#d9a668]' : scrolled ? 'text-[#5c4033] hover:text-[#2a1d17]' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#d9a668] transition-all ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className={`flex items-center gap-2 rounded-full border px-3 py-2 ${scrolled ? 'border-[#e7d7c7] bg-[#f7efe8]' : 'border-white/15 bg-white/5'}`}>
            <FiSearch className={scrolled ? 'text-[#7a6155]' : 'text-white/80'} />
            <input
              aria-label="Search coffee"
              type="text"
              placeholder="Search"
              className={`w-28 bg-transparent text-sm placeholder:text-current outline-none ${scrolled ? 'text-[#2a1d17] placeholder:text-[#8a6a5e]' : 'text-white placeholder:text-white/60'}`}
            />
          </div>

          <Link
            to="/cart"
            className={`relative flex items-center justify-center rounded-full p-3 transition ${scrolled ? 'bg-[#f7efe8] text-[#2a1d17]' : 'bg-white/10 text-white'} hover:scale-105`}
            aria-label="Shopping cart"
          >
            <FiShoppingCart className="text-xl" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#d97706] text-[10px] font-bold text-white"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>

          <Link
            to="/profile"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${scrolled ? 'bg-[#f7efe8] text-[#2a1d17] hover:bg-[#efe1d4]' : 'bg-white/10 text-white hover:bg-white/15'}`}
          >
            Profile
          </Link>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${scrolled ? 'bg-[#f7efe8] text-[#2a1d17] hover:bg-[#efe1d4]' : 'bg-white/10 text-white hover:bg-white/15'}`}
            >
              Logout
            </button>
          )}
        </div>

        <motion.button
          className={`rounded-full p-2 md:hidden ${scrolled ? 'bg-[#f7efe8] text-[#2a1d17]' : 'bg-white/10 text-white'}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="border-t border-white/10 bg-[#1d120d] px-4 py-4 md:hidden"
          >
            {navLinks.map((link) => (
              <motion.div key={link.name} variants={menuItemVariants} className="mb-2">
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-base font-medium ${
                    location.pathname === link.path ? 'bg-white/10 text-[#d9a668]' : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            <motion.div variants={menuItemVariants} className="mt-3">
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#d9a668] px-4 py-3 font-semibold text-[#1d120d]"
              >
                <FiShoppingCart />
                Cart {totalItems > 0 ? `(${totalItems})` : ''}
              </Link>
            </motion.div>

            {onLogout && (
              <motion.div variants={menuItemVariants} className="mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full rounded-xl border border-white/15 px-4 py-3 font-semibold text-white"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}