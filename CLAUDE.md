# Architecture Notes

## Project: Klikkmentes (No-Clique Party)

### Overview
Application for managing social mixing events where 40 participants rotate through 10 tables (4 per table) over 5 rounds of 10 minutes each. Backend scheduler runs every minute to manage round progression and notifications.

### Tech Stack
- TypeScript (strict mode)
- Nuxt 3 (frontend + API)
- Jest (unit tests)
- Playwright (E2E tests)
- JSON files (persistence)

### Architecture Layers

#### 1. Domain Layer (`lib/logic/src/domain/`)
Pure TypeScript interfaces - no implementation:
- **User**: `{ id: number, name: string }`
- **Event**: `{ id: number, name: string, startedAt: number, participantIds: number[], tableIds: number[] }`
- **EventRoundSet**: `{ id: number, eventId: number, roundId: number, tableId: number, userIds: number[] }`
- **Notification**: `{ id: string (GUID), userId: number, text: string, createdAt: number }`

#### 2. Service Layer (`lib/logic/src/services/`)
Framework-agnostic business logic:
- **EventService**: Event lifecycle management
- **SeatingService**: Core seating algorithm (minimize repeat pairings)
- **NotificationService**: Notification generation
- **SchedulerService**: Time-based round advancement

#### 3. Persistence Layer (`lib/logic/src/persistence/`)
JSON file repositories (users.json, events.json, event-round-sets.json, notifications.json)

#### 4. API Layer (`projects/web/server/api/`)
Nuxt server endpoints for frontend consumption

#### 5. Frontend Layer (`projects/web/`)
Simple participant interface (no real-time, manual refresh)

### Key Algorithms

#### Seating Assignment
**Constraints**: 40 users, 10 tables, 4 per table, minimize repeat pairings
**Approach**: Greedy assignment with backtracking, tracking previous pairings in adjacency matrix
**Performance Target**: <1 second computation time

#### Round Progression
Scheduler checks every minute:
1. Calculate current round from event start time
2. Generate seating for new rounds
3. Queue notifications (table assignments, round end, event completion)

### Project Phases
1. **Phase 1**: Core logic + unit tests (no file persistence yet)
2. **Phase 2**: Backend API specification
3. **Phase 3**: Backend API implementation + JSON persistence + scheduler
4. **Phase 4**: Frontend API client
5. **Phase 5**: UI implementation + E2E tests

### Development Practices
- English everywhere (code, comments, docs)
- Minimal comments (self-documenting code)
- Track tasks in todo.md
- Update CLAUDE.md with architecture decisions
- Strict TypeScript, no unnecessary dependencies 