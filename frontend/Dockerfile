FROM node:16.20.2-alpine3.18 as build

WORKDIR /usr/src/app

COPY . .
#COPY frontend/ .

RUN NODE_OPTIONS="--max-old-space-size=4096" npm install --legacy-peer-deps

RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

FROM nginx:1.31.2-alpine3.23-slim as fnl_base_image

ADD https://dl-cdn.alpinelinux.org/alpine/v3.23/main/x86_64/libcrypto3-3.5.8-r0.apk /tmp/libcrypto3-3.5.8-r0.apk
ADD https://dl-cdn.alpinelinux.org/alpine/v3.23/main/x86_64/libssl3-3.5.8-r0.apk /tmp/libssl3-3.5.8-r0.apk

RUN apk add --no-network /tmp/libcrypto3-3.5.8-r0.apk /tmp/libssl3-3.5.8-r0.apk \
    && rm -f /tmp/libcrypto3-3.5.8-r0.apk /tmp/libssl3-3.5.8-r0.apk

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY --from=build /usr/src/app/conf/inject.template.js /usr/share/nginx/html/inject.template.js
COPY --from=build /usr/src/app/conf/nginx.conf /etc/nginx/conf.d/configfile.template
COPY --from=build /usr/src/app/conf/entrypoint.sh /

ENV PORT 80

ENV HOST 0.0.0.0

RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"

EXPOSE 80

ENTRYPOINT [ "sh", "/entrypoint.sh" ]
