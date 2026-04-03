# Habit Tracker — Backend

A Node.js/Express REST API backed by PostgreSQL (Neon). Follows a layered architecture: Routes → Controllers → Services → Repositories.

## Tech Stack

- Node.js
- Express
- PostgreSQL (Neon serverless)
- Zod (schema validation)

## Project Structure
```
├── app.js                          # Express app setup, route registration
├── db/
│   └── db.js                       # PostgreSQL pool connection
│
├── Routes/
│   ├── user-routes.js
│   ├── habit-routes.js
│   ├── completion-tracker-routes.js
│   └── settings-routes.js
│
├── Controllers/
│   ├── user-controller.js
│   ├── habit-controller.js
│   ├── completion-tracker-controller.js
│   └── settings-controller.js
│
├── Services/
│   ├── user-service.js             # Zod schemas + business logic
│   ├── habit-service.js
│   ├── completion-tracker-service.js
│   └── settings-service.js
│
└── Repositories/
    ├── user-repo.js                # Raw SQL queries
    ├── habit-repo.js
    ├── completion-tracker-repo.js
    └── settings-repo.js
```

## API Routes

### Users `/users`
| Method | Path | Description |
|---|---|---|
| `POST` | `/signup` | Create new user |
| `POST` | `/login` | Login |
| `GET` | `/` | Get all users |
| `GET` | `/:id` | Get user by ID |
| `GET` | `/:id/habits` | Get habits for user |
| `PUT` | `/:id` | Update user |
| `DELETE` | `/:id` | Delete user |

### Habits `/habits`
| Method | Path | Description |
|---|---|---|
| `POST` | `/` | Create habit |
| `GET` | `/` | Get all habits |
| `PUT` | `/:id` | Update habit |
| `DELETE` | `/:id` | Delete habit |

### Completions `/completions`
| Method | Path | Description |
|---|---|---|
| `POST` | `/` | Create completion |
| `GET` | `/all` | Get all completions |
| `GET` | `/:id` | Get completion by ID |
| `GET` | `/` | Get by user and date |
| `GET` | `/habit` | Get by habit ID |
| `GET` | `/range` | Get by user and date range |
| `PUT` | `/:id` | Update completion |
| `DELETE` | `/:id` | Delete completion |
| `DELETE` | `/:userId/:habitId` | Delete by habit and date |

### Settings `/settings`
| Method | Path | Description |
|---|---|---|
| `GET` | `/:id` | Get settings for user |
| `POST` | `/:id` | Create default settings for user |
| `PUT` | `/:id` | Update settings for user |

## Database Tables

- `users` — user accounts
- `habits` — habit definitions with recurrence rules
- `completions` — daily habit completion records
- `settings` — per-user app settings (unique constraint on `user_id`)

## Getting Started
```bash
npm install
node app.js
```

Set the following in a `.env` file:
```
DATABASE_URL=your_neon_connection_string
PORT=3000
```