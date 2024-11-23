---
sidebar_position: 20
title: Depozit ve Tahviller
description: Camino Ağı'nın menkul kıymetleri hakkında detaylar
---

# Depozit ve Tahviller

Camino Ağı, depozitolar ve tahviller olarak bilinen iki kavramı kullanmaktadır. Bu menkul kıymetler, depozitohar ödülleri, doğrulayıcı tahvilleri ve DAO önerileri gibi çeşitli amaçlar için kullanılmaktadır.

## Depozitolar

Camino Ağı'ndaki depozitolar, kullanıcıların CAM token’ları için ödüller kazanmalarına olanak tanır. Kullanıcılar, belirli bir süre boyunca token’larını blockchain üzerinde yatırarak karşılığında ödül kazanabilirler. Bu mekanizma, geleneksel bankacılık sistemlerinde tasarruf hesaplarından faiz kazanma deneyimine benzemektedir.

Bu mekanizma, Camino Ağı'nın CAM token değerini stabilize etmesine yardımcı olmaktadır.

### Diğer PoS Blok Zincirlerindeki Delegasyondan Farkı

Camino Ağı'nın depozito özelliği, Avalanche gibi diğer PoS blok zincirlerindeki delegasyondan farklılık göstermektedir. Delegasyonda, kullanıcıların token’larını stake etmek için güvenilir bir doğrulayıcı bulmaları gerekmektedir. Bu durum, kullanıcılar için ek bir yük getirir ve süreci karmaşık hale getirir; çünkü güvenilir bir doğrulayıcının uptime sürelerini bulmaları gerekmektedir.

Diğer blok zincirler, ağlarını güvence altına almak için delegasyon mekanizmasına ihtiyaç duyar, ancak Camino Ağı, delegasyona gerek duymadan işleyen, Proof of Stake ve Authority adlı benzersiz bir fikir birliği mekanizması kullanmaktadır. Her Camino doğrulayıcısı tanınmakta ve KYC veya KYB yoluyla doğrulanmış olup, sabit bir miktar CAM tokenı tahvil etmektedir. Bu, Camino Ağı'nın kullanıcılarına basit bir depozito işlevselliği sunmasını sağlamaktadır.

Camino'nun depozitoları ile kullanıcılar, güvenilir bir doğrulayıcı bulma veya token’larını devretme gereksinimi olmadan, token’larını belirli bir süre yatırıp ödül kazanabilirler.

:::tip

Camino Cüzdanı'ndaki Kazan bölümü, kullanıcının depozito kazançlarını gösterir.

:::

## Tahviller

Camino Ağı'nda, tahviller şu anda iki amaç için kullanılmaktadır. Birincil kullanım, doğrulayıcılar tarafından tahvil yapılmasıdır; ikincil kullanım ise DAO önerileri için tahvillerdir.

### Doğrulayıcılar İçin Tahvil

Doğrulayıcıların, doğrulayıcı olabilmek için tam olarak 100,000 CAM token tahvil etmesi gerekmektedir. Bu tahvil edilmiş tokenlar, bir tahvil içinde kilitlenir ve tahvil süresi boyunca bu durumda kalır.

Bu mekanizma, diğer PoS blok zincirlerindeki stake etme mekanizmasına benzemekle birlikte, Camino Ağı'nda tahvil edilen miktarın sabit olması bakımından farklıdır. Doğrulayıcılar, 100,000 CAM token’dan daha fazlasını veya azını tahvil edemezler. Ayrıca, doğrulayıcılar KYC veya KYB doğrulamasına tabi tutulmakta ve tek bir doğrulayıcı düğümü çalıştırmakla sınırlı kalmaktadırlar. Bu durum, ağın tüm üyelerinin DAO önerileri üzerinde oy kullanmasını sağlamak için adil ve demokratik bir alan oluşturur.

:::tip TAHVİL EDİLEN TOKENLAR AYNI ZAMANDA DEPOZİTE EDİLEBİLİR

Tahvil edilmiş tokenların ayrıca ek ödüller kazanmak için de yatırılabileceği önemle belirtilmelidir.

:::

### DAO Önerileri

Camino Ağı'ndaki tahvillerin ikinci kullanımı, DAO önerileri içindir. Kullanıcılar, belirli bir öneriye desteklerini belirtmek amacıyla token’larını tahvil edebilirler. Bu, daha merkeziyetsiz bir karar verme süreci sağlar ve topluluk üyelerine ağın yönü üzerinde doğrudan söz hakkı tanır.

Öneriyi sunan kişinin belirli bir miktarda CAM token tahvil etmesi gerektiği hususu önemlidir. Diğer taraftan, oylayıcıların herhangi bir token tahvil etmesine gerek yoktur; yalnızca konsorsiyum üyeleri olmaları yeterlidir.

Bu tahvil mekanizması, öneriyi sunan kişinin başarısına yatırım yapmasını ve sonucun sonuçlarına hissedar olmasını sağlamak için kullanılır. Ayrıca, spam veya düşük kaliteli önerilerin DAO’ya sunulmasını önlemeye yardımcı olur; çünkü kullanıcıların öneri sunabilmesi için bir tahvil koymaları gerekir. Genel olarak, Camino Ağı'ndaki tahviller, ağın bütünlüğünü ve güvenliğini sağlamaya yardımcı olur.

## Sonuç

Sonuç olarak, Camino Ağı’ndaki depozito ve tahvil özellikleri, kullanıcılar için ödüller kazanmanın ve ağın karar verme sürecine katılmanın basit ve güvenli bir yolunu sunmaktadır. Sabit tahvil miktarı ve doğrulayıcıların doğrulanma gereksinimi, tüm üyeler için adil ve demokratik bir ortam yaratır.

:::info DEPOZİTOLAR & TAHVİLLER KİLİTLİ TOKENLARDIR

Tahvil edilmiş tokenların, ister doğrulayıcılar için ister DAO önerileri için olsun, işlem ücretlerini ödemek veya diğer zincirlere aktarım yapmak (cross-chain transfer) için kullanılamadığını belirtmek önemlidir. Bunun nedeni, bu tokenların kilitlenmiş olması ve tahvil süresi boyunca taşınamaz veya transfer edilememesidir.

:::