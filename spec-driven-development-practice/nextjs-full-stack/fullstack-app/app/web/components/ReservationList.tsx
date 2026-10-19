type Reservation = {
  id: string;
  slotId: string;
  userId: string;
  createdAt: string;
};

type ReservationListProps = {
  reservations: Reservation[];
  onCancelReservation: (reservationId: string) => void;
};

const formatReservationTimestamp = (createdAt: string) => {
  const timestamp = new Date(createdAt);
  return `${timestamp.toISOString().slice(0, 19).replace("T", " ")} UTC`;
};

export default function ReservationList({
  reservations,
  onCancelReservation,
}: ReservationListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 text-xl font-semibold text-slate-900">
        Reservations
      </div>

      {reservations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          No active reservations yet.
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div>
                <div className="text-sm font-medium text-slate-800">
                  {reservation.userId}
                </div>
                <div className="text-xs text-slate-500">
                  {reservation.slotId} ·{" "}
                  {formatReservationTimestamp(reservation.createdAt)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onCancelReservation(reservation.id)}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
