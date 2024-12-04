---
title: Birden Fazla Düğüm Kullanımı
seoTitle: Socket.IO ile Birden Fazla Düğüm Kullanımı
sidebar_position: 7
description: Birden fazla Socket.IO sunucusu dağıtırken dikkat edilmesi gereken stratejileri keşfedin. Yapışkan oturum ve yük dengeleme gibi konuları kapsar.
tags: 
  - Socket.IO
  - Düğüm Yönetimi
  - Yük Dengeleme
  - Uygulama Geliştirme
keywords: 
  - Socket.IO
  - Düğüm
  - Yapışkan Oturum
  - Yük Dengeleyici
  - Uygulama Geliştirme
---

Birden fazla Socket.IO sunucusu dağıtırken, dikkat etmeniz gereken iki şey vardır:

- HTTP uzun polling etkinse (bu varsayılandır) yapışkan oturumu etkinleştirmek için: `aşağıya` bakın
- uyumlu bir adaptör kullanmak için, `buraya` bakın

## Yapışkan yük dengeleme

Bağlantı yükünü farklı süreçler veya makineler arasında dağıtmayı planlıyorsanız, belirli bir oturum kimliği ile ilişkili tüm isteklerin bunları başlatan süreçte ulaşmasını sağlamalısınız.

### Neden yapışkan oturum gereklidir

> HTTP uzun polling taşınımının Socket.IO oturumunun süresi boyunca birden fazla HTTP isteği göndermesine neden olur.  
> — Socket.IO Dokümantasyonu

Aslında, Socket.IO teknik olarak yapışkan oturumlar olmadan çalışabilir, aşağıdaki senkronizasyon ile (kesikli hatlarla):

![](../../../images/frameworks/socket.io/static/images/mutiple-nodes-no-sticky.png)

Uygulamanız için bu senkronizasyon sürecinin büyük bir performans kaybına neden olacağını düşünüyoruz.

Notlar:

- yapışkan oturum etkinleştirilmeden, "Oturum Kimliği bilinmiyor" nedeniyle HTTP 400 hataları alırsınız
- WebSocket taşınımı bu sınırlamaya sahip değildir, çünkü tüm oturum için tek bir TCP bağlantısına dayanır. Yani HTTP uzun polling taşınımını devre dışı bırakırsanız (bu 2021'de tamamen geçerli bir seçimdir), yapışkan oturumlara ihtiyaç duymazsınız:

```js
const socket = io("https://io.yourhost.com", {
  // UYARI: bu durumda, uzun polling'e geri dönme yok
  transports: ["websocket"] // veya [ "websocket", "polling" ] (sıralama önemlidir)
});
```

Dokümantasyon: `transports`

### Yapışkan oturum etkinleştirme

Yapışkan oturum elde etmek için iki ana çözüm vardır:

- bir çereze dayanarak istemcileri yönlendirmek (tavsiye edilen çözüm)
- istemcileri kaynağına göre yönlendirmek

Aşağıda yaygın yük dengeleme çözümleri ile bazı örnekler bulacaksınız:

- `nginx` (IP tabanlı)
- `nginx Ingress (Kubernetes)` (IP tabanlı)
- `Apache HTTPD` (çerez tabanlı)
- `HAProxy` (çerez tabanlı)
- `Traefik` (çerez tabanlı)
- `Node.js `cluster` modülü`

Diğer platformlar için ilgili dokümantasyona başvurun:

- Kubernetes: https://kubernetes.github.io/ingress-nginx/examples/affinity/cookie/
- AWS (Uygulama Yük Dengeleyicileri): https://docs.aws.amazon.com/elasticloadbalancing/latest/application/sticky-sessions.html
- GCP: https://cloud.google.com/load-balancing/docs/backend-service#session_affinity
- Heroku: https://devcenter.heroku.com/articles/session-affinity

**Önemli not**: Eğer CORS durumundaysanız (ön alan sunucu alanından farklıdır) ve oturum yakınlığı bir çerez ile sağlanıyorsa, kimlik bilgilerine izin vermeniz gerekir:

*Sunucu*

```js
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "https://front-domain.com",
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

*İstemci*

```js
const io = require("socket.io-client");
const socket = io("https://server-domain.com", {
  withCredentials: true
});
```

Bunu yapmazsanız, çerez tarayıcı tarafından gönderilmeyecek ve HTTP 400 "Oturum Kimliği bilinmiyor" yanıtları alacaksınız. Daha fazla bilgi [burada](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials).

### nginx yapılandırması

`nginx.conf` dosyanızın `http { }` bölümünde, yük dengelemek istediğiniz Socket.IO süreçlerinin bir listesini içeren bir `upstream` bölümü belirleyebilirsiniz:

```nginx
http {
  server {
    listen 3000;
    server_name io.yourhost.com;

    location / {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;

      proxy_pass http://nodes;

      # WebSocket'leri etkinleştir
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
    }
  }

  upstream nodes {
    # yapışkan oturum etkinliği "hash" (tam IP adresini kullanır) ile etkinleştirilir
    hash $remote_addr consistent;
    # veya "ip_hash" (istemci IPv4 adresinin ilk üç oktetini kullanır, veya tam IPv6 adresi)
    # ip_hash;
    # veya "sticky" (ticari abonelik gerektirir)
    # sticky cookie srv_id expires=1h domain=.example.com path=/;

    server app01:3000;
    server app02:3000;
    server app03:3000;
  }
}
```

Bağlantıların yapışkan olacağını bildiren `hash` talimatını unutmayın.

Ayrıca, nginx'in kaç işçi kullanacağını belirtmek için en üst düzeyde `worker_processes`'i yapılandırdığınızdan emin olun. Ayrıca `events { }` bloğundaki `worker_connections` ayarını ayarlamak isteyebilirsiniz.

Bağlantılar:

- [Örnek](https://github.com/socketio/socket.io/tree/main/examples/cluster-nginx)
- [nginx Dokümantasyonu](http://nginx.org/en/docs/http/ngx_http_upstream_module.html#hash)

:::caution

nginx'in [`proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) değeri (varsayılan olarak 60 saniye), Socket.IO'nun `pingInterval + pingTimeout` (varsayılan olarak 45 saniye) değerinden büyük olmalıdır; aksi takdirde, nginx bağlantıyı zorla kapatır eğer belli bir gecikmeden sonra veri gönderilmezse ve istemci "taşıma kapalı" hatası alır.

