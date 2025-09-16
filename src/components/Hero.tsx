import { Button } from '@/components/ui/button';

type HeroProps = {
  variant?: 'A' | 'B' | 'C';
};

const variants = {
  A: {
    headline: "Plata 925. Hecha para durar.",
    subheadline: "Joyas que te acompañan, siempre.",
    imageUrl: "https://images.unsplash.com/photo-1611652022417-a521174b70c3?q=80&w=1974&auto=format&fit=crop",
  },
  B: {
    headline: "Diseño que se siente. Plata que se vive.",
    subheadline: "La forma sigue a la función. Y a vos.",
    imageUrl: "https://images.unsplash.com/photo-1620656335291-f83a5a853b2a?q=80&w=1974&auto=format&fit=crop",
  },
  C: {
    headline: "Tu joya de todos los días. Sin peros.",
    subheadline: "Ponétela y olvidate. Es para siempre.",
    imageUrl: "https://images.unsplash.com/photo-1617038260897-41a1f1b27e52?q=80&w=1974&auto=format&fit=crop",
  },
};

const Hero = ({ variant = 'A' }: HeroProps) => {
  const { headline, subheadline, imageUrl } = variants[variant];

  return (
    <section className="relative bg-off-white text-carbon w-full min-h-[70vh] md:min-h-screen flex items-center">
      <div className="absolute inset-0">
        <img src={imageUrl} alt="Joyería de plata 925" className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-off-white/30"></div>
      </div>
      <div className="relative container mx-auto px-4 z-10">
        <div className="max-w-2xl">
          <h1 className="font-grotesk text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter text-carbon">
            {headline}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-carbon/80">{subheadline}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-vermillion hover:bg-vermillion/90 text-off-white font-bold text-base">
              Ver la colección
            </Button>
            <Button size="lg" variant="outline" className="border-carbon text-carbon hover:bg-carbon hover:text-off-white font-bold text-base">
              Los más vendidos
            </Button>
          </div>
          <p className="mt-6 font-mono text-xs text-carbon/70">
            Envío 24hs · Devolución fácil · Calidad garantizada
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;