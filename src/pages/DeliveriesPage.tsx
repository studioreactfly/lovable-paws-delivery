import { motion } from 'framer-motion';
import { useState } from 'react';
import { Package, Filter, Search, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { useDeliveryStore } from '@/store/deliveryStore';
import { DeliveryCard } from '@/components/DeliveryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeliveryStatus } from '@/types/delivery';

const statusTabs = [
  { value: 'all', label: 'Todas', icon: Package },
  { value: 'pending', label: 'Pendentes', icon: Clock },
  { value: 'collected', label: 'Coletadas', icon: CheckCircle2 },
  { value: 'in_transit', label: 'Em Trânsito', icon: Truck },
  { value: 'delivered', label: 'Entregues', icon: CheckCircle2 },
] as const;

export const DeliveriesPage = () => {
  const { deliveries, getDeliveriesByStatus } = useDeliveryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');

  const getFilteredDeliveries = (status: string) => {
    const baseDeliveries = status === 'all' 
      ? deliveries 
      : getDeliveriesByStatus(status as DeliveryStatus);
    
    if (!searchQuery) return baseDeliveries;
    
    return baseDeliveries.filter(delivery =>
      delivery.pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.pickup.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.delivery.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.pickup.address.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.delivery.address.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredDeliveries = getFilteredDeliveries(activeTab);

  const getStatusCount = (status: string) => {
    return status === 'all' ? deliveries.length : getDeliveriesByStatus(status as DeliveryStatus).length;
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
              <h1 className="text-2xl font-bold">Entregas</h1>
              <p className="text-sm text-muted-foreground">
                Gerencie suas entregas e acompanhe o progresso
              </p>
            </div>
            
            <Button size="sm" variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar entregas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass border-0 shadow-soft"
            />
          </div>
        </div>
      </motion.div>

      <div className="p-4">
        {/* Status Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-5 w-full glass border-0 p-1">
              {statusTabs.map((tab) => {
                const Icon = tab.icon;
                const count = getStatusCount(tab.value);
                
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex flex-col items-center gap-1 p-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{tab.label}</span>
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-1.5 py-0.5 h-4 min-w-4 bg-muted/50"
                    >
                      {count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {statusTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredDeliveries.length === 0 ? (
                    <Card className="glass shadow-soft border-0">
                      <CardContent className="p-8 text-center">
                        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">
                          {searchQuery ? 'Nenhuma entrega encontrada' : `Nenhuma entrega ${tab.label.toLowerCase()}`}
                        </h3>
                        <p className="text-muted-foreground">
                          {searchQuery 
                            ? 'Tente ajustar sua busca ou verificar outros filtros' 
                            : `Você não tem entregas ${tab.label.toLowerCase()} no momento`
                          }
                        </p>
                        {searchQuery && (
                          <Button
                            variant="outline"
                            onClick={() => setSearchQuery('')}
                            className="mt-4"
                          >
                            Limpar busca
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {filteredDeliveries.map((delivery, index) => (
                        <motion.div
                          key={delivery.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <DeliveryCard delivery={delivery} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};