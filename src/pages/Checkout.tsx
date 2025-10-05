import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { Loader2 } from 'lucide-react';
import { User } from '@supabase/supabase-js';

// This is a global variable from the Mercado Pago SDK script
declare const MercadoPago: any;

const Checkout = () => {
  const { cartItems, cartCount } = useCart();
  const navigate = useNavigate();
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileFullName, setProfileFullName] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();
        if (profile?.full_name) {
          setProfileFullName(profile.full_name);
        }
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    if (preferenceId) {
      const mp = new MercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY, {
        locale: 'es-AR',
      });
      mp.bricks().create("wallet", "wallet_container", {
        initialization: {
          preferenceId: preferenceId,
        },
        customization: {
          texts: {
            valueProp: 'smart_option',
          },
        },
      });
    }
  }, [preferenceId]);

  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const customerName = formData.get('name') as string;
    const customerEmail = formData.get('email') as string;

    try {
      // 1. Create order in our database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName,
          customer_email: customerEmail,
          total_price: total,
          status: 'pending',
          user_id: user?.id, // Link to logged-in user
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // 3. Create Mercado Pago preference
      const { data, error: functionError } = await supabase.functions.invoke('create-payment-preference', {
        body: {
          items: cartItems,
          payer: { name: customerName, email: customerEmail },
          order_id: orderData.id,
        },
      });

      if (functionError) throw functionError;
      
      setPreferenceId(data.preferenceId);

    } catch (error: any) {
      showError('Error al procesar el pago: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost: number = 0;
  const total = subtotal + shippingCost;

  if (cartCount === 0 && !preferenceId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Checkout</h1>
          <p className="text-muted-foreground mb-6">Tu carrito está vacío.</p>
          <Button onClick={() => navigate('/')}>Volver a la tienda</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8 text-center">Finalizar Compra</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Información de Contacto</h2>
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
              <fieldset disabled={isLoading || !!preferenceId}>
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input id="name" name="name" type="text" defaultValue={profileFullName} placeholder="Tu nombre" required />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" name="email" type="email" defaultValue={user?.email || ''} placeholder="tu@email.com" required />
                </div>
              </fieldset>
            </form>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Resumen del Pedido</h2>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 font-medium">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Envío</p>
                <p>{shippingCost === 0 ? 'Gratis' : `$${shippingCost.toFixed(2)}`}</p>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>
            
            {!preferenceId ? (
              <Button type="submit" form="checkout-form" className="w-full mt-6" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Proceder al Pago
              </Button>
            ) : (
              <div id="wallet_container" className="mt-6"></div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;