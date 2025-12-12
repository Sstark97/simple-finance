"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { cn } from "@/lib/utils"
import { authClient } from '@/lib/infrastructure/auth/client';
import { Button } from "@/app/(components)/ui/button";
import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  selectedMonth: string;
}

export function DashboardHeader({ selectedMonth }: DashboardHeaderProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newMonth = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('month', newMonth);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLogout = async (): Promise<void> => {
    await authClient.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header
      className={cn(
        "space-y-2 opacity-0 -translate-y-2",
        isLoaded && "opacity-100 translate-y-0 transition-all duration-500",
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">Panel de Finanzas</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="month-select" className="text-sm font-medium text-muted-foreground">Mes:</label>
          <input
              type="month"
              id="month-select"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="block w-full sm:w-auto rounded-md border-input bg-background p-2 text-sm shadow-sm focus:border-primary focus:ring-primary"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
       <p className="text-muted-foreground text-sm">
        Mostrando datos para {new Date(selectedMonth + '-02').toLocaleDateString("es-ES", { month: "long", year: "numeric", timeZone: 'UTC' })}
      </p>
    </header>
  )
}
