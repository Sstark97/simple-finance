import type {ReactNode} from "react";
import {GetNetWorthHistory} from '@/lib/application/use-cases/GetNetWorthHistory';
import {GoogleSheetsNetWorthRepository} from '@/lib/infrastructure/repositories/GoogleSheetsNetWorthRepository';
import {PatrimonioHeader} from '@/app/components/patrimonio/patrimonio-header';
import {PatrimonioKPIs} from '@/app/components/patrimonio/patrimonio-kpis';
import {PatrimonioLineChart} from '@/app/components/patrimonio/patrimonio-line-chart';
import {PatrimonioTable} from '@/app/components/patrimonio/patrimonio-table';
import {PkiCalculator} from "@/lib/domain/services/kpi-calculator";

export default async function PatrimonioPage(): Promise<ReactNode> {
    const netWorthRepository = new GoogleSheetsNetWorthRepository();
    const getNetWorthHistoryUseCase = new GetNetWorthHistory(netWorthRepository);
    const { patrimonio, error } = await getNetWorthHistoryUseCase.execute();
    const { currentTotal, previousTotal, growthPercentage } = new PkiCalculator(patrimonio);

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl">
                {error && (
                    <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                        <p className="text-sm font-medium text-destructive">
                            <strong>Error:</strong> {error}
                        </p>
                    </div>
                )}

                {!error && (
                    <>
                        <PatrimonioHeader/>
                        <PatrimonioKPIs currentTotal={currentTotal} previousTotal={previousTotal}
                                        growthPercentage={growthPercentage}/>
                        <PatrimonioLineChart data={patrimonio}/>
                        <PatrimonioTable data={patrimonio}/>
                    </>
                )}
            </div>
        </main>
    );
}
