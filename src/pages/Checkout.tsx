import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, cartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  // For now, shipping is free. This can be updated later.
  const shippingCost: number = 0;
  const total = subtotal + shippingCost;

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Checkout</h1>
          <p className="text-muted-foreground mb-6">Tu carrito está vacío. Añade algunos productos antes de proceder al pago.</p>
          <Button onClick={() => navigate('/')}>Volver a la tienda</Button>
        </main>
      </div>
    );
  }

  const handleCheckout = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Payment integration logic will go here in the next step.
    console.log('Proceeding to payment...');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8 text-center">Finalizar Compra</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Customer Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Información de Contacto</h2>
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" name="name" type="text" placeholder="Tu nombre" required />
              </div>
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
              </div>
            </form>
          </div>

          {/* Order Summary */}
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
            <div className="space-y-2">
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
            <Button type="submit" form="checkout-form" className="w-full mt-6">
              Proceder al Pago (Próximamente)
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;