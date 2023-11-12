# Development
FROM node:18-alpine as development

WORKDIR /app
COPY --chown=node:node package*.json ./

RUN npm ci
COPY --chown=node:node . .

USER node