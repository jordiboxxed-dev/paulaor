import { Gem } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-carbon text-off-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <a href="/" className="flex items-center gap-2">
              <Gem className="h-6 w-6 text-off-white" />
              <span className="font-bold text-lg">Joyería Paula</span>
            </a>
            <p className="mt-4 text-sm text-off-white/60">Lujo accesible, atemporal y honesto.</p>
          </div>
          <div>
            <h4 className="font-bold font-grotesk uppercase">Comprar</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="text-off-white/60 hover:text-white">Anillos</a></li>
              <li><a href="#" className="text-off-white/60 hover:text-white">Aros</a></li>
              <li><a href="#" className="text-off-white/60 hover:text-white">Cadenas</a></li>
              <li><a href="#" className="text-off-white/60 hover:text-white">Edición Limitada</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold font-grotesk uppercase">Ayuda</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="text-off-white/60 hover:text-white">Envíos y Devoluciones</a></li>
              <li><a href="#" className="text-off-white/60 hover:text-white">Cuidado de Joyas</a></li>
              <li><a href="#" className="text-off-white/60 hover:text-white">Preguntas Frecuentes</a></li>
              <li><a href="#" className="text-off-white/60 hover:text-white">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold font-grotesk uppercase">La Marca</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="text-off-white/60 hover:text-white">Nuestra Historia</a></li>
              <li><a href="#" className="text-off-white/60 hover:text-white">Garantía 925</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold font-grotesk uppercase">Seguinos</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="text-off-white/60 hover:text-white">Instagram</a></li>
              <li><a href="#" className="text-off-white/60 hover:text-white">Facebook</a></li>
              <li><a href="#" className="text-off-white/60 hover:text-white">Pinterest</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-off-white/20 pt-8 text-center text-xs text-off-white/50">
          <p>&copy; {new Date().getFullYear()} Joyería Paula. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;