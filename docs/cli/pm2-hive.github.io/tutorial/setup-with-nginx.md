---
description: Nginx ile üretim kurulumu, NGINX'in PM2'nin önünde nasıl bir HTTP proxy olarak kullanılacağını açıklamaktadır. Bu rehber, NGINX ile Node.js uygulamanıza daha güvenli ve hızlı bir erişim sağlamanızı kolaylaştıracaktır.
keywords: [Nginx, PM2, HTTP proxy, Node.js, SSL, WebSocket, üretim kurulumu]
---

# Nginx bir HTTP proxy olarak

Bu, NGINX'i PM2'nin önünde bir HTTP proxy olarak kullanmanın yaygın bir yöntemidir. NGINX, statik dosyaları hızlı bir şekilde sunmanıza, SSL protokolünü yönetmenize ve trafiği Node.js uygulamanıza yönlendirmenize olanak tanır.

:::tip
NGINX ile Node.js uygulamanız arasında performansı artırmak için **HTTP proxy** kullanımı önerilir.
:::

İşte 3001 numaralı portta dinleyen bir Node.js uygulaması için ve NGINX'in trafiği 443 numaralı porttan (HTTPS) 3001'e yönlendirdiği bir örnek. Bu örnek ayrıca Websocket bağlantılarını da yönetecektir.

nginx.conf:

```
upstream my_nodejs_upstream {
    server 127.0.0.1:3001;
    keepalive 64;
}

server {
    listen 443 ssl;
    
    server_name www.my-website.com;
    ssl_certificate_key /etc/ssl/main.key;
    ssl_certificate     /etc/ssl/main.crt;
   
    location / {
    	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    	proxy_set_header Host $http_host;
        
    	proxy_http_version 1.1;
    	proxy_set_header Upgrade $http_upgrade;
    	proxy_set_header Connection "upgrade";
        
    	proxy_pass http://my_nodejs_upstream/;
    	proxy_redirect off;
    	proxy_read_timeout 240s;
    }
}
```

:::info
Bu seçenekler hakkında daha fazla bilgi için [Nginx belgelerine](http://nginx.org/en/docs/http/websocket.html) göz atın!
:::

Bunu yaptıktan sonra, tek ihtiyacınız olan 3001 portunda çalışan bir PM2 bağlı Node.js sunucusu olacak ve üretime hazır bir HTTP sunucusuna sahip olacaksınız!

:::note
**Not:** Uygulamanızın güvenliğini artırmak için SSL kullanmanız önemlidir. 
:::