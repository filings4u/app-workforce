# Canonical five-portal shell integration

The **C/TPA and Employer shell designs and behaviors are sourced from the existing NON-DOT production portals**, not from old DOT agency portals.

- C/TPA reference: `filings4u/ctpa-non-dot.screenings4u.com` (dashboard markup + `assets/css/portal.css`).
- Employer reference: `filings4u/employer-non-dot.screenings4u.com` (dashboard markup + `assets/css/portal.css`).
- Canonical deployment host: `app-workforce.screenings4u.com`; login and selector remain `portal.screenings4u.com`.
- Other legacy portals are sources of *features, views, services and workflows only*; never import their shells as the final layout.
- Preserve the five roles: C/TPA, Employer, Owner-Operator, Employee and Driver. DOT and NON-DOT are modules within authorized workspaces, not additional portal hosts.
- Existing app-workforce shells are **not** yet fully replaced by these reference shells. The checked-in HTML and CSS are staged reference assets for an actual DOM/JS integration; don't switch the stylesheet against mismatched markup without browser testing.
- Do not delete any legacy pages or redirect authenticated workflows until corresponding functionality, backend authorization and session handoff have passed parity tests.
