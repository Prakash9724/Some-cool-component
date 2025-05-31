import { motion } from 'framer-motion';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: '#4ade80', // Corresponds to --accent-hover
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
    }
  };

  return (
    <motion.div
      className="hero-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="hero-title" variants={itemVariants}>
        Text to App in <span className="gradient-text">Minutes</span>
      </motion.h1>
      
      <motion.p className="hero-subtitle" variants={itemVariants}>
        We help your idea come to life with speed and AI.
      </motion.p>
      
      <motion.div className="input-group" variants={itemVariants}>
        <input 
          type="text" 
          placeholder="Describe your app idea..." 
          className="app-input"
        />
        <motion.button 
          className="generate-btn"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Generate App
        </motion.button>
      </motion.div>
      <motion.p className="hero-tagline" variants={itemVariants}>
        No coding required • AI-powered • Deploy instantly
      </motion.p>
    </motion.div>
  );
};

export default Hero;