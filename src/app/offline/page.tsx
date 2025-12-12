import { Wifi, WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Wifi className="h-24 w-24 text-muted-foreground" />
            <WifiOff className="absolute inset-0 h-24 w-24 text-destructive" />
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">Sin conexión</h1>

        <p className="mb-8 text-muted-foreground">
          No tienes conexión a internet. Algunas funciones pueden no estar disponibles.
        </p>

        <div className="rounded-lg bg-muted p-4 text-sm">
          <p className="mb-2 font-medium">Puedes:</p>
          <ul className="list-inside list-disc space-y-1 text-left text-muted-foreground">
            <li>Ver datos previamente cargados</li>
            <li>Navegar por la aplicación</li>
            <li>Los cambios se sincronizarán cuando recuperes la conexión</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
