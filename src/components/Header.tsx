import { Gem, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CartSheet } from './CartSheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import React from 'react';
import { SearchBar } from './SearchBar';
import { Session } from '@supabase/supabase-js';
import { Button } from './ui/button';

const Header = () => {
  const [collections, setCollections] = useState<string[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('collection');

      if (error) {
        console.error('Error fetching collections:', error);
        return;
      }

      if (data) {
        const collectionsList: any[] = data.map(p => p.collection);
        const stringCollections: string[] = collectionsList.filter(c => typeof c === 'string' && c.length > 0);
        const uniqueCollections = [...new Set(stringCollections)];
        setCollections(uniqueCollections);
      }
    };
    fetchCollections();
  }, []);

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <Gem className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg hidden sm:inline-block">Joyería Paula</span>
          </Link>
          
          <div className="flex-1 flex justify-center px-4">
            <SearchBar />
          </div>

          <nav className="flex items-center gap-2 sm:gap-4">
            {collections.length > 0 && (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Colecciones</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-3 p-4 md:w-[250px]">
                        {collections.map((collection) => (
                          <ListItem key={collection} to={`/collection/${collection}`} title={collection} />
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}
            {session ? (
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
            )}
            <CartSheet />
          </nav>
        </div>
      </div>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={to}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default Header;