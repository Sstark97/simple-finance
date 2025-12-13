import type {Dashboard} from '@/lib/domain/models/Dashboard';
import {GetCurrentDashboard} from '@/lib/application/use-cases/GetCurrentDashboard';
import {GoogleSheetsDashboardRepository} from '@/lib/infrastructure/repositories/GoogleSheetsDashboardRepository';
import {MonthlySettingsForm} from '@/app/components/dashboard/MonthlySettingsForm';
import {NetWorthForm} from '@/app/components/dashboard/NetWorthForm';
import {DashboardHeader} from "@/app/components/dashboard/dashboard-header";
import {KPICard} from "@/app/components/dashboard/kpi-card";
import {IncomeExpenseChart} from "@/app/components/dashboard/income-expense-chart";
import {BalanceGoalsChart} from "@/app/components/dashboard/balance-goals-chart";
import {NavigationCards} from "@/app/components/dashboard/navigation-cards";
import {TransactionForm} from "@/app/components/dashboard/transaction-form";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/app/components/ui/tabs";
import {
    FinanceCard,
    FinanceCardContent,
    FinanceCardDescription,
    FinanceCardHeader,
    FinanceCardTitle,
} from "@/app/components/ui/finance-card";
import {ArrowDownCircle, ArrowUpCircle, Target} from "lucide-react";
import {Skeleton} from "@/app/components/ui/skeleton";

const getYearMonth = (date: Date) => date.toISOString().slice(0, 7);

interface DashboardViewProps {
 searchParams?: Promise<{ month?: string;}>;
}

export default async function DashboardView({searchParams}: DashboardViewProps) {
    const selectedMonthParam = (await searchParams)?.month;
    const haveSelectedMonth = selectedMonthParam && !isNaN(new Date(selectedMonthParam).getTime());
    const dateToFetch: Date = haveSelectedMonth ? new Date(selectedMonthParam) : new Date(new Date().setDate(1));
    const selectedMonthString = getYearMonth(dateToFetch);
    const dashboardRepository = new GoogleSheetsDashboardRepository();
    const getCurrentDashboardUseCase = new GetCurrentDashboard(dashboardRepository);
    const {
        dashboard: dashboardData,
        error: errorMessage,
        showMessage
    } = await getCurrentDashboardUseCase.execute(dateToFetch);

    const {
        totalIncome: income,
        totalExpenses: expenses,
        balance,
        totalSaving: saving,
        totalInvestment: investment,
        totalFreeMoney: freeMoney,
        month,
        state
    } = dashboardData as Dashboard;

    const currentMonth = dashboardData ? getYearMonth(month) : getYearMonth(new Date());
    const initialMonthlySettings = {
        month: currentMonth,
        income,
        saving,
        investment
    };
    const initialNetWorth = {
        month: currentMonth,
        saving: 0,
        investment: 0,
    };

    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    <DashboardHeader selectedMonth={selectedMonthString}/>

                    <section aria-label="Indicador principal">
                        {dashboardData && !showMessage ? (
                            <KPICard amount={freeMoney} label="Dinero Libre"
                                     description="Disponible después de expenses y objetivos"/>
                        ) : (
                            <Skeleton className="h-[120px] w-full"/>
                        )}
                    </section>
                    <section aria-label="Gráficos financieros" className="grid gap-6 lg:grid-cols-2">
                        {dashboardData && !showMessage ? (
                            <>
                                <IncomeExpenseChart income={income} expenses={expenses}/>
                                <BalanceGoalsChart
                                    balance={balance}
                                    savings={saving}
                                    investment={investment}
                                />
                            </>
                        ) : (
                            <>
                                <Skeleton className="h-64 w-full"/>
                                <Skeleton className="h-64 w-full"/>
                            </>
                        )}
                    </section>

                    {showMessage && (
                        <div className="py-10 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                            <h3 className="text-lg font-semibold">
                                {errorMessage || "No hay datos para este month"}
                            </h3>
                            <p className="text-sm">Selecciona otro mes o utiliza los formularios de abajo para añadir
                                información.</p>
                        </div>
                    )}


                    <section aria-label="Navegación rápida">
                        <NavigationCards/>
                    </section>

                    {/* Inlined and wired-up TransactionForm */}
                    <section aria-label="Formularios de gestión">
                        <FinanceCard>
                            <FinanceCardHeader>
                                <FinanceCardTitle>Gestión Rápida</FinanceCardTitle>
                                <FinanceCardDescription>Añade transacciones, ajusta objetivos o actualiza tu
                                    patrimonio.</FinanceCardDescription>
                            </FinanceCardHeader>
                            <FinanceCardContent>
                                <Tabs defaultValue="expense" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-lg h-auto">
                                        <TabsTrigger
                                            value="settings"
                                            className="flex items-center gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:text-[#10B981] data-[state=active]:shadow-sm rounded-md transition-all"
                                        >
                                            <ArrowUpCircle className="h-4 w-4"/>
                                            <span className="hidden sm:inline">Ajustes</span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="expense"
                                            className="flex items-center gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:text-[#EF4444] data-[state=active]:shadow-sm rounded-md transition-all"
                                        >
                                            <ArrowDownCircle className="h-4 w-4"/>
                                            <span className="hidden sm:inline">Gasto</span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="networth"
                                            className="flex items-center gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:text-[#8b5cf6] data-[state=active]:shadow-sm rounded-md transition-all"
                                        >
                                            <Target className="h-4 w-4"/>
                                            <span className="hidden sm:inline">Patrimonio</span>
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Tab for Monthly Settings */}
                                    <TabsContent value="settings" className="mt-6 space-y-4">
                                        <MonthlySettingsForm initialMonthlySettings={initialMonthlySettings}/>
                                    </TabsContent>

                                    {/* Tab for Expenses */}
                                    <TabsContent value="expense" className="mt-6">
                                        <TransactionForm/>
                                    </TabsContent>

                                    {/* Tab for Net Worth */}
                                    <TabsContent value="networth" className="mt-6 space-y-4">
                                        <NetWorthForm initialNetWorth={initialNetWorth}/>
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
