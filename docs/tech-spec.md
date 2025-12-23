# Technical Specification: Klikkmentes (No-Clique Party)

## Overview
Klikkmentes is a web application for managing social mixing events where participants are periodically reassigned to different tables to maximize interpersonal connections. Every 10 minutes, participants receive table assignments ensuring they meet many people throughout the event.

## Technology Stack

### Core Technologies
- **Language**: TypeScript
- **Frontend**: Nuxt 3
- **Testing**: Jest (unit tests), Playwright (UI tests)
- **Persistence**: JSON files (for direct Node.js loading)

### Project Structure
```
klikkmentes/
├── lib/logic/              # Core business logic library
│   ├── src/
│   │   ├── domain/         # Domain interfaces and types
│   │   ├── services/       # Business logic services
│   │   └── utils/          # Utility functions
│   └── tests/              # Jest unit tests
├── projects/web/           # Nuxt frontend application
│   ├── server/api/         # Backend API endpoints
│   ├── pages/              # Frontend pages
│   ├── components/         # Vue components
│   └── tests/              # Playwright UI tests
└── docs/                   # Documentation
```

## Domain Model

### User
```typescript
interface User {
  id: number;
  name: string;
}
```

### Event
```typescript
interface Event {
  id: number;
  name: string;
  startedAt: number;        // Unix timestamp
  participantIds: number[]; // Array of User IDs
  tableIds: number[];       // Array of table IDs (not persisted separately)
}
```

### EventRoundSet
Represents a seating arrangement for one round at one table.
```typescript
interface EventRoundSet {
  id: number;
  eventId: number;
  roundId: number;          // Sequential round number (0-indexed or 1-indexed)
  tableId: number;
  userIds: number[];        // Array of User IDs at this table
}
```

### Notification
```typescript
interface Notification {
  id: string;               // GUID
  userId: number;
  text: string;             // Notification message
  createdAt: number;        // Unix timestamp
}
```

## Business Requirements

### Test Data Specifications
- **Participants**: 40 users
- **Tables**: 10 tables
- **Capacity**: 4 people per table
- **Rounds**: 5 rounds per event
- **Round Duration**: 10 minutes

### Core Functionality

#### User Flow
1. User enters their name in a form
2. User clicks "Start" button
3. User receives notifications about table assignments
4. After each round, user receives notification for next table
5. After final round, user receives "Thank you for attending" message

#### Backend Scheduler
A scheduled job runs every minute to:
1. **Track Round Progress**: Determine current round based on event start time
2. **Track Interactions**: Maintain history of who sat with whom
3. **Send Notifications**: Generate and queue notifications for:
   - Initial table assignments
   - Round transitions
   - Event completion

## Architecture Design

### Layer Separation

#### 1. Domain Layer (`lib/logic/src/domain`)
- Pure TypeScript interfaces and types
- No implementation logic
- No external dependencies
- Exports: User, Event, EventRoundSet, Notification interfaces

#### 2. Service Layer (`lib/logic/src/services`)
Core business logic services (framework-agnostic):

**EventService**
- `createEvent(name: string, participantIds: number[], tableCount: number): Event`
- `getEventStatus(eventId: number): EventStatus`
- `getCurrentRound(eventId: number): number`

**SeatingService**
- `generateRoundSeating(eventId: number, roundId: number, participants: User[], tableCount: number, previousSeatings: EventRoundSet[]): EventRoundSet[]`
- `hasUsersPreviouslyMet(user1Id: number, user2Id: number, history: EventRoundSet[]): boolean`
- `optimizeSeating(participants: User[], tableCount: number, seatsPerTable: number, avoidPairs: [number, number][]): EventRoundSet[]`

**NotificationService**
- `generateTableAssignmentNotification(userId: number, tableId: number, roundId: number): Notification`
- `generateRoundEndNotification(userId: number): Notification`
- `generateEventCompletionNotification(userId: number): Notification`
- `getUnreadNotifications(userId: number): Notification[]`

**SchedulerService**
- `processMinutelyTick(currentTime: number): void`
- `checkAndAdvanceRounds(events: Event[], currentTime: number): void`
- `sendDueNotifications(currentTime: number): void`

#### 3. Persistence Layer (`lib/logic/src/persistence`)
JSON file operations:
- `UserRepository`: CRUD operations for users
- `EventRepository`: CRUD operations for events
- `EventRoundSetRepository`: CRUD operations for round seating
- `NotificationRepository`: CRUD operations for notifications

Data storage:
```
data/
├── users.json
├── events.json
├── event-round-sets.json
└── notifications.json
```

