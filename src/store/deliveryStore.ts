import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Delivery, DeliveryStatus, Driver, DeliveryMetrics } from '@/types/delivery';

interface DeliveryStore {
  // State
  deliveries: Delivery[];
  driver: Driver | null;
  isLoading: boolean;
  selectedDelivery: Delivery | null;
  
  // Actions
  setDeliveries: (deliveries: Delivery[]) => void;
  setDriver: (driver: Driver) => void;
  updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus) => void;
  selectDelivery: (delivery: Delivery | null) => void;
  addDelivery: (delivery: Delivery) => void;
  removeDelivery: (deliveryId: string) => void;
  setLoading: (loading: boolean) => void;
  
  // Computed values
  getDeliveriesByStatus: (status: DeliveryStatus) => Delivery[];
  getTodayMetrics: () => DeliveryMetrics['today'];
  getPendingDeliveries: () => Delivery[];
  getActiveDeliveries: () => Delivery[];
}

// Mock data
const mockDriver: Driver = {
  id: '1',
  name: 'João Silva',
  email: 'joao@petdelivery.com',
  phone: '(11) 99999-9999',
  avatar: '',
  vehicle: {
    type: 'car',
    plate: 'ABC-1234',
    model: 'Honda Civic',
    color: 'Branco'
  },
  isOnline: true,
  metrics: {
    today: { deliveries: 8, completed: 6, revenue: 480, distance: 45 },
    week: { deliveries: 42, completed: 38, revenue: 2850, distance: 280 },
    month: { deliveries: 156, completed: 142, revenue: 11400, distance: 1120 }
  }
};

const mockDeliveries: Delivery[] = [
  {
    id: '1',
    pet: {
      id: 'p1',
      name: 'Rex',
      type: 'dog',
      breed: 'Golden Retriever',
      weight: 25,
      specialInstructions: 'Cão muito amigável, gosta de carinho'
    },
    status: 'pending',
    priority: 'high',
    pickup: {
      id: 'pickup1',
      type: 'pickup',
      customer: {
        id: 'c1',
        name: 'Maria Santos',
        phone: '(11) 98888-8888',
        email: 'maria@email.com',
        address: {
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Vila Madalena',
          city: 'São Paulo',
          zipCode: '05433-000',
          coordinates: { lat: -23.5489, lng: -46.6388 }
        }
      },
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Vila Madalena',
        city: 'São Paulo',
        zipCode: '05433-000',
        coordinates: { lat: -23.5489, lng: -46.6388 }
      },
      scheduledTime: new Date('2024-01-15T09:00:00')
    },
    delivery: {
      id: 'delivery1',
      type: 'delivery',
      customer: {
        id: 'c2',
        name: 'Pet Shop Central',
        phone: '(11) 97777-7777',
        address: {
          street: 'Av. Paulista',
          number: '1000',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          zipCode: '01310-100',
          coordinates: { lat: -23.5618, lng: -46.6565 }
        }
      },
      address: {
        street: 'Av. Paulista',
        number: '1000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        zipCode: '01310-100',
        coordinates: { lat: -23.5618, lng: -46.6565 }
      },
      scheduledTime: new Date('2024-01-15T10:30:00')
    },
    scheduledDate: new Date('2024-01-15T09:00:00'),
    estimatedDuration: 90,
    distance: 8.5,
    price: 75,
    customerNotes: 'Pet precisa tomar medicação às 11h',
    createdAt: new Date('2024-01-14T15:30:00'),
    updatedAt: new Date('2024-01-14T15:30:00')
  },
  {
    id: '2',
    pet: {
      id: 'p2',
      name: 'Luna',
      type: 'cat',
      breed: 'Persa',
      weight: 4,
      specialInstructions: 'Gata tímida, usar transportadora'
    },
    status: 'collected',
    priority: 'medium',
    pickup: {
      id: 'pickup2',
      type: 'pickup',
      customer: {
        id: 'c3',
        name: 'Carlos Oliveira',
        phone: '(11) 96666-6666',
        address: {
          street: 'Rua Augusta',
          number: '456',
          neighborhood: 'Consolação',
          city: 'São Paulo',
          zipCode: '01305-000',
          coordinates: { lat: -23.5556, lng: -46.6624 }
        }
      },
      address: {
        street: 'Rua Augusta',
        number: '456',
        neighborhood: 'Consolação',
        city: 'São Paulo',
        zipCode: '01305-000',
        coordinates: { lat: -23.5556, lng: -46.6624 }
      },
      scheduledTime: new Date('2024-01-15T08:30:00'),
      completedTime: new Date('2024-01-15T08:35:00')
    },
    delivery: {
      id: 'delivery2',
      type: 'delivery',
      customer: {
        id: 'c4',
        name: 'Clínica Veterinária Vida',
        phone: '(11) 95555-5555',
        address: {
          street: 'Rua Teodoro Sampaio',
          number: '789',
          neighborhood: 'Pinheiros',
          city: 'São Paulo',
          zipCode: '05405-000',
          coordinates: { lat: -23.5647, lng: -46.6925 }
        }
      },
      address: {
        street: 'Rua Teodoro Sampaio',
        number: '789',
        neighborhood: 'Pinheiros',
        city: 'São Paulo',
        zipCode: '05405-000',
        coordinates: { lat: -23.5647, lng: -46.6925 }
      },
      scheduledTime: new Date('2024-01-15T10:00:00')
    },
    scheduledDate: new Date('2024-01-15T08:30:00'),
    estimatedDuration: 60,
    distance: 6.2,
    price: 50,
    createdAt: new Date('2024-01-14T14:20:00'),
    updatedAt: new Date('2024-01-15T08:35:00')
  },
  {
    id: '3',
    pet: {
      id: 'p3',
      name: 'Charlie',
      type: 'dog',
      breed: 'Bulldog',
      weight: 18,
      specialInstructions: 'Cuidado com o calor, oferecer água'
    },
    status: 'delivered',
    priority: 'low',
    pickup: {
      id: 'pickup3',
      type: 'pickup',
      customer: {
        id: 'c5',
        name: 'Ana Costa',
        phone: '(11) 94444-4444',
        address: {
          street: 'Rua da Consolação',
          number: '234',
          neighborhood: 'Centro',
          city: 'São Paulo',
          zipCode: '01301-000',
          coordinates: { lat: -23.5431, lng: -46.6291 }
        }
      },
      address: {
        street: 'Rua da Consolação',
        number: '234',
        neighborhood: 'Centro',
        city: 'São Paulo',
        zipCode: '01301-000',
        coordinates: { lat: -23.5431, lng: -46.6291 }
      },
      scheduledTime: new Date('2024-01-15T07:00:00'),
      completedTime: new Date('2024-01-15T07:10:00')
    },
    delivery: {
      id: 'delivery3',
      type: 'delivery',
      customer: {
        id: 'c6',
        name: 'Roberto Lima',
        phone: '(11) 93333-3333',
        address: {
          street: 'Av. Faria Lima',
          number: '567',
          neighborhood: 'Itaim Bibi',
          city: 'São Paulo',
          zipCode: '04538-000',
          coordinates: { lat: -23.5781, lng: -46.6906 }
        }
      },
      address: {
        street: 'Av. Faria Lima',
        number: '567',
        neighborhood: 'Itaim Bibi',
        city: 'São Paulo',
        zipCode: '04538-000',
        coordinates: { lat: -23.5781, lng: -46.6906 }
      },
      scheduledTime: new Date('2024-01-15T08:30:00'),
      completedTime: new Date('2024-01-15T08:25:00')
    },
    scheduledDate: new Date('2024-01-15T07:00:00'),
    estimatedDuration: 90,
    actualDuration: 85,
    distance: 12.3,
    price: 95,
    createdAt: new Date('2024-01-14T13:15:00'),
    updatedAt: new Date('2024-01-15T08:25:00')
  }
];

