---
title: Fastify için İyi Bir Eklenti Yazma
seoTitle: Fastify için Eklenti Geliştirme Rehberi
sidebar_position: 4
description: Fastify için etkili bir eklenti yazma üzerine kapsamlı bir rehber. Eklenti geliştirme süreçleri, kodlama önerileri ve lisanslama bilgileri sunmaktadır.
tags: 
  - fastify
  - eklenti
  - geliştirme
  - dokümantasyon
  - test
keywords: 
  - fastify
  - eklenti
  - geliştirme
  - lisans
  - test
---


## İyi Bir Eklenti Nasıl Yazılır
Öncelikle, Fastify için bir eklenti yazmayı seçtiğiniz için teşekkür ederiz. Fastify, minimal bir çerçeve olup, eklentileri onun güç kaynağıdır, bu yüzden teşekkürler.

Fastify'ın temel ilkeleri performans, düşük aşınma ve kullanıcılarımıza iyi bir deneyim sunmaktır. Bir eklenti yazarken, bu ilkeleri akılda tutmak önemlidir. Bu nedenle, bu belgede kaliteli bir eklentiyi nitelendiren unsurları analiz edeceğiz.

:::tip
Biraz ilhama mı ihtiyacınız var? Sorun izleyicimizdeki ["eklenti önerisi"](https://github.com/fastify/fastify/issues?q=is%3Aissue+is%3Aopen+label%3A%22plugin+suggestion%22) etiketini kullanabilirsiniz!
:::

## Kod
Fastify, kodunu optimize etmek için çeşitli teknikler kullanmaktadır; bunların birçoğu Kılavuzlarımızda belgelenmiştir. Eklentinizi oluşturmak için kullanabileceğiniz tüm API'leri keşfetmek ve bunları nasıl kullanacağınızı öğrenmek için `eklentilere yönelik yolculuk rehberini` okumanızı şiddetle tavsiye ederiz.

:::info
Bir sorunuz mu var ya da bazı tavsiyelere mi ihtiyaç duyuyorsunuz? Size yardımcı olmaktan mutluluk duyarız! Sadece [yardım deposunda](https://github.com/fastify/help) bir sorun açın.
:::

Eklentinizi `ekosistem listemize` sunduktan sonra, kodunuzu inceleyeceğiz ve gerekirse geliştirmenize yardımcı olacağız.

## Dokümantasyon
Dokümantasyon son derece önemlidir. Eklentiniz iyi belgelenmemişse, bunu ekosistem listesine kabul etmeyeceğiz. Kaliteli dokümantasyon eksikliği, insanların eklentinizi kullanmasını zorlaştırır ve muhtemelen kullanılmamasına neden olur.

::warning
Eklentinizi nasıl belgeleriniz konusunda iyi örnekler görmek istiyorsanız, şu örneklere göz atın:
- [`@fastify/caching`](https://github.com/fastify/fastify-caching)
- [`@fastify/compress`](https://github.com/fastify/fastify-compress)
- [`@fastify/cookie`](https://github.com/fastify/fastify-cookie)
- [`@fastify/under-pressure`](https://github.com/fastify/under-pressure)
- [`@fastify/view`](https://github.com/fastify/point-of-view)
:::

## Lisans
Eklentinizi istediğiniz gibi lisanslayabilirsiniz, herhangi bir lisans türünü zorunlu kılmıyoruz.

Kodun serbestçe kullanılmasını sağladığı için [MIT lisansını](https://choosealicense.com/licenses/mit/) tercih ederiz. Alternatif lisanslar için [OSI listesine](https://opensource.org/licenses) veya GitHub'ın [choosealicense.com](https://choosealicense.com/) sayfasına bakabilirsiniz.

## Örnekler
Her zaman deposunda bir örnek dosyası bulundurun. Örnekler, kullanıcılar için çok yardımcıdır ve eklentinizi hızlı bir şekilde test etmenin kolay bir yolunu sunar. Kullanıcılarınız size minnettar olacaktır.

## Test
Bir eklentinin düzgün çalıştığını doğrulamak için kapsamlı bir şekilde test edilmesi son derece önemlidir.

Test olmadan bir eklenti ekosistem listesine kabul edilmeyecektir. Test eksikliği güvenilirliği etkilemez ve kodun bağımlılıkları arasında çalışmaya devam edeceğini garanti etmez.

:::note
Herhangi bir test kütüphanesini zorunlu kılmıyoruz. [`node:test`](https://nodejs.org/api/test.html) kullanıyoruz çünkü kutudan çıkan paralel test ve kod kapsamı sunar, ancak tercih ettiğiniz kütüphaneyi seçmek size bağlıdır.
Eklentilerinizi nasıl test edeceğiniz hakkında daha fazla bilgi almak için `Eklenti Testi` belgesini okumanızı şiddetle öneririz.
:::

## Kod Linter
Zorunlu değildir, ancak eklentinizde bir kod linter kullanmanızı şiddetle öneririz. Kod stilinin tutarlı olmasını sağlar ve birçok hatayı önlemenize yardımcı olur.

[`standard`](https://standardjs.com/) kullanıyoruz çünkü yapılandırma gerektirmeden çalışır ve bir test paketine entegrasyonu oldukça kolaydır.

## Sürekli Entegrasyon
Zorunlu değildir, ancak kodunuzu açık kaynak olarak sunduysanız, sürekli entegrasyonu kullanmak, katkıların eklentinizi bozmadığından emin olunmasına yardımcı olur ve eklentinin olduğu gibi çalıştığını gösterir. Hem [CircleCI](https://circleci.com/) hem de [GitHub Actions](https://github.com/features/actions) açık kaynak projeler için ücretsizdir ve kurulumu kolaydır.

Ayrıca, bağımlılıklarınızı güncel tutmanıza ve Fastify'ın yeni bir sürümünün eklentinizle bazı sorunları olup olmadığını keşfetmenize yardımcı olacak [Dependabot](https://github.com/dependabot) gibi hizmetleri etkinleştirebilirsiniz.

## Haydi başlayalım!
Harika, şimdi Fastify için iyi bir eklenti yazmak için bilmeniz gereken her şeye sahipsiniz! Bir (veya daha fazla!) eklenti oluşturdunuzdan sonra bize haber verin! Bunu belgelerimizin [ekosistem](https://github.com/fastify/fastify#ecosystem) bölümüne ekleyeceğiz!

Gerçek dünya örneklerini görmek istiyorsanız, inceleyin:
- [`@fastify/view`](https://github.com/fastify/point-of-view) Şablonların işlenmesi (*ejs, pug, handlebars, marko*) için Fastify desteği.
- [`@fastify/mongodb`](https://github.com/fastify/fastify-mongodb) Fastify MongoDB bağlantı eklentisi, bununla her bölümde aynı MongoDB bağlantı havuzunu paylaşabilirsiniz.
- [`@fastify/multipart`](https://github.com/fastify/fastify-multipart) Fastify için çok parçalı destek.
- [`@fastify/helmet`](https://github.com/fastify/fastify-helmet) Fastify için önemli güvenlik başlıkları.