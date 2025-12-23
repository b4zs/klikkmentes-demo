# Project Todo List

## Planning Phase
- [x] Read functional specification
- [x] Draft technical specification
- [x] Update CLAUDE.md with architecture notes
- [x] Create project todo list

---

## Phase 1: Core Logic + Unit Tests (No Persistence) ✅

### Domain Layer
- [x] Create `lib/logic/src/domain/User.ts` interface
- [x] Create `lib/logic/src/domain/Event.ts` interface
- [x] Create `lib/logic/src/domain/EventRoundSet.ts` interface
- [x] Create `lib/logic/src/domain/Notification.ts` interface
- [x] Create `lib/logic/src/domain/index.ts` barrel export

### Service Layer - SeatingService
- [x] Create `lib/logic/src/services/SeatingService.ts`
- [x] Implement `generateRoundSeating()` - core seating algorithm
- [x] Implement `hasUsersPreviouslyMet()` - pairing history check
- [x] Implement `optimizeSeating()` - greedy assignment with backtracking
- [x] Write unit tests for seating algorithm (40 users, 10 tables, 5 rounds)
- [x] Validate no repeat pairings in test scenarios
- [x] Performance test: ensure <1 second execution time

### Service Layer - EventService
- [x] Create `lib/logic/src/services/EventService.ts`
- [x] Implement `createEvent()` - event creation
- [x] Implement `getEventStatus()` - event status retrieval
- [x] Implement `getCurrentRound()` - calculate current round from start time
- [x] Write unit tests for event lifecycle

### Service Layer - NotificationService
- [x] Create `lib/logic/src/services/NotificationService.ts`
- [x] Implement `generateTableAssignmentNotification()` - table assignment message
- [x] Implement `generateRoundEndNotification()` - round end message
- [x] Implement `generateEventCompletionNotification()` - "thank you" message
- [x] Implement `getUnreadNotifications()` - retrieve user notifications
- [x] Write unit tests for notification generation

### Service Layer - SchedulerService
- [x] Create `lib/logic/src/services/SchedulerService.ts`
- [x] Implement `processMinutelyTick()` - main scheduler entry point
- [x] Implement `checkAndAdvanceRounds()` - round advancement logic
- [x] Implement `sendDueNotifications()` - notification queueing
- [x] Write unit tests for scheduler timing logic

### Testing & Validation
- [x] Create test fixtures (40 users, 10 tables, 5 rounds)
- [x] Run full integration test: simulate complete event lifecycle
- [x] Verify test coverage >90% (achieved 90.27%)
- [x] Document any edge cases or limitations

---

## Phase 2: Backend API Specification

- [ ] Document API endpoints (REST)
- [ ] Define request/response schemas for each endpoint
  - [ ] `POST /api/users` - create user
  - [ ] `GET /api/users/:id` - get user
  - [ ] `POST /api/events/:eventId/join` - join event
  - [ ] `GET /api/notifications/:userId` - get notifications
  - [ ] `POST /api/events/:eventId/start` - start event (admin)
- [ ] Define error codes and responses
- [ ] Create example requests/responses
- [ ] Document in `docs/api-spec.md`

---

## Phase 3: Backend API Implementation

### Persistence Layer
- [ ] Create `lib/logic/src/persistence/` directory
- [ ] Create `lib/logic/src/persistence/UserRepository.ts`
- [ ] Create `lib/logic/src/persistence/EventRepository.ts`
- [ ] Create `lib/logic/src/persistence/EventRoundSetRepository.ts`
- [ ] Create `lib/logic/src/persistence/NotificationRepository.ts`
- [ ] Implement JSON file read/write utilities
- [ ] Create `data/` directory for JSON files
- [ ] Initialize empty JSON files (users.json, events.json, etc.)
- [ ] Write integration tests for repositories

### Nuxt API Routes
- [ ] Create `projects/web/server/api/users/index.post.ts`
- [ ] Create `projects/web/server/api/users/[id].get.ts`
- [ ] Create `projects/web/server/api/events/[eventId]/join.post.ts`
- [ ] Create `projects/web/server/api/notifications/[userId].get.ts`
- [ ] Create `projects/web/server/api/events/[eventId]/start.post.ts`
- [ ] Add input validation to all endpoints
- [ ] Add error handling to all endpoints
- [ ] Write API integration tests

### Scheduler Implementation
- [ ] Create Nuxt server plugin for scheduler
- [ ] Implement minutely tick using `setInterval` or cron
- [ ] Wire scheduler to EventService and NotificationService
- [ ] Test scheduler with mock events
- [ ] Add logging for scheduler actions

### Testing
- [ ] End-to-end test: create event, join users, start event, verify notifications
- [ ] Performance test: 40 users, ensure scheduler completes in <5 seconds

---

## Phase 4: Frontend API Client

- [ ] Create `projects/web/composables/useApi.ts` - base API client
- [ ] Create `projects/web/composables/useUsers.ts` - user API methods
- [ ] Create `projects/web/composables/useEvents.ts` - event API methods
- [ ] Create `projects/web/composables/useNotifications.ts` - notification API methods
- [ ] Add TypeScript types for API responses
- [ ] Add error handling and loading states
- [ ] Write unit tests for composables

---

## Phase 5: UI Implementation

### Pages
- [ ] Create `projects/web/pages/index.vue` - user registration form
- [ ] Create `projects/web/pages/notifications/[userId].vue` - notifications page

### Components
- [ ] Create `projects/web/components/UserRegistrationForm.vue`
- [ ] Create `projects/web/components/NotificationList.vue`
- [ ] Add basic styling (CSS/TailwindCSS)

### E2E Tests (Playwright)
- [ ] Test user registration flow
- [ ] Test notification display after joining event
- [ ] Test complete user journey (register -> join -> receive notifications)

### Final Testing
- [ ] Manual testing with 40 test users
- [ ] Verify all 5 rounds complete successfully
- [ ] Verify no duplicate pairings across rounds
- [ ] Verify "thank you" message after final round

---

## Future Enhancements (Backlog)
- [ ] Admin interface for event creation/management
- [ ] Real-time notifications (WebSockets/SSE)
- [ ] Support for multiple concurrent events
- [ ] User authentication and persistent accounts
- [ ] Analytics dashboard (connections made, etc.)
- [ ] Mobile app
- [ ] Database migration (PostgreSQL/MongoDB)
