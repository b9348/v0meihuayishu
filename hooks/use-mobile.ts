"use client"

import { useState, useEffect } from "react"

/**
 * A custom hook to detect if the viewport matches a mobile media query.
 * @param {string} query - The media query to match against. Defaults to `(max-width: 768px)`.
 * @returns {boolean} - `true` if the media query matches, otherwise `false`.
 */
export const useMobile = (query = "(max-width: 768px)") => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Ensure window is defined (for server-side rendering)
    if (typeof window === "undefined") {
      return
    }

    const mediaQuery = window.matchMedia(query)
    const handleResize = () => setIsMobile(mediaQuery.matches)

    // Set the initial state
    handleResize()

    // Add event listener for changes in viewport size
    mediaQuery.addEventListener("change", handleResize)

    // Cleanup function to remove the event listener
    return () => mediaQuery.removeEventListener("change", handleResize)
  }, [query])

  return isMobile
}
