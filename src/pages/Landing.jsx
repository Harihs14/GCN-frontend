import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
  useMotionValue,
  useSpring as useFramerSpring,
} from "framer-motion";
import { useSpring, animated, config } from "@react-spring/web";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaShieldAlt,
  FaBookOpen,
  FaChartLine,
  FaRocket,
  FaPlayCircle,
  FaLock,
  FaBolt,
  FaFingerprint,
  FaCode,
  FaServer,
  FaDatabase,
} from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import gsap from "gsap";
import { useInView } from "react-intersection-observer";
import Tilt from "react-parallax-tilt";
import logo from "../assets/wlogo.png";

// Unique cyber-themed cursor
const CyberCursor = () => {
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);
  const mousePosition = useMotionValue({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e) => {
      mousePosition.set({ x: e.clientX, y: e.clientY });
      if (cursorRef.current && cursorRingRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
        });
        gsap.to(cursorRingRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
        });
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mousePosition]);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-4 h-4 rounded-full bg-cyan-500 mix-blend-screen pointer-events-none z-50 opacity-80"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <div
        ref={cursorRingRef}
        className="fixed w-10 h-10 rounded-full border-2 border-cyan-400 pointer-events-none z-50 opacity-40"
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </>
  );
};

// Geometric neon grid background
const CyberGrid = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
      {/* Horizontal lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`h-line-${i}`}
          className="absolute h-px left-0 right-0 bg-gradient-to-r from-transparent via-cyan-600 to-transparent"
          style={{ top: `${(i + 1) * 5}%` }}
          initial={{ opacity: 0.05, scaleX: 0.3 }}
          animate={{
            opacity: [0.05, 0.2, 0.05],
            scaleX: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 10 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Vertical lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`v-line-${i}`}
          className="absolute w-px top-0 bottom-0 bg-gradient-to-b from-transparent via-magenta-600 to-transparent"
          style={{ left: `${(i + 1) * 5}%` }}
          initial={{ opacity: 0.05, scaleY: 0.3 }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
            scaleY: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 12 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Cyber particles effect with scanning animation
const CyberParticles = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Data particles */}
      {Array.from({ length: 80 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor:
              i % 3 === 0
                ? "rgba(6, 182, 212, 0.7)" // cyan
                : i % 3 === 1
                ? "rgba(232, 121, 249, 0.7)" // fuchsia
                : "rgba(255, 255, 255, 0.7)", // white
            boxShadow:
              i % 3 === 0
                ? "0 0 8px rgba(6, 182, 212, 0.7)"
                : i % 3 === 1
                ? "0 0 8px rgba(232, 121, 249, 0.7)"
                : "0 0 8px rgba(255, 255, 255, 0.7)",
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            repeatDelay: Math.random() * 5,
          }}
        />
      ))}

      {/* Scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(6,182,212,0) 0%, rgba(6,182,212,0.8) 50%, rgba(6,182,212,0) 100%)",
          boxShadow: "0 0 20px 5px rgba(6,182,212,0.5)",
        }}
        animate={{
          top: ["0%", "100%", "0%"],
        }}
        transition={{
          duration: 15,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </div>
  );
};

// Glitchy cyber text effect
const GlitchText = ({ text, className, delay = 0 }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 5000 + delay);

    return () => clearInterval(interval);
  }, [delay]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className={isGlitching ? "opacity-30" : "opacity-100"}>{text}</span>

      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 w-full h-full text-cyan-400 inline-block"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
              transform: "translate(-5px, 0)",
              opacity: 0.8,
            }}
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 w-full h-full text-fuchsia-400 inline-block"
            style={{
              clipPath: "polygon(0 45%, 100% 45%, 100% 100%, 0 100%)",
              transform: "translate(5px, 0)",
              opacity: 0.8,
            }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
};

// Hexagon component for the feature cards
const Hexagon = ({ children, className, glowColor = "cyan" }) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute inset-0 ${
          glowColor === "cyan" ? "bg-cyan-900/10" : "bg-fuchsia-900/10"
        } blur-lg`}
      ></div>
      <div
        className={`relative w-full h-full flex items-center justify-center p-2
                   bg-gray-900/80 backdrop-blur-md border-b-2 ${
                     glowColor === "cyan"
                       ? "border-cyan-700"
                       : "border-fuchsia-700"
                   }`}
        style={{
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

const FloatingParticles = () => {
  // ... (keep previous particle implementation)
};

const AnimatedFeatureCard = ({ icon, title, description, delay }) => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      scale={1.05}
      transitionSpeed={300}
      glareEnable={true}
      glareMaxOpacity={0.1}
      glarePosition="all"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border-2 border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <motion.div className="relative z-10" whileHover={{ scale: 1.02 }}>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </motion.div>
      </motion.div>
    </Tilt>
  );
};

const InteractiveHeroText = () => {
  const letters = "Compliance Made Simple".split("");
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.from(containerRef.current.children, {
      duration: 1.2,
      y: 100,
      opacity: 0,
      ease: "power4.out",
      stagger: 0.05,
      delay: 0.3,
    });
  }, []);

  return (
    <div ref={containerRef} className="flex flex-wrap justify-center gap-x-3">
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 inline-block"
          whileHover={{ y: -15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  );
};

// New component for animated background shapes
const AnimatedShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          initial={{
            opacity: 0.1 + Math.random() * 0.2,
            scale: 0.8 + Math.random() * 0.5,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
          }}
          animate={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            opacity: 0.1 + Math.random() * 0.3,
            scale: 0.8 + Math.random() * 0.6,
          }}
          transition={{
            duration: 15 + Math.random() * 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${150 + Math.random() * 300}px`,
            height: `${150 + Math.random() * 300}px`,
            background: `radial-gradient(circle, rgba(59, 130, 246, ${
              0.1 + Math.random() * 0.1
            }) 0%, rgba(16, 23, 42, 0) 70%)`,
          }}
        />
      ))}
    </div>
  );
};

// Split text animation component
const SplitTextAnimation = ({ text, className }) => {
  const characters = Array.from(text);

  return (
    <div className={`${className} inline-block overflow-hidden`}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.3 + index * 0.04,
            ease: [0.33, 1, 0.68, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};

// Interactive card feature component
const FeatureHighlight = ({ icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 + index * 0.2 }}
      className="relative p-4 md:p-5 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 flex items-center group hover:border-blue-500/50 transition-all duration-300"
    >
      <div className="mr-4 w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-white font-medium leading-tight">{title}</h3>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>
    </motion.div>
  );
};

// Dynamic 3D stars background - replacing the previous Canvas/Stars implementation
const DynamicBackground = () => {
  return (
    <>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#101834] to-[#0a0a0a] opacity-90" />

      {/* Custom stars implementation that doesn't interfere with navbar */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: `rgba(255, 255, 255, ${
                Math.random() * 0.5 + 0.3
              })`,
              boxShadow: `0 0 ${
                Math.random() * 4 + 2
              }px rgba(255, 255, 255, 0.8)`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Animated nebula effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`nebula-${i}`}
            className="absolute rounded-full opacity-10"
            style={{
              background:
                i % 2 === 0
                  ? `radial-gradient(ellipse at center, rgba(56,189,248,0.3) 0%, rgba(16,24,64,0) 70%)`
                  : `radial-gradient(ellipse at center, rgba(124,58,237,0.3) 0%, rgba(16,24,64,0) 70%)`,
              width: `${Math.random() * 60 + 40}vw`,
              height: `${Math.random() * 60 + 40}vh`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 40 - 20],
              y: [0, Math.random() * 40 - 20],
              opacity: [0.05, 0.12, 0.05],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </>
  );
};

