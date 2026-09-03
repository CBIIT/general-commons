FROM node:26.8.1-alpine3.24 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:26.8.1-alpine3.24 AS fnl_base_image
WORKDIR /usr/src/app
# CVE-2026-63073: Alpine 3.24 libssl3/libcrypto3 3.5.8-r0
RUN rm -rf \
        /usr/local/lib/node_modules/npm \
        /usr/local/bin/npm \
        /usr/local/bin/npx \
        /usr/local/lib/node_modules/corepack \
        /usr/local/bin/corepack \
        /opt/yarn* \
        /usr/local/bin/yarn \
        /usr/local/bin/yarnpkg
COPY --from=build --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node bin ./bin
COPY --chown=node:node app.js config.js logger.js ./
COPY --chown=node:node graphql ./graphql
COPY --chown=node:node data-management ./data-management
COPY --chown=node:node routes ./routes
COPY --chown=node:node services ./services
COPY --chown=node:node constants ./constants
USER node
ENV PORT=4030
ENV NODE_ENV=production
EXPOSE 4030
CMD [ "node", "./bin/www" ]
