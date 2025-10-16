import { InfoCard } from '@/components/InfoCard';
import { restaurantInfo } from '@/data/mockData';

export default function InfoPage() {
  return (
    <div className="space-y-6 pb-16">
      <InfoCard info={restaurantInfo} />
      <section className="rounded-2xl bg-white p-5 shadow-soft">
        <h2 className="text-xl font-semibold text-text">Orari</h2>
        <table className="mt-4 w-full text-sm">
          <tbody>
            {restaurantInfo.hours.map((entry) => (
              <tr key={entry.day} className="border-b border-black/5 last:border-none">
                <td className="py-2 font-medium text-text">{entry.day}</td>
                <td className="py-2 text-right text-text/70">
                  {entry.open} - {entry.close}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="overflow-hidden rounded-2xl bg-white shadow-soft">
        <iframe
          title="Mappa"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.541809221773!2d14.248780676697962!3d40.83588437137585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133b086380f843d9%3A0x733c92d93aa72cd4!2sVia%20Roma%2C%2042%2C%2080113%20Napoli%20NA!5e0!3m2!1sit!2sit!4v1715000000000!5m2!1sit!2sit"
          allowFullScreen
          loading="lazy"
          className="h-64 w-full border-0"
        />
      </section>
    </div>
  );
}
