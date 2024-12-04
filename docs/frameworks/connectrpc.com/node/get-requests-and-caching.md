---
title: GET İstekleri ve Önbellekleme
seoTitle: GET Requests and Caching
sidebar_position: 6
description: Bu belge, HTTP GET isteklerinin nasıl kullanılacağını ve önbelleğe almanın önemini açıklamaktadır. Ayrıca, isteklerin yan etkisiz olarak işaretlenmesi ve başlıkların ayarlanması hakkında bilgi sunmaktadır.
tags: 
  - HTTP
  - GET İstekleri
  - Önbellekleme
  - Connect
keywords: 
  - HTTP
  - GET Requests
  - Caching
  - Connect
---
Connect, idempotent, yan etkisiz isteklerin HTTP GET tabanlı protokol kullanarak yapılmasını destekler. Bu, belirli türdeki isteklerin tarayıcıda, CDN'inizde veya proxy'lerde ve diğer ara kutularda önbelleğe alınmasını kolaylaştırır.

:::info
Bu işlevsellik, **yalnızca** Connect protokolü kullanıldığında desteklenmektedir—yani Connect istemcisi ile bir Connect servisi kullanırken. Connect sunucuları ile gRPC istemcileri veya gRPC sunucuları ile Connect istemcileri kullanıldığında, tüm istekler HTTP POST kullanacaktır.
:::

Vanilla gRPC sunucusu ile iletişim kurarken HTTP GET desteğine ihtiyacınız varsa, bir proxy kullanabilirsiniz. Envoy, Connect istemcileri ile gRPC sunucuları arasında çeviri yapmayı destekler; bu, [Connect-gRPC Bridge][connect-grpc-bridge-docs] kullanılarak yapılabilir.

Eğer istemcilerinizi sorgu tarzı istekler yapmak için kullanıyorsanız, Connect HTTP GET isteği desteğini kullanma yeteneğine sahip olmak isteyebilirsiniz. Verilen bir prosedürü kabul etmek için, bunu yan etkisiz olarak işaretlemeniz gerekir; bunu, [`MethodOptions.IdempotencyLevel`][idempotency-level] seçeneği kullanarak yapmalısınız:

```protobuf
service ElizaService {
  rpc Say(stream SayRequest) returns (SayResponse) {
    option idempotency_level = NO_SIDE_EFFECTS;
  }
}
```

İşleyiciler, bu seçeneği kullanarak GET isteklerini otomatik olarak destekler, ancak Connect Node’unuzun yeterince güncel bir sürümüne sahip olduğunuzdan emin olun; v0.9.0 veya daha yeni bir sürüm gereklidir.

Ayrıca, istemcinizde HTTP GET'i kabul etmeniz de gereklidir. Eğer bir Node istemcisi kullanıyorsanız, Connect taşıyıcısını oluştururken `useHttpGet` seçeneğini belirtmeniz gerekir:

```js
const transport = createConnectTransport({
  baseUrl: "https://demo.connectrpc.com",
  useHttpGet: true,
});
const client = createClient(ElizaService, transport);
const response = await client.say(request);
console.log(response);
```

Yan etkisiz olarak işaretlenen yöntemler GET isteklerini kullanacaktır. Diğer tüm istekler POST kullanmaya devam edecektir.

Diğer istemciler için, ilgili dökümantasyon sayfalarına bakın:

* `Connect Go`
* `Connect Web`
* `Connect Kotlin`

## Önbellekleme

GET isteklerini kullanmak, tarayıcıların veya proxy'lerin RPC'lerinizi otomatik olarak önbelleğe alacağı anlamına gelmez. İsteklerin önbelleğe alınmasına izin vermek için, bir işleyici de uygun başlıkları ayarlamalıdır.

Örneğin, `max-age` direktifi ile `Cache-Control` başlığını ayarlamak isteyebilirsiniz:

```js
say(request, context) {
  // ...
  context.responseHeader.set("Cache-Control", "max-age=604800");
}
```

Bu, ajanlara ve proxy'lere isteğin 7 güne kadar önbelleğe alınabileceğini belirtir; bu süre dolduktan sonra yeniden istenmesi gerekmektedir. Uygulamanız için faydalı olabilecek diğer [`Cache-Control` Yanıt Direktifleri][cache-control-response-directives] de vardır; örneğin, `private` direktifi, isteğin yalnızca özel önbelleklerde, yani kullanıcı aracında önbelleğe alınmasını belirtecek, CDNi veya ters proxy'leri kapsamamaktadır—bu, örneğin, kimlik doğrulama gerektiren istekler için uygun olacaktır.

## GET İsteklerini Ayırt Etme

Bazı durumlarda, yalnızca HTTP GET isteklerini işlerken gerçekleşen bir davranış tanıtmak isteyebilirsiniz. Bu, `context.requestMethod` kullanılarak gerçekleştirilebilir:

```ts
if (context.requestMethod == "GET") {
  context.responseHeader.set("Cache-Control", "max-age=604800");
}
```

[connect-grpc-bridge-docs]: https://www.envoyproxy.io/docs/envoy/v1.26.0/configuration/http/http_filters/connect_grpc_bridge_filter#config-http-filters-connect-grpc-bridge
[idempotency-level]: https://github.com/protocolbuffers/protobuf/blob/e5679c01e8f47e8a5e7172444676bda1c2ada875/src/google/protobuf/descriptor.proto#L795
[cache-control-response-directives]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#response_directives