---
title: Engine.IO protokolü
seoTitle: Engine.IO Protokolü - Tam Kılavuz
sidebar_position: 3
description: Bu belgede Engine.IO protokolünün 4. sürümü detaylı bir şekilde tanımlanmaktadır. Protokol, istemci ve sunucu arasında verimli iletişim sağlamak için kullanılan bir yöntemdir.
tags: 
  - Engine.IO
  - Protokol
  - İletişim
  - WebSocket
  - HTTP
keywords: 
  - Engine.IO
  - protokol
  - web teknolojileri
  - iletişim kanalları
  - yazılım geliştirme
---
Bu belge Engine.IO protokolünün 4. sürümünü tanımlamaktadır.

Bu belgenin kaynağı [burada](https://github.com/socketio/engine.io-protocol) bulunabilir.

**İçindekiler**

- `Giriş`
- `Taşımacılıklar`
  - `HTTP uzun-polling`
    - `İstek yolu`
    - `Sorgu parametreleri`
    - `Başlıklar`
    - `Veri gönderme ve alma`
      - `Veri gönderme`
      - `Veri alma`
  - `WebSocket`
- `Protokol`
  - `El sıkışma`
  - `Kalp atışı`
  - `Yükseltme`
  - `Mesaj`
- `Paket kodlama`
  - `HTTP uzun-polling`
  - `WebSocket`
- `Tarihçe`
  - `v2'den v3'e`
  - `v3'ten v4'e`
- `Test paketi`

## Giriş

Engine.IO protokolü, bir istemci ile bir sunucu arasında [full-duplex](https://en.wikipedia.org/wiki/Duplex_(telecommunications)#FULL-DUPLEX) ve düşük maliyetli iletişim sağlar.

Bu protokol, [WebSocket protokolü](https://en.wikipedia.org/wiki/WebSocket) üzerine kuruludur ve WebSocket bağlantısı kurulamazsa, geri dönüş olarak [HTTP uzun-polling](https://en.wikipedia.org/wiki/Push_technology#Long_polling) kullanır.

Referans uygulaması [TypeScript](https://www.typescriptlang.org/) ile yazılmıştır:

- sunucu: https://github.com/socketio/engine.io
- istemci: https://github.com/socketio/engine.io-client

[Socket.IO protokolü](https://github.com/socketio/socket.io-protocol), Engine.IO protokolü tarafından sağlanan iletişim kanalı üzerinde ek özellikler getirerek bu temeller üzerine inşa edilmiştir.

## Taşımacılıklar

Engine.IO istemcisi ile Engine.IO sunucusu arasındaki bağlantı şunlarla kurulabilir:

- `HTTP uzun-polling`
- `WebSocket`

### HTTP uzun-polling

HTTP uzun-polling taşımacılığı (kısaca "polling" olarak da anılır) ardışık HTTP isteğinden oluşur:

- sunucudan veri almak için uzun süreli `GET` istekleri
- sunucuya veri göndermek için kısa süreli `POST` istekleri

#### İstek yolu

HTTP isteklerinin yolu varsayılan olarak `/engine.io/`'dır.

Bu yol, protokol üzerine inşa edilmiş kütüphaneler tarafından güncellenebilir (örneğin, Socket.IO protokolü `/socket.io/` kullanır).

#### Sorgu parametreleri

Aşağıdaki sorgu parametreleri kullanılır:

| İsim        | Değer     | Açıklama                                                        |
|-------------|-----------|------------------------------------------------------------------|
| `EIO`       | `4`       | Zorunlu, protokolün sürümü.                                    | 
| `transport` | `polling` | Zorunlu, taşımacılığın adı.                                    |
| `sid`       | ``   | Zorunlu, oturum kurulduktan sonra oturum kimliği.             |

Eğer zorunlu bir sorgu parametresi eksikse, sunucu HTTP 400 hata durumu ile yanıt vermelidir.

#### Başlıklar

İkili veri gönderirken, gönderen (istemci veya sunucu) `Content-Type: application/octet-stream` başlığını eklemelidir.

Açık bir `Content-Type` başlığı olmadan, alıcı verinin düz metin olduğunu varsaymalıdır.

Referans: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type

#### Veri gönderme ve alma

##### Veri gönderme

Paket göndermek için, bir istemci HTTP `POST` isteği oluşturmalıdır ve paketler isteğin gövdesinde kodlanmalıdır:

```
CLIENT                                                 SERVER

  │                                                      │
  │   POST /engine.io/?EIO=4&transport=polling&sid=...   │
  │ ───────────────────────────────────────────────────► │
  │ ◄──────────────────────────────────────────────────┘ │
  │                        HTTP 200                      │
  │                                                      │
```

Eğer oturum kimliği (`sid` sorgu parametresinden) bilinmiyorsa, sunucu HTTP 400 yanıtı döndürmelidir.

Başarıyı belirtmek için sunucu, yanıt gövdesinde `ok` dizesi ile birlikte HTTP 200 yanıtı döndürmelidir.

Paket sıralamasını sağlamak için, bir istemci birden fazla aktif `POST` isteğine sahip olmamalıdır. Eğer olursa, sunucu HTTP 400 hata durumu döndürmeli ve oturumu kapatmalıdır.

##### Veri alma

Paket almak için, bir istemci HTTP `GET` isteği oluşturmalıdır:

```
CLIENT                                                SERVER

  │   GET /engine.io/?EIO=4&transport=polling&sid=...   │
  │ ──────────────────────────────────────────────────► │
  │                                                   . │
  │                                                   . │
  │                                                   . │
  │                                                   . │
  │ ◄─────────────────────────────────────────────────┘ │
  │                       HTTP 200                      │
```

Eğer oturum kimliği ( `sid` sorgu parametresinden) bilinmiyorsa, sunucu HTTP 400 yanıtı döndürmelidir.

Sunucu, belirtilen oturum için tamponlanmış paket bulunmuyorsa hemen yanıt vermeyebilir. Gönderilecek paketler olduğunda, sunucu bunları kodlamalıdır (bakınız `Paket kodlama`) ve HTTP isteğinin yanıt gövdesinde göndermelidir.

Paket sıralamasını sağlamak için, bir istemci birden fazla aktif `GET` isteğine sahip olmamalıdır. Eğer olursa, sunucu HTTP 400 hata durumu döndürmeli ve oturumu kapatmalıdır.

### WebSocket

WebSocket taşımacılığı, sunucu ile istemci arasında çift yönlü ve düşük gecikmeli bir iletişim kanalı sağlayan bir [WebSocket bağlantısı](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) oluşturur.

Aşağıdaki sorgu parametreleri kullanılır:

| İsim        | Değer       | Açıklama                                                                   |
|-------------|-------------|----------------------------------------------------------------------------|
| `EIO`       | `4`         | Zorunlu, protokolün sürümü.                                               | 
| `transport` | `websocket` | Zorunlu, taşımacılığın adı.                                              |
| `sid`       | ``     | İsteğe bağlı, HTTP uzun-polling'den yükseltmenin olup olmadığına bağlı. |

Eğer zorunlu bir sorgu parametresi eksikse, sunucu WebSocket bağlantısını kapatmalıdır.

Her paket (okuyun veya yazın) kendi [WebSocket çerçevesinde](https://datatracker.ietf.org/doc/html/rfc6455#section-5) gönderilir.

Bir istemci bir oturumda birden fazla WebSocket bağlantısı açmamalıdır. Eğer olursa, sunucu WebSocket bağlantısını kapatmalıdır.

## Protokol

Bir Engine.IO paketi şunlardan oluşur:

- bir paket türü
- isteğe bağlı paket yükü

Mevcut paket türlerinin listesi:

| Tür      | ID  | Kullanım                                            |
|----------|-----|----------------------------------------------------|
| açık     | 0   | `el sıkışma` sırasında kullanılır.   | 
| kapalı   | 1   | Bir taşımacılığın kapatılabileceğini belirtmek için kullanılır. |
| ping     | 2   | `kalp atışı mekanizmasında` kullanılır.   |
| pong     | 3   | `kalp atışı mekanizmasında` kullanılır.   |
| mesaj    | 4   | Diğer tarafa bir yük göndermek için kullanılır.    |
| yükselt  | 5   | `yükseltme işlemi` sırasında kullanılır. |
| noop     | 6   | `yükseltme işlemi` sırasında kullanılır. |

### El sıkışma

Bir bağlantı kurmak için istemci sunucuya HTTP `GET` isteği göndermelidir:

- Varsayılan olarak önce HTTP uzun-polling

```
CLIENT                                                    SERVER

  │                                                          │
  │        GET /engine.io/?EIO=4&transport=polling           │
  │ ───────────────────────────────────────────────────────► │
  │ ◄──────────────────────────────────────────────────────┘ │
  │                        HTTP 200                          │
  │                                                          │
```

- Sadece WebSocket oturumu

```
CLIENT                                                    SERVER

  │                                                          │
  │        GET /engine.io/?EIO=4&transport=websocket         │
  │ ───────────────────────────────────────────────────────► │
  │ ◄──────────────────────────────────────────────────────┘ │
  │                        HTTP 101                          │
  │                                                          │
```

Sunucu bağlantıyı kabul ederse, `open` paketi ile birlikte aşağıdaki JSON biçiminde kodlanmış yükle yanıt vermelidir:

| Anahtar         | Tür        | Açıklama                                                                                                       |
|-----------------|------------|-------------------------------------------------------------------------------------------------------------------|
| `sid`           | `string`   | Oturum kimliği.                                                                                                   |
| `upgrades`      | `string[]` | Mevcut `taşımacılık yükseltmeleri` listesidir.                                                     |
| `pingInterval`  | `number`   | `kalp atışı mekanizmasında` kullanılan ping aralığı (milisaniye cinsinden).                      |
| `pingTimeout`   | `number`   | `kalp atışı mekanizmasında` kullanılan ping zaman aşımı (milisaniye cinsinden).                    |
| `maxPayload`    | `number`   | `yükleri` bir araya getirmek için istemci tarafından kullanılan, her parça için maksimum bayt sayısı. |

Örnek:

```json
{
  "sid": "lv_VI97HAXpY6yYWAAAC",
  "upgrades": ["websocket"],
  "pingInterval": 25000,
  "pingTimeout": 20000,
  "maxPayload": 1000000
}
```

İstemci, sonraki tüm isteklerin sorgu parametrelerinde `sid` değerini göndermelidir.

### Kalp atışı

`El sıkışma` tamamlandıktan sonra, bağlantının canlılığını kontrol etmek için bir kalp atışı mekanizması başlatılır:

```
CLIENT                                                 SERVER

  │                   *** El Sıkışma ***                  │
  │                                                      │
  │  ◄─────────────────────────────────────────────────  │
  │                           2                          │  (ping paketi)
  │  ─────────────────────────────────────────────────►  │
  │                           3                          │  (pong paketi)
```

Belirli bir aralıkta (el sıkışmada gönderilen `pingInterval` değeri) sunucu bir `ping` paketi gönderir ve istemcinin birkaç saniye (ping zaman aşımı değeri) içinde geri bir `pong` paketi göndermesi gerekir.

Eğer sunucu geri bir `pong` paketi almazsa, bağlantının kapandığını kabul etmelidir.

Tersine, eğer istemci `pingInterval + pingTimeout` içinde bir `ping` paketi almazsa, o zaman bağlantının kapandığını kabul etmelidir.

### Yükseltme

Varsayılan olarak, istemci önce HTTP uzun-polling bağlantısı oluşturmalı, ardından kullanılabilir ise daha iyi taşımacılıklara yükseltmelidir.

WebSocket'a yükseltmek için, istemci şunları yapmalıdır:

- HTTP uzun-polling taşımacılığını duraklatmak (artık HTTP isteği gönderilmeyecek), böylece hiçbir paket kaybolmasın
- Aynı oturum kimliği ile bir WebSocket bağlantısı açmak
- Yükde `probe` dizesi ile bir `ping` paketi göndermek

Sunucu şunları yapmalıdır:

- HTTP uzun-polling taşımacılığını düzgün bir şekilde kapatmak için herhangi bir bekleyen `GET` isteğine bir `noop` paketi göndermek (eğer uygunsa)
- Yükde `probe` dizesi ile bir `pong` paketi ile yanıt vermek

Son olarak, istemci yükseltmeyi tamamlamak için bir `upgrade` paketi göndermelidir:

```
CLIENT                                                 SERVER

  │                                                      │
  │   GET /engine.io/?EIO=4&transport=websocket&sid=...  │
  │ ───────────────────────────────────────────────────► │
  │  ◄─────────────────────────────────────────────────┘ │
  │            HTTP 101 (WebSocket el sıkışma)            │
  │                                                      │
  │            -----  WebSocket çerçeveleri -----        │
  │  ─────────────────────────────────────────────────►  │
  │                         2probe                       │ (ping paketi)
  │  ◄─────────────────────────────────────────────────  │
  │                         3probe                       │ (pong paketi)
  │  ─────────────────────────────────────────────────►  │
  │                         5                            │ (yükseltme paketi)
  │                                                      │
```

### Mesaj

`El sıkışma` tamamlandıktan sonra, istemci ve sunucu, verileri `message` paketinde dahil ederek değiştirebilir.

## Paket kodlama

Bir Engine.IO paketinin serileştirilmesi yükün (düz metin veya ikili) türüne ve taşımacılığa bağlıdır.

### HTTP uzun-polling

HTTP uzun-polling taşımacılığının doğası gereği, birden fazla paket, verimliliği arttırmak için tek bir yükte birleştirilebilir.

Format:

```
<paket türü>[<veri>]<separator><paket türü>[<veri>]<separator><paket türü>[<veri>][...]
```

Örnek:

```
4hello\x1e2\x1e4world

şu ile:

4      => mesaj paket türü
hello  => mesaj yükü
\x1e   => ayırıcı
2      => ping paket türü
\x1e   => ayırıcı
4      => mesaj paket türü
world  => mesaj yükü
```

Paketler [kayıt ayrıcı karakter](https://en.wikipedia.org/wiki/C0_and_C1_control_codes#Field_separators): `\x1e` ile ayrılır.

İkili yükler base64 olarak kodlanmalı ve bir `b` karakteriyle ön eklenmelidir:

Örnek:

```
4hello\x1ebAQIDBA==

şu ile:

4         => mesaj paket türü
hello     => mesaj yükü
\x1e      => ayırıcı
b         => ikili ön ek
AQIDBA==  => <01 02 03 04> olarak kodlanmış tampon 
```

İstemci, `el sıkışma` sırasında gönderilen `maxPayload` değerini kullanarak kaç paketin birleştirileceğini belirlemelidir.

### WebSocket

Her Engine.IO paketi kendi [WebSocket çerçevesinde](https://datatracker.ietf.org/doc/html/rfc6455#section-5) gönderilir.

Format:

```
<paket türü>[<veri>]
```

Örnek:

```
4hello

şu ile:

4      => mesaj paket türü
hello  => mesaj yükü (UTF-8 olarak kodlanmış)
```

İkili yükler, değişiklik olmaksızın olduğu gibi gönderilir.

## Tarihçe

### v2'den v3'e

- ikili veri desteği ekleme

Protokolün [2. sürümü](https://github.com/socketio/engine.io-protocol/tree/v2) Socket.IO `v0.9` ve alt sürümlerinde kullanılır.

Protokolün [3. sürümü](https://github.com/socketio/engine.io-protocol/tree/v3) Socket.IO `v1` ve `v2` sürümlerinde kullanılır.

### v3'ten v4'e

- ters ping/pong mekanizması

Ping paketleri şimdi sunucu tarafından gönderilmektedir, çünkü tarayıcılardaki zamanlayıcılar yeterince güvenilir değildir. Birçok zaman aşımı sorununun istemci tarafında zamanlayıcıların gecikmesinden kaynaklandığını düşünüyoruz.

- ikili veri ile yük kodlarken her zaman base64 kullanımı

Bu değişiklik, tüm yükleri (ikili olup olmamalarına bakılmaksızın) aynı şekilde ele almayı sağlar, istemci veya mevcut taşımacılığın ikili veriyi destekleyip desteklemeyeceğini dikkate almadan.

Lütfen bunun yalnızca HTTP uzun-polling için geçerli olduğunu unutmayın. İkili veriler, WebSocket çerçevelerinde ek bir dönüşüm olmaksızın gönderilir.

- karakter sayma yerine bir kayıt ayırıcı (`\x1e`) kullanımı

Karakter sayma, diğer dillerde protokolü uygulamayı zorlaştırdı (veya en azından zorlaştırdı), bu diller UTF-16 kodlaması kullanmayabilir.

Örneğin, `€` `2:4€` olarak kodlanırken, `Buffer.byteLength('€') === 3` olur.

Not: bu, kayıt ayrıcısının verilerde kullanılmadığını varsayıyor.

Protokolün 4. sürümü (mevcut) Socket.IO `v3` ve üzeri sürümlerde bulunmaktadır.

## Test paketi

[`test-suite/`](https://github.com/socketio/engine.io-protocol/tree/main/test-suite) dizinindeki test paketi, bir sunucu uygulamasının uyumluluğunu kontrol etmenizi sağlar.

Kullanım:

- Node.js'te: `npm ci && npm test`
- Tarayıcıda: sadece `index.html` dosyasını tarayıcınızda açmanız yeterlidir.

Referans için, tüm testleri geçmek için JavaScript sunucusu için beklenen yapılandırma:

```js
import { listen } from "engine.io";

const server = listen(3000, {
  pingInterval: 300,
  pingTimeout: 200,
  maxPayload: 1e6,
  cors: {
    origin: "*"
  }
});

server.on("connection", socket => {
  socket.on("data", (...args) => {
    socket.send(...args);
  });
});