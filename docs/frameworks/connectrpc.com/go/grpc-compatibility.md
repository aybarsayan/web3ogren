---
title: gRPC Uyumluluğu
seoTitle: gRPC Compatibility
sidebar_position: 20
description: gRPC ve gRPC-Web protokollerinin desteklenmesi ve uygulama detayları. Uyumluluk için gereksinimler ve en iyi uygulama ipuçları.
tags: 
  - gRPC
  - gRPC-Web
  - Connect
  - Protobuf
  - sağlık kontrolü
keywords: 
  - gRPC
  - gRPC-Web
  - Connect
  - Protobuf
  - sağlık kontrolü
---
Connect, gRPC ve gRPC-Web protokollerini tam olarak desteklemektedir, akış dahil. Bu protokollerin uygulamasını, Google'ın kendi etkileşim testlerinin [geliştirilmiş bir versiyonu][connect-conformance] ile doğruluyoruz.

## İşleyiciler

İşleyiciler varsayılan olarak gRPC protokolünü destekler: `grpc-go`, `grpcurl` ve diğer TLS kullanan gRPC istemcileri ile özel bir yapılandırmaya gerek kalmadan çalışırlar. TLS kullanılmadan HTTP/2 ile çalışan gRPC istemcilerini desteklemek için, `dağıtım belgelerinde` açıklandığı gibi `golang.org/x/net/http2/h2c` kullanın.

:::tip
**İpucu:** İşleyicilerin otomatik desteklediği protokollere dikkat edin.
:::

İşleyiciler ayrıca, çevirici bir proxyye ihtiyaç duymadan doğrudan ikili gRPC-Web protokolünü otomatik olarak destekler. Modern tarayıcılar ikili yükleri desteklediğinden, Connect gRPC-Web'in metin modunu desteklememektedir: `protoc-gen-grpc-web` kullanıyorsanız, kod oluştururken `mode=grpcweb` kullanmanız gerekir.

Birçok gRPC'ye özel araç, çağırıcıların servisinizin Protobuf şemasına çalışma zamanında erişmesini sağlayan sunucu yansımasına bağımlıdır. Connect, `connectrpc.com/grpcreflect` paketi ile sunucu yansımasını destekler. GRPC sunucu yansıma API'sinin iki versiyonu olduğunu ve birçok aracın (içinde `grpcurl` de dahil) hala daha eski sürümü kullandığını unutmamalısınız; çoğu hizmet hem `grpcreflect.NewHandlerV1` hem de `grpcreflect.NewHandlerV1Alpha`'dan işleyicileri monte etmelidir.

Konteyner orkestrasyonu ve sağlık kontrol sistemleri genellikle gRPC sağlık kontrol API'sini destekler. Daha geleneksel HTTP kontrolleri yerine gRPC tarzı sağlık kontrolleri tercih ediyorsanız, `connectrpc.com/grpchealth` kullanın.

## İstemciler

İstemciler varsayılan olarak Connect protokolünü kullanır. gRPC veya gRPC-Web protokollerini kullanmak için, istemci inşası sırasında `WithGRPC` veya `WithGRPCWeb` seçeneklerini kullanın. Eğer gRPC sunucusu TLS kullanıyorsa, Connect istemcileri daha fazla yapılandırma olmadan çalışır. gRPC sunucusu HTTP/2 kullanıyorsa ancak TLS yoksa, HTTP istemcinizi `dağıtım belgelerinde` açıklandığı gibi `golang.org/x/net/http2` kullanarak yapılandırın.

:::info
**Önemli Bilgi:** TLS yapılandırmasına dikkat edin; bu istemci güvenliği için kritiktir.
:::

## Göç

Mevcut bir `grpc-go` hizmetini `connect-go`'ya geçirmek için kesin bir rehber yoktur; her kod tabanı farklı bir `grpc-go` özellik alt kümesi kullanır ve biraz farklı bir yaklaşım gerektirir. Birçok RPC çerçevesinin göçlerinden farklı olarak, hizmetinizin istemcilerini değiştirmeniz gerekmediğini unutmayın: mevcut gRPC istemcilerini kullanmaya devam edebilirler. Mevcut Protobuf şemanız da değişiklik olmadan çalışacaktır.

Kod tabanınızın detayları benzersiz olacaktır, ancak çoğu göç birkaç ortak adım içerir:

1. `protoc-gen-connect-go` ile kod üretmeye başlayın. Göç sırasında kodunuz, `connect-go` ve `grpc-go` kodunu sorunsuz bir şekilde içe aktarabilir.
2. Hizmet uygulamalarınızı, `connect.Request` ile sarılmış Protobuf mesajlarını kabul edecek şekilde değiştirin ve döndürdüğünüz yanıt mesajlarını `connect.NewResponse` kullanarak sarın. Metadata okumak ve yazmak için bağlam tabanlı API'ler yerine, `connect.Request` ve `connect.Response` türlerini doğrudan kullanın.
3. Gerektiğinde, hizmet uygulamalarınızın Connect hatalarını döndürecek şekilde değiştirin. Connect ve gRPC aynı hata kodlarını kullandığından, genellikle `status.Error` ile `connect.NewError`'ı basit bir şekilde değiştirmeniz yeterlidir.
4. Herhangi bir akış işleyicisini Connect akış türlerini kullanacak şekilde göç edin. Bunlar, `grpc-go` eşdeğerleriyle geniş ölçüde benzerlik gösterir.
5. Hizmet uygulamalarınızı Connect'e göç ettirdikten sonra, `main` fonksiyonunuzu `grpc-go` yerine bir `net/http` sunucusu kullanacak şekilde değiştirin. Hizmetinizin istemcileri TLS kullanmıyorsa, `h2c'yi` kullanmayı unutmayın. Bu noktada, yarı yolda kalmış olursunuz: hizmetiniz derlenmeli ve akıştaki hizmetlere çağrılarınızı göç ettirmeden dağıtabilirsiniz.
6. Sonra, aşağıya doğru olan çağrılarınızı ele alın. Connect’in oluşturduğu istemci türlerine geçin ve istek mesajlarını `connect.NewRequest` ile sarın. Bağlam tabanlı API'ler yerine, istek başlıklarını doğrudan isteğe ayarlayın. Çağrı seçeneklerini kullanmak yerine, `connect.Response`'dan yanıt meta verilerini doğrudan okuyun. İstemcinizi oluştururken `WithGRPC` kullanmayı unutmayın ve gerekirse `HTTP istemcilerinizi h2c kullanacak şekilde yapılandırın`.
7. Gerektiğinde, `status.Code` ve `status.FromError`'dan `connect.CodeOf` ve standart kütüphanenin `errors.As`'ına geçin.
8. Herhangi bir akış çağrısını Connect akış türlerine göç edin.
9. Tamamladınız! Hizmetiniz istemcileriyle aynı depoda değilse, `protoc-gen-go-grpc` ile kod üretmeyi bırakabilirsiniz.

> **Not:** İleri düzey özellikler ve eğitimler için [connect-conformance][connect-conformance] kaynaklarına göz atın.

[connect-conformance]: https://github.com/connectrpc/conformance