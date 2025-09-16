import { Product } from '@/types';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from './ui/button';

// Placeholder data
const bestsellerProducts: Product[] = [
  { id: 1, name: "Anillo Sello", price: 25000, image_url: "https://images.unsplash.com/photo-1598564983638-356948d16487?q=80&w=1964&auto=format&fit=crop", is_sold: false, created_at: "", description: "Anillo de sello de plata 925, un clásico atemporal." },
  { id: 2, name: "Cadena Fígaro", price: 42000, image_url: "https://images.unsplash.com/photo-1635762522502-653b51775c4a?q=80&w=1964&auto=format&fit=crop", is_sold: false, created_at: "", description: "Cadena de eslabones Fígaro, robusta y elegante." },
  { id: 3, name: "Aros Colgantes", price: 18500, image_url: "https://images.unsplash.com/photo-1619291381213-9332b64f009e?q=80&w=1974&auto=format&fit=crop", is_sold: false, created_at: "", description: "Aros colgantes con diseño minimalista." },
  { id: 4, name: "Pulsera Rolo", price: 35000, image_url: "https://images.unsplash.com/photo-1611591437281-462bf4a214e5?q=80&w=1974&auto=format&fit=crop", is_sold: false, created_at: "", description: "Pulsera de eslabones redondos tipo rolo." },
  { id: 5, name: "Anillo Infinito", price: 19900, image_url: "https://images.unsplash.com/photo-1608753313356-0a3a803d7b3c?q=80&w=1974&auto=format&fit=crop", is_sold: false, created_at: "", description: "Anillo con símbolo de infinito, ideal para regalar." },
];

const BestsellerCarousel = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-grotesk text-4xl md:text-5xl font-bold text-carbon">Los elegidos de siempre.</h2>
          <p className="mt-2 text-carbon/70">Lo que más llevan, por algo será.</p>
        </div>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {bestsellerProducts.map((product) => (
              <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                <div className="p-1">
                  <Card className="border-carbon/10 shadow-sm hover:shadow-xl transition-shadow">
                    <CardContent className="flex flex-col items-center justify-center p-0">
                      <div className="aspect-square w-full overflow-hidden">
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 text-center w-full">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="font-mono text-carbon/80 mt-1">${product.price.toLocaleString('es-AR')}</p>
                        <Button className="w-full mt-4 bg-carbon text-off-white hover:bg-carbon/90">Añadir al carrito</Button>
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