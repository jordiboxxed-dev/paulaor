import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductForm from '@/components/ProductForm';
import { showError, showSuccess } from '@/utils/toast';
import { Product } from '@/types';

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError('Error al cerrar sesión.');
    } else {
      navigate('/');
    }
  };

  const handleProductAdded = (newProduct: Product) => {
    showSuccess(`¡Producto "${newProduct.name}" añadido con éxito!`);
  };

  if (!user) {
    return null; // O un spinner de carga
  }

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
        <ProductForm onProductAdded={handleProductAdded} />
        {/* Aquí se podría añadir una lista de productos para editar/eliminar en el futuro */}
      </main>
    </div>
  );
};

export default Admin;