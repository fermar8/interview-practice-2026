import Button from "./Button";

type Slot = {
  id: string;
  capacity: number;
  reserved: number;
};

type SlotListProps = {
  slots: Slot[];
  selectedSlotId: string;
  onSelectSlot: (slotId: string) => void;
};

export default function SlotList({
  slots,
  selectedSlotId,
  onSelectSlot,
}: SlotListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Available slots
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {slots.length} total
        </span>
      </div>

      <div className="space-y-3">
        {slots.map((slot) => {
          const isSelected = selectedSlotId === slot.id;
          const remaining = Math.max(slot.capacity - slot.reserved, 0);

          return (
            <div
              key={slot.id}
              className={`flex items-center justify-between gap-3 rounded-xl border p-4 ${
                isSelected
                  ? "border-sky-300 bg-sky-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div>
                <div className="text-sm font-medium text-slate-700">
                  {slot.id}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Capacity {slot.capacity} · Reserved {slot.reserved} ·
                  Remaining {remaining}
                </div>
              </div>
              <Button
                variant={isSelected ? "secondary" : "primary"}
                onClick={() => onSelectSlot(slot.id)}
              >
                {isSelected ? "Selected" : "Select"}
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
