---
title: XRP Ledger Nedir?
seoTitle: XRP Ledger Hakkında Bilgiler
sidebar_position: 1
description: XRP Ledger, merkeziyetsiz bir blok zinciri olup, mali işlemleri hızlı ve güvenilir bir şekilde kaydeder. Blok zinciri yapısı sayesinde veriler değiştirilemez ve geriye dönük olarak izlenebilir.
tags: 
  - XRP Ledger
  - blok zinciri
  - merkeziyetsiz
  - rippled
  - konsensüs
keywords: 
  - XRP Ledger
  - blok zinciri
  - merkeziyetsiz
  - rippled
  - konsensüs
---

## XRP Ledger Nedir?

XRP Ledger, mali işlemleri işlemek ve kaydetmek için kendi dijital para birimini kullanan merkeziyetsiz bir blok zinciridir.

## Blok Zinciri Nedir?

Blok zinciri, sürekli olarak büyüyen bir kayıtlar listesidir. Blok zinciri, bir veri bloğu ile başlar.



Güvenilir doğrulayıcı düğümlerin bir grubu, verilerin geçerli olduğu konusunda mutabakata varır.


> Blok, **64 hexadesimal karakter** uzunluğunda, çok karmaşık ve bilgisayar tarafından üretilmiş, kriptografik bir Hash numarası ile benzersiz bir şekilde tanımlanır.  
> — XRP Ledger Belgeleri


Blok ayrıca, yaratılış zamanı ile birlikte bir **zaman damgasası** (timestamp) ile tanımlanır.



Her doğrulayıcı düğüm, veri bloğunun kendi kopyasını alır. Tek bir merkezi otorite yoktur. Tüm kopyalar eşit biçimde geçerlidir.



Her blok, önceki bloğa bir bağlantı olarak bir **hash işaretçisi** (pointer) içerir. Ayrıca, bir zaman damgasası, yeni veriler ve kendi benzersiz hash numarasını da içerir.



Bu yapı kullanılarak, her blok zincirdeki açık bir konuma sahiptir ve önceki veri bloğuna geri bağlanır. Bu, değiştirilemez bir blok zinciri oluşturur. **Zincirdeki tüm mevcut bilgileri her zaman geri izleyerek doğrulayabilirsiniz.**


Tasarım gereği, blok zincirleri verilerin değiştirilmesine karşı dirençlidir. Her bir defter düğümü, blok zincirinin tam bir kopyasını alır.



Bu, taraflar arasındaki işlemleri *verimli ve doğrulanabilir* ve kalıcı bir şekilde kaydeden açık ve dağıtılmış bir defter oluşturur.

:::warning
Kaydedildiğinde, herhangi bir blok içindeki veriler **geriye dönük olarak değiştirilemez**, aksi takdirde doğrulayıcıların çoğunluğu değişikliği kabul ederse.
:::

Eğer öyleyse, tüm sonraki bloklar aynı şekilde değiştirilir (bu çok nadir ve aşırı bir durumdur).

### Federated Konsensüs Süreci Nasıl Çalışır?

XRPL'deki çoğu rippled sunucusu işlemleri izler veya önerir. Önemli bir alt kümesi doğrulayıcı olarak çalıştırılan sunuculardır. Bu güvenilir sunucular, yeni işlemlerin listesini yeni bir olası defter örneğine (blok zincirindeki yeni bir blok) toplar.



Listelerini diğer tüm doğrulayıcılarla paylaşırlar. Doğrulayıcılar, birbirlerinden önerilen değişiklikleri dahil eder ve yeni bir defter önerisi versiyonu dağıtır.



Doğrulayıcıların %80'i bir işlem setinde mutabık kaldığında, zincirin sonunda yeni bir defter örneği oluşturur ve süreci tekrar başlatır. Bu konsensüs süreci **4-6 saniye** sürer. [https://livenet.xrpl.org/](https://livenet.xrpl.org/) adresini ziyaret ederek defter örneklerinin gerçek zamanlı olarak nasıl oluşturulduğunu izleyebilirsiniz.

### Hangi Ağlar Mevcuttur?

XRPL, kendi rippled sunucu örneğini kurmak ve bağlanmak isteyen herkes için açıktır. Düğüm, ağı izleyebilir, işlemler gerçekleştirebilir veya doğrulayıcı olabilir. Aktif XRPL ağı genellikle _Mainnet_ olarak adlandırılır.

Kendi fonlarını yatırmadan XRPL'nin özelliklerini denemek isteyen geliştiriciler veya yeni kullanıcılar için, _Testnet_ ve _Devnet_ adında iki geliştirici ortamı mevcuttur. Kullanıcılar, **1,000 (sahte) XRP** ile finanse edilen bir hesap oluşturabilir ve XRPL ile etkileşimde bulunmak için bu ortamlardan birine bağlanabilirler.

---
Sonraki: `XRP Nedir?`