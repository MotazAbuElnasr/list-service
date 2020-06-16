FROM node:12-alpine
LABEL maintainer="Motaz Abu Elnasr <motaz.abuelnasr@gmail.com>"

WORKDIR /app

COPY package*.json ./

RUN npm install && \
    npm audit fix 

COPY . .

EXPOSE 3000

CMD node .
