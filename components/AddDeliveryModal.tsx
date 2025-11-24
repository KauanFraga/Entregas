import React, { useState } from 'react';
import { X, Save, MapPin, AlertCircle } from 'lucide-react';
import { Delivery } from '../types';
import { MAP_DEFAULT_CENTER } from '../constants';
import { formatPhone, validatePhone } from '../utils/formatters';

interface AddDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (delivery: Omit<Delivery, 'id'>) => void;
}

interface FormErrors {
  clientName?: string;
  phone?: string;
  address?: string;
  items?: string;
}

const AddDeliveryModal: React.FC<AddDeliveryModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    address: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    items: '',
    notes: '',
    lat: '',
    lng: '',
    status: 'pending' as const
  });

  const [errors, setErrors] = useState<FormErrors>({});

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let finalValue = value;
    
    // Apply phone mask
    if (name === 'phone') {
      finalValue = formatPhone(value);
      if (finalValue.length > 15) return; // Prevent too long input
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.clientName.trim()) newErrors.clientName = 'Nome é obrigatório';
    if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório';
    if (!formData.items.trim()) newErrors.items = 'Lista de itens é obrigatória';
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido (mínimo 10 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    // Use provided coordinates or mock random offset from center for demo
    const finalLat = formData.lat ? parseFloat(formData.lat) : MAP_DEFAULT_CENTER[0] + (Math.random() - 0.5) * 0.05;
    const finalLng = formData.lng ? parseFloat(formData.lng) : MAP_DEFAULT_CENTER[1] + (Math.random() - 0.5) * 0.05;

    onSave({
      clientName: formData.clientName,
      address: formData.address,
      phone: formData.phone,
      date: formData.date,
      items: formData.items,
      notes: formData.notes,
      lat: finalLat,
      lng: finalLng,
      status: formData.status
    });
    onClose();
    // Reset form
    setFormData({
        clientName: '',
        address: '',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        items: '',
        notes: '',
        lat: '',
        lng: '',
        status: 'pending'
    });
    setErrors({});
  };

  const simulateGeo = () => {
      setFormData(prev => ({
          ...prev,
          lat: (MAP_DEFAULT_CENTER[0] + (Math.random() - 0.5) * 0.02).toFixed(6),
          lng: (MAP_DEFAULT_CENTER[1] + (Math.random() - 0.5) * 0.02).toFixed(6)
      }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Nova Entrega</h2>
            <p className="text-slate-400 text-xs">Preencha os detalhes do pedido</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-white/10 p-1 rounded-full hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Nome do Cliente <span className="text-red-500">*</span></label>
                <input
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none transition shadow-sm text-sm font-medium ${errors.clientName ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-yellow-500 focus:border-yellow-500'}`}
                    placeholder="Ex: Construtora Silva"
                />
                {errors.clientName && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.clientName}</p>}
            </div>
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Telefone <span className="text-red-500">*</span></label>
                <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none shadow-sm text-sm ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-yellow-500'}`}
                    placeholder="(35) 99999-9999"
                    maxLength={15}
                />
                {errors.phone && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.phone}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Endereço <span className="text-red-500">*</span></label>
            <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none shadow-sm text-sm ${errors.address ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-yellow-500'}`}
                placeholder="Rua, Número, Bairro"
            />
            {errors.address && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.address}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
             <div className="col-span-1 space-y-1">
                 <label className="text-[10px] font-bold text-slate-500 uppercase">Lat</label>
                 <input name="lat" value={formData.lat} onChange={handleChange} className="w-full p-2 text-xs border rounded bg-white" placeholder="-23.00" />
             </div>
             <div className="col-span-1 space-y-1">
                 <label className="text-[10px] font-bold text-slate-500 uppercase">Long</label>
                 <input name="lng" value={formData.lng} onChange={handleChange} className="w-full p-2 text-xs border rounded bg-white" placeholder="-46.00" />
             </div>
             <div className="col-span-1 flex items-end">
                 <button type="button" onClick={simulateGeo} className="w-full p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-bold flex justify-center items-center gap-1 transition-colors" title="Simular Coordenadas">
                     <MapPin size={12}/> Gerar
                 </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Data</label>
                <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none shadow-sm text-sm"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Status</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white shadow-sm text-sm"
                >
                    <option value="pending">Pendente</option>
                    <option value="in-transit">Saiu para Entrega</option>
                    <option value="delivered">Entregue</option>
                </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Itens <span className="text-red-500">*</span></label>
            <textarea
                name="items"
                rows={2}
                value={formData.items}
                onChange={handleChange}
                className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none resize-none shadow-sm text-sm ${errors.items ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-yellow-500'}`}
                placeholder="Ex: 100m Cabo Flexível 2.5mm..."
            />
            {errors.items && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.items}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Observações</label>
            <input
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none shadow-sm text-sm"
                placeholder="Ex: Portaria lateral..."
            />
          </div>

          <div className="pt-4 flex gap-4 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-yellow-500/30 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeliveryModal;