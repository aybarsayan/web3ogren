---
title: Ters Proxy Arkasında
seoTitle: Ters Proxy Çözümü ile Socket.IO Dağıtımı
sidebar_position: 6
description: Socket.IO sunucusunu ters proxy çözümü arkasında dağıtmak için gerekli yapılandırmayı ve talimatları bulun. Aşağıda, nginx, Apache HTTPD, Node.js http-proxy ve Caddy 2 gibi popüler yöntemler yer almaktadır.
tags: 
  - Socket.IO
  - Ters Proxy
  - nginx
  - Apache
  - Node.js
  - Caddy
keywords: 
  - Socket.IO
  - Ters Proxy
  - nginx
  - Apache
  - Node.js
  - Caddy
---
Aşağıda, bir Socket.IO sunucusunu ters proxy çözümü arkasında dağıtmak için gereken yapılandırmayı bulacaksınız, örneğin:

- `nginx`
- `Apache HTTPD`
- `Node.js `http-proxy`
- `Caddy 2`

Birden fazla sunucu kurulumunda, lütfen belgeleri `buradan` kontrol edin.

## nginx

`/etc/nginx/nginx.conf` dosyasının içeriği:

```nginx
http {
  server {
    listen 80;

    location / {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;

      proxy_pass http://localhost:3000;

      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
    }
  }
}
```

İlgili:

- [proxy_pass belgeleri](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass)
- `birden fazla sunucu kurulumundaki yapılandırma`

:::caution
nginx'in [`proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) (varsayılan olarak 60 saniye) değeri, Socket.IO'nun `pingInterval + pingTimeout` değerinden (varsayılan olarak 45 saniye) büyük olmalıdır, aksi takdirde nginx bağlantıyı zorla kapatır ve istemci "taşıma kapandı" hatası alır.
:::

Eğer sadece Socket.IO isteklerini yönlendirmek istiyorsanız (örneğin nginx statik içeriği işlerken):

```
http {
  server {
    listen 80;
    root /var/www/html;

    location /socket.io/ {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;

      proxy_pass http://localhost:3000;

      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
    }
  }
}
```

Veya özel bir `yol` ile:

```
http {
  server {
    listen 80;
    root /var/www/html;

    location /my-custom-path/ {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;

      proxy_pass http://localhost:3000;

      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
    }
  }
}
```

Bu durumda, sunucu ve istemci uygun şekilde yapılandırılmalıdır:

*Sunucu*

```js
import { Server } from "socket.io";

const io = new Server({
  path: "/my-custom-path/"
});
```

*İstemci*

```js
import { io } from "socket.io-client";

const socket = io({
  path: "/my-custom-path/"
});
```

## Apache HTTPD

`/usr/local/apache2/conf/httpd.conf` dosyasının içeriği:

```apache
Listen 80

ServerName example.com

LoadModule mpm_event_module             modules/mod_mpm_event.so

LoadModule authn_file_module            modules/mod_authn_file.so
LoadModule authn_core_module            modules/mod_authn_core.so
LoadModule authz_host_module            modules/mod_authz_host.so
LoadModule authz_groupfile_module       modules/mod_authz_groupfile.so
LoadModule authz_user_module            modules/mod_authz_user.so
LoadModule authz_core_module            modules/mod_authz_core.so

LoadModule headers_module               modules/mod_headers.so
LoadModule lbmethod_byrequests_module   modules/mod_lbmethod_byrequests.so
LoadModule proxy_module                 modules/mod_proxy.so
LoadModule proxy_balancer_module        modules/mod_proxy_balancer.so
LoadModule proxy_http_module            modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module        modules/mod_proxy_wstunnel.so
LoadModule rewrite_module               modules/mod_rewrite.so
LoadModule slotmem_shm_module           modules/mod_slotmem_shm.so
LoadModule unixd_module                 modules/mod_unixd.so

User daemon
Group daemon

ProxyPass / http://localhost:3000/
RewriteEngine on
RewriteCond %{HTTP:Upgrade} websocket [NC]
RewriteCond %{HTTP:Connection} upgrade [NC]
RewriteRule ^/?(.*) "ws://localhost:3000/$1" [P,L]

## pingInterval (varsayılan olarak 25s) + pingTimeout (varsayılan olarak 20s) değerinden büyük olmalıdır
ProxyTimeout 60
```

İlgili:

- [mod_proxy_wstunnel belgeleri](https://httpd.apache.org/docs/2.4/en/mod/mod_proxy_wstunnel.html)
- `birden fazla sunucu kurulumundaki yapılandırma`

## Node.js `http-proxy`

Kurulum: `npm i http-proxy`

```js
const httpProxy = require("http-proxy");

httpProxy
  .createProxyServer({
    target: "http://localhost:3000",
    ws: true,
  })
  .listen(80);
```

[Belgeler](https://github.com/http-party/node-http-proxy#readme)

## Caddy 2

[Socket.IO isteklerini yalnızca yönlendirmek istiyorsanız](https://caddyserver.com/v2) için `Caddyfile` içeriği

```
example.com {
    reverse_proxy /socket.io/* localhost:3000
}
```

Veya özel bir yol isterseniz:

```
example.com {
  rewrite /path /path/
  handle_path /path/* {
    rewrite * /socket.io{path}
    reverse_proxy localhost:3000
  }
}
```

İlgili

- [Çözüm forum gönderisi](https://caddy.community/t/i-cant-get-socket-io-proxy-to-work-on-v2/8703/2)
- [Caddyfile ters proxy](https://caddyserver.com/docs/caddyfile/patterns#reverse-proxy)
- [Caddyfile direktifleri](https://caddyserver.com/docs/caddyfile/directives)