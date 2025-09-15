import { Gem } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CartSheet } from './CartSheet';

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
            <CartSheet />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;