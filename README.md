# Marginalia

> Notes in the margins. Questions worth returning to.

Marginalia is a personal reading diary. You keep a library of books, track your
progress in each one, and write dated notes as you read. What sets it apart from
a typical reading tracker is that notes come in **two kinds**:

- **Reflection**: your thoughts on a character's behavior, or what you learned.
- **Open question**: a part you did not understand. You save it so that, if the
  book does not clear it up later, you can go back to it.

The project is also a deliberate exercise: the core logic (domain rules, storage,
validation) is written as plain TypeScript, independent of React, so the
fundamentals of the language are on display rather than hidden behind a framework.

---

## Status

Planning and design. Repository set up, design tokens defined, data model
drafted. The `domain` layer comes first, then storage, then UI.

---

## Features

### MVP (v1)

**Library**

- List of books as cards, with search and a status filter (Want to read / Reading / Finished)
- Empty state for a new user
- Add, edit and delete a book

**Book details page**

- Title, author, description, total pages, date added
- Optional cover image URL
- Optional deadline (days to finish)
- Link to the book's diary

**Diary page (one per book)**

- Reading progress: percentage and progress bar, calculated from current page / total pages
- Deadline indicator, for example "5 days left" or "12 pages behind"
- Small form to add a note
- Chronological list of notes, with edit and delete
- Open questions are visually distinct and can be marked as resolved

**Note form**

- Kind: Reflection or Open question
- Text
- Entry date (the day the note is about; defaults to today)
- Optional page reference
- "Created on" and "Last edited on" shown on every saved note

**Settings**

- Export all data as JSON
- Delete all data (with confirmation)

**Book card**

- Cover, or a generated placeholder (color + first letter of the title)
- Title, author, status badge, progress bar, deadline indicator
- Count of unresolved open questions

### Later (after v1 ships)

- Import from JSON
- Undo after deleting
- Search for books through the Open Library API (async, debounce, error handling)
- Dark mode

### Out of scope for v1

- **Authentication.** Without a backend, a login is only a simulation and gives no
  real security. If it is added later, the README must say so plainly.
- **Push notifications.** They need a service worker and a server. The app will
  instead calculate and show "you are behind by N pages" when it opens.
- Social features.

---

## Pages

| Route              | Page                     |
| ------------------ | ------------------------ |
| `/`                | Library                  |
| `/books/new`       | Add a book               |
| `/books/:id`       | Book details             |
| `/books/:id/edit`  | Edit a book              |
| `/books/:id/diary` | Diary (progress + notes) |
| `/settings`        | Export and delete data   |

---

## Data model (decisions so far)

**Book**

| Field                            | Notes                                          |
| -------------------------------- | ---------------------------------------------- |
| `id`                             | Required for routes and lookups                |
| `title`, `author`, `description` |                                                |
| `addedAt`                        | ISO date string                                |
| `progress`                       | A separate object: `totalPages`, `currentPage` |
| `notes`                          | Array stored inside the book                   |
| `coverUrl`                       | Optional                                       |
| `deadline`                       | Optional                                       |

**Note**

| Field                    | Notes                                                                            |
| ------------------------ | -------------------------------------------------------------------------------- |
| `id`                     | Required to edit or delete one note                                              |
| `kind`                   | Reflection or open question (see open decisions)                                 |
| `text`                   |                                                                                  |
| `entryDate`              | The day the note is about, chosen by the user                                    |
| `createdAt`, `updatedAt` | Set by the system. Not the same as `entryDate`                                   |
| `page`                   | Optional reference to a place in the book. It is a pointer, not reading progress |

**Decisions**

- Progress percentage is **derived** from `currentPage` and `totalPages`. It is not stored.
- Dates are stored as ISO strings, because JSON does not round-trip `Date` objects.
- Notes live **inside** the book. Deleting a book deletes its notes for free. The
  cost: editing one note rewrites the whole book, and questions across all books
  ("every open question") need a loop over every book.
- Notes are independent of reading progress. Recording a note does not move the
  current page.

---

