import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem } from '@/types';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { showError } from '@/utils/toast';
import { Badge } from '@/components/ui/badge';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .eq('user_id', session.user.id)
          .single();

        if (orderError || !orderData) {
          throw new Error('Pedido no encontrado o no tienes permiso para verlo.');
        }
        setOrder(orderData);

        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*, products(*)')
          .eq('order_id', id);

        if (itemsError) throw itemsError;
        setItems(itemsData as any[]);
      } catch (err: any) {
        showError(err.message);
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/profile" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Mi Perfil
          </Link>
        </div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Detalles del Pedido</CardTitle>
                <CardDescription>
                  Pedido realizado el {format(new Date(order.created_at), "dd/MM/yyyy 'a las' HH:mm")}
                </CardDescription>
              </div>
              <Badge variant={order.status === 'paid' ? 'default' : 'secondary'} className="capitalize">
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Resumen</h3>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold text-lg">${order.total_price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground">ID del Pedido: {order.id}</p>
            </div>
            <Separator className="my-6" />
            <div>
              <h3 className="font-semibold mb-4">Artículos del Pedido</h3>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.products.image_url || '/placeholder.svg'} 
                        alt={item.products.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{item.products.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OrderDetail;