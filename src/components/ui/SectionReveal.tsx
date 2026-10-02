import React from "react";
import { motion } from "framer-motion";

export interface SectionRevealProps {
  children?: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

export default function SectionReveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  once = true,
}: SectionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
