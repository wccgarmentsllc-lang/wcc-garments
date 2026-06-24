// Admin Section Root Layout
'use client'

import { AdminProvider } from '@/context/AdminContext'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { useThemeContext } from '@/context/ThemeContext'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isDark } = useThemeContext()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return (
      <AdminProvider>
        <div className="min-h-screen bg-black text-white">
          {children}
        </div>
      </AdminProvider>
    )
  }

  return (
    <AdminProvider>
      <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto pt-24 lg:pt-8 px-6 pb-12 lg:px-12">{children}</main>
      </div>
    </AdminProvider>
  )
}
