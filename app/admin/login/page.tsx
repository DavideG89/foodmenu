'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/lib/store/admin-store';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast-provider';

const ADMIN_PASSWORD = 'greenburger';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  const login = useAdminStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/admin');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !code.trim()) {
      toast({
        title: 'Compila tutti i campi',
        description: 'Inserisci email e password temporanea.',
        duration: 3000
      });
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      if (code === ADMIN_PASSWORD) {
        login();
        toast({
          title: 'Accesso riuscito',
          description: 'Benvenuto nella dashboard GreenBurger.',
          duration: 2500
        });
        router.push('/admin');
      } else {
        toast({
          title: 'Codice errato',
          description: "Verifica l'email o richiedi un nuovo link.",
          duration: 3500
        });
      }
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-text">Dashboard manager</h1>
        <p className="text-sm text-text/60">
          Inserisci le credenziali temporanee ricevute via email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
        <label className="flex flex-col gap-2 text-sm font-medium text-text">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nome@greenburger.it"
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-text">
          Password temporanea
          <input
            type="password"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Inserisci il codice"
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Accesso…' : 'Entra nella dashboard'}
        </Button>
        <p className="text-xs text-text/50">
          Questa è una demo con accesso semplificato. Nessuna email reale viene inviata.
        </p>
      </form>
    </div>
  );
}
