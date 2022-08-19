FROM node
WORKDIR ./
RUN npm i

CMD ["node","."]