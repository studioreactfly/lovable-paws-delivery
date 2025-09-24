import { motion } from 'framer-motion';
import { Clock, MapPin, User, Package, Phone, Star } from 'lucide-react';
import { Delivery, DeliveryStatus } from '@/types/delivery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useDeliveryStore } from '@/store/deliveryStore';

interface DeliveryCardProps {
  delivery: Delivery;
  onSelect?: (delivery: Delivery) => void;
}

const statusConfig = {
  pending: {
    label: 'Aguardando',
    variant: 'secondary' as const,
    className: 'bg-warning/10 text-warning border-warning/20'
  },
  collected: {
    label: 'Coletado',
    variant: 'default' as const,
    className: 'gradient-primary text-primary-foreground border-0'
  },
  in_transit: {
    label: 'Em Trânsito',
    variant: 'default' as const,
    className: 'gradient-secondary text-secondary-foreground border-0'
  },
  delivered: {
    label: 'Entregue',
    variant: 'default' as const,
    className: 'gradient-success text-success-foreground border-0'
  },
  cancelled: {
    label: 'Cancelado',
    variant: 'destructive' as const,
    className: 'bg-destructive/10 text-destructive border-destructive/20'
  },
  delayed: {
    label: 'Atrasado',
    variant: 'destructive' as const,
    className: 'bg-destructive/10 text-destructive border-destructive/20'
  }
};

const priorityConfig = {
  low: { label: 'Baixa', color: 'text-muted-foreground' },
  medium: { label: 'Média', color: 'text-warning' },
  high: { label: 'Alta', color: 'text-secondary' },
  urgent: { label: 'Urgente', color: 'text-destructive' }
};

export const DeliveryCard = ({ delivery, onSelect }: DeliveryCardProps) => {
  const updateDeliveryStatus = useDeliveryStore(state => state.updateDeliveryStatus);
  
  const status = statusConfig[delivery.status];
  const priority = priorityConfig[delivery.priority];
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleStatusUpdate = (newStatus: DeliveryStatus) => {
    updateDeliveryStatus(delivery.id, newStatus);
  };

  const getNextStatus = (currentStatus: DeliveryStatus): DeliveryStatus | null => {
    const statusFlow = {
      pending: 'collected',
      collected: 'in_transit',
      in_transit: 'delivered'
    } as const;
    
    return statusFlow[currentStatus as keyof typeof statusFlow] || null;
  };

  const nextStatus = getNextStatus(delivery.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass shadow-soft hover:shadow-medium transition-all duration-300 border-0">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{delivery.pet.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {delivery.pet.type === 'dog' ? '🐕' : delivery.pet.type === 'cat' ? '🐱' : '🐾'} {delivery.pet.breed}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={status.className}>
                {status.label}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className={`w-3 h-3 ${priority.color}`} fill="currentColor" />
                <span className={`text-xs ${priority.color}`}>{priority.label}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Pickup Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-secondary" />
              <span className="font-medium">Coleta:</span>
              <span className="text-muted-foreground">{delivery.pickup.customer.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-secondary" />
              <span className="text-muted-foreground">
                {delivery.pickup.address.street}, {delivery.pickup.address.number} - {delivery.pickup.address.neighborhood}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-secondary" />
              <span className="text-muted-foreground">
                {formatTime(delivery.pickup.scheduledTime!)}
              </span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="border-t border-border/50 pt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-success" />
              <span className="font-medium">Entrega:</span>
              <span className="text-muted-foreground">{delivery.delivery.customer.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-success" />
              <span className="text-muted-foreground">
                {delivery.delivery.address.street}, {delivery.delivery.address.number} - {delivery.delivery.address.neighborhood}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-success" />
              <span className="text-muted-foreground">
                {formatTime(delivery.delivery.scheduledTime!)}
              </span>
            </div>
          </div>

          {/* Price and Distance */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              {delivery.distance}km • {delivery.estimatedDuration}min
            </div>
            <div className="text-lg font-bold text-gradient-primary">
              {formatPrice(delivery.price)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onSelect?.(delivery)}
            >
              <Phone className="w-4 h-4 mr-1" />
              Detalhes
            </Button>
            
            {nextStatus && (
              <Button
                size="sm"
                className="flex-1 gradient-primary text-primary-foreground border-0"
                onClick={() => handleStatusUpdate(nextStatus)}
              >
                {nextStatus === 'collected' && 'Coletar'}
                {nextStatus === 'in_transit' && 'Iniciar'}
                {nextStatus === 'delivered' && 'Entregar'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};