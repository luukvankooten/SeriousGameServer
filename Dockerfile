FROM --platform=linux/amd64 node:16-slim as build-env

WORKDIR /usr/src/app

COPY . .

RUN npm i -g @vercel/ncc
RUN npm ci

RUN ncc build src/index.ts -o dist

FROM --platform=linux/amd64 node:16-slim

WORKDIR /usr/src/app

COPY --from=build-env /usr/src/app/dist/index.js ./index.js

EXPOSE 3001

CMD ["node", "index.js"]