---
name: preflight
description: Run the project's done-gate checks (svelte-check + lint) before finishing a change or opening a PR. Use after making code changes to confirm they pass type checking and linting.
---

Run the project verification gate and report results. Stop and surface failures; do not auto-fix unless asked.

1. Run `npm run check` (svelte-kit sync + svelte-check / TypeScript validation).
2. Run `npm run lint` (`prettier --check .` then `eslint .`).

If `npm run lint` reports formatting issues, suggest `npm run format` to fix them.

Report a concise pass/fail summary for each step. If anything fails, show the relevant output and the file:line locations so the user can act.
