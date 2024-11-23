---
sidebar_position: 50
---

# Ağ Protokolü

Camino ağı, Camino düğümleri arasındaki temel iletişim formatını tanımlar. Yük paketleme için  formatını kullanır.

Tanımda "Konteynerler" terimi geniş bir biçimde bahsedilmektedir. Bir Konteyner, basitçe, konsensüs algoritmasının DAG veya Zincir olup olmadığını belirtmek gerektirmeden, bloklar veya düğümler için genel bir terimdir.

## GetVersion

`GetVersion`, bir `Version` mesajının yanıt olarak gönderilmesini talep eder.

`GetVersion` mesajlarında kullanılan OpCode şudur: `0x00`.

### GetVersion Neleri İçerir

Bir `GetVersion` mesajının yükü boştur.

```text
[]
```

### GetVersion Nasıl İşlenir

`GetVersion` mesajını alan bir düğüm, mevcut zamanı ve düğüm sürümünü içeren bir `Version` mesajı ile yanıt vermelidir.

### GetVersion Ne Zaman Gönderilir

`GetVersion`, bir düğüm başka bir düğüme bağlandığında fakat henüz bir `Version` mesajı almadığında gönderilir. Ancak, her zaman yeniden gönderilebilir.

## Version

`Version`, bağlı olduğumuz düğümlerin uyumlu sürümlerinin çalıştığını ve mevcut zaman üzerinde en azından gevşek bir anlaşma sağladığını garanti eder.

`Version` mesajlarında kullanılan OpCode şudur: `0x01`.

### Version Neleri İçerir

`Version`, düğümün Unix zaman formatındaki mevcut zamanını, yani 01/01/1970 tarihinden itibaren geçen milisaniye cinsinden sayıyı ve düğümün çalıştırdığı kodun sürümünü açıklayan bir sürüm dizesini içerir.

İçerik:

```text
[
    Long   <- Unix Zaman Damgası (Saniye)
    String <- Sürüm Dizesi
]
```

### Version Nasıl İşlenir

Eğer sürümler uyumsuzsa veya mevcut zamanlar çok farklıysa, bağlantı sonlandırılacaktır.

### Version Ne Zaman Gönderilir

`Version`, bir `GetVersion` mesajına yanıt olarak gönderilir.

### Version Örneği

`November 16th, 2008 at 12:00am (UTC)` zamanı ve `camino/0.0.1` sürümü ile bir `Version` mesajı göndermek:

```text
[
    Long   <- 1226793600 = 0x00000000491f6280
    String <- "camino/0.0.1"
]
=
[
    0x00, 0x00, 0x00, 0x00, 0x49, 0x1f, 0x62, 0x80,
    0x00, 0x0f, 0x61, 0x76, 0x61, 0x6c, 0x61, 0x6e,
    0x63, 0x68, 0x65, 0x2f, 0x30, 0x2e, 0x30, 0x2e,
    0x31,
]
```

## GetPeers

### Genel Bakış

`GetPeers`, bir `Peers` mesajının yanıt olarak gönderilmesini talep eder.

`GetPeers` mesajlarında kullanılan OpCode şudur: `0x02`.

### GetPeers Neleri İçerir

Bir `GetPeers` mesajının yükü boştur.

```text
[]
```

### GetPeers Nasıl İşlenir

`GetPeers` isteğini alan bir düğüm, bağlı olduğu staking düğümlerinin IP adreslerini içeren bir `Peers` mesajı ile yanıt vermelidir.

### GetPeers Ne Zaman Gönderilir

Bir düğüm, ağdaki katılımcıları keşfetmek için başlarken `GetPeers` mesajlarını gönderir. Ayrıca, ağa yeni düğümler katıldıkça düzenli olarak `GetPeers` mesajları da gönderebilir.

## Peers

### Genel Bakış

`Peers` mesajı, IP adresleri olarak temsil edilen bir meslektaşlar listesini içerir. Not: Bir IP adresi hem IP hem de port numarasını içerir ve hem IPv4 hem de IPv6 formatını destekler.

`Peers` mesajlarında kullanılan OpCode şudur: `0x03`.

### Peers Neleri İçerir

`Peers`, düğümün şu anda bağlı olduğu staking düğümlerinin IP adreslerini içerir.

İçerik:

```text
[
    Değişken Uzunlukta IP Adresi Dizisi
]
```

### Peers Nasıl İşlenir

Bir `Peers` mesajı alındığında, bir düğüm, mesajda görünen düğümleri kendi komşu listesindeki düğümlerle karşılaştırmalı ve yeni düğümlerle bağlantılar kurmalıdır.

