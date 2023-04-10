FROM debian:bullseye as builder

ENV PATH=/usr/local/node/bin:$PATH
ARG NODE_VERSION=18.15.0

RUN apt-get update; apt install -y curl python-is-python3 pkg-config build-essential && \
    curl -sL https://github.com/nodenv/node-build/archive/master.tar.gz | tar xz -C /tmp/ && \
    /tmp/node-build-master/bin/node-build "${NODE_VERSION}" /usr/local/node && \
rm -rf /tmp/node-build-master

RUN mkdir /app
WORKDIR /app

COPY . .

RUN npm install && npm run build


# production environment
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
