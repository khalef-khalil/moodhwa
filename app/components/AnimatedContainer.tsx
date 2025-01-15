'use client'

import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

interface AnimatedContainerProps {
  children: React.ReactNode
  className?: string
}

export default function AnimatedContainer({ children, className }: AnimatedContainerProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedItem({ children, className }: AnimatedContainerProps) {
  return (
    <motion.div
      variants={item}
      className={className}
    >
      {children}
    </motion.div>
  )
} 