'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { FinanceInput } from '@/app/(components)/ui/finance-input';
import { FinanceButton } from '@/app/(components)/ui/finance-button';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { updateNetWorth, NetWorthFormState } from '@/lib/infrastructure/actions/netWorthActions';

interface NetWorthFormProps {
  initialNetWorth: {
    month: string;
    hucha: number;
    invertido: number;
  };
}

const initialState: NetWorthFormState = {
  message: undefined,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <FinanceButton variant="primary" className="w-full mt-4 bg-purple-600 hover:bg-purple-700" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      Actualizar Patrimonio
    </FinanceButton>
  );
}

export function NetWorthForm({ initialNetWorth }: NetWorthFormProps) {
  const [state, formAction] = useActionState(updateNetWorth, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
        // No reset needed as initial values come from props
      }
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <FinanceInput label="Hucha (Efectivo)" placeholder="0,00" type="number" icon={<span className="text-sm font-medium">€</span>}
          name="hucha"
          defaultValue={initialNetWorth.hucha}
          aria-describedby="hucha-error"
        />
        <div id="hucha-error" aria-live="polite" aria-atomic="true">
          {state.errors?.hucha &&
            state.errors.hucha.map((error: string) => (
              <p className="mt-1 text-xs text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <div>
        <FinanceInput label="Total Invertido" placeholder="0,00" type="number" icon={<span className="text-sm font-medium">€</span>} className="mt-4"
          name="invertido"
          defaultValue={initialNetWorth.invertido}
          aria-describedby="invertido-error"
        />
        <div id="invertido-error" aria-live="polite" aria-atomic="true">
          {state.errors?.invertido &&
            state.errors.invertido.map((error: string) => (
              <p className="mt-1 text-xs text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <div>
        <FinanceInput label="Mes a actualizar" type="month" className="mt-4"
          name="month"
          defaultValue={initialNetWorth.month}
          aria-describedby="month-error"
        />
        <div id="month-error" aria-live="polite" aria-atomic="true">
          {state.errors?.month &&
            state.errors.month.map((error: string) => (
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