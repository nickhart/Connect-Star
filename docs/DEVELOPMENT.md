# Development Guide

## =� VS Code Setup

This project includes comprehensive VS Code configuration for a consistent development experience across the team.

### Recommended Extensions

When you open the project in VS Code, you'll be prompted to install recommended extensions. Key extensions include:

**Essential:**

- **Prettier** - Code formatting
- **ESLint** - Linting and code quality
- **TypeScript** - Enhanced TypeScript support
- **Turbo** - Monorepo task integration

**Development:**

- **GitLens** - Enhanced git capabilities
- **Jest** - Test runner integration
- **Error Lens** - Inline error highlighting
- **Path Intellisense** - Intelligent path completion

**React/Next.js:**

- **React Snippets** - Code snippets
- **Tailwind CSS** - Utility class support
- **Auto Rename Tag** - Paired tag editing

### Automatic Formatting

The project is configured for automatic formatting:

- **Format on Save**  - Code is formatted when you save
- **Format on Paste**  - Pasted code is automatically formatted
- **Auto Import Organization**  - Imports are sorted and cleaned up
- **ESLint Auto-fix**  - ESLint issues are fixed on save

### VS Code Tasks

Access powerful tasks via **Cmd+Shift+P � "Tasks: Run Task"**:

**Development:**

- `dev` - Start all development servers
- `dev:web` - Start web app only
- `dev:mobile` - Start mobile app only

**Building:**

- `build` - Build all packages
- `build:web` - Build web app only

**Testing:**

- `test` - Run all tests
- `test:watch` - Run tests in watch mode
- `test:coverage` - Run with coverage

**Quality:**

- `lint` - Lint all code
- `format` - Format all code
- `type-check` - TypeScript validation
- `quality` - Run all quality checks

**Commits:**

- `commit` - Interactive conventional commit

### Debugging

Pre-configured debug configurations available in **Run and Debug** panel:

- **Debug Web App (Next.js)** - Server-side debugging
- **Debug Web App (Chrome)** - Client-side debugging
- **Debug Jest Tests** - Test debugging
- **Debug React Native** - Mobile app debugging

### Workspace Settings

The project enforces consistent settings:

- **Tab Size**: 2 spaces
- **Trim Whitespace**: Automatic
- **Insert Final Newline**: Automatic
- **File Nesting**: Organized file explorer
- **Problem Matching**: Enhanced error detection

## =� Conventional Commits

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification for structured commit messages.

### Interactive Commit (Recommended)

Use the interactive commit tool instead of `git commit`:

```bash
# Interactive commit with guided prompts
pnpm commit

# Retry the last commit if it failed validation
pnpm commit:retry
```

This will guide you through creating properly formatted commit messages.

### Manual Commit Format

If you prefer manual commits, follow this format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting changes (no code logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks
- `revert`: Reverting previous commits

**Examples:**

```bash
git commit -m "feat(ui): add drop animation to game board"
git commit -m "fix(api): handle connection timeout errors"
git commit -m "docs: update installation instructions"
```

### Automatic Releases

The project supports semantic versioning based on conventional commits:

```bash
# Automatic version bump based on commits
pnpm release

# Force specific version bumps
pnpm release:patch   # 1.0.0 -> 1.0.1
pnpm release:minor   # 1.0.0 -> 1.1.0
pnpm release:major   # 1.0.0 -> 2.0.0

# Preview what will be released
pnpm release:dry
```

This will:

- Analyze commits since last release
- Bump version automatically (`feat` = minor, `fix` = patch, `BREAKING CHANGE` = major)
- Generate/update CHANGELOG.md
- Create a git tag
- Create a release commit

## =' Local Quality Gates

This project includes automated quality gates to ensure code quality and consistency across the monorepo.

### Git Hooks

The project uses [Husky](https://typicode.github.io/husky/) to manage git hooks:

#### Pre-commit Hook

Automatically runs on every commit:

- ( **Prettier** - Formats staged files
- =
  **ESLint** - Lints and fixes staged files
- <� **TypeScript** - Type checks staged files in their respective packages

#### Commit Message Hook

Validates commit messages on every commit:

- =� **Commitlint** - Ensures commit messages follow conventional format
- =� **Blocks invalid commits** - Prevents commits with malformed messages

#### Pre-push Hook

Runs before pushing to remote:

- > � **Full Test Suite** - Runs all tests across packages
- =( **Build All Packages** - Ensures everything builds successfully
- =
  **Type Check All** - Validates TypeScript across the monorepo

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

� **Warning**: Only use `--no-verify` in emergencies. The hooks exist to maintain code quality.

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
