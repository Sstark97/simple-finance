'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { addTransaction, FormState } from '@/lib/infrastructure/actions/transactionActions';
import { FinanceInput } from '@/app/components/ui/finance-input';
import { FinanceButton } from '@/app/components/ui/finance-button';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from "sonner"

const initialState: FormState = {
  message: undefined,
  errors: {},
};

function SubmitButton(): React.ReactNode {
  const { pending } = useFormStatus();

  return (
    <FinanceButton variant="destructive" className="w-full mt-4" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      Añadir Gasto
    </FinanceButton>
  );
}

export function TransactionForm(): React.ReactNode {
  const [state, formAction] = useActionState(addTransaction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && state.errors) {
        toast.error(state.message);
    } else if (state.message) {
        toast.success(state.message);
        formRef.current?.reset();
    }
  }, [state]);


  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <FinanceInput 
          label="Concepto" 
          name="description"
          placeholder="Ej: Supermercado" 
          aria-describedby="description-error"
        />
        <div id="description-error" aria-live="polite" aria-atomic="true">
          {state.errors?.concepto &&
            state.errors.concepto.map((error: string) => (
              <p className="mt-1 text-xs text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <div>
        <FinanceInput 
          label="Cantidad" 
          name="amount"
          placeholder="0,00" 
          type="number" 
          icon={<span className="text-sm font-medium">€</span>} 
          aria-describedby="amount-error"
        />
        <div id="amount-error" aria-live="polite" aria-atomic="true">
          {state.errors?.importe &&
            state.errors.importe.map((error: string) => (
              <p className="mt-1 text-xs text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <div>
        <FinanceInput 
          label="Fecha" 
          name="date"
          type="month"
          defaultValue={new Date().toISOString().split('T')[0]}
          aria-describedby="month-error"
        />
        <div id="date-error" aria-live="polite" aria-atomic="true">
          {state.errors?.fechaCobro &&
            state.errors.fechaCobro.map((error: string) => (
              <p className="mt-1 text-xs text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      
      <SubmitButton />

    </form>
  );
}