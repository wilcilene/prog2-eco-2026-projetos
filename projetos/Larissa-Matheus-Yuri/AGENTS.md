AGENTS.md
===========

Purpose
-------

This file provides concise, actionable instructions for AI coding agents to become productive quickly in this repository.

Quick start
-----------

- Install dependencies: `npm install`
- Development server: `npm run dev` (uses `nodemon`)
- Production start: `npm start`

Key facts agents should know
----------------------------

- Project uses ES modules (`"type": "module"` in [package.json](package.json)).
- Entry points: [server.js](server.js) (starts the Express server) and [app.js](app.js).
- Database: Postgres via `pg`; connection code is in [db/connection.js](db/connection.js).
- Frontend game code lives in `src/` (notably [src/classes](src/classes) for game logic and [src/controllers](src/controllers) for server controllers).
- Models are in [models/](models/) (see [models/userModel.js](models/userModel.js)).
- Views are in [view/](view/) and static assets under `images/` and `ImagensPato/`.

Agent conventions and guidance
-----------------------------

- Prioritize minimal, focused changes: small PRs with one purpose.
- When updating runtime behavior, prefer editing [server.js](server.js) or the matching controller in [src/controllers](src/controllers).
- Do not change DB credentials or secrets in the repo; use environment variables via `.env` and [db/connection.js](db/connection.js).
- Run `npm run dev` to verify API and server-side changes quickly.
- There are no automated tests configured in this repo; any new features should include basic manual verification steps in the PR description.

Useful links
------------

- Project README: [README.md](README.md)
- package.json (scripts & deps): [package.json](package.json)

If you want additional automation
--------------------------------

Suggestions an agent could propose:

- Add a `.github` workflows directory with CI to run linting and basic smoke tests.
- Add a small `make` or npm `test` script to codify manual verification steps.

Contact / Context
-----------------

If anything in this file looks off or incomplete, update it with a short note linking to the relevant files.
