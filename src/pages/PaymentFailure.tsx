import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Header from '@/components/Header';

const PaymentFailure = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto flex flex-col items-center justify-center text-center py-16">
        <XCircle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold mb-2">Pago Fallido</h1>
        <p className="text-muted-foreground mb-6">Hubo un problema al procesar tu pago. Por favor, inténtalo de nuevo.</p>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/checkout">Intentar de Nuevo</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Volver a la Tienda</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PaymentFailure;