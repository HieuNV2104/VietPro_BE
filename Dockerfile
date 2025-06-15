FROM node:18-alpine AS builder
WORKDIR /be-node
COPY package*.json /be-node
RUN npm install
COPY . /be-node

FROM node:18-alpine
WORKDIR /be-node
COPY --from=builder /be-node /be-node/
EXPOSE 8000
CMD ["node", "src/bin/www.js"]