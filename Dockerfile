FROM oven/bun:alpine

WORKDIR /app

COPY package.json ./
COPY bun.lock ./

RUN bun install --production

COPY . .

EXPOSE 3000

CMD ["bun", "run", "--smol", "--hot", "src/index.ts"]
