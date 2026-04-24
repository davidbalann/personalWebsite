# Personal Website (Static)

A static portfolio site (no build step) plus a lightweight in-browser admin editor.

- Public site: `index.html`
- Admin editor: `admin.html` (saves to `localStorage`, can optionally publish to JSONBin)

## What's In This Repo

- `index.html` - the public website markup (loads assets from `assets/`).
- `admin.html` - the admin editor markup (loads assets from `assets/`).
- `assets/css/` - site stylesheets.
- `assets/js/` - site scripts.
- `jsonbin-template.json` - starter data payload for JSONBin (content schema).
- `uploads/` - assets used by the site.

## Editing Content

### Admin Editor (hidden entry)

- On `index.html`, click the "DB.sys" logo 5x quickly -> it opens `admin.html`.
- In `admin.html`, enter **Password** + **Date of Birth**.
  - First login on a browser stores your credentials locally (see "Security" below).
  - Subsequent logins must match what's stored.
- Use **Save All** to save locally and attempt to publish to JSONBin.

Local storage keys used:

- Portfolio data: `dbsys_portfolio_data_v1`
- Admin auth config: `dbsys_admin_auth_v1`
- Admin session flag: `dbsys_admin_authed`

If you get locked out (forgotten password/DOB), clear the saved keys:

- Chrome: DevTools -> Application -> Local Storage -> delete `dbsys_admin_auth_v1` (and optionally `dbsys_admin_authed`)

### JSONBin (optional publish)

The site can load/save content via JSONBin if configured (optional).

- Public site loads: `GET https://api.jsonbin.io/v3/b/<BIN_ID>/latest`
- Admin publishes: `PUT https://api.jsonbin.io/v3/b/<BIN_ID>`

Configuration is currently embedded in the HTML:

- `index.html` has `JB_BIN` + `JB_KEY`
- `admin.html` has `JB_BIN` + `JB_KEY`

If you fork this repo, replace these with your own values (do not reuse keys).

To set up a new JSONBin:

1. Create a new bin on JSONBin.
2. Paste the contents of `jsonbin-template.json` as the bin record.
3. Copy your Bin ID + Master Key into `JB_BIN` / `JB_KEY` in both `index.html` and `admin.html`.

## Data Schema (JSON)

The site expects an object shaped like:

- `about`: `{ p1, p2, p3, currently, currently_date, education[] }`
- `projects[]`: first item is the "spotlight", remaining items fill the grid
- `experience[]`: timeline items with `bullets[]`
- `skills`: `languages[]`, `systems[]`, `ai[]`, `devops[]`
  - each entry may be a string or `{ "name": "...", "source": "..." }` (adds a tooltip)
- `now` (optional): `building`, `reading`, `doing` (string or string[])
- `courses[]` (optional): `{ code, name, desc }`
- `contact`: `{ email, github, linkedin }`

See `jsonbin-template.json` for a populated example payload.

## Security Notes

The admin gate is **not** secure authentication:

- Credentials are stored in the browser (`localStorage`) and only protect against casual access.
- Do not reuse important passwords.
- If you deploy publicly, assume anyone can view page source and discover `admin.html`.

## Deploy

Any static host works (GitHub Pages, Netlify, Vercel static, Cloudflare Pages):

- Upload `index.html`, `admin.html`, `assets/`, `uploads/`, and any other root assets.
- Ensure paths (like `David_Balan_CV.pdf`) stay correct relative to `index.html`.
