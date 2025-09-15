import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Order } from '@/types';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { User } from '@supabase/supabase-js';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAndFetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data);
      }
      setLoading(false);
    };
    checkUserAndFetchOrders();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <Button onClick={handleSignOut} variant="outline">Cerrar Sesión</Button>
        </div>
        <p className="mb-8 text-muted-foreground">Hola {user?.email}, aquí puedes ver tu historial de pedidos.</p>

        <h2 className="text-2xl font-semibold mb-4">Mis Pedidos</h2>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle>Pedido del {format(new Date(order.created_at), 'dd/MM/yyyy')}</CardTitle>
                  <CardDescription>ID del Pedido: {order.id}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">${order.total_price.toFixed(2)}</p>
                  </div>
                  <Badge variant={order.status === 'paid' ? 'default' : 'secondary'}>{order.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">No tienes pedidos todavía</h3>
            <p className="text-muted-foreground mt-2 mb-4">¡Explora nuestras colecciones y encuentra tu próxima joya!</p>
            <Button asChild>
              <Link to="/">Ir a la Tienda</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;