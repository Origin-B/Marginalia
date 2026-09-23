# Marginalia

> Notes in the margins. Questions worth returning to.

Marginalia is a personal reading diary. You keep a library of books, track your
progress in each one, set an optional reading deadline, and write dated notes as
you read. What sets it apart from a typical reading tracker is that notes are
**typed**. Two kinds exist so far:

- **Reflection:** your thoughts on a character's behavior, or what you learned.
- **Open question:** a part you did not understand. You save it so that, if the
  book does not clear it up later, you can go back to it.

Marginalia is a **tracker, not a reader**. It never shows book content. It stores
information about a book (title, author, pages, cover), your progress, and your notes.

The project is also a deliberate exercise: the core logic (domain rules, storage,
validation) is written as plain TypeScript, independent of React, so the
fundamentals of the language are on display rather than hidden behind a framework.

---

## Status and handoff

_Read this first when resuming work (including in a new chat)._

**Done**

- Idea, name (Marginalia) and public repo (`Origin-B/Marginalia`, Vite + TypeScript setup)
- Design direction: **modern and clean**, with a defined color palette and Tailwind v4 tokens
- Figma brief and logo brief written (the design and the logo are not made yet)
- First drafts of the domain types (`src/domain/types.ts`), reviewed twice

**In progress: finalizing `types.ts`**

- `Person = Guest | User` union is in place and correct (shared list in `BookMarkList`)
- To fix: remove `progress` (keep only the current page), rename `lastPageHasReached`
  to something short, fix `deadLine` (name, optional, real shape, see below), decide
  `kind`, replace `password: Str` with what is really stored, add `export`, add the
  optional `page` to `Note`, stop hiding meaning behind `Str` and `Num`
- `bookMarkList` currently sits inside the person. Decide whether that is what you want
- The deadline's shape is worked out in reasoning (start date, end date, start page)
  but **not yet confirmed by the author in `types.ts`** — still needs to answer:
  when the current page moves on, where does the original "page when the deadline
  was set" live, so the "behind schedule" calculation still has something to compare
  against? Write this into the `deadline` object once decided.
- Note `kind`: may end up with more than two kinds (not just Reflection / Open
  question). Decide per kind whether it only differs by name (closed list of
  literals) or needs its own fields (its own type in a union). Not decided yet.

**Next**

1. Finish `types.ts`
2. Write edge cases as comments, then the first pure function: progress percentage
3. Deadline functions (with the date pitfalls below), then tests
4. Storage layer, then UI

**Questions still open** are listed at the end of this file.

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
- Optional deadline
- Link to the book's diary

**Diary page (one per book)**

- Reading progress: percentage and progress bar, calculated from current page / total pages
- Deadline indicator, as text under the card and on the diary (see Deadline)
- Small form to add a note
- Chronological list of notes, with edit and delete
- Open questions are visually distinct and can be marked as resolved

**Note form**

- Kind (Reflection, Open question, possibly more, see open decisions)
- Text
- Entry date (the day the note is about; defaults to today)
- Optional page reference (a pointer into the book, not reading progress)
- "Created on" and "Last edited on" shown on every saved note

**Book card**

- Cover, or a generated placeholder (color + first letter of the title)
- Title, author, status badge, progress bar, deadline indicator
- Count of unresolved open questions

### Deadline

An optional goal for a book, for example "finish in 10 days".

- Store **dates**, never a relative number. "7 days left" changes every day, so it
  is always computed from the stored dates and today's date.
- The deadline holds a **start date**, an **end date**, and the **page the reader
  was on when it was set**. That start page cannot be derived, because the current
  page keeps changing. The start date is when the deadline was set, not when the
  book was added.
- Everything else is computed, not stored: days left, pages per day, the page the
  reader should be on today, how many pages behind, and the pace required from now on.
- Shown as text under the book card and on the diary page. Browser `alert()` is
  avoided because it blocks the page. An in-app banner or toast on open is a later option.
- **When the reader is behind**, offer a choice (never change data automatically):
  - **Extend:** move the end date.
  - **Re-plan:** reset the start to today and the current page, keep the end date.
    The daily pace is then recalculated from the remaining pages and days.
  - The suggestion is only shown when behind, and can be dismissed.

Worked example: a 300-page book, deadline set at page 100, 10 days. Pace is
(300 − 100) / 10 = 20 pages a day. At the end of day 4 the reader should be on
page 180. If they are on 130, they are 50 pages behind. Re-planning gives roughly
(300 − 130) / 6 ≈ 28 pages a day.

