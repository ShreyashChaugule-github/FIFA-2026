# ---- Stage 1: Dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ---- Stage 2: Builder ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Public Firebase config (safe to bake in — these are client-side values)
ENV NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyClPJtAaQB2p5P9T7etcJe_ZbRgI1XeQHE
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fifa-2026-502710.firebaseapp.com
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=fifa-2026-502710
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fifa-2026-502710.firebasestorage.app
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=463939132351
ENV NEXT_PUBLIC_FIREBASE_APP_ID=1:463939132351:web:3d5341036d5a6862a99f0a
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- Stage 3: Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
