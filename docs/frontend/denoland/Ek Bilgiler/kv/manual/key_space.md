---
title: "Anahtar Alanı"
description: Deno KV, bir anahtar-değer deposu olup anahtar alanı, anahtar+değer+sürüm damgası çiftlerinden oluşur. Anahtarların nasıl belirlendiği ve kullanıldığı ile birlikte, değerlerin çeşitliliği ve sürüm damgalarının işlevselliği hakkında bilgiler sunar.
keywords: [Deno KV, anahtar-değer, sürüm damgası, JavaScript, anahtar yapısı]
---



Deno KV, bir anahtar-değer deposudur. Anahtar alanı, düz bir ad alanıdır ve
anahtar+değer+sürüm damgası çiftlerinden oluşur. Anahtarlar, hiyerarşik verinin
modellenmesine olanak tanıyan anahtar parçalarının dizileridir. Değerler, keyfi
JavaScript nesneleridir. Sürüm damgaları, bir değerin ne zaman eklendiğini veya
değiştirildiğini temsil eder.

## Anahtarlar

Deno KV'deki anahtarlar, `string`, `number`, `boolean`, `Uint8Array` veya 
`bigint` gibi anahtar parçalarının dizileridir.

:::tip
Bir diziyi parçalar olarak kullanmak, tek bir dize yerine, ayırıcı enjeksiyon
saldırısı olasılığını ortadan kaldırır, çünkü görünür bir ayırıcı yoktur.
:::

> Bir anahtar enjeksiyon saldırısı, bir saldırganın
> anahtar-değer deposunun yapısını, anahtar kodlama şemasında kullanılan
> ayırıcıları kullanıcının kontrol ettiği bir değişkene enjekte ederek
> manipüle etmesi durumudur ve bu da istenmeyen davranışa veya yetkisiz
> erişime yol açar. Örneğin, bir slash (/) ayırıcı kullanan bir anahtar-değer
> deposunu düşünün; "users/alice/settings" ve "users/bob/settings" gibi
> anahtarları vardır. Bir saldırgan, "alice/settings/hacked" adıyla yeni bir
> kullanıcı oluşturup "users/alice/settings/hacked/settings" anahtarını
> oluşturabilir ve böylece ayırıcıyı enjekte ederek anahtar yapısını
> manipüle edebilir. Deno KV'de, enjeksiyon, `["users", "alice/settings/hacked", "settings"]` anahtarına yol açar ki bu zararlı değildir.

Anahtar parçalarını ayırmak için görünmez ayırıcılar kullanılır. Bu ayırıcılar
asla görünmez, ancak bir parçanın başka bir parçayla karıştırılmadığından emin olurlar.
Örneğin, `["abc", "def"]`, `["ab", "cdef"]`, `["abc", "", "def"]` anahtarları
tamamen farklıdır.

Anahtarlar büyük/küçük harf duyarlıdır ve parçalarına göre leksikografik olarak
sıralanır. İlk parça en önemli, son parça ise en az önemli olandır.
Parçaların sıralaması, hem türü hem de parçanın değeriyle belirlenir.

### Anahtar Parça Sıralaması

Anahtar parçaları türlerine göre leksikografik olarak sıralanır ve belirli bir tür
içinde, değerlerine göre sıralanırlar. Türlerin sıralaması şu şekildedir:

1. `Uint8Array`
1. `string`
1. `number`
1. `bigint`
1. `boolean`

Belirli bir tür içinde sıralama şöyledir:

- `Uint8Array`: dizinin byte sıralaması
- `string`: dizenin UTF-8 kodlamasının byte sıralaması
- `number`: -Infinity  versionstampB;
"000002fa526aaccb0000" > "000002fa526aacc90000"; // doğru
```

Tek bir işlemle değiştirilen tüm verilere aynı sürüm damgası atanır.
Bu, aynı atomik işlem içinde iki `set` işlemi gerçekleştirildiğinde, yeni
değerlerin sürüm damgasının aynı olacağı anlamına gelir.

:::warning
Sürüm damgaları, iyimser eşzamanlılık kontrolünü uygulamak için kullanılır. Atomik
işlemler, üzerinde işlem yaptıkları verinin sürüm damgasının, işleme iletilen bir
sürüm damgasıyla eşleşip eşleşmediğini kontrol eden kontroller içerebilir. Eğer
verinin sürüm damgası, işleme iletilen sürüm damgasıyla aynı değilse, işlem başarısız olur
ve işlem uygulanmaz.
:::

[structured clone algorithm]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm