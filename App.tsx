import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import DeliveryList from './components/DeliveryList';
import DeliveryMap from './components/DeliveryMap';
import AddDeliveryModal from './components/AddDeliveryModal';
import { Delivery, DeliveryStatus } from './types';
import { INITIAL_DELIVERIES } from './constants';
import { optimizeRoute } from './utils/routeOptimizer';

const App: React.FC = () => {
  // State for deliveries
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    const saved = localStorage.getItem('volt_deliveries');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
  });

  // State for filtering and selection
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('volt_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  // Filter Logic
  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(d => d.date === selectedDateFilter);
  }, [deliveries, selectedDateFilter]);

  // Handlers
  const handleAddDelivery = (newDeliveryData: Omit<Delivery, 'id'>) => {
    const newDelivery: Delivery = {
      ...newDeliveryData,
      id: Date.now().toString(), // Simple ID generation
    };
    setDeliveries(prev => [...prev, newDelivery]);
    if (newDelivery.date === selectedDateFilter) {
      setSelectedDeliveryId(newDelivery.id);
    }
  };

  const handleUpdateStatus = (id: string, status: DeliveryStatus) => {
    setDeliveries(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const handleEditDelivery = (updatedDelivery: Delivery) => {
    setDeliveries(prev => prev.map(d => d.id === updatedDelivery.id ? updatedDelivery : d));
  };

  const handleDeleteDelivery = (id: string) => {
    setDeliveries(prev => prev.filter(d => d.id !== id));
    if (selectedDeliveryId === id) {
      setSelectedDeliveryId(null);
    }
  };

  const handleSelectDelivery = (id: string) => {
    setSelectedDeliveryId(id);
  };

  const handleOptimizeRoute = () => {
    if (filteredDeliveries.length < 2) return;

    // 1. Optimize only the currently visible list
    const optimizedList = optimizeRoute(filteredDeliveries);

    // 2. Reconstruct the full delivery list
    setDeliveries(prev => {
        const otherDateDeliveries = prev.filter(d => d.date !== selectedDateFilter);
        return [...otherDateDeliveries, ...optimizedList];
    });

    if (optimizedList.length > 0) {
        setSelectedDeliveryId(optimizedList[0].id);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50">
      <Header 
        selectedDateFilter={selectedDateFilter}
        setSelectedDateFilter={setSelectedDateFilter}
        onAddClick={() => setIsModalOpen(true)}
      />

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Column: List */}
        <div className="w-full md:w-1/3 lg:w-1/4 h-1/2 md:h-full flex flex-col z-20 shadow-2xl md:shadow-xl border-b md:border-b-0 md:border-r border-slate-200">
          <DeliveryList 
            deliveries={filteredDeliveries}
            selectedDeliveryId={selectedDeliveryId}
            onSelectDelivery={handleSelectDelivery}
            onUpdateStatus={handleUpdateStatus}
            onEditDelivery={handleEditDelivery}
            onDeleteDelivery={handleDeleteDelivery}
            onOptimizeRoute={handleOptimizeRoute}
          />
        </div>

        {/* Right Column: Map */}
        <div className="w-full md:w-2/3 lg:w-3/4 h-1/2 md:h-full relative z-0 bg-slate-200">
           {/* Map container handles its own internal layout */}
          <DeliveryMap 
            deliveries={filteredDeliveries}
            selectedDeliveryId={selectedDeliveryId}
            onSelectDelivery={handleSelectDelivery}
          />
        </div>
      </main>

      <AddDeliveryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddDelivery}
      />
    </div>
  );
};

export default App;