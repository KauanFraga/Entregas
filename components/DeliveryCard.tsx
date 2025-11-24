import React, { useState } from 'react';
import { MapPin, Phone, Package, MessageSquare, CheckCircle, Clock, Truck, ExternalLink, Edit2, Trash2, X, Save, Check } from 'lucide-react';
import { Delivery, DeliveryStatus } from '../types';
import { cleanPhoneForAPI, formatPhone } from '../utils/formatters';

interface DeliveryCardProps {
  delivery: Delivery;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onUpdateStatus: (id: string, status: DeliveryStatus) => void;
  onEdit: (delivery: Delivery) => void;
  onDelete: (id: string) => void;
}

const getStatusConfig = (status: DeliveryStatus) => {
  switch (status) {
    case 'pending':
      return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, label: 'Pendente' };
    case 'in-transit':
      return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Truck, label: 'Em Rota' };
    case 'delivered':
      return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, label: 'Entregue' };
  }
};

const DeliveryCard: React.FC<DeliveryCardProps> = ({ 
  delivery, 
  index, 
  isSelected, 
  onClick, 
  onUpdateStatus,
  onEdit,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Delivery>(delivery);

  const { color, icon: StatusIcon, label } = getStatusConfig(delivery.status);

  // --- Handlers ---

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const apiPhone = cleanPhoneForAPI(delivery.phone);
    const message = encodeURIComponent(`Olá, tudo bem? Somos da Elétrica Padrão. Estamos com sua entrega a caminho! 🚚`);
    window.open(`https://wa.me/${apiPhone}?text=${message}`, '_blank');
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    onUpdateStatus(delivery.id, e.target.value as DeliveryStatus);
  };

  const handleQuickComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateStatus(delivery.id, 'delivered');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Deseja realmente excluir esta entrega permanentemente?')) {
      onDelete(delivery.id);
    }
  };

  const toggleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditForm(delivery); // Reset form to current props
    setIsEditing(true);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditForm(delivery);
  };

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(!editForm.clientName || !editForm.address) {
        alert("Nome e endereço são obrigatórios");
        return;
    }
    onEdit(editForm);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let finalValue = value;
    
    if (name === 'phone') {
        finalValue = formatPhone(value);
        if (finalValue.length > 15) return;
    }

    setEditForm(prev => ({ ...prev, [name]: finalValue }));
  };

  // --- RENDER: EDIT MODE ---
  if (isEditing) {
    return (
      <div className="relative p-5 rounded-xl border border-blue-400 bg-blue-50/50 shadow-lg cursor-default animate-in fade-in zoom-in-95 duration-200">
         <div className="space-y-4">
            <div className="flex gap-3">
                <div className="flex-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Nome do Cliente <span className="text-red-500">*</span></label>
                    <input 
                        name="clientName"
                        value={editForm.clientName}
                        onChange={handleInputChange}
                        className="w-full text-sm font-bold p-2 rounded border border-slate-300 focus:border-blue-500 outline-none shadow-sm" 
                    />
                </div>
                <div className="w-1/3">
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Telefone</label>
                    <input 
                        name="phone"
                        value={editForm.phone}
                        onChange={handleInputChange}
                        className="w-full text-sm p-2 rounded border border-slate-300 focus:border-blue-500 outline-none shadow-sm" 
                    />
                </div>
            </div>

            <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Endereço <span className="text-red-500">*</span></label>
                <input 
                    name="address"
                    value={editForm.address}
                    onChange={handleInputChange}
                    className="w-full text-sm p-2 rounded border border-slate-300 focus:border-blue-500 outline-none shadow-sm" 
                />
            </div>

            <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Itens</label>
                <input 
                    name="items"
                    value={editForm.items}
                    onChange={handleInputChange}
                    className="w-full text-sm p-2 rounded border border-slate-300 focus:border-blue-500 outline-none shadow-sm" 
                />
            </div>

            <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Observações</label>
                <textarea 
                    name="notes"
                    value={editForm.notes}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full text-sm p-2 rounded border border-slate-300 focus:border-blue-500 outline-none resize-none shadow-sm" 
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button onClick={handleSaveEdit} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
                    <Save size={16} /> Salvar
                </button>
                <button onClick={handleCancelEdit} className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
                    <X size={16} /> Cancelar
                </button>
            </div>
         </div>
      </div>
    );
  }

  // --- RENDER: VIEW MODE ---
  return (
    <div 
      onClick={onClick}
      className={`
        relative p-5 rounded-xl border transition-all duration-300 cursor-pointer group
        hover:shadow-xl hover:-translate-y-1
        ${isSelected 
          ? 'bg-white border-slate-900 shadow-lg ring-2 ring-slate-900' 
          : 'bg-white border-slate-200 hover:border-yellow-400'}
      `}
    >
      {/* Header: Sequence, Name, Status */}
      <div className="flex gap-4 mb-3">
        {/* Sequence Number */}
        <div className={`
          flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm flex-shrink-0 transition-colors duration-300
          ${isSelected ? 'bg-slate-900 text-yellow-400' : 'bg-slate-100 text-slate-500 group-hover:bg-yellow-400 group-hover:text-slate-900'}
        `}>
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-slate-900 text-lg leading-tight truncate pr-2">{delivery.clientName}</h3>
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm ${color} flex-shrink-0`}>
              <StatusIcon size={12} />
              {label}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
             <MapPin size={14} className="flex-shrink-0 text-slate-400" />
             <p className="truncate font-medium">{delivery.address}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="space-y-3 pl-12">
        <div className="flex items-start gap-2.5 group-hover:text-slate-900 transition-colors">
          <Package size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="font-medium text-sm text-slate-600 leading-snug">{delivery.items}</p>
        </div>

        {delivery.notes && (
          <div className="flex items-start gap-2 mt-2 bg-yellow-50 p-3 rounded-r-md border-l-4 border-yellow-400 text-slate-700 text-sm">
            <MessageSquare size={16} className="mt-0.5 flex-shrink-0 text-yellow-600" />
            <p className="leading-snug italic">{delivery.notes}</p>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center gap-2 pl-12 opacity-80 group-hover:opacity-100 transition-opacity">
         
         <div className="flex gap-2">
            <button 
                onClick={handleWhatsApp}
                className="flex items-center gap-1.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200"
                title="Abrir WhatsApp"
            >
            <Phone size={14} />
            <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* Edit Button */}
            <button 
                onClick={toggleEdit}
                className="flex items-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200"
                title="Editar Entrega"
            >
                <Edit2 size={14} />
            </button>

            {/* Delete Button */}
            <button 
                onClick={handleDelete}
                className="flex items-center gap-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200"
                title="Excluir Entrega"
            >
                <Trash2 size={14} />
            </button>
         </div>

         {/* Status / Complete Action */}
         <div className="flex items-center gap-2">
            {delivery.status === 'pending' && (
                <button 
                    onClick={handleQuickComplete}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-colors shadow-sm"
                    title="Marcar como Entregue"
                >
                    <Check size={12} /> Concluir
                </button>
            )}
            
            <div className="relative" onClick={(e) => e.stopPropagation()}>
                <select
                value={delivery.status}
                onChange={handleStatusChange}
                className="appearance-none bg-slate-100 hover:bg-slate-200 border-none text-slate-700 text-xs rounded-md py-1.5 pl-3 pr-7 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer font-bold transition-colors"
                >
                <option value="pending">Pendente</option>
                <option value="in-transit">Em Rota</option>
                <option value="delivered">Entregue</option>
                </select>
                <ExternalLink size={10} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default DeliveryCard;