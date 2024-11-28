---
title: Blob Hub
description: "BlobHub, BNB Greenfield'in veri arşiv katmanı olarak EIP4844 blob'larını kullanarak veri erişilebilirliğini sağlıyor. Bu sayede tüm tarihi blob'lar kolayca erişilebilir hale geliyor."
keywords: [BNB Greenfield, NodeReal, Veri Arşiv Katmanı, Blob hub, EIP4844, Dapp, veri erişimi]
---

# Blob Hub: EVM L1 Zincirleri için BNB Greenfield Veri Arşiv Katmanı

Greenfield topluluğu, EIP4844 blob'larını veri erişilebilirlik katmanı olarak kullanan tüm katman 2 blok zincirleri ve Dapp'ler için tasarlanmış "BlobHub" adlı bir veri arşiv katmanını yeni başlattı. Tüm tarihi blob'lar Greenfield’e kaydedilebilir ve kullanıcılar bu blob'lara sorgulamak istediklerinde rahatlıkla erişebilirler. BlobHub sadece Ethereum'a değil, aynı zamanda EIP4844'ü etkinleştiren diğer blok zincirlerine de hizmet vermektedir.

:::tip
Blob'ların maliyet etkin bir şekilde kaydedilmesi için paket hizmeti kullanılması önerilmektedir.
:::

Her blob, Greenfield'de bir nesne olarak kaydedilebilir; ancak bunu bireysel olarak yapmak maliyet açısından verimli değildir. [paket hizmeti](https://docs.nodereal.io/docs/greenfield-bundle-service?ref=bnbchain.ghost.io) sayesinde, bu hizmet küçük dosyaları bir araya getirerek Greenfield'de depolamak için tek bir paket halinde toplamakta, çok sayıda bloktan blob'ları toplayabilmekte, doğruluklarını doğrulamakta ve bunları etkili bir şekilde Greenfield'e yüklemektedir.

> **Not:** Greenfield, hem nesneleri depolamak hem de kova sahibinden okumak için bir ücret alacaktır. Eğer kova ödeme hesabında yeterli bakiye yoksa, kullanıcılar kotayı yeniden doldurana kadar veri sorgulamakta zorluk yaşayacaklardır.  
> — Greenfield Belgelendirme

---

# Blob Hub Nasıl Çalışır

Blob Hub, esasen blob-syncer ve api-server adlı iki bileşenden oluşmaktadır. Blob'ları Greenfield'e senkronize etmek için, blob-syncer hizmeti sürekli olarak Ethereum ve diğer blok zincirlerinden blob'ları alıp bunları Greenfield'de saklar. Api-server ise kullanıcılardan gelen tarihi blob sorgulama taleplerini işler. Paket hizmeti, blob'ları bir araya getirip, doğruluklarını doğrulamakta ve bunları etkili bir şekilde Greenfield'e yüklemektedir.

![Blob Hub Çözümü](../../../images/bnb-chain/bnb-greenfield/static/asset/blob-hub.png)

Senkronizasyon süreci, hiçbir blob'un eksik olmadığından ve Greenfield'e senkronize edilen her blob'un tutarlı olduğundan emin olmaktadır. Bu, tüm yüklenen blob'ların tekrar tarandığı, Greenfield'de zaten depolanmış verilere karşı bütünlük kontrollerinin yapıldığı ve kaybolan verilerin tespit edildiği bir doğrulama süreci yürütülerek sağlanmaktadır. Tekil yüklemeler, Paket hizmetinde ve Greenfield'de anahtar adlandırma kısıtlamaları ile önlenmektedir.

---

# Blob Hub'a Erişim Gereksinimi Olanlar Kimlerdir?

## Katman 2 Düğümü

Genesis bloktan senkronizasyon gerektiren katman 2 düğümleri, Blob Hub aracılığıyla tarihi blok verilerine erişim gerekmektedir. Greenfield'in sağlam altyapısından yararlanarak, saklanan verilerin bütünlüğünün ve erişilebilirliğinin korunduğundan emin olabilirler.

## Analitik Platform

Zincir üzerindeki veri analitik inşaatçıları için, blob hub hizmeti merkezi RPC hizmet sağlayıcılarına alternatif sunmaktadır. Dağıtık bir kaynağa dayanarak, bu inşaatçılar merkezi varlıklara bağlı kalmadan zengin bir tarihi blob verisine erişim kazanırlar.

---

# Blob Hub'dan Blob Sorgulama

Blob hub, şu an Ethereum ve BSC'yi desteklemekte; mümkün olan en çok EVM zincirini desteklemeye çalışmaktadır. API, Beacon Chain ve BSC API spesifikasyonu ile %100 uyumludur. Geliştiriciler, desteklenen `ağ ve uç noktaları` belgede bulabilirler.

:::info
API spesifikasyonu hakkında daha fazla ayrıntı için lütfen [BlobHub API](https://github.com/bnb-chain/blob-hub/?tab=readme-ov-file#blob-hub-api) sayfasına bakın.
:::

---

# Deneyin

Bu yenilikçi çözümü benimseyerek, paydaşlar blok zinciri verilerinin bütünlüğünü, erişilebilirliğini ve sürekliliğini sağlayabilir, böylece daha dayanıklı ve şeffaf bir dijital ekosistemi destekleyebilirler. Veri yönetim süreçlerinizi devrim niteliğinde dönüşüme sokma fırsatını kaçırmayın—bugün Greenfield topluluğuna katılın ve blok zinciri veri güvenilirliği ve güvenliği için yeni bir standart belirleyin.