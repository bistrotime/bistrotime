FROM node:12 as build
WORKDIR /usr/src/app

ARG ALGOLIA_PLACES_APP_ID
ARG ALGOLIA_PLACES_APP_KEY
ARG BISTROTIME_API_URL
ARG MAPBOX_TOKEN

COPY . .

# No need to run "npm install" because the
# node_modules folder is already in the context

RUN npm run build

FROM nginx:1.16-alpine
WORKDIR /usr/src/app

COPY docker/nginx.conf /etc/nginx
COPY --from=build /usr/src/app/dist /usr/src/app
