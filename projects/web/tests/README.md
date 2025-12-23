# Playwright E2E Tests

End-to-end tests for the Klikkmentes web application using Playwright.

## Test Structure

```
tests/
├── landing.spec.ts        # Landing page and user registration tests
├── dashboard.spec.ts      # Dashboard page tests
├── components.spec.ts     # Component-level tests
├── navigation.spec.ts     # Navigation and edge case tests
├── accessibility.spec.ts  # Accessibility and responsive design tests
├── user-flows.spec.ts     # Complete user journey tests
└── fixtures.ts            # Shared test utilities and fixtures
```

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run specific test file
```bash
npx playwright test landing.spec.ts
```

### Run tests matching a pattern
```bash
npx playwright test -g "user registration"
```

### Debug tests
```bash
npx playwright test --debug
```

### View test report
```bash
npx playwright show-report
```

## Test Coverage

### Landing Page Tests (`landing.spec.ts`)
- Title and subtitle display
- Event information display
- User selection dropdown functionality
- Button state management (disabled/enabled)
- Navigation to dashboard after user selection
- Alphabetical sorting of user names

### Dashboard Tests (`dashboard.spec.ts`)
- User name and event display in header
- Switch user functionality
- Event status section display
- Table assignment section
- Notifications section
- Invalid user ID handling

### Component Tests (`components.spec.ts`)
- EventStatus component states
- TableAssignment component display
- NotificationList component
- RoundProgress component
- Layout and styling consistency

### Navigation Tests (`navigation.spec.ts`)
- Landing to dashboard navigation
- Dashboard to landing navigation
- Multiple user selection flow
- Direct URL access
- Browser back/forward button support
- URL structure validation
- Form validation

### Accessibility Tests (`accessibility.spec.ts`)
- Heading hierarchy
- Form labels and ARIA attributes
- Button accessibility
- Keyboard navigation
- Screen reader support
- Responsive design (mobile, tablet)

### User Flow Tests (`user-flows.spec.ts`)
- Complete user journeys
- User switching scenarios
- Multi-user scenarios
- Session management
- Performance tests

## Fixtures

Shared test utilities are available in `fixtures.ts`:

- `navigateToLanding()`: Navigate to the landing page
- `selectUserAndNavigate(userName)`: Select a user and navigate to dashboard
- `getCurrentUserId()`: Get the current user ID from URL
- `getRandomUserName()`: Get a random user name for testing
- `getUserNameById(id)`: Get user name by ID
- `getUserIdByName(name)`: Get user ID by name

## Notes

- Tests use demo data that is initialized on app mount
- The scheduler service starts automatically when the first user joins
- Tests run against a local dev server on http://localhost:3000
- Parallel execution is enabled for faster test runs
- Screenshots and traces are captured on failure
