# Small Web frontend

A small browser inside a web page. Pick a person, type an address that ends
in `.zz`, and browse the pages people have published. Built with React,
TypeScript, Vite and Tailwind CSS.

## Run it

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000. The API must already be running on
http://localhost:4000 (from the `api` folder: export `MONGODB_URI`, then
`npm run seed` and `npm run start:dev`).

Port note: this app runs on port 3000, which matches the API CORS origin
`WEB_ORIGIN=http://localhost:3000`. If you run it on 5173 instead, change the
API `WEB_ORIGIN` to `http://localhost:5173` and restart the API.

To point at a different API, set `VITE_API_URL` before starting dev, for
example `VITE_API_URL=http://localhost:4000 npm run dev`. The default is
`http://localhost:4000`.

## Tests and build

```bash
npm test    # unit tests for the address normalizer and session history
npm run build
```

## How it works, in plain words

- `src/api.ts` calls the API. Shapes come from the backend code.
- `src/normalize.ts` is the same address rule as the backend: lowercase,
  strip the scheme, strip any fragment or query and trailing slash, and only
  accept a host that ends in `.zz`.
- `src/session.ts` is the back and forward history: a list plus a pointer.
  Back and forward only move the pointer, they never call the API. Going
  back and then opening a new page deletes everything after the pointer.
  Each entry remembers its scroll position, so going back shows the page
  as it was left.
- `src/components/PageView.tsx` shows the page HTML inside a contained box
  (`contain: paint`). Link clicks inside a page are caught and opened as a
  normal navigation. A search is stored as its own entry, so going back
  shows the same search results again.
- A slow request is cancelled with `AbortController` when you navigate
  again, so an old answer cannot overwrite a newer page.

## The 8 quick tests

1. Open 4 pages, go back and forward through them.
2. Go back, then click a new link. The old forward pages must disappear.
3. Search, then go back to the same search results.
4. Publish a page with a script, an `onerror` attribute, a `javascript:`
   link and a big overlay. Nothing must run or cover the address bar.
5. `Tidepool.zz`, `tidepool.zz` and `tidepool.zz/` must all open the same
   `tidepool.zz` page.
6. A missing address must show the not found page, not crash.
7. Run the seed twice. The data must not double.
8. Back and forward buttons must be disabled at the ends.
