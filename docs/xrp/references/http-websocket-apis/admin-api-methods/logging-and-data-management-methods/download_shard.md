---
title: Download Shard
seoTitle: Download Shard Method Overview
sidebar_position: 4
description: Belirli bir defter geçmişi parçasını indirme sürecini ve talep biçimini açıklamaktadır. download_shard yöntemi ile parçaları indirmek ve içe aktarmak için gerekli bilgiler burada bulunmaktadır.
tags: 
  - download_shard
  - tarihsel defter
  - veri yönetimi
  - RPC
  - lz4 sıkıştırma
  - API
  - rippled
keywords: 
  - download_shard
  - tarihsel defter
  - veri yönetimi
  - RPC
  - lz4 sıkıştırma
  - API
  - rippled
---

## download_shard
[[Kaynak]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/DownloadShard.cpp "Kaynak")

Sunucuya, harici bir kaynaktan belirli bir `tarihsel defter verisi parçasını` indirmesi talimatını verir. Sunucunuzun `rippled`, `tarih parçalarını depolayacak şekilde yapılandırılmış` olmalıdır. badge href="https://github.com/XRPLF/rippled/releases/tag/1.6.0Güncellenme: rippled 1.6.0/badge %}

> _`download_shard` yöntemi, `yönetici yöntemi` olup yetkisi olmayan kullanıcılar tarafından çalıştırılamaz._  
— `Belgelendirme`

Harici kaynak, parçayı [lz4 sıkıştırılmış](https://lz4.github.io/lz4/) [tar arşivi](https://en.wikipedia.org/wiki/Tar_(computing)) olarak HTTPS üzerinden sunmalıdır. Arşiv, parça dizinini ve NuDB formatındaki veri dosyalarını içermelidir.

Bu yöntemi kullanarak parçaları indirmek ve içe aktarmak, genellikle parçaları eşler arası ağdan ayrı ayrı elde etmekten daha hızlıdır. Ayrıca bu yöntemi sunucunuzdan sağlanacak **belirli bir aralığı veya parça kümesini** seçmek için de kullanabilirsiniz.

---

### Talep Biçimi

Talep biçiminin bir örneği:



WebSocket
```json
{
  "command": "download_shard",
  "shards": [
    {"index": 1, "url": "https://example.com/1.tar.lz4"},
    {"index": 2, "url": "https://example.com/2.tar.lz4"},
    {"index": 5, "url": "https://example.com/5.tar.lz4"}
  ]
}
```


JSON-RPC
```json
{
  "method": "download_shard",
  "params": [
    {
      "shards": [
        {"index": 1, "url": "https://example.com/1.tar.lz4"},
        {"index": 2, "url": "https://example.com/2.tar.lz4"},
        {"index": 5, "url": "https://example.com/5.tar.lz4"}
      ]
    }
  ]
}
```


Komut Satırı
```sh
# Söz Dizimi: download_shard [[<index> <url>]]
rippled download_shard 1 https://example.com/1.tar.lz4 2 https://example.com/2.tar.lz4 5 https://example.com/5.tar.lz4
```




Talep aşağıdaki alanı içermektedir:

| `Alan`    | Tür    | Açıklama                                           |
|:-----------|:--------|:------------------------------------------------------|
| `shards`   | Dizi   | İndirilecek parçaları tanımlayan ve nereden indirileceğini belirten Parça Tanımcı nesnelerinin listesi. |

`validate` alanı kullanılmıyor ve gelecekteki bir sürümde kaldırılabilir. (Sunucu her zaman parçaları içe aktarırken bütünlüğünü kontrol eder.) badge href="https://github.com/XRPLF/rippled/releases/tag/1.6.0Güncellenme: rippled 1.6.0/badge %}

`shards` dizisindeki her **Parça Tanımcı nesnesinin** aşağıdaki alanları vardır:

| `Alan` | Tür   | Açıklama                                               |
|:--------|:-------|:----------------------------------------------------------|
| `index` | Numara | Alınacak parçanın dizini. Üretim XRP Defteri'nde, en eski parça 1 dizinine sahiptir ve 32750-32768 defterlerini içerir. Sonraki parça 2 dizinine sahiptir ve 32769-49152 defterlerini içerir, ve böyle devam eder. |
| `url`   | Dize | Bu parçanın indirilebileceği URL. URL `http://` veya `https://` ile başlamalı ve `.tar.lz4` ile bitmelidir (büyük/küçük harf duyarlı değildir). Bu indirmeyi sağlayan web sunucusu, güvenilir bir Sertifika Otoritesi (CA) tarafından imzalanmış geçerli bir TLS sertifikası kullanmalıdır. (`rippled` işletim sisteminin CA deposunu kullanır.) badge href="https://github.com/XRPLF/rippled/releases/tag/1.7.0Güncellenme: rippled 1.7.0/badge %} |

---

### Yanıt Biçimi

Başarılı bir yanıt örneği:



WebSocket
```json
{
  "result": {
    "message": "indirme parçaları 1-2,5"
  },
  "status": "success",
  "type": "response"
}
```


JSON-RPC
```json
200 OK

{
  "result": {
    "message": "indirme parçaları 1-2,5",
    "status": "success"
  }
}
```


Komut Satırı
```json
Yükleme: "/etc/rippled.cfg"
127.0.0.1:5005'e bağlanılıyor

{
  "result": {
    "message": "indirme parçaları 1-2,5",
    "status": "success"
  }
}
```




Yanıt, [standart biçimi][] takip eder ve başarılı bir sonuç aşağıdaki alanları içerir:

| `Alan`   | Tür   | Açıklama                                             |
|:----------|:-------|:--------------------------------------------------------|
| `message` | Dize | Bu talebe yanıt olarak gerçekleştirilen işlemleri açıklayan bir mesaj. |

admonition type="success" name="İpucuSunucunuzda hangi parçaların mevcut olduğunu görmek için, [crawl_shards yöntemi][]ni kullanın. Alternatif olarak, `rippled.cfg` dosyasındaki `[shard_db]`'nin `path` parametresini yapılandırdığınız konumda alt klasörlere bakarak kontrol edebilirsiniz. Klasörler parça numaraları ile eşleşecek şekilde adlandırılmıştır; bu klasörlerden biri `control.txt` dosyasını içerebilir ve bu durum parçada eksiklik olduğu anlamına gelebilir.:::

---

### Olası Hatalar

- Herhangi bir [evrensel hata türü][].
- `notEnabled` - Sunucu, bir parça deposu ile yapılandırılmış değil.
- `tooBusy` - Sunucu, ya eşler arası ağdan ya da önceki bir `download_shard` talebinin sonucu olarak parça indiriyor.
- `invalidParams` - Talep edilen bir veya birden fazla gerekli alan talep edilmemiştir veya sağlanan bir alan yanlış veri türü olarak belirtilmiştir.
- `reportingUnsupported` - ([Raporlama Modu][] sunucuları sadece) Bu yöntem Raporlama Modu'nda mevcut değildir.