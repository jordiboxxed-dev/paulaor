import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/CartContext';
import { showError } from '@/utils/toast';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SocialShare } from '@/components/SocialShare';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }
        setProduct(data);
      } catch (err: any) {
        showError('No se pudo cargar el producto.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <p className="text-muted-foreground mt-2">El producto que buscas no existe o fue eliminado.</p>
          <Button asChild className="mt-4">
            <Link to="/">Volver a la tienda</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a todas las joyas
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative">
            <img
              src={product.image_url || '/placeholder.svg'}
              alt={product.name}
              className="aspect-square w-full rounded-lg object-cover"
            />
            {product.is_sold && (
              <Badge variant="destructive" className="absolute top-3 right-3">Vendido</Badge>
            )}
          </div>
          <div className="flex flex-col justify-center">
            {product.collection && (
              <p className="text-sm font-medium text-primary">{product.collection}</p>
            )}
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mt-1">{product.name}</h1>
            <p className="text-3xl font-bold my-4">${product.price.toFixed(2)}</p>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            <Button
              size="lg"
              className="mt-6"
              disabled={product.is_sold}
              onClick={() => addToCart(product)}
            >
              {product.is_sold ? 'No disponible' : 'Añadir al carrito'}
            </Button>
            <SocialShare productName={product.name} productUrl={window.location.href} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;