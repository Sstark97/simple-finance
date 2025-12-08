
import type { Dashboard } from '@/lib/domain/models/Dashboard';
import Link from "next/link";
import { GetCurrentDashboard } from '@/lib/application/use-cases/GetCurrentDashboard';
import { GoogleSheetsDashboardRepository } from '@/lib/infrastructure/repositories/GoogleSheetsDashboardRepository';
import { SPREADSHEET_ID } from '@/lib/infrastructure/google/sheetsClient';
import { MonthlySettingsForm } from './MonthlySettingsForm';
import { NetWorthForm } from './NetWorthForm';

// Import v0 components
import { DashboardHeader } from "@/app/(components)/dashboard/dashboard-header";
import { KPICard } from "@/app/(components)/dashboard/kpi-card";
import { IncomeExpenseChart } from "@/app/(components)/dashboard/income-expense-chart";
import { BalanceGoalsChart } from "@/app/(components)/dashboard/balance-goals-chart";
import { NavigationCards } from "@/app/(components)/dashboard/navigation-cards";
import { TransactionForm } from "@/app/(components)/dashboard/transaction-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/(components)/ui/tabs";
import {
    FinanceCard,
    FinanceCardHeader,
    FinanceCardTitle,
    FinanceCardDescription,
    FinanceCardContent,
} from "@/app/(components)/ui/finance-card";
import { FinanceButton } from "@/app/(components)/ui/finance-button";
import { FinanceInput } from "@/app/(components)/ui/finance-input";
import { cn } from "@/lib/utils";
import { Plus, ArrowUpCircle, ArrowDownCircle, Target, Loader2 } from "lucide-react";
import { Skeleton } from "@/app/(components)/ui/skeleton";
import { Empty } from "@/app/(components)/ui/empty";

// Función para obtener el mes en formato YYYY-MM
const getYearMonth = (date: Date) => date.toISOString().slice(0, 7);

