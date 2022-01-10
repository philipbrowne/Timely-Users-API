FROM node:14-alpine
WORKDIR /app
COPY /backend/package.json .
RUN npm install
COPY . .
EXPOSE 80
CMD ["node", "server.js"]