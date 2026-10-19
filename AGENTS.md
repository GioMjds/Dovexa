# AGENTS.md

> Read this file first, every session, before writing code.

## General Principles

- Generate concise, short solutions for new modules or code.
- Watch for over-engineering, oversized files needing refactor.
- Watch for weird syntax/style mismatching rest of codebase.
- Watch for obvious bugs.
- Prioritize concise, precise code and docs changes.
- No emojis or special characters in comments.
- Write `activity-log.md` in `/docs` to refer back if confused.
- Make to-do list, run major changes by user first.
- Review existing files before refactor or change.
- Markdown files use kebab naming (e.g., `my-file.md`).
- Don't auto-commit activity logs and docs.
- Comments: one-liner, one sentence.

## Code Quality

- Right data structures and algorithms for problem.
- Don't expose data needlessly (least priviledge).
- No external libraries unless aboslutely necessary.
- Use project dependency file for correct versions.
- Avoid redundancy unless improves usability.
- Prioritize semantic markup/tags and accessibility attributes over `.tsx` component or page files.

## When Unsure

- Ambiguous requirement -> state your assumption, proceed.
- About to touch auth, payments, or run a schema migration -> pause and confirm with the human first.

## Version Control

- Commit after significant changes, clear messages.
- Keep commits focused, atomic.
- No auto-push any branch.

## AI Restrictions

- No customer personal data - names, contacts, account numbers, etc.
- No credentials - passwords, API keys, tokens, connection strings, etc.

## Design Context

- Product Register: `product` (essential utility, workflows, and task completion).
- Primary Docs: Reference [PRODUCT.md](./PRODUCT.md) for strategy and users; reference [DESIGN.md](./DESIGN.md) for visual tokens and components.

## After Task

- Must give an user workflow after each task. Like how each component is used, what the user sees, and how they interact with it.
- Give an brief explanation of how the code works, what it does, and how it fits into the overall system.
- Document any assumptions or decisions made during the task.
- Explain how it helps the user achieve their goals and how it improves their experience.
- If it is role-based, explain how it works for that/each role and what they can do with it.
- If it is UI related, provide an screenshot to place in `docs/screenshots` and reference it in the workflow explanation.
- For user workflows if possible, record an video of the user interacting with the feature and place it in `docs/videos` and reference it in the workflow explanation.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
