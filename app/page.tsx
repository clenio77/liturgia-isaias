'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { formatLiturgicalDate, getLiturgicalColor } from '@/lib/utils'
import {
  Calendar,
  Music,
  Upload,
  Monitor,
  TrendingUp,
  Clock,
  Users,
  BookOpen
} from 'lucide-react'

// Mock data - será substituído por dados reais da API
const mockStats = {
  totalSongs: 156,
  totalMasses: 23,
  thisWeekMasses: 3,
  activeUsers: 8
}

const mockRecentMasses = [
  {
    id: '1',
    date: new Date('2024-01-07'),
    title: '2º Domingo do Tempo Comum',
    liturgicalTime: 'ORDINARY' as const,
    songsCount: 5
  },
  {
    id: '2', 
    date: new Date('2024-01-14'),
    title: '3º Domingo do Tempo Comum',
    liturgicalTime: 'ORDINARY' as const,
    songsCount: 5
  }
]

const mockUpcomingMasses = [
  {
    id: '3',
    date: new Date('2024-01-21'),
    title: '4º Domingo do Tempo Comum',
    liturgicalTime: 'ORDINARY' as const,
    planned: false
  },
  {
    id: '4',
    date: new Date('2024-01-28'),
    title: '5º Domingo do Tempo Comum', 
    liturgicalTime: 'ORDINARY' as const,
    planned: false
  }
]

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000) // Atualiza a cada minuto

    return () => clearInterval(timer)
  }, [])

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              {formatLiturgicalDate(currentDate)}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Music className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Músicas</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalSongs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Missas Planejadas</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalMasses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.thisWeekMasses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.activeUsers}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Masses */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Missas Recentes</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockRecentMasses.map((mass) => (
                    <div key={mass.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-${getLiturgicalColor(mass.liturgicalTime)}-500`} />
                        <div>
                          <p className="font-medium text-gray-900">{mass.title}</p>
                          <p className="text-sm text-gray-500">
                            {formatLiturgicalDate(mass.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {mass.songsCount} músicas
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Masses */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Próximas Missas</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockUpcomingMasses.map((mass) => (
                    <div key={mass.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-${getLiturgicalColor(mass.liturgicalTime)}-500`} />
                        <div>
                          <p className="font-medium text-gray-900">{mass.title}</p>
                          <p className="text-sm text-gray-500">
                            {formatLiturgicalDate(mass.date)}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant={mass.planned ? "secondary" : "default"}
                      >
                        {mass.planned ? 'Planejada' : 'Planejar'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <Calendar className="h-6 w-6" />
                <span>Nova Missa</span>
              </Button>
              
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <Upload className="h-6 w-6" />
                <span>Upload Música</span>
              </Button>
              
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <Monitor className="h-6 w-6" />
                <span>Apresentação</span>
              </Button>
              
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <BookOpen className="h-6 w-6" />
                <span>Liturgia Hoje</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  )
}
