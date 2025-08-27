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
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiMenu, FiX, FiShoppingCart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();

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
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-lg text-coffee-800' 
        : 'bg-coffee-900 text-white'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to="/" 
              className="text-2xl font-bold flex items-center"
            >
              <span className={`mr-2 ${
                scrolled ? 'text-coffee-800' : 'text-coffee-200'
              }`}>☕</span>
              <span className={scrolled ? 'text-coffee-800' : 'text-white'}>
                Waffels
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.path}
                  className={`relative group px-2 py-1 transition-colors ${
                    scrolled ? 'hover:text-coffee-600' : 'hover:text-coffee-300'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${
                    scrolled ? 'bg-coffee-600' : 'bg-coffee-300'
                  } group-hover:w-full transition-all duration-300`}></span>
                </Link>
              </motion.div>
            ))}

            {/* Cart Icon */}
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative ml-4"
            >
              <Link to="/cart" className="p-2">
                <FiShoppingCart className="text-xl" />
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-2xl p-2 rounded-lg focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
              className={`md:hidden rounded-lg mt-2 p-4 shadow-xl ${
                scrolled ? 'bg-white' : 'bg-coffee-800'
              }`}
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.name}
                  variants={menuItemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={link.path}
                    className={`block py-3 px-4 rounded-md transition-colors ${
                      scrolled ? 'text-coffee-800 hover:bg-gray-100' : 'text-white hover:bg-coffee-700'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Cart Link */}
              <motion.div
                variants={menuItemVariants}
                className="flex items-center py-3 px-4"
              >
                <Link
                  to="/cart"
                  className={`flex items-center ${
                    scrolled ? 'text-coffee-800' : 'text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <FiShoppingCart className="mr-2" />
                  Cart {totalItems > 0 && `(${totalItems})`}
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}