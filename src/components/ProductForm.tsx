import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError } from '@/utils/toast';
import { Product } from '@/types';

const productSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  description: z.string().optional(),
  price: z.coerce.number().positive('El precio debe ser un número positivo.'),
  image_url: z.string().url('Debe ser una URL válida.').optional().or(z.literal('')),
});

interface ProductFormProps {
  onProductAdded: (product: Product) => void;
}

const ProductForm = ({ onProductAdded }: ProductFormProps) => {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image_url: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: values.name,
          description: values.description,
          price: values.price,
          image_url: values.image_url || null,
        },
      ])
      .select()
      .single();

    if (error) {
      showError('Error al añadir el producto: ' + error.message);
    } else if (data) {
      onProductAdded(data);
      form.reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Añadir Nueva Joya</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Collar de Plata" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Ej: 99.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe la joya..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de la Imagen</FormLabel>
                  <FormControl>
                    <Input placeholder="https://ejemplo.com/imagen.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Añadiendo...' : 'Añadir Producto'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;