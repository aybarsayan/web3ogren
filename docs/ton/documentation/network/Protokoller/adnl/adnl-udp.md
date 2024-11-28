# ADNL UDP - Düğümler Arası

ADNL üzerindeki UDP, düğümler ve TON bileşenlerinin birbirleriyle iletişim kurması için kullanılmaktadır. Bu, DHT ve RLDP gibi diğer, daha yüksek seviyeli TON protokollerinin çalıştığı düşük seviyeli bir protokoldür. 

:::tip
Bu makalede, düğümler arasında temel iletişim için ADNL'nin UDP üzerindeki işleyişini öğreneceğiz.
:::

ADNL'nin TCP üzerindeki uygulamasının aksine, UDP uygulamasında el sıkışma farklı bir biçimde gerçekleşir ve ek bir katman şeklinde kanallar kullanılır ama diğer ilkeler benzerdir: 
şifreleme anahtarları da özel anahtarımız ve önceden yapılandırma dosyasından bilinen veya diğer ağ düğümlerinden alınan eşleşen düğümün genel anahtarına dayanarak oluşturulur.

:::info
ADNL'nin UDP versiyonunda, bağlantı başlatıcı 'kanal oluştur' mesajını gönderdiğinde, ilk verilerin alınmasıyla birlikte aynı anda kurulmaktadır; kanalın anahtarı hesaplanacak ve kanalın oluşturulması onaylanacaktır.
:::

Kanal kurulduktan sonra, daha fazla iletişim kanalda devam edecektir.

## Paket Yapısı ve İletişim

### İlk Paketler

Protokolün nasıl çalıştığını anlamak için DHT düğümü ile bağlantının başlatılmasını ve onun adreslerinin imzalı listesinin alınmasını analiz edelim.

