## Web Specification

The current implementation uses a dashboard-first layout under `app/web` rather than a page-per-resource structure. The app is organized around a single primary dashboard screen that fetches live data from the API and updates the UI when slots or reservations change.

### Current app structure

- `app/web/page.tsx` - Entry page that renders the main dashboard.
- `app/web/components/SlotReservationDashboard.tsx` - Main dashboard container that loads data from the API.
- `app/web/components/SlotForm.tsx` - Form for creating slots.
- `app/web/components/ReservationForm.tsx` - Form for reserving a slot.
- `app/web/components/SlotList.tsx` - Displays the slot list.
- `app/web/components/ReservationList.tsx` - Displays the reservation list.
- `app/web/components/MainLayout.tsx` - Shared layout for the dashboard shell.

### Rules for the implemented UI

- The app should not rely on mock startup data.
- The dashboard should fetch from the real database-backed APIs.
- If the database is unavailable, the UI should show a database error state instead of fake data.
- The UI should support creating slots, creating reservations, and cancelling reservations.
- Slot and reservation IDs should match the canonical IDs used by the backend (`slot-<n>`, `reservation-<n>`).

### Styling and layout

- The current app uses a minimal Next.js global stylesheet and component-level layout patterns rather than the older `pages` + `design` token structure described in the earlier draft.
- The older `SlotDetail`, `ReservationDetail`, `SlotLayout`, `ReservationLayout`, and design token files are not part of the current implementation and should not be treated as required unless the architecture is intentionally expanded later.

### Test cases

- `tests/unit/web/page.test.tsx` - validates the web route entry rendering.
- `tests/unit/web/components/SlotReservationDashboard.test.tsx` - validates dashboard loading, slot creation, reservation creation, and DB error states.
- `tests/unit/web/components/SlotForm.test.tsx` - validates slot creation behaviour and user interaction.
- `tests/unit/web/components/ReservationForm.test.tsx` - validates reservation creation behaviour and validation messages.
- `tests/unit/web/components/SlotList.test.tsx` - validates rendering of the slot list and capacity data.
- `tests/unit/web/components/ReservationList.test.tsx` - validates rendering of reservations and cancellation flows.
- `tests/unit/web/components/MainLayout.test.tsx` - validates the app shell structure.
- `tests/unit/web/components/Header.test.tsx` - validates the branding and status block in the header.
- `tests/unit/web/components/Footer.test.tsx` - validates the footer summary copy.
- `tests/unit/web/components/Button.test.tsx` - validates shared button rendering and click interactions.

### Implementation verdict

The dashboard-first app is the accepted architecture for this project. The earlier page-detail web spec is superseded and should be treated as a legacy draft, not the canonical contract for the current implementation.
