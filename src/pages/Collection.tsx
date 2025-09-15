import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

const CollectionPage = () => {
  const { name } = useParams<{ name: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductsByCollection = async () => {
      if (!name) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('collection', name)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setProducts(data || []);
      } catch (err: any) {
        setError('No se pudieron cargar los productos de esta colección.');
        console.error('Error fetching collection products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCollection();
  }, [name]);

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
        <h1 className="text-3xl font-bold tracking-tight mb-6">Colección: {name}</h1>
        
        {error && <p className="text-center text-destructive">{error}</p>}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[250px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && !error && (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold">No hay joyas en esta colección</h2>
                <p className="text-muted-foreground mt-2">Pronto añadiremos nuevas creaciones a la colección {name}.</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default CollectionPage;