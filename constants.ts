import { Delivery } from './types';

// Elétrica Padrão - Pouso Alegre, MG
// Av. Pinto Cobra, 2095 (Coordinates provided in prompt)
export const STORE_LOCATION: [number, number] = [-22.2345, -45.9364];

export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: '1',
    clientName: 'Indústria Mineira de Cabos',
    address: 'Av. Ver. Antônio da Costa Rios, 1200, Pouso Alegre - MG',
    phone: '5535999999999',
    date: new Date().toISOString().split('T')[0],
    items: '50 Bobinas Fio 2.5mm, 100 Tomadas 10A',
    notes: 'Entregar na doca lateral, procurar Sr. João.',
    status: 'pending',
    lat: -22.2450,
    lng: -45.9280
  },
  {
    id: '2',
    clientName: 'Residencial Vale das Andorinhas',
    address: 'Rua Três, 45, Pouso Alegre - MG',
    phone: '5535988888888',
    date: new Date().toISOString().split('T')[0],
    items: '1 Quadro Distribuição, 12 Disjuntores DIN',
    notes: 'Cuidado com o cachorro no portão.',
    status: 'pending',
    lat: -22.2280,
    lng: -45.9420
  },
  {
    id: '3',
    clientName: 'Padaria Pão de Queijo',
    address: 'Centro, Pouso Alegre - MG',
    phone: '5535977777777',
    date: new Date().toISOString().split('T')[0],
    items: '30 Lâmpadas LED Industrial, 5 Reatores',
    notes: 'Horário comercial apenas.',
    status: 'delivered',
    lat: -22.2310, 
    lng: -45.9340
  },
  {
    id: '4',
    clientName: 'Sitio do Zé',
    address: 'Zona Rural, Pouso Alegre - MG',
    phone: '5535966666666',
    date: new Date().toISOString().split('T')[0],
    items: 'Fio 10mm para bomba d\'água',
    notes: 'Estrada de terra, portão verde.',
    status: 'pending',
    lat: -22.2600,
    lng: -45.9100
  },
  {
    id: '5',
    clientName: 'Café do Sul',
    address: 'Av. Vicente Simões, 500, Pouso Alegre - MG',
    phone: '5535955555555',
    date: new Date().toISOString().split('T')[0],
    items: 'Kit Iluminação Externa',
    notes: 'Entrada pelos fundos.',
    status: 'in-transit',
    lat: -22.2390,
    lng: -45.9390
  }
];

// Center map slightly adjusted to encompass Pouso Alegre region
export const MAP_DEFAULT_CENTER: [number, number] = [-22.2345, -45.9364];
export const MAP_DEFAULT_ZOOM = 13;