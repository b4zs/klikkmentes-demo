# Project Estimation: Klikkmentes (No-Clique Party)

## Executive Summary

| Metric | Traditional | AI-Assisted |
|--------|-------------|-------------|
| Total Development Time | 40-50 hours | 19-33 hours |
| Recommended Duration (full-time) | 1 week | 3-4 days |
| Recommended Duration (part-time) | 2-3 weeks | 1 week |
| Team Size | 1 senior developer | 1 senior developer |
| Lines of Code (estimated) | ~3,000-4,000 LOC | ~3,000-4,000 LOC |
| Test Coverage Target | >90% for core logic | >90% for core logic |
| **Speedup** | — | **~50% faster** |

---

## AI-Assisted Development

### What Changes with AI?

Using an AI coding assistant (like Claude, GitHub Copilot, Cursor) significantly changes the development dynamics:

**Speed Improvements:**
- **Boilerplate generation**: 80-90% faster
- **Test generation**: 70-80% faster
- **Refactoring**: 60-70% faster
- **Debugging**: 50-60% faster
- **Documentation**: 80% faster

**Quality Improvements:**
- More consistent code patterns
- Better test coverage (AI suggests edge cases)
- Faster iteration on algorithm optimization
- Reduced syntax/type errors

**New Overhead:**
- Prompt engineering time
- Reviewing AI-generated code
- Correcting AI misunderstandings
- Iterating on AI outputs

### AI-Assisted Phase Breakdown

| Phase | Traditional | AI-Assisted | Speedup |
|-------|-------------|-------------|---------|
| Phase 1: Core Logic + Tests | 16-23h | **6-10h** | 60% |
| Phase 2: API Specification | 3.5-4.5h | **1-2h** | 70% |
| Phase 3: Backend API | 15-20h | **6-10h** | 55% |
| Phase 4: Frontend Client | 5-8h | **2-4h** | 55% |
| Phase 5: UI + E2E | 10.5-12.5h | **4-7h** | 50% |

### AI-Assisted Total: 19-33 hours

**Best Practices for AI-Assisted Development:**

1. **Start with Architecture**: Have AI help design the architecture before coding
2. **Iterative Prompting**: Break complex tasks into smaller prompts
3. **Review Thoroughly**: AI makes mistakes, especially with:
   - Complex business logic edge cases
   - Time-based logic (scheduler)
   - Test setup and mocking
4. **Use AI for Tests**: Have AI generate tests immediately after code
5. **Leverage for Refactoring**: Ask AI to review and suggest improvements

### Tasks Where AI Shines

| Task Type | AI Speedup | Examples |
|-----------|------------|----------|
| Domain interfaces | 90% | User, Event, EventRoundSet types |
| Repository boilerplate | 85% | CRUD operations for JSON files |
| Unit test scaffolding | 80% | Jest test structure and mocks |
| API route stubs | 75% | Nuxt API endpoints |
| Component templates | 70% | Vue component structure |
| Documentation | 80% | JSDoc, README files |

### Tasks Where Human Expertise Still Critical

| Task Type | Why AI Struggles | Time Saved |
|-----------|------------------|------------|
| Seating algorithm optimization | Complex constraints, backtracking logic | 30-40% |
| Scheduler edge cases | Time-based state, race conditions | 20-30% |
| Integration test scenarios | System-level understanding | 30-40% |
| E2E test selection | User journey context | 20-30% |
| Architecture decisions | Trade-off judgment | 0% (human-only) |

---

## Phase-by-Phase Breakdown (Traditional)

### Phase 1: Core Logic with Unit Tests

| Task | Estimate | Complexity |
|------|----------|------------|
| Define domain interfaces | 1h | Low |
| Implement SeatingService algorithm | 4-6h | High |
| Implement EventService | 2h | Medium |
| Implement NotificationService | 1-2h | Low |
| Implement SchedulerService | 2-3h | Medium |
| Write Jest unit tests for services | 4-6h | Medium |
| Create mock repositories for testing | 1h | Low |
| Test seating algorithm with 40 users data | 1-2h | Medium |

**Phase 1 Total: 16-23 hours**

**Complexity Notes:**
- Seating algorithm is the most critical component requiring backtracking logic
- SchedulerService needs careful time-based logic testing
- High test coverage requirement increases effort

---

### Phase 2: Backend API Specification

| Task | Estimate | Complexity |
|------|----------|------------|
| Document API endpoints | 1-2h | Low |
| Define request/response schemas | 1h | Low |
| Define error codes and responses | 1h | Low |
| Document API versioning approach | 0.5h | Low |

**Phase 2 Total: 3.5-4.5 hours**

---

### Phase 3: Backend API Implementation

| Task | Estimate | Complexity |
|------|----------|------------|
| Implement JSON repositories | 2-3h | Medium |
| Create Nuxt API routes | 3-4h | Medium |
| Wire services to API endpoints | 2h | Low |
| Implement minutely scheduler (cron/job) | 2-3h | Medium |
| Add error handling and validation | 2-3h | Medium |
| Write integration tests | 3-4h | Medium |
| Set up JSON data files and seeding | 1h | Low |

**Phase 3 Total: 15-20 hours**

**Complexity Notes:**
- Scheduler integration with Nuxt requires careful setup
- File locking considerations for concurrent JSON access
- Integration tests add significant but necessary effort

---

### Phase 4: Frontend API Client

| Task | Estimate | Complexity |
|------|----------|------------|
| Generate TypeScript types from API | 1h | Low |
| Implement API client composables | 2-3h | Medium |
| Add error handling and loading states | 1-2h | Low |
| Write unit tests for API client | 1-2h | Low |

