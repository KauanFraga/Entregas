import React, { useState, useEffect } from 'react';
import { Delivery, DeliveryListProps } from '../types';
import DeliveryCard from './DeliveryCard';
import { PackageX, Map, Check } from 'lucide-react';

interface ExtendedDeliveryListProps extends DeliveryListProps {
  onOptimizeRoute: () => void;
}

const DeliveryList: React.FC<ExtendedDeliveryListProps> = ({ 
  deliveries, 
  onSelectDelivery, 
  selectedDeliveryId,
  onUpdateStatus,
  onEditDelivery,
  onDeleteDelivery,
  onOptimizeRoute
}) => {
  const [justOptimized, setJustOptimized] = useState(false);

  const handleOptimize = () => {
    onOptimizeRoute();
    setJustOptimized(true);
  };

  useEffect(() => {
    if(justOptimized) {
      const timer = setTimeout(() => setJustOptimized(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [justOptimized]);

  if (deliveries.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center animate-in fade-in zoom-in-95">
        <div className="bg-slate-100 p-6 rounded-full mb-4">
           <PackageX size={48} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-600">Sem entregas</h3>
        <p className="text-sm mt-1">Agende uma nova entrega clicando no botão (+).</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50/50 relative">
      {/* List Header */}
      <div className="px-5 py-4 bg-white border-b border-slate-200 shadow-sm z-10 sticky top-0 flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {deliveries.length} Entregas Hoje
        </span>
        <span className="text-[10px] text-slate-400 font-medium">
            Arraste para ver mais
        </span>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
        {deliveries.map((delivery, index) => (
          <DeliveryCard
            key={delivery.id}
            index={index}
            delivery={delivery}
            isSelected={selectedDeliveryId === delivery.id}
            onClick={() => onSelectDelivery(delivery.id)}
            onUpdateStatus={onUpdateStatus}
            onEdit={onEditDelivery}
            onDelete={onDeleteDelivery}
          />
        ))}
      </div>

      {/* Sticky Bottom Optimize Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-slate-200 z-20">
        <button 
          onClick={handleOptimize}
          disabled={justOptimized}
          className={`
            w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95
            ${justOptimized 
                ? 'bg-green-600 text-white shadow-green-600/30 cursor-default' 
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20 group'}
          `}
        >
          {justOptimized ? (
            <>
                <Check size={18} className="animate-bounce" /> Rota Otimizada!
            </>
          ) : (
            <>
                <Map size={18} className="text-yellow-400 group-hover:rotate-12 transition-transform"/> Otimizar Rota (Vizinho Mais Próximo)
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeliveryList;