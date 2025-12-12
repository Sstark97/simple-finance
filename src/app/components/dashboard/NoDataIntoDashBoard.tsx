"use client";
import {Skeleton} from "@/app/components/ui/skeleton";
import { useEffect, useState } from "react";

export const NoDataIntoDashBoard = () => {
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!showMessage) {
        return (
            <>
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-[300px] w-full" />
            </>
        );
    }

    return (
        <div className="py-10 border-2 border-dashed rounded-lg text-center text-muted-foreground">
            <h3 className="text-lg font-semibold">No hay datos para este mes</h3>
            <p className="text-sm">Selecciona otro mes o utiliza los formularios de abajo para añadir información.</p>
        </div>
    );
}