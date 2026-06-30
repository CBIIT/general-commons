# multi-stage not needed here since there is no build step
FROM node:26.3.1-alpine3.24 AS fnl_base_image
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
