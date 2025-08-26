'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Users, Search, Plus, Edit, Trash2, Shield, Mail, Phone } from 'lucide-react';

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // Dados mock dos usuários
  const usuarios = [
    {
      id: 1,
      nome: 'Pe. João Silva',
      email: 'pe.joao@paroquia.com',
      telefone: '(11) 99999-9999',
      funcao: 'Padre',
      paroquia: 'Paróquia São José',
      status: 'Ativo',
      ultimoAcesso: '2024-08-26 14:30'
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@liturgia.com',
      telefone: '(11) 88888-8888',
      funcao: 'Ministra de Música',
      paroquia: 'Paróquia São José',
      status: 'Ativo',
      ultimoAcesso: '2024-08-26 10:15'
    },
    {
      id: 3,
      nome: 'Admin Sistema',
      email: 'admin@liturgia.com',
      telefone: '(11) 77777-7777',
      funcao: 'Administrador',
      paroquia: 'Sistema',
      status: 'Ativo',
      ultimoAcesso: '2024-08-26 16:45'
    }
  ];

  const filteredUsuarios = usuarios.filter(usuario => 
    usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (selectedRole === '' || usuario.funcao === selectedRole)
  );

  const getRoleColor = (funcao: string) => {
    switch (funcao) {
      case 'Administrador':
        return 'bg-red-100 text-red-800';
      case 'Padre':
        return 'bg-purple-100 text-purple-800';
      case 'Ministra de Música':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Ativo' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Users className="text-indigo-600" />
            Gerenciar Usuários
          </h1>
          <p className="text-gray-600">Administre usuários e permissões do sistema</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Todas as funções</option>
              <option value="Administrador">Administrador</option>
              <option value="Padre">Padre</option>
              <option value="Ministra de Música">Ministra de Música</option>
              <option value="Coordenador">Coordenador</option>
            </select>

            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Usuário
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-800">{usuarios.length}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {usuarios.filter(u => u.status === 'Ativo').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Padres</p>
                <p className="text-2xl font-bold text-purple-600">
                  {usuarios.filter(u => u.funcao === 'Padre').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ministros</p>
                <p className="text-2xl font-bold text-blue-600">
                  {usuarios.filter(u => u.funcao.includes('Ministra')).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Função
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Acesso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{usuario.nome}</div>
                        <div className="text-sm text-gray-500">{usuario.paroquia}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          {usuario.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          {usuario.telefone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(usuario.funcao)}`}>
                        {usuario.funcao}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(usuario.status)}`}>
                        {usuario.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(usuario.ultimoAcesso).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsuarios.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou adicionar um novo usuário</p>
          </div>
        )}
        </div>
      </div>
    </AppLayout>
  );
}
