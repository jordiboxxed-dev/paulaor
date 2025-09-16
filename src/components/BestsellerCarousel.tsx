import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

const BestsellerCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBestsellers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_sold', false)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching bestsellers:", error);
      } else {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchBestsellers();
  }, []);

  const renderSkeletons = () => (
    <CarouselContent>
      {Array.from({ length: 4 }).map((_, index) => (
        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
          <div className="p-1">
            <Card className="border-carbon/10">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 text-center w-full space-y-2">
                  <Skeleton className="h-5 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                  <Skeleton className="h-10 w-full mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
  );

  if (loading) {
    return (
      <section className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-grotesk text-4xl md:text-5xl font-bold text-carbon">Los elegidos de siempre.</h2>
            <p className="mt-2 text-carbon/70">Lo que más llevan, por algo será.</p>
          </div>
          <Carousel opts={{ align: "start" }} className="w-full">
            {renderSkeletons()}
          </Carousel>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-grotesk text-4xl md:text-5xl font-bold text-carbon">Los elegidos de siempre.</h2>
          <p className="mt-2 text-carbon/70">Lo que más llevan, por algo será.</p>
        </div>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                <div className="p-1">
                  <Card className="border-carbon/10 shadow-sm hover:shadow-xl transition-shadow">
                    <CardContent className="flex flex-col items-center justify-center p-0">
                      <Link to={`/product/${product.id}`} className="aspect-square w-full overflow-hidden">
                        <img src={product.image_url || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="p-4 text-center w-full">
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-semibold text-lg hover:underline">{product.name}</h3>
                        </Link>
                        <p className="font-mono text-carbon/80 mt-1">${product.price.toFixed(2)}</p>
                        <Button className="w-full mt-4 bg-carbon text-off-white hover:bg-carbon/90" onClick={() => addToCart(product)}>
                          Añadir al carrito
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default BestsellerCarousel;