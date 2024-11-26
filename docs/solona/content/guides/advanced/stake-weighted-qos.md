---
featured: false
date: 2024-03-20T00:00:00Z
difficulty: intermediate
seoTitle: "Stake-ağırlıklı Hizmet Kalitesi Solana"
title: "Solana'da Stake-ağırlıklı Hizmet Kalitesi Rehberi"
description:
  "Stake-ağırlıklı QoS (Hizmet Kalitesi), etkinleştirildiğinde liderlerin 
  (blok üreticileri) stake edilmiş bir doğrulayıcı aracılığıyla iletilen 
  işlemleri tanımlayıp önceliklendirmesine izin veren bir uygulama özelliğidir, 
  ilave bir sybil direnci mekanizması olarak."
tags:
  - rust
keywords:
  - rehber
  - stake-ağırlıklı QoS
  - Hizmet Kalitesi
  - solana geliştirmeye giriş
  - blok zinciri geliştirici
  - blok zinciri eğitimi
  - web3 geliştirici
altRoutes:
  - /developers/guides/advanced/stake-weighted-qos-guide
---

## Stake-ağırlıklı Hizmet Kalitesi (QoS) Nedir?

Stake-ağırlıklı QoS (Hizmet Kalitesi), etkinleştirildiğinde, liderlerin (blok üreticileri) stake edilmiş bir doğrulayıcı aracılığıyla iletilecek işlemleri tanımlayıp önceliklendirmesine izin veren bir uygulama özelliğidir; bu, ilave bir sybil direnci mekanizması olarak çalışır. Solana bir proof of stake ağı olduğundan, stake ağırlığını işlem hizmet kalitesine genişletmek doğaldır. 

> **Önemli Nokta:** 
> Bu model altında, %0,5 stake'e sahip bir doğrulayıcı, lidere kadar %0,5 oranında veri iletebilme hakkına sahip olacak ve ağın geri kalanından gelen sybil saldırılarına karşı direnç gösterecektir. —"Solana Altyapısı"

Bu özelliği etkinleştiren operatörler, düşük veya hiç stake olmayan (düşük kaliteli) doğrulayıcıların daha yüksek kaliteli (yüksek stake) doğrulayıcılardan gelen işlemleri "boğmasını" önleyerek ağın güvenliğini ve performansını artıracaklardır (aka geliştirilmiş Sybil Direnci).


Ek Bilgiler
Stake-ağırlıklı QoS uygulamasının bir potansiyel yararı, bazı Doğrulayıcılar ve RPC düğümleri arasındaki belirli anlaşmaların geçerli olması durumunda elde edilebilir. RPC düğümleri, Doğrulayıcılar ile eşleşerek bloklara daha fazla işlem ulaştırabilir ve Doğrulayıcılar, RPC düğümlerine daha fazla kapasite satabilir. Bu anlaşmalar, doğrudan RPC operatörleri ve Doğrulayıcılar arasında yapılmalı ve aşağıda bu belgede yer alan adımların uygulanmasını içermelidir.


## Stake-ağırlıklı QoS Kime Yararlıdır?

Ticari RPC altyapı operatörleri ve borsa işletmeleri, Stake-ağırlıklı QoS'un ana faydalanıcısı olma olasılığı yüksek olan gruplardır. 

- RPC operatörleri, stake edilmiş doğrulayıcılarla anlaşmalar yaparak bloklara yerleştirilen işlemlerin yüzdesini artırma şansına sahip olacaktır.
- Kendi doğrulayıcı düğümlerini ve RPC düğümlerini aynı altyapıda barındıran borsa işletmeleri (veya diğer varlıklar), özelliği dahili olarak etkinleştirebilecek ve kendi altyapılarında çalışan RPC düğümlerinin güvenilir olabileceğinden emin olacaklardır.

## Stake-ağırlıklı QoS Neden Önemlidir?

Stake-ağırlıklı QoS etkinleştirildiğinde, %1 stake'e sahip bir doğrulayıcı, lidere kadar %1 oranında veri iletme hakkına sahip olacaktır. Bu şekilde, daha yüksek stake'e sahip doğrulayıcılar daha yüksek bir hizmet kalitesine garantili olarak erişebilir, bu da daha az stake'e sahip (daha düşük kaliteli) doğrulayıcıların bu işlemleri kötü niyetle boğmasını engeller ve genel Sybil Direnci artar.

:::tip
**Analojik Açıklama:**
Diğer bir deyişle, bir yolculukta tek yolcusu olan arabaların karşıdan karşıya geçme şeridinde sınırsızca gitmesini hayal edin. Kısa süre içinde, aynı karayolunu kullanan daha fazla insanı taşımak üzere tasarlanan karşıdan karşıya geçme şeridi, işlevsizlik hâline gelecektir.
:::

Genel olarak karayolunun işlevselliği bozulacak ve daha az yolcu hedeflerine ulaşabilecektir. Bu etki, düşük stake'e sahip doğrulayıcıların işlemleri yüksek stake'e sahip doğrulayıcılarla aynı öncelikle lidere göndermesine izin verildiğinde oluşan durumla benzerdir.

## Stake-ağırlıklı QoS'u Kim Etkinleştirmeli?

Stake-ağırlıklı QoS, yüksek derecede güvenilir RPC düğümleri ile eşleştirilen Doğrulayıcı düğümleri tarafından etkinleştirilmelidir. 

> **Öneri:** 
> Bu, bir RPC ve Doğrulayıcı'nın aynı altyapıda çalıştığı ve güven seviyesinin zaten yüksek olduğu durumlarda yardımcıdır. — "Güvenli Eşleştirme"

