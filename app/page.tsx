'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
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

  // Estados para modais
  const [showNewMassModal, setShowNewMassModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showPresentationModal, setShowPresentationModal] = useState(false)

  // Estados para formulários
  const [newMass, setNewMass] = useState({
    title: '',
    date: '',
    time: '',
    liturgicalTime: 'ORDINARY'
  })

  const [uploadFile, setUploadFile] = useState<File | null>(null)

  // Funções para ações rápidas
  const handleNewMass = () => {
    console.log('Nova missa criada:', newMass)
    // Aqui você adicionaria a lógica para salvar no backend
    setShowNewMassModal(false)
    setNewMass({ title: '', date: '', time: '', liturgicalTime: 'ORDINARY' })
    alert('Nova missa criada com sucesso!')
  }

  const handleUpload = () => {
    if (!uploadFile) {
      alert('Por favor, selecione um arquivo')
      return
    }
    console.log('Upload do arquivo:', uploadFile.name)
    // Aqui você adicionaria a lógica para upload no backend
    setShowUploadModal(false)
    setUploadFile(null)
    alert('Música enviada com sucesso!')
  }

  const handlePresentation = () => {
    console.log('Iniciando modo apresentação')
    // Aqui você redirecionaria para a página de apresentação
    window.open('/apresentacao', '_blank')
    setShowPresentationModal(false)
  }

  const handleLiturgyToday = () => {
    console.log('Abrindo liturgia de hoje')
    // Aqui você redirecionaria para a página de liturgia
    window.open('/liturgia', '_blank')
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000) // Atualiza a cada minuto

    return () => clearInterval(timer)
  }, [])

  return (
    <AppLayout>
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
              <Button
                className="h-20 flex-col space-y-2"
                variant="outline"
                onClick={() => setShowNewMassModal(true)}
              >
                <Calendar className="h-6 w-6" />
                <span>Nova Missa</span>
              </Button>

              <Button
                className="h-20 flex-col space-y-2"
                variant="outline"
                onClick={() => setShowUploadModal(true)}
              >
                <Upload className="h-6 w-6" />
                <span>Upload Música</span>
              </Button>

              <Button
                className="h-20 flex-col space-y-2"
                variant="outline"
                onClick={() => setShowPresentationModal(true)}
              >
                <Monitor className="h-6 w-6" />
                <span>Apresentação</span>
              </Button>

              <Button
                className="h-20 flex-col space-y-2"
                variant="outline"
                onClick={handleLiturgyToday}
              >
                <BookOpen className="h-6 w-6" />
                <span>Liturgia Hoje</span>
              </Button>
            </div>
          </div>
      </div>

      {/* Modais */}

      {/* Modal Nova Missa */}
      <Modal
        isOpen={showNewMassModal}
        onClose={() => setShowNewMassModal(false)}
        title="Nova Missa"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título da Celebração
            </label>
            <Input
              type="text"
              placeholder="Ex: 21º Domingo do Tempo Comum"
              value={newMass.title}
              onChange={(e) => setNewMass({...newMass, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data
              </label>
              <Input
                type="date"
                value={newMass.date}
                onChange={(e) => setNewMass({...newMass, date: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário
              </label>
              <Input
                type="time"
                value={newMass.time}
                onChange={(e) => setNewMass({...newMass, time: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tempo Litúrgico
            </label>
            <Select
              value={newMass.liturgicalTime}
              onChange={(e) => setNewMass({...newMass, liturgicalTime: e.target.value})}
            >
              <option value="ORDINARY">Tempo Comum</option>
              <option value="ADVENT">Advento</option>
              <option value="CHRISTMAS">Natal</option>
              <option value="LENT">Quaresma</option>
              <option value="EASTER">Páscoa</option>
              <option value="SPECIAL">Especial</option>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowNewMassModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleNewMass}>
              Criar Missa
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Upload Música */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload de Música"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Arquivo
            </label>
            <Input
              type="file"
              accept=".pdf,.mp3,.wav,.jpg,.png"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Formatos aceitos: PDF, MP3, WAV, JPG, PNG
            </p>
          </div>

          {uploadFile && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Arquivo selecionado:</strong> {uploadFile.name}
              </p>
              <p className="text-xs text-blue-600">
                Tamanho: {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpload} disabled={!uploadFile}>
              Fazer Upload
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Apresentação */}
      <Modal
        isOpen={showPresentationModal}
        onClose={() => setShowPresentationModal(false)}
        title="Modo Apresentação"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            O modo apresentação abrirá uma nova janela otimizada para projeção durante a missa.
          </p>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Dicas:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Use F11 para tela cheia</li>
              <li>• Conecte o projetor antes de iniciar</li>
              <li>• Teste o áudio previamente</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowPresentationModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePresentation}>
              Iniciar Apresentação
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  )
}
