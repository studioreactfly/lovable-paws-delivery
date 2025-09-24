export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed?: string;
  weight?: number;
  specialInstructions?: string;
  photo?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export interface DeliveryLocation {
  id: string;
  type: 'pickup' | 'delivery';
  customer: Customer;
  address: Customer['address'];
  scheduledTime?: Date;
  completedTime?: Date;
  notes?: string;
  photos?: string[];
  signature?: string;
}

export type DeliveryStatus = 
  | 'pending'      // Aguardando coleta
  | 'collected'    // Pet coletado
  | 'in_transit'   // Em trânsito
  | 'delivered'    // Entregue
  | 'cancelled'    // Cancelado
  | 'delayed';     // Atrasado

export interface Delivery {
  id: string;
  pet: Pet;
  status: DeliveryStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  pickup: DeliveryLocation;
  delivery: DeliveryLocation;
  
  scheduledDate: Date;
  estimatedDuration: number; // em minutos
  actualDuration?: number;
  
  distance: number; // em km
  price: number;
  
  driverNotes?: string;
  customerNotes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryMetrics {
  today: {
    deliveries: number;
    completed: number;
    revenue: number;
    distance: number;
  };
  week: {
    deliveries: number;
    completed: number;
    revenue: number;
    distance: number;
  };
  month: {
    deliveries: number;
    completed: number;
    revenue: number;
    distance: number;
  };
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  vehicle: {
    type: 'car' | 'motorcycle' | 'bicycle' | 'van';
    plate: string;
    model: string;
    color: string;
  };
  currentLocation?: {
    lat: number;
    lng: number;
    timestamp: Date;
  };
  isOnline: boolean;
  metrics: DeliveryMetrics;
}