<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Narrow-Scope Mode

When the user says `Use my narrow-scope coding mode.` or `Use $narrow-scope-coding.`, follow these rules:

1. Work only on the target file, component, page, API, database query, or logic named in the prompt.
2. Identify only the directly related files needed before editing.
3. Do not scan, analyze, or modify unrelated files.
4. Do not refactor broadly unless the user explicitly asks.
5. Do not change global config, routing, layout, authentication, environment files, package files, or unrelated backend/frontend logic unless directly required.
6. Do not run build, test, lint, install, or long-running commands by default.
7. Run commands only when required for the specific task, and explain why before running them.
8. Do not run continuous commands or repeated terminal commands.
9. Prefer minimal patch changes.
10. For frontend UI fixes, work only on the target component/page and directly related style files, and preserve the existing design/code style.
11. For backend/API/database fixes, work only on the target API/controller/service/model/query and directly related logic.
12. At the end of the task, report:
    - Files changed
    - What was fixed
    - Commands run
    - Any files intentionally not touched
