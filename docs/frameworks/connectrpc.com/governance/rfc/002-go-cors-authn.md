---
title: Go için CORS ve Authn
seoTitle: Go için CORS ve Kimlik Doğrulama
sidebar_position: 4
description: Bu belge, Go için sunucu tarafı CORS yapılandırması ve kimlik doğrulama yöntemleri hakkında bilgi sunmaktadır. İki yardımcı Go projesi önerilmektedir.
tags: 
  - Go
  - CORS
  - Kimlik Doğrulama
  - Middleware
keywords: 
  - Go
  - CORS
  - Kimlik Doğrulama
  - Middleware
---
## Go için CORS ve Authn

Bu RFC, Connect Github organizasyonuna iki yardımcı Go projesinin eklenmesini önermektedir:

- `connectrpc.com/cors`, sunucu tarafı CORS yapılandırmasını kolaylaştırır ve
- `connectrpc.com/authn`, esnek sunucu tarafı kimlik doğrulama middleware'ı sağlar.

## CORS

[Çapraz kaynak paylaşımı][cors], genellikle CORS olarak adlandırılan, sunucuların web tarayıcılarına diğer domainlerden kaynakları yüklemek için scriptlerin izin verilip verilmeyeceğini belirtmelerine olanak tanır. Bu, genellikle API ve uygulamanın farklı kökenlerde barındırıldığı tek sayfa web uygulamaları için yaygın bir endişedir - örneğin, `app.acme.com` API'leri `api.acme.com` üzerinde barındırıyor olabilir. CORS sürecinin bir parçası olarak, sunucular beklenen HTTP isteği ve yanıtı başlık anahtarlarını listeleyebilmelidir.

:::info
Arka uçtan arka uca iletişim için (CORS'ın dahil olmadığı yerlerde), Connect çalışma zamanı protokol spesifik başlıkları soyutlar. 
:::

Ancak, tarayıcıdan arka uca iletişim için CORS'u doğru bir şekilde yapılandırmak için, sunucu yazarları gRPC, gRPC-Web ve Connect protokollerinin kullandığı başlıkların çoğunu açıkça listelemelidir. Elde edilen yapılandırma [açık CORS][explicit-cors] oldukça ayrıntılıdır ve temel protokollerle evrimleşmesi zor olabilir.

Go'da tarayıcıya dönük Connect API'lerinin geliştirilmesini kolaylaştırmak için, CORS yardımcılarının küçük bir Go paketini oluşturmayı öneriyoruz. Bu paket, kullanıcıların, her RPC protokolü için kullanılan tüm HTTP başlıklarını açıkça listelemek zorunda kalmadan mevcut CORS paketlerini yapılandırmalarına yardımcı olacaktır (örneğin, [`github.com/rs/cors`][rs-cors]).

## Kimlik Doğrulama

HTTP sunucuları çeşitli kimlik doğrulama şemaları kullanır: karşılıklı TLS, çerezler ve çeşitli türlerdeki taşıyıcı token'lar özellikle yaygındır. Genellikle, kimlik doğrulama mantığı aynı zamanda hizmet şeması hakkında bazı bilgilere ihtiyaç duyar - en azından hizmetin ve metodun adı, ama bazen daha ayrıntılı bilgi de gerekebilir.

:::warning
Go'da, kimlik doğrulama kontrolleri en iyi şekilde `net/http` middleware'ı olarak uygulanır. Bu yaklaşım, sunucuların yetkilendirilmemiş istekleri erken aşamada reddetmelerine olanak tanır; yükü açığa çıkarmadan ve ayrıştırmadan önce, ve tüm kimlik doğrulama şemaları için eşit derecede iyi çalışır.
:::

Ancak, deneyim göstermiştir ki birçok kullanıcı, açığa çıkarma ve ayrıştırmanın ardından çalışan Connect interceptors kullanarak kontrollerini uygulama çabasına girerler ve TLS durumu gibi taşıma ayrıntılarına erişimleri yoktur.

Kullanıcıların sunucularını güvence altına almalarını kolaylaştırmak için, istekleri kimlik doğrulayan bir Go paketi oluşturmayı öneriyoruz. Kullanıcılar, düşük seviyeli taşıma bilgilerine ve yüksek seviyeli RPC bilgilerine erişimi olacak olan gerçek kimlik doğrulama fonksiyonunu sağlayacaklardır. Ayrıca, kimlik doğrulanan çağrıların kimliğini sonraki middleware'lara, interceptors ve servis uygulamalarına aktaran bir mekanizmayı standart hale getirecektir.

[cors]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
[explicit-cors]: https://connectrpc.com/docs/cors/#allowing-methods-and-headers
[rs-cors]: https://github.com/rs/cors