# multi-stage not needed here since there is no build step
FROM node:26.3.1-alpine3.24 AS fnl_base_image
# Remediate CVE-2026-14456, CVE-2026-18798, CVE-2026-63072, CVE-2026-63076 (CDS-1716)
# Upgrade libcrypto3 and libssl3 from 3.5.7-r0 to 3.5.8-r0
RUN apk upgrade --no-cache libcrypto3 libssl3
WORKDIR /usr/src/app
# copy the package files only
COPY package.json package-lock.json ./
# install dependencies
# clear the npm cache
# remove npm
RUN npm ci --omit=dev && npm cache clean --force && npm uninstall npm -g
# copy the rest of the application and assign the "node" user as it's owner
COPY --chown=node:node . .
# switch to the "node" user, this is a non-root user included in the base image
USER node
# setup environment
ENV PORT=4030
ENV NODE_ENV=production
EXPOSE 4030
# start the application
CMD [ "node", "./bin/www" ]
