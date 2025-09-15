import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductForm from '@/components/ProductForm';
import ProductTable from '@/components/ProductTable';
import { showError, showSuccess } from '@/utils/toast';
import { Product } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      showError('No se pudieron cargar los productos.');
    } else {
      setProducts(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
        fetchProducts();
      }
    };
    checkUser();
  }, [navigate, fetchProducts]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
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

  const handleFormFinished = () => {
    setShowForm(false);
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
        {showForm ? (
          <ProductForm product={editingProduct} onFinished={handleFormFinished} />
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Button onClick={() => { setEditingProduct(null); setShowForm(true); }}>Añadir Joya</Button>
            </div>
            {loading ? <p>Cargando productos...</p> : (
              <ProductTable products={products} onEdit={handleEdit} onDelete={(id) => setDeletingProductId(id)} />
            )}
          </>
        )}
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
    </div>
  );
};

export default Admin;