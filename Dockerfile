FROM ubuntu:18.04
WORKDIR /app
COPY . ./
CMD ["node ."]