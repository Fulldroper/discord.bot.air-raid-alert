FROM node:17

WORKDIR ./

COPY . .

RUN npm i

CMD ["node","."]