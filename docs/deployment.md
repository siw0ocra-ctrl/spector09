# Publishing this game

Run `node scripts/build.mjs` from the exact source checkout before packaging, including for HTML-only changes. The Worker embeds static assets as base64; copying updated HTML without rebuilding leaves the served page stale. `dist/server` is generated and ignored by Git.

On Windows, if the hosting packager cannot launch bash, first build in the source checkout, then use prepare-site-build.cjs and tar. Inspect the packaged Worker's embedded index.html and referenced assets, not only the loose HTML. Publish a new source version for a corrected deployment and diagnose the public response if a user reports stale content.
