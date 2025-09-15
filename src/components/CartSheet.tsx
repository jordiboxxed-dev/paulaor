import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export const CartSheet = () => {
  const { cartItems, cartCount, removeFromCart, updateQuantity } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative rounded-full p-2 hover:bg-accent">
          <ShoppingCart className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {cartCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Carrito ({cartCount})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartCount > 0 ? (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="flex flex-col gap-4 py-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image_url || '/placeholder.svg'}
                        alt={item.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                        className="h-8 w-14"
                      />
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="px-6 py-4">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <SheetClose asChild>
                  <Link to="/checkout" className="w-full">
                    <Button className="w-full">Proceder al Pago</Button>
                  </Link>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">Tu carrito está vacío</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};