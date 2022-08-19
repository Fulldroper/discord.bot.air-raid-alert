FROM node:17

COPY . /app

WORKDIR /app

RUN npm install -g

CMD [ "echo", "$HOME" ]
ENTRYPOINT ["node","index.js"]