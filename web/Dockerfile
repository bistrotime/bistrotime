FROM node:11.11 as build
WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

FROM nginx:1.15-alpine
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
