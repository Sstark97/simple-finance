'use client';

import {ReactNode, useActionState, useEffect, useRef} from 'react';
import { useFormStatus } from 'react-dom';
import { FinanceInput } from '@/app/components/ui/finance-input';
import { FinanceButton } from '@/app/components/ui/finance-button';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { updateMonthlySettings, MonthlySettingsFormState } from '@/lib/infrastructure/actions/monthlySettingsActions';

interface MonthlySettingsFormProps {
  initialMonthlySettings: {
    month: string;
    income: number;
    saving: number;
    investment: number;
  };
}

const initialState: MonthlySettingsFormState = {
  message: undefined,
  errors: {},
};

function SubmitButton(): ReactNode {
  const { pending } = useFormStatus();

  return (
    <FinanceButton variant="success" className="w-full mt-4" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      Actualizar Ajustes
    </FinanceButton>
  );
}

export function MonthlySettingsForm({ initialMonthlySettings }: MonthlySettingsFormProps): ReactNode {
  const [state, formAction] = useActionState(updateMonthlySettings, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
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
          defaultValue={initialMonthlySettings.income}
          aria-describedby="income-error"
        />
        <div id="ingresos-error" aria-live="polite" aria-atomic="true">
          {state.errors?.income &&
            state.errors.income.map((error: string) => (
              <p className="mt-1 text-xs text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <div>
        <FinanceInput label="Objetivo Ahorro" type="number" icon={<span className="text-sm font-medium">€</span>} className="mt-4"
          name="ahorro"
          defaultValue={initialMonthlySettings.saving}
          aria-describedby="saving-error"
        />
        <div id="ahorro-error" aria-live="polite" aria-atomic="true">
          {state.errors?.saving &&
            state.errors.saving.map((error: string) => (
              <p className="mt-1 text-xs text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <div>
        <FinanceInput label="Objetivo Inversión" type="number" icon={<span className="text-sm font-medium">€</span>} className="mt-4"
          name="inversion"
          defaultValue={initialMonthlySettings.investment}
          aria-describedby="investment-error"
        />
        <div id="inversion-error" aria-live="polite" aria-atomic="true">
          {state.errors?.investment &&
            state.errors.investment.map((error: string) => (
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