# Portfolio

Link - https://nikharmsingh.github.io/

Build & development
 - Install dev dependencies:

```bash
npm install
```

 - Build CSS (compiles `scss/style.scss` → `css/style.min.css`):

```bash
npm run build
```

Notes for GitHub Pages
 - This repository is structured to be served from the repository root (GitHub Pages "main" branch → root). The `package.json` and `postcss.config.js` provide a lightweight local build step to produce a minified CSS file you can commit for production. If you want automated builds, I can add a GitHub Actions workflow to compile and commit built assets on push.
