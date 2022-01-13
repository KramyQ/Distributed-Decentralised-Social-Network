FROM node:10-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY . /app

RUN npm install

ENV BACK_PORT 3279

EXPOSE 3001
RUN npm install  @material-ui/core
RUN npm install  @material-ui/icons
CMD ["npm", "start"]

