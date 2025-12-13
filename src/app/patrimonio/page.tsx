import type {ReactNode} from "react";
import {GetHeritageUseCase} from '@/lib/application/use-cases/GetHeritageUseCase';
import {GoogleSheetsNetWorthRepository} from '@/lib/infrastructure/repositories/GoogleSheetsNetWorthRepository';
import {HeritageHeader} from '@/app/components/heritage/heritage-header';
import {HeritageKPIs} from '@/app/components/heritage/heritage-kpis';
import {HeritageLineChart} from '@/app/components/heritage/heritage-line-chart';
import {HeritageTable} from '@/app/components/heritage/heritage-table';
import {PkiCalculator} from "@/lib/domain/services/kpi-calculator";

export default async function HeritagePage(): Promise<ReactNode> {
    const netWorthRepository = new GoogleSheetsNetWorthRepository();
    const getHeritageUseCase = new GetHeritageUseCase(netWorthRepository);
    const { heritage, error } = await getHeritageUseCase.execute();
    const { currentTotal, previousTotal, growthPercentage } = new PkiCalculator(heritage);

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
                        <HeritageHeader/>
                        <HeritageKPIs currentTotal={currentTotal} previousTotal={previousTotal}
                                        growthPercentage={growthPercentage}/>
                        <HeritageLineChart data={heritage}/>
                        <HeritageTable data={heritage}/>
                    </>
                )}
            </div>
        </main>
    );
}
