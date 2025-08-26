'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Settings, User, Bell, Shield, Database, Palette, Globe } from 'lucide-react';

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('perfil');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    repertorio: true,
    backup: true
  });

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'sistema', label: 'Sistema', icon: Database },
    { id: 'aparencia', label: 'Aparência', icon: Palette },
    { id: 'integracao', label: 'Integração', icon: Globe }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-6">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Settings className="text-blue-600" />
            Configurações
          </h1>
          <p className="text-gray-600">Personalize o sistema conforme suas necessidades</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu Lateral */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {activeTab === 'perfil' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Informações do Perfil</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                      <input
                        type="text"
                        defaultValue="Pe. João Silva"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="pe.joao@paroquia.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Paróquia</label>
                      <input
                        type="text"
                        defaultValue="Paróquia São José"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Função</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Padre</option>
                        <option>Diácono</option>
                        <option>Ministro de Música</option>
                        <option>Coordenador</option>
                      </select>
                    </div>
                  </div>
                  <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Salvar Alterações
                  </button>
                </div>
              )}

              {activeTab === 'notificacoes' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Preferências de Notificação</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">Notificações por Email</h3>
                        <p className="text-sm text-gray-600">Receber atualizações por email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.email}
                          onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">Notificações Push</h3>
                        <p className="text-sm text-gray-600">Receber notificações no navegador</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.push}
                          onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">Lembretes de Repertório</h3>
                        <p className="text-sm text-gray-600">Lembrar de preparar repertório</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.repertorio}
                          onChange={(e) => setNotifications({...notifications, repertorio: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'seguranca' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Segurança</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-4">Alterar Senha</h3>
                      <div className="grid grid-cols-1 gap-4 max-w-md">
                        <input
                          type="password"
                          placeholder="Senha atual"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="password"
                          placeholder="Nova senha"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="password"
                          placeholder="Confirmar nova senha"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Alterar Senha
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sistema' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Configurações do Sistema</h2>
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-800 mb-2">Backup Automático</h3>
                      <p className="text-sm text-blue-600 mb-4">Último backup: 25/08/2024 às 14:30</p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Fazer Backup Agora
                      </button>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-medium text-green-800 mb-2">Exportar Dados</h3>
                      <p className="text-sm text-green-600 mb-4">Exportar repertório e músicas</p>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Exportar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'aparencia' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personalização</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-4">Tema</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="border-2 border-blue-500 rounded-lg p-4 cursor-pointer">
                          <div className="bg-blue-500 h-8 rounded mb-2"></div>
                          <p className="text-sm text-center">Azul (Atual)</p>
                        </div>
                        <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-purple-500">
                          <div className="bg-purple-500 h-8 rounded mb-2"></div>
                          <p className="text-sm text-center">Roxo</p>
                        </div>
                        <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green-500">
                          <div className="bg-green-500 h-8 rounded mb-2"></div>
                          <p className="text-sm text-center">Verde</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'integracao' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Integrações</h2>
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-800 mb-2">Google Drive</h3>
                      <p className="text-sm text-gray-600 mb-4">Sincronizar músicas com Google Drive</p>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        Conectar
                      </button>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-800 mb-2">Dropbox</h3>
                      <p className="text-sm text-gray-600 mb-4">Backup automático no Dropbox</p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Conectar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </AppLayout>
  );
}
