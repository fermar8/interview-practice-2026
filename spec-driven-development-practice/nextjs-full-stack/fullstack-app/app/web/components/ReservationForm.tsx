import { useState } from "react";

import Button from "./Button";

type ReservationFormProps = {
  slotId: string;
  onReserve: (slotId: string, userId: string) => void;
};

export default function ReservationForm({
  slotId,
  onReserve,
}: ReservationFormProps) {
  const [userId, setUserId] = useState("guest-user");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userId.trim()) {
      onReserve(slotId, userId.trim());
      setUserId("guest-user");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Reserve selected slot
      </div>
      <div className="mb-3 text-sm text-slate-700">
        Selected slot: <span className="font-semibold">{slotId || "None"}</span>
      </div>
      <label
        className="block text-sm font-medium text-slate-700"
        htmlFor="user-id"
      >
        User ID
      </label>
      <div className="mt-2 flex gap-3">
        <input
          id="user-id"
          type="text"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none ring-0 focus:border-sky-500"
        />
        <Button type="submit" disabled={!slotId} variant="primary">
          Reserve
        </Button>
      </div>
    </form>
  );
}