#### 4. API Layer (`projects/web/server/api`)
Nuxt API endpoints:
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user
- `POST /api/events/:eventId/join` - User joins event
- `GET /api/notifications/:userId` - Get user notifications
- `POST /api/events/:eventId/start` - Admin starts event

#### 5. Frontend Layer (`projects/web`)
- **Pages**: Simple participant interface
- **Components**: Form, notification list
- **No real-time**: Users refresh to see new notifications

## Algorithm: Seating Assignment

### Constraints
1. Each table seats exactly 4 people
2. Minimize repeat pairings across rounds
3. All participants must be seated each round

### Approach
1. **Initialize**: Track all previous pairings from earlier rounds
2. **Greedy Assignment**: For each table, select 4 participants who have minimal prior interactions
3. **Backtracking**: If stuck, backtrack and try different combinations
4. **Fallback**: If optimal solution impossible, allow some repeat pairings

### Complexity
- With 40 participants, 10 tables, 4 per table: feasible to compute in <1 second
- Track pairings in adjacency matrix for O(1) lookup

## Project Phases

### Phase 1: Core Logic with Unit Tests
**Goal**: Implement business logic in `lib/logic` without persistence

**Tasks**:
1. Define domain interfaces (`domain/`)
2. Implement `SeatingService` with seating algorithm
3. Implement `EventService` for event management
4. Implement `NotificationService` for notification generation
5. Implement `SchedulerService` for time-based processing
6. Write comprehensive Jest unit tests
7. Mock data repositories in tests

**Deliverables**:
- Fully tested business logic
- 100% test coverage for core algorithms
- Seating algorithm validated with test data (40 users, 10 tables, 5 rounds)

### Phase 2: Backend API Specification
**Goal**: Design RESTful API contract

**Tasks**:
1. Document API endpoints (OpenAPI/Swagger optional)
2. Define request/response schemas
3. Define error codes and responses
4. Plan API versioning strategy

**Deliverables**:
- API specification document
- Request/response examples

### Phase 3: Backend API Implementation
**Goal**: Implement Nuxt server API with JSON persistence

**Tasks**:
1. Implement JSON file repositories in `lib/logic/src/persistence`
2. Create Nuxt API routes in `projects/web/server/api`
3. Wire up services to API endpoints
4. Implement scheduled job for minutely tick (using Nuxt server plugins or cron)
5. Add error handling and validation
6. Write integration tests

**Deliverables**:
- Working backend API
- JSON file persistence
- Scheduler running minutely checks

### Phase 4: Frontend API Client
**Goal**: Create type-safe client for consuming backend API

**Tasks**:
1. Generate TypeScript types from API responses
2. Implement API client composables/utilities
3. Add error handling and loading states
4. Write unit tests for API client

**Deliverables**:
- Typed API client
- Composables for data fetching

### Phase 5: UI Implementation
**Goal**: Build participant-facing interface

**Tasks**:
1. Create user registration form page
2. Implement "Start" button functionality
3. Create notifications display page
4. Add manual refresh capability
5. Style with basic CSS
6. Write Playwright E2E tests

**Deliverables**:
- Functional UI for participant flow
- E2E tests covering user journey

## Non-Functional Requirements

### Code Quality
- **Language**: English for all code, comments, and documentation
- **Comments**: Minimal; code should be self-documenting
- **Formatting**: Consistent TypeScript style (Prettier configuration)
- **Type Safety**: Strict TypeScript mode enabled

### Testing Strategy
- **Unit Tests**: Jest for `lib/logic` services (aim for >90% coverage)
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Playwright for critical user flows
- **Test Data**: Consistent test fixtures (40 users, 10 tables, 5 rounds)

### Performance
- Seating algorithm: <1 second for 40 participants
- API response time: <200ms for typical requests
- Scheduler tick: <5 seconds to process all events

### Scalability Considerations
- Current scope: Single event, up to 100 participants
- JSON files sufficient for demo/MVP
- Future: migrate to database (PostgreSQL/MongoDB) if needed

## Security Considerations
- Input validation on all API endpoints
- Sanitize user-provided names to prevent XSS
- Rate limiting on user registration
- No authentication required for MVP (future enhancement)

## Deployment (Future)
- Docker containerization
- Environment-based configuration
- Health check endpoints
- Logging and monitoring

## Open Questions / Future Enhancements
1. Admin interface for event management?
2. Real-time notifications (WebSockets/SSE)?
3. Multiple concurrent events?
4. User authentication and persistent accounts?
5. Analytics and reporting on connections made?
6. Mobile app instead of web?
