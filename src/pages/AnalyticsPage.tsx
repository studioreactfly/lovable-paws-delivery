import { motion } from 'framer-motion';
import { BarChart, TrendingUp, DollarSign, Package, MapPin, Clock } from 'lucide-react';
import { useDeliveryStore } from '@/store/deliveryStore';
import { MetricsCard } from '@/components/MetricsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AnalyticsPage = () => {
  const { driver } = useDeliveryStore();

  if (!driver) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const weeklyData = [
    { day: 'Seg', deliveries: 12, revenue: 950 },
    { day: 'Ter', deliveries: 8, revenue: 640 },
    { day: 'Qua', deliveries: 15, revenue: 1200 },
    { day: 'Qui', deliveries: 10, revenue: 800 },
    { day: 'Sex', deliveries: 18, revenue: 1440 },
    { day: 'Sáb', deliveries: 22, revenue: 1760 },
    { day: 'Dom', deliveries: 14, revenue: 1120 },
  ];

  const maxRevenue = Math.max(...weeklyData.map(d => d.revenue));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/20"
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Relatórios</h1>
              <p className="text-sm text-muted-foreground">
                Acompanhe seu desempenho e ganhos
              </p>
            </div>
            
            <Badge variant="outline" className="gradient-primary text-primary-foreground border-0">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15% este mês
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="p-4">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full glass border-0">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Today Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              <MetricsCard
                title="Entregas Hoje"
                value={`${driver.metrics.today.completed}/${driver.metrics.today.deliveries}`}
                subtitle="Concluídas"
                icon={Package}
                trend={{ value: 12, label: 'vs ontem' }}
                delay={0}
              />
              <MetricsCard
                title="Ganhos Hoje"
                value={formatCurrency(driver.metrics.today.revenue)}
                subtitle="Faturamento"
                icon={DollarSign}
                trend={{ value: 8, label: 'vs ontem' }}
                delay={0.1}
              />
            </motion.div>

            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass shadow-soft border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Performance da Semana
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyData.map((day, index) => (
                      <motion.div
                        key={day.day}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-8 text-sm font-medium text-muted-foreground">
                          {day.day}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{day.deliveries} entregas</span>
                            <span className="font-medium">{formatCurrency(day.revenue)}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <motion.div
                              className="gradient-primary h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                              transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              <MetricsCard
                title="Entregas da Semana"
                value={driver.metrics.week.completed}
                subtitle={`de ${driver.metrics.week.deliveries} agendadas`}
                icon={Package}
                trend={{ value: 22, label: 'vs semana anterior' }}
              />
              <MetricsCard
                title="Faturamento"
                value={formatCurrency(driver.metrics.week.revenue)}
                subtitle="Esta semana"
                icon={DollarSign}
                trend={{ value: 18, label: 'vs semana anterior' }}
              />
              <MetricsCard
                title="Distância"
                value={`${driver.metrics.week.distance}km`}
                subtitle="Percorridos"
                icon={MapPin}
                trend={{ value: -5, label: 'vs semana anterior' }}
              />
              <MetricsCard
                title="Eficiência"
                value={`${Math.round((driver.metrics.week.completed / driver.metrics.week.deliveries) * 100)}%`}
                subtitle="Taxa de sucesso"
                icon={TrendingUp}
                trend={{ value: 3, label: 'vs semana anterior' }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass shadow-soft border-0">
                <CardHeader>
                  <CardTitle>Metas da Semana</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Entregas (38/40)</span>
                      <span className="text-sm text-muted-foreground">95%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="gradient-success h-2 rounded-full w-[95%]" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Faturamento (R$ 2.850/R$ 3.000)</span>
                      <span className="text-sm text-muted-foreground">95%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="gradient-primary h-2 rounded-full w-[95%]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              <MetricsCard
                title="Entregas do Mês"
                value={driver.metrics.month.completed}
                subtitle={`de ${driver.metrics.month.deliveries} agendadas`}
                icon={Package}
                trend={{ value: 28, label: 'vs mês anterior' }}
              />
              <MetricsCard
                title="Faturamento"
                value={formatCurrency(driver.metrics.month.revenue)}
                subtitle="Este mês"
                icon={DollarSign}
                trend={{ value: 32, label: 'vs mês anterior' }}
              />
              <MetricsCard
                title="Distância Total"
                value={`${driver.metrics.month.distance}km`}
                subtitle="Percorridos"
                icon={MapPin}
                trend={{ value: 15, label: 'vs mês anterior' }}
              />
              <MetricsCard
                title="Tempo Médio"
                value="1h 12min"
                subtitle="Por entrega"
                icon={Clock}
                trend={{ value: -8, label: 'vs mês anterior' }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass shadow-soft border-0">
                <CardHeader>
                  <CardTitle>Resumo Mensal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-gradient-primary mb-2">
                      {formatCurrency(driver.metrics.month.revenue)}
                    </div>
                    <p className="text-muted-foreground">Faturamento total este mês</p>
                    <Badge className="mt-2 gradient-success text-success-foreground border-0">
                      +32% vs mês anterior
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                    <div className="text-center">
                      <p className="text-lg font-bold">{driver.metrics.month.completed}</p>
                      <p className="text-xs text-muted-foreground">Entregas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{driver.metrics.month.distance}km</p>
                      <p className="text-xs text-muted-foreground">Distância</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">4.9★</p>
                      <p className="text-xs text-muted-foreground">Avaliação</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};