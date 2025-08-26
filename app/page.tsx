'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { formatLiturgicalDate, getLiturgicalColor } from '@/lib/utils'
import { getLiturgicalData, LiturgicalData } from '@/lib/liturgical-calendar'
import { getCompleteMassSuggestions } from '@/lib/music-suggestions'
import { uploadFile, validateFile } from '@/lib/upload-service'
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
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false)

  // Estados para formulários
  const [newMass, setNewMass] = useState({
    title: '',
    date: '',
    time: '',
    liturgicalTime: 'ORDINARY'
  })

  const [uploadFileState, setUploadFileState] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // Estados para dados litúrgicos
  const [liturgicalData, setLiturgicalData] = useState<LiturgicalData | null>(null)
  const [suggestions, setSuggestions] = useState<any>(null)

  // Funções para ações rápidas
  const handleNewMass = async () => {
    if (!newMass.date || !newMass.title) {
      alert('Por favor, preencha os campos obrigatórios')
      return
    }

    // Obter dados litúrgicos automaticamente
    const selectedDate = new Date(newMass.date)
    const liturgicalInfo = getLiturgicalData(selectedDate)

    // Gerar sugestões de músicas
    const musicSuggestions = getCompleteMassSuggestions(liturgicalInfo)

    console.log('Nova missa criada:', {
      ...newMass,
      liturgicalInfo,
      suggestions: musicSuggestions
    })

    // Mostrar sugestões para o usuário
    setLiturgicalData(liturgicalInfo)
    setSuggestions(musicSuggestions)

    // Fechar modal atual e abrir modal de sugestões
    setShowNewMassModal(false)

    // Pequeno delay para melhor UX
    setTimeout(() => {
      setShowSuggestionsModal(true)
      alert(`🧠 IA DETECTOU:\n\n📅 ${liturgicalInfo.celebration}\n🎨 Tempo: ${liturgicalInfo.seasonName}\n🎵 ${Object.keys(musicSuggestions).length} categorias de músicas sugeridas!\n\nVeja o modal que abriu!`)
    }, 500)

    setNewMass({ title: '', date: '', time: '', liturgicalTime: 'ORDINARY' })
  }

  const handleUpload = async () => {
    if (!uploadFileState) {
      alert('Por favor, selecione um arquivo')
      return
    }

    // Validar arquivo
    const validation = validateFile(uploadFileState)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Fazer upload real
      const result = await uploadFile(uploadFileState)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success) {
        console.log('Upload realizado:', result)
        alert(`Música "${uploadFileState.name}" enviada com sucesso!`)

        // Aqui você salvaria os metadados no banco de dados
        // incluindo URL do arquivo, tipo, duração, etc.

      } else {
        alert(`Erro no upload: ${result.error}`)
      }
    } catch (error) {
      alert('Erro inesperado no upload')
      console.error('Erro no upload:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      setShowUploadModal(false)
      setUploadFileState(null)
    }
  }

  const handlePresentation = () => {
    console.log('Iniciando modo apresentação')
    // Aqui você redirecionaria para a página de apresentação
    window.open('/apresentacao', '_blank')
    setShowPresentationModal(false)
  }

  const handleLiturgyToday = () => {
    const today = new Date()
    const todayLiturgical = getLiturgicalData(today)

    console.log('Liturgia de hoje:', todayLiturgical)

    // Mostrar informações da liturgia de hoje
    alert(`Liturgia de Hoje:\n\n${todayLiturgical.celebration}\n${todayLiturgical.seasonName}\nCor litúrgica: ${todayLiturgical.color}`)

    // Em produção, redirecionaria para página específica
    // window.open('/liturgia', '_blank')
  }

  // Função para detectar tempo litúrgico automaticamente
  const handleDateChange = (date: string) => {
    setNewMass({...newMass, date})

    if (date) {
      const selectedDate = new Date(date)
      const liturgicalInfo = getLiturgicalData(selectedDate)

      // Atualizar automaticamente o tempo litúrgico
      setNewMass(prev => ({
        ...prev,
        date,
        liturgicalTime: liturgicalInfo.season,
        title: prev.title || liturgicalInfo.celebration
      }))

      // Feedback imediato para o usuário
      setTimeout(() => {
        alert(`🧠 IA DETECTOU AUTOMATICAMENTE:\n\n📅 ${liturgicalInfo.celebration}\n🎨 ${liturgicalInfo.seasonName}\n🎨 Cor: ${liturgicalInfo.color}\n\nAgora clique em "Criar Missa" para ver as sugestões de músicas!`)
      }, 300)

      console.log('Data selecionada - Tempo litúrgico detectado:', liturgicalInfo)
    }
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

          {/* TESTE DA IA - BANNER GRANDE */}
          <div className="mb-8 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-2xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">🧠 IA LITÚRGICA FUNCIONANDO!</h2>
              <p className="text-xl mb-6 opacity-90">
                Clique no botão abaixo para testar as sugestões inteligentes
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    handleDateChange(today);
                    setNewMass(prev => ({...prev, title: 'Teste da IA'}));
                    setShowNewMassModal(true);
                  }}
                >
                  🎯 TESTAR IA AGORA
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
                  onClick={() => window.open('/demo', '_blank')}
                >
                  📊 Ver Demonstração
                </Button>
              </div>
            </div>
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

            {/* Banner de Demonstração */}
            <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">🧠 IA Litúrgica Ativa!</h3>
                  <p className="text-sm opacity-90">
                    Clique em "Nova Missa" → Selecione uma data → Veja sugestões inteligentes!
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => window.open('/demo', '_blank')}
                >
                  Ver Demo
                </Button>
              </div>
            </div>

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
        title="Nova Missa - IA Litúrgica"
        size="md"
      >
        <div className="space-y-4">
          {/* Instruções da IA */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              🧠 IA Ativa - Como Funciona:
            </h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li><strong>1.</strong> Selecione uma data → Sistema detecta tempo litúrgico automaticamente</li>
              <li><strong>2.</strong> Clique "Criar Missa" → IA gera sugestões de músicas inteligentes</li>
              <li><strong>3.</strong> Veja o modal de sugestões com repertório completo!</li>
            </ol>
          </div>
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
                onChange={(e) => handleDateChange(e.target.value)}
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
              onChange={(e) => setUploadFileState(e.target.files?.[0] || null)}
              disabled={isUploading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Formatos aceitos: PDF (partituras), MP3/WAV (áudios), JPG/PNG (imagens)
            </p>
          </div>

          {uploadFileState && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Arquivo selecionado:</strong> {uploadFileState.name}
              </p>
              <p className="text-xs text-blue-600">
                Tamanho: {(uploadFileState.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-xs text-blue-600">
                Tipo: {uploadFileState.type}
              </p>
            </div>
          )}

          {isUploading && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800 mb-2">Enviando arquivo...</p>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-green-600 mt-1">{uploadProgress}% concluído</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!uploadFileState || isUploading}
            >
              {isUploading ? 'Enviando...' : 'Fazer Upload'}
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

      {/* Modal Sugestões Inteligentes */}
      <Modal
        isOpen={showSuggestionsModal}
        onClose={() => setShowSuggestionsModal(false)}
        title="🧠 IA Litúrgica - Sugestões Inteligentes"
        size="xl"
      >
        {liturgicalData && suggestions && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Informações Litúrgicas</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Celebração:</strong> {liturgicalData.celebration}
                </div>
                <div>
                  <strong>Tempo:</strong> {liturgicalData.seasonName}
                </div>
                <div>
                  <strong>Cor Litúrgica:</strong>
                  <span className={`ml-2 px-2 py-1 rounded text-white text-xs ${
                    liturgicalData.color === 'green' ? 'bg-green-600' :
                    liturgicalData.color === 'purple' ? 'bg-purple-600' :
                    liturgicalData.color === 'white' ? 'bg-gray-600' :
                    liturgicalData.color === 'red' ? 'bg-red-600' :
                    'bg-pink-600'
                  }`}>
                    {liturgicalData.color}
                  </span>
                </div>
                <div>
                  <strong>Rank:</strong> {liturgicalData.rank}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Músicas Sugeridas</h3>

              {Object.entries(suggestions).map(([categoria, sugestoes]: [string, any]) => (
                <div key={categoria} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3 capitalize">
                    {categoria === 'ofertorio' ? 'Ofertório' : categoria}
                  </h4>

                  <div className="space-y-2">
                    {sugestoes.slice(0, 3).map((sugestao: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            {sugestao.musicas[0].titulo}
                          </p>
                          <p className="text-sm text-gray-600">
                            {sugestao.musicas[0].compositor} • Tom: {sugestao.musicas[0].tom}
                          </p>
                          <p className="text-xs text-green-600">
                            Score: {sugestao.score}% • {sugestao.reason}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Usar
                          </Button>
                          <Button size="sm" variant="outline">
                            Ouvir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowSuggestionsModal(false)}>
                Fechar
              </Button>
              <Button onClick={() => {
                // Aqui você criaria o repertório com as sugestões
                console.log('Criando repertório com sugestões')
                setShowSuggestionsModal(false)
                alert('Repertório criado com as sugestões!')
              }}>
                Criar Repertório
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  )
}
