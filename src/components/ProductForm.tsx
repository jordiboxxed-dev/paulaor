import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { showError } from '@/utils/toast';
import { Product } from '@/types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const productSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  description: z.string().optional(),
  collection: z.string().optional(),
  price: z.coerce.number().positive('El precio debe ser un número positivo.'),
  image: z
    .any()
    .refine((files) => !files || files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo es 5MB.`)
    .refine(
      (files) => !files || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Solo se aceptan formatos .jpg, .jpeg, .png y .webp.',
    )
    .optional(),
});

interface ProductFormProps {
  product?: Product | null;
  onFinished: () => void;
}

const ProductForm = ({ product, onFinished }: ProductFormProps) => {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      collection: '',
      price: 0,
    },
  });

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        collection: product.collection,
        price: product.price,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        collection: '',
        price: 0,
      });
    }
  }, [product, form]);

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    try {
      let imageUrl = product?.image_url || null;

      if (values.image && values.image.length > 0) {
        const file = values.image[0];
        const fileName = `${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product_images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('product_images').getPublicUrl(uploadData.path);
        imageUrl = urlData.publicUrl;
      }

      const productData = {
        name: values.name,
        description: values.description,
        collection: values.collection,
        price: values.price,
        image_url: imageUrl,
      };

      if (isEditing) {
        const { error } = await supabase.from('products').update(productData).eq('id', product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
      }

      onFinished();
    } catch (error: any) {
      showError('Error al guardar el producto: ' + error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Joya' : 'Añadir Nueva Joya'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Modifica los detalles de la joya.' : 'Rellena los campos para añadir un nuevo producto.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl><Input placeholder="Ej: Collar de Plata" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder="Ej: 99.99" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colección</FormLabel>
                    <FormControl><Input placeholder="Ej: Verano 2024" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl><Textarea placeholder="Describe la joya..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen</FormLabel>
                  <FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Guardando...' : 'Guardar Producto'}
              </Button>
              <Button type="button" variant="outline" onClick={onFinished}>
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;