'use client'

import { createContext, useContext, ReactNode } from 'react'

interface AdminContextType {
  logout: () => Promise<void>
}

const AdminContext = createContext<AdminContextType>({
  logout: async () => {},
})

export function AdminProvider({ children }: { children: ReactNode }) {
  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
    } finally {
      window.location.href = '/admin/login'
    }
  }

  return (
    <AdminContext.Provider
      value={{
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