### Peers Ne Zaman Gönderilir

`Peers` mesajlarının `GetPeers` mesajına yanıt olarak gönderilmesine gerek yoktur ve yeni katılan düğümleri duyurmak için düzenli olarak gönderilir. Bu tür bir yayımlama gossip'i için varsayılan periyot 60 saniyedir.

### Peers Örneği

IP adresleri `"127.0.0.1:9650"` ve `"[2001:0db8:ac10:fe01::]:12345"` olan bir `Peers` mesajı göndermek:

```text
[
    Değişken Uzunlukta IP Adresi Dizisi <- ["127.0.0.1:9650", "[2001:0db8:ac10:fe01::]:12345"]
]
=
[
    0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff,
    0x7f, 0x00, 0x00, 0x01, 0x25, 0xb2, 0x20, 0x01,
    0x0d, 0xb8, 0xac, 0x10, 0xfe, 0x01, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x39,
]
```

## Get

### Genel Bakış

`Get` mesajı, bir düğümden bir konteyner (blok veya düğüm) talep eder.

`Get` mesajlarında kullanılan OpCode şudur: `0x04`.

### Get Neleri İçerir

Bir `Get` mesajı, bir `SubnetID`, bir `RequestID` ve bir `ContainerID` içerir.

**`SubnetID`**, bu mesajın hedeflendiği subneti tanımlar.

**`RequestID`**, bir düğüm tarafından gönderilen mesajları takip etmeye yardımcı olan bir sayaçtır. Her seferinde özgün bir `RequestID` oluşturulur.

**`ContainerID`**, talep edilen konteynerin tanımlayıcısıdır.

```text
[
    Uzunluk 32 Bayt Dizisi <- SubnetID
    UInt                     <- RequestID
    Uzunluk 32 Bayt Dizisi <- ContainerID
]
```

### Get Nasıl İşlenir

Düğüm, belirtilen `SubnetID`, `RequestID` ve `ContainerID` ile aynı `Put` mesajı ile yanıt vermeli ve talep edilen `Container` ile birlikte göndermelidir. Doğru durumlarda, bir düğümden sadece sahip olduğu bir konteyner talep edilmelidir. Bu nedenle, eğer düğüm belirtilen konteynere sahip değilse, `Get` mesajı güvenle atılabilir.

### Get Ne Zaman Gönderilir

Bir düğüm, bir konteynerin varlığı hakkında bilgi veren bir düğüme `Get` mesajı gönderir. Örneğin, Rick ve Morty adlı iki düğüm olduğunu varsayalım. Eğer Rick, Morty'nin sahibi olmadığı bir `ContainerID` içeren bir `PullQuery` mesajı gönderirse, Morty eksik `ContainerID`'yi içeren bir `Get` mesajı gönderir.

### Get Örneği

```text
[
    SubnetID    <- 0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20
    RequestID   <- 43110 = 0x0000A866
    ContainerID <- 0x2122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f40
]
=
[
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10,
    0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
    0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20,
    0x00, 0x00, 0xa8, 0x66, 0x21, 0x22, 0x23, 0x24,
    0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c,
    0x2d, 0x2e, 0x2f, 0x30, 0x31, 0x32, 0x33, 0x34,
    0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x3b, 0x3c,
    0x3d, 0x3e, 0x3f, 0x40,
]
```

## Put

### Genel Bakış

Bir `Put` mesajı, düğüme bir talep edilen konteyneri sağlar.

`Put` mesajlarında kullanılan OpCode şudur: `0x05`.

### Put Neleri İçerir

Bir `Put` mesajı, bir `SubnetID`, bir `RequestID`, bir `ContainerID` ve `Container` içerir.

**`SubnetID`**, bu mesajın hedeflendiği subneti tanımlar.

**`RequestID`**, bir düğüm tarafından gönderilen mesajları takip etmeye yardımcı olan bir sayaçtır.

**`ContainerID`**, bu mesajın gönderdiği konteynerin tanımlayıcısıdır.

**`Container`**, bu mesajın gönderdiği konteynerin baytlarıdır.

```text
[
    Uzunluk 32 Bayt Dizisi       <- SubnetID
    UInt                       <- RequestID
    Uzunluk 32 Bayt Dizisi       <- ContainerID
    Değişken Uzunlukta Bayt Dizisi <- Container
]
```

### Put Nasıl İşlenir

Düğüm, konteyneri konsensüse eklemeye çalışmalıdır.

### Put Ne Zaman Gönderilir

