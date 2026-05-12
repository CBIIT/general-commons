FROM node:26.1.0-alpine3.23

WORKDIR /usr/src/app

COPY . .

RUN npm install -g npm@11.13.0 \
  && npm ci --omit=dev \
  && npm cache clean --force \
  && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

ENV PORT=4030
ENV NODE_ENV=production

EXPOSE 4030

CMD [ "node", "./bin/www" ]
