import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/Header';

const PaymentSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto flex flex-col items-center justify-center text-center py-16">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">¡Pago Exitoso!</h1>
        <p className="text-muted-foreground mb-6">Gracias por tu compra. Hemos recibido tu pago y estamos procesando tu pedido.</p>
        <Button asChild>
          <Link to="/">Volver a la Tienda</Link>
        </Button>
      </main>
    </div>
  );
};

export default PaymentSuccess;