Bir düğüm, erişim sağladığı bir konteyner için bir `Get` mesajı aldığında bir `Put` mesajı gönderir.

### Put Örneği

```text
[
    SubnetID    <- 0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20
    RequestID   <- 43110 = 0x0000A866
    ContainerID <- 0x5ba080dcf6861c94c24ec62bc09a3c8b0fdd4691ebf02491e0e921dd0c77206f
    Container   <- 0x2122232425
]
=
[
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10,
    0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
    0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20,
    0x00, 0x00, 0xa8, 0x66, 0x5b, 0xa0, 0x80, 0xdc,
    0xf6, 0x86, 0x1c, 0x94, 0xc2, 0x4e, 0xc6, 0x2b,
    0xc0, 0x9a, 0x3c, 0x8b, 0x0f, 0xdd, 0x46, 0x91,
    0xeb, 0xf0, 0x24, 0x91, 0xe0, 0xe9, 0x21, 0xdd,
    0x0c, 0x77, 0x20, 0x6f, 0x00, 0x00, 0x00, 0x05,
    0x21, 0x22, 0x23, 0x24, 0x25,
]
```

## PushQuery

### Genel Bakış

Bir `PushQuery` mesajı, belirtilen `ContainerID` konsensüse eklendikten sonra düğümden tercih edilen konteyner ID'lerini talep eder. Eğer `ContainerID` bilinmiyorsa, `Container` iyimser bir şekilde sağlanır.

`PushQuery` mesajlarında kullanılan OpCode şudur: `0x06`.

### PushQuery Neleri İçerir

Bir `PushQuery` mesajı, bir `SubnetID`, bir `RequestID`, bir `ContainerID` ve `Container` içerir.

**`SubnetID`**, bu mesajın hedeflendiği subneti tanımlar.

**`RequestID`**, bir düğüm tarafından gönderilen mesajları takip etmeye yardımcı olan bir sayaçtır.

**`ContainerID`**, bu mesajın gönderilmeden önce konsensüse eklenmiş olmasını beklediği konteynerin tanımlayıcısıdır.

**`Container`**, `ContainerID` ile tanımlanan konteynerin baytlarıdır.

```text
[
    Uzunluk 32 Bayt Dizisi       <- SubnetID
    UInt                       <- RequestID
    Uzunluk 32 Bayt Dizisi       <- ContainerID
    Değişken Uzunlukta Bayt Dizisi <- Container
]
```

### PushQuery Nasıl İşlenir

Düğüm, konteyneri konsensüse eklemeye çalışmalıdır. Konteyner konsensüse eklendikten sonra, düğümün güncel tercih(ler) ile `Chits` mesajı gönderilmelidir.

### PushQuery Ne Zaman Gönderilir

Bir düğüm, bu düğümün güncel tercihlerini öğrenmek istiyorsa ve bunun mümkün olduğunu düşünüyorsa `PushQuery` mesajı göndermelidir. Düğüm, yeni bir konteyner öğrendiğinde veya bir süredir bekleyen konteynerler olduğunda düğümlerin tercihlerini öğrenmek isteyecektir.

### PushQuery Örneği

```text
[
    SubnetID    <- 0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20
    RequestID   <- 43110 = 0x0000A866
    ContainerID <- 0x5ba080dcf6861c94c24ec62bc09a3c8b0fdd4691ebf02491e0e921dd0c77206f
    Container   <- 0x2122232425
]
=
[
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10,
    0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
    0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20,
    0x00, 0x00, 0xa8, 0x66, 0x5b, 0xa0, 0x80, 0xdc,
    0xf6, 0x86, 0x1c, 0x94, 0xc2, 0x4e, 0xc6, 0x2b,
    0xc0, 0x9a, 0x3c, 0x8b, 0x0f, 0xdd, 0x46, 0x91,
    0xeb, 0xf0, 0x24, 0x91, 0xe0, 0xe9, 0x21, 0xdd,
    0x0c, 0x77, 0x20, 0x6f, 0x00, 0x00, 0x00, 0x05,
    0x21, 0x22, 0x23, 0x24, 0x25,
]
```

## PullQuery

### Genel Bakış

Bir `PullQuery` mesajı, belirtilen `ContainerID`'nin konsensüse eklendikten sonra düğümden tercih edilen konteyner ID'lerini talep eder.

`PullQuery` mesajlarında kullanılan OpCode şudur: `0x07`.

### PullQuery Neleri İçerir

Bir `PullQuery` mesajı, bir `SubnetID`, bir `RequestID` ve bir `ContainerID` içerir.

