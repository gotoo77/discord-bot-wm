FROM node:20-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
RUN mkdir -p /app/data/logos && chown -R node:node /app

USER node
CMD ["node", "src/index.js"]
