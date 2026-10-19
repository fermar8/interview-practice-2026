import type { Reservation, Slot } from "../model/types";

export type { Reservation, Slot };

const slots = new Map<string, Slot>();
const reservations = new Map<string, Reservation>();
const slotIdsByCapacity = new Map<number, string>();
const reservationIdsByKey = new Map<string, string>();
let nextSlotNumber = 1;
let nextReservationNumber = 1;

const validateSlotCapacity = (capacity: number): void => {
  if (!Number.isInteger(capacity) || capacity <= 0) {
    throw new Error("Slot capacity must be a positive integer");
  }
};

const validateSlotId = (slotId: string): string => {
  const normalized = slotId.trim();
  if (!normalized) {
    throw new Error("Slot ID is required");
  }
  return normalized;
};

const validateUserId = (userId: string): string => {
  const normalized = userId.trim();
  if (!normalized) {
    throw new Error("User ID is required");
  }
  return normalized;
};

const nextSlotId = (): string => {
  const id = `slot-${nextSlotNumber}`;
  nextSlotNumber += 1;
  return id;
};

const nextReservationId = (): string => {
  const id = `reservation-${nextReservationNumber}`;
  nextReservationNumber += 1;
  return id;
};

export function createSlot(capacity: number): Slot {
  validateSlotCapacity(capacity);

  const existingSlotId = slotIdsByCapacity.get(capacity);

  if (existingSlotId) {
    const existingSlot = slots.get(existingSlotId);
    if (existingSlot) {
      return existingSlot;
    }
  }

  const slot: Slot = {
    id: nextSlotId(),
    capacity,
    reserved: 0,
  };

  slots.set(slot.id, slot);
  slotIdsByCapacity.set(capacity, slot.id);

  return slot;
}

export function listSlots(): Slot[] {
  return Array.from(slots.values());
}

export function createReservation(slotId: string, userId: string): Reservation {
  const normalizedSlotId = validateSlotId(slotId);
  const normalizedUserId = validateUserId(userId);

  const dedupeKey = `${normalizedSlotId}:${normalizedUserId}`;
  const existingReservationId = reservationIdsByKey.get(dedupeKey);

  if (existingReservationId) {
    const existingReservation = reservations.get(existingReservationId);
    if (existingReservation) {
      return existingReservation;
    }
  }

  const slot = slots.get(normalizedSlotId);

  if (!slot) {
    throw new Error("Slot not found");
  }

  if (slot.reserved >= slot.capacity) {
    throw new Error("Slot is full");
  }

  const reservation: Reservation = {
    id: nextReservationId(),
    slotId: normalizedSlotId,
    userId: normalizedUserId,
    createdAt: new Date().toISOString(),
  };

  reservations.set(reservation.id, reservation);
  slot.reserved += 1;
  reservationIdsByKey.set(dedupeKey, reservation.id);

  return reservation;
}

export function getReservation(id: string): Reservation | undefined {
  return reservations.get(id);
}

export function cancelReservation(id: string): void {
  const reservation = reservations.get(id);

  if (!reservation) {
    return;
  }

  reservations.delete(id);

  const slot = slots.get(reservation.slotId);
  if (slot && slot.reserved > 0) {
    slot.reserved -= 1;
  }
}
