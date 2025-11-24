import React from 'react';
import { Plus, Calendar, Zap } from 'lucide-react';

interface HeaderProps {
  selectedDateFilter: string;
  setSelectedDateFilter: (date: string) => void;
  onAddClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ selectedDateFilter, setSelectedDateFilter, onAddClick }) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <header className="bg-slate-900 text-white shadow-lg z-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500 rounded-lg text-slate-900 shadow-lg shadow-yellow-500/20">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 leading-none">VoltLogística</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">Controle de Entregas</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setSelectedDateFilter(today)}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
              selectedDateFilter === today
                ? 'bg-slate-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Hoje
          </button>
          <button
            onClick={() => setSelectedDateFilter(tomorrow)}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
              selectedDateFilter === tomorrow
                ? 'bg-slate-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Amanhã
          </button>
          <div className="relative flex items-center px-2 border-l border-slate-700">
             <Calendar size={14} className="absolute left-4 text-slate-400" />
             <input 
                type="date" 
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="bg-transparent border-none text-slate-200 text-sm focus:ring-0 focus:outline-none pl-8 py-1 cursor-pointer font-medium"
             />
          </div>
        </div>

        <button
          onClick={onAddClick}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md hover:shadow-yellow-500/30 active:transform active:scale-95"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Nova Entrega</span>
        </button>
      </div>
      
      {/* Mobile Date Filter */}
      <div className="md:hidden flex p-3 bg-slate-800 overflow-x-auto gap-3 border-t border-slate-700">
         <button
            onClick={() => setSelectedDateFilter(today)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${selectedDateFilter === today ? 'bg-yellow-500 text-slate-900' : 'text-slate-300 bg-slate-700'}`}
          >
            Hoje
          </button>
          <button
            onClick={() => setSelectedDateFilter(tomorrow)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${selectedDateFilter === tomorrow ? 'bg-yellow-500 text-slate-900' : 'text-slate-300 bg-slate-700'}`}
          >
            Amanhã
          </button>
           <input 
                type="date" 
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="flex-shrink-0 bg-slate-700 text-slate-200 text-xs rounded-full px-4 py-1.5 border-none w-auto font-medium"
             />
      </div>
    </header>
  );
};

export default Header;