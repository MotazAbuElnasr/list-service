FROM node:12-alpine
LABEL maintainer="Motaz Abu Elnasr <motaz.abuelnasr@gmail.com>"

WORKDIR /app

COPY package*.json ./

RUN apk --update add git \
    --repository https://alpine.global.ssl.fastly.net/alpine/v3.10/community \
    --repository https://alpine.global.ssl.fastly.net/alpine/v3.10/main && \
    npm install && \
    npm audit fix 

COPY . .

EXPOSE 3000

CMD node .
