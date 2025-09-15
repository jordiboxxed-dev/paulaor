import { Gem, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Gem className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Joyería Paula</span>
          </Link>
          <nav className="flex items-center gap-4">
            <button className="relative rounded-full p-2 hover:bg-accent">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                0
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;