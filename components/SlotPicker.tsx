'use client';

import { cn } from '@/lib/utils';
import type { SlotSummary } from '@/lib/types/reservation';

type SlotPickerProps = {
  slots: SlotSummary[];
  value?: string;
  onChange: (slotId: string) => void;
  isLoading?: boolean;
  error?: string;
};

const timeFormatter = new Intl.DateTimeFormat('it-IT', {
  hour: '2-digit',
  minute: '2-digit'
});

const formatTimeRange = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)}`;
};

export const SlotPicker = ({ slots, value, onChange, isLoading, error }: SlotPickerProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <span
            key={index}
            className="h-10 w-28 animate-pulse rounded-full bg-pearl/70"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!slots.length) {
    return <p className="text-sm text-text/60">Nessuno slot disponibile per la data selezionata.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {slots.map((slot) => {
        const isSelected = slot.id === value;
        const isDisabled = slot.remaining === 0;
        return (
          <button
            key={slot.id}
            type="button"
            onClick={() => {
              if (!isDisabled) {
                onChange(slot.id);
              }
            }}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              isSelected
                ? 'border-primary bg-primary text-white focus-visible:ring-primary/60'
                : 'border-text/10 bg-white text-text focus-visible:ring-primary/40',
              isDisabled && 'pointer-events-none opacity-40'
            )}
            aria-pressed={isSelected}
            aria-label={`Slot ${formatTimeRange(slot.start, slot.end)}${
              isDisabled ? ' non disponibile' : ''
            }`}
          >
            <span className="block text-left">{formatTimeRange(slot.start, slot.end)}</span>
            <span className="block text-left text-xs font-normal text-text/60">
              {slot.remaining} posti
            </span>
          </button>
        );
      })}
    </div>
  );
};

