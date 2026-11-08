# Small Web

A small browser inside a web page, with fake websites stored in MongoDB.

## What it does

- Back and forward history, as a list plus a pointer in the browser. Going back and then opening a new link deletes the old forward pages.
- Safe HTML: pages are cleaned once when published, so scripts, `javascript:` links, and custom styles cannot run or cover the address bar.
- Search over plain text, with title weighted more than page text.
- Address cleaning in one place, so `Tidepool.zz`, `tidepool.zz`, and `tidepool.zz/` all open the same page.
- Repeatable seed data: 6 people, 10 sites, 54 visits. Running the seed twice does not double the data.

## How to run it

### Backend

From the `api` folder, export your own MongoDB Atlas address first as `MONGODB_URI`, then:

```bash
npm run seed
npm run start:dev
