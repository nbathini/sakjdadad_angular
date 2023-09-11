FROM dockerhub-docker-remote.artifactory.platform.vwfs.io/node:18-alpine3.18@sha256:b2da3316acdc2bec442190a1fe10dc094e7ba4121d029cb32075ff59bb27390a AS builder

ARG UID=101

# build PCL Delivery application frontend
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run build -- --configuration=dev

# build PCL Delivery email customer survey application frontend
WORKDIR customersurvey
RUN npm install 
RUN npm run build -- --configuration=dev

FROM dockerhub-docker-remote.artifactory.platform.vwfs.io/nginx:stable-alpine-slim@sha256:b8132df8c2fc73f4c1e7ce434c1ff19b134818e8173cd5e8f79c55a5f635d7e5

RUN mkdir -p /tmp
RUN chmod 777 /tmp
VOLUME /tmp

RUN mkdir -p /var/cache/nginx
RUN chmod 777 /var/cache/nginx
VOLUME /var/cache/nginx

RUN mkdir -p /var/lib/amazon
RUN chmod 777 /var/lib/amazon
VOLUME /var/lib/amazon

RUN mkdir -p /var/log/amazon
RUN chmod 777 /var/log/amazon
VOLUME /var/log/amazon

COPY --chown=nginx:nginx build/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/porshe-app /usr/share/nginx/html
COPY --from=builder /app/customersurvey/dist/porshe-app /usr/share/nginx/html/customer

# implement changes required to run NGINX as an unprivileged user
RUN sed -i '/user  nginx;/d' /etc/nginx/nginx.conf \
  && sed -i 's,/var/run/nginx.pid,/tmp/nginx.pid,' /etc/nginx/nginx.conf \
  && sed -i "/^http {/a \    proxy_temp_path /tmp/proxy_temp;\n    client_body_temp_path /tmp/client_temp;\n    fastcgi_temp_path /tmp/fastcgi_temp;\n    uwsgi_temp_path /tmp/uwsgi_temp;\n    scgi_temp_path /tmp/scgi_temp;\n" /etc/nginx/nginx.conf \
  && chown -R $UID:0 /var/cache/nginx \
  && chmod -R g+w /var/cache/nginx \
  && chown -R $UID:0 /etc/nginx \
  && chmod -R g+w /etc/nginx

COPY build/harden.sh .
RUN chmod +x harden.sh && \
  sh -xe harden.sh && \
  rm harden.sh

EXPOSE 8080
USER $UID

CMD ["nginx", "-g", "daemon off;"]
