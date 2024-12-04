---
title: Socket.IO protokolü
seoTitle: Socket.IO Protocol Overview
sidebar_position: 4
description: Bu belge, Socket.IO protokolünün 5. sürümünü tanımlamaktadır. İçerisinde bağlantı, veri gönderme ve alma süreçleri ile örnek kodlar yer almaktadır.
tags: 
  - Socket.IO
  - protokol
  - WebSocket
  - Engine.IO
  - JavaScript
keywords: 
  - Socket.IO
  - protokol
  - WebSocket
  - Engine.IO
  - JavaScript
---
Bu belge, Socket.IO protokolünün 5. sürümünü tanımlamaktadır.

Bu belgenin kaynağını [buradan](https://github.com/socketio/socket.io-protocol) bulabilirsiniz.

**İçindekiler**

- `Giriş`
- `Değişim protokolü`
  - `Bir ad alanına bağlanma`
  - `Veri gönderme ve alma`
  - `Onay`
  - `Bir ad alanından bağlantıyı kesme`
- `Paket kodlaması`
  - `Format`
  - `Örnekler`
    - `Bir ad alanına bağlanma`
    - `Veri gönderme ve alma`
    - `Onay`
    - `Bir ad alanından bağlantıyı kesme`
- `Örnek oturum`
- `Tarihçe`
  - `v5 ile v4 arasındaki fark`
  - `v4 ile v3 arasındaki fark`
  - `v3 ile v2 arasındaki fark`
  - `v2 ile v1 arasındaki fark`
  - `İlk revizyon`
- `Test takımı`

## Giriş

Socket.IO protokolü, bir istemci ve bir sunucu arasında [full-duplex](https://en.wikipedia.org/wiki/Duplex_(telecommunications)#FULL-DUPLEX) ve düşük gecikmeli iletişim sağlar.

Bu, WebSocket ve HTTP uzun süreli istekleriyle düşük seviyeli işleri yöneten [Engine.IO protokolü](https://github.com/socketio/engine.io-protocol) üzerine inşa edilmiştir.

Socket.IO protokolü aşağıdaki özellikleri ekler:

- çoklama (Socket.IO jargonunda ["ad alanı"](https://socket.io/docs/v4/namespaces) olarak adlandırılır)

:::tip
JavaScript API'si ile örnek:
:::

*Sunucu*

```js
// ad alanını tanımlama
const namespace = io.of("/admin");
// ad alanına bağlantıyı işleme
namespace.on("connection", (socket) => {
  // ...
});
```

*İstemci*

```js
// ana ad alanına erişme
const socket1 = io();
// "/admin" ad alanına erişme (aynı WebSocket bağlantısıyla)
const socket2 = io("/admin");
// ad alanına bağlantıyı işleme
socket2.on("connect", () => {
  // ...
});
```

- paketlerin onaylanması

JavaScript API'si ile örnek:

```js
// bir tarafta
socket.emit("hello", "foo", (arg) => {
  console.log("alındı", arg);
});

// diğer tarafta
socket.on("hello", (arg, ack) => {
  ack("bar");
});
```

:::info
Referans uygulaması [TypeScript](https://www.typescriptlang.org/) ile yazılmıştır:
- sunucu: https://github.com/socketio/socket.io
- istemci: https://github.com/socketio/socket.io-client
:::

## Değişim protokolü

Bir Socket.IO paketi aşağıdaki alanları içerir:

- bir paket türü (tam sayı)
- bir ad alanı (metin)
- isteğe bağlı, bir yük (Nesne | Dizi)
- isteğe bağlı, bir onay kimliği (tam sayı)

Mevcut paket türlerinin listesi:

| Tür          | ID  | Kullanım                                                                                 |
|--------------|-----|-----------------------------------------------------------------------------------------|
| BAĞLAN       | 0   | `Bir ad alanına bağlanma` sırasında kullanılır.              |
| BAĞLANTIKESİ  | 1   | `Bir ad alanından bağlantıyı kesme` sırasında kullanılır.|
| OLAY         | 2   | Diğer tarafa `veri gönderme` için kullanılır.                   |
| ONAY         | 3   | Bir olayı `onaylamak` için kullanılır.                                         |
| BAĞLANTI_HATASI| 4  | `Bir ad alanına bağlanma` sırasında kullanılır.              |
| İKİLİ_OLAY   | 5   | Diğer tarafa `ikili veri gönderme` için kullanılır.            |
| İKİLİ_ONAY   | 6   | Bir olayı `onaylamak` için kullanılır (yanıt ikili veri içerir).                |

### Bir ad alanına bağlanma

Bir Socket.IO oturumunun başlangıcında, istemci bir `BAĞLAN` paketi göndermelidir:

Sunucu, ya:

- başarılı bir bağlantı durumunda, yük içinde oturum kimliği ile bir `BAĞLAN` paketi ile yanıt vermelidir
- ya da bağlantının izin verilmediği durumlarda bir `BAĞLANTI_HATASI` paketi ile yanıt vermelidir

```
İSTEMCİ                                                      SUNUCU

  │  ───────────────────────────────────────────────────────►  │
  │             { type: BAĞLAN, namespace: "/" }              │
  │  ◄───────────────────────────────────────────────────────  │
  │   { type: BAĞLAN, namespace: "/", data: { sid: "..." } }  │
```

Eğer sunucu öncelikle bir `BAĞLAN` paketi almazsa, bağlantıyı derhal kapatmalıdır.

Bir istemci aynı anda birden fazla ad alanına bağlanabilir, aynı WebSocket bağlantısıyla.

Örnekler:

- ana ad alanı ile (`"/"` olarak adlandırılır)

```
İstemci > { type: BAĞLAN, namespace: "/" }
Sunucu > { type: BAĞLAN, namespace: "/", data: { sid: "wZX3oN0bSVIhsaknAAAI" } }
```

- bir özel ad alanı ile

```
İstemci > { type: BAĞLAN, namespace: "/admin" }
Sunucu > { type: BAĞLAN, namespace: "/admin", data: { sid: "oSO0OpakMV_3jnilAAAA" } }
```

- ek bir yük ile

```
İstemci > { type: BAĞLAN, namespace: "/admin", data: { "token": "123" } }
Sunucu > { type: BAĞLAN, namespace: "/admin", data: { sid: "iLnRaVGHY4B75TeVAAAB" } }
```

- bağlantının reddedildiği durumda

```
İstemci > { type: BAĞLAN, namespace: "/" }
Sunucu > { type: BAĞLANTI_HATASI, namespace: "/", data: { message: "Yetkisiz" } }
```

### Veri gönderme ve alma

Bir `ad alanına bağlanma` sağlandıktan sonra, istemci ve sunucu veri alışverişine başlayabilir:

```
İSTEMCİ                                                      SUNUCU

  │  ───────────────────────────────────────────────────────►  │
  │        { type: OLAY, namespace: "/", data: ["foo"] }      │
  │                                                            │
  │  ◄───────────────────────────────────────────────────────  │
  │        { type: OLAY, namespace: "/", data: ["bar"] }      │
```

Yük zorunludur ve boş olmayan bir dizi olmalıdır. Aksi takdirde, alıcı bağlantıyı kapatmalıdır.

Örnekler:

- ana ad alanı ile

```
İstemci > { type: OLAY, namespace: "/", data: ["foo"] }
```

- özel bir ad alanı ile

```
Sunucu > { type: OLAY, namespace: "/admin", data: ["bar"] }
```

- ikili veri ile

```
İstemci > { type: İKİLİ_OLAY, namespace: "/", data: ["baz", <Buffer <01 02 03 04>> ] }
```

### Onay

Gönderen, alıcıdan bir onay talep etmek için bir olayı ID'si ekleyebilir:

```
İSTEMCİ                                                      SUNUCU

  │  ───────────────────────────────────────────────────────►  │
  │   { type: OLAY, namespace: "/", data: ["foo"], id: 12 }   │
  │  ◄───────────────────────────────────────────────────────  │
  │    { type: ONAY, namespace: "/", data: ["bar"], id: 12 }    │
```

Alıcı, aynı olay ID'si ile bir `ONAY` paketi ile yanıt vermelidir.

Yük zorunludur ve bir dizi (boş olabilir) olmalıdır.

Örnekler:

- ana ad alanı ile

```
İstemci > { type: OLAY, namespace: "/", data: ["foo"], id: 12 }
Sunucu > { type: ONAY, namespace: "/", data: [], id: 12 }
```

- özel bir ad alanı ile

```
Sunucu > { type: OLAY, namespace: "/admin", data: ["foo"], id: 13 }
İstemci > { type: ONAY, namespace: "/admin", data: ["bar"], id: 13 }
```

- ikili veri ile

```
İstemci > { type: İKİLİ_OLAY, namespace: "/", data: ["foo", <buffer <01 02 03 04> ], id: 14 }
Sunucu > { type: ONAY, namespace: "/", data: ["bar"], id: 14 }

veya

Sunucu > { type: OLAY, namespace: "/", data: ["foo" ], id: 15 }
İstemci > { type: İKİLİ_ONAY, namespace: "/", data: ["bar", <buffer <01 02 03 04>], id: 15 }
```

### Bir ad alanından bağlantıyı kesme

Herhangi bir zaman, bir taraf `BAĞLANTIKESİ` paketi göndererek bir ad alanı ile bağlantıyı sonlandırabilir:

```
İSTEMCİ                                                      SUNUCU

  │  ───────────────────────────────────────────────────────►  │
  │           { type: BAĞLANTIKESİ, namespace: "/" }           │
```

Diğer taraftan bir yanıt beklenmez. Düşük seviyeli bağlantı, istemci başka bir ad alanına bağlıysa canlı tutulabilir.

## Paket kodlaması

Bu bölüm, Socket.IO sunucusu ve istemcisinde dahil edilen varsayılan parser tarafından kullanılan kodlamayı detaylandırmaktadır ve kaynak [buradan](https://github.com/socketio/socket.io-parser) bulunabilir.

JavaScript sunucu ve istemci uygulamaları ayrıca, farklı avantajlara sahip özel parser'ları destekler ve belirli uygulama türleri için faydalı olabilir. Lütfen [socket.io-json-parser](https://github.com/socketio/socket.io-json-parser) veya [socket.io-msgpack-parser](https://github.com/socketio/socket.io-msgpack-parser) örneklerine bakın.

Ayrıca, her Socket.IO paketinin bir Engine.IO `message` paketi olarak gönderildiğini unutmayın (daha fazla bilgi [burada](https://github.com/socketio/engine.io-protocol)), dolayısıyla kodlanan sonuç, ağ üzerinden gönderilirken `"4"` karakteri ile ön eklenir (HTTP uzun süreli istekleriyle, ya da WebSocket çerçevesinde).

### Format

```
<paket türü>[<# ikili ek>][<ad alanı>,][<onay id>][JSON-stringified yük ikili olmadan]

+ ikili ekler çıkarıldı
```

Not: ad alanı sadece ana ad alanından (`/`) farklıysa dahil edilir.

### Örnekler

#### Bir ad alanına bağlanma

- ana ad alanı ile

*Paket*

```
{ type: BAĞLAN, namespace: "/" }
```

*Kodlanmış*

```
0
```

- özel bir ad alanı ile

*Paket*

```
{ type: BAĞLAN, namespace: "/admin", data: { sid: "oSO0OpakMV_3jnilAAAA" } }
```

*Kodlanmış*

```
0/admin,{"sid":"oSO0OpakMV_3jnilAAAA"}
```

- bağlantının reddedildiği durumda

*Paket*

```
{ type: BAĞLANTI_HATASI, namespace: "/", data: { message: "Yetkisiz" } }
```

*Kodlanmış*

```
4{"message":"Yetkisiz"}
```

#### Veri gönderme ve alma

- ana ad alanı ile

*Paket*

```
{ type: OLAY, namespace: "/", data: ["foo"] }
```

*Kodlanmış*

```
2["foo"]
```

- özel bir ad alanı ile

*Paket*

```
{ type: OLAY, namespace: "/admin", data: ["bar"] }
```

*Kodlanmış*

```
2/admin,["bar"]
```

- ikili veri ile

*Paket*

```
{ type: İKİLİ_OLAY, namespace: "/", data: ["baz", <Buffer <01 02 03 04>> ] }
```

*Kodlanmış*

```
51-["baz",{"_placeholder":true,"num":0}]

+ <Buffer <01 02 03 04>>
```

- birden fazla ek ile

*Paket*

```
{ type: İKİLİ_OLAY, namespace: "/admin", data: ["baz", <Buffer <01 02>>, <Buffer <03 04>> ] }
```

*Kodlanmış*

```
52-/admin,["baz",{"_placeholder":true,"num":0},{"_placeholder":true,"num":1}]

+ <Buffer <01 02>>
+ <Buffer <03 04>>
```

Lütfen unutmayın ki her Socket.IO paketi, bir Engine.IO `message` paketi içinde sarılır, bu nedenle ağ üzerinde gönderilirken `"4"` karakteri ile ön eklenir.

Örnek: `{ type: OLAY, namespace: "/", data: ["foo"] }` `42["foo"]` olarak gönderilecektir.

#### Onay

- ana ad alanı ile

*Paket*

```
{ type: OLAY, namespace: "/", data: ["foo"], id: 12 }
```

*Kodlanmış*

```
212["foo"]
```

- özel bir ad alanı ile

*Paket*

```
{ type: ONAY, namespace: "/admin", data: ["bar"], id: 13 }
```

*Kodlanmış*

```
3/admin,13["bar"]`
```

- ikili veri ile

*Paket*

```
{ type: İKİLİ_ONAY, namespace: "/", data: ["bar", <Buffer <01 02 03 04>>], id: 15 }
```

*Kodlanmış*

```
61-15["bar",{"_placeholder":true,"num":0}]

+ <Buffer <01 02 03 04>>
```

#### Bir ad alanından bağlantıyı kesme

- ana ad alanı ile

*Paket*

```
{ type: BAĞLANTIKESİ, namespace: "/" }
```

*Kodlanmış*

```
1
```

- özel bir ad alanı ile

```
{ type: BAĞLANTIKESİ, namespace: "/admin" }
```

*Kodlanmış*

```
1/admin,
```

## Örnek oturum

Engine.IO ve Socket.IO protokollerini birleştirirken ağ üzerinde gönderilenlerin bir örneği.

- İstek n°1 (açık paket)

```
GET /socket.io/?EIO=4&transport=polling&t=N8hyd6w
< HTTP/1.1 200 OK
< Content-Type: text/plain; charset=UTF-8
0{"sid":"lv_VI97HAXpY6yYWAAAC","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":5000,"maxPayload":1000000}
```

Detaylar:

```
0           => Engine.IO "açık" paket türü
{"sid":...  => Engine.IO el sıkışma verileri
```

Not: `t` sorgu parametresi, isteğin tarayıcı tarafından önbelleğe alınmadığından emin olmak için kullanılır.

- İstek n°2 (ad alanı bağlantı isteği):

```
POST /socket.io/?EIO=4&transport=polling&t=N8hyd7H&sid=lv_VI97HAXpY6yYWAAAC
< HTTP/1.1 200 OK
< Content-Type: text/plain; charset=UTF-8
40
```

Detaylar:

```
4           => Engine.IO "mesaj" paket türü
0           => Socket.IO "BAĞLAN" paket türü
```

- İstek n°3 (ad alanı bağlantı onayı)

```
GET /socket.io/?EIO=4&transport=polling&t=N8hyd7H&sid=lv_VI97HAXpY6yYWAAAC
< HTTP/1.1 200 OK
< Content-Type: text/plain; charset=UTF-8
40{"sid":"wZX3oN0bSVIhsaknAAAI"}
```

- İstek n°4

`socket.emit('hey', 'Jude')` sunucuda çalıştırıldığında:

```
GET /socket.io/?EIO=4&transport=polling&t=N8hyd7H&sid=lv_VI97HAXpY6yYWAAAC
< HTTP/1.1 200 OK
< Content-Type: text/plain; charset=UTF-8
42["hey","Jude"]
```

Detaylar:

```
4           => Engine.IO "mesaj" paket türü
2           => Socket.IO "OLAY" paket türü
[...]       => içerik
```

- İstek n°5 (mesaj çıktı)

`socket.emit('hello'); socket.emit('world');` istemcide çalıştırıldığında:

```
POST /socket.io/?EIO=4&transport=polling&t=N8hzxke&sid=lv_VI97HAXpY6yYWAAAC
> Content-Type: text/plain; charset=UTF-8
42["hello"]\x1e42["world"]
< HTTP/1.1 200 OK
< Content-Type: text/plain; charset=UTF-8
ok
```

Detaylar:

```
4           => Engine.IO "mesaj" paket türü
2           => Socket.IO "OLAY" paket türü
["hello"]   => 1. içerik
\x1e        => ayırıcı
4           => Engine.IO "mesaj" paket türü
2           => Socket.IO "OLAY" paket türü
["world"]   => 2. içerik
```

- İstek n°6 (WebSocket yükseltmesi)

```
GET /socket.io/?EIO=4&transport=websocket&sid=lv_VI97HAXpY6yYWAAAC
< HTTP/1.1 101 Protocols Switching
```

WebSocket çerçeveleri:

```
< 2probe                                        => Engine.IO probe talebi
> 3probe                                        => Engine.IO probe yanıtı
> 5                                             => Engine.IO "yükseltme" paket türü
> 42["hello"]
> 42["world"]
> 40/admin,                                     => yönetici ad alanına erişim talebi (Socket.IO "BAĞLAN" paketi)
< 40/admin,{"sid":"-G5j-67EZFp-q59rADQM"}       => yönetici ad alanına erişim izni
> 42/admin,1["tellme"]                          => onay ile Socket.IO "OLAY" paketi
< 461-/admin,1[{"_placeholder":true,"num":0}]   => Socket.IO "İKİLİ_ONAY" paketi, yer tutucu ile
< <ikili>                                      => ikili ek (sonraki çerçevede gönderilir)
... bir süre mesaj olmadan sonra
> 2                                             => Engine.IO "ping" paket türü
< 3                                             => Engine.IO "pong" paket türü
> 1                                             => Engine.IO "close" paket türü
```

## Tarihçe

### v5 ile v4 arasındaki fark

Socket.IO protokolünün 5. revizyonu (mevcut) Socket.IO v3 ve üzeri sürümlerde kullanılmaktadır (`v3.0.0` Kasım 2020'de yayınlandı).

Bu, [Engine.IO protokolünün](https://github.com/socketio/engine.io-protocol) 4. revizyonu üzerine inşa edilmiştir (bu nedenle `EIO=4` sorgu parametresi).

Değişikliklerin listesi:

- varsayılan ad alanına örtük bağlantıyı kaldırma

Önceki sürümlerde, bir istemci, başka bir ad alanına erişim talep etse bile her zaman varsayılan ad alanına bağlıydı.

Bu artık böyle değil, istemci her durumda bir `BAĞLAN` paketi göndermelidir.

Commitler: [09b6f23](https://github.com/socketio/socket.io/commit/09b6f2333950b8afc8c1400b504b01ad757876bd) (sunucu) ve [249e0be](https://github.com/socketio/socket.io-client/commit/249e0bef9071e7afd785485961c4eef0094254e8) (istemci).


- `ERROR` ifadesini `BAĞLANTI_HATASI` olarak yeniden adlandırma

Anlamı ve kod numarası (4) değiştirilmemiştir: bu paket türü hala bir ad alanına bağlantının reddedildiğinde sunucu tarafından kullanılmaktadır. Ancak, ismin daha açıklayıcı olduğunu düşünüyoruz.

Commitler: [d16c035](https://github.com/socketio/socket.io/commit/d16c035d258b8deb138f71801cb5aeedcdb3f002) (sunucu) ve [13e1db7c](https://github.com/socketio/socket.io-client/commit/13e1db7c94291c583d843beaa9e06ee041ae4f26) (istemci).


- `BAĞLAN` paketi artık bir yük içerebilir

İstemci, kimlik doğrulama/izin amaçları için bir yük gönderebilir. Örnek:

```json
{
  "type": 0,
  "nsp": "/admin",
  "data": {
    "token": "123"
  }
}
```

Başarı durumunda, sunucu bir yükle Socket kimliğini yanıt olarak döner. Örnek:

```json
{
  "type": 0,
  "nsp": "/admin",
  "data": {
    "sid": "CjdVH4TQvovi1VvgAC5Z"
  }
}
```

Bu değişiklik, Socket.IO bağlantısının kimliğinin, HTTP isteklerinin sorgu parametrelerinde bulunan düşük seviyeli Engine.IO bağlantısının kimliğinden farklı olacağı anlamına gelir.

Commitler: [2875d2c](https://github.com/socketio/socket.io/commit/2875d2cfdfa463e64cb520099749f543bbc4eb15) (sunucu) ve [bbe94ad](https://github.com/socketio/socket.io-client/commit/bbe94adb822a306c6272e977d394e3e203cae25d) (istemci).


- `BAĞLANTI_HATASI` paketinin yükü artık düz bir dize yerine bir nesnedir

Commitler: [54bf4a4](https://github.com/socketio/socket.io/commit/54bf4a44e9e896dfb64764ee7bd4e8823eb7dc7b) (sunucu) ve [0939395](https://github.com/socketio/socket.io-client/commit/09393952e3397a0c71f239ea983f8ec1623b7c21) (istemci).


### v4 ile v3 arasındaki fark

Socket.IO protokolünün 4. revizyonu Socket.IO v1'de (`v1.0.3` Haziran 2014'te yayınlandı) ve v2'de (`v2.0.0` Mayıs 2017'de yayınlandı).

Revizyonun detayları burada bulunabilir: https://github.com/socketio/socket.io-protocol/tree/v4

Bu, [Engine.IO protokolünün](https://github.com/socketio/engine.io-protocol) 3. revizyonu üzerine inşa edilmiştir (bu nedenle `EIO=3` sorgu parametresi).

Değişikliklerin listesi:

- bir `İKİLİ_ONAY` paket türü ekleme

Daha önce, bir `ONAY` paketi her zaman ikili nesneler içerebilecek şekilde değerlendirilmişti, bu da böyle nesneler için yinelemeli arama yapılıp yapılmadığına bakılmaksızın, performansı etkileyebiliyordu.

Referans: https://github.com/socketio/socket.io-parser/commit/ca4f42a922ba7078e840b1bc09fe3ad618acc065

### v3 ile v2 arasındaki fark

Socket.IO protokolünün 3. revizyonu, Socket.IO v1'in ilk sürümlerinde (`socket.io@1.0.0...1.0.2`) kullanılmıştır (Mayıs 2014'te yayınlandı).

Revizyonun detayları burada bulunabilir: https://github.com/socketio/socket.io-protocol/tree/v3

Değişikliklerin listesi:

- ikili nesneleri içeren paketleri kodlamak için msgpack kullanımını kaldırma (bkz. [299849b](https://github.com/socketio/socket.io-parser/commit/299849b00294c3bc95817572441f3aca8ffb1f65))

### v2 ile v1 arasındaki fark

Değişikliklerin listesi:

- bir `İKİLİ_OLAY` paket türü ekleme

Bu, Socket.IO 1.0'a doğru yapılan çalışmalarda, ikili nesneler için destek eklemek amacıyla eklenmiştir. `İKİLİ_OLAY` paketleri [msgpack](https://msgpack.org/) ile kodlanmıştır.

### İlk revizyon

Bu ilk revizyon, Engine.IO protokolü (WebSocket / HTTP uzun süreli istekler, kalp atışı ile düşük seviyeli işler) ve Socket.IO protokolü arasındaki ayrışmanın sonucuydu. Hiçbir Socket.IO sürümünde dahil edilmemiştir, ancak sonraki iterasyonlar için bir temel hazırlamıştır.