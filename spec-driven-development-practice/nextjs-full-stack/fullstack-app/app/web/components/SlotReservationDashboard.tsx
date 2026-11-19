"use client";

import { useEffect, useMemo, useState } from "react";

import MainLayout from "./MainLayout";
import ReservationForm from "./ReservationForm";
import ReservationList from "./ReservationList";
import SlotForm from "./SlotForm";
import SlotList from "./SlotList";
import { Slot, Reservation } from "@/app/model/types";

export default function SlotReservationDashboard() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof fetch !== "function") {
      return;
    }

    const loadData = async () => {
      try {
        const [slotsResponse, reservationsResponse] = await Promise.all([
          fetch("/api/slots"),
          fetch("/api/reservations"),
        ]);

        if (!slotsResponse.ok || !reservationsResponse.ok) {
          throw new Error("Database connection unavailable.");
        }

        const nextSlots = (await slotsResponse.json()) as Slot[];
        const nextReservations =
          (await reservationsResponse.json()) as Reservation[];

        setSlots(nextSlots);
        setReservations(nextReservations);
        setSelectedSlotId(nextSlots[0]?.id ?? "");
        setError(null);
      } catch {
        setSlots([]);
        setReservations([]);
        setSelectedSlotId("");
        setError("Database connection unavailable.");
      }
    };

    void loadData();
  }, []);

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId) ?? null,
    [selectedSlotId, slots],
  );

  const handleCreateSlot = async (capacity: number) => {
    try {
      const response = await fetch("/api/slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ capacity }),
      });

      if (!response.ok) {
        throw new Error("Failed to create slot");
      }

      const nextSlot = (await response.json()) as Slot;
      setSlots((current) => [...current, nextSlot]);
      setSelectedSlotId(nextSlot.id);
      setError(null);
    } catch {
      setError("Database connection unavailable.");
    }
  };

  const handleReserve = async (slotId: string, userId: string) => {
    const target = slots.find((slot) => slot.id === slotId);
    if (!target) {
      return;
    }

    if (target.reserved >= target.capacity) {
      window.alert("This slot is already full.");
      return;
    }

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slotId, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to reserve slot");
      }

      const reservation = (await response.json()) as Reservation;
      setReservations((current) => [reservation, ...current]);
      setSlots((current) =>
        current.map((slot) =>
          slot.id === slotId ? { ...slot, reserved: slot.reserved + 1 } : slot,
        ),
      );
      setError(null);
    } catch {
      setError("Database connection unavailable.");
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    const reservation = reservations.find(
      (entry) => entry.id === reservationId,
    );
    if (!reservation) {
      return;
    }

    try {
      const response = await fetch(
        `/api/reservations?id=${encodeURIComponent(reservationId)}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Reservation not found");
        }

        throw new Error("Failed to cancel reservation");
      }

      setReservations((current) =>
        current.filter((entry) => entry.id !== reservationId),
      );

      setSlots((current) =>
        current.map((slot) =>
          slot.id === reservation.slotId && slot.reserved > 0
            ? { ...slot, reserved: slot.reserved - 1 }
            : slot,
        ),
      );
      setError(null);
    } catch (error) {
      if (error instanceof Error && error.message === "Reservation not found") {
        setError("Reservation not found.");
        return;
      }

      setError("Database connection unavailable.");
    }
  };

  if (error) {
    return (
      <MainLayout>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
            Database status
          </p>
          <h1 className="mt-3 text-2xl font-bold text-red-900">
            Database connection unavailable
          </h1>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                Overview
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Available slots
              </h1>
              <p className="mt-3 max-w-xl text-base text-slate-600">
                Manage slot capacity, reserve a place, and keep track of active
                user bookings.
              </p>
            </div>
            <SlotList
              slots={slots}
              selectedSlotId={selectedSlotId}
              onSelectSlot={setSelectedSlotId}
            />
          </div>

          <div className="space-y-6">
            <SlotForm onCreateSlot={handleCreateSlot} />
            <ReservationForm
              slotId={selectedSlot?.id ?? ""}
              onReserve={handleReserve}
            />
          </div>
        </section>

        <ReservationList
          reservations={reservations}
          onCancelReservation={handleCancelReservation}
        />
      </div>
    </MainLayout>
  );
}
