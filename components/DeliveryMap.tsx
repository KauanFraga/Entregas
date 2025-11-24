import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Delivery, MapViewProps } from '../types';
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM, STORE_LOCATION } from '../constants';
import { MapPin, Warehouse, PackageCheck, Truck, Clock } from 'lucide-react';

// --- Icons Configuration ---

const createStoreIcon = () => {
  const html = `
    <div class="relative flex items-center justify-center w-12 h-12">
      <div class="bg-indigo-900 w-10 h-10 rounded-xl shadow-2xl border-2 border-white flex items-center justify-center z-20">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>
      <div class="absolute -bottom-2 w-8 h-2 bg-black/30 rounded-[100%] blur-[2px]"></div>
    </div>
  `;
  return L.divIcon({
    className: 'custom-store-icon',
    html: html,
    iconSize: [48, 48],
    iconAnchor: [24, 44],
    popupAnchor: [0, -44]
  });
};

const CreateCustomIcon = (status: string, isSelected: boolean, index: number) => {
  let bgColor = '';
  switch (status) {
    case 'pending': bgColor = 'bg-yellow-500'; break;
    case 'in-transit': bgColor = 'bg-blue-600'; break;
    case 'delivered': bgColor = 'bg-green-600'; break;
    default: bgColor = 'bg-slate-500';
  }

  const scale = isSelected ? 'scale-125 z-50' : 'scale-100 z-10';
  const ring = isSelected ? 'ring-4 ring-slate-900/30' : 'shadow-lg';

  const html = `
    <div class="relative flex flex-col items-center justify-center w-10 h-12 transition-transform duration-300 origin-bottom ${scale}">
      <div class="${bgColor} w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm border-2 border-white ${ring}">
        ${index + 1}
      </div>
      <div class="w-0.5 h-3 bg-slate-400/80"></div>
      <div class="w-2 h-0.5 bg-slate-400/50 rounded-full mt-[1px]"></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-marker-icon',
    html: html,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48]
  });
};

// --- Helper Components ---

const MapUpdater: React.FC<{ selectedDelivery: Delivery | undefined }> = ({ selectedDelivery }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedDelivery) {
      map.flyTo([selectedDelivery.lat, selectedDelivery.lng], 16, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [selectedDelivery, map]);
  return null;
};

// --- Main Component ---

const DeliveryMap: React.FC<MapViewProps> = ({ deliveries, selectedDeliveryId, onSelectDelivery }) => {
  const selectedDelivery = deliveries.find(d => d.id === selectedDeliveryId);

  // Stats Calculation
  const stats = useMemo(() => {
    return {
      pending: deliveries.filter(d => d.status === 'pending').length,
      inTransit: deliveries.filter(d => d.status === 'in-transit').length,
      delivered: deliveries.filter(d => d.status === 'delivered').length,
    };
  }, [deliveries]);

  const routePositions: [number, number][] = [
    STORE_LOCATION, 
    ...deliveries.map(d => [d.lat, d.lng] as [number, number])
  ];

  return (
    <div className="h-full w-full relative group">
      <MapContainer
        center={MAP_DEFAULT_CENTER}
        zoom={MAP_DEFAULT_ZOOM}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater selectedDelivery={selectedDelivery} />

        {/* Route Line */}
        <Polyline 
          positions={routePositions} 
          pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.7, dashArray: '10, 15', lineCap: 'round' }} 
        />

        {/* Markers */}
        <Marker position={STORE_LOCATION} icon={createStoreIcon()}>
          <Popup className="custom-popup">
            <div className="font-bold text-slate-900">Loja: Elétrica Padrão</div>
            <div className="text-xs text-slate-600">Av. Pinto Cobra, 2095</div>
          </Popup>
        </Marker>

        {deliveries.map((delivery, index) => (
          <Marker
            key={delivery.id}
            position={[delivery.lat, delivery.lng]}
            icon={CreateCustomIcon(delivery.status, delivery.id === selectedDeliveryId, index)}
            eventHandlers={{ click: () => onSelectDelivery(delivery.id) }}
          >
             <Popup className="custom-popup">
               <div className="min-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                     <span className="bg-slate-900 text-yellow-400 text-xs font-bold px-1.5 rounded">#{index + 1}</span>
                     <h4 className="font-bold text-slate-900">{delivery.clientName}</h4>
                  </div>
                  <p className="text-xs text-slate-600 mb-2 flex items-center gap-1">
                     <MapPin size={10} /> {delivery.address}
                  </p>
                  {delivery.notes && (
                    <div className="bg-yellow-50 p-2 rounded text-xs border border-yellow-100 mb-2 text-slate-700 italic">
                      "{delivery.notes}"
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-xs font-semibold uppercase text-slate-500">{delivery.status}</span>
                     <a href={`https://wa.me/${delivery.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-green-600 font-bold text-xs">WhatsApp</a>
                  </div>
               </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* --- Floating Legend Card (Top Right) --- */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-slate-100 z-[1000] animate-in fade-in slide-in-from-right-4 duration-500">
        <h5 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">Legenda do Mapa</h5>
        <div className="space-y-2.5">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-indigo-900 flex items-center justify-center border-2 border-slate-100 shadow-sm">
                <Warehouse size={14} className="text-white" />
             </div>
             <span className="text-sm font-bold text-slate-700">Loja (Início)</span>
           </div>
           
           <div className="w-full h-px bg-slate-100 my-1"></div>

           <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-white shadow-sm flex items-center justify-center">
                <span className="text-[10px] text-slate-900 font-bold">1</span>
             </div>
             <span className="text-xs font-medium text-slate-600">Pendente</span>
           </div>
           <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-sm flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">2</span>
             </div>
             <span className="text-xs font-medium text-slate-600">Em Rota</span>
           </div>
           <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-green-600 border-2 border-white shadow-sm flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">3</span>
             </div>
             <span className="text-xs font-medium text-slate-600">Entregue</span>
           </div>
        </div>
      </div>

      {/* --- Bottom Stats Dashboard --- */}
      <div className="absolute bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-3/4 max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 z-[1000] animate-in slide-in-from-bottom-6 duration-700">
        <div className="grid grid-cols-3 divide-x divide-slate-100">
            {/* Pending Stat */}
            <div className="p-4 flex flex-col items-center justify-center group/stat cursor-default">
                <div className="flex items-center gap-1.5 mb-1 text-yellow-600">
                    <Clock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pendentes</span>
                </div>
                <span className="text-3xl font-black text-slate-800 group-hover/stat:text-yellow-500 transition-colors">{stats.pending}</span>
            </div>

            {/* In-Transit Stat */}
             <div className="p-4 flex flex-col items-center justify-center group/stat cursor-default">
                <div className="flex items-center gap-1.5 mb-1 text-blue-600">
                    <Truck size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Em Rota</span>
                </div>
                <span className="text-3xl font-black text-slate-800 group-hover/stat:text-blue-600 transition-colors">{stats.inTransit}</span>
            </div>

            {/* Delivered Stat */}
             <div className="p-4 flex flex-col items-center justify-center group/stat cursor-default">
                <div className="flex items-center gap-1.5 mb-1 text-green-600">
                    <PackageCheck size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Concluídas</span>
                </div>
                <span className="text-3xl font-black text-slate-800 group-hover/stat:text-green-600 transition-colors">{stats.delivered}</span>
            </div>
        </div>
      </div>

    </div>
  );
};

export default DeliveryMap;