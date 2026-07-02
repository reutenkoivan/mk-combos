# Agent Rules

Scope: whole repo.

Always before plan/edit:
- Read `ARCHITECTURE.md`; `## Правила Роботи В Репозиторії` is binding.
- Derive owner scope, import direction, and narrowest valid change location.

If request mentions `roadmap`, next step, `наступний крок`, or implementation order:
- Read `roadmap.md`.
- Use first `todo` row as next step.
- Plan must include owner scope, in scope, out of scope, and verification commands.
- Do not plan UI work while no-UI roadmap scopes remain.

Rules:
- `packages/*`: game-agnostic reusable platform only.
- Game-specific behavior stays in its game scope.
- Route pages orchestrate business state and pass prepared view models to pure UI.
- Public contracts are stable, game-agnostic, forward-compatible.
- Final state: no dead code, unused exports, boundary violations, or undocumented public subpaths.
