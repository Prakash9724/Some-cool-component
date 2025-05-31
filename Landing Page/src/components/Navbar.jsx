import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navVariants = {
    hidden: { opacity: 0, y: -25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  const linkVariants = {
    hover: {
      scale: 1.03,
      color: 'var(--text-color)', // Use CSS variable for consistency
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.97,
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.03,
      backgroundColor: 'var(--accent-hover)', // Use CSS variable
      boxShadow: '0px 5px 15px rgba(34, 197, 94, 0.4)',
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.97,
      boxShadow: '0px 2px 8px rgba(34, 197, 94, 0.3)',
    }
  };

  const navLinks = ['Blog', 'Pricing', 'Login'];

  return (
    <motion.nav
      className="navbar"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="navbar-container">
        <motion.div className="logo" variants={linkVariants} whileHover="hover" whileTap="tap">
          <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
            A0.dev
          </a>
        </motion.div>

        <div className="mobile-menu-btn">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        <motion.div className={`nav-links-container ${isOpen ? 'mobile-open' : ''}`}>
          {navLinks.map((link) => (
            <motion.a 
              href="#" 
              key={link} 
              variants={linkVariants} 
              whileHover="hover" 
              whileTap="tap"
              className="nav-link-item"
            >
              {link}
            </motion.a>
          ))}
          <motion.button
            className="get-started-btn"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;