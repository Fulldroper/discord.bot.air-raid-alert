FROM node:17

WORKDIR .

COPY . .

RUN npm install -g

# Open Port
EXPOSE 80

CMD ["node","."]