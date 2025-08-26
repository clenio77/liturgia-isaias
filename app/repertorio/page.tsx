'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Music, Search, Filter, Plus, Edit, Copy } from 'lucide-react';

export default function RepertorioPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Estados para modais
  const [showNewRepertorioModal, setShowNewRepertorioModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRepertorio, setEditingRepertorio] = useState<any>(null);

  // Estados para novo repertório
  const [newRepertorio, setNewRepertorio] = useState({
    data: '',
    domingo: '',
    tempo: 'Tempo Comum',
    entrada: '',
    salmo: '',
    ofertorio: '',
    comunhao: '',
    final: ''
  });

  // Dados mock do repertório
  const repertorios = [
    {
      id: 1,
      data: '2024-08-26',
      tempo: 'Tempo Comum',
      domingo: '21º Domingo do Tempo Comum',
      entrada: 'Vem, Espírito Santo',
      salmo: 'Salmo 33',
      ofertorio: 'Recebe, ó Deus',
      comunhao: 'Eu sou o pão da vida',
      final: 'Ide em paz'
    },
    {
      id: 2,
      data: '2024-09-02',
      tempo: 'Tempo Comum',
      domingo: '22º Domingo do Tempo Comum',
      entrada: 'Cantai ao Senhor',
      salmo: 'Salmo 62',
      ofertorio: 'Ofertório da Paz',
      comunhao: 'Pão da Vida',
      final: 'Benção Final'
    }
  ];

  const filteredRepertorios = repertorios.filter(rep =>
    rep.domingo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.tempo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funções para ações
  const handleNewRepertorio = () => {
    if (!newRepertorio.data || !newRepertorio.domingo) {
      alert('Por favor, preencha os campos obrigatórios');
      return;
    }

    console.log('Novo repertório criado:', newRepertorio);
    // Aqui você adicionaria a lógica para salvar no backend

    setShowNewRepertorioModal(false);
    setNewRepertorio({
      data: '',
      domingo: '',
      tempo: 'Tempo Comum',
      entrada: '',
      salmo: '',
      ofertorio: '',
      comunhao: '',
      final: ''
    });
    alert('Repertório criado com sucesso!');
  };

  const handleEdit = (repertorio: any) => {
    setEditingRepertorio(repertorio);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    console.log('Editando repertório:', editingRepertorio);
    // Aqui você adicionaria a lógica para salvar no backend

    setShowEditModal(false);
    setEditingRepertorio(null);
    alert('Repertório atualizado com sucesso!');
  };

  const handleUse = (repertorio: any) => {
    console.log('Usando repertório:', repertorio.domingo);
    // Aqui você redirecionaria para a página de apresentação com este repertório
    alert(`Repertório "${repertorio.domingo}" selecionado para uso!`);
  };

  const handleCopy = (repertorio: any) => {
    const newCopy = {
      ...repertorio,
      data: '',
      domingo: `${repertorio.domingo} (Cópia)`
    };
    console.log('Copiando repertório:', newCopy);
    // Aqui você abriria o modal de novo repertório com os dados copiados
    setNewRepertorio(newCopy);
    setShowNewRepertorioModal(true);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Music className="text-blue-600" />
            Repertório Litúrgico
          </h1>
          <p className="text-gray-600">Gerencie o repertório musical das celebrações</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar repertório..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os tempos</option>
              <option value="advento">Advento</option>
              <option value="natal">Natal</option>
              <option value="quaresma">Quaresma</option>
              <option value="pascoa">Páscoa</option>
              <option value="comum">Tempo Comum</option>
            </select>

            <Button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              onClick={() => setShowNewRepertorioModal(true)}
            >
              <Plus className="h-4 w-4" />
              Novo Repertório
            </Button>
          </div>
        </div>

        {/* Lista de Repertórios */}
        <div className="grid gap-6">
          {filteredRepertorios.map((repertorio) => (
            <div key={repertorio.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{repertorio.domingo}</h3>
                  <p className="text-gray-600">{repertorio.tempo} • {new Date(repertorio.data).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 border-blue-200 hover:bg-blue-50"
                    onClick={() => handleEdit(repertorio)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600 hover:text-green-800 border-green-200 hover:bg-green-50"
                    onClick={() => handleUse(repertorio)}
                  >
                    <Music className="h-3 w-3 mr-1" />
                    Usar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-purple-600 hover:text-purple-800 border-purple-200 hover:bg-purple-50"
                    onClick={() => handleCopy(repertorio)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">Entrada</h4>
                  <p className="text-sm text-blue-600">{repertorio.entrada}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">Salmo</h4>
                  <p className="text-sm text-green-600">{repertorio.salmo}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-1">Ofertório</h4>
                  <p className="text-sm text-yellow-600">{repertorio.ofertorio}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-1">Comunhão</h4>
                  <p className="text-sm text-purple-600">{repertorio.comunhao}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-1">Final</h4>
                  <p className="text-sm text-red-600">{repertorio.final}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRepertorios.length === 0 && (
          <div className="text-center py-12">
            <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">Nenhum repertório encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou criar um novo repertório</p>
          </div>
        )}
        </div>
      </div>

      {/* Modais */}

      {/* Modal Novo Repertório */}
      <Modal
        isOpen={showNewRepertorioModal}
        onClose={() => setShowNewRepertorioModal(false)}
        title="Novo Repertório"
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Celebração *
              </label>
              <Input
                type="date"
                value={newRepertorio.data}
                onChange={(e) => setNewRepertorio({...newRepertorio, data: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domingo/Celebração *
              </label>
              <Input
                type="text"
                placeholder="Ex: 21º Domingo do Tempo Comum"
                value={newRepertorio.domingo}
                onChange={(e) => setNewRepertorio({...newRepertorio, domingo: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tempo Litúrgico
            </label>
            <Select
              value={newRepertorio.tempo}
              onChange={(e) => setNewRepertorio({...newRepertorio, tempo: e.target.value})}
            >
              <option value="Tempo Comum">Tempo Comum</option>
              <option value="Advento">Advento</option>
              <option value="Natal">Natal</option>
              <option value="Quaresma">Quaresma</option>
              <option value="Páscoa">Páscoa</option>
              <option value="Pentecostes">Pentecostes</option>
            </Select>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Músicas do Repertório</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Música de Entrada
                </label>
                <Input
                  type="text"
                  placeholder="Nome da música de entrada"
                  value={newRepertorio.entrada}
                  onChange={(e) => setNewRepertorio({...newRepertorio, entrada: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salmo Responsorial
                </label>
                <Input
                  type="text"
                  placeholder="Salmo ou música responsorial"
                  value={newRepertorio.salmo}
                  onChange={(e) => setNewRepertorio({...newRepertorio, salmo: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Música do Ofertório
                </label>
                <Input
                  type="text"
                  placeholder="Nome da música do ofertório"
                  value={newRepertorio.ofertorio}
                  onChange={(e) => setNewRepertorio({...newRepertorio, ofertorio: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Música da Comunhão
                </label>
                <Input
                  type="text"
                  placeholder="Nome da música da comunhão"
                  value={newRepertorio.comunhao}
                  onChange={(e) => setNewRepertorio({...newRepertorio, comunhao: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Música Final
                </label>
                <Input
                  type="text"
                  placeholder="Nome da música final"
                  value={newRepertorio.final}
                  onChange={(e) => setNewRepertorio({...newRepertorio, final: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowNewRepertorioModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleNewRepertorio}>
              Criar Repertório
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Editar Repertório */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Repertório"
        size="xl"
      >
        {editingRepertorio && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data da Celebração
                </label>
                <Input
                  type="date"
                  value={editingRepertorio.data}
                  onChange={(e) => setEditingRepertorio({...editingRepertorio, data: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domingo/Celebração
                </label>
                <Input
                  type="text"
                  value={editingRepertorio.domingo}
                  onChange={(e) => setEditingRepertorio({...editingRepertorio, domingo: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo Litúrgico
              </label>
              <Select
                value={editingRepertorio.tempo}
                onChange={(e) => setEditingRepertorio({...editingRepertorio, tempo: e.target.value})}
              >
                <option value="Tempo Comum">Tempo Comum</option>
                <option value="Advento">Advento</option>
                <option value="Natal">Natal</option>
                <option value="Quaresma">Quaresma</option>
                <option value="Páscoa">Páscoa</option>
                <option value="Pentecostes">Pentecostes</option>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Músicas do Repertório</h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Música de Entrada
                  </label>
                  <Input
                    type="text"
                    value={editingRepertorio.entrada}
                    onChange={(e) => setEditingRepertorio({...editingRepertorio, entrada: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salmo Responsorial
                  </label>
                  <Input
                    type="text"
                    value={editingRepertorio.salmo}
                    onChange={(e) => setEditingRepertorio({...editingRepertorio, salmo: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Música do Ofertório
                  </label>
                  <Input
                    type="text"
                    value={editingRepertorio.ofertorio}
                    onChange={(e) => setEditingRepertorio({...editingRepertorio, ofertorio: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Música da Comunhão
                  </label>
                  <Input
                    type="text"
                    value={editingRepertorio.comunhao}
                    onChange={(e) => setEditingRepertorio({...editingRepertorio, comunhao: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Música Final
                  </label>
                  <Input
                    type="text"
                    value={editingRepertorio.final}
                    onChange={(e) => setEditingRepertorio({...editingRepertorio, final: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}
