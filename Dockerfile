FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY index.js telegram_bot.js storage.js data.json ./

ENV NODE_ENV=production \
    NTBA_FIX_319=1 \
    DATA_PATH=/data/data.json

RUN mkdir -p /data && chown -R node:node /app /data

USER node

CMD ["node", "index.js"]
