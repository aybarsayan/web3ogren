---
sidebar_position: 15
title: Partner Eklentisi
description: Camino Messenger Bot Partner Eklentisi
---

# Camino Messenger Bot Partner Eklentisi

:::info TASLAK DÖKÜMAN BİLGİSİ

Lütfen bu belgenin şu anda bir taslak olduğunu ve aktif geliştirme sürecinde
bulunduğunu unutmayın. İçerikler, yönergeler ve talimatlar değişiklik
gösterebilir.

:::

:::caution 🚧 ALFA KODU BİLGİSİ 🚧

Bu uygulama geliştirme sürecinin alfa aşamasındadır. Bu aşamada,
kırıcı değişikliklerin önceden bildirilmeden meydana gelebileceğini
belirtmek önemlidir. Kullanıcıların dikkatli ilerlemeleri gerekmektedir.

:::

## Partner Eklentisi Nedir?

Partner Eklentisi, Camino Messenger Bot'un mevcut sistemlerle
sorunsuz entegre olmasını sağlayan bir köprü görevini görmektedir. Bu araç,
hem dağıtıcılar hem de sağlayıcılar için hazırlanmış olup, potansiyel
entegrasyon stratejilerini göstermek amacıyla bir referans uygulamasıyla
donatılmıştır.

Bir aracı olarak işlev gören Partner Eklentisi, botun gRPC sunucusunu
yansıtan bir gRPC sunucusu oluşturur ve bot tarafından doğrudan
işlenmeyen talepleri almak için bir iletim aracı görevi görür. Bu talepler
daha sonra partner eklentisine yönlendirilir ve gerekli veri dönüşümü
yapıldıktan sonra dağıtıcı veya sağlayıcının mevcut sistemine iletilir. Örneğin,
mevcut sistem bir REST API aracılığıyla arama sorgularını kabul ediyorsa, 
Partner Eklentisi'nin sorumlulukları şunları içerir:

- Bot'tan gRPC sunucusu aracılığıyla gelen talepleri alma.
- Entegrasyon sürecini kolaylaştırmak amacıyla mevcut sistemle iletişim
  kurmak için REST çağrılarını yürütme.

Örnek uygulama,  içindeki 
`examples/rpc/partner-plugin/server.go` dosyasında bulunabilir.

:::note

Lütfen Partner Eklentisi'nin esasen yalnızca sahte verilerle gelen
mesajları yanıtlamak için tasarlanmış bir prototip olduğunu unutmayın.

Bu uygulama, Camino Messenger Protokolü'nde tanımlanan tüm talep
türleriyle uyumludur. Ancak, **bir sağlayıcı eklentisinin** partnerin
hizmetlerine uygun olmayan talep türlerini dahil etmesi zorunlu değildir.

:::

### Partner Eklentisini Derleme

Partner Eklentisini derlemeden önce, Camino Messenger Bot için
 takip ettiğinizden
emin olun.

Kurulumu tamamladıktan sonra aşağıdaki komutu çalıştırın:

```sh
go build -o plugin  examples/rpc/partner-plugin/server.go
```

### Partner Eklentisini Çalıştırma

Partner Eklentisini shell'de aşağıdaki komut ile çalıştırın:

```sh
PORT=50051 ./plugin
```

Port numarasının, Camino Messenger Bot konfigürasyon dosyasında
yapılandırdığınız ile örtüşecek şekilde olduğundan emin olun.

## Java Spring Boot Uygulaması

Partner Eklentisinin alternatif bir uygulaması Java Spring Boot'ta
mevcuttur. Daha fazla bilgi için lütfen GitHub deposunu ziyaret edin.

Spring Boot Partner Eklentisi deposu: https://github.com/chain4travel/camino-messenger-plugin-example-spring-boot