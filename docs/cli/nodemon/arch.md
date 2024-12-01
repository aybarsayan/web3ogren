---
description: Bu belge, nodemon kod mimarisini ve CLI örneklerini kapsamlı bir şekilde açıklamaktadır. Kullanım örnekleri ve yapılandırma seçenekleri ile kullanıcıların nodemon ile etkin bir şekilde çalışmasını sağlar.
keywords: [nodemon, CLI, yapılandırma, izle, JavaScript]
---

# Nodemon Kod Mimarisi

```
CLI -> parser -> nodemon seçenekleri -> kurallar

kurallar -> yapılandır -> izle -> işlemi başlat
```

## CLI örnekleri

:::tip
**İpucu:** Nodemon'u yalnızca belirli dosya türlerini izlemek için yapılandırabilirsiniz.
:::

Sadece *.js ve *.coffee için src'i izle:

```
nodemon --watch src/ -e js,coffee app.js
```

Aşağıdaki şekilde ayrıştırıldı:

```
{
  watch: ['src/'],
  ignore: [],
  script: 'app.js'
  options: {
    extensions: ['js', 'coffee'],
    exec: 'node'
  }
}
```

> **Not:** Argüman olmadan nodemon kullanmanız durumunda, varsayılan ayarlar devreye girecektir.
> — Bu, tüm sağlanan alt dizinleri ve dosyaları izleyecek şekilde yapılandırılmıştır.

Argüman olmadan izle:

```
nodemon
```

Aşağıdaki şekilde ayrıştırıldı (varsayılarak bir package.json veya index.js bulunduğunda):

```
{
  watch: [], // yani tüm alt dizinler
  ignore: [],
  script: 'index.js',
  options: {
    extensions: ['js'],
    exec: 'node'
  }
}
```

:::info
**Bilgi:** Varsayılan olarak çalıştırma için `index.js` dosyasını kullanır. Başka bir dosya adı belirtmezseniz bu dosya üzerinden işlemler gerçekleştirilecektir.
:::