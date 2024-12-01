---
description: Statik dosyaları HTTP üzerinden sunmak için PM2 kullanarak basit bir yol sunulmaktadır. Hem CLI komutu ile hem de bir işlem dosyası aracılığıyla kolayca yapılandırabilirsiniz.
keywords: [PM2, statik dosya, HTTP, SPA, sunma]
---

# Statik dosyayı http üzerinden sunma

PM2, statik dosyaları `pm2 serve` özelliğiyle çok kolay bir şekilde sunabilir. Belirtilen bir klasörden ham dosyaları sunmayı destekler veya bununla bir SPA (Tek Sayfa Uygulaması) sunabilirsiniz.

:::tip
Statik dosyalarınızı sunmadan önce, hangi klasörü ve port numarasını kullanmak istediğinizi belirleyin.
:::

## CLI

Statik dosyalarınızı (bir ön uç uygulaması gibi) http üzerinden basit bir komutla sunun:

```bash
pm2 serve <path> <port>
```

`` belirtmezseniz mevcut klasör kullanılacaktır, port için varsayılan `8080`'dir. `--name` veya `--watch` gibi normal bir uygulama olarak aynı seçenekleri kullanabilirsiniz.

## İşlem dosyası

Bir işlem dosyasında özel bir dizinin sunulmasını isteyebilirsiniz, bunu yapmak için:

```javascript
module.exports = {
  script: "serve",
  env: {
    PM2_SERVE_PATH: '.',
    PM2_SERVE_PORT: 8080
  }
}
```

Sadece yolu ve portu belirtmek için `PM2_SERVE_PATH` ve `PM2_SERVE_PORT`'u çevresel değişkenlere eklemeniz yeterlidir, varsayılan değerler CLI ile aynıdır.

---

## SPA Sunumu: Tüm isteklere index.html'e yönlendirin

Tüm sorguları otomatik olarak index.html'e yönlendirmek için `--spa` seçeneğini kullanın:

```bash
pm2 serve --spa
```

Bir işlem dosyası vasıtasıyla:

```javascript
module.exports = {
  script: "serve",
  env: {
    PM2_SERVE_PATH: '.',
    PM2_SERVE_PORT: 8080,
    PM2_SERVE_SPA: 'true',
    PM2_SERVE_HOMEPAGE: './index.html'
  }
}
```

:::info
SPA sunumu yaparken, tüm istemci yönlendirmeleri için `index.html` dosyanızı kullanmalısınız.
:::

### Erişimi şifre ile koruma

Açık dosyalara erişimi temel koruma ile sağlamak için `--basic-auth-username` ve `--basic-auth-password` kullanabilirsiniz:

```bash
pm2 serve --basic-auth-username <username> --basic-auth-password <password>
```

Bir işlem dosyası vasıtasıyla:

```javascript
module.exports = {
  script: "serve",
  env: {
    PM2_SERVE_PATH: '.',
    PM2_SERVE_PORT: 8080,
    PM2_SERVE_BASIC_AUTH: 'true',
    PM2_SERVE_BASIC_AUTH_USERNAME: 'example-login',
    PM2_SERVE_BASIC_AUTH_PASSWORD: 'example-password'
  }
}
```

:::warning
Şifre koruma özelliklerini kullanırken, kullanıcı adı ve şifreyi güvenli bir şekilde sakladığınızdan emin olun.
:::