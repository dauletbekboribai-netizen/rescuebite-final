# RescueBite Backend

RescueBite is a FastAPI backend for reducing food waste through discounted food batches, allergy-safe checkout, donation claims, and driver route assignments.

## Stack

- FastAPI
- SQLModel
- PostgreSQL 15
- Redis
- Alembic
- Pytest
- Docker Compose

## Run locally

```bash
cp .env.example .env
docker compose up --build
```

Open API docs:

```text
http://localhost:8000/docs
```

## Main implemented flows

- Registration with password validation and unique email/username.
- Login with bcrypt password verification.
- JWT access tokens and refresh tokens.
- Logout by refresh token revocation.
- Role-based access control for restaurant, shelter, driver, and admin endpoints.
- Redis-backed rate limiting for login and registration.
- Food batch lifecycle: fresh, discounted, free, compost.
- Allergy profile storage and ingredient validation.
- Redis-assisted stock reservation before checkout.
- Cursor pagination for list endpoints.

## Useful demo order

1. Register a consumer.
2. Login and copy the access token.
3. Use Authorize in Swagger UI with `Bearer <access_token>`.
4. Set allergies with `PUT /users/me/allergies`.
5. Register an admin as the first admin account if verification operations are needed.
6. Register restaurant, shelter, and driver accounts for RBAC testing.
7. Create batches with a verified restaurant or an admin token.
8. Create a reservation with `POST /orders/reservations`.
9. Convert the reservation into an order with `POST /orders`.

## Tests

```bash
pytest
```

## Lint

```bash
ruff check app tests
```

roles:

consumer
restaurant_manager
shelter_coordinator
driver
admin

---

allergens:

peanuts
tree_nuts
dairy
eggs
gluten
soy
fish
shellfish
sesame

---

Batch state:

fresh
discounted
free
compost

---

claim status:

pending
approved
received
cancelled
deleted

---

Order status:

paid
prepared
ready_for_pickup
in_transit
completed
cancelled
deleted

---

Route status:

proposed
accepted
in_progress
completed
cancelled
deleted

docker compose exec api pytest -v