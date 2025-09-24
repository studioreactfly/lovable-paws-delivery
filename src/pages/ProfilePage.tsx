import { motion } from 'framer-motion';
import { 
  User, 
  Car, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Edit, 
  Phone, 
  Mail,
  Star,
  Award,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useDeliveryStore } from '@/store/deliveryStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const ProfilePage = () => {
  const { driver } = useDeliveryStore();

  if (!driver) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const menuItems = [
    { icon: Edit, label: 'Editar Perfil', action: () => {}, color: 'text-primary' },
    { icon: Car, label: 'Meu Veículo', action: () => {}, color: 'text-secondary' },
    { icon: Settings, label: 'Configurações', action: () => {}, color: 'text-muted-foreground' },
    { icon: HelpCircle, label: 'Ajuda e Suporte', action: () => {}, color: 'text-muted-foreground' },
    { icon: Shield, label: 'Privacidade', action: () => {}, color: 'text-muted-foreground' },
    { icon: LogOut, label: 'Sair', action: () => {}, color: 'text-destructive' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/20"
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold">Perfil</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>
      </motion.div>

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={driver.avatar} />
                  <AvatarFallback className="gradient-primary text-primary-foreground text-2xl">
                    {driver.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{driver.name}</h2>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {driver.email}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {driver.phone}
                      </p>
                    </div>
                    
                    <Badge 
                      variant={driver.isOnline ? "default" : "secondary"}
                      className={driver.isOnline ? "gradient-success text-success-foreground border-0" : ""}
                    >
                      {driver.isOnline ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-current" />
                      <span className="font-medium">4.9</span>
                      <span className="text-sm text-muted-foreground">(142 avaliações)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vehicle Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Meu Veículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Modelo</p>
                  <p className="font-medium">{driver.vehicle.model}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Placa</p>
                  <p className="font-medium">{driver.vehicle.plate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium capitalize">{driver.vehicle.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cor</p>
                  <p className="font-medium">{driver.vehicle.color}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Estatísticas do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gradient-primary">
                    {driver.metrics.month.completed}
                  </p>
                  <p className="text-sm text-muted-foreground">Entregas Concluídas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gradient-success">
                    {formatCurrency(driver.metrics.month.revenue)}
                  </p>
                  <p className="text-sm text-muted-foreground">Faturamento</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gradient-secondary">
                    {driver.metrics.month.distance}km
                  </p>
                  <p className="text-sm text-muted-foreground">Distância Percorrida</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gradient-primary">
                    {Math.round((driver.metrics.month.completed / driver.metrics.month.deliveries) * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full gradient-success flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-success-foreground" />
                  </div>
                  <p className="text-xs font-medium">Entregador 5 Estrelas</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <p className="text-xs font-medium">100 Entregas</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full gradient-secondary flex items-center justify-center mx-auto mb-2">
                    <Award className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <p className="text-xs font-medium">Pontualidade</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass shadow-soft border-0">
            <CardContent className="p-0">
              {menuItems.map((item, index) => (
                <div key={item.label}>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    onClick={item.action}
                    className="w-full p-4 flex items-center gap-3 text-left hover:bg-accent/50 transition-colors"
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="flex-1 font-medium">{item.label}</span>
                  </motion.button>
                  {index < menuItems.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};