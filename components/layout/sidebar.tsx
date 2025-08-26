'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import {
  Home,
  Music,
  Calendar,
  Upload,
  Settings,
  Users,
  Monitor,
  BookOpen,
  Cross,
  LogOut,
  Shield,
  User as UserIcon,
  BarChart3
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Visão geral do sistema'
  },
  {
    name: 'Músicas',
    href: '/musicas',
    icon: Music,
    description: 'Biblioteca de músicas'
  },
  {
    name: 'Repertório',
    href: '/repertorio',
    icon: Calendar,
    description: 'Repertório litúrgico'
  },
  {
    name: 'Relatórios',
    href: '/relatorios',
    icon: BarChart3,
    description: 'Estatísticas e relatórios'
  },
  {
    name: 'Configurações',
    href: '/configuracoes',
    icon: Settings,
    description: 'Configurações pessoais'
  }
]

const adminNavigation = [
  {
    name: 'Usuários',
    href: '/usuarios',
    icon: Users,
    description: 'Gerenciar usuários'
  }
]

interface SidebarProps {
  isAdmin?: boolean
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname()
  const { user, isAdmin: userIsAdmin, logout } = useAuth()

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 bg-primary">
        <div className="flex items-center space-x-2">
          <Cross className="h-8 w-8 text-white" />
          <div className="text-white">
            <h1 className="text-lg font-bold">Liturgia</h1>
            <p className="text-xs opacity-90">Isaías</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-12 px-3",
                    isActive && "bg-primary/10 text-primary border-primary/20"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>

        {/* Admin Section */}
        {(isAdmin || userIsAdmin) && (
          <div className="pt-6">
            <div className="px-3 mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Administração
              </h3>
            </div>
            <div className="space-y-1">
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start h-12 px-3",
                        isActive && "bg-primary/10 text-primary border-primary/20"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User Info */}
      <div className="border-t border-gray-200 p-4">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.role === 'ADMIN' ? 'Administrador' : 'Músico'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="w-full flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Button
              onClick={() => window.location.href = '/login'}
              className="w-full"
            >
              Fazer Login
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
