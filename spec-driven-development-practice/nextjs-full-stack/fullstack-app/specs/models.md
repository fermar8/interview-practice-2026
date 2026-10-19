## Models

### Business interfaces

```ts
interface Slot {
  id: string;
  capacity: number;
  reserved: number;
}

interface Reservation {
  id: string;
  slotId: string;
  userId: string;
  createdAt: string;
}
```

### Database models

```ts
interface SlotModel {
  id: string;
  capacity: number;
  reserved: number;
}

interface ReservationModel {
  id: string;
  slotId: string;
  userId: string;
  createdAt: string;
}
```

### Canonical ID format

- Slot IDs follow `slot-<n>`, for example `slot-1`, `slot-2`, `slot-3`.
- Reservation IDs follow `reservation-<n>`, for example `reservation-1`, `reservation-2`.
- The ID format should be treated as a validation rule and used consistently across the API, database layer, and tests.

### Serialization rules

- The database stores timestamps as Postgres `TIMESTAMPTZ` values.
- The API returns `createdAt` as an ISO string, for example `2024-06-01T12:00:00.000Z`.
- The public contract therefore uses a string value for `createdAt`, not a raw `Date` instance.

#### Constraints

- `Slot.capacity` must be a positive integer.
- `Slot.reserved` must be a non-negative integer and cannot exceed `Slot.capacity`.
- `Reservation.slotId` must reference an existing `Slot`.
- `Reservation.userId` must be a non-empty string.
- `Reservation.createdAt` must be a valid ISO timestamp string.