## Tech stack

- React + TypeScript, built with Vite
- Tailwind CSS v4 (design tokens in `@theme`)
- Vitest for the domain logic (planned)
- Routing library and state management: not decided yet (see open decisions)

---

## Architecture

```
marginalia/
├─ public/                    favicon, logo (SVG)
├─ docs/
│  └─ design-system.md        typography, spacing, components, states
├─ src/
│  ├─ domain/                 plain TypeScript. No React, no browser APIs
│  │  ├─ types.ts             Book, Note, status, kinds
│  │  ├─ progress.ts          percentage, validation of pages
│  │  ├─ deadline.ts          pages per day, days left, behind/on track
│  │  ├─ notes.ts             note rules (resolve, edit, timestamps)
│  │  ├─ validation.ts        input validation for forms
│  │  └─ *.test.ts            tests sit next to the code they test
│  ├─ storage/
│  │  ├─ storage.ts           the interface only (async methods)
│  │  └─ localStorageStorage.ts   the ONLY file that touches localStorage
│  ├─ features/
│  │  ├─ library/
│  │  ├─ book-details/
│  │  ├─ diary/
│  │  ├─ book-form/
│  │  └─ settings/
│  ├─ components/             shared UI: Button, Badge, Card, Input, ProgressBar
│  ├─ hooks/
│  ├─ app/                    router, providers, layout
│  ├─ styles/
│  │  └─ index.css            Tailwind import and @theme tokens
│  └─ main.tsx
└─ README.md
```

This is a starting point, not a rule. Change it when the code tells you to.

**Dependency rules**

1. `domain` imports nothing from the rest of the app.
2. Only `storage/localStorageStorage.ts` may mention `localStorage`.
3. `features` and `components` never touch `localStorage` directly.
4. Direction: `features / components` → `storage` → `domain`.

The storage interface returns Promises from day one, even though `localStorage`
is synchronous. That way, swapping in a real API later changes one file and no
UI code.

---

## Design system

Direction: **modern and clean.**

| Token         | Value     | Use                                                   |
| ------------- | --------- | ----------------------------------------------------- |
| `background`  | `#F8F9FB` | Page background                                       |
| `surface`     | `#FFFFFF` | Cards, forms, modals, header                          |
| `foreground`  | `#14171F` | Main text (17.0:1 on background)                      |
| `muted`       | `#5B6272` | Secondary text (5.8:1 on background)                  |
| `border`      | `#E3E6EC` | Borders and dividers                                  |
| `primary`     | `#3B4CCA` | Main buttons, links, focus ring, progress fill        |
| `on-primary`  | `#FFFFFF` | Text on primary (6.8:1)                               |
| `question`    | `#B8480A` | Open-question badge, icon, side border                |
| `on-question` | `#FFFFFF` | Text on question (5.3:1)                              |
| `resolved`    | `#1F7A52` | Resolved badge and finished status (5.3:1 with white) |

The tokens are defined in `src/styles/index.css` under `@theme`.

**Rules**

- Never rely on color alone. Every badge carries text or an icon.
- Keep the focus ring. It is the base of keyboard accessibility.
- Text needs at least 4.5:1 contrast. Semi-transparent colors change contrast, so
  check them before using them on text.
- Use `text-muted` only on `background` or `surface`, never on a colored fill.
- Still to define in `docs/design-system.md`: typography scale, spacing scale,
  radius and shadows, layout width and breakpoints, component variants, and
  hover / focus / disabled / error / empty / loading states.

---

## Roadmap

Each phase ends with a deploy.

- [ ] **Phase 1: books and progress.** Types, pure logic, storage, library, add/edit/delete, progress
- [ ] **Phase 2: notes.** Note form, both kinds, list, edit/delete, dates
- [ ] **Phase 3: deadline.** Calculation and "behind by N pages" indicator
- [ ] **Phase 4: hardening.** Corrupted storage data, export/import, seed data button, tests
- [ ] **Phase 5: optional.** Open Library search, undo, dark mode

