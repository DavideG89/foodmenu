import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CartSuccessPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-text">Ordine confermato!</h1>
        <p className="text-sm text-text/70">
          Ti aspettiamo in sede per il ritiro e il pagamento in contanti.
        </p>
      </div>
      <Button asChild>
        <Link href="/pickup">Torna alla home</Link>
      </Button>
    </div>
  );
}
