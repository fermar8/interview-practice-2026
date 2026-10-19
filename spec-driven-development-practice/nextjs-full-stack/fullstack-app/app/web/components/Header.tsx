export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
            Slot Reservation
          </p>
          <h1 className="mt-1 text-xl font-bold text-slate-900">
            Capacity planner
          </h1>
        </div>
        <div className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
          Live availability
        </div>
      </div>
    </header>
  );
}
