# ResumeForge

Resume builder with a live A4 preview, an experience timeline and one-click PDF export.
Built with **React 18**, **TypeScript** and **Ant Design 5**.

**Live demo:** https://eraldashehu.github.io/resume-builder/

## Features

- **Live preview** that updates as you type, laid out at A4 proportions.
- **Experience timeline**: add, reorder and remove jobs, with month pickers and a "current job" switch.
- **Skills as tags**: type and press Enter, or pick from suggestions. Duplicates are removed automatically.
- **Suggested summary** built from your job title, years of experience and top skills.
- **Two templates** and a **color picker** for the accent color.
- **PDF export** through a print stylesheet, no PDF library needed.
- **Auto-save** to `localStorage`, debounced, and flushed when the tab is closed.
- **Responsive**: on small screens the editor and preview switch with a segmented control.

## Tech stack

- [React 18](https://react.dev) with function components and hooks
- [TypeScript](https://www.typescriptlang.org) in strict mode
- [Ant Design 5](https://ant.design) components and `@ant-design/icons`
- [Day.js](https://day.js.org) for dates (used by Ant Design's DatePicker)
- [Vite](https://vitejs.dev) for development and builds

## Getting started

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
git clone https://github.com/eraldashehu/resume-builder.git
cd resume-builder
npm install
npm run dev
```

Then open http://localhost:5173.

```bash
npm run typecheck # check types with tsc
npm run build     # type-check, then production build in dist/
npm run preview   # serve the build locally
```

## Architecture

The code is organised **by feature**, not by file type. Everything about the resume lives in `features/resume`, and the rest of the app imports it only through `features/resume/index.ts`.

```
src/
├── main.tsx                          # entry point
├── app/
│   ├── App.tsx                       # page layout and responsive switch
│   └── AppProviders.tsx              # ConfigProvider, AntApp, ResumeProvider
├── shared/
│   └── hooks/usePersistentReducer.ts # useReducer + debounced localStorage
└── features/resume/
    ├── index.ts                      # public API of the feature
    ├── model/
    │   ├── types.ts                  # Resume types and the ResumeAction union
    │   ├── resumeReducer.ts          # pure reducer: every change goes through here
    │   ├── defaults.ts               # example and blank resume, id helper
    │   └── storage.ts                # validation and migration of saved data
    ├── context/ResumeContext.tsx     # state and dispatch in two contexts
    ├── hooks/
    │   ├── useResume.ts              # useResumeState, useResumeActions
    │   └── useYearsOfExperience.ts   # memoized derived value
    ├── lib/                          # pure helpers: dates, summary text
    └── components/
        ├── Toolbar.tsx
        ├── editor/                   # one memoized card per section
        └── preview/                  # PreviewPanel (deferred) + ResumePreview (memo)
```

### How data flows

1. `ResumeProvider` holds the resume in a **`useReducer`**, wrapped by the custom hook **`usePersistentReducer`**, which loads from and saves to `localStorage`.
2. State and `dispatch` are provided through **two separate contexts**. `dispatch` never changes, so components that only send updates don't re-render when the data changes.
3. Components never call `dispatch` directly. They use **`useResumeActions()`**, a custom hook that returns named, stable functions such as `updateExperience(id, patch)`.
4. Every change is a typed action (`ResumeAction` is a **discriminated union**). The reducer is a pure function, so it is easy to test.

## React techniques used, and why

| Technique | Where | Why |
|---|---|---|
| `useReducer` + Context | `ResumeContext.tsx` | One predictable place for all updates, with no prop drilling |
| Split state / dispatch contexts | `ResumeContext.tsx` | Components that only dispatch don't re-render on data changes |
| Custom hooks | `useResumeState`, `useResumeActions`, `usePersistentReducer`, `useYearsOfExperience` | Reusable logic, and components stay small and readable |
| `React.memo` | Every editor card, `ExperienceItem`, `ResumePreview` | Typing in one field re-renders only the card that changed |
| Structural sharing in the reducer | `resumeReducer.ts` | Only the changed item gets a new object, so `memo` can skip the rest |
| `useMemo` | Action creators, skill suggestions, years of experience | Stable references and no repeated work |
| `useCallback` | `SummaryCard` | Stable handler passed to Ant Design |
| `useRef` | `usePersistentReducer`, `ExperienceCard` | Debounce timer and latest state without re-renders; DOM access to focus and scroll to a new job |
| `useDeferredValue` | `PreviewPanel` | The editor updates first and the preview follows, so typing stays smooth |
| Lazy `useReducer` initializer | `usePersistentReducer` | `localStorage` is read once, not on every render |
| Data migration | `storage.ts` | Saves from version 1 (skills as text) still load |

## Deploy

**GitHub Pages (automatic):** this repository includes `.github/workflows/deploy.yml`. In the repository go to **Settings → Pages**, set **Source** to **GitHub Actions**, then push. The app is published at `https://eraldashehu.github.io/resume-builder/`.

**GitLab Pages (automatic):** this repository includes `.gitlab-ci.yml`. Push it to GitLab and the live address appears under **Deploy → Pages**.

## Author

**Eralda Shehu**, Frontend Developer
[LinkedIn](https://www.linkedin.com/in/eralda-shehu/) · [GitHub](https://github.com/eraldashehu)
