---
title: Serileştirme & Sıkıştırma
seoTitle: Serileştirme ve Sıkıştırma ile İlgili Kapsamlı Bilgiler
sidebar_position: 30
description: Bu doküman, Connectin serileştirme ve sıkıştırma mekanizmalarını detaylı olarak ele almaktadır. Protobuf, özel serileştirme, ve sıkıştırma yöntemlerini içermektedir.
tags: 
  - Connect
  - Protobuf
  - Sıkıştırma
  - Serileştirme
  - Go
keywords: 
  - Connect
  - Protobuf
  - Sıkıştırma
  - Serileştirme
  - Go
---
Connect, herhangi bir şema tanım dili ile çalışabilir, ancak Protokol Buffers için yerleşik destek ile birlikte gelir. Protokol Buffer spesifikasyonu, [JSON'a ve JSON'dan eşlemeler](https://developers.google.com/protocol-buffers/docs/proto3#json) içerdiğinden, Protobuf şeması ile tanımlanan herhangi bir Connect API'si JSON'u da destekler. Bu, web tarayıcıları ve cURL ile ad-hoc hata ayıklama için özellikle kullanışlıdır.

:::tip
Connect işleyicileri otomatik olarak JSON kodlu istekleri kabul eder; özel bir yapılandırma gerekmemektedir.
:::

Connect istemcileri varsayılan olarak ikili Protobuf kullanır. İstemcinizi, yerine JSON kullanacak şekilde yapılandırmak için, istemci inşası sırasında `WithProtoJSON()` seçeneğini kullanın.

## Standart Protobuf'un Yerine Geçme

Varsayılan olarak, Connect, Protobuf mesajlarını serileştirmek ve deserileştirmek için `google.golang.org/protobuf` kullanır. Farklı bir Protobuf çalışma zamanı kullanmak için, `"proto"` adını kullanarak `Codec` arayüzünü uygulayın. Ardından, uygulamanızı `WithCodec` seçeneğini kullanarak işleyicilerinize ve istemcilerinize geçirin. Connect, çeşitli dışa aktarılmamış, protokole özel mesajları seri hale getirmek ve ayrıştırmak için özel codec'inizi kullanacaktır, bu nedenle gerekirse standart Protobuf çalışma zamanına geri dönmeyi unutmayın.

## Özel Serileştirme

Tamamen farklı bir serileştirme mekanizmasını desteklemek için, önce `Codec` uygulamanız gerekir. Yeni serileştirme mekanizmanız bir şema kullanıyorsa, aynı zamanda şemadan RPC kodu üretecek bir ikili yazmanız gerekir. Genellikle, bu ikili uygun derleyici için bir eklentidir (örneğin, Thrift için `thriftrw-go`). Bu, göründüğü kadar karmaşık değildir! Go tür parametrelerini kullandığından, Connect fazla üretim kodu gerektirmez.

## Sıkıştırma

Connect istemcileri ve işleyicileri sıkıştırmayı destekler. Genellikle, sıkıştırma yararlıdır — küçük bir CPU kullanım artışı, ağ I/O'daki azalmayı fazlasıyla telafi eder.

Özellikle, Connect _asimetrik_ sıkıştırmayı teşvik eder: istemciler sıkıştırılmamış istekler gönderebilirken, sıkıştırılmış yanıtlar talep edebilir. Yanıtlar genellikle isteklerden daha büyük olduğundan, bu yaklaşım, istemcinin sunucu hakkında herhangi bir varsayımda bulunmadan ağda çoğu veriyi sıkıştırır.

Varsayılan olarak, Connect işleyicileri, standart kütüphanenin `compress/gzip`'ini varsayılan sıkıştırma düzeyi ile kullanarak gzip sıkıştırmasını destekler. Connect istemcileri varsayılan olarak sıkıştırılmamış istekler gönderir ve gzipped yanıtlar talep eder. Sunucunun gzip desteklediğini biliyorsanız, `WithSendGzip` seçeneğini kullanarak talepleri de sıkıştırabilirsiniz.

:::warning
Çoğu sıkıştırma şemasında olduğu gibi, gzip _çok küçük_ mesajların boyutunu artırır. Varsayılan olarak, Connect işleyicileri (ve `WithSendGzip` kullanan istemciler) mesajları boyutlarına bakılmaksızın sıkıştırır. 
:::

Sadece belli bir eşiğin üzerindeki mesajları sıkıştırmak için, işleyici ve istemci inşası sırasında `WithCompressMinBytes` kullanın. Çoğu durumda, bu genel performansı artırır.

Son olarak, unipolar RPC'ler için Connect protokolünü kullanan istemcilerin, `Accept-Encoding` HTTP başlığını kullanarak sıkıştırılmış yanıtlar talep ettiğini belirtmek önemlidir. Bu, standart HTTP anlamı ile eşleşir, böylece tarayıcılar verimli Connect RPC'leri kolaylıkla yapabilir: otomatik olarak sıkıştırılmış yanıtlar talep ederler ve ağ denetimi sekmesi gerekli olduğunda verileri otomatik olarak ayrıştırır. Connect'in `Accept-Encoding` desteği, cURL'ün `--compressed` bayrağı ile de iyi çalışır.

## Özel Sıkıştırma

Go'da, Connect gzip desteği ile gelir çünkü yaygın olarak kullanılır ve standart kütüphaneye dahildir. Brotli veya Zstandard gibi daha yeni sıkıştırma algoritmalarını desteklemek için, önce `Compressor` ve `Decompressor` arayüzlerini uygulayın. İşleyicilerinizi `WithCompression` ile yapılandırın ve istemcilerinizi `WithAcceptCompression` ile yapılandırın. Gerekli olduğunda, sıkıştırma algoritmanız için [IANA adını](https://www.iana.org/assignments/http-parameters/http-parameters.xml#content-coding) kullanmaya dikkat edin (örneğin, Brotli için `br` ve Zstandard için `zstd`). İstemcinizin de sıkıştırılmış istekler göndermesini istiyorsanız, `WithSendCompression` kullanın.