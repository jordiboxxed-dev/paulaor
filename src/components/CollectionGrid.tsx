import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const collections = [
  { name: "Anillos", image: "https://images.unsplash.com/photo-1601121141499-17ae80afc03a?q=80&w=2070&auto=format&fit=crop", span: "col-span-2 md:col-span-1" },
  { name: "Cadenas", image: "https://images.unsplash.com/photo-1619119069152-a2b331eb392a?q=80&w=1974&auto=format&fit=crop", span: "col-span-2 md:col-span-1" },
  { name: "Aros", image: "https://images.unsplash.com/photo-1610495142377-a7a5f16a7a7d?q=80&w=1974&auto=format&fit=crop", span: "col-span-2" },
];

const CollectionGrid = () => {
  return (
    <section className="bg-off-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <h2 className="font-grotesk text-4xl md:text-5xl font-bold text-carbon mb-8 text-center">
          Comprá por categoría.
        </h2>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {collections.map((collection) => (
            <div key={collection.name} className={`relative group overflow-hidden h-64 md:h-96 ${collection.span}`}>
              <img src={collection.image} alt={collection.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="font-grotesk text-3xl font-bold text-white">{collection.name}</h3>
                <Button variant="link" className="text-white p-0 h-auto mt-1">
                  Ver más <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionGrid;