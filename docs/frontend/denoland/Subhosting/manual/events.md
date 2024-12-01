---
title: Dağıtım olayları
description: Bu belge, dağıtım sürecinde meydana gelen önemli olayları detaylandırmakta ve günlükler aracılığıyla izlenmelerini sağlamaktadır. Kullanıcılar, bu bilgilerle dağıtım süreçlerini daha iyi anlayabilirler.
keywords: [dağıtım, olaylar, günlükler, bellek limiti, CPU zamanı, Deno Deploy]
---

Dağıtım işlemi sırasında, birkaç olayın yürütme günlüklerine kaydedildiği bir yaşam döngüsü vardır. 
[dağıtım günlükleri API'si](https://apidocs.deno.com/#get-/deployments/-deploymentId-/app_logs) kullanılarak, bu olay günlükleri dağıtımlarınızın davranışını anlamak ve izlemek için kullanılabilir.

## Başlatma

```json
"isolate start time: 96.67 ms (user time: 6.13 ms)"
```

> `boot` olayı, dağıtım başarıyla başlatıldığında ve çalıştığında yayımlanır. Bu olay, dağıtımı başlatmaya teşvik eden ilk isteği aldığı andan itibaren geçen süreyi kaydeder; dağıtım, isteği karşılamak üzere hazır hale gelene kadar geçen zamanı. 
**Genel başlatma süresiyle birlikte**, olay aynı zamanda dağıtımın Javascript kodunu çalıştırmak için harcanan süreyi de (kullanıcı zamanı olarak adlandırılır) kaydeder.

---

## Bellek Limiti

```json
"Memory limit exceeded, terminated"
```

:::warning 
`memory-limit` olayı, dağıtımın [bellek limitini aştığında](https://deno.com/deploy/pricing?subhosting) sonlandırılması durumunda yayımlanır.
:::

Bazı durumlarda, bu olayı bir gözlemlenebilirlik belgesiyle karşılaştırmak için izleyen bir olay URN'si ile devam edebilir:

```json
"Memory limit exceeded, terminated (urn:dd-hard-memory-limit:deno:pcx8pcbpc34b:048730b1-0e1f-4df7-8f92-e64233415322)"
```

> Dağıtım sonlandırıldığında, uçuşta olan tüm talepler `"MEMORY_LIMIT"` koduyla 502 yanıtı alır.

---

## CPU Zamanı Limiti

```json
"CPU time limit exceeded, see https://deno.com/deploy/docs/pricing-and-limit (urn:dd-time-limit:deno:pcx8pcbpc34b:b8c729c0-e17a-4ce1-a6df-4267cbeb6d5c)"
```

:::info
`time-limit` olayı, dağıtımın [istek başına izin verilen CPU zamanı limitini aştığında](https://deno.com/deploy/pricing?subhosting) sonlandırılması durumunda yayımlanır. 
Günlükteki olayı referans almak için dahil edilen URN, sonuç olarak üretilen herhangi bir gözlemlenebilirlik belgesiyle karşılaştırılabilir.
:::

> Dağıtım sonlandırıldığında, uçuşta olan tüm talepler `"TIME_LIMIT"` koduyla 502 yanıtı alır.