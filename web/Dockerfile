FROM node:11.14 as build
WORKDIR /usr/src/app

COPY . .

# No need to run "npm install" because the
# node_modules folder is already in the context

RUN npm run build

FROM nginx:1.15-alpine
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
