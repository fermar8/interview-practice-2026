describe("slot reservation service contract", () => {
  const loadService = async () => {
    jest.resetModules();
    return await import("../../../app/services/slotReservationService");
  };

  it("should create and list slots without duplicates", async () => {
    const { createSlot, listSlots } = await loadService();
    const first = createSlot(10);
    const second = createSlot(10);

    expect(first.capacity).toBe(10);
    expect(first.reserved).toBe(0);
    expect(second).toEqual(first);
    expect(listSlots()).toContainEqual(first);
  });

  it("should create and retrieve a reservation using canonical ids and ISO timestamps", async () => {
    const { createSlot, createReservation, getReservation } =
      await loadService();
    const slot = createSlot(2);
    const reservation = createReservation(slot.id, "user-1");

    expect(slot.id).toBe("slot-1");
    expect(reservation.id).toBe("reservation-1");
    expect(reservation.slotId).toBe(slot.id);
    expect(reservation.userId).toBe("user-1");
    expect(reservation.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T.*Z$/);
    expect(getReservation(reservation.id)).toEqual(reservation);
    expect(slot.reserved).toBeGreaterThanOrEqual(1);
  });

  it("should reject a reservation when the slot is full", async () => {
    const { createSlot, createReservation } = await loadService();
    const slot = createSlot(1);
    createReservation(slot.id, "user-1");

    expect(() => createReservation(slot.id, "user-2")).toThrow("Slot is full");
  });

  it("should cancel a reservation and update the remaining capacity", async () => {
    const {
      cancelReservation,
      createReservation,
      createSlot,
      getReservation,
      listSlots,
    } = await loadService();
    const slot = createSlot(2);
    const reservation = createReservation(slot.id, "user-1");

    cancelReservation(reservation.id);

    expect(getReservation(reservation.id)).toBeUndefined();
    const slots = listSlots();
    const updatedSlot = slots.find(
      (entry: { id: string }) => entry.id === slot.id,
    );
    expect(updatedSlot?.reserved).toBe(0);
  });
});