export const useDeliveryStore = create<DeliveryStore>()(
  devtools(
    persist(
      (set, get) => ({
        deliveries: mockDeliveries,
        driver: mockDriver,
        isLoading: false,
        selectedDelivery: null,

        setDeliveries: (deliveries) => set({ deliveries }),
        
        setDriver: (driver) => set({ driver }),
        
        updateDeliveryStatus: (deliveryId, status) => set((state) => ({
          deliveries: state.deliveries.map(delivery =>
            delivery.id === deliveryId
              ? { ...delivery, status, updatedAt: new Date() }
              : delivery
          )
        })),
        
        selectDelivery: (delivery) => set({ selectedDelivery: delivery }),
        
        addDelivery: (delivery) => set((state) => ({
          deliveries: [delivery, ...state.deliveries]
        })),
        
        removeDelivery: (deliveryId) => set((state) => ({
          deliveries: state.deliveries.filter(d => d.id !== deliveryId)
        })),
        
        setLoading: (loading) => set({ isLoading: loading }),
        
        getDeliveriesByStatus: (status) => {
          return get().deliveries.filter(delivery => delivery.status === status);
        },
        
        getTodayMetrics: () => {
          const driver = get().driver;
          return driver?.metrics.today || { deliveries: 0, completed: 0, revenue: 0, distance: 0 };
        },
        
        getPendingDeliveries: () => {
          return get().deliveries.filter(delivery => delivery.status === 'pending');
        },
        
        getActiveDeliveries: () => {
          return get().deliveries.filter(delivery => 
            ['pending', 'collected', 'in_transit'].includes(delivery.status)
          );
        }
      }),
      {
        name: 'delivery-store',
        partialize: (state) => ({ 
          deliveries: state.deliveries,
          driver: state.driver 
        })
      }
    )
  )
);