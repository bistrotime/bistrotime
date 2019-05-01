FROM node:12 as build
WORKDIR /usr/src/app

COPY . .

# No need to run "npm install" because the
# node_modules folder is already in the context

RUN npm run build

FROM node:12-alpine
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist dist/

COPY config config/

COPY package.json .
COPY package-lock.json .

RUN npm install --production

CMD npm run start