### Accounts and guest mode (simulated)

There is no backend, so accounts are **local to the browser**. They are a learning
exercise in forms, validation, sessions and storage design. They are not real security.

**Guest**

- Can use the app with limited permissions. Data lives in `sessionStorage`
- A visible banner after the first book: "Your progress is temporary. Sign in to save it"
- Data is wiped when the tab closes. `sessionStorage` is per tab, so a new tab starts empty
- Export to JSON is available as an escape hatch
- A browser warning (`beforeunload`) when leaving with unsaved guest data

**Signed-in user**

- Full features (bookmarks and everything else)
- Account and books live in `localStorage`
- **Remember me:** decides only where the _session_ (who is signed in) is kept:
  `localStorage` if ticked, `sessionStorage` if not. It never decides where the books live.
  Closing the tab ends the session, not the data.
- Settings page: log out, delete account, export data, delete all data

**Where things live**

| What                            | Where            |
| ------------------------------- | ---------------- |
| Guest books                     | `sessionStorage` |
| Account details                 | `localStorage`   |
| Signed-in user's books          | `localStorage`   |
| Session: remember me ticked     | `localStorage`   |
| Session: remember me not ticked | `sessionStorage` |

**Guest to account (design principle: never lose user data silently)**

- When a guest signs up or signs in, ask "Save your progress?" and show what will
  be saved ("3 books, 12 notes")
- The default action is **save**. Discarding is a secondary action with a clear confirmation
- Signing in to an existing account: add the guest's books to the account. Ids are
  unique, so no collisions. Accept duplicates at first; do not try to detect them
- **Order of operations:** read guest data, write to the account, confirm the write
  succeeded, and only then clear the guest data. If the write fails halfway, the
  guest data must stay untouched

**Rules**

- Never store the password in the session or in any "remember me" data. Store the
  user id and an expiry only
- Hash the password with a salt using the Web Crypto API, as an exercise
- Tell users not to use a real password. State plainly in the UI and here that accounts are simulated
- Storage is namespaced per owner (guest or user id) from day one
- An `AuthService` interface (async), like storage, so a real backend can replace it later

### Later (after v1 ships)

- Reading log: a calendar or checkmarks per day, streaks, a heatmap. This is a
  separate feature with its own data (date + pages), and it forces daily logging on the user
- Reminders or notifications (a real push needs a service worker and a server)
- Import from JSON
- Undo after deleting
- Search for books through the Open Library API (async, debounce, race conditions, error handling)
- Dark mode

### Out of scope

- Showing book content
- Social features

---

## Pages

| Route              | Page                                         |
| ------------------ | -------------------------------------------- |
| `/`                | Library                                      |
| `/books/new`       | Add a book                                   |
| `/books/:id`       | Book details                                 |
| `/books/:id/edit`  | Edit a book                                  |
| `/books/:id/diary` | Diary (progress + notes)                     |
| `/settings`        | Log out, delete account, export, delete data |
| sign-in / sign-up  | Auth forms (phase 5)                         |

---

## Data model (decisions so far)

**Person** is a union: `Guest | User`. A guest and a signed-in user share the same
data shape; only the storage location differs. The `type` field is a literal
(`"guest"` or `"user"`) and tells them apart. A user adds first name, last name,
email and a password-derived field. Remember me is **not** part of the person: it
is a login choice and belongs to the session.

**Book** (information about the book): `id`, `title`, `author`, `description`,
`totalPages`, optional `coverUrl`.

