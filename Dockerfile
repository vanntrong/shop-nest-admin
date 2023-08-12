ARG SCRIPT_NAME="dev"

FROM node:16.18.0 as base
WORKDIR /app
COPY package.json yarn.lock ./
COPY . .
RUN yarn add file:./ckeditor5
RUN yarn install

FROM base as build-dev
ENV NODE_ENV=development

FROM base as build-prod
ENV NODE_ENV=production

FROM build-$SCRIPT_NAME as final
RUN yarn build --mode $NODE_ENV


FROM nginx:1.19-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=final /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
