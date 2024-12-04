---
title: Sürümler
seoTitle: Vue Sürüm Bilgileri
sidebar_position: 1
description: Bu belge, Vuenin sürüm döngüsü, sürüm yönetimi ve deneysel özellikler hakkında bilgiler sunar. Vuenin en son sürümü ve sürüm notlarına erişim sağlar.
tags: 
  - Vue
  - Sürüm Yönetimi
  - Geliştirici
  - JavaScript Framework
keywords: 
  - Vue
  - Sürüm
  - Geliştirici
  - API
  - JavaScript
---


## Sürümler {#releases}


Vue'nin mevcut en son kararlı sürümü {{ version }}'dır.


En son sürüm kontrol ediliyor...


Geçmiş sürümlerin tam değişiklik kaydı [GitHub](https://github.com/vuejs/core/blob/main/CHANGELOG.md) üzerinde mevcuttur.

## Sürüm Döngüsü {#release-cycle}

Vue'nin sabit bir sürüm döngüsü yoktur.

- Yaman sürümler ihtiyaç oldukça yayımlanır.

- Küçük sürümler her zaman yeni özellikler içerir ve genellikle 3-6 ay arasında bir zaman diliminde gerçekleşir. Küçük sürümler her zaman bir beta ön sürüm aşamasından geçer.

- Büyük sürümler zamanında duyurulacak ve erken tartışma aşaması ile alfa/beta ön sürüm aşamalarından geçecektir.

## Anlamlı Sürümleme Kenar Durumları {#semantic-versioning-edge-cases}

Vue sürümleri [Anlamlı Sürümleme](https://semver.org/) ilkesini izler, ancak birkaç kenar durumu vardır.

### TypeScript Tanımları {#typescript-definitions}

:::tip
Küçük sürümler arasında TypeScript tanımlarında uyumsuz değişiklikler gönderebiliriz.
:::

Bunun nedeni:

1. Bazen TypeScript kendisi, küçük sürümler arasında uyumsuz değişiklikler yayınlar ve daha yeni sürümlerin TypeScript desteği için türleri ayarlamak zorunda kalabiliriz.

2. Zaman zaman yalnızca daha yeni bir TypeScript sürümünde mevcut olan özellikleri benimsememiz gerekebilir, bu da TypeScript'in gereken minimum sürümünü artırır.

TypeScript kullanıyorsanız, mevcut küçük sürümü kilitleyen bir semver aralığı kullanabilirsiniz ve yeni bir Vue küçük sürümü yayımlandığında manuel olarak yükseltebilirsiniz.

### Derlenmiş Kodun Eski Çalışma Zamanı ile Uyumlu Olması {#compiled-code-compatibility-with-older-runtime}

Vue derleyicisinin daha yeni bir **küçük** sürümü, daha eski bir küçük sürümden gelen Vue çalışma zamanı ile uyumlu olmayan kodlar oluşturabilir. Örneğin, Vue 3.2 derleyicisinin oluşturduğu kod, Vue 3.1'den gelen çalışma zamanında tam anlamıyla uyumlu olmayabilir.

> Bu, yalnızca kütüphane yazarları için bir endişe kaynağıdır, çünkü uygulamalarda derleyici sürümü ve çalışma zamanı sürümü her zaman aynıdır. Bir sürüm uyumsuzluğu yalnızca önceden derlenmiş Vue bileşen kodunu bir paket olarak gönderdiğinizde ve bir kullanıcının bunu daha eski bir Vue sürümünü kullanan bir projede kullanması durumunda meydana gelebilir. Sonuç olarak, paketinizin, Vue'nin gerekli minimum küçük sürümünü açıkça belirtmesi gerekebilir.

## Ön Sürümler {#pre-releases}

Küçük sürümler genellikle sabit olmayan sayıda beta sürümden geçer. Büyük sürümler bir alfa aşamasından ve bir beta aşamasından geçer.

Ayrıca, GitHub'daki `main` ve `minor` dallarından her hafta kanarya sürümleri yayınlıyoruz. Bunlar, stabil kanalın npm meta verilerini şişirmemek için farklı paketler olarak yayınlanır. Onları `npx install-vue@canary` veya `npx install-vue@canary-minor` komutlarıyla kurabilirsiniz.

:::info
Ön sürümler, entegrasyon / stabilite testleri için ve erken benimseyenlerin kararsız özellikler hakkında geri bildirim sağlaması için tasarlanmıştır. Ön sürümleri üretimde kullanmayın. Tüm ön sürümler kararsız kabul edilir ve arada kırıcı değişiklikler içerebilir, bu nedenle ön sürümleri kullanırken her zaman kesin sürümlere sabitleyin.
:::

## Eski ve Yeni Özelliklerin Kaldırılması {#deprecations}

Yeni, daha iyi birer yerine daha önceden mevcut olan özellikleri küçük sürümlerde periyodik olarak kaldırabiliriz. Kaldırılan özellikler çalışmaya devam edecek ve durdurulduğu durumdan sonra bir sonraki büyük sürümde kaldırılacaktır.

## RFC'ler {#rfcs}

Önemli API yüzeyine sahip yeni özellikler ve Vue'deki büyük değişiklikler **Yorum Talebi** (RFC) sürecinden geçecektir. RFC süreci, yeni özelliklerin çerçeveye girişine düzenli ve kontrollü bir yol sağlamak ve kullanıcılara tasarım sürecine katılma ve geri bildirim sağlama fırsatı sunmak için tasarlanmıştır.

RFC süreci, GitHub'daki [vuejs/rfcs](https://github.com/vuejs/rfcs) deposunda yürütülmektedir.

## Deneysel Özellikler {#experimental-features}

Bazı özellikler, Vue'nin kararlı bir sürümünde gönderilir ve belgelenir, ancak deneysel olarak işaretlenir. Deneysel özellikler genellikle, çoğu tasarım sorunu kağıtta çözülmüş olan bir RFC tartışması ile ilişkili olan özelliklerdir, ancak hala gerçek dünya kullanımından geri bildirim eksikliği vardır.

Deneysel özelliklerin amacı, kullanıcıların bir kararlı sürümü kullanmaya gerek kalmadan, üretim ortamında test ederek geri bildirim sağlamalarını sağlamaktır. Deneysel özellikler kendileri kararsız olarak kabul edilir ve yalnızca kontrol altındaki bir şekilde kullanılmalıdır; her sürüm türü arasında değişiklik olması beklentisi ile.