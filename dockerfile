FROM node:17

WORKDIR ./propozicii/

COPY . .

RUN npm install -g

# Open Port
EXPOSE 80

RUN 
CMD [ "echo", "$HOME" ]
CMD ["node","."]