:::

### nginx Ingress (Kubernetes)

Ingress yapılandırmanızın `annotations` bölümünde, istemcinin IP adresine dayanarak yukarı akış türü belirlemek için yukarı akış hashini belirtebilirsiniz, böylece Ingress kontrolörü her zaman belirli bir IP adresinden gelen istekleri aynı pod'a atar:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: your-ingress
  namespace: your-namespace
  annotations:
    nginx.ingress.kubernetes.io/configuration-snippet: |
      set $forwarded_client_ip "";
      if ($http_x_forwarded_for ~ "^([^,]+)") {
        set $forwarded_client_ip $1;
      }
      set $client_ip $remote_addr;
      if ($forwarded_client_ip != "") {
        set $client_ip $forwarded_client_ip;
      }
    nginx.ingress.kubernetes.io/upstream-hash-by: "$client_ip"
spec:
  ingressClassName: nginx
  rules:
    - host: io.yourhost.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: your-service
                port:
                  number: 80
```

Notlar:

- `nginx.ingress.kubernetes.io/upstream-hash-by: "$client_ip"`

Bu anotasyon, NGINX Ingress Kontrolörü'ne istemcinin IP adresini belirli bir Pod'a yönlendirme için kullanmasını talimatını verir. Bu, yapışkan oturumları korumak için kritik önem taşır.

- `nginx.ingress.kubernetes.io/configuration-snippet`

Bu özel NGINX yapılandırma kesiti iki amaca hizmet eder:

1. Eğer istek, `X-Forwarded-For` başlığını ekleyen üst akış ters proxy'leri veya API geçitlerinden geçerse, bu kesit, o başlıktan ilk IP adresini çıkarır ve bunu $client_ip'yi güncellemek için kullanır.

2. Bu tür proxy'ler veya geçitler yoksa kesit, doğrudan ingress ile bağlı istemcinin IP adresi olan remote_addr'ı kullanır.

Bu, yukarı akış hashini sağlayan `nginx.ingress.kubernetes.io/upstream-hash-by: "$client_ip"` anotasyonu ile yapılandırmalarınızda doğru istemci IP'sini kullanmanızı sağlar. Kesit, mimarinizin üst akış ağ bileşenlerini, ters proxy veya API geçitlerini içerdiği durumlarda özellikle önemlidir.

Bağlantılar:

- [Ingress Nginx Dokümantasyonu](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#custom-nginx-upstream-hashing)
- [X-Forwarded-For Başlığı](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For)

### Apache HTTPD yapılandırması

```apache
Header add Set-Cookie "SERVERID=sticky.%{BALANCER_WORKER_ROUTE}e; path=/" env=BALANCER_ROUTE_CHANGED

<Proxy "balancer://nodes_polling">
    BalancerMember "http://app01:3000" route=app01
    BalancerMember "http://app02:3000" route=app02
    BalancerMember "http://app03:3000" route=app03
    ProxySet stickysession=SERVERID
</Proxy>

<Proxy "balancer://nodes_ws">
    BalancerMember "ws://app01:3000" route=app01
    BalancerMember "ws://app02:3000" route=app02
    BalancerMember "ws://app03:3000" route=app03
    ProxySet stickysession=SERVERID
</Proxy>

