---
title: Tanıtım
seoTitle: Connect Tarayıcı ve gRPC Uyumlu HTTP APIleri Oluşturma
sidebar_position: 1
description: Connect, tarayıcı ve gRPC uyumlu HTTP APIleri oluşturmak için tasarlanmış bir kütüphane setidir. Yalnızca gerekli olan temel özellikler üzerinde inşa edilmiştir.
tags: 
  - API
  - gRPC
  - HTTP
  - Connect
  - Protokol Buffers
keywords: 
  - API
  - gRPC
  - HTTP
  - Connect
  - Protokol Buffers
---
Connect, tarayıcı ve gRPC uyumlu HTTP API'leri oluşturmak için bir dizi kütüphaneden oluşan bir ailedir: kısa bir [Protokol Buffer][protobuf] şeması yazarsınız ve uygulama mantığınızı uygularsınız, Connect ise marshaling, yönlendirme, sıkıştırma ve içerik türü müzakere işlemlerini yönetmek için kod üretir. Ayrıca, desteklenen herhangi bir dilde, deyimsel ve tür güvenli bir istemci oluşturur.

## Üretim Seviyesi Sadelik

Her Connect uygulaması _odaklanmıştır_: sadece gerekli olan temel özellikler, zamanla kanıtlanmış HTTP kütüphanelerinin üzerine inşa edilmiştir ve size engel olmaktan tasarlanmıştır. Go'da, Connect sadece [bir paket][connect-go]tır – bir öğleden sonra okumak için yeterince kısa.

:::tip
Connect, üretim seviyesinde RPC vizyonumuzdur. Basit, güvenilir ve rahatsız etmeyen bir yapıya sahiptir, çünkü kimsenin karmaşık ağlarla ilgili hata ayıklama ya da yüzlerce anlaşılmaz seçenek arasında siftah yapmaya zamanı yoktur.
:::

En önemlisi, Connect istikrarlıdır. Geriye dönük uyumluluğa _çok_ ciddi bakıyoruz ve bir kararlı sürüm etiketledikten sonra derlemenizi asla bozmayacağız.

## Kesintisiz Çoklu Protokol Desteği

Connect sunucuları ve istemcileri üç protokolü destekler: gRPC, gRPC-Web ve Connect'in kendi protokolü.

- Connect, [gRPC protokolünü][grpc-protocol] tam olarak destekler; akış, trailerlar ve hata ayrıntılarını içerir. Herhangi bir gRPC istemcisi, herhangi bir dilde, bir Connect sunucusunu arayabilir ve Connect istemcileri de herhangi bir gRPC sunucusunu arayabilir. gRPC uyumluluğumuzu Google'ın kendi etkileşim testlerinin [geliştirilmiş bir versiyonu][connect-conformance] ile doğruluyoruz.
- Connect ayrıca [grpc/grpc-web][grpcweb] tarafından kullanılan [gRPC-Web protokolünü][grpcweb-protocol] doğrudan destekler; Envoy gibi bir çevirme proxy'sine dayanmaz.
- Son olarak, Connect, [kendi protokolünü][connect-protocol] destekler: HTTP/1.1, HTTP/2 ve HTTP/3 üzerinde çalışan, doğrudan bir HTTP tabanlı protokoldür. gRPC ve gRPC-Web'in en iyi yönlerini, akış da dahil olmak üzere, alır ve bunları tarayıcılarda, monolitlerde ve mikro hizmetlerde de rahatça işleyen bir protokolde paketler. Varsayılan olarak, uygulamalar hem JSON hem de ikili kodlanmış Protobuf'u destekler. Canlı [demo servisimizle][demo] cURL ile arama yapabilirsiniz:

```bash
curl \
    --header "Content-Type: application/json" \
    --data '{"sentence": "I feel happy."}' \
    https://demo.connectrpc.com/connectrpc.eliza.v1.ElizaService/Say
```

Varsayılan olarak, Connect sunucuları üç protokolden gelen verileri destekler. İstemciler varsayılan olarak Connect protokolünü kullanır, ancak bir yapılandırma anahtarı ile gRPC veya gRPC-Web'e geçebilirler - daha fazla kod değişikliği gerekli değildir. Hata, başlık, trailer ve akış için API'ler tamamen protokolden bağımsızdır.

## Go

Connect'in Go uygulaması istikrarlıdır ve birkaç firma (Buf dahil) tarafından üretimde kullanılmaktadır. Şimdi [`connect-go` ile başlamaya][go-getting-started] başlayabilirsiniz.

## TypeScript ve JavaScript

ECMAScript için Connect istikrarlıdır ve birkaç firma (Buf dahil) tarafından üretimde kullanılmaktadır. Şimdi [web'de][web-getting-started] veya [Node.js'de][node-getting-started] başlayabilirsiniz.

## Swift ve Kotlin

Mobil uygulamalar için, [`connect-swift`][connect-swift] ve [`connect-kotlin`][connect-kotlin] artık beta sürümünde mevcuttur. Bugün [Swift kılavuzumuzla][swift-getting-started] ve [Kotlin kılavuzumuzla][kotlin-getting-started] başlayın.

## Sonraki Adımlar?

Mevcut Connect uygulamalarımızı geliştirmeye ek olarak, sonunda Connect'i daha fazla dil ve çerçeveye getirmek istiyoruz. Geçerli yol haritamız her zaman [GitHub tartışmalarımızda][announcement-discussions] üstte yer alır ve yeni diller için ilgi ölçümünü [GitHub anketleri][poll-discussions] ile yapıyoruz.