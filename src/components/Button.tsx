"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { motion, HTMLMotionProps } from "framer-motion"

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode
  disabled?: boolean
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link"
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

  const base = "inline-flex items-center justify-center font-serif tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B8841E]"

  const sizes = {
    sm: "px-5 py-1.5 text-sm rounded-sm",
    md: "px-7 py-2.5 text-sm rounded-sm",
    lg: "px-9 py-3    text-base rounded-sm",
  }

  const variants = {
    // Solid navy — primary action
    primary:
      "bg-[#0D1B3E] text-[#EDD085] border border-[#0D1B3E] hover:bg-[#152347] hover:shadow-[0_4px_16px_rgba(13,27,62,0.25)] active:translate-y-px",

    // Solid gold — secondary / highlight action
    secondary:
      "bg-[#B8841E] text-[#FAF5E8] border border-[#B8841E] hover:bg-[#C9922A] hover:shadow-gold-sm active:translate-y-px",

    // Ghost outline — navy border, navy text, gold hover
    outline:
      "bg-transparent border border-[#0D1B3E]/40 text-[#1A1A2E]/80 hover:border-[#B8841E] hover:text-[#B8841E] hover:bg-[#B8841E]/5 active:translate-y-px",

    ghost:
      "bg-transparent text-[#1A1A2E]/60 hover:text-[#B8841E] hover:bg-[#B8841E]/8 active:translate-y-px",

    link:
      "bg-transparent text-[#B8841E] underline underline-offset-4 decoration-[#B8841E]/40 hover:decoration-[#B8841E] px-2 py-1",
  }

  return (
    <motion.button
      className={cn(base, sizes[size], variants[variant], disabled && "opacity-50 cursor-not-allowed pointer-events-none", className)}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.015 } : {}}
      whileTap={!disabled ? { scale: 0.985 } : {}}
      {...props}
    >
      {icon && iconPosition === "left"  && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </motion.button>
  )
}