Stake-ağırlıklı QoS, yüksek güven yapılandırmaları için en iyi şekilde çalışır ve özelliği etkinleştirmeden önce Doğrulayıcı ve RPC'nin önceden bir anlaşmaya varması gerekir. Doğrulayıcıların, güvenilir olmayan RPC'lerle Stake-ağırlıklı QoS'u etkinleştirmeye çalışmamaları şiddetle önerilir.

**Not:** Stake, blok üreten doğrulayıcılara uygulanmalıdır. RPC sunucularına stake devretmek gerekli, önerilen ya da etkili değildir.

## Stake-ağırlıklı QoS Nasıl Çalışır?

Stake-ağırlıklı QoS etkinleştirildiğinde, bir doğrulayıcı ile eşleştirilen RPC düğümleri, o liderin içeriye TPU (İşlem İşleme Birimi) trafiğine yaklaşımında "sanal" bir stake edinir; bu durum normalde mümkün değildir.

:::warning
Tanım gereği, RPC düğümleri "stake edilmemiş" ve "oy vermeyen" yani "konsensüs dışı" olup, konsensüs düğümleri gibi stake ederek öncelikli işlemlerin avantajlarından yararlanamazlar.
:::

Stake-ağırlıklı QoS'u kullanarak işlemleri nasıl gönderirsiniz? Stake-ağırlıklı QoS'u etkinleştirmek, bir doğrulayıcı düğümü ve bir RPC düğümü arasında güvenilir bir eş ilişkisi oluşturmayı gerektirir. Bu, aşağıda listelenen her iki düğüm için ayrı yapılandırma adımlarını içerir. Stake-ağırlıklı QoS'u etkinleştirmek isteyen operatörlerin başlamadan önce ihtiyaç duyacağı şeyler:

- Ağda çalışan stake'e sahip bir doğrulayıcı ve Doğrulayıcıya eşleştirilmiş bir RPC.

Stake-ağırlıklı QoS, her iki taraf da düzgün bir şekilde yapılandırılmadıkça çalışmayacaktır.

### Doğrulayıcı Düğümünü Yapılandırma

Doğrulayıcıda, `--staked-nodes-overrides /path/to/overrides.yml` seçeneğini etkinleştirmeniz gerekecek. 

- `--staked-nodes-overrides` bayrağı, doğrulayıcının bilinen kaynaklardan gelecek işlemleri önceliklendirmesine yardımcı olur. 
- Bu, bir doğrulayıcının bilinmeyen sunuculardan gelen belirli işlemleri önceliklendirmesine izin verir, RPC'lerle Stake-ağırlıklı QoS kullanımını sağlar. 

RPC'ler hiçbir şekilde stake edilmemelidir.

Günümüzde, Stake-ağırlıklı QoS, bir liderin TPU kapasitesinin %80'ine stake-ağırlıklı bir öncelik atar. Ancak, farklı stake-ağırlıklarının TPU eşlerine sanal olarak atanmasını sağlayan yapılandırma seçenekleri mevcuttur; stakesiz eşlerle sanal stake atamasını da içerir.

```yml
staked_map_id:
  pubkey1: 1000000000000000
  pubkey2: 4000000000000000
```

`staked_map_id`, her RPC'ye uygulanacak stake miktarını lamportlarla eşleştiren bir kimlik halkasının haritasını içerir. Belirli bir RPC ile bu kimlik halkası publicKey'de QUIC bağlantılarının öncelikten yararlanarak doğrulayıcı işlemleri için stake miktarını atadığında, doğrulayıcı öncelikli olarak bu RPC üzerinden gelen işlemlere stake paylaşır. Liderin TPU kapasitesinin %80'i, `staked-nodes-overrides` dosyasında belirtilen lamport miktarları ve mevcut küme stake'ine göre orantılı olarak bölünecektir.

### RPC Düğümünü Yapılandırma

RPC'de, işlemleri belirli bir lidere iletmek için `--rpc-send-transaction-tpu-peer` kullanmanız gerekecek. Tam kullanım `--rpc-send-transaction-tpu-peer HOST:PORT` olacaktır. 

- Host, `staked-nodes-overrides` etkinleştirilen liderin IP adresidir ve Port, o hostun QUIC TPU portudur.
- Bir liderin QUIC TPU portunu belirlemek için `getClusterNodes` RPC çağrısında bulunabilirsiniz.

Eşleştirme, aşağıdakine benzer olacaktır:

![Stake-ağırlıklı QoS için Doğrulayıcı ile RPC'lerin eşleşmesi diyagramı](../../../images/solana/public/assets/guides/stake-weighted-qos-guide/peered-RPCs-guide.png)

## Sonuç

Stake-ağırlıklı QoS, Solana istemcisinin v1.14 sürümünde tanıtılan isteğe bağlı bir özelliktir; artık Agave olarak bilinmektedir. Agave, Solana Labs istemcisinin bir çatal versiyonudur ve eski Solana Labs mühendislik ekiplerinden oluşan Anza ekibi tarafından kullanılan aktif dal hâline gelmiştir.

Stake-ağırlıklı QoS özelliği, stake edilmiş düğüm operatörleri ile güvenilir ilişkiler kurma pozisyonundaki RPC altyapı operatörleri için muhtemelen faydalı olacaktır. Ayrıca, hem RPC düğümleri hem de doğrulayıcı düğümleri çalıştıran borsalar için de iç ilişkileri güvenli bir şekilde kurabilmelerini sağlayacaktır.