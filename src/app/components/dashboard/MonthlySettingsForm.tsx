'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { FinanceInput } from '@/app/components/ui/finance-input';
import { FinanceButton } from '@/app/components/ui/finance-button';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { updateMonthlySettings, MonthlySettingsFormState } from '@/lib/infrastructure/actions/monthlySettingsActions';

interface MonthlySettingsFormProps {
  initialMonthlySettings: {
    month: string;
    ingresos: number;
    ahorro: number;
    inversion: number;
  };
}

const initialState: MonthlySettingsFormState = {
  message: undefined,
  errors: {},
};

function SubmitButton(): React.ReactNode {
  const { pending } = useFormStatus();

  return (
    <FinanceButton variant="success" className="w-full mt-4" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      Actualizar Ajustes
    </FinanceButton>
  );
}

export function MonthlySettingsForm({ initialMonthlySettings }: MonthlySettingsFormProps): React.ReactNode {
  const [state, formAction] = useActionState(updateMonthlySettings, initialState);
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
        <FinanceInput 
          label="Ingresos Mensuales" 
          type="number" 
          icon={<span className="text-sm font-medium">€</span>}
          name="ingresos"
          defaultValue={initialMonthlySettings.ingresos}
          aria-describedby="ingresos-error"
        />
        <div id="ingresos-error" aria-live="polite" aria-atomic="true">
          {state.errors?.ingresos &&
            state.errors.ingresos.map((error: string) => (
              <p className="mt-1 text-xs text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <div>
        <FinanceInput label="Objetivo Ahorro" type="number" icon={<span className="text-sm font-medium">€</span>} className="mt-4"
          name="ahorro"
          defaultValue={initialMonthlySettings.ahorro}
          aria-describedby="ahorro-error"
        />
        <div id="ahorro-error" aria-live="polite" aria-atomic="true">
          {state.errors?.ahorro &&
            state.errors.ahorro.map((error: string) => (
              <p className="mt-1 text-xs text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <div>
        <FinanceInput label="Objetivo Inversión" type="number" icon={<span className="text-sm font-medium">€</span>} className="mt-4"
          name="inversion"
          defaultValue={initialMonthlySettings.inversion}
          aria-describedby="inversion-error"
        />
        <div id="inversion-error" aria-live="polite" aria-atomic="true">
          {state.errors?.inversion &&
            state.errors.inversion.map((error: string) => (
              <p className="mt-1 text-xs text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <input type="hidden" name="month" value={initialMonthlySettings.month} />
      <SubmitButton />
    </form>
  );
}