#ARG ECR_REPO
#FROM ${ECR_REPO}/base-images:20.11.1
FROM node:25.5.0-alpine3.22 AS fnl_base_image
ENV PORT=4030
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY interoperation/ package*.json ./
#RUN npm ci --only=production
RUN npm install -g npm@11.7.0
RUN npm install --omit=dev \
  && npm cache clean --force \
  && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
EXPOSE 4030
CMD [ "node", "./bin/www" ]
