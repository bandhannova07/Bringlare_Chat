'use client'

import { Menu, Search, MoreVertical } from 'lucide-react'

interface MobileHeaderProps {
  onMenuClick: () => void
  title: string
  subtitle?: string
}

export function MobileHeader({ onMenuClick, title, subtitle }: MobileHeaderProps) {
  return (
    <div className="mobile-header md:hidden">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="mobile-menu-btn mr-3">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-semibold text-lg">{title}</h1>
          {subtitle && (
            <p className="text-sm opacity-80">{subtitle}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="mobile-menu-btn">
          <Search className="w-5 h-5" />
        </button>
        <button className="mobile-menu-btn">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
