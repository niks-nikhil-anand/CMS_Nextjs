"use client"
import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Settings, 
  UserCheck,
  Database,
  FolderOpen,
  TrendingUp,
  Shredder
} from 'lucide-react'


const NavigationComponent = () => {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (path) => {
    router.push(path);
    console.log(`Navigating to: ${path}`);
  };

  const isActive = (path) => pathname === path

  const navigationItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/addManager', label: 'Add Manager', icon: UserPlus },
    { path: '/admin/addCandidate', label: 'Add Candidates', icon: UserCheck },
    { path: '/admin/distributeData', label: 'Distribute Data', icon: Database },
    { path: '/admin/viewUploadedFiles', label: 'View Uploaded Files', icon: FolderOpen },
    { path: '/admin/data', label: 'View Data', icon: Shredder },
    { path: '/admin/notifications', label: 'Candidate Statistics', icon: TrendingUp },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="w-64 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-700 h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Admin Panel
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left cursor-pointer transition-all duration-200
                ${active 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <Icon 
                size={20} 
                className={active ? 'text-white' : 'text-gray-500 dark:text-gray-400'}
              />
              <span className="font-medium">{item.label}</span>
              
              {/* Active indicator */}
              {active && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">U</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavigationComponent