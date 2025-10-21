import { ReservationSuccess } from './reservation-success';

type SuccessPageProps = {
  params: {
    id: string;
  };
};

export default function SuccessPage({ params }: SuccessPageProps) {
  return <ReservationSuccess reservationId={params.id} />;
}

