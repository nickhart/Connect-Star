# Development Guide

## 🔧 Local Quality Gates

This project includes automated quality gates to ensure code quality and consistency across the monorepo.

### Git Hooks

The project uses [Husky](https://typicode.github.io/husky/) to manage git hooks:

#### Pre-commit Hook

Automatically runs on every commit:

- ✨ **Prettier** - Formats staged files
- 🔍 **ESLint** - Lints and fixes staged files
- 🏗️ **TypeScript** - Type checks staged files in their respective packages

#### Pre-push Hook

Runs before pushing to remote:

- 🧪 **Full Test Suite** - Runs all tests across packages
- 🔨 **Build All Packages** - Ensures everything builds successfully
- 🔍 **Type Check All** - Validates TypeScript across the monorepo

### Manual Quality Scripts

You can run quality checks manually:

```bash
# Run all quality checks (lint + type-check + test)
pnpm quality

# Auto-fix formatting and linting issues
pnpm quality:fix

# Individual commands
pnpm format              # Format all files
pnpm lint               # Lint all packages
pnpm type-check         # Type check all packages
pnpm test               # Run all tests
pnpm build              # Build all packages

# Simulate git hooks manually
pnpm pre-commit         # Simulate pre-commit hook (uses pnpx lint-staged)
pnpm pre-push           # Simulate pre-push hook
```

### Lint-staged Configuration

The project uses [lint-staged](https://github.com/okonet/lint-staged) to run tools only on staged files:

- **TypeScript/JavaScript files**: Prettier + ESLint
- **JSON/Markdown/CSS files**: Prettier only
- **TypeScript files**: Package-specific type checking

### Bypassing Hooks (Emergency Only)

In rare cases, you can bypass hooks:

```bash
# Skip pre-commit hook
git commit --no-verify

# Skip pre-push hook
git push --no-verify
```

⚠️ **Warning**: Only use `--no-verify` in emergencies. The hooks exist to maintain code quality.

### Package-specific Development

When working on individual packages, you can run package-specific commands:

```bash
# Work on UI package
cd packages/ui
pnpm dev              # Watch mode
pnpm test:watch       # Test watch mode
pnpm lint             # Lint this package only

# Work on web app
cd apps/web
pnpm dev              # Next.js dev server
pnpm test:watch       # Test watch mode
```

The hooks will still run the appropriate checks for your changes across the entire monorepo.
