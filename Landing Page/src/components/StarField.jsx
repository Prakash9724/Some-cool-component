import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const StarField = () => {
  const [stars, setStars] = useState([]);
  const [meteoroids, setMeteoroids] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Generate random stars and meteoroids
  useEffect(() => {
    if (!containerRef.current) return;

    const { clientWidth, clientHeight } = containerRef.current;

    const generateStars = () => {
      const starCount = Math.floor((clientWidth * clientHeight) / 8000); // Adjust density
      const newStars = [];
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: `star-${i}`,
          x: Math.random() * clientWidth,
          y: Math.random() * clientHeight,
          size: Math.random() * 1.5 + 0.5, // Size between 0.5-2px
          opacity: Math.random() * 0.4 + 0.2, // Opacity between 0.2-0.6
          blinkDuration: Math.random() * 4 + 3, // Blink duration between 3-7s
        });
      }
      setStars(newStars);
    };

    const generateMeteoroids = () => {
      const meteoroidCount = 5; // Number of meteoroids
      const newMeteoroids = [];
      for (let i = 0; i < meteoroidCount; i++) {
        const startX = Math.random() * clientWidth;
        const startY = Math.random() * clientHeight * 0.5; // Start from top half
        const angle = Math.random() * (Math.PI / 4) + Math.PI / 8; // Angle between 22.5 and 67.5 degrees
        const speed = Math.random() * 50 + 50; // Speed of meteoroid
        newMeteoroids.push({
          id: `meteoroid-${i}`,
          startX,
          startY,
          angle,
          speed,
          size: Math.random() * 2 + 1, // Size of meteoroid head
          tailLength: Math.random() * 100 + 50, // Length of tail
          duration: (clientHeight * 1.5) / speed, // Duration to cross screen
          delay: Math.random() * 10, // Random delay for staggered appearance
        });
      }
      setMeteoroids(newMeteoroids);
    };

    generateStars();
    generateMeteoroids();

    const handleResize = () => {
      generateStars();
      generateMeteoroids();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  return (
    <div
      ref={containerRef}
      className="starfield-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: -1,
        background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
      }}
    >
      {stars.map((star) => {
        const distance = getDistance(star.x, star.y, mousePosition.x, mousePosition.y);
        const isNearMouse = distance < 70; // Hover effect radius
        const scale = isNearMouse ? 1.8 : 1;
        const glowOpacity = isNearMouse ? 0.9 : star.opacity;

        return (
          <motion.div
            key={star.id}
            style={{
              position: 'absolute',
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              zIndex: 1,
            }}
            animate={{
              scale: isNearMouse ? 1.8 : 1,
              opacity: isNearMouse ? 1 : star.opacity,
              boxShadow: isNearMouse
                ? `0 0 ${star.size * 3}px rgba(255, 255, 220, 0.7)`
                : `0 0 ${star.size * 1.5}px rgba(255, 255, 255, ${star.opacity * 0.1})`,
            }}
            transition={{
              // For hover effect (isNearMouse)
              scale: { duration: 0.2, ease: "easeOut" },
              opacity: { duration: 0.2, ease: "easeOut" },
              boxShadow: { duration: 0.2, ease: "easeOut" },
              // For blinking effect (when not near mouse)
              default: {
                duration: star.blinkDuration,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
                delay: star.blinkDelay,
              }
            }}
          />
        );
      })}
      {meteoroids.map((meteor) => (
        <motion.div
          key={meteor.id}
          style={{
            position: 'absolute',
            left: meteor.startX,
            top: meteor.startY,
            width: meteor.size,
            height: meteor.size,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 220, 0.8)', // Brighter head
            boxShadow: `0 0 10px 2px rgba(255, 255, 220, 0.5)`,
            zIndex: 2, // Above stars
          }}
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 0 
          }}
          animate={{
            x: [0, Math.cos(meteor.angle) * containerRef.current?.clientHeight * 1.5], // Move across screen
            y: [0, Math.sin(meteor.angle) * containerRef.current?.clientHeight * 1.5],
            opacity: [0, 1, 1, 0], // Fade in and out
          }}
          transition={{
            duration: meteor.duration,
            repeat: Infinity,
            repeatDelay: Math.random() * 2 + 1, // Reduced gap: Time between meteor appearances (1-3s)
            ease: 'linear',
            delay: meteor.delay,
          }}
        >
          {/* Meteor Tail */}
          <motion.div
            style={{
              position: 'absolute',
              left: '50%', // Center the tail relative to the meteor head
              top: '50%',
              width: '2px', // Tail thickness
              height: meteor.tailLength,
              background: `linear-gradient(to top, transparent, rgba(255, 255, 220, 0.4))`,
              transformOrigin: '50% 0%', // Rotate around the top-center of the tail
              // Calculate rotation based on meteor's angle. Add 90 degrees because tail points 'up' by default.
              transform: `translate(-50%, 0%) rotate(${meteor.angle * (180 / Math.PI) + 90}deg)`,
              opacity: 0.8,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default StarField;