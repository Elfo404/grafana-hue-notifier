FROM node:16.1
WORKDIR /usr/src/grafana-hue-webhook

# Installing dependencies
COPY package*.json ./
RUN npm ci

# Building project
COPY ./tsconfig.json .
COPY ./src ./src
RUN npm run build

# Removing source files
RUN rm -rf ./src ./tsconfig.json

# Removing all non-prod dependencies
RUN npm ci --production

EXPOSE 3100

ENV NODE_ENV=production
CMD [ "node", "dist/index.js" ]
