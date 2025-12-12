import { FinanceCard, FinanceCardContent, FinanceCardDescription, FinanceCardHeader, FinanceCardTitle } from '@/app/components/ui/finance-card';
import { GoogleSignInButton } from './GoogleSignInButton';

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}): Promise<React.ReactNode> {
  const params = await searchParams;
  const errorParam = params?.error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <FinanceCard className="w-full max-w-md" elevated>
        <FinanceCardHeader className="space-y-2">
          <FinanceCardTitle className="text-2xl font-bold">
            Simple Finance
          </FinanceCardTitle>
          <FinanceCardDescription className="text-base">
            Gestión inteligente de tus finanzas personales
          </FinanceCardDescription>
        </FinanceCardHeader>

        <FinanceCardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Inicia sesión con tu cuenta de Google para comenzar
            </p>
          </div>

          {errorParam === 'unauthorized' && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              No tienes permiso para acceder a esta aplicación.
            </div>
          )}

          <GoogleSignInButton />

          <div className="pt-2 text-center text-xs text-muted-foreground">
            <p>
              Al iniciar sesión, aceptas nuestros términos de servicio
            </p>
          </div>
        </FinanceCardContent>
      </FinanceCard>
    </div>
  );
}
