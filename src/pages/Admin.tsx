import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductForm from '@/components/ProductForm';
import ProductTable from '@/components/ProductTable';
import OrdersTable from '@/components/OrdersTable';
import OrderDetailDialog from '@/components/OrderDetailDialog';
import { showError, showSuccess } from '@/utils/toast';
import { Product, Order } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      showError('No se pudieron cargar los productos.');
    } else {
      setProducts(data);
    }
    setLoadingProducts(false);
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) {
      showError('No se pudieron cargar los pedidos.');
    } else {
      setOrders(data);
    }
    setLoadingOrders(false);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
        fetchProducts();
        fetchOrders();
      }
    };
    checkUser();
  }, [navigate, fetchProducts, fetchOrders]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Product handlers
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProductId) return;
    
    const { error } = await supabase.from('products').delete().eq('id', deletingProductId);
    if (error) {
      showError('Error al eliminar el producto.');
    } else {
      showSuccess('Producto eliminado con éxito.');
      fetchProducts();
    }
    setDeletingProductId(null);
  };

  const handleProductFormFinished = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    fetchProducts();
    showSuccess(`Producto ${editingProduct ? 'actualizado' : 'añadido'} con éxito.`);
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">Bienvenido, {user.email}</p>
        </div>
        <Button onClick={handleSignOut} variant="outline">Cerrar Sesión</Button>
      </header>
      
      <main>
        <Tabs defaultValue="products">
          <TabsList className="mb-4">
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            {showProductForm ? (
              <ProductForm product={editingProduct} onFinished={handleProductFormFinished} />
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <Button onClick={() => { setEditingProduct(null); setShowProductForm(true); }}>Añadir Joya</Button>
                </div>
                {loadingProducts ? <p>Cargando productos...</p> : (
                  <ProductTable products={products} onEdit={handleEditProduct} onDelete={(id) => setDeletingProductId(id)} />
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="orders">
            {loadingOrders ? <p>Cargando pedidos...</p> : (
              <OrdersTable orders={orders} onViewDetails={setSelectedOrder} />
            )}
          </TabsContent>
        </Tabs>
      </main>

      <AlertDialog open={deletingProductId !== null} onOpenChange={() => setDeletingProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto se eliminará permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <OrderDetailDialog order={selectedOrder} onOpenChange={() => setSelectedOrder(null)} />
    </div>
  );
};

export default Admin;