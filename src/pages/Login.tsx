import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Acceso de Administrador</CardTitle>
          </CardHeader>
          <CardContent>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
              theme="light"
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
                    button_label: 'Registrarse',
                    loading_button_label: 'Registrando...',
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