Also for portfolio quality: responsive layouts, empty and error states, a live demo,
and a "Load sample data" button so a reviewer does not have to enter data by hand.

---

## Testing

Test the pure functions in `domain` first. Write the edge cases as comments before
writing the functions:

- `totalPages` is 0
- `currentPage` greater than `totalPages`, or negative
- Deadline already in the past
- Book already finished
- Note dated in the future
- Storage contains invalid JSON

---

## Open decisions

_Working notes for the author. Answer these, move the answers into the sections
above, then delete this section before publishing._

### Types (`domain/types.ts`)

1. **Note kinds.** Which fields do the two kinds share, and which belong to one
   kind only? How do you express that in TypeScript so impossible states cannot
   exist? For example: a resolved question must have a resolution date, and an
   open question must not. What changes in the note form depending on kind?
2. **Book status** (Want to read / Reading / Finished). Do you store it or derive
   it from `currentPage`? Deriving prevents contradictions (status "Finished"
   with page 10). Is there a state such as "on hold" that cannot be derived?
3. **Optional fields.** How do you write `coverUrl`, `deadline` and a note's
   `page` so the types force every consumer to handle "missing"?
4. **IDs.** How will you generate them? Why not use the array index?
5. **Dates.** ISO string or number? Is `entryDate` a date only (`YYYY-MM-DD`) or a
   full timestamp? What does "today" mean across time zones, and what breaks if you
   get it wrong?

### Domain logic

6. **Progress.** What should the function return when `totalPages` is 0, or when
   `currentPage` exceeds it? Does it throw, clamp, or return something else? What
   does the caller then have to do?
7. **Deadline.** How many pages per day are needed? What happens when the deadline
   has passed, when the book is finished, or when the user is ahead of schedule?
8. **Deleting a book.** Confirmation? Undo? What is the cost of each?

### Storage

9. **Corrupted data.** If `JSON.parse` throws inside an `async` function, what
   happens, and what should the caller see?
10. **Race conditions.** If `saveBook` is called twice in a row without `await`, and
    each call reads, changes and writes the array with an `await` in between, what
    can be lost? Predict the result on paper first, then run it and compare.
11. **Schema version.** If the stored shape changes next month, how will old data
    be handled?
12. **Export/import.** What validation does imported JSON need before you trust it?

### UI and architecture

13. **Routing library** and **state management.** Start with `useReducer` and
    Context, or a library? Where do calls to `storage` live?
14. **Progress bar accessibility.** `<progress>` or an element with
    `role="progressbar"`? What does each give you?
15. **Re-render strategy.** Which state lives in the URL, which in memory, which in storage?

### Self-assessment checkpoints

Use these to judge your own level honestly. Score each question A (I can explain
it and give an example), B (I recognize it but cannot explain it from scratch), or
C (not sure). Every B and C is a study item.

- **Language fundamentals:** `==` vs `===` and coercion; closures; value vs
  reference; how `this` is bound; what `class` really does (prototype chain).
- **Async:** the event loop and ordering of callbacks and promises; `await` inside
  `forEach`; `Promise.all` vs `allSettled`; preventing stale responses from
  overwriting newer ones; handling `response.ok` with `fetch`.
- **DOM and events:** capturing vs bubbling; event delegation; cleaning up
  listeners; when to re-render everything and when to update one element.
- **Code organization:** which functions are pure and which have side effects, and
  why that matters for testing; how many files change if storage changes.

Five tests to run once phases 1 to 4 are done:

1. **Change test:** add a feature such as Undo in under an hour without breaking others.
2. **Replace test:** swap `localStorage` for an API by editing one file.
3. **Explain test:** justify every design decision out loud.
4. **Rebuild test:** two weeks later, rebuild the core without looking at the old code.
5. **Review test:** read the code a week later as if someone else wrote it.

### Housekeeping

- Check that the name "Marginalia" does not collide with an existing project you care about.
- Add a short description to the GitHub repository.
- Create the logo (icon + wordmark, SVG) and put the favicon in `public/`.
- Write `docs/design-system.md`.
