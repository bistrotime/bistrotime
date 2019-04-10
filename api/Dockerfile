FROM node:11.11 as build
WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

FROM node:11.11-alpine
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist dist/
COPY --from=build /usr/src/app/node_modules node_modules/

COPY config config/
COPY package.json .

RUN npm prune --production

CMD npm run start
