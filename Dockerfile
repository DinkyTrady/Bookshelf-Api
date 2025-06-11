FROM oven/bun:alpine

WORKDIR /app

COPY package.json ./
COPY bun.lock ./

RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]
