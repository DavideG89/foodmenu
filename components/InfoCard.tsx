import { RestaurantInfo } from '@/data/mockData';
import { Button } from '@/components/ui/button';

export const InfoCard = ({ info }: { info: RestaurantInfo }) => {
  return (
    <section className="space-y-4 rounded-2xl bg-white p-5 shadow-soft">
      <div>
        <h2 className="text-xl font-semibold text-text">Dove siamo</h2>
        <p className="mt-1 text-sm text-text/70">{info.address}</p>
        <a href={`tel:${info.phone}`} className="mt-2 block text-base font-semibold text-primary">
          {info.phone}
        </a>
        <p className="text-sm text-text/60">{info.email}</p>
      </div>
      <div className="flex gap-3">
        <Button asChild fullWidth>
          <a href={`tel:${info.phone}`}>Chiama</a>
        </Button>
        <Button asChild variant="secondary" fullWidth>
          <a href={info.mapsUrl} target="_blank" rel="noreferrer">
            Indicazioni
          </a>
        </Button>
      </div>
    </section>
  );
};
