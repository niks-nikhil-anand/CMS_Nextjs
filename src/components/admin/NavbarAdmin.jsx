"use client"
import React, { useState, useEffect } from 'react'
import { Sun, Moon, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const NavbarAdmin = () => {
    const router = useRouter(); 
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize theme after component mounts
  useEffect(() => {
    setMounted(true)
    
    // Check if user has a saved theme preference
    const saved = localStorage.getItem('darkMode')
    let initialTheme = false
    
    if (saved !== null) {
      initialTheme = JSON.parse(saved)
    } else {
      // Check system preference
      initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    setIsDarkMode(initialTheme)
    
    // Apply initial theme
    if (initialTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Apply dark mode class when state changes
  useEffect(() => {
    if (mounted) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      // Save preference
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    }
  }, [isDarkMode, mounted])

  const cardClasses = "bg-white dark:bg-gray-900 shadow-sm"

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  const handleLogout = async () => {
     try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to logout");
    router.push("/");
  } catch (error) {
    console.error("Logout failed:", error);
    toast.error("Logout failed. Please try again.");
  }
};


  return (
    <div>
      <nav className={`${cardClasses} border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50`}>
        <div className="flex items-center gap-5">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
            <span className="text-white dark:text-black font-bold text-sm">P</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Plan to Empower</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
            suppressHydrationWarning={true}
          >
            {mounted ? (
              isDarkMode ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )
            ) : (
              <div className="w-5 h-5" />
            )}
          </button>

          

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors cursor-pointer"
            aria-label="Logout"
          >
            <LogOut size={16} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default NavbarAdmin