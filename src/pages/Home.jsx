import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import CoffeeCard from "../components/CoffeeCard";
import coffeeData from "../data/coffeeData";

export default function Home() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="overflow-hidden bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Hero Section */}
      <Hero />

      <AnimatePresence>
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          {/* Heading */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              Our Signature Blends
            </h2>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto">
              Handcrafted with premium beans and perfected over years of passion.
            </p>
          </motion.div>

          {/* Coffee Grid (using coffeeData file) */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            {coffeeData.map((coffee) => (
              <motion.div
                key={coffee.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <CoffeeCard coffee={coffee} />
              </motion.div>
            ))}
          </motion.div>

          {/* View Full Menu Button */}
          <motion.div variants={itemVariants} className="text-center mt-16">
            <Link
              to="/menu"
              className="inline-block bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-amber-500/30 transition-all"
            >
              View Full Menu
            </Link>
          </motion.div>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
