---
title: "Fiyatlandırma ve sınırlamalar"
description: Fiyatlandırma ve sınırlamalar sayfası, Deno Deploy hizmetinin kullanım koşullarını açıklamaktadır. Kullanıcıların dikkat etmesi gereken limitler ve TLS bağlantı kuralları hakkında bilgi sunulmaktadır.
keywords: [fiyatlandırma, sınırlamalar, TLS, Deno Deploy, kabul edilebilir kullanım]
---

Lütfen [fiyatlandırma sayfamıza](https://www.deno.com/deploy/pricing) bakın tüm planlardaki mevcut özelliklerin genel görünümü için. Eğer bu limitlerin herhangi birini aşan bir kullanım durumunuz varsa, `lütfen iletişime geçin`.

:::info
Deno Deploy için ilk genel beta sürecinde uptime garantileri sağlanmamaktadır. 
:::

Hizmete erişim, `kabul edilebilir kullanım politikamız` tarafından kontrol edilecektir. Bu politikayı ihlal ettiğimizi düşündüğümüz herhangi bir kullanıcı, hesabının askıya alınma riskiyle karşı karşıya kalacaktır.

## Dağıtım için maksimum boyut

Bir dağıtıma varlık yüklerken, dağıtım içindeki tüm dosyaların toplam boyutu 
(kaynak dosyaları ve statik dosyalar) **1 gigabaytı geçmemelidir**.

## TLS proxyleme

HTTPS için kullanılan 443 numaralı porta dışa bağlantılar için TLS sonlandırması gereklidir. Bu portlara bağlanmak için [Deno.connect](https://docs.deno.com/api/deno/~/Deno.connect) kullanmak yasaktır. *443 numaralı porta bir TLS bağlantısı kurmanız gerekiyorsa, lütfen bunun yerine [Deno.connectTls](https://docs.deno.com/api/deno/~/Deno.connectTls) kullanın.* `fetch` bu kısıtlamadan etkilenmez.

:::warning
Bu kısıtlama, TLS sonlandırması olmadan 443 numaralı portlara bağlanmanın genellikle TLS-over-TLS proxy'lerinde kullanılması nedeniyle getirilmiştir. 
:::

:::danger
Bu tür proxy'ler Deno Deploy üzerinde `kabul edilebilir kullanım politikamız` gereğince yasaktır.
:::