**`SubnetID`**, bu mesajın hedeflendiği subneti tanımlar.

**`RequestID`**, bir düğüm tarafından gönderilen mesajları takip etmeye yardımcı olan bir sayaçtır.

**`ContainerID`**, bu mesajın gönderilmeden önce konsensüse eklenmiş olmasını beklediği konteynerin tanımlayıcısıdır.

```text
[
    Uzunluk 32 Bayt Dizisi <- SubnetID
    UInt                 <- RequestID
    Uzunluk 32 Bayt Dizisi <- ContainerID
]
```

### PullQuery Nasıl İşlenir

Eğer düğüm `ContainerID`'yi eklememişse, konteyneri konsensüse eklemeye çalışmalıdır. Konteyner konsensüse eklendikten sonra, düğümün güncel tercih(ler) ile `Chits` mesajı göndermelidir.

### PullQuery Ne Zaman Gönderilir

Bir düğüm, bu düğümün güncel tercihlerini öğrenmek istiyorsa ve bunun oldukça olası olduğunu düşünüyorsa `PullQuery` mesajı göndermelidir. Düğüm, yeni bir konteyner öğrendiğinde veya bir süredir bekleyen konteynerler olduğunda düğümlerin tercihlerini öğrenmek isteyecektir.

### PullQuery Örneği

```text
[
    SubnetID    <- 0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20
    RequestID   <- 43110 = 0x0000A866
    ContainerID <- 0x5ba080dcf6861c94c24ec62bc09a3c8b0fdd4691ebf02491e0e921dd0c77206f
]
=
[
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10,
    0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
    0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20,
    0x00, 0x00, 0xa8, 0x66, 0x5b, 0xa0, 0x80, 0xdc,
    0xf6, 0x86, 0x1c, 0x94, 0xc2, 0x4e, 0xc6, 0x2b,
    0xc0, 0x9a, 0x3c, 0x8b, 0x0f, 0xdd, 0x46, 0x91,
    0xeb, 0xf0, 0x24, 0x91, 0xe0, 0xe9, 0x21, 0xdd,
    0x0c, 0x77, 0x20, 0x6f,
]
```

## Chits

### Genel Bakış

Bir `Chits` mesajı, düğüme tercih edilen bir veya birden fazla konteyner setini sağlar.

`Chits` mesajlarında kullanılan OpCode şudur: `0x08`.

### Chits Neleri İçerir

Bir `Chits` mesajı, bir `SubnetID`, bir `RequestID`, ve `Preferences` içerir.

**`SubnetID`**, bu mesajın hedeflendiği subneti tanımlar.

**`RequestID`**, bir düğüm tarafından gönderilen mesajları takip etmeye yardımcı olan bir sayaçtır.

**`Preferences`**, düğümün tercihlerini tam olarak tanımlayan konteyner ID'leri listesidir.

```text
[
    Uzunluk 32 Bayt Dizisi                         <- SubnetID
    UInt                                         <- RequestID
    Değişken Uzunluk (Uzunluk 32 Bayt Dizisi) Dizisi <- Preferences
]
```

### Chits Nasıl İşlenir

Düğüm, referans verilen konteynerleri konsensüse eklemeye çalışmalıdır. Eğer referans verilen konteynerler eklenemezse, düğüm eksik konteynerleri göz ardı edebilir ve kalan chits'i oylamaya uygulayabilir. Oylama tamamlandıktan sonra, konteyner güvenleri uygun şekilde güncellenmelidir.

### Chits Ne Zaman Gönderilir

Bir düğüm, konsensüse eklediği bir konteyner için bir `PullQuery` veya `PushQuery` mesajı aldığında bir `Chits` mesajı gönderir.

### Chits Örneği

```text
[
    SubnetID    <- 0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20
    RequestID   <- 43110 = 0x0000A866
    Preferences <- [
        0x2122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f40,
        0x4142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f60,
    ]
]
=
[
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
        0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10,
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
        0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20,
        0x00, 0x00, 0xa8, 0x66, 0x00, 0x00, 0x00, 0x02,
        0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28,
        0x29, 0x2a, 0x2b, 0x2c, 0x2d, 0x2e, 0x2f, 0x30,
        0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38,
        0x39, 0x3a, 0x3b, 0x3c, 0x3d, 0x3e, 0x3f, 0x40,
        0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48,
        0x49, 0x4a, 0x4b, 0x4c, 0x4d, 0x4e, 0x4f, 0x50,
        0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58,
        0x59, 0x5a, 0x5b, 0x5c, 0x5d, 0x5e, 0x5f, 0x60,
]