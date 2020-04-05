FROM node:lts-slim

ENV NODE_PATH=./build
ENV NODE_ENV=production

WORKDIR /usr/src/docs-defender

COPY package.json yarn.lock ./
COPY client ./client
COPY server ./server

RUN yarn --production
RUN cd client && yarn --production && cd ..
RUN cd server && yarn --production && cd ..
RUN yarn cache clean --force

RUN yarn build

EXPOSE 4000

CMD ["node", "build/index.js"]