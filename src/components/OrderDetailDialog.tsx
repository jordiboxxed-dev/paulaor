import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Order, OrderItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface OrderDetailDialogProps {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailDialog = ({ order, onOpenChange }: OrderDetailDialogProps) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!order) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('order_items')
        .select('*, products(*)')
        .eq('order_id', order.id);
      
      if (error) {
        console.error('Error fetching order items:', error);
      } else {
        setItems(data as any[]);
      }
      setLoading(false);
    };

    fetchOrderItems();
  }, [order]);

  const isOpen = !!order;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        {order && (
          <>
            <DialogHeader>
              <DialogTitle>Detalles del Pedido</DialogTitle>
              <DialogDescription>
                Pedido realizado el {format(new Date(order.created_at), 'dd/MM/yyyy \'a las\' HH:mm')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
              <div>
                <h3 className="font-semibold mb-2">Cliente</h3>
                <p>{order.customer_name}</p>
                <p className="text-sm text-muted-foreground">{order.customer_email}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Resumen Financiero</h3>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">${order.total_price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estado:</span>
                  <span className="font-medium capitalize">{order.status}</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="py-4">
              <h3 className="font-semibold mb-4">Artículos del Pedido</h3>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.products.image_url || '/placeholder.svg'} 
                          alt={item.products.name}
                          className="h-14 w-14 rounded-md object-cover"
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
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;