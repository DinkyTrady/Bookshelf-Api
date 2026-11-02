FROM oven/bun:alpine

WORKDIR /app

# Install curl for health checks
RUN apk --no-cache add curl

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]
