"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { motion, HTMLMotionProps } from "framer-motion"

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode
  disabled?: boolean
  variant?: "primary" | "outline" | "ghost" | "link"
  size?: "sm" | "md" | "lg"
  icon?: ReactNode
  iconPosition?: "left" | "right"
}

export default function Button({
  children,
  className,
  disabled,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  ...props
}: ButtonProps) {
  // Base styles
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2"

  // Size variations
  const sizeStyles = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  }

  // Variant styles
  const variantStyles = {
    primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    outline: "border-2 border-green-500 text-green-600 hover:bg-green-50 focus:ring-green-400",
    ghost: "text-green-600 hover:bg-green-50 focus:ring-green-400",
    link: "text-green-600 hover:underline focus:ring-green-400 px-2 py-1",
  }

  // Disabled styles
  const disabledStyles = "opacity-60 cursor-not-allowed"

  return (
    <motion.button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], disabled && disabledStyles, className)}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </motion.button>
  )
}