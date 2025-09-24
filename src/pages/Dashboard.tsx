import { motion } from 'framer-motion';
import { Package, MapPin, DollarSign, Clock, Plus, Bell, Search } from 'lucide-react';
import { useDeliveryStore } from '@/store/deliveryStore';
import { MetricsCard } from '@/components/MetricsCard';
import { DeliveryCard } from '@/components/DeliveryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export const Dashboard = () => {
  const { deliveries, driver, getActiveDeliveries, getTodayMetrics } = useDeliveryStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeDeliveries = getActiveDeliveries();
  const todayMetrics = getTodayMetrics();
  
  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    delivery.pickup.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    delivery.delivery.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/20"
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={driver?.avatar} />
              <AvatarFallback className="gradient-primary text-primary-foreground">
                {driver?.name?.split(' ').map(n => n[0]).join('') || 'DR'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold">Olá, {driver?.name?.split(' ')[0]}!</h1>
              <p className="text-sm text-muted-foreground">
                {activeDeliveries.length} entregas ativas
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center bg-destructive">
                3
              </Badge>
            </Button>
            <Badge 
              variant={driver?.isOnline ? "default" : "secondary"}
              className={driver?.isOnline ? "gradient-success text-success-foreground border-0" : ""}
            >
              {driver?.isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="p-4 space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-2 gap-4">
          <MetricsCard
            title="Entregas Hoje"
            value={`${todayMetrics.completed}/${todayMetrics.deliveries}`}
            subtitle="Concluídas"
            icon={Package}
            trend={{ value: 15, label: 'vs ontem' }}
            delay={0}
          />
          <MetricsCard
            title="Faturamento"
            value={formatCurrency(todayMetrics.revenue)}
            subtitle="Hoje"
            icon={DollarSign}
            trend={{ value: 8, label: 'vs ontem' }}
            delay={0.1}
          />
          <MetricsCard
            title="Distância"
            value={`${todayMetrics.distance}km`}
            subtitle="Percorridos"
            icon={MapPin}
            trend={{ value: -5, label: 'vs ontem' }}
            delay={0.2}
          />
          <MetricsCard
            title="Tempo Médio"
            value="1h 15min"
            subtitle="Por entrega"
            icon={Clock}
            trend={{ value: -10, label: 'vs ontem' }}
            delay={0.3}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass shadow-soft border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button className="gradient-primary text-primary-foreground border-0 h-12">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Entrega
                </Button>
                <Button variant="outline" className="h-12">
                  <MapPin className="w-4 h-4 mr-2" />
                  Ver Rotas
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por pet, cliente ou endereço..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass border-0 shadow-soft"
          />
        </motion.div>

        {/* Deliveries List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Entregas do Dia</h2>
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              {filteredDeliveries.length} total
            </Badge>
          </div>
          
          <div className="space-y-4">
            {filteredDeliveries.length === 0 ? (
              <Card className="glass shadow-soft border-0">
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma entrega encontrada</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Tente ajustar sua busca' : 'Você está em dia com suas entregas!'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredDeliveries.map((delivery, index) => (
                <motion.div
                  key={delivery.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <DeliveryCard delivery={delivery} />
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};