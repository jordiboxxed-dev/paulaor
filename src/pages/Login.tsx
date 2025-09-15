import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Redirect to home page after login
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Accede a tu Cuenta</CardTitle>
            <CardDescription className="text-center pt-2">
              O crea una cuenta para guardar tu historial de pedidos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
              theme="light"
              view="sign_in"
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Correo electrónico',
                    password_label: 'Contraseña',
                    button_label: 'Iniciar sesión',
                    loading_button_label: 'Iniciando sesión...',
                  },
                  sign_up: {
                    email_label: 'Correo electrónico',
                    password_label: 'Contraseña',
                    button_label: 'Crear cuenta',
                    loading_button_label: 'Creando cuenta...',
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;