**Saved book** (the reader's relationship with a book): the book plus `addedAt`,
`currentPage`, an optional `deadline` (start date, end date, start page), and `notes`.

**Note**

| Field                    | Notes                                                            |
| ------------------------ | ---------------------------------------------------------------- |
| `id`                     | Required to edit or delete one note                              |
| `kind`                   | See open decisions                                               |
| `text`                   |                                                                  |
| `entryDate`              | The day the note is about, chosen by the user                    |
| `createdAt`, `updatedAt` | Set by the system. Not the same as `entryDate`                   |
| `page`                   | Optional. A pointer to a place in the book, not reading progress |

**Decisions**

- Progress percentage is **derived** from `currentPage` and `totalPages`. It is never stored.
- Dates are stored as ISO strings (`YYYY-MM-DD` for date-only values), because JSON does not round-trip `Date`.
- Notes live **inside** the book. Deleting a book deletes its notes for free. The
  cost: editing one note rewrites the whole book, and questions across all books
  need a loop over every book.
- Notes are independent of reading progress. Recording a note does not move the current page.
- The information that describes a book is kept apart from the reader's data, so a
  future mapper can turn an API response into a `Book` without leaking the API's shape into the app.

---

## Tech stack

- React + TypeScript, built with Vite
- Tailwind CSS v4 (design tokens in `@theme`)
- Vitest for the domain logic (planned)
- Routing library and state management: not decided yet

---

## Architecture

```
marginalia/
├─ public/                    favicon, logo (SVG)
├─ docs/
│  └─ design-system.md        typography, spacing, components, states
├─ src/
│  ├─ domain/                 plain TypeScript. No React, no browser APIs
│  │  ├─ types.ts             Person, Book, SavedBook, Note, kinds
│  │  ├─ progress.ts          percentage, page validation
│  │  ├─ deadline.ts          days left, expected page, behind, required pace
│  │  ├─ notes.ts             note rules (resolve, edit, timestamps)
│  │  ├─ validation.ts        input validation for forms
│  │  └─ *.test.ts            tests sit next to the code they test
│  ├─ storage/
│  │  ├─ storage.ts           the interface only (async methods)
│  │  ├─ sessionStorage adapter   guests
│  │  └─ localStorage adapter     signed-in users
│  ├─ auth/                   AuthService interface and local implementation (phase 5)
│  ├─ features/
│  │  ├─ library/
│  │  ├─ book-details/
│  │  ├─ diary/
│  │  ├─ book-form/
│  │  ├─ auth/
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
2. Only the storage adapters may mention `sessionStorage` or `localStorage`.
3. `features` and `components` never touch browser storage directly.
4. Direction: `features / components` → `storage / auth` → `domain`.
5. The domain does not know where data is saved. Choosing the storage is the
   storage layer's job, based on who the owner is.

The storage interface returns Promises from day one, even though browser storage is
synchronous. That way, swapping in a real API later changes one file and no UI code.

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

Tokens are defined in `src/styles/index.css` under `@theme`, with names like
`--color-primary`, so utilities such as `bg-primary`, `text-on-primary` and
`border-border` work.

**Rules**

- Never rely on color alone. Every badge carries text or an icon.
- Keep the focus ring. It is the base of keyboard accessibility.
- Text needs at least 4.5:1 contrast. Semi-transparent colors change contrast, so check them before using them on text.
- Use `text-muted` only on `background` or `surface`, never on a colored fill.
- No dark mode yet. On dark backgrounds the primary needs a lighter tint (about `#A5B0FF`).

**To write in `docs/design-system.md` (by the author):** typography scale and font,
spacing scale, radius and shadows, layout width and breakpoints, component variants
(Button, Badge, Card, Input, ProgressBar), hover / focus / disabled / error / empty /
loading states, and when to use `surface` versus `background`.

**Logo:** brief written, not made. Icon with no text, SVG, monochrome variant, and a
lighter variant for dark backgrounds. Set the wordmark in a real font, not in an
image generator. The favicon goes in `public/`.

---

## Roadmap

Each phase ends with a deploy.

- [ ] **Phase 1: books and progress.** Types, pure logic, storage, library, add/edit/delete, progress
- [ ] **Phase 2: notes.** Note form, kinds, list, edit/delete, dates
- [ ] **Phase 3: deadline.** Dates, calculations, "behind by N pages", extend and re-plan
- [ ] **Phase 4: hardening.** Corrupted storage data, export, seed data, tests
- [ ] **Phase 5: accounts.** Guest mode, sign-up and sign-in, remember me, guest-to-account migration, settings actions
- [ ] **Later:** the "Later" list above

Recommendation: design storage for owners and guests from the start, but build the
account features last. They roughly double the size of the project. If the project
stops after phase 2, it should still be a complete, presentable app.

For portfolio quality: responsive layouts, empty and error states, a live demo,
and a "Load sample data" button so a reviewer does not have to enter data by hand.

---

## Testing

Test the pure functions in `domain` first. Write the edge cases as comments before
writing the functions:

- `totalPages` is 0
- `currentPage` greater than `totalPages`, or negative
- Deadline is today, in the past, or the book is already finished
- The reader is ahead of schedule
- Whether the current day counts as elapsed
- Note dated in the future
- Storage contains invalid JSON
- Guest-to-account migration: write fails halfway, duplicates, an empty guest library

**Date pitfalls to try in the browser console before writing deadline code.**
Predict the result first, then run it:

- `new Date("2026-10-01")` versus `new Date(2026, 9, 1)`: are they the same moment? Why is the month 9?
- Subtracting two dates and dividing by the milliseconds in a day: what breaks when
  a daylight saving change falls between them?
- Opening the app at 11:59 pm and at 12:01 am: should "days left" change?

Decide whether to store date-only strings and compare whole days.

---

## Open decisions

_Working notes for the author. Answer these, move the answers into the sections
above, then delete this section before publishing._

### Types (`domain/types.ts`)

1. **Note kinds.** More than two kinds may exist. Write a list of every kind you
   imagine and, next to each, the fields or state that make it different. Kinds that
   only differ by name can be a closed list of literal values. Kinds with their own
   fields (a resolved question needs a resolution date, an open one must not have
   one) deserve their own type in a union. Are kinds fixed by the app, or can the
   user create them? The latter is a different design (tags).
2. **Book status** (Want to read / Reading / Finished). Store it or derive it from
   `currentPage`? Deriving prevents contradictions. Is there a state such as "on
   hold" that cannot be derived?
3. **Optional fields.** How do you write `coverUrl`, `deadline` and a note's `page`
   so the types force every consumer to handle "missing"?
4. **IDs.** How will you generate them? Why not use the array index?
5. **Dates.** Date-only string or full timestamp? What does "today" mean across time zones?
6. **Password.** What is stored instead of the password itself? If someone opens
   `localStorage`, what do they see in each case? How does the type reflect that?
7. **Where the book list lives.** Inside the person, or as a separate list that
   belongs to an owner? What does each choice change when one book is edited?
8. **Names.** Pick one word for a saved book and use it everywhere. Replace `Str`
   and `Num` with names that describe the role, or drop them.

### Domain logic

9. **Progress.** What does the function return when `totalPages` is 0 or
   `currentPage` exceeds it? Throw, clamp, or something else? What must the caller do?
10. **"Behind".** Do you mean the required pace from now on (needs only end date,
    today and current page), or the gap against the original plan (needs the start
    date and start page too)? The examples above use the second, and the "extend
    vs re-plan" choice depends on this too: re-planning resets start date and
    start page to today and recalculates pace from the remaining pages and days.
11. **Elapsed days.** Does the current day count as elapsed? The answer changes the
    result by a full day's pages.
12. **Deadline actions.** Exactly which fields change on "extend" and on "re-plan"?
13. **Deleting a book.** Confirmation? Undo? What is the cost of each?

### Storage and accounts

14. **Corrupted data.** If `JSON.parse` throws inside an `async` function, what
    happens, and what should the caller see?
15. **Race conditions.** If `saveBook` is called twice in a row without `await`, and
    each call reads, changes and writes the array with an `await` in between, what
    can be lost? Predict the result on paper first. If the body has no `await`
    between read and write, is there a race at all?
16. **Failed migration.** If the write to the account fails halfway (3 of 5 books
    saved), what happens to the guest data, and what does the user see?
17. **Schema version.** If the stored shape changes next month, how are old data handled?
18. **Import validation.** What must imported JSON pass before you trust it?
19. **Sessions.** What exactly is stored for a session, and when does it expire?

### UI and architecture

20. **Routing library** and **state management.** Start with `useReducer` and
    Context, or a library? Where do calls to `storage` live?
21. **Progress bar accessibility.** `<progress>` or `role="progressbar"`?
22. **State placement.** Which state lives in the URL, which in memory, which in storage?

### Self-assessment checkpoints

Use these to judge your own level honestly. Score each question A (I can explain
it and give an example), B (I recognize it but cannot explain it from scratch), or
C (not sure). Every B and C is a study item. Bring these back to the discussion
whenever you start a new conversation.

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
2. **Replace test:** swap browser storage for an API by editing one file.
3. **Explain test:** justify every design decision out loud.
4. **Rebuild test:** two weeks later, rebuild the core without looking at the old code.
5. **Review test:** read the code a week later as if someone else wrote it.

### Housekeeping

- Check that the name "Marginalia" does not collide with an existing project you care about.
- Add a short description to the GitHub repository.
- Make the logo and put the favicon in `public/`.
- Get a first visual design. The Figma credits ran out; free alternatives exist
  (for example Google Stitch, Visily, Banani), but their free limits change, so
  check each site. Designing two screens by hand (Library and Diary) is also a fine option.
- Write `docs/design-system.md`.
