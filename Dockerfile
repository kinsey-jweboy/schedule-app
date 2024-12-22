# 构建阶段
FROM node:18-slim AS builder

WORKDIR /app

COPY . .

RUN npm i -g pnpm --registry=https://registry.npmmirror.com && \
    pnpm install

RUN pnpm build  

# 运行阶段
FROM node:18-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package.json pnpm-lock.yaml ./

RUN npm i -g pnpm --registry=https://registry.npmmirror.com && \
    pnpm install --prod --frozen-lockfile

RUN npx -y playwright@1.49.1 install --with-deps chromium

EXPOSE 5000

CMD [ "npm", "run", "start:prod" ]





