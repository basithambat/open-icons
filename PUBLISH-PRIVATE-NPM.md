# Publishing open-icons to a private npm registry

Choose one of the options below, then follow the steps.

---

## Option 1: GitHub Packages (private, free for private repos)

Use GitHub’s npm registry. Good if your code is on GitHub.

### 1.1 Scope and config

- **Scope** = `basithambat` (this repo: https://github.com/basithambat/open-icons).
- **Package name:** `@basithambat/open-icons`.

**`package.json`** is already set:

```json
{
  "name": "@basithambat/open-icons",
  "repository": { "type": "git", "url": "https://github.com/basithambat/open-icons.git" },
  "publishConfig": { "registry": "https://npm.pkg.github.com/basithambat" },
  ...
}
```

### 1.2 Auth token

1. GitHub → **Settings → Developer settings → Personal access tokens**.
2. Create a token with:
   - `read:packages`
   - `write:packages`
   - `repo` (if the repo is private).
3. Copy the token (e.g. `ghp_xxxx`).

### 1.3 Login and publish

```bash
cd "/Users/basith/Documents/Open icons"

# Log in to GitHub Packages (use your token as password)
npm login --registry=https://npm.pkg.github.com
# Username: basithambat
# Password: <your GitHub PAT with read:packages, write:packages>
# Email: your@email.com

npm run build
npm publish --access restricted
```

`--access restricted` keeps the package private (only visible to you/your org).

### 1.4 Install in another project

In the app that will use the package:

```bash
# .npmrc in project root (or in home ~/.npmrc)
echo "@basithambat:registry=https://npm.pkg.github.com" >> .npmrc

npm install @basithambat/open-icons
```

For CI or other machines, set `NPM_TOKEN` (or `GITHUB_TOKEN`) and use it as the password when logging in, or add to `.npmrc`:

```
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

---

## Option 2: npm private packages (registry.npmjs.org)

Requires a paid npm account (Pro / Teams / Organization).

### 2.1 Scope and config

- Create an **npm organization** (e.g. `mycompany`) or use your username.
- Package name: `@mycompany/open-icons`.

Edit **`package.json`**:

```json
{
  "name": "@YOUR_NPM_ORG/open-icons",
  "version": "1.0.0",
  "publishConfig": {
    "access": "restricted"
  },
  ...
}
```

### 2.2 Login and publish

```bash
cd "/Users/basith/Documents/Open icons"

npm login
# Log in with your npm account that has access to the org

npm run build
npm publish
```

With `"access": "restricted"` in `publishConfig`, the package is private to your org.

### 2.3 Install in another project

```bash
npm install @YOUR_NPM_ORG/open-icons
```

Users need to be logged in to npm and have access to the org.

---

## Option 3: Other private registries (Verdaccio, Azure, JFrog, etc.)

1. Get the registry URL (e.g. `https://npm.mycompany.com`).
2. In **`package.json`**:

   ```json
   "publishConfig": {
     "registry": "https://npm.mycompany.com"
   }
   ```

3. Log in and publish:

   ```bash
   npm login --registry=https://npm.mycompany.com
   npm run build
   npm publish
   ```

4. In consuming projects, set that registry for the scope (or default) in `.npmrc` and run `npm install @scope/open-icons` (or `open-icons` if unscoped).

---

## Before every publish

1. **Bump version** in `package.json` (e.g. `1.0.1` for fixes, `1.1.0` for new icons/features).
2. **Build:** `npm run build`.
3. **Publish:** `npm publish` (or `npm publish --access restricted` for GitHub).

---

## What gets published

Your **`package.json`** already has:

```json
"files": ["dist", "svg"]
```

Only `dist/` and `svg/` are included in the tarball. To ship only the built output (SVGs are inlined in the bundle), you can change to:

```json
"files": ["dist"]
```

Then run `npm publish` again. Keeping `svg` is optional and only needed if you want the raw SVGs in the package.

---

## Quick checklist (e.g. GitHub Packages)

- [ ] Set `name` to `@YOUR_ORG/open-icons` in `package.json`.
- [ ] Add `repository` and `publishConfig.registry` in `package.json`.
- [ ] Create a GitHub token with `read:packages`, `write:packages`.
- [ ] `npm login --registry=https://npm.pkg.github.com`.
- [ ] `npm run build` then `npm publish --access restricted`.
- [ ] In the other project: add `.npmrc` scope and run `npm install @YOUR_ORG/open-icons`.
