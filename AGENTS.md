<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Repo Workflow Preference

For this repository, after completing requested changes, automatically:
1. update git with a commit and push to `origin/main` unless the user explicitly says not to
2. deploy the latest state to Vercel production
3. refresh Graphify output for the repo

Do not wait for the user to repeat these steps each time unless they explicitly opt out for a specific task.