RewriteEngine On
RewriteCond %{HTTP:Upgrade} =websocket [NC]
RewriteRule /(.*) balancer://nodes_ws/$1 [P,L]
RewriteCond %{HTTP:Upgrade} !=websocket [NC]
RewriteRule /(.*) balancer://nodes_polling/$1 [P,L]

## pingInterval (varsayılan 25s) + pingTimeout (varsayılan 20s) değerinden büyük olmalıdır
ProxyTimeout 60
```

Bağlantılar:

- [Örnek](https://github.com/socketio/socket.io/tree/main/examples/cluster-httpd)
- [Dokümantasyon](https://httpd.apache.org/docs/2.4/en/mod/mod_proxy.html#proxypass)

### HAProxy yapılandırması

```
# Referans: http://blog.haproxy.com/2012/11/07/websockets-load-balancing-with-haproxy/

listen chat
  bind *:80
  default_backend nodes

backend nodes
  option httpchk HEAD /health
  http-check expect status 200
  cookie io prefix indirect nocache # handshake sırasında ayarlanan `io` çerezini kullanarak
  server app01 app01:3000 check cookie app01
  server app02 app02:3000 check cookie app02
  server app03 app03:3000 check cookie app03
```

Bağlantılar:

- [Örnek](https://github.com/socketio/socket.io/tree/main/examples/cluster-haproxy)
- [Dokümantasyon](http://cbonte.github.io/haproxy-dconv/2.4/configuration.html#cookie)

### Traefik

Konteyner etiketleri kullanarak:

```yaml
# docker-compose.yml
services:
  traefik:
    image: traefik:2.4
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    links:
      - server

  server:
    image: my-image:latest
    labels:
      - "traefik.http.routers.my-service.rule=PathPrefix(`/`)"
      - traefik.http.services.my-service.loadBalancer.sticky.cookie.name=server_id
      - traefik.http.services.my-service.loadBalancer.sticky.cookie.httpOnly=true
```

[Dosya sağlayıcısı](https://doc.traefik.io/traefik/v2.0/providers/file/) ile:

```yaml
## Dinamik yapılandırma
http:
  services:
    my-service:
      rule: "PathPrefix(`/`)"
      loadBalancer:
        sticky:
          cookie:
            name: server_id
            httpOnly: true
```

Bağlantılar:

- [Örnek](https://github.com/socketio/socket.io/tree/main/examples/cluster-traefik)
- [Dokümantasyon](https://doc.traefik.io/traefik/v2.0/routing/services/#sticky-sessions)

### Node.js Cluster Kullanımı

tıpkı nginx gibi, Node.js, `cluster` modülü aracılığıyla yerleşik küme desteği ile gelir.

Kullanım durumunuza bağlı olarak birkaç çözüm vardır:

| NPM paketi | Nasıl çalışır |
|:------:| ------------ |
| [`@socket.io/sticky`](https://github.com/darrachequesne/socket.io-sticky) | yönlendirme `sid` sorgu parametresine dayanıyor |
| [`sticky-session`](https://github.com/indutny/sticky-session) | yönlendirme `connection.remoteAddress`'e dayanıyor |
| [`socketio-sticky-session`](https://github.com/wzrdtales/socket-io-sticky-session) | yönlendirme `x-forwarded-for` başlığına dayanıyor) |

`@socket.io/sticky` ile örnek:

```js
const cluster = require("cluster");
const http = require("http");
const { Server } = require("socket.io");
const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");

if (cluster.isMaster) {
  console.log(`Master ${process.pid} çalışıyor`);

  const httpServer = http.createServer();

  // yapışkan oturumları ayarla
  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection",
  });

  // işçiler arasındaki bağlantıları ayarla
  setupPrimary();

  // buffer içeren paketler için gerekli (yalnızca düz metin nesneleri gönderirseniz bunu göz ardı edebilirsiniz)
  // Node.js < 16.0.0
  cluster.setupMaster({
    serialization: "advanced",
  });
  // Node.js > 16.0.0
  // cluster.setupPrimary({
  //   serialization: "advanced",
  // });

  httpServer.listen(3000);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`İşçi ${worker.process.pid} öldü`);
    cluster.fork();
  });
} else {
  console.log(`İşçi ${process.pid} başladı`);

  const httpServer = http.createServer();
  const io = new Server(httpServer);

  // küme adaptörünü kullan
  io.adapter(createAdapter());

  // ana süreçle bağlantıyı kur
  setupWorker(io);

  io.on("connection", (socket) => {
    /* ... */
  });
}
```

## Düğümler arasında olay geçişi

Artık birden fazla Socket.IO düğümünüz var ve bağlantıları kabul ediyorsanız, tüm istemcilere (veya belirli bir `oda` içindeki istemcilere) olayları yaymak istiyorsanız, işlemler veya bilgisayarlar arasında mesajları iletmenin bir yolunu bulmanız gerekecek.

Mesajları yönlendirmekle sorumlu arayüze `Adaptör` diyoruz.