Beğendiğiniz düğümü [global config](https://ton-blockchain.github.io/global.config.json) içinde, `dht.nodes` bölümünde bulabilirsiniz. Örneğin:

```json
{
  "@type": "dht.node",
  "id": {
    "@type": "pub.ed25519",
    "key": "fZnkoIAxrTd4xeBgVpZFRm5SvVvSx7eN3Vbe8c83YMk="
  },
  "addr_list": {
    "@type": "adnl.addressList",
    "addrs": [
      {
        "@type": "adnl.address.udp",
        "ip": 1091897261,
        "port": 15813
      }
    ],
    "version": 0,
    "reinit_date": 0,
    "priority": 0,
    "expire_at": 0
  },
  "version": -1,
  "signature": "cmaMrV/9wuaHOOyXYjoxBnckJktJqrQZ2i+YaY3ehIyiL3LkW81OQ91vm8zzsx1kwwadGZNzgq4hI4PCB/U5Dw=="
}
```

**1.** ED25519 anahtarını `fZnkoIAxrTd4xeBgVpZFRm5SvVvSx7eN3Vbe8c83YMk` alalım ve base64'ten çözümleyelim.  
**2.** IP adresini `1091897261` alalım ve anlaşılabilir bir formata dönüştürelim, [hizmet](https://www.browserling.com/tools/dec-to-ip) kullanarak ya da little endian byte dönüşümüyle elde edeceğimiz sonuç `65.21.7.173` olacaktır.  
**3.** Port ile birleştirerek `65.21.7.173:15813` elde edelim ve bir UDP bağlantısı kuralım.

:::note
Bir düğümle iletişim kurmak ve bazı bilgiler almak amacıyla bir kanal açmak istiyoruz ve ana görevimiz - ondan imzalı adreslerin bir listesini almak. 
Bunu yapmak için iki mesaj üreteceğiz, ilki - [kanal oluştur](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L129):
:::

```tlb
adnl.message.createChannel key:int256 date:int = adnl.Message
```

Burada iki parametre var - anahtar ve tarih. Tarih olarak mevcut unix zaman damgasını belirteceğiz. Anahtar için ise - kanal için özel olarak yeni bir ED25519 özel+genel anahtar çifti oluşturmalıyız, bunlar `kamusal şifreleme anahtarının` başlatılmasında kullanılacaktır. Mesajın `key` parametresinde oluşturduğumuz genel anahtarı kullanacağız ve özel anahtarı şimdilik saklayacağız.

Doldurulmuş TL yapısını serialize edelim ve şunu elde edelim:

```
bbc373e6                                                         -- TL ID adnl.message.createChannel 
d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7 -- key
555c8763                                                         -- date
```

Sonraki adımda, ana sorgumuza geçelim - [adreslerin listesini al](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L198). 

Bunu gerçekleştirmek için önce TL yapısını serialize etmemiz gerekiyor:

```tlb
dht.getSignedAddressList = dht.Node
```
Parametresi yok, bu yüzden sadece serialize ediyoruz. Sadece id'si `ed4879a9` olacak.

Daha sonra, bu DHT protokolünün daha yüksek seviyeli bir isteği olduğundan, önce bunu bir `adnl.message.query` TL yapısına sarmamız gerekiyor:

```tlb
adnl.message.query query_id:int256 query:bytes = adnl.Message
```

`query_id` olarak rastgele 32 byte üreteceğiz, `query` olarak ise ana isteğimizi kullanacağız, `byte dizisi olarak sarılmış`. 

Sonunda şunu elde edeceğiz:

```
7af98bb4                                                         -- TL ID adnl.message.query
d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875 -- query_id
04 ed4879a9 000000                                               -- query
```

---

### Paket Oluşturma

Tüm iletişim paketleri kullanılarak gerçekleştirilir, içeriği [TL yapısı](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L81) ile belirlenir:

```tlb
adnl.packetContents 
  rand1:bytes                                     -- rastgele 7 veya 15 byte
  flags:#                                         -- bit bayrakları, daha ileri alanların mevcudiyetini belirlemek için kullanılır
  from:flags.0?PublicKey                          -- gönderenin genel anahtarı
  from_short:flags.1?adnl.id.short                -- gönderenin kimliği
  message:flags.2?adnl.Message                    -- mesaj (sadece bir mesaj varsa kullanılır)
  messages:flags.3?(vector adnl.Message)          -- mesajlar (1'den fazla varsa)
  address:flags.4?adnl.addressList                -- adreslerimizin listesi
  priority_address:flags.5?adnl.addressList       -- öncelikli adreslerimizin listesi
  seqno:flags.6?long                              -- paket sıralama numarası
  confirm_seqno:flags.7?long                      -- alınan son paketin sıralama numarası
  recv_addr_list_version:flags.8?int              -- adres sürümü 
  recv_priority_addr_list_version:flags.9?int     -- öncelikli adres sürümü
  reinit_date:flags.10?int                        -- bağlantı yeniden başlatma tarihi (sayacın sıfırlanması)
  dst_reinit_date:flags.10?int                    -- son alınan paket ile bağlantı yeniden başlatma tarihi
  signature:flags.11?bytes                        -- imza
  rand2:bytes                                     -- rastgele 7 veya 15 byte
        = adnl.PacketContents
```

Göndermek istediğimiz tüm mesajları seri hale getirdikten sonra, paketi oluşturmaya başlayabiliriz. 

:::note
Bir kanala gönderilecek paketler, kanalın başlatılmasından önce gönderilen paketlerin içeriğinden farklıdır. Önce, başlatma için kullanılan ana paketi analiz edelim.
:::

Başlangıç veri alışverişi sırasında, kanal dışında, paketin seri hale getirilmiş içerik yapısı eş tarafın genel anahtarı ile önden eklenir - 32 byte. Bizim genel anahtarımız 32 byte, paketin içerik yapısının seri hale getirilmiş TL'sinin sha256 hash'i - 32 byte. Paketin içeriği, özel anahtarımız ile sunucunun genel anahtarından elde edilen `paylaşılan anahtar` kullanılarak şifrelenir.

Paket içerik yapımızı seri hale getirin ve byte byte ayrıştırın:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 4e0e7dd6d0c5646c204573bc47e567                                      -- rand1, 15 (0f) rastgele byte
d9050000                                                               -- flags (0x05d9) -> 0b0000010111011001
                                                                       -- from (sıfır bitinin 1 olması nedeniyle mevcut)
c6b41348                                                                  -- TL ID pub.ed25519
   afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6       -- key:int256
                                                                       -- mesajlar (üçüncü bitin 1 olması nedeniyle mevcut)
02000000                                                                  -- vector adnl.Message, boyut = 2 mesaj   
   bbc373e6                                                                  -- TL ID adnl.message.createChannel
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7          -- key
   555c8763                                                                  -- tarih (oluşum tarihi)
   
   7af98bb4                                                                  -- TL ID `adnl.message.query`
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875          -- query_id
   04 ed4879a9 000000                                                        -- sorgu (byte boyutu 4, dolgu 3)
                                                                       -- adres (dördüncü bitin 1 olması nedeniyle mevcut), TL ID belirtilmediği için açıkça belirtilmiş
00000000                                                                  -- addrs (boş vektör, çünkü biz istemci modundayız ve tapede adresimiz yok)
555c8763                                                                  -- sürüm (genellikle başlangıç tarihi)
555c8763                                                                  -- reinit_date (genellikle başlangıç tarihi)
00000000                                                                  -- öncelik
00000000                                                                  -- expire_at

0100000000000000                                                       -- seqno (altıncı bitin 1 olması nedeniyle mevcut)
0000000000000000                                                       -- confirm_seqno (yedinci bitin 1 olması nedeniyle mevcut)
555c8763                                                               -- recv_addr_list_version (sekizinci bitin 1 olması nedeniyle mevcut, genellikle başlangıç tarihi)
555c8763                                                               -- reinit_date (onuncu bitin 1 olması nedeniyle mevcut, genellikle başlangıç tarihi)
00000000                                                               -- dst_reinit_date (onuncu bitin 1 olması nedeniyle mevcut)
0f 2b6a8c0509f85da9f3c7e11c86ba22                                      -- rand2, 15 (0f) rastgele byte
```

Seri hale getirdikten sonra - elde edilen byte dizisini, daha önce ürettiğimiz özel istemci (kanalın değil) ED25519 anahtarı ile imzalamamız gerekiyor. İmza oluşturulduktan (64 byte boyutunda), pakete ekliyoruz, tekrar seri hale getiriyoruz, ama bu sefer bayraklara 11. biti ekliyoruz, bu da imzanın mevcut olduğunu gösterir:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 4e0e7dd6d0c5646c204573bc47e567                                      -- rand1, 15 (0f) rastgele byte
d90d0000                                                               -- flags (0x0dd9) -> 0b0000110111011001
                                                                       -- from (sıfır bitinin 1 olması nedeniyle mevcut)
c6b41348                                                                  -- TL ID pub.ed25519
   afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6       -- key:int256
                                                                       -- mesajlar (üçüncü bitin 1 olması nedeniyle mevcut)
02000000                                                                  -- vector adnl.Message, boyut = 2 mesaj   
   bbc373e6                                                                  -- TL ID adnl.message.createChannel
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7          -- key
   555c8763                                                                  -- tarih (oluşum tarihi)
   
   7af98bb4                                                                  -- TL ID adnl.message.query
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875          -- query_id
   04 ed4879a9 000000                                                        -- sorgu (byte boyutu 4, dolgu 3)
                                                                       -- adres (dördüncü bitin 1 olması nedeniyle mevcut), TL ID belirtilmediği için açıkça belirtilmiş
00000000                                                                  -- addrs (boş vektör, çünkü biz istemci modundayız ve tapede adresimiz yok)
555c8763                                                                  -- sürüm (genellikle başlangıç tarihi)
555c8763                                                                  -- reinit_date (genellikle başlangıç tarihi)
00000000                                                                  -- öncelik
00000000                                                                  -- expire_at

0100000000000000                                                       -- seqno (altıncı bitin 1 olması nedeniyle mevcut)
0000000000000000                                                       -- confirm_seqno (yedinci bitin 1 olması nedeniyle mevcut)
555c8763                                                               -- recv_addr_list_version (sekizinci bitin 1 olması nedeniyle mevcut, genellikle başlangıç tarihi)
555c8763                                                               -- reinit_date (onuncu bitin 1 olması nedeniyle mevcut, genellikle başlangıç tarihi)
00000000                                                               -- dst_reinit_date (onuncu bitin 1 olması nedeniyle mevcut)
40 b453fbcbd8e884586b464290fe07475ee0da9df0b8d191e41e44f8f42a63a710    -- imza (on birinci bitin 1 olması nedeniyle mevcut), (byte boyutu 64, dolgu 3)
   341eefe8ffdc56de73db50a25989816dda17a4ac6c2f72f49804a97ff41df502    --
   000000                                                              --
0f 2b6a8c0509f85da9f3c7e11c86ba22                                      -- rand2, 15 (0f) rastgele byte
```

Artık bir araya getirilmiş, imzalanmış ve seri hale getirilmiş bir paketimiz var, bu bir byte dizisidir. Alıcı tarafından bütünlüğünün sonraki doğrulanması için, paketin sha256 hash'ini hesaplamamız gerekiyor. Örneğin, bu `408a2a4ed623b25a2e2ba8bbe92d01a3b5dbd22c97525092ac3203ce4044dcd2` olsun.

Şimdi paketimizin içeriğini, özel anahtarımız ile eş tarafın genel anahtarı kullanılarak elde edilen `paylaşılan anahtar` ile AES-CTR şifreleme yöntemi ile şifreleyelim.

Göndermeye neredeyse hazırız, bir tek ED25519 eş taraf anahtarının `ID'sini hesaplamak` ve her şeyi bir araya getirmek kaldı:

```
daa76538d99c79ea097a67086ec05acca12d1fefdbc9c96a76ab5a12e66c7ebb  -- sunucu Anahtar ID'si
afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6  -- bizim genel anahtarımız
408a2a4ed623b25a2e2ba8bbe92d01a3b5dbd22c97525092ac3203ce4044dcd2  -- sha256 içerik hash'i (şifrelemeden önce)
...                                                               -- paketin şifrelenmiş içeriği
```

Artık inşa ettiğimiz paketi, UDP üzerinden eş tarafa gönderebiliriz ve bir yanıt bekleyebiliriz.

Yanıt olarak, yapısal olarak benzeyen ancak farklı mesajlar içeren bir paket alacağız. Bu aşağıdakilerden oluşacaktır:

```
68426d4906bafbd5fe25baf9e0608cf24fffa7eca0aece70765d64f61f82f005  -- bizim anahtarımızın ID'si
2d11e4a08031ad3778c5e060569645466e52bd1bd2c7b78ddd56def1cf3760c9  -- paylaşılan anahtar için sunucu genel anahtarı
f32fa6286d8ae61c0588b5a03873a220a3163cad2293a5dace5f03f06681e88a  -- sha256 içerik hash'i (şifrelemeden önce)
...                                                               -- paketin şifrelenmiş içeriği
```

Sunucudan gelen paketin ayrıştırılması şöyle yapılır:
1. Paketteki anahtar ID'sini kontrol ederiz, böylece paketin bize ait olduğunu anlayabiliriz.
2. Paketteki sunucunun genel anahtarını ve bizim özel anahtarımızı kullanarak bir paylaşılan anahtar hesaplarız ve paketin içeriğini çözeriz.
3. Gönderilen sha256 hash'indeki veriyi, çözülen veriden alınan hash ile karşılaştırırız, bunlar eşleşmelidir.
4. Paket içeriğini `adnl.packetContents` TL şemasını kullanarak ayrıştırmaya başlarız.

Paketin içeriği şöyle görünecektir:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 985558683d58c9847b4013ec93ea28                                      -- rand1, 15 (0f) rastgele byte
ca0d0000                                                               -- flags (0x0dca) -> 0b0000110111001010
daa76538d99c79ea097a67086ec05acca12d1fefdbc9c96a76ab5a12e66c7ebb       -- from_short (birinci bitin 1 olması nedeniyle mevcut)
02000000                                                               -- mesajlar (üçüncü bitin 1 olması nedeniyle mevcut)
   691ddd60                                                               -- TL ID adnl.message.confirmChannel 
   db19d5f297b2b0d76ef79be91ad3ae01d8d9f80fab8981d8ed0c9d67b92be4e3       -- anahtar (sunucu kanal genel anahtarı)
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7       -- peer_key (bizim genel kanal anahtarımız)
   94848863                                                               -- tarih
   
   1684ac0f                                                               -- TL ID adnl.message.answer 
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875       -- query_id
   90 48325384c6b413487d99e4a08031ad3778c5e060569645466e52bd5bd2c7b       -- yanıt (sorumuzun yanıtı, içeriğini DHT hakkında bir makalede analiz edeceğiz)
      78ddd56def1cf3760c901000000e7a60d67ad071541c53d0000ee354563ee       --
      35456300000000000000009484886340d46cc50450661a205ad47bacd318c       --
      65c8fd8e8f797a87884c1bad09a11c36669babb88f75eb83781c6957bc976       --
      6a234f65b9f6e7cc9b53500fbe2c44f3b3790f000000                        --
      000000                                                              --
0100000000000000                                                       -- seqno (altıncı bitin 1 olması nedeniyle mevcut)
0100000000000000                                                       -- confirm_seqno (yedinci bitin 1 olması nedeniyle mevcut)
94848863                                                               -- recv_addr_list_version (sekizinci bitin 1 olması nedeniyle mevcut, genellikle başlangıç tarihi)
ee354563                                                               -- reinit_date (onuncu bitin 1 olması nedeniyle mevcut, genellikle başlangıç tarihi)
94848863                                                               -- dst_reinit_date (onuncu bitin 1 olması nedeniyle mevcut)
40 5c26a2a05e584e9d20d11fb17538692137d1f7c0a1a3c97e609ee853ea9360ab6   -- imza (on birinci bitin 1 olması nedeniyle mevcut), (byte boyutu 64, dolgu 3)
   d84263630fe02dfd41efb5cd965ce6496ac57f0e51281ab0fdce06e809c7901     --
   000000                                                              --
0f c3354d35749ffd088411599101deb2                                      -- rand2, 15 (0f) rastgele byte
```

Sunucu, bize `adnl.message.confirmChannel` ve `adnl.message.answer` olmak üzere iki mesaj ile yanıt verdi. 

:::tip
`adnl.message.answer` ile her şey basit, bu bizim `dht.getSignedAddressList` isteğimize verilen yanıttır, içeriğini DHT hakkında bir makalede analiz edeceğiz.
:::

`adnl.message.confirmChannel`'a odaklanalım, bu, eş tarafın kanalın oluşturulmasını onayladığı ve bize genel kanal anahtarını gönderdiği anlamına gelir. Şimdi, özel kanal anahtarımız ve eş tarafın genel kanal anahtarı ile paylaşılan `anahtarı hesaplayabiliriz`.

Artık paylaşılan kanal anahtarını hesapladığımıza göre, bunu iki anahtara ayırmamız gerekiyor - birisi giden mesajları şifrelemek, diğeri gelen mesajları çözmek için. Bunu yapmak oldukça basit, ikinci anahtar paylaşılan anahtarın ters sırada yazılması ile elde edilir. Örnek:

```
Paylaşılan anahtar : AABB2233

Birinci anahtar: AABB2233
İkinci anahtar: 3322BBAA
```

Hangi anahtarın ne için kullanılacağını belirlemek için, kendi genel kanal anahtarımızın ID'sini sunucu kanalının genel anahtarının ID'si ile karşılaştırabiliriz, bunları sayısal forma - uint256'ya dönüştürerek. Bu yaklaşım, hem sunucu hem de istemcinin hangi anahtarın ne için kullanılacağını belirlemesini sağlamak için kullanılır. Eğer sunucu ilk anahtarı şifreleme için kullanıyorsa, bu yaklaşım sayesinde istemci her zaman onu çözme için kullanır.

:::warning
Kullanım şartları şunlardır:
```
Sunucu ID'si bizim ID'mizden küçükse:
Şifreleme: Birinci Anahtar
Çözme: İkinci Anahtar

Sunucu ID'si bizim ID'mizden büyükse:
Şifreleme: İkinci Anahtar
Çözme: Birinci Anahtar

ID'ler eşitse (neredeyse imkansız):
Şifreleme: Birinci Anahtar
Çözme: Birinci Anahtar
```
:::

[[Uygulama örneği]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/adnl.go#L502)

### Kanalda İletişim

Tüm sonraki paket alışverişleri kanalda gerçekleşecek ve şifreleme için kanal anahtarları kullanılacaktır. 

:::info
Yeni oluşturulan bir kanalda aynı `dht.getSignedAddressList` isteğini gönderelim, farkı görelim.
:::

Paketi, aynı `adnl.packetContents` yapısını kullanarak kanal için oluşturalım:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f c1fbe8c4ab8f8e733de83abac17915                                      -- rand1, 15 (0f) rastgele byte
c4000000                                                               -- flags (0x00c4) -> 0b0000000011000100
                                                                       -- mesaj (çünkü ikinci bit = 1)
7af98bb4                                                                  -- TL ID adnl.message.query
fe3c0f39a89917b7f393533d1d06b605b673ffae8bbfab210150fe9d29083c35          -- query_id
04 ed4879a9 000000                                                        -- sorgu (bizim dht.getSignedAddressList byte olarak paketlenmiş hali, dolgu 3 ile)
0200000000000000                                                       -- seqno (altıncı bitin 1 olması nedeniyle mevcut), 2 çünkü bu bizim ikinci mesajımız
0100000000000000                                                       -- confirm_seqno (yedinci bitin 1 olması nedeniyle mevcut), 1 çünkü bu sunucudan alınan son seqno
07 e4092842a8ae18                                                      -- rand2, 7 (07) rastgele byte
```

Kanal içindeki paketler oldukça basittir ve esasen dizilerden (seqno) ve mesajlardan oluşur.

Seri hale getirdikten sonra, bir önceki gibi, paketimizin sha256 hash'ini hesaplıyoruz. Ardından paketi, kanalın çıkan paketleri için tasarlanan anahtar kullanarak şifreliyoruz. `Hesaplayın` `pub.aes` şifreleme anahtarının ID'sini, ve paketimizi oluşturalım:

```
bcd1cf47b9e657200ba21d94b822052cf553a548f51f539423c8139a83162180 -- giden mesajlarımızın şifreleme anahtarının ID'si 
6185385aeee5faae7992eb350f26ba253e8c7c5fa1e3e1879d9a0666b9bd6080 -- sha256 içerik hash'i (şifrelemeden önce)
...                                                              -- paketin şifrelenmiş içeriği
```

Paketimizi UDP ile gönderiyoruz ve yanıt bekliyoruz. Yanıt olarak, gönderdiğimiz ile aynı türde bir paket alacağız (aynı alanlar), ancak `dht.getSignedAddressList` isteğimize verilen yanıtı içerir.

## Diğer Mesaj Türleri
Temel iletişim için, yukarıda tartıştığımız gibi `adnl.message.query` ve `adnl.message.answer` gibi mesajlar kullanılır, fakat bazı durumlarda kullanılan diğer mesaj türleri de vardır, bu bölümde bunları tartışacağız.

### adnl.message.part
Bu mesaj türü, `adnl.message.answer` gibi diğer olası mesaj türlerinden bir parçadır. Bu yöntem, mesajın bir tek UDP datagramında iletilemeyecek kadar büyük olduğu durumlarda kullanılmaktadır.

```tlb
adnl.message.part 
hash:int256            -- orijinal mesajın sha256 hash'i
total_size:int         -- orijinal mesaj boyutu
offset:int             -- orijinal mesajın başına göre offset
data:bytes             -- orijinal mesajın bir veri parçası
   = adnl.Message;
```

:::tip
Bu nedenle, orijinal mesajı bir araya getirmek için, birkaç parçayı elde etmemiz ve offsetlerine göre bunları tek bir byte dizisinde birleştirmemiz gerekir.
:::

Ve ardından bunu bir mesaj olarak işlemek için (bu byte dizisindeki ID ön eki ile).

### adnl.message.custom
```tlb
adnl.message.custom data:bytes = adnl.Message;
```

Bu tür mesajlar, daha üst düzeydeki mantığın istek-cevap formatıyla uyumlu olmaması durumunda kullanılır; bu tür mesajlar, yalnızca bir dizi bayt taşıdıkları için işlemi tamamen daha yüksek seviyeye taşımaya olanak tanır; **query_id** ve diğer alanlar olmadan.

:::tip
**Not:** Bu tür mesajlar, örneğin, RLDP'de kullanılır, çünkü çok sayıda isteğe tek bir yanıt olabilir.
:::

Bu mantık RLDP'nin kendisi tarafından kontrol edilir.

### Sonuç

İletişim, bu makalede tarif edilen mantık temelinde devam eder, ancak paketlerin içeriği, DHT ve RLDP gibi üst düzey protokollere bağlıdır.

---

## References

_Burada [orijinal makaleye](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-UDP-Internal.md) [Oleg Baranov](https://github.com/xssnick) göre bir bağlantı._