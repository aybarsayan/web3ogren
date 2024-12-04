---
title: GET İstekleri ve Önbellekleme
seoTitle: HTTP GET Requests and Caching
sidebar_position: 4
description: Connect protokolüyle HTTP tabanlı GET istekleri ve önbellekleme hakkında bilgi. Yan etkisiz isteklerin nasıl yönetileceğini öğrenin.
tags: 
  - Connect
  - HTTP
  - gRPC
  - GET Requests
  - Caching
keywords: 
  - Connect
  - HTTP
  - gRPC
  - GET Requests
  - Caching
---
Connect, HTTP tabanlı bir GET protokolü kullanarak belirteçler oluşturan, yan etkisiz istekler yapmayı destekler. Bu, belirli türdeki isteklerin tarayıcıda, CDN'nizde veya proxy'lerde ve diğer ara kutularda önbelleğe alınmasını kolaylaştırır.

:::info
Bu işlevsellik, **yalnızca** Connect protokolü kullanılınca desteklenir—bir Connect istemcisi ile bir Connect hizmeti kullanılır. Connect sunucularıyla gRPC istemcileri, ya da gRPC sunucularıyla Connect istemcileri kullanıldığında, tüm istekler HTTP POST kullanır.
:::

Sorgu tarzında istekler yapmak için istemciler kullanıyorsanız, Connect HTTP GET isteği desteğini kullanma yeteneğini istemek isteyebilirsiniz. Belirli bir prosedür için katılmak istiyorsanız, onu yan etki içermediği şeklinde işaretlemeniz gerekir; bunu [`MethodOptions.IdempotencyLevel`][idempotency-level] seçeneği ile yapabilirsiniz:

```protobuf
service ElizaService {
  rpc Say(SayRequest) returns (SayResponse) {
    option idempotency_level = NO_SIDE_EFFECTS;
  }
}
```

Bu seçeneği kullanarak GET isteklerini otomatik olarak destekleyecektir, ancak yeterince güncel bir Connect Go sürümüne sahip olduğunuzdan emin olun; v1.7.0 veya daha yeni bir sürüme ihtiyaç vardır. Ayrıca v1.7.0 veya daha yeni ile kod üretimini yeniden çalıştırmanız gerekecek.

İstemcinizde de HTTP GET'e katılmanız gerekmektedir. Eğer bir Go istemcisi kullanıyorsanız, Connect istemcisini oluştururken `WithHTTPGet` seçeneğini belirtmelisiniz.

```go
client := elizav1connect.NewElizaServiceClient(
	http.DefaultClient,
	connect.WithHTTPGet(),
)
```

Yan etkisiz olarak tanımlanan yöntemler GET isteklerini kullanır. Diğer tüm istekler POST kullanmaya devam edecektir.

Diğer istemciler için, ilgili belgelerine bakınız:

* `Connect Node`
* `Connect Web`
* `Connect Kotlin`