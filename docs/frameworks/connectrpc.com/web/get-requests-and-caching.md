---
title: GET İstekleri ve Önbellekleme
seoTitle: HTTP GET Requests and Caching
sidebar_position: 12
description: Bu belge, Connect ile HTTP GET isteklerinin nasıl işleneceğini ve önbelleklemenin önemini açıklar. Ayrıca, kullanım örnekleri ve yapılandırma detayları sağlar.
tags: 
  - Connect
  - HTTP GET
  - Caching
  - Web Development
keywords: 
  - Connect
  - HTTP GET
  - Caching
  - Web Development
---
Connect, HTTP GET tabanlı bir protokol kullanarak idempotent, yan etkisiz istekler yapmayı destekler. Bu, belirli türdeki istekleri tarayıcıda, CDN'inizde veya proxy'lerde ve diğer orta kutularda önbelleğe almayı daha kolay hale getirir.

Öncelikle, sunucunuzu Connect kullanarak HTTP GET isteklerini işlemek için yapılandırın. Sunucunuza karşılık gelen belgeleri gözden geçirin:

* `Connect Go`
* `Connect Node`

:::info
`@connectrpc/connect-web`'in yeterince yeni bir sürümünün kurulu olduğundan emin olun; HTTP GET desteği Connect Web v0.9.0 veya daha yenisinde mevcuttur.
:::

Sonrasında, Connect taşınmasını oluştururken `useHttpGet` seçeneğini belirtebilirsiniz:

```js
const transport = createConnectTransport({
  baseUrl: "https://demo.connectrpc.com",
  useHttpGet: true,
});
const client = createClient(ElizaService, transport);
const response = await client.say(request);
console.log(response);
```

:::tip
Yan etki içermeyen olarak işaretlenmiş yöntemler GET isteklerini kullanacaktır. Diğer tüm istekler POST kullanmaya devam edecektir.
:::