# Deployment Guide

This guide covers building, testing, and deploying the Connect-Star applications for production environments.

## Table of Contents

- [Build Process](#build-process)
- [Web Deployment](#web-deployment)
- [Mobile Deployment](#mobile-deployment)
- [Environment Configuration](#environment-configuration)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

## Build Process

### Production Build

```bash
# Build all packages and applications
pnpm build

# Build specific applications
pnpm build --filter=web
pnpm build --filter=mobile

# Verify build integrity
pnpm test:ci
pnpm type-check
pnpm lint
```

### Build Artifacts

**Web Application (`apps/web`):**

- Output: `.next/` directory
- Static files: `.next/static/`
- Server files: `.next/server/`

**Mobile Application (`apps/mobile`):**

- Development: Expo development build
- Production: Platform-specific binaries (IPA/APK)

**Shared Packages:**

- Output: `dist/` directories
- TypeScript declarations: `*.d.ts` files
- Source maps: `*.map` files

### Build Optimization

```bash
# Production build with optimizations
NODE_ENV=production pnpm build

# Analyze bundle size (web)
cd apps/web && pnpx @next/bundle-analyzer

# Check package sizes
pnpm size-limit
```

## Web Deployment

### Vercel Deployment (Recommended)

**Setup:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link
```

**Configuration (`vercel.json`):**

```json
{
  "buildCommand": "cd ../.. && pnpm build --filter=web",
  "outputDirectory": ".next",
  "installCommand": "cd ../.. && pnpm install",
  "framework": "nextjs",
  "functions": {
    "app/**": {
      "maxDuration": 30
    }
  }
}
```

**Deploy:**

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Docker Deployment

**Dockerfile (`apps/web/Dockerfile`):**

```dockerfile
FROM node:18-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/*/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm build --filter=web

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
```

**Build and run:**

```bash
# Build Docker image
docker build -t connect-star-web .

# Run container
docker run -p 3000:3000 connect-star-web
```

### Static Export (Optional)

```bash
# Configure for static export (next.config.js)
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

# Export static files
cd apps/web && pnpm build && pnpm export
```

## Mobile Deployment

### Expo Application Services (EAS)

**Setup:**

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure
```

**EAS Configuration (`eas.json`):**

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "123456789",
        "appleTeamId": "ABCD123456"
      },
      "android": {
        "serviceAccountKeyPath": "./path/to/serviceAccount.json",
        "track": "production"
      }
    }
  }
}
```

### Building for Different Platforms

**Development Build:**

```bash
# iOS simulator
eas build --platform ios --profile development

# Android emulator
eas build --platform android --profile development
```

**Production Build:**

```bash
# iOS App Store
eas build --platform ios --profile production

# Google Play Store
eas build --platform android --profile production

# Both platforms
eas build --platform all --profile production
```

### App Store Submission

**iOS (App Store Connect):**

```bash
# Build and submit
eas submit --platform ios --latest

# Manual submission
eas build --platform ios --profile production
# Upload .ipa file through App Store Connect
```

**Android (Google Play Console):**

```bash
# Build and submit
eas submit --platform android --latest

# Manual submission
eas build --platform android --profile production
# Upload .aab file through Google Play Console
```

## Environment Configuration

### Environment Variables

**Web Application (`.env.local`):**

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.connectstar.com
NEXT_PUBLIC_WS_URL=wss://ws.connectstar.com

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=GA_MEASUREMENT_ID

# Feature Flags
NEXT_PUBLIC_ENABLE_MULTIPLAYER=true
```

**Mobile Application (`app.config.js`):**

```javascript
export default {
  expo: {
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001',
      wsUrl: process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3001',
      enableMultiplayer: process.env.EXPO_PUBLIC_ENABLE_MULTIPLAYER === 'true',
    },
  },
};
```

### Environment-Specific Builds

**Development:**

```bash
NODE_ENV=development pnpm dev
```

**Staging:**

```bash
NODE_ENV=staging pnpm build
EXPO_PUBLIC_API_URL=https://staging-api.connectstar.com eas build --profile preview
```

**Production:**

```bash
NODE_ENV=production pnpm build
EXPO_PUBLIC_API_URL=https://api.connectstar.com eas build --profile production
```

## CI/CD Pipeline

### GitHub Actions Workflow

**`.github/workflows/deploy.yml`:**

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests
        run: pnpm test:ci

      - name: Type check
        run: pnpm type-check

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-mobile:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build mobile app
        run: eas build --platform all --non-interactive
```

### Pipeline Stages

1. **Validation**

   - Install dependencies
   - Run linting and type checking
   - Execute test suite
   - Verify build completion

2. **Building**

   - Build all packages
   - Generate production artifacts
   - Create deployment packages

3. **Deployment**

   - Deploy web app to hosting platform
   - Build mobile apps for app stores
   - Update CDN and static assets

4. **Post-deployment**
   - Run smoke tests
   - Update monitoring dashboards
   - Send deployment notifications

## Monitoring and Maintenance

### Health Checks

**Web Application:**

```bash
# Health check endpoint
curl https://connectstar.com/api/health

# Performance monitoring
curl https://connectstar.com/api/metrics
```

**Mobile Application:**

- App store reviews and ratings
- Crash reporting via Expo/Sentry
- Performance metrics via analytics

### Performance Monitoring

**Web:**

- **Core Web Vitals** monitoring
- **Bundle size** tracking
- **API response times**
- **Error rate** monitoring

**Mobile:**

- **App startup time**
- **Memory usage**
- **Battery consumption**
- **Crash rates**

### Maintenance Tasks

**Regular Updates:**

```bash
# Update dependencies
pnpm update

# Security audit
pnpm audit

# Check for outdated packages
pnpm outdated
```

**Database Migrations** (if applicable):

```bash
# Run pending migrations
npm run migrate

# Backup before major updates
npm run backup
```

### Rollback Procedures

**Web Rollback:**

```bash
# Vercel rollback to previous deployment
vercel rollback [deployment-url]

# Docker rollback
docker pull connect-star-web:previous-tag
docker stop current-container
docker run -p 3000:3000 connect-star-web:previous-tag
```

**Mobile Rollback:**

- Release previous version through app stores
- Use Expo Updates for emergency patches
- Communicate with users about rollback

### Troubleshooting

**Common Issues:**

1. **Build Failures**

   ```bash
   # Clear cache and rebuild
   pnpm clean
   rm -rf node_modules
   pnpm install
   pnpm build
   ```

2. **Environment Variables**

   ```bash
   # Verify environment configuration
   echo $NODE_ENV
   printenv | grep NEXT_PUBLIC
   ```

3. **Mobile Build Issues**

   ```bash
   # Clear Expo cache
   expo start --clear

   # Reset EAS build cache
   eas build --clear-cache
   ```

### Support and Escalation

**Monitoring Alerts:**

- Set up alerts for error rates > 5%
- Monitor response times > 2s
- Track deployment success rates

**Emergency Contacts:**

- Development team lead
- DevOps/Infrastructure team
- Platform-specific support (Vercel, Expo)

**Documentation:**

- Keep runbooks updated
- Document known issues and solutions
- Maintain deployment checklists

## Security Considerations

### Pre-deployment Security

```bash
# Security audit
pnpm audit --audit-level moderate

# Check for vulnerabilities
npm run security-check

# Environment validation
npm run validate-env
```

### Production Security

- **HTTPS** enforcement for web
- **API key** rotation and management
- **Dependency** security monitoring
- **Access control** for deployment pipelines

### Compliance

- **Data privacy** regulations (GDPR, CCPA)
- **App store** guidelines and policies
- **Security** best practices and standards

---

For questions about deployment, please refer to the [Contributing Guide](CONTRIBUTING.md) or contact the development team.
