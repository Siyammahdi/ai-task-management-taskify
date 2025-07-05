"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group premium-toaster"
      toastOptions={{
        className: 'premium-toast',
        style: {
          borderRadius: '1rem',
          boxShadow: '0 6px 32px 0 rgba(41,143,120,0.10), 0 1.5px 6px 0 rgba(41,143,120,0.08)',
          border: '1.5px solid var(--border)',
          background: 'var(--card)',
          color: 'var(--primary)',
          fontWeight: 500,
          fontSize: '1rem',
          padding: '1.25rem 1.5rem',
          minWidth: '260px',
          maxWidth: '360px',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