export default async function DashboardView({
  searchParams,
}: {
  searchParams?: {
    month?: string;
  };
}) {
  const selectedMonthParam = searchParams?.month;

  let dateToFetch: Date;
  let selectedMonthString: string;

  if (selectedMonthParam && !isNaN(new Date(selectedMonthParam).getTime())) {
    dateToFetch = new Date(selectedMonthParam);
    selectedMonthString = getYearMonth(dateToFetch);
  } else {
    const today = new Date();
    dateToFetch = new Date(today.getFullYear(), today.getMonth(), 1);
    selectedMonthString = getYearMonth(dateToFetch);
  }
  
  // Asegurarnos de que usamos el primer día del mes para la búsqueda.
  dateToFetch.setDate(1);

  let dashboardData: Dashboard | null = null;
  let errorMessage: string | null = null;
  let showMessage: boolean = false;

  if (!SPREADSHEET_ID) {
    errorMessage = 'SPREADSHEET_ID no está configurado en las variables de entorno.';
    showMessage = true;
  } else {
    try {
      const dashboardRepository = new GoogleSheetsDashboardRepository();
      const getCurrentDashboardUseCase = new GetCurrentDashboard(dashboardRepository);
      dashboardData = await getCurrentDashboardUseCase.execute(dateToFetch);

      if (!dashboardData) {
        errorMessage = `No se encontraron datos del dashboard para el mes seleccionado.`;
        showMessage = true;
      }

    } catch (error: any) {
      console.error('Error detallado al obtener datos del dashboard:', error);

      if (error.code === 403) {
        errorMessage =
          'Error de permisos (403): La API de Google Sheets no está activada en tu proyecto de GCP o la cuenta de servicio no tiene permisos de "Editor" en la hoja de cálculo.';
      } else if (error.code === 404) {
        errorMessage = `No se pudo encontrar la hoja de cálculo con el ID proporcionado (404). Verifica que el SPREADSHEET_ID sea correcto.`;
      } else if (error.message?.includes('file not found')) {
        errorMessage = 'No se encontró el fichero `credentials.json`. Asegúrate de que está en la raíz del proyecto.';
      } else if (error.message?.includes('invalid_grant')) {
          errorMessage = 'Error de autenticación (invalid_grant). Revisa que el fichero `credentials.json` sea correcto y que la hora del sistema del servidor sea correcta.'
      } else {
          errorMessage = 'Ocurrió un error al cargar los datos del dashboard.';
      }
      showMessage = true;
    }
  }

  // Pre-fill forms with fetched data (for server components, this data will be rendered directly)
  const initialMonthlySettings = {
    month: dashboardData ? getYearMonth(dashboardData.mes) : getYearMonth(new Date()),
    ingresos: dashboardData?.ingresos || 0,
    ahorro: dashboardData?.ahorro || 0,
    inversion: dashboardData?.inversion || 0,
  };

  const initialNetWorth = {
    month: dashboardData ? getYearMonth(dashboardData.mes) : getYearMonth(new Date()),
    hucha: 0,
    invertido: 0,
  };
  
  // Derived state
  const ingresos = dashboardData?.ingresos || 0;
  const gastos = dashboardData?.gastos || 0;
  const ahorro = dashboardData?.ahorro || 0;
  const inversion = dashboardData?.inversion || 0;
  const dineroLibre = dashboardData?.dineroLibre || 0;
  const balance = ingresos - gastos;

  // Main JSX from v0 file, but with real data
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <DashboardHeader selectedMonth={selectedMonthString} />

          <section aria-label="Indicador principal">
            {dashboardData && !showMessage ? (
                <KPICard amount={dineroLibre} label="Dinero Libre" description="Disponible después de gastos y objetivos" />
            ) : (
                <Skeleton className="h-[120px] w-full" />
            )}
          </section>
          <section aria-label="Gráficos financieros" className="grid gap-6 lg:grid-cols-2">
            {dashboardData && !showMessage ? (
                <>
                    <IncomeExpenseChart income={ingresos} expenses={gastos} />
                    <BalanceGoalsChart
                        balance={balance}
                        savings={ahorro}
                        investment={inversion}
                    />
                </>
            ) : (
                <>
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </>
            )}
          </section>

            {showMessage && (
                <div className="py-10 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                    <h3 className="text-lg font-semibold">
                        {errorMessage || "No hay datos para este mes"}
                    </h3>
                    <p className="text-sm">Selecciona otro mes o utiliza los formularios de abajo para añadir información.</p>
                </div>
            )}


          <section aria-label="Navegación rápida">
            <NavigationCards />
          </section>

          {/* Inlined and wired-up TransactionForm */}
          <section aria-label="Formularios de gestión">
             <FinanceCard>
                <FinanceCardHeader>
                    <FinanceCardTitle>Gestión Rápida</FinanceCardTitle>
                    <FinanceCardDescription>Añade transacciones, ajusta objetivos o actualiza tu patrimonio.</FinanceCardDescription>
                </FinanceCardHeader>
                <FinanceCardContent>
                    <Tabs defaultValue="expense" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-lg h-auto">
                        <TabsTrigger
                            value="settings"
                            className="flex items-center gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:text-[#10B981] data-[state=active]:shadow-sm rounded-md transition-all"
                        >
                            <ArrowUpCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">Ajustes</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="expense"
                            className="flex items-center gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:text-[#EF4444] data-[state=active]:shadow-sm rounded-md transition-all"
                        >
                            <ArrowDownCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">Gasto</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="networth"
                            className="flex items-center gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:text-[#8b5cf6] data-[state=active]:shadow-sm rounded-md transition-all"
                        >
                            <Target className="h-4 w-4" />
                            <span className="hidden sm:inline">Patrimonio</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab for Monthly Settings */}
                    <TabsContent value="settings" className="mt-6 space-y-4">
                        <MonthlySettingsForm initialMonthlySettings={initialMonthlySettings} />
                    </TabsContent>

                    {/* Tab for Expenses */}
                    <TabsContent value="expense" className="mt-6">
                        <TransactionForm />
                    </TabsContent>

                    {/* Tab for Net Worth */}
                    <TabsContent value="networth" className="mt-6 space-y-4">
                        <NetWorthForm initialNetWorth={initialNetWorth} />
                    </TabsContent>
                    </Tabs>
                </FinanceCardContent>
            </FinanceCard>
          </section>
        </div>
      </div>
    </main>
  );
}
