## API Specification

This project uses the Next.js App Router and keeps the route handlers in `app/api`. The API does not use a service-layer route registry or a generic `ApiResponse<T>` envelope. Success responses return the domain object directly; errors return an object shaped like `{ error: "..." }`.

### Endpoints

#### Slots

- `GET /api/slots` - List all slots.
- `POST /api/slots` - Create a new slot.

#### Reservations

- `GET /api/reservations` - List all reservations.
- `POST /api/reservations` - Create a reservation.
- `DELETE /api/reservations?id=<reservationId>` - Cancel a reservation by query param.

### Request and response shapes

#### Slots

- `GET /api/slots`
  - Request: None
  - Response: `200 OK`
    ```json
    [
      {
        "id": "slot-1",
        "capacity": 10,
        "reserved": 3
      }
    ]
    ```

- `POST /api/slots`
  - Request:
    ```json
    {
      "capacity": 10
    }
    ```
  - Response: `201 Created`
    ```json
    {
      "id": "slot-1",
      "capacity": 10,
      "reserved": 0
    }
    ```

#### Reservations

- `GET /api/reservations`
  - Request: None
  - Response: `200 OK`
    ```json
    [
      {
        "id": "reservation-1",
        "slotId": "slot-1",
        "userId": "user-1",
        "createdAt": "2024-06-01T12:00:00.000Z"
      }
    ]
    ```

- `POST /api/reservations`
  - Request:
    ```json
    {
      "slotId": "slot-1",
      "userId": "user-1"
    }
    ```
  - Response: `201 Created`
    ```json
    {
      "id": "reservation-1",
      "slotId": "slot-1",
      "userId": "user-1",
      "createdAt": "2024-06-01T12:00:00.000Z"
    }
    ```

- `DELETE /api/reservations?id=reservation-1`
  - Request: query param `id`
  - Response: `200 OK`
    ```json
    {
      "ok": true
    }
    ```

### Error responses

- `400 Bad Request` - invalid input or a business rule rejection.

  ```json
  {
    "error": "Slot capacity must be a positive integer"
  }
  ```

- `503 Service Unavailable` - database connection or initialization failed.
  ```json
  {
    "error": "Database connection unavailable."
  }
  ```

### Canonical rules

- Slot IDs follow the pattern `slot-<n>`.
- Reservation IDs follow the pattern `reservation-<n>`.
- `createdAt` is serialized as an ISO timestamp string in the API responses.
- Duplicate requests for the same slot/user pair should not create duplicate reservations.
- A request that tries to reserve the final seat after capacity is reached should fail with a validation/business error.

### Test cases

- `GET /api/slots` - should return the full slot list with `200 OK`.
- `POST /api/slots` - should create a slot with positive capacity and return `201 Created`.
- `GET /api/reservations` - should list all reservations with `200 OK`.
- `POST /api/reservations` - should create a reservation with `201 Created` and canonical IDs.
- `DELETE /api/reservations?id=<reservationId>` - should cancel the reservation and return `{ "ok": true }`.
- `POST /api/reservations` for a full slot - should reject with `400 Bad Request` or a service error if the DB is unavailable.

### Integration test cases

- `POST /api/slots` followed by `GET /api/slots` - should create a slot and then confirm it appears in the list.
- `POST /api/reservations` followed by `GET /api/reservations` - should create a reservation and then confirm it appears in the list.
- `POST /api/reservations` followed by `DELETE /api/reservations?id=<reservationId>` - should create a reservation and then cancel it.
- `POST /api/reservations` for a fully booked slot - should fail cleanly without creating duplicate reservations.
