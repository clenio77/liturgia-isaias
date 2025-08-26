'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Shield, AlertTriangle, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requiredPermissions?: string[]
  fallbackUrl?: string
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requiredPermissions = [],
  fallbackUrl = '/login'
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, isAdmin, hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(fallbackUrl)
    }
  }, [isLoading, isAuthenticated, router, fallbackUrl])

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Usuário não autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso Restrito
          </h1>
          <p className="text-gray-600 mb-6">
            Você precisa fazer login para acessar esta página.
          </p>
          <Button 
            onClick={() => router.push('/login')}
            className="w-full"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    )
  }

  // Verificar se precisa ser admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso Negado
          </h1>
          <p className="text-gray-600 mb-6">
            Você não tem permissão de administrador para acessar esta área.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/')}
              className="w-full"
            >
              Voltar ao Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Trocar de Conta
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Usuário autenticado e com permissões adequadas
  return <>{children}</>
}
