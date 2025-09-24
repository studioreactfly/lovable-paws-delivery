import { motion } from 'framer-motion';
import { MapPin, Navigation, Layers, Search, Filter } from 'lucide-react';
import { useDeliveryStore } from '@/store/deliveryStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export const MapPage = () => {
  const { deliveries, getActiveDeliveries } = useDeliveryStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeDeliveries = getActiveDeliveries();

  const statusColors = {
    pending: 'bg-warning text-warning-foreground',
    collected: 'bg-primary text-primary-foreground',
    in_transit: 'bg-secondary text-secondary-foreground',
    delivered: 'bg-success text-success-foreground'
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/20"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Mapa de Entregas</h1>
              <p className="text-sm text-muted-foreground">
                Visualize rotas e otimize seus trajetos
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Layers className="w-4 h-4 mr-2" />
                Camadas
              </Button>
              <Button size="sm" className="gradient-primary text-primary-foreground border-0">
                <Navigation className="w-4 h-4 mr-2" />
                Navegar
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar endereço ou cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass border-0 shadow-soft"
            />
          </div>
        </div>
      </motion.div>

      <div className="p-4 space-y-6">
        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass shadow-medium border-0 overflow-hidden">
            <div className="relative h-96 bg-gradient-to-br from-primary/10 via-secondary/5 to-success/10 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto">
                  <MapPin className="w-10 h-10 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Mapa Interativo</h3>
                  <p className="text-muted-foreground max-w-sm">
                    O mapa será integrado com MapBox para visualização de rotas, clusters de entregas e navegação em tempo real.
                  </p>
                </div>
                <Button className="gradient-secondary text-secondary-foreground border-0">
                  Ativar Localização
                </Button>
              </div>

              {/* Floating delivery markers simulation */}
              <div className="absolute top-4 left-4">
                <div className="w-8 h-8 rounded-full bg-warning flex items-center justify-center shadow-lg animate-bounce-gentle">
                  <span className="text-xs font-bold text-warning-foreground">1</span>
                </div>
              </div>
              
              <div className="absolute top-16 right-8">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg animate-bounce-gentle delay-300">
                  <span className="text-xs font-bold text-primary-foreground">2</span>
                </div>
              </div>
              
              <div className="absolute bottom-12 left-12">
                <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center shadow-lg animate-bounce-gentle delay-500">
                  <span className="text-xs font-bold text-success-foreground">3</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Route Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Rota Otimizada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gradient-primary">45.2km</p>
                  <p className="text-sm text-muted-foreground">Distância Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gradient-success">2h 15min</p>
                  <p className="text-sm text-muted-foreground">Tempo Estimado</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gradient-secondary">8</p>
                  <p className="text-sm text-muted-foreground">Paradas</p>
                </div>
              </div>
              
              <Button className="w-full gradient-primary text-primary-foreground border-0">
                <Navigation className="w-4 h-4 mr-2" />
                Iniciar Navegação
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Deliveries List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Entregas Ativas</h2>
            <Badge variant="secondary">
              {activeDeliveries.length} ativas
            </Badge>
          </div>
          
          <div className="space-y-3">
            {activeDeliveries.map((delivery, index) => (
              <motion.div
                key={delivery.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="glass shadow-soft border-0">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${statusColors[delivery.status]}`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{delivery.pet.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {delivery.pickup.address.neighborhood} → {delivery.delivery.address.neighborhood}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {delivery.distance}km • {delivery.estimatedDuration}min
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className={statusColors[delivery.status]}>
                          {delivery.status === 'pending' && 'Aguardando'}
                          {delivery.status === 'collected' && 'Coletado'}
                          {delivery.status === 'in_transit' && 'Em Trânsito'}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};