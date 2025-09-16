import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Order } from '@/types';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { User } from '@supabase/supabase-js';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { showError, showSuccess } from '@/utils/toast';

const profileSchema = z.object({
  full_name: z.string().min(3, 'El nombre completo debe tener al menos 3 caracteres.'),
});

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
    },
  });

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);

      // Fetch profile and orders in parallel
      const [profileRes, ordersRes] = await Promise.all([
        supabase.from('user_profiles').select('full_name').eq('id', session.user.id).single(),
        supabase.from('orders').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
      ]);

      if (profileRes.error) {
        console.error('Error fetching profile:', profileRes.error);
      } else if (profileRes.data) {
        form.reset({ full_name: profileRes.data.full_name || '' });
      }

      if (ordersRes.error) {
        console.error('Error fetching orders:', ordersRes.error);
      } else {
        setOrders(ordersRes.data);
      }
      
      setLoading(false);
    };
    checkUserAndFetchData();
  }, [navigate, form]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ full_name: values.full_name, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (error) throw error;
      showSuccess('Perfil actualizado correctamente.');
    } catch (error: any) {
      showError('Error al actualizar el perfil.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-48 w-full max-w-2xl" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <Button onClick={handleSignOut} variant="outline">Cerrar Sesión</Button>
        </div>
        <p className="mb-8 text-muted-foreground">Hola {user?.email}, aquí puedes gestionar tu perfil y ver tus pedidos.</p>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Actualiza tu nombre completo.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre Completo</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Mis Pedidos</h2>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Pedido del {format(new Date(order.created_at), 'dd/MM/yyyy')}</CardTitle>
                          <CardDescription>ID: {order.id}</CardDescription>
                        </div>
                        <Badge variant={order.status === 'paid' ? 'default' : 'secondary'} className="capitalize">{order.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold text-lg">${order.total_price.toFixed(2)}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full sm:w-auto">
                        <Link to={`/profile/orders/${order.id}`}>Ver Detalles</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold">No tienes pedidos todavía</h3>
                <p className="text-muted-foreground mt-2 mb-4">¡Explora nuestras colecciones y encuentra tu próxima joya!</p>
                <Button asChild>
                  <Link to="/">Ir a la Tienda</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;