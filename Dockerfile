FROM node:lts-slim

WORKDIR /usr/src/docs-defender

COPY package.json yarn.lock ./
COPY client ./client
COPY server ./server

RUN yarn install
RUN cd client && yarn install && cd ..
RUN cd server && yarn install && cd ..

EXPOSE 4000

CMD ["yarn", "start"]