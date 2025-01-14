#Stage1
FROM node:14-alpine as build-stage

WORKDIR /app
COPY frontend/foody/ .

RUN npm install

RUN npm run build


##Stage2
FROM nginx:1.23

COPY --from=build-stage /app/build /usr/share/nginx/html

CMD nginx -g 'daemon off;'