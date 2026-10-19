import { useState } from "react";

import Button from "./Button";

type SlotFormProps = {
  onCreateSlot: (capacity: number) => void;
};

export default function SlotForm({ onCreateSlot }: SlotFormProps) {
  const [capacity, setCapacity] = useState("10");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = Number(capacity);
    if (Number.isInteger(parsed) && parsed > 0) {
      onCreateSlot(parsed);
      setCapacity("10");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Create slot
      </div>
      <label
        className="block text-sm font-medium text-slate-700"
        htmlFor="slot-capacity"
      >
        Capacity
      </label>
      <div className="mt-2 flex gap-3">
        <input
          id="slot-capacity"
          type="number"
          min={1}
          value={capacity}
          onChange={(event) => setCapacity(event.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none ring-0 focus:border-sky-500"
        />
        <Button type="submit">Add slot</Button>
      </div>
    </form>
  );
}
