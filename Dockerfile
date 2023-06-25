FROM node:16.18.0 as build
WORKDIR /app
COPY package.json yarn.lock ./
COPY . .
RUN yarn add file:./ckeditor5
RUN yarn install
RUN yarn build --mode production

FROM nginx:1.19-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
