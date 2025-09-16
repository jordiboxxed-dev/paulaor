import { Button } from './ui/button';

const Lookbook = () => {
  return (
    <section className="bg-off-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1506192695249-4129b3a03e0a?q=80&w=1974&auto=format&fit=crop" 
              alt="Editorial de joyería en plata"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-grotesk text-4xl md:text-5xl font-bold text-carbon">No es solo plata. Es una historia.</h2>
            <p className="mt-4 text-lg text-carbon/80 leading-relaxed">
              La plata 925 no es un capricho. Es un metal noble, honesto.
            </p>
            <p className="mt-2 text-lg text-carbon/80 leading-relaxed">
              Resiste el paso del tiempo, como tus momentos importantes. Cuidala fácil, usala siempre.
            </p>
            <Button variant="link" className="mt-6 text-carbon text-base p-0">
              Cómo cuidar tus joyas
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Lookbook;