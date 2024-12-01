---
title: "Deno Deploy'da KV"
description: Deno Deploy, yerleşik bir sunucusuz anahtar-değer veritabanı olan Deno KV'yi sunmaktadır. Bu dökümana genel bir bakış ve Deno KV'nin sağladığı tutarlılık özellikleri hakkında bilgi sunulmaktadır.
keywords: [Deno, Deno KV, sunucusuz veritabanı, tutarlılık, dağıtılmış kuyruklar]
---



Deno Deploy artık yerleşik bir sunucusuz anahtar-değer veritabanı olan Deno KV sunmaktadır.

Ayrıca, Deno KV, Deno'nun kendisi içerisinde SQLite'ı arka uç olarak kullanarak mevcuttur. Bu özellik, `--unstable` bayrağı ile Deno v1.32'den beri erişilebilir durumdadır. Daha fazla bilgi için `Deno KV` sayfasını ziyaret edin.

## Tutarlılık

Deno KV, varsayılan olarak güçlü bir tutarlılık sağlayan bir veritabanıdır. _Dışsal tutarlılık_ adı verilen en sıkı güçlü tutarlılık biçimini sunar ve bu, şunu ifade eder:

- **Serileştirilebilirlik**: Bu, işlemler için en yüksek izolasyon seviyesidir. Birden fazla işlemin eşzamanlı yürütülmesinin, işlemlerin ardışık olarak birer birer yürütüldüğü bir sistem durumuna sonuçlanmasını garanti eder. Diğer bir deyişle, serileştirilebilir işlemlerin nihai sonucu, bu işlemlerin bir ardışık sırasına eşdeğerdir.
- **Lineerleşebilirlik**: Bu tutarlılık modeli, okuma ve yazma gibi işlemlerin anında gerçekleştiğini ve gerçek zamanlı olarak gerçekleştiğini garanti eder. Bir yazma işlemi tamamlandığında, tüm sonraki okuma işlemleri hemen güncellenmiş değeri döndürecektir. Lineerleşebilirlik, işlemlerin güçlü bir gerçek zamanlı sıralamasını sağlar ve sistemi daha öngörülebilir ve anlaması daha kolay hale getirir.

:::tip
Bireysel okuma işlemlerinde `consistency: "eventual"` seçeneğini ayarlayarak tutarlılık kısıtlamalarını gevşetmeyi seçebilirsiniz.
:::

Bu arada, bireysel okuma işlemlerinde `consistency: "eventual"` seçeneğini ayarlayarak tutarlılık kısıtlamalarını gevşetmeyi seçebilirsiniz. Bu seçenek, sistemin okuma işlemini küresel yedeklerden ve önbelleklerden en az gecikme ile hizmet etmesine olanak tanır.

Aşağıda, en yüksek bölgelerimizde gözlemlenen gecikme rakamları yer almaktadır:

| Bölge                     | Gecikme (Sonradan Tutarlılık) | Gecikme (Güçlü Tutarlılık) |
| -------------------------- | ------------------------------ | ---------------------------- |
| Kuzey Virginia (us-east4)  | 7ms                            | 7ms                          |
| Frankfurt (europe-west3)   | 7ms                            | 94ms                         |
| Hollanda (europe-west4)    | 13ms                           | 95ms                         |
| Kaliforniya (us-west2)      | 72ms                           | 72ms                         |
| Hong Kong (asia-east2)     | 42ms                           | 194ms                        |

## Dağıtılmış Kuyruklar

Sunucusuz dağıtılmış kuyruklar Deno Deploy'da mevcuttur. Daha fazla ayrıntı için
`Deno Deploy'da Kuyruklar` sayfasını inceleyin.

## Deno Deploy dışındaki yönetilen veritabanlarına bağlanma

Deno Deploy KV veritabanınıza Deno Deploy dışındaki Deno uygulamanızdan bağlanabilirsiniz. Yönetilen bir veritabanını açmak için, `DENO_KV_ACCESS_TOKEN` ortam değişkenini bir Deno Deploy kişisel erişim belirtecine ayarlayın ve veritabanının URL'sini `Deno.openKv`'ye sağlayın:

```ts
const kv = await Deno.openKv(
  "https://api.deno.com/databases/<database-id>/connect",
);
```

:::info
Uzaktaki bir KV veritabanına bağlanma protokolü için lütfen [belgeleri](https://github.com/denoland/deno/tree/main/ext/kv#kv-connect) kontrol edin.
:::

## Veri dağıtımı

Deno KV veritabanları, en az 3 bölgeyi (ABD, Avrupa ve Asya) kapsayan en az 6 veri merkezine çoğaltılır. Bir yazma işlemi onaylandığında, değişiklikler, birincil bölgede en az iki veri merkezinde kalıcı olarak saklanır. Asenkron çoğaltma genellikle bu değişiklikleri diğer iki bölgeye 10 saniyenin altında aktarır.

Sistem, çoğu veri merkezi düzeyindeki arızaları, kesinti veya veri kaybı yaşamadan tolere edecek şekilde tasarlanmıştır. Kurtarma Noktası Hedefleri (RPO) ve Kurtarma Süresi Hedefleri (RTO), sistemin çeşitli arıza modları altındaki dayanıklılığını nicelendirir. RPO, zamanla ölçülen en fazla kabul edilebilir veri kaybı miktarını temsil ederken; RTO, bir arızadan sonra sistemi normal çalışmalara döndürmek için gereken en fazla kabul edilebilir süreyi ifade eder.

- **Birincil bölgede bir veri merkezinin kaybı**: RPO=0 (veri kaybı yok), RTO<5s (sistem 5 saniyeden kısa sürede geri yüklenir)
- **Bir yedek bölgede herhangi bir veri merkezinin kaybı**: RPO=0, RTO<5s
- **Birincil bölgede iki veya daha fazla veri merkezinin kaybı**: RPO<60s (60 saniyeden az veri kaybı)

``` 
