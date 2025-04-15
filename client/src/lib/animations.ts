import { TargetAndTransition, VariantLabels, Variants } from "framer-motion";

// Fade in animation
export const fadeIn = (delay: number = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay,
      duration: 0.8,
    },
  },
});

// Slide up animation
export const slideUp = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.8,
      ease: "easeOut",
    },
  },
});

// Slide right animation
export const slideRight = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay,
      duration: 0.8,
      ease: "easeOut",
    },
  },
});

// Animation for staggered children
export const staggerContainer = (delayChildren: number = 0.1): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren,
    },
  },
});

// Scale and hover animations for cards
export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0px 0px 0px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.3,
      type: "tween",
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    y: -5,
    boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.3,
      type: "tween",
      ease: "easeOut",
    },
  },
};

// Parallax scroll effect with Y translation
export const parallaxY = (yValue: number): Variants => ({
  initial: { y: 0 },
  animate: {
    y: yValue,
    transition: {
      type: "spring",
      stiffness: 10,
      mass: 0.3,
    },
  },
});