**Phase 4 Total: 5-8 hours**

---

### Phase 5: UI Implementation

| Task | Estimate | Complexity |
|------|----------|------------|
| Create user registration form page | 2h | Low |
| Implement Start button functionality | 1h | Low |
| Create notifications display page | 2h | Low |
| Add manual refresh capability | 0.5h | Low |
| Basic styling (CSS) | 2-3h | Low |
| Write Playwright E2E tests | 3-4h | Medium |

**Phase 5 Total: 10.5-12.5 hours**

---

## File Structure Estimate

| Component | Files | LOC Estimate |
|-----------|-------|--------------|
| Domain interfaces | 4 files | ~100 LOC |
| Services | 4-5 files | ~800-1,000 LOC |
| Repositories | 4 files | ~400-500 LOC |
| API routes | 5-6 files | ~300-400 LOC |
| Frontend components | 4-5 files | ~400-500 LOC |
| Unit tests | 8-10 files | ~800-1,000 LOC |
| E2E tests | 2-3 files | ~200-300 LOC |
| Configuration | various | ~200 LOC |
| **Total** | ~35-40 files | **~3,200-4,000 LOC** |

---

## Complexity Factors

### High Complexity Areas
1. **Seating Algorithm** (Phase 1)
   - Greedy assignment with backtracking
   - Optimization for minimal repeat pairings
   - Performance optimization for 40 participants
   - Estimated: 4-6 hours

2. **Scheduler Integration** (Phase 3)
   - Nuxt server plugin/cron setup
   - Time-based round progression logic
   - Notification queue management
   - Estimated: 2-3 hours

3. **Integration Testing** (Phase 3)
   - Testing API endpoints with JSON persistence
   - Testing scheduler time-based behavior
   - Estimated: 3-4 hours

### Medium Complexity Areas
- EventService lifecycle management
- JSON repository implementation with proper error handling
- Frontend API client with error states
- E2E test setup and configuration

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Seating algorithm performance issues | High | Low | Early performance testing with 40 users |
| Scheduler timing edge cases | Medium | Medium | Comprehensive time-based testing |
| JSON file corruption (concurrent access) | Medium | Low | Single-threaded Nuxt server, file locking |
| Test coverage not meeting 90% | Medium | Low | Continuous testing during development |
| Scope creep (admin UI, real-time features) | Medium | Medium | Strict adherence to Phase 1-5 scope |

---

## Timeline Options

### Option 1: Full-Time (1 week)
```
Day 1-2:  Phase 1 (Core Logic + Tests)
Day 3:    Phase 2 (API Specification) + start Phase 3
Day 4-5:  Complete Phase 3 (Backend API)
Day 6:    Phase 4 (Frontend Client)
Day 7:    Phase 5 (UI) + E2E tests + buffer
```

### Option 2: Part-Time (2-3 weeks)
```
Week 1: Phase 1-2 (Core logic fully tested)
Week 2: Phase 3-4 (Backend + API client)
Week 3: Phase 5 (UI) + testing + buffer
```

---

## Dependencies & Prerequisites

### Required Setup (1-2 hours, not included in estimate)
- Nuxt 3 project configuration
- Jest configuration
- Playwright configuration
- TypeScript strict mode setup
- Prettier configuration

### Knowledge Requirements
- TypeScript (advanced)
- Nuxt 3 framework
- Jest testing framework
- Playwright E2E testing
- RESTful API design
- Scheduling/cron jobs

---

## Excluded from Estimate

The following are explicitly out of scope for this estimation:

- Admin interface for event management
- Real-time notifications (WebSockets/SSE)
- User authentication and accounts
- Database migration (beyond JSON files)
- Docker deployment setup
- Production monitoring/logging
- Multiple concurrent events support
- Mobile responsive design optimization
- Performance optimization beyond targets

---

## Buffer Recommendation

**Add 20% buffer** for unexpected issues:
- Low estimate: 40 hours × 1.2 = **48 hours**
- High estimate: 50 hours × 1.2 = **60 hours**

---

## Final Estimate Summary

### Traditional Development

| Scenario | Hours | Duration (full-time) | Duration (part-time) |
|----------|-------|----------------------|----------------------|
| Optimistic | 40 hours | 5 days | 2 weeks |
| Realistic | 50 hours | 6-7 days | 2.5-3 weeks |
| Conservative (with buffer) | 60 hours | 8 days | 3-4 weeks |

**Recommended Planning Estimate (Traditional): 50-60 hours**

### AI-Assisted Development

| Scenario | Hours | Duration (full-time) | Duration (part-time) |
|----------|-------|----------------------|----------------------|
| Optimistic | 19 hours | 2-3 days | 3-5 days |
| Realistic | 26 hours | 3-4 days | 1 week |
| Conservative (with buffer) | 33 hours | 4-5 days | 1-1.5 weeks |

**Recommended Planning Estimate (AI-Assisted): 26-33 hours**

### Comparison Summary

| Approach | Hours | Days (full-time) | Speedup |
|----------|-------|------------------|---------|
| Traditional | 50-60h | 6-8 days | baseline |
| AI-Assisted | 26-33h | 3-5 days | **~50% faster** |

**Key Insight:** With AI assistance, this project transitions from a 1-week effort to a 3-4 day effort for a full-time developer.

---

## Milestones & Deliverables

1. **Milestone 1** (End of Phase 1): Core business logic fully tested
2. **Milestone 2** (End of Phase 3): Working backend API with scheduler
3. **Milestone 3** (End of Phase 5): Complete working application

---

*Estimation Date: December 2025*
*Assumes senior developer experience with TypeScript and Nuxt 3*
