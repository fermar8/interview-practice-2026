## Reservation Cancellation Feature

### Description

The reservation cancellation feature ensures that users can cancel their reservations in a consistent and safe manner. It handles repeated and concurrent cancellation requests, maintaining the integrity of the reservation state and slot capacity.

### Task

Implement or harden DELETE /reservations/:id.

### Requirements

- A reservation can only be cancelled once.
- Cancellation releases capacity exactly once.
- Missing reservations return the agreed error.
- Concurrent cancellation requests must not decrement capacity twice.
- The reservation state and slot count remain consistent.

### Spec artifact

Define state transitions and their invariants. If the current model deletes rows, decide whether you need a cancelledAt field or a status field instead.

### Acceptance criteria

Tests cover repeated and concurrent cancellation, with assertions against PostgreSQL state.

### Stretch

Define what happens when cancellation races with another reservation.

### Testing

- Test repeated cancellation requests for the same reservation.
- Test concurrent cancellation requests for the same reservation.
- Test cancellation of non-existent reservations.
- Verify that slot capacity is correctly updated after cancellation.
- Ensure that the reservation state remains consistent in PostgreSQL.

### Phases

- Phase 0: Review the current reservation and slot models and implementation state. Save a detailed analysis on this file under title 'Current state' and determine if a cancelledAt or status field is needed.
- Phase 1: Add integration tests with all Testing scenarios covered.
- Phase 2: Implement or harden DELETE /reservations/:id.
- Phase 3: Verify state consistency and slot capacity under concurrent cancellations.

## Current state

### Current behavior

- The cancellation endpoint is currently `DELETE /api/reservations?id=<reservationId>` in `app/api/reservations/route.ts`.
- The repository currently performs hard delete in `cancelReservationRow` (`DELETE ... RETURNING slot_id`) and decrements slot usage in the same transaction.
- If a reservation does not exist, cancellation currently behaves as a no-op and still returns success from the route.
- Active reservation listing does not track a cancellation lifecycle field; rows are physically removed.
- Integration tests currently do not cover cancellation edge cases (repeated cancellation, missing reservation cancellation, concurrent cancellation requests).

### Gaps vs feature requirements

- "A reservation can only be cancelled once" is not explicitly enforced with a deterministic error path.
- "Missing reservations return the agreed error" is not currently implemented.
- "Concurrent cancellation requests must not decrement capacity twice" is not explicitly tested.
- PostgreSQL state assertions for cancellation transitions are currently missing.

### Model decision

- Decision: add a `cancelled_at TIMESTAMPTZ NULL` field to reservations.
- Rationale: a soft-cancel marker allows us to guarantee one-way cancellation transitions, make repeated cancellation detectably invalid, and prevent double-decrement races with an atomic `UPDATE ... WHERE cancelled_at IS NULL` transition.
- API contract decision for this feature implementation:
  - Keep endpoint shape as query-parameter cancellation (`DELETE /api/reservations?id=<id>`).
  - Return `404` for both missing reservations and already-cancelled reservations.
