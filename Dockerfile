# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NEXTAUTH_SECRET=7x9y2z4q8w3e5r6t1p0o9i8u7y6t5r4e
ENV NEXTAUTH_URL=http://localhost:3000

RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXTAUTH_SECRET=7x9y2z4q8w3e5r6t1p0o9i8u7y6t5r4e
ENV NEXTAUTH_URL=http://localhost:3000

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "start"]