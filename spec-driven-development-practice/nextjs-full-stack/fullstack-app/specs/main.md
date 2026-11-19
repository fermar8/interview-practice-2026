## Main Specification

### Description

This app provides a small PostgreSQL-backed reservation system for limited-capacity slots. Users can view slots, create slots, reserve a slot, list reservations, and cancel a reservation. The business rule is strict: a slot has a finite capacity, and two concurrent requests must never reserve the last available place twice. Retrying the same request must not create duplicate reservations.

### Project setup

#### Required dependencies

The project requires the following dependencies:

- Node.js (version 18 or higher)
- pnpm
- TypeScript
- PostgreSQL server
- `pg` for raw SQL access
- Jest and Testing Library for automated validation
- Next.js and React for the web app

Additional setup requirements:

- Install dependencies with `pnpm install`.
- Configure `DATABASE_URL` in the local environment.
- Use local PostgreSQL on `localhost:5432` for normal app runtime (`dev`, `build`, `start`).
- Use the Dockerized PostgreSQL setup for integration tests only (`test:integration`), where the container is exposed at `localhost:55433`.
- Ensure TypeScript is configured for type checking.
- Keep the app structure compatible with the current Next.js App Router layout.
- Keep the dashboard UI under the `app/web` area and the API handlers under `app/api`.
- Run the database initializer before app startup in local development.

### Business scope and order of implementation

- Create and list slots.
- Reserve a slot.
- Cancel a reservation.
- List reservations.
- Enforce the final-seat concurrency rule.
- Keep duplicate reservations idempotent.

### Technical scope

- Implement the work in small, test-backed increments.
- Keep the actual runtime contract aligned with the working app rather than with the older draft API structure.
- API details and route contracts can be found in `specs/api.md`.
- Frontend details and the dashboard-first UI contract can be found in `specs/web.md`.
- Model and serialization rules can be found in `specs/models.md`.

### Testing strategy

- Use Jest unit tests (`tests/unit`) to validate API/web contracts and dashboard behavior.
- Use Docker-backed integration tests (`tests/integration`) for real repository/database validation.
- Build tests to cover duplicate reservations, full-slot rejections, and cancellation behavior.
- Keep test files aligned with the project layout used in the active implementation rather than the older `/services` naming convention.
- Validate the final-seat concurrency rule with transactional database checks and test coverage.
- Re-run the project validation suite frequently during development to catch regressions early.

### Implementation decisions

- This project intentionally uses PostgreSQL raw SQL through `pg` instead of Prisma or `PgType`.
- The canonical ID patterns are `slot-<n>` and `reservation-<n>`.
- The canonical route paths are `/api/slots` and `/api/reservations`.
- `createdAt` is serialized as an ISO string in API output, even though the database stores it as a Postgres timestamp.
- The web UI is a dashboard-first implementation rather than a detail-page-per-resource architecture.
