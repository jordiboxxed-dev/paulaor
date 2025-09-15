import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link from navigating
    e.stopPropagation(); // Stop the event from bubbling up
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="flex">
      <Card className="flex flex-col w-full hover:shadow-lg transition-shadow">
        <CardHeader className="relative p-0">
          <img 
            src={product.image_url || '/placeholder.svg'} 
            alt={product.name} 
            className="aspect-square w-full rounded-t-lg object-cover" 
          />
          {product.is_sold && (
            <Badge variant="destructive" className="absolute top-2 right-2">Vendido</Badge>
          )}
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
          {product.collection && (
            <p className="mt-1 text-sm text-muted-foreground">{product.collection}</p>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
          <Button disabled={product.is_sold} onClick={handleAddToCart}>
            {product.is_sold ? 'No disponible' : 'Añadir al carrito'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;