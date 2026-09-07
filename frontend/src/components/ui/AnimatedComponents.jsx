import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
void motion;

const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Magnetic Button with 3D effect
export function MagneticButton({ children, className = "", ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`btn-magnetic btn-ripple ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// 3D Tilt Card
export function TiltCard({ children, className = "", intensity = 10, ...props }) {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    setRotateX((-mouseY / (rect.height / 2)) * intensity);
    setRotateY((mouseX / (rect.width / 2)) * intensity);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
        scale: isHovering ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className={className}
      {...props}
    >
      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        animate={{ translateZ: isHovering ? 20 : 0 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Animated Container with stagger
export function StaggerContainer({ children, className = "", delay = 0.1, ...props }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: delay, delayChildren: 0.1 },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "", ...props }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { type: "spring", stiffness: 300, damping: 24 },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Page Transition Wrapper
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Floating Animation
export function FloatingElement({ children, className = "", duration = 3, y = 10, ...props }) {
  return (
    <motion.div
      animate={{ y: [-y, y, -y] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Glow Pulse
export function GlowPulse({ children, className = "", color = "#00f0ff", ...props }) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 20px ${color}40, 0 0 40px ${color}20`,
          `0 0 40px ${color}60, 0 0 80px ${color}30`,
          `0 0 20px ${color}40, 0 0 40px ${color}20`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Typing Animation for AI Responses
export function TypingText({ text, speed = 20, onComplete, className = "" }) {
  useEffect(() => {
    if (!onComplete) return;
    const timer = setTimeout(() => onComplete(), Math.max(speed, 0));
    return () => clearTimeout(timer);
  }, [text, speed, onComplete]);

  return <span className={className}>{text}</span>;
}

// Animated Border
export function AnimatedBorder({ children, className = "", ...props }) {
  return (
    <div className={`relative ${className}`} {...props}>
      <motion.div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        style={{
          background: "linear-gradient(90deg, #00f0ff, #a855f7, #ec4899, #00f0ff)",
          backgroundSize: "300% 100%",
          padding: "2px",
          borderRadius: "inherit",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        animate={{ backgroundPosition: ["0% 50%", "300% 50%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      {children}
    </div>
  );
}

// Shimmer Loading
export function ShimmerLoader({ className = "" }) {
  return (
    <motion.div
      className={`bg-gradient-to-r from-[rgba(0,240,255,0.1)] via-[rgba(168,85,247,0.2)] to-[rgba(0,240,255,0.1)] ${className}`}
      style={{ backgroundSize: "200% 100%" }}
      animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
  );
}

// Orbital Loader
export function OrbitalLoader({ size = 40, className = "" }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00f0ff]"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute rounded-full border-2 border-transparent border-r-[#a855f7]"
        style={{ inset: size * 0.15 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute rounded-full bg-[#00f0ff]"
        style={{
          width: size * 0.15,
          height: size * 0.15,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  );
}

// Reveal on Scroll
export function RevealOnScroll({ children, className = "", direction = "up" }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const variants = {
    up: { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Particle Background
export function ParticleField({ count = 30 }) {
  const particles = Array.from({ length: count }, (_, i) => {
    const seed = i + 1;
    return {
      id: i,
      x: seededRandom(seed) * 100,
      delay: seededRandom(seed + 100) * 10,
      duration: 10 + seededRandom(seed + 200) * 10,
      size: 2 + seededRandom(seed + 300) * 3,
      hue: 180 + seededRandom(seed + 400) * 60,
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: `hsl(${p.hue}, 100%, 70%)`,
            filter: "blur(1px)",
          }}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
