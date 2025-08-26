'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'USER'
  isAuthenticated: boolean
  avatar?: string
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users para demonstração
const mockUsers = [
  {
    id: '1',
    email: 'admin@liturgia.com',
    password: 'admin123',
    name: 'Administrador do Sistema',
    role: 'ADMIN' as const,
    permissions: ['manage_users', 'manage_songs', 'manage_masses', 'view_reports', 'system_config']
  },
  {
    id: '2',
    email: 'pe.joao@paroquia.com',
    password: 'padre123',
    name: 'Pe. João Silva',
    role: 'ADMIN' as const,
    permissions: ['manage_users', 'manage_songs', 'manage_masses', 'view_reports']
  },
  {
    id: '3',
    email: 'maria@liturgia.com',
    password: 'maria123',
    name: 'Maria Santos',
    role: 'USER' as const,
    permissions: ['manage_songs', 'manage_masses']
  }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('liturgia_user')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        localStorage.removeItem('liturgia_user')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Verificar credenciais
      const mockUser = mockUsers.find(
        u => u.email === email && u.password === password
      )

      if (mockUser) {
        const user: User = {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          isAuthenticated: true,
          permissions: mockUser.permissions
        }

        setUser(user)
        localStorage.setItem('liturgia_user', JSON.stringify(user))
        return true
      }

      return false
    } catch (error) {
      console.error('Erro no login:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('liturgia_user')
    window.location.href = '/login'
  }

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user?.isAuthenticated,
    isAdmin: user?.role === 'ADMIN',
    hasPermission
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
