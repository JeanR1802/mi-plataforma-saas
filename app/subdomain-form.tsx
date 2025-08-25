'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createSubdomainAction } from '@/app/actions';
import { Loader2 } from 'lucide-react';

type State = {
  subdomain?: string;
  icon?: string;
  success: boolean;
  error?: string;
};

function SubmitButton() {
  // Nota: `useFormStatus` debe usarse dentro del componente del formulario.
  // Aquí lo simulamos con `isPending` del `useActionState` para simplificar.
  return null; 
}

export function SubdomainForm() {
  const [state, action, isPending] = useActionState<State, FormData>(
    createSubdomainAction,
    { success: false }
  );

  return (
    <form action={action} className="space-y-4">
      <div className="flex gap-4">
        <Input
          name="subdomain"
          placeholder="subdomain"
          defaultValue={state.subdomain}
          className="flex-grow"
          required
        />
        <Input
          name="icon"
          placeholder="👋"
          maxLength={10}
          defaultValue={state.icon}
          className="w-20 text-center"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : 'Create Subdomain'}
      </Button>
      {state.error && (
        <p className="text-red-500 text-sm text-center">{state.error}</p>
      )}
    </form>
  );
}
