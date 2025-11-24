export type DeliveryStatus = 'pending' | 'in-transit' | 'delivered';

export interface Delivery {
  id: string;
  clientName: string;
  address: string;
  phone: string;
  date: string; // YYYY-MM-DD
  items: string;
  notes?: string;
  status: DeliveryStatus;
  lat: number;
  lng: number;
}

export interface MapViewProps {
  deliveries: Delivery[];
  selectedDeliveryId: string | null;
  onSelectDelivery: (id: string) => void;
}

export interface DeliveryListProps {
  deliveries: Delivery[];
  onSelectDelivery: (id: string) => void;
  onUpdateStatus: (id: string, status: DeliveryStatus) => void;
  onEditDelivery: (delivery: Delivery) => void;
  onDeleteDelivery: (id: string) => void;
  selectedDeliveryId: string | null;
}