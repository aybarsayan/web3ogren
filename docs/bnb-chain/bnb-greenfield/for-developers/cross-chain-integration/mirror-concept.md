---
title: Kaynak Aynalama - BNB Greenfield Çapraz Zincir
description: Bu makale, BNB Greenfield üzerinde kaynak aynalama sürecini ve nesnelerin EVM uyumlu zincirlerde nasıl yönetildiğini açıklamaktadır. Aynalama ile BNB Greenfield ve BSC arasındaki veri erişimi ve manipülasyon esnekliği artmaktadır.
keywords: [Kaynak Aynalama, BNB Greenfield, BSC, EVM, NFT, Çapraz Zincir, Veri Yönetimi]
---

# Kaynak Aynalama

## Genel Bakış

Greenfield Blockchain, EVM uyumlu zincirlerde (örn. BSC, opBNB) ERC-721 NFT'leri olarak aynalanabilen kovalar, nesneler ve gruplar gibi kaynaklar sunar.

Kovalar, meta veriye sahip veri dosyaları olan nesneler için konteyner görevi görürken, gruplar paylaşılan izinlere sahip hesap setleridir. Ayrıca, grup üyelerinin izinleri ERC-1155 jetonları olarak da aynalanabilir. Şu anda, bu NFT'ler devredilemez, devredilebilirlik için planlar yapılmaktadır.

:::info
EVM zincirlerindeki aynalanmış kaynaklar, verilerin depolama formatını ve erişim izinlerini etkileyen akıllı sözleşmeler aracılığıyla yönetilebilir.
:::

EVM zincirlerindeki değişiklikler, Greenfield üzerinde yansır ve veri erişimini ve manipülasyon esnekliğini artırır. Bu entegrasyon, daha verimli bir veri yönetim sürecini destekler.

## Nasıl Aynalanır

BNB Greenfield'den BSC'ye nesnelerin aynalanması, kaynağın oluşturulmasıyla otomatik olarak yapılmaz. Kullanıcıların, seçilen nesneler için aynalama sürecini manuel olarak başlatmaları gerekir; bu, kova veya nesne düzeyinde ya da grup düzeyinde olabilir, çünkü işlem gazı gerektirir. Bu, kullanıcıların hangi nesnelerin aynalandığını kontrol etmelerine ve bununla birlikte ilişkili maliyetlerin farkında olmalarına olanak tanır.

- `CLI ile Kaynak Aynalama`
- [SDK ile Kaynak Aynalama](https://github.com/bnb-chain/greenfield-go-sdk/blob/master/examples/crosschain.go)

BSC'deki aynalanmış nesnelerde yapılan değişiklikler, ilgili işlemler her iki blockchain üzerinde tamamlandığında BNB Greenfield'a iletilir. BSC'nin blok sonluluğu 3 saniye, BNB Greenfield'ın blok sonluluğu ise 2 saniyedir. Sonuç olarak, değişiklikler en fazla 3 saniyelik blok sonluluğu içinde yansıtılmalıdır ki bu, iki blok sonluluk süresinin daha uzun olanıdır.

:::tip
Bir nesne BNB Greenfield'den BSC'ye aynalandıktan sonra yalnızca BSC'de yönetilebilir ve Greenfield'de yönetim için geri alınamaz veya "ayırtılamaz".
:::

Ancak, "ayırtma" yeteneğinin gelecekteki sürümlerde Greenfield'a geri aynalanmış nesneleri yönetme seçeneği sunulabileceği dikkate değerdir.

## Aynalama ile Neler Elde Edilebilir

![](../../../images/bnb-chain/bnb-greenfield/static/asset/resource-mirroring-example.jpg)

Şu anda, nesnenin özellikleri, izinleri ve diğer ilgili özellikleri hakkında bilgi de dahil olmak üzere herhangi bir meta veri özniteliğini değiştirmek mümkün. Örneğin, BNB Greenfield'de bir nesnenin izinlerini değiştirmek için kullanıcı, BSC'de bir zincir içi işlem gerçekleştirebilir. Bu işlem, izin değişikliklerini belirterek, BSC'den Greenfield'a relayerler aracılığıyla bir mesaj gönderir. 

> Mesaj alındığında, Greenfield istenen şekilde nesnenin meta verisini günceller.  
> — Kaynak Aynalama Süreci

BNB Greenfield'den BSC'ye aynalama sürecinde, dosyanın içeriği kopyalanmaz. Bu, ne verinin ne de BNB Greenfield blockchain'inde depolanan dosya meta verisinin BSC'ye aktarılmadığı anlamına gelir. 

:::warning
Sonuç olarak, aynalama sürecinde gerçek dosya içeriği kopyalanmadığı için herhangi bir boyut limiti yoktur. 
:::

Aynalama sürecinde kaynağın sahipliği de değişir.