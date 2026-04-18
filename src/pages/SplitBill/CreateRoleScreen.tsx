import { useState } from 'react';
import { Plus, ArrowLeft, Camera, Minus } from 'lucide-react';
import { SplitRole, Participant } from './types';
import { format } from 'date-fns';

interface CreateRoleScreenProps {
  onBack: () => void;
  onCreate: (role: SplitRole) => void;
}

export default function CreateRoleScreen({ onBack, onCreate }: CreateRoleScreenProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [emoji, setEmoji] = useState('🍻');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 'me', name: 'Eu', isMe: true }
  ]);
  const [newPersonName, setNewPersonName] = useState('');

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      setParticipants([...participants, { id: Date.now().toString(), name: newPersonName.trim() }]);
      setNewPersonName('');
    }
  };

  const handleRemovePerson = (id: string) => {
    if (id === 'me') return;
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    const role: SplitRole = {
      id: Date.now().toString(),
      title,
      date: format(new Date(date), 'dd/MM/yyyy'),
      emoji,
      participants,
      expenses: [],
      createdAt: new Date().toISOString()
    };
    onCreate(role);
  };

  return (
    <div className="flex flex-col h-full bg-white md:rounded-3xl max-w-md w-full mx-auto md:mt-10 p-6 shadow-sm border border-neutral-100 overflow-y-auto">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="text-neutral-500 font-semibold text-sm hover:text-neutral-800 transition-colors">
          Cancelar
        </button>
        <h2 className="text-xl font-bold text-neutral-1100">Novo Rolê</h2>
      </div>

      <div className="space-y-6 flex-1">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-base font-semibold text-neutral-500">Título</label>
          <div className="flex gap-2 w-full">
            <div className="w-16 h-14 bg-white border-2 border-neutral-200 rounded-2xl flex items-center justify-center text-2xl relative overflow-hidden shrink-0">
              <input 
                type="text" 
                value={emoji} 
                onChange={e => setEmoji(e.target.value)}
                maxLength={2}
                className="w-full h-full text-center bg-transparent outline-none absolute inset-0 z-10"
              />
              <Camera className="absolute opacity-20" size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Ex: Barzinho do Zé"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="flex-1 bg-white border-2 border-neutral-200 rounded-xl px-4 py-3 text-lg text-neutral-800 outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-base font-semibold text-neutral-500">Data do Rolê</label>
          <input 
            type="date" 
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-white border-2 border-neutral-200 rounded-xl px-4 py-3 text-lg text-neutral-800 outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* People */}
        <div className="space-y-2">
          <label className="text-base font-semibold text-neutral-500">Pessoas no rolê</label>
          <div className="bg-white border-2 border-neutral-200 rounded-xl p-4 flex flex-col gap-4">
            
            {participants.map((p, idx) => (
              <div key={p.id} className="flex flex-col">
                <div className="flex justify-between items-center py-2">
                  <span className="text-lg text-neutral-500">{p.name}</span>
                  {!p.isMe && (
                    <button onClick={() => handleRemovePerson(p.id)} className="text-red-500 hover:text-red-600 p-1">
                      <Minus size={20} />
                    </button>
                  )}
                </div>
                {idx < participants.length - 1 && <hr className="border-neutral-100" />}
              </div>
            ))}
            
            <hr className="border-neutral-100" />
            
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="text" 
                placeholder="Adicionar outra pessoa"
                value={newPersonName}
                onChange={e => setNewPersonName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddPerson()}
                className="flex-1 text-base text-brand-700 outline-none placeholder-brand-700/50 bg-transparent font-medium"
              />
              <button onClick={handleAddPerson} className="text-brand-700 hover:text-brand-800 p-1">
                <Plus size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-3 shrink-0 pb-4">
        <button 
          onClick={handleCreate}
          disabled={!title.trim()}
          className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-neutral-1100 font-bold py-4 px-6 rounded-2xl transition-colors"
        >
          <Plus size={24} />
          Criar novo rolê
        </button>
        
        <button 
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-neutral-200 hover:bg-neutral-50 text-neutral-1100 font-bold py-4 px-6 rounded-2xl transition-colors"
        >
          <ArrowLeft size={24} />
          Voltar
        </button>
      </div>
    </div>
  );
}