// Modern particles animation with connection lines
const NetworkParticles = () => {
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Generate particles
    const particlesCount = window.innerWidth < 768 ? 15 : 30;
    const newParticles = Array.from({ length: particlesCount }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      velocityX: (Math.random() - 0.5) * 0.15,
      velocityY: (Math.random() - 0.5) * 0.15,
    }));

    setParticles(newParticles);

    // Animation frame for movement
    let animationFrame;
    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((p) => ({
          ...p,
          x: (p.x + p.velocityX + 100) % 100,
          y: (p.y + p.velocityY + 100) % 100,
        }))
      );
      animationFrame = requestAnimationFrame(animateParticles);
    };

    animationFrame = requestAnimationFrame(animateParticles);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Find particles that are close enough to connect with a line
  const connections = [];
  const connectionDistance = 20; // percentage of screen

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];

      // Calculate distance between particles
      const dx = Math.abs(p1.x - p2.x);
      const dy = Math.abs(p1.y - p2.y);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        // Calculate opacity based on distance (closer = more visible)
        const opacity = 1 - distance / connectionDistance;
        connections.push({ p1, p2, opacity });
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-10"
    >
      {/* Lines connecting particles */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((conn, i) => (
          <line
            key={`line-${i}`}
            x1={`${conn.p1.x}%`}
            y1={`${conn.p1.y}%`}
            x2={`${conn.p2.x}%`}
            y2={`${conn.p2.y}%`}
            stroke={`rgba(59, 130, 246, ${conn.opacity * 0.2})`}
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full bg-blue-400"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            boxShadow: `0 0 ${particle.size}px rgba(59, 130, 246, 0.8)`,
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

const Landing = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Dynamic transforms
  const y = useTransform(heroScroll, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const scale = useTransform(heroScroll, [0, 0.8], [1, 0.9]);

  // Stats counter with animation
  const [count, setCount] = useState({
    companies: 0,
    compliance: 0,
    savings: 0,
  });
  const statsInViewRef = useRef(null);
  const isStatsInView = useInView(statsInViewRef, { triggerOnce: true });

  useEffect(() => {
    if (isStatsInView) {
      const interval = setInterval(() => {
        setCount((prev) => ({
          companies: prev.companies >= 200 ? 200 : prev.companies + 5,
          compliance: prev.compliance >= 99 ? 99 : prev.compliance + 2,
          savings: prev.savings >= 80 ? 80 : prev.savings + 2,
        }));
      }, 30);

      return () => clearInterval(interval);
    }
  }, [isStatsInView]);

  return (
    <div className="min-h-screen bg-black text-white font-inter relative overflow-hidden">
      {/* Custom cursor */}
      <CyberCursor />

      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-600 via-fuchsia-600 to-cyan-600 origin-left z-50"
        style={{ scaleX, filter: "drop-shadow(0 0 8px #0891b2)" }}
      />

      {/* Background elements */}
      <div className="fixed inset-0 bg-gradient-to-t from-black via-slate-950 to-black opacity-90" />
      <CyberGrid />
      <CyberParticles />

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px",
        }}
      />

      <header className="fixed w-full z-40">
        <div
          className="flex justify-between items-center py-6 px-8 lg:px-20 backdrop-blur-lg bg-black/20"
          style={{
            borderBottom: "1px solid rgba(6, 182, 212, 0.2)",
            boxShadow: "0 4px 20px rgba(6, 182, 212, 0.1)",
          }}
        >
          <div className="flex items-center gap-3 relative">
            {/* Logo glitch effect */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 relative"
            >
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-lg animate-pulse" />
              <img
                src={logo}
                alt="GCN Logo"
                className="w-12 h-12 relative z-10 hover:rotate-180 transition-transform duration-500"
              />
              <motion.div
                className="absolute top-0 left-0 w-12 h-12 rounded-full border border-cyan-400"
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(6,182,212,0.5)",
                    "0 0 15px rgba(6,182,212,0.8)",
                    "0 0 0px rgba(6,182,212,0.5)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>

            <h1 className="text-2xl font-bold">
              <GlitchText
                text="GCN"
                className="font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400"
              />
            </h1>
          </div>

          <nav className="hidden md:flex gap-8 items-center">
            {[
              { name: "Features", href: "#features" },
              { name: "Solutions", href: "#solutions" },
              { name: "AI_Tech", href: "#tech" },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                className="relative group text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <span className="font-mono tracking-wider">{item.name}</span>
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 group-hover:w-full transition-all duration-300"
                  style={{ boxShadow: "0 0 5px #0891b2" }}
                />
              </motion.a>
            ))}

            <Link to="/login">
              <motion.button
                className="relative group px-8 py-3 overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 rounded bg-gradient-to-r from-cyan-600 to-fuchsia-600 opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                <div className="absolute inset-[1px] bg-gray-950 rounded" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <span className="relative font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white transition-all duration-300">
                  LOGIN_SECURE
                </span>

                {/* Animated border */}
                <div className="absolute inset-0 rounded border border-cyan-600" />
                <div
                  className="absolute top-0 right-0 w-[5px] h-[5px] bg-cyan-500"
                  style={{ boxShadow: "0 0 5px #0891b2" }}
                />
                <div
                  className="absolute bottom-0 left-0 w-[5px] h-[5px] bg-fuchsia-500"
                  style={{ boxShadow: "0 0 5px #a21caf" }}
                />
              </motion.button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 md:pt-0"
        >
          {/* Hero content - cyberpunk layout */}
          <div className="container mx-auto px-6 md:px-8 lg:px-20 relative z-10 grid lg:grid-cols-12 gap-8 items-center pt-32 md:pt-28">
            {/* Main content - left side */}
            <motion.div
              className="lg:col-span-7 lg:pr-8"
              style={{ y, opacity, scale }}
            >
              {/* Version badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="inline-block mb-6 px-3 py-1 rounded-full bg-gray-800 font-mono border border-cyan-900"
              >
                <span className="text-sm tracking-widest">
                  <span className="text-cyan-400 mr-1">v1.0.0</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-fuchsia-400 ml-1">GLOBAL_COMPLIANCE_NAVIGATOR</span>
                </span>
              </motion.div>

              {/* Main headline with cyberpunk styling */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <div className="mb-2">
                  <GlitchText
                    text="Regulatory"
                    className="font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-100"
                    delay={100}
                  />
                </div>
                <div className="flex items-center">
                  <GlitchText
                    text="Compliance"
                    className="font-mono text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-fuchsia-100"
                    delay={200}
                  />
                  <div
                    className="w-[5px] h-[5px] mx-3 bg-cyan-400"
                    style={{ boxShadow: "0 0 5px rgba(6,182,212,0.8)" }}
                  />
                  <GlitchText
                    text="Platform"
                    className="font-mono text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-fuchsia-100"
                    delay={300}
                  />
                </div>
              </h1>

              {/* Subheadline with typing effect */}
              <div className="relative h-12 mb-8">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-xl text-gray-300 font-mono"
                >
                  Streamline regulatory compliance for
                  <span className="relative ml-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                    medical_devices.exe
                    <span className="absolute -right-4 top-0 inline-block w-2 h-full bg-white animate-pulse" />
                  </span>
                </motion.p>
              </div>

              {/* Feature bullets with cyber icons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-10 space-y-3 text-sm font-mono"
              >
                {[
                  {
                    icon: <FaServer className="mr-2" />,
                    text: "IEC 62304 Compliance Management",
                  },
                  {
                    icon: <FaFingerprint className="mr-2" />,
                    text: "ISO 27001 Security Controls",
                  },
                  {
                    icon: <FaDatabase className="mr-2" />,
                    text: "MISRA Compliance Deviation Management",
                  },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center text-gray-400">
                    <span className="text-cyan-400 flex items-center">
                      {feature.icon}
                    </span>
                    <span>:: {feature.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA buttons with cyber styling */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex flex-wrap gap-6"
              >
                <Link to="/login" className="group relative">
                  {/* Primary CTA with animated border */}
                  <motion.div
                    className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-fuchsia-600 rounded opacity-70 blur-sm group-hover:opacity-100 transition duration-300"
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(6,182,212,0.5)",
                        "0 0 15px rgba(6,182,212,0.8)",
                        "0 0 0px rgba(6,182,212,0.5)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="relative py-4 px-8 bg-black rounded flex items-center gap-3 border border-cyan-800/50">
                    <span className="font-mono font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                      Access_Compliance_Dashboard.exe
                    </span>
                    <FaRocket className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="group relative py-4 px-6 border border-gray-800 hover:border-cyan-800 rounded flex items-center gap-3 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                    <FaPlayCircle className="text-cyan-400" />
                  </div>
                  <span className="font-mono text-gray-400 group-hover:text-cyan-400 transition-colors">
                    Run_Demo.mp4
                  </span>
                </button>
              </motion.div>

              
            </motion.div>

            {/* Right side - 3D product visualization */}
            <motion.div
              className="lg:col-span-5 lg:ml-auto"
              style={{ y, opacity, scale }}
            >
              <div className="relative min-h-[500px] flex items-center justify-center">
                {/* Glowing core background */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 1 }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-cyan-900/20 blur-3xl" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-fuchsia-900/20 blur-2xl" />
                </motion.div>

                {/* Compliance Framework Visualization */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.5, duration: 1, type: "spring" }}
                  className="relative w-80 h-80"
                >
                  {/* Framework diagram base */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath:
                        "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      background:
                        "linear-gradient(45deg, rgba(8,145,178,0.2) 0%, rgba(168,85,247,0.2) 100%)",
                      border: "1px solid rgba(6,182,212,0.3)",
                    }}
                  />

                  {/* Animated compliance scanner effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"
                    animate={{
                      top: ["-100%", "100%", "-100%"],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      clipPath:
                        "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                  />

                  {/* Center compliance diagram */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-56 h-56 relative">
                      {/* IEC 62304 Layer */}
                      <motion.div
                        className="absolute inset-0 border-4 border-cyan-500/50 rounded-full"
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 40,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-500 rounded-full" />
                        <motion.div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-cyan-400 font-mono whitespace-nowrap"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          IEC_62304
                        </motion.div>
                      </motion.div>

                      {/* ISO 27001 Layer */}
                      <motion.div
                        className="absolute inset-5 border-4 border-fuchsia-500/50 rounded-full"
                        animate={{ rotate: [360, 0] }}
                        transition={{
                          duration: 30,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-fuchsia-500 rounded-full" />
                        <motion.div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-fuchsia-400 font-mono whitespace-nowrap"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 0.5,
                          }}
                        >
                          ISO_27001
                        </motion.div>
                      </motion.div>

                      {/* MISRA Layer */}
                      <motion.div
                        className="absolute inset-12 border-4 border-blue-500/50 rounded-full"
                        animate={{ rotate: [0, -360] }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <div className="absolute top-1/2 -right-2 w-4 h-4 bg-blue-500 rounded-full" />
                        <motion.div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-blue-400 font-mono whitespace-nowrap"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 1,
                          }}
                        >
                          MISRA
                        </motion.div>
                      </motion.div>

                      {/* Center Shield */}
                      <motion.div
                        className="absolute inset-20 bg-gray-900/80 rounded-full flex items-center justify-center"
                        animate={{
                          boxShadow: [
                            "0 0 10px rgba(6,182,212,0.3)",
                            "0 0 20px rgba(6,182,212,0.5)",
                            "0 0 10px rgba(6,182,212,0.3)",
                          ],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <FaShieldAlt className="text-cyan-400 text-3xl" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Hexagon corners */}
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-cyan-400"
                      style={{
                        top: i === 0 ? "0%" : i === 3 ? "100%" : "50%",
                        left: i === 4 ? "0%" : i === 2 ? "100%" : "50%",
                        transform: [
                          i === 0
                            ? "translate(-50%, 0)"
                            : i === 1
                            ? "translate(50%, 25%)"
                            : i === 2
                            ? "translate(0, 75%)"
                            : i === 3
                            ? "translate(-50%, 0)"
                            : i === 4
                            ? "translate(0, 75%)"
                            : "translate(50%, 25%)",
                        ],
                        boxShadow: "0 0 10px rgba(6,182,212,0.8)",
                      }}
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                  ))}

                  {/* Animated data particles */}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-cyan-400"
                      style={{
                        left: "50%",
                        top: "50%",
                        opacity: 0.7,
                      }}
                      animate={{
                        x: [0, (Math.random() - 0.5) * 150],
                        y: [0, (Math.random() - 0.5) * 150],
                        opacity: [0, 0.9, 0],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}

                  {/* Compliance status text */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className="text-center font-mono text-xs text-gray-500 mb-1">
                      // COMPLIANCE_STATUS
                    </div>
                    <div className="text-center font-mono text-sm text-cyan-400 tracking-widest">
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        VALIDATED • CERTIFIED • SECURE
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced scroll indicator with cyber styling */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          >
            <div className="text-gray-400 font-mono text-xs mb-2 tracking-wider">
              [SCROLL_DOWN.exe]
            </div>
            <motion.div
              animate={{
                y: [0, 10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-cyan-700 rounded-full flex items-center justify-center relative"
            >
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                style={{ filter: "drop-shadow(0 0 5px #0891b2)" }}
              />
            </motion.div>
          </motion.div>

          {/* Video modal with cyber styling */}
          <AnimatePresence>
            {isVideoModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
                onClick={() => setIsVideoModalOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative bg-gray-900 p-1 rounded-lg max-w-4xl w-full border border-cyan-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal corner elements */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500"></div>

                  {/* Close button */}
                  <button
                    className="absolute -top-10 right-0 text-gray-400 hover:text-cyan-400 font-mono flex items-center"
                    onClick={() => setIsVideoModalOpen(false)}
                  >
                    <span>[ </span>
                    <span className="mx-1">CLOSE</span>
                    <span> ]</span>
                  </button>

                  {/* Video content */}
                  <div className="aspect-video w-full bg-black/60 rounded flex items-center justify-center">
                    <div className="text-gray-500 font-mono">
                      # DEMO_VIDEO_CONTENT
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Features section with cyberpunk styling */}
        <section
          id="features"
          className="relative py-32 px-8 lg:px-16 overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(6,182,212,0.05) 50%, rgba(0,0,0,0) 100%)",
            borderTop: "1px solid rgba(6, 182, 212, 0.1)",
          }}
        >
          {/* Data circuit lines */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern
                  id="circuit-pattern"
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M0 50 L40 50 L50 40 L60 60 L70 50 L100 50"
                    fill="none"
                    stroke="rgba(6,182,212,0.8)"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M50 0 L50 40 L40 50 L60 60 L50 70 L50 100"
                    fill="none"
                    stroke="rgba(232,121,249,0.8)"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-block mb-4 px-3 py-1 bg-gray-900 rounded-md border border-cyan-900 font-mono">
                <span className="text-cyan-400 mr-2">#</span>
                <span className="text-fuchsia-400">Core_Functions</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-mono">
                <GlitchText
                  text="Enterprise-Grade"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300 block"
                />
                <GlitchText
                  text="Compliance Solutions"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-fuchsia-300 block mt-2"
                  delay={200}
                />
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto font-mono">
                {
                  '<integrated_platform combining="regulatory_intelligence" workflow="automation" analytics="predictive" />'
                }
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {/* Cyber-styled feature cards */}
              {[
                {
                  icon: <FaShieldAlt className="text-cyan-400 text-2xl" />,
                  title: "Medical Device Compliance",
                  description:
                    "Streamlined IEC 62304 compliance for class C medical devices with automated documentation and risk management",
                  color: "cyan",
                  delay: 0.2,
                },
                {
                  icon: <FaBookOpen className="text-fuchsia-400 text-2xl" />,
                  title: "SOUP Component Management",
                  description:
                    "Track software of unknown provenance with limited vendor documentation while maintaining regulatory compliance",
                  color: "fuchsia",
                  delay: 0.4,
                },
                {
                  icon: <FaChartLine className="text-cyan-400 text-2xl" />,
                  title: "Agile Process Validation",
                  description:
                    "Maintain MISRA compliance with automated deviation management for agile development practices",
                  color: "cyan",
                  delay: 0.6,
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: feature.delay }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  className="group h-full"
                >
                  <div className="bg-black/40 backdrop-blur-md p-6 rounded-lg border border-gray-800 h-full relative overflow-hidden group-hover:border-cyan-800 transition-colors duration-500">
                    {/* Feature card top corner markers */}
                    <div className="absolute top-0 left-0 w-10 h-10">
                      <div className="absolute top-0 left-0 w-3 h-1 bg-cyan-500"></div>
                      <div className="absolute top-0 left-0 w-1 h-3 bg-cyan-500"></div>
                    </div>
                    <div className="absolute top-0 right-0 w-10 h-10">
                      <div className="absolute top-0 right-0 w-3 h-1 bg-fuchsia-500"></div>
                      <div className="absolute top-0 right-0 w-1 h-3 bg-fuchsia-500"></div>
                    </div>

                    {/* Animated scanner line */}
                    <motion.div
                      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100"
                      animate={{
                        top: ["0%", "100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    />

                    <div className="relative z-10">
                      <div
                        className={`w-16 h-16 ${
                          feature.color === "cyan"
                            ? "bg-cyan-900/30"
                            : "bg-fuchsia-900/30"
                        } rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div className="relative">
                          {feature.icon}
                          <motion.div
                            className={`absolute inset-0 ${
                              feature.color === "cyan"
                                ? "text-cyan-400"
                                : "text-fuchsia-400"
                            }`}
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {feature.icon}
                          </motion.div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4 font-mono">
                        <span
                          className={
                            feature.color === "cyan"
                              ? "text-cyan-400"
                              : "text-fuchsia-400"
                          }
                        >
                          ::
                        </span>{" "}
                        {feature.title}
                      </h3>
                      <p className="text-gray-400">{feature.description}</p>

                      {/* Learn more link */}
                      <div className="mt-6 flex items-center text-sm font-mono">
                        <span
                          className={`${
                            feature.color === "cyan"
                              ? "text-cyan-400"
                              : "text-fuchsia-400"
                          } group-hover:underline`}
                        >
                          system.view_specifications()
                        </span>
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                            repeatDelay: 0.5,
                          }}
                          className={`ml-2 ${
                            feature.color === "cyan"
                              ? "text-cyan-400"
                              : "text-fuchsia-400"
                          }`}
                        >
                          &#x2192;
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions section with cyber-grid background */}
        <section
          id="solutions"
          className="py-32 relative overflow-hidden"
          style={{ borderTop: "1px solid rgba(232, 121, 249, 0.1)" }}
        >
          {/* Cyber Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(6,182,212,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Glowing background accent */}
              <div className="absolute -inset-8 bg-cyan-900/5 blur-3xl rounded-full" />

              <div className="relative z-10 bg-black/40 backdrop-blur-sm p-10 rounded-lg border border-cyan-900/50 overflow-hidden">
                {/* Digital scan lines */}
                <div className="absolute inset-0 pointer-events-none opacity-10">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 h-px bg-cyan-400"
                      style={{ top: `${i * 10}px` }}
                    />
                  ))}
                </div>

                <h3 className="text-3xl font-bold mb-6 font-mono">
                  <GlitchText
                    text="AI-Enhanced Medical Device Compliance"
                    className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-300"
                  />
                </h3>
                <p className="text-gray-400 mb-8 font-mono">
                  SYSTEM.EXECUTE &lt; Our platform integrates with your
                  development processes to maintain IEC 62304 compliance even
                  when using SOUP components with limited documentation, all
                  while satisfying ISO 27001 security controls.
                </p>
                <div className="space-y-6">
                  {[
                    "Automated SOUP Documentation",
                    "Regulatory-Compliant Agile Framework",
                    "MISRA Deviation Management",
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-4 group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-10 h-10 bg-cyan-900/30 rounded flex items-center justify-center border border-cyan-800/50 relative overflow-hidden group-hover:border-cyan-500 transition-colors duration-300">
                        <FaArrowRight className="text-cyan-400 z-10" />
                        {/* Animated fill on hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 -z-10 origin-left"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className="text-gray-300 group-hover:text-white transition-colors duration-300 font-mono">
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="grid gap-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                { value: "85%", label: "Reduction in Documentation Time" },
                { value: "98%", label: "Regulatory Compliance Rate" },
                { value: "75+", label: "Medical Device Standards" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-gray-800 group hover:border-fuchsia-800 transition-colors duration-300 relative overflow-hidden"
                >
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Stats with cyber styling */}
                  <motion.div
                    className="text-5xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-3 flex items-baseline"
                    whileInView={{ scale: 1.05 }}
                    transition={{ type: "spring", delay: i * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <span>{stat.value}</span>
                    <span className="text-lg ml-2 text-gray-500">/</span>
                  </motion.div>
                  <div className="text-gray-400 font-mono">
                    <span className="text-fuchsia-400">#</span> {stat.label}
                  </div>

                  {/* Binary background numbers */}
                  <div className="absolute bottom-2 right-2 text-xs text-fuchsia-800/40 font-mono">
                    {Array.from({ length: 8 })
                      .map(() => Math.round(Math.random()))
                      .join("")}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <footer
        className="py-16 px-8 lg:px-16 relative overflow-hidden"
        style={{
          borderTop: "1px solid rgba(6, 182, 212, 0.2)",
          background:
            "linear-gradient(0deg, rgba(6,182,212,0.05) 0%, rgba(0,0,0,0) 100%)",
        }}
      >
        {/* Circuit trace lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 L30,0 L30,50 L70,50 L70,100 L100,100"
              stroke="rgba(6,182,212,0.8)"
              strokeWidth="0.2"
              fill="none"
            />
            <path
              d="M0,100 L40,100 L40,30 L60,30 L60,0 L100,0"
              stroke="rgba(232,121,249,0.8)"
              strokeWidth="0.2"
              fill="none"
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="GCN Logo" className="w-10 h-10" />
              <h2 className="text-xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                GCN_SECURE
              </h2>
            </div>
            <p className="text-gray-400 text-sm font-mono">
              // Advanced regulatory compliance platform for medical device
              software under IEC 62304, ISO 27001, and MISRA standards
            </p>

            {/* Digital copyright */}
            <div className="text-xs text-gray-600 font-mono pt-4 border-t border-gray-800">
              <span className="text-cyan-500">&#169;</span>{" "}
              {new Date().getFullYear()} GCN_SECURE | ALL_RIGHTS_ENCRYPTED
            </div>
          </div>

          {[
            {
              title: "COMPLIANCE",
              links: ["IEC 62304", "ISO 27001", "MISRA Standards"],
            },
            {
              title: "SERVICES",
              links: ["SOUP Management", "Deviation Tracking", "Audit Tools"],
            },
            {
              title: "RESOURCES",
              links: ["Documentation", "Regulatory Updates", "Support"],
            },
          ].map((category, i) => (
            <div key={i} className="space-y-4">
              <h3 className="text-gray-300 font-semibold font-mono mb-3 flex items-center">
                <span className="text-cyan-500 mr-2">//</span>
                {category.title}
              </h3>
              <ul className="space-y-3">
                {category.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-cyan-400 transition-colors text-sm font-mono group flex items-center"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-1 text-cyan-500">
                        &#62;
                      </span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Landing;
