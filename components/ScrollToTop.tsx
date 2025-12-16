'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Always scroll to top when navigating to home page
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
