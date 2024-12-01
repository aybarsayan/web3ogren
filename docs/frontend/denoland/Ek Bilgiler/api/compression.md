---
title: "Yanıt gövdesini sıkıştırma"
description: Yanıt gövdesi sıkıştırması, bant genişliğinden tasarruf edilmesine yardımcı olur ve Deploy platformumuzda bu yetenekleri entegre ettik. Brotli ve gzip gibi algoritmalarla, performansınızı artırarak verileri daha hızlı sunabilirsiniz.
keywords: [sıkıştırma, Deno Deploy, brotli, gzip, bant genişliği, web performansı]
---

Yanıt gövdesini sıkıştırarak bant genişliğinden tasarruf etmek yaygın bir uygulamadır. Sizden bazı işleri almak için, bu yetenekleri doğrudan Deploy'a entegre ettik.

Deno Deploy, **brotli** ve **gzip** sıkıştırmasını destekler. Sıkıştırma, aşağıdaki koşullar sağlandığında uygulanır:

1. Dağıtımınıza yapılan istekte [`Accept-Encoding`][accept-encoding] başlığı `br` (brotli) veya `gzip` olarak ayarlanmış olmalıdır.
2. Dağıtımınızdan gelen yanıt [`Content-Type`][content-type] başlığı içermelidir.
3. Sağlanan içerik türü sıkıştırılabilir olmalıdır; sıkıştırılabilir olup olmadığını belirlemek için [bu veritabanını](https://github.com/jshttp/mime-db/blob/master/db.json) kullanıyoruz.
4. Yanıt gövde boyutu **20 bayttan** büyük olmalıdır.

Deploy yanıt gövdesini sıkıştırdığında, kullanılan sıkıştırma algoritmasına bağlı olarak yanıtın `Content-Encoding: gzip` veya `Content-Encoding: br` başlığını ayarlayacaktır.

:::tip
Sıkıştırma, özellikle büyük yanıtlar için bant genişliğinden tasarruf sağlamanın etkili bir yoludur. Uygulamalarınızda bu özelliği devreye almayı göz önünde bulundurun.
:::

### Sıkıştırma ne zaman atlanır?

Deno Deploy, sıkıştırmayı aşağıdaki durumlarda geçersiz kılar:

- Yanıtın [`Content-Encoding`][content-encoding] başlığı varsa.
- Yanıtın [`Content-Range`][content-range] başlığı varsa.
- Yanıtın [`Cache-Control`][cache-control] başlığında [`no-transform`][no-transform] değeri varsa (örneğin, `cache-control: public, no-transform`).

### `Etag` başlığıma ne olur?

Bir yanıtla birlikte bir Etag başlığı ayarladığınızda, yanıt gövdesine sıkıştırma uygularsak başlık değerini Zayıf Etag'a dönüştürüyoruz. Eğer zaten bir Zayıf Etag ise, başlığa dokunmuyoruz.

> "Yanıt gövdesini sıkıştırarak bant genişliği tasarrufu sağlamak, web uygulamalarının performansını artırmanın etkili bir yoludur."  
> — Deno Deploy

[accept-encoding]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
[cache-control]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
[content-encoding]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
[content-type]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
[no-transform]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#other
[content-range]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range