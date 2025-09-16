import { Gem } from 'lucide-react';

const Superheader = () => {
  return (
    <div className="sticky top-0 z-50 bg-carbon text-off-white text-xs sm:text-sm">
      <div className="container mx-auto flex justify-between items-center h-10 px-4">
        <p className="font-mono">Envíos gratis en compras +$50.000 ARS</p>
        <a href="#" className="hidden sm:flex items-center gap-2 hover:text-vermillion transition-colors">
          <Gem size={14} />
          <span>Garantía Plata 925 · Atención al cliente</span>
        </a>
      </div>
    </div>
  );
};

export default Superheader;