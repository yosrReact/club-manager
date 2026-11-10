# Club Manager

**A React 19 + TypeScript app for managing a sports club's members, built to showcase a test strategy where AI generates and humans review.**

🇫🇷 *Application React de gestion des adhérents d'un club sportif. Projet vitrine d'une stratégie de test complète, assistée par l'IA et relue par une testeuse certifiée ISTQB. Documentation détaillée en français dans [`docs/`](./docs).*

---

## Why this project

Most demo apps show features. This one shows **how they are tested, and why**:

- **User stories first**, with testable acceptance criteria written in Gherkin.
- **A test pyramid** (unit, component, visual, end-to-end), each level with a clear purpose.
- **ISTQB test design techniques** applied on purpose: boundary value analysis, equivalence partitioning, decision tables.
- **AI-assisted test design**, with an honest account of what human review had to fix.
- **Traceability**: every acceptance criterion is linked to the tests that verify it.

## Features

- Add club members, with validation (required fields, email format, duplicates, birth date in the future)
- Automatic age category (U10, U14, U18, Senior) based on the sports season
- Search (case and accent insensitive) and filter by category
- Membership fee tracking
- Removal with confirmation
- Data kept in the browser (localStorage), resilient to corrupted storage

## Testing at a glance

| Level | Tool | What it covers |
|---|---|---|
| Unit | Vitest | Pure business rules: validation, age category, filtering, state updates |
| Component | Vitest + React Testing Library | User journeys, queried by accessible roles and labels |
| Visual & interaction | Storybook (stories run as tests in Chromium) | Component states, interaction scenarios, **automatic accessibility checks** |
| End-to-end | Playwright | Full journeys in a real browser, including persistence |

**Current status:** 53 unit and component tests, 10 story tests with accessibility checks, 3 end-to-end scenarios. 100% line coverage on the feature code.

## Documentation

| Document | Content |
|---|---|
| [User stories](./docs/user-stories.md) | Scope and acceptance criteria |
| [Test strategy](./docs/test-strategy.md) | Test levels, techniques, principles, exit criteria |
| [AI-assisted testing](./docs/ai-assisted-testing.md) | Workflow, prompt example, what human review fixed |
| [Traceability matrix](./docs/traceability.md) | Each acceptance criterion linked to its tests |

## Getting started

```bash
npm install
npm run dev          # start the app
npm test             # unit, component and story tests
npm run coverage     # with coverage report
npm run e2e          # end-to-end tests (Playwright)
npm run storybook    # browse the components
```

End-to-end and story tests need the Playwright browser: `npx playwright install chromium`.

## Project structure

```
src/features/members/
├── domain/          # Pure business rules, fully unit tested
├── components/      # MemberForm, MemberList, MemberFilters (+ stories)
├── MembersPage.tsx  # Page composition (+ component tests)
├── useMembers.ts    # State and persistence
└── storage.ts       # localStorage access, failure-tolerant
e2e/                 # Playwright scenarios
docs/                # User stories, test strategy, AI workflow, traceability
```

## Tech stack

React 19 · TypeScript · Vite · Vitest · React Testing Library · Storybook · Playwright · axe (accessibility) · GitHub Actions

## Author

**Yosr Naïja**: Senior React developer and software testing specialist (ISTQB certified, ISTQB trainer).
[LinkedIn](https://www.linkedin.com/in/yosrnaija/)

Built with the help of an AI assistant (Claude Code), reviewed and owned by the author.
