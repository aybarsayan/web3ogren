# ADNL TCP - Liteserver

Bu, TON ağı üzerindeki tüm etkileşimlerin inşa edildiği düşük seviyeli protokoldür; her hangi bir protokolün üstünde çalışabilir, ancak en çok TCP ve UDP'nin üstünde kullanılır. UDP, düğümler arasında iletişim için kullanılır ve TCP, lite sunucuları ile iletişim için kullanılır.

Şimdi, TCP üzerinde çalışan ADNL'yi analiz edeceğiz ve lite sunucularla doğrudan nasıl etkileşimde bulunacağımızı öğreneceğiz.

ADNL'nin TCP versiyonunda, ağ düğümleri adresler olarak ed25519 genel anahtarlarını kullanır ve bir bağlantı kurmak için Elliptik Eğri Diffie-Hellman prosedürü olan ECDH ile elde edilen paylaşılan bir anahtar kullanılarak bir bağlantı kurulur.

## Paket Yapısı
Elden geçirilmiş olan bağlantı el sıkışması dışında, her ADNL TCP paketi aşağıdaki yapıya sahiptir:

* Küçük endian'de 4 bayt paket boyutu (N)
* 32 bayt nonce (checksum saldırılarına karşı koruma sağlamak için rastgele baytlar)
* (N - 64) yük baytları
* 32 bayt nonce ve yükten alınan SHA256 checksum

Tüm paket, boyut dahil olmak üzere **AES-CTR** ile şifrelenmiştir. Şifreleme çözümlemesinden sonra, checksum'un verilerle eşleşip eşleşmediğini kontrol etmek gerekmektedir; kontrol etmek için sadece checksum'u kendimiz hesaplamalı ve sonucu paketimizdeki ile karşılaştırmalıyız.

:::note
Bağlantı el sıkışması paketi bir istisnadır, kısmı olarak şifrelenmemiş bir biçimde iletilir ve bir sonraki bölümde açıklanır.
:::

---

## Bağlantı Kurma

Bir bağlantı kurmak için, sunucunun IP'sini, portunu ve genel anahtarını bilmemiz ve kendi özel ve genel ed25519 anahtarımızı üretmemiz gerekmektedir.

IP, port ve anahtar gibi genel sunucu verileri [global config](https://ton-blockchain.github.io/global.config.json) dosyasından elde edilebilir. Config'deki IP sayısal formdadır, normal forma getirmek için [bu aracı](https://www.browserling.com/tools/dec-to-ip) kullanabiliriz. Config'deki genel anahtar base64 formatındadır.

İstemci, taraflar tarafından AES şifrelemesinin temeli olarak kullanılacak 160 rastgele bayt üretir.

Bunlardan, taraflar tarafından mesajları şifrelemek/şifre çözmek için kullanılacak 2 kalıcı AES-CTR şifreleme oluşturulur.

* Şifreleme A - anahtar 0 - 31 bayt, iv 64 - 79 bayt
* Şifreleme B - anahtar 32 - 63 bayt, iv 80 - 95 bayt

Şifrelemeler bu sırayla uygulanır:
* Şifreleme A, sunucu tarafından gönderilen mesajları şifrelemek için kullanılır.
* Şifreleme A, istemci tarafından alınan mesajları şifresini çözmek için kullanılır.
* Şifreleme B, istemci tarafından gönderilen mesajları şifrelemek için kullanılır.
* Şifreleme B, sunucu tarafından alınan mesajların şifresini çözmek için kullanılır.

Bir bağlantı kurmak için istemci, aşağıdaki verileri içeren bir el sıkışma paketi göndermelidir:

* [32 bayt] **Sunucu anahtar ID'si** [[Detaylar]](#getting-key-id)
* [32 bayt] **Bizim genel anahtarımız ed25519**
* [32 bayt] **Bizim 160 baytımızdan alınan SHA256 hash**
* [160 bayt] **160 baytımızın şifrelenmiş hali** [[Detaylar]](#handshake-packet-data-encryption)

:::warning
El sıkışma paketini aldığında, sunucu aynı işlemleri yapacak, ECDH anahtarını alacak, 160 baytı şifresini çözecek ve 2 kalıcı anahtar oluşturacaktır. 
Eğer her şey yolunda giderse, sunucu, şifresini çözmek için (diğerleri gibi) kalıcı şifrelerden birini kullanmamız gereken boş bir ADNL paketi ile karşılık verecektir.
:::

Bu noktadan itibaren bağlantı kurulmuş sayılabilir.

Bağlantıyı kurduktan sonra, bilgi almaya başlayabiliriz; veri seri hale getirmek için TL dili kullanılmaktadır.

`Daha fazla bilgi TL hakkında`

---

## Ping&Pong

Bağlantıyı sürdürmek için, 5 saniyede bir ping paketi göndermek optimaldir. bu, veri iletilmediği sürede bağlantıyı sürdürmek için gereklidir, aksine sunucu bağlantıyı sonlandırabilir.

Ping paketi, diğer tüm paketler gibi, `yukarıda` tarif edilen standart şemaya göre oluşturulmuş ve istek ID'si ve ping ID'sini yük verisi olarak taşımaktadır.

Ping isteği için aranan şemayı [buradan](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L35) bulalım ve şema ID'sini şu şekilde hesaplayalım:  
`crc32_IEEE("tcp.ping random_id:long = tcp.Pong")`. Küçük endian baytlarına dönüştürüldüğünde **9a2b084d** elde ederiz.

Böylece ADNL ping paketimiz aşağıdaki gibi görünecek:

* Küçük endian'de 4 bayt paket boyutu -> 64 + (4+8) = **76**
* 32 bayt nonce -> rastgele 32 bayt
* 4 bayt ID TL şeması -> **9a2b084d**
* 8 bayt istek ID'si -> rastgele uint64 sayısı
* 32 bayt nonce ve yükten alınan SHA256 checksum

Paketimizi gönderiyor ve [tcp.pong](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L23) için bekliyoruz, `random_id` ping paketinde gönderdiğimiz ile eşit olacaktır.

---

## Liteserver'dan bilgi alma

Blok zincirinden bilgi almak amacıyla yapılan tüm istekler, [Liteserver Sorgu](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L83) şemasına sarılmıştır; bu şema ise [ADNL Sorgu](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L22) şemasına sarılmıştır.

LiteQuery:
`liteServer.query data:bytes = Object`, id **df068c79**

ADNLQuery:
`adnl.message.query query_id:int256 query:bytes = adnl.Message`, id **7af98bb4**

LiteQuery, ADNLQuery içinde `query:bytes` olarak geçerken, son sorgu LiteQuery içinde `data:bytes` olarak geçmektedir.

`TL'de kodlama baytlarını ayrıştırma`

---

### getMasterchainInfo

Artık Lite API için TL paketlerini nasıl üreteceğimizi bildiğimize göre, mevcut TON masterchain bloğu hakkında bilgi talep edebiliriz. Masterchain bloğu, daha sonraki birçok istekte bir girdi parametre olarak kullanılmakta ve ihtiyaç duyulan durumda durumu (an) belirtmektedir.

Gerekli olan [TL şemasını buluyoruz](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L60), ID'sini hesaplıyor ve paketi oluşturuyoruz:

* Küçük endian'de 4 bayt paket boyutu -> 64 + (4+32+(1+4+(1+4+3)+3)) = **116**
* 32 bayt nonce -> rastgele 32 bayt
* 4 bayt ADNLQuery şeması ID'si -> **7af98bb4**
* 32 bayt `query_id:int256` -> rastgele 32 bayt

  * 1 bayt dizi boyutu -> **12**
  * 4 bayt LiteQuery şeması ID'si -> **df068c79**
    * 1 bayt dizi boyutu -> **4**
    * 4 bayt getMasterchainInfo şeması ID'si -> **2ee6b589**
    * 3 sıfır bayt dolgu (8'e hizalama)

  * 3 sıfır bayt dolgu (16'ya hizalama)

* 32 bayt nonce ve yükten alınan SHA256 checksum

Hexadecimal paket örneği:
```
74000000                                                             -> paket boyutu (116)
5fb13e11977cb5cff0fbf7f23f674d734cb7c4bf01322c5e6b928c5d8ea09cfd     -> nonce
  7af98bb4                                                           -> ADNLQuery
  77c1545b96fa136b8e01cc08338bec47e8a43215492dda6d4d7e286382bb00c4   -> query_id
    0c                                                               -> dizi boyutu
    df068c79                                                         -> LiteQuery
      04                                                             -> dizi boyutu
      2ee6b589                                                       -> getMasterchainInfo
      000000                                                         -> 3 bayt dolgu
    000000                                                           -> 3 bayt dolgu
ac2253594c86bd308ed631d57a63db4ab21279e9382e416128b58ee95897e164     -> sha256
```

Yanıt olarak, [liteServer.masterchainInfo](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L30) almayı bekliyoruz; bu, son:[ton.blockIdExt](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/tonlib_api.tl#L51) state_root_hash:int256 ve init:[tonNode.zeroStateIdExt](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L359) bileşenlerinden oluşmaktadır.

Alınan paket, gönderilenle aynı şekilde deseralize edilir; aynı algoritmaya sahiptir, fakat ters yönde işlemektedir. Tek fark, yanıtın yalnızca [ADNLAnswer](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L23) içinde yer almasıdır.

Yanıtı çözdükten sonra, şu biçimde bir paket elde ederiz:
```
20010000                                                                  -> paket boyutu (288)
5558b3227092e39782bd4ff9ef74bee875ab2b0661cf17efdfcd4da4e53e78e6          -> nonce
  1684ac0f                                                                -> ADNLAnswer
  77c1545b96fa136b8e01cc08338bec47e8a43215492dda6d4d7e286382bb00c4        -> query_id (istekle aynı)
    b8                                                                    -> dizi boyutu
    81288385                                                              -> liteServer.masterchainInfo
                                                                          son:tonNode.blockIdExt
        ffffffff                                                          -> workchain:int
        0000000000000080                                                  -> shard:long
        27405801                                                          -> seqno:int
        e585a47bd5978f6a4fb2b56aa2082ec9deac33aaae19e78241b97522e1fb43d4  -> root_hash:int256
        876851b60521311853f59c002d46b0bd80054af4bce340787a00bd04e0123517  -> file_hash:int256
      8b4d3b38b06bb484015faf9821c3ba1c609a25b74f30e1e585b8c8e820ef0976    -> state_root_hash:int256
                                                                          init:tonNode.zeroStateIdExt 
        ffffffff                                                          -> workchain:int
        17a3a92992aabea785a7a090985a265cd31f323d849da51239737e321fb05569  -> root_hash:int256      
        5e994fcf4d425c0a6ce6a792594b7173205f740a39cd56f537defd28b48a0f6e  -> file_hash:int256
    000000                                                                -> 3 bayt dolgu
520c46d1ea4daccdf27ae21750ff4982d59a30672b3ce8674195e8a23e270d21          -> sha256
```

### runSmcMethod

Artık masterchain bloğunu aldığımızı bildiğimize göre, herhangi bir lite sunucu yöntemini çağırabiliriz.  
**runSmcMethod**'u analiz edelim - bu, bir akıllı sözleşmeden bir işlev çağıran ve bir sonuç döndüren bir yöntemdir. Burada bazı yeni veri türlerini anlayabilmemiz gerekiyor; bunlar `TL-B`, `Hücre` ve `BoC`.

Akıllı sözleşme yöntemini çalıştırmak için aşağıdaki TL şemasını kullanarak bir istek oluşturmalı ve göndermeliyiz:
```tlb
liteServer.runSmcMethod mode:# id:tonNode.blockIdExt account:liteServer.accountId method_id:long params:bytes = liteServer.RunMethodResult
```

Ve aşağıdaki şemada bir yanıt beklemeliyiz:
```tlb
liteServer.runMethodResult mode:# id:tonNode.blockIdExt shardblk:tonNode.blockIdExt shard_proof:mode.0?bytes proof:mode.0?bytes state_proof:mode.1?bytes init_c7:mode.3?bytes lib_extras:mode.4?bytes exit_code:int result:mode.2?bytes = liteServer.RunMethodResult;
```

İstek içinde aşağıdaki alanları görüyoruz:
1. mode:# - yanıt içinde görmek istediğimiz uint32 bitmask; örneğin, `result:mode.2?bytes` yalnızca yanıt içinde, bit 2’nin 1 olarak ayarlanması durumunda yer alacaktır.
2. id:tonNode.blockIdExt - önceki bölümde elde ettiğimiz master blok durumumuzdur.
3. account:[liteServer.accountId](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L27) - işçi zincir ve akıllı sözleşme adres verileri.
4. method_id:long - çağrılan yöntemle ilgili crc16'nın XMODEM tablosu üzerinden yazıldığı 8 bayt; bit 17 de ayarlanır [[Hesaplama]](https://github.com/xssnick/tonutils-go/blob/88f83bc3554ca78453dd1a42e9e9ea82554e3dd2/ton/runmethod.go#L16)
5. params:bytes - [Yığın](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L783) içinde, yöntemi çağırmak için argümanları içeren bir `BoC` olarak serializasyon yapılır. [[Uygulama örneği]](https://github.com/xssnick/tonutils-go/blob/88f83bc3554ca78453dd1a42e9e9ea82554e3dd2/tlb/stack.go)

Örneğin, yalnızca `result:mode.2?bytes`'e ihtiyacımız varsa, bu durumda modumuz 0b100, yani 4 olacaktır. Yanıt olarak alacağız:
1. mode:# -> ilgisiz
2. id:tonNode.blockIdExt -> ilgisiz
3. shardblk:tonNode.blockIdExt -> ilgisiz
4. exit_code:int -> yöntemin çalıştırılması sırasında çıkan çıkış kodunu gösterir. Her şey yolunda giderse 0, değilse istisna kodu olur.
5. result:mode.2?bytes -> [Yığın](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L783) içinde, yöntemin döndürdüğü değerleri içeren bir `BoC` formatında, döndürür.

:::tip
`EQBL2_3lMiyywU17g-or8N7v9hDmPCpttzBPE2isF2GTzpK4` sözleşmesinin `a2` yönteminin çağrı ve sonucu alma işlemini gerçekleştirelim:
:::

FunC içindeki yöntem kodu:
```func
(cell, cell) a2() method_id {
  cell a = begin_cell().store_uint(0xAABBCC8, 32).end_cell();
  cell b = begin_cell().store_uint(0xCCFFCC1, 32).end_cell();
  return (a, b);
}
```

Talebimizi dolduralım:
* `mode` = 4, yalnızca sonucu gerektirir -> `04000000`
* `id` = getMasterchainInfo işleminin çıkışı
* `account` = işçi zincir 0 (4 bayt `00000000`) ve int256 `sözleşme adresimizden alınan` 32 bayt `4bdbfde5322cb2c14d7b83ea2bf0deeff610e63c2a6db7304f1368ac176193ce`
* `method_id` = [hesaplanan](https://github.com/xssnick/tonutils-go/blob/88f83bc3554ca78453dd1a42e9e9ea82554e3dd2/ton/runmethod.go#L16) `a2`'nin id'si -> `0a2e010000000000`
* `params:bytes` = Yöntemimiz, girdi parametrelerini kabul etmez, bu yüzden boş bir yığın (yığın derinliği 0 olan hücre 3 bayt - `000000`) geçilmesi gerekmektedir; `BoC` formatında seri hale getirilip `10b5ee9c72410101010005000006000000000000` haline getirilir; 0x10 - boyut, sondaki 3 bayt dolgu.

Yanıt olarak alırız:
* `mode:#` -> ilginç değil
* `id:tonNode.blockIdExt` -> ilginç değil
* `shardblk:tonNode.blockIdExt` -> ilginç değil
* `exit_code:int` -> 0 kabul edilebilir bir sonuçsa başarılı, aksi takdirde 0 dışında bir değer.
* `result:mode.2?bytes` -> [Yığın](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L783) içinde, akıllı sözleşme tarafımızdan döndürülen verileri içermektedir.

`result` içinde `b5ee9c7201010501001b000208000002030102020203030400080ccffcc1000000080aabbcc8` değerini aldık; bu, içeriklerin verilerini içeren bir `BoC`. Deseralize ettiğimizde, bir hücre elde ederiz:

```json
32[00000203] -> {
  8[03] -> {
    0[],
    32[0AABBCC8]
  },
  32[0CCFFCC1]
}
```

Elde ettiğimizde, `000002` kök hücresinin ilk 3 baytı, yığın derinliğinin 2 olduğunu belirtmektedir. Bu, yöntemin 2 değer döndürdüğü anlamına gelir.

Ayrıca, seçeneklerin birinin bir yığın derinliği olduğunda, parametreleri aramaya kadar geçen işlem sırasının tersini geçirebiliriz; FunC kodunun görünümüne göre geçerlidir.

[Uygulama örneği](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/ton/runmethod.go#L24)

### getAccountState

Hesap durumu verilerini, örneğin bakiye, kod ve sözleşme verileri almak için, [getAccountState](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L68) kullanabiliriz. **İstek için `yeni bir ana blok` ve hesap adresine ihtiyacımız var.** Yanıt olarak, TL yapısı [AccountState](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L38) alacağız.

:::info AccountState TL şemasını inceleyelim:

```tlb
liteServer.accountState id:tonNode.blockIdExt shardblk:tonNode.blockIdExt shard_proof:bytes proof:bytes state:bytes = liteServer.AccountState;
```

**Field Açıklamaları:**
1. `id` - aldığımız verilerle ilgili ana bloktur.
2. `shardblk` - hesabımızın bulunduğu workchain shard bloğu, verileri aldığımız shard bloğudur.
3. `shard_proof` - bir shard bloğunun merkle kanıtıdır.
4. `proof` - hesap durumunun merkle kanıtıdır.
5. `state` - `BoC` TL-B [hesap durumu şeması](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L232).

Bu verilerin tümünde ihtiyacımız olan şey durumdur, bunu analiz edeceğiz. 

> **Örneğin, `EQAhE3sLxHZpsyZ_HecMuwzvXHKLjYx4kEUehhOy2JmCcHCT` hesabının durumunu alalım, yanıt içindeki `state` (bu makalenin yazıldığı sırada):**

```hex
b5ee9c720102350100051e000277c0021137b0bc47669b3267f1de70cbb0cef5c728b8d8c7890451e8613b2d899827026a886043179d3f6000006e233be8722201d7d239dba7d818134001020114ff00f4a413f4bcf2c80b0d021d0000000105036248628d00000000e003040201cb05060013a03128bb16000000002002012007080043d218d748bc4d4f4ff93481fd41c39945d5587b8e2aa2d8a35eaf99eee92d9ba96004020120090a0201200b0c00432c915453c736b7692b5b4c76f3a90e6aeec7a02de9876c8a5eee589c104723a18020004307776cd691fbe13e891ed6dbd15461c098b1b95c822af605be8dc331e7d45571002000433817dc8de305734b0c8a3ad05264e9765a04a39dbe03dd9973aa612a61f766d7c02000431f8c67147ceba1700d3503e54c0820f965f4f82e5210e9a3224a776c8f3fad1840200201200e0f020148101104daf220c7008e8330db3ce08308d71820f90101d307db3c22c00013a1537178f40e6fa1f29fdb3c541abaf910f2a006f40420f90101d31f5118baf2aad33f705301f00a01c20801830abcb1f26853158040f40e6fa120980ea420c20af2670edff823aa1f5340b9f2615423a3534e2a2d2b2c0202cc12130201201819020120141502016616170003d1840223f2980bc7a0737d0986d9e52ed9e013c7a21c2b2f002d00a908b5d244a824c8b5d2a5c0b5007404fc02ba1b04a0004f085ba44c78081ba44c3800740835d2b0c026b500bc02f21633c5b332781c75c8f20073c5bd0032600201201a1b02012020210115bbed96d5034705520db3c8340201481c1d0201201e1f0173b11d7420c235c6083e404074c1e08075313b50f614c81e3d039be87ca7f5c2ffd78c7e443ca82b807d01085ba4d6dc4cb83e405636cf0069006031003daeda80e800e800fa02017a0211fc8080fc80dd794ff805e47a0000e78b64c00015ae19574100d56676a1ec40020120222302014824250151b7255b678626466a4610081e81cdf431c24d845a4000331a61e62e005ae0261c0b6fee1c0b77746e102d0185b5599b6786abe06fedb1c68a2270081e8f8df4a411c4605a400031c34410021ae424bae064f613990039e2ca840090081e886052261c52261c52265c4036625ccd88302d02012026270203993828290111ac1a6d9e2f81b609402d0015adf94100cc9576a1ec1840010da936cf0557c1602d0015addc2ce0806ab33b50f6200220db3c02f265f8005043714313db3ced542d34000ad3ffd3073004a0db3c2fae5320b0f26212b102a425b3531cb9b0258100e1aa23a028bcb0f269820186a0f8010597021110023e3e308e8d11101fdb3c40d778f44310bd05e254165b5473e7561053dcdb3c54710a547abc2e2f32300020ed44d0d31fd307d307d33ff404f404d10048018e1a30d20001f2a3d307d3075003d70120f90105f90115baf2a45003e06c2170542013000c01c8cbffcb0704d6db3ced54f80f70256e5389beb198106e102d50c75f078f1b30542403504ddb3c5055a046501049103a4b0953b9db3c5054167fe2f800078325a18e2c268040f4966fa52094305303b9de208e1638393908d2000197d3073016f007059130e27f080705926c31e2b3e63006343132330060708e2903d08308d718d307f40430531678f40e6fa1f2a5d70bff544544f910f2a6ae5220b15203bd14a1236ee66c2232007e5230be8e205f03f8009322d74a9802d307d402fb0002e83270c8ca0040148040f44302f0078e1771c8cb0014cb0712cb0758cf0158cf1640138040f44301e201208e8a104510344300db3ced54925f06e234001cc8cb1fcb07cb07cb3ff400f400c9
```

:::note `Bu BoC'yi çözümleyin` ve


  büyük hücre

  ```json
  473[C0021137B0BC47669B3267F1DE70CBB0CEF5C728B8D8C7890451E8613B2D899827026A886043179D3F6000006E233BE8722201D7D239DBA7D818130_] -> {
    80[FF00F4A413F4BCF2C80B] -> {
      2[0_] -> {
        4[4_] -> {
          8[CC] -> {
            2[0_] -> {
              13[D180],
              141[F2980BC7A0737D0986D9E52ED9E013C7A218] -> {
                40[D3FFD30730],
                48[01C8CBFFCB07]
              }
            },
            6[64] -> {
              178[00A908B5D244A824C8B5D2A5C0B5007404FC02BA1B048_],
              314[085BA44C78081BA44C3800740835D2B0C026B500BC02F21633C5B332781C75C8F20073C5BD00324_]
            }
          },
          2[0_] -> {
            2[0_] -> {
              84[BBED96D5034705520DB3C_] -> {
                112[C8CB1FCB07CB07CB3FF400F400C9]
              },
              4[4_] -> {
                2[0_] -> {
                  241[AEDA80E800E800FA02017A0211FC8080FC80DD794FF805E47A0000E78B648_],
                  81[AE19574100D56676A1EC0_]
                },
                458[B11D7420C235C6083E404074C1E08075313B50F614C81E3D039BE87CA7F5C2FFD78C7E443CA82B807D01085BA4D6DC4CB83E405636CF0069004_] -> {
                  384[708E2903D08308D718D307F40430531678F40E6FA1F2A5D70BFF544544F910F2A6AE5220B15203BD14A1236EE66C2232]
                }
              }
            },
            2[0_] -> {
              2[0_] -> {
                323[B7255B678626466A4610081E81CDF431C24D845A4000331A61E62E005AE0261C0B6FEE1C0B77746E0_] -> {
                  128[ED44D0D31FD307D307D33FF404F404D1]
                },
                531[B5599B6786ABE06FEDB1C68A2270081E8F8DF4A411C4605A400031C34410021AE424BAE064F613990039E2CA840090081E886052261C52261C52265C4036625CCD882_] -> {
                  128[ED44D0D31FD307D307D33FF404F404D1]
                }
              },
              4[4_] -> {
                2[0_] -> {
                  65[AC1A6D9E2F81B6090_] -> {
                    128[ED44D0D31FD307D307D33FF404F404D1]
                  },
                  81[ADF94100CC9576A1EC180_]
                },
                12[993_] -> {
                  50[A936CF0557C14_] -> {
                    128[ED44D0D31FD307D307D33FF404F404D1]
                  },
                  82[ADDC2CE0806AB33B50F60_]
                }
              }
            }
          }
        },
        872[F220C7008E8330DB3CE08308D71820F90101D307DB3C22C00013A1537178F40E6FA1F29FDB3C541ABAF910F2A006F40420F90101D31F5118BAF2AAD33F705301F00A01C20801830ABCB1F26853158040F40E6FA120980EA420C20AF2670EDFF823AA1F5340B9F2615423A3534E] -> {
          128[DB3C02F265F8005043714313DB3CED54] -> {
            128[ED44D0D31FD307D307D33FF404F404D1],
            112[C8CB1FCB07CB07CB3FF400F400C9]
          },
          128[ED44D0D31FD307D307D33FF404F404D1],
          40[D3FFD30730],
          640[DB3C2FAE5320B0F26212B102A425B3531CB9B0258100E1AA23A028BCB0F269820186A0F8010597021110023E3E308E8D11101FDB3C40D778F44310BD05E254165B5473E7561053DCDB3C54710A547ABC] -> {
            288[018E1A30D20001F2A3D307D3075003D70120F90105F90115BAF2A45003E06C2170542013],
            48[01C8CBFFCB07],
            504[5230BE8E205F03F8009322D74A9802D307D402FB0002E83270C8CA0040148040F44302F0078E1771C8CB0014CB0712CB0758CF0158CF1640138040F44301E2],
            856[DB3CED54F80F70256E5389BEB198106E102D50C75F078F1B30542403504DDB3C5055A046501049103A4B0953B9DB3C5054167FE2F800078325A18E2C268040F4966FA52094305303B9DE208E1638393908D2000197D3073016F007059130E27F080705926C31E2B3E630063
            ] -> {
              112[C8CB1FCB07CB07CB3FF400F400C9],
              384[708E2903D08308D718D307F40430531678F40E6FA1F2A5D70BFF544544F910F2A6AE5220B15203BD14A1236EE66C2232],
              504[5230BE8E205F03F8009322D74A9802D307D402FB0002E83270C8CA0040148040F44302F0078E1771C8CB0014CB0712CB0758CF0158CF1640138040F44301E2],
              128[8E8A104510344300DB3CED54925F06E2] -> {
                112[C8CB1FCB07CB07CB3FF400F400C9]
              }
            }
          }
        }
      }
    },
    114[0000000105036248628D00000000C_] -> {
      7[CA] -> {
        2[0_] -> {
          2[0_] -> {
            266[2C915453C736B7692B5B4C76F3A90E6AEEC7A02DE9876C8A5EEE589C104723A1800_],
            266[07776CD691FBE13E891ED6DBD15461C098B1B95C822AF605BE8DC331E7D45571000_]
          },
          2[0_] -> {
            266[3817DC8DE305734B0C8A3AD05264E9765A04A39DBE03DD9973AA612A61F766D7C00_],
            266[1F8C67147CEBA1700D3503E54C0820F965F4F82E5210E9A3224A776C8F3FAD18400_]
          }
        },
        269[D218D748BC4D4F4FF93481FD41C39945D5587B8E2AA2D8A35EAF99EEE92D9BA96000]
      },
      74[A03128BB16000000000_]
    }
  }
  ```



Şimdi, TL-B yapısına göre hücreyi çözümlememiz gerekiyor:
```tlb
account_none$0 = Account;

account$1 addr:MsgAddressInt storage_stat:StorageInfo
          storage:AccountStorage = Account;
```

Yapımız diğer yapıları referans alıyor, örneğin:
```tlb
anycast_info$_ depth:(#<= 30) { depth >= 1 } rewrite_pfx:(bits depth) = Anycast;
addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9) workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
   
storage_info$_ used:StorageUsed last_paid:uint32 due_payment:(Maybe Grams) = StorageInfo;
storage_used$_ cells:(VarUInteger 7) bits:(VarUInteger 7) public_cells:(VarUInteger 7) = StorageUsed;
  
account_storage$_ last_trans_lt:uint64 balance:CurrencyCollection state:AccountState = AccountStorage;

currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;
           
var_uint$_ {n:#} len:(#< n) value:(uint (len * 8)) = VarUInteger n;
var_int$_ {n:#} len:(#< n) value:(int (len * 8)) = VarInteger n;
nanograms$_ amount:(VarUInteger 16) = Grams;
           
account_uninit$00 = AccountState;
account_active$1 _:StateInit = AccountState;
account_frozen$01 state_hash:bits256 = AccountState;
```

Görüyoruz ki hücrede birçok veri var, ancak ana durumları inceleyip bakiye almaya odaklanacağız. **Geri kalanları benzer şekilde analiz edebilirsiniz.**

---

### Çözümlemeye başlayalım. Kök hücre verilerimizde şunları görüyoruz:

```
C0021137B0BC47669B3267F1DE70CBB0CEF5C728B8D8C7890451E8613B2D899827026A886043179D3F6000006E233BE8722201D7D239DBA7D818130_
```

Bunu ikili forma çevirip şu sonucu elde ediyoruz:
```
11000000000000100001000100110111101100001011110001000111011001101001101100110010011001111111000111011110011100001100101110110000110011101111010111000111001010001011100011011000110001111000100100000100010100011110100001100001001110110010110110001001100110000010011100000010011010101000100001100000010000110001011110011101001111110110000000000000000000000110111000100011001110111110100001110010001000100000000111010111110100100011100111011011101001111101100000011000000100110
```

Ana TL-B yapımızda, orada iki olasılığımız var - `account_none$0` veya `account$1`. Hangi seçeneği kullandığımızı anlamak için, `$` sembolünden sonra duyurulan öneki okuyacağız, bizim durumumuzda bu 1 bit. Eğer 0 ise `account_none`'a, 1 ise `account`'a sahibiz.

> **Yukarıdaki verilerden ilk bitimiz = 1, bu yüzden `account$1` ile çalışıyoruz ve aşağıdaki şemayı kullanacağız:**

```tlb
account$1 addr:MsgAddressInt storage_stat:StorageInfo
          storage:AccountStorage = Account;
```

Sonra `addr:MsgAddressInt`'ye geliriz, MsgAddressInt için de birkaç seçeneğimiz var:
```tlb
addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9) workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
```
Hangi seçenekle çalıştığımızı anlamak için, bu sefer 2 bit okuyoruz. Zaten okunan biti kesiyoruz, `1000000...` kalıyor, ilk 2 biti okuyup `10` alıyoruz, bu da `addr_std$10` ile çalıştığımız anlamına gelir.

> **Sonraki adımda `anycast:(Maybe Anycast)`'ı çözümlememiz gerekiyor, Maybe burada 1 bit okuyup, 1 ise Anycast'ı okuyacak, aksi takdirde atlayacağız. Kalan bitlerimiz `00000...` ve 1 bit okurken, 0 olduğu için Anycast'ı atlıyoruz.**

Ardından, `workchain_id: int8`, burada basit, 8 bit okuyoruz, bu da workchain ID'si. **Sonraki 8 bit ise bütün sıfırlar, yani workchain 0.**

`address:bits256`'ya gelince, bu da adresin 256 bitidir, workchain_id'nde olduğu gibi. Okuduğumuzda, `21137B0BC47669B3267F1DE70CBB0CEF5C728B8D8C7890451E8613B2D8998270` hex temsilinde elde ediyoruz.

`addr:MsgAddressInt` adresimizi okuduğumuzda, ana yapıdan `storage_stat:StorageInfo`'ya geçiyoruz, şemasının şu şekilde olduğunu biliyoruz:
```tlb
storage_info$_ used:StorageUsed last_paid:uint32 due_payment:(Maybe Grams) = StorageInfo;
```

Önce `used:StorageUsed` geliyor, ve şeması:
```tlb
storage_used$_ cells:(VarUInteger 7) bits:(VarUInteger 7) public_cells:(VarUInteger 7) = StorageUsed;
```
Bu, hesap verilerini saklamak için kullanılan hücre ve bit sayısını ifade ediyor. **Her alan, dinamik boyutta bir uint, ancak maksimum 7 bit olan `VarUInteger 7` olarak tanımlanıyor. Bunu şemadan anlayabilirsiniz:**
```tlb
var_uint$_ {n:#} len:(#< n) value:(uint (len * 8)) = VarUInteger n;
```
Bizim durumumuzda n, 7 olacaktır. Len için `(#< 7)` yani 7'ye kadar bir sayı için yeterli bit sayısını alırız. Bunu 7-1=6'nın ikiye dönüşerek `110`’a dönüştürdüğünü görebiliriz ve 3 bit alıyoruz, yani len = 3 bit. **Value ise `(uint (len * 8))`. Bunu belirlemek için 3 bit okuyacağız, bir sayımız olacak ve bu sayıyı 8 ile çarpacağız, bu da `value`’nin değeri olacak, yani `VarUInteger`'in değerini almak için okunması gereken bit sayısı.**

`cells:(VarUInteger 7)` kısmını okurken, kök hücredeki bir sonraki 16 biti kontrol ediyoruz, `0010011010101000`. İlk 3 bit len'i okuduğumuzda `001` yani 1 alıyoruz, bu da (uint (1 * 8)) boyutuna, 8 bit okuyoruz, bu da `cells`, `00110101` yani ondalık olarak 53 demek. **Benzer şekilde `bits` ve `public_cells` için de aynı işlemleri yapıyoruz.**

`used:StorageUsed`'ı başarıyla okuduktan sonra, sıradaki `last_paid:uint32`, bunu 32 bit olarak okuyoruz. `due_payment:(Maybe Grams)` kısmıyle ilgili daha basit, gösterilen Maybe 0 olduğu için Grams'ı atlıyoruz. **Ama Maybe 1 olsaydı Grams kısmını hemen çözümleyebilirdik, `amount:(VarUInteger 16) = Grams` şemasından bunu anlayabiliyoruz ve buradaki işlem aynıydı, sadece burada 7 yerine 16 var.**

Ardından, `storage:AccountStorage`'a geçiyoruz, buradaki şeması:
```tlb
account_storage$_ last_trans_lt:uint64 balance:CurrencyCollection state:AccountState = AccountStorage;
```
`last_trans_lt:uint64` kısmını okuyoruz, bu 64 bit, hesabın son işlem zamansızlığını saklıyor. **Ve nihayet, bakiyeyi temsil eden şemaya geçiyoruz:**
```tlb
currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;
```
Buradan `grams:Grams` okuyacağız, bu hesap bakiyesi nano-tonlarda olacaktır. **`grams:Grams`, 16 bit saklamak için 16'dır (ikili biçimde `10000`, 1 eksilttiğimizde `1111` olur), ardından ilk 4 biti okuyoruz ve sonucu 8 ile çarpıyoruz, ardından elde edilen bit sayısını okuyoruz, bu da bakiyemizdir.**

Verilerimizi çözümleyelim:
```
100000000111010111110100100011100111011011101001111101100000011000000100110
```
**İlk 4 bit - `1000`, bu da 8.** 8*8=64, bir sonraki 64 bit `0000011101011111010010001110011101101110100111110110000001100000` ile çıkarılıyor, fazladan sıfırlardan kurtulursak, `11101011111010010001110011101101110100111110110000001100000` haline geliyor, yani **`531223439883591776`, bu değer nano-ton'dan TON'a çevrildiğinde `531223439.883591776` elde ediyoruz.**

Burada duracağız, çünkü ana durumları zaten analiz ettik, geri kalanları benzer yöntemlerle elde edebilirsiniz. TL-B'yi çözümleme ile ilgili ek bilgileri `resmi belgede` bulabilirsiniz.

---

### Diğer yöntemler

Artık tüm bilgileri incelediğimize göre, diğer lite sunucu yöntemleri için de yanıtları çağırıp işleyebilirsiniz. **Aynı prensip :)**

## Ek teknik detaylar

### Anahtar ID'sini almak

Anahtar ID'si, serileştirilmiş TL şemasının SHA256 hash'idir.

> **Anahtarlar için en yaygın kullanılan TL şemaları şunlardır:**
```tlb
pub.ed25519 key:int256 = PublicKey -- ID c6b41348
pub.aes key:int256 = PublicKey     -- ID d4adbc2d
pub.overlay name:bytes = PublicKey -- ID cb45ba34
pub.unenc data:bytes = PublicKey   -- ID 0a451fb6
pk.aes key:int256 = PrivateKey     -- ID 3751e8a5
```

**Örnek olarak, el sıkışma için kullanılan ED25519 türündeki anahtarların anahtar ID'si,** **[0xC6, 0xB4, 0x13, 0x48]** ve **publik anahtar** (36 byte dizi, önek + anahtar) üzerinden SHA256 hash'idir.

[Kod örneği](https://github.com/xssnick/tonutils-go/blob/2b5e5a0e6ceaf3f28309b0833cb45de81c580acc/liteclient/crypto.go#L16)

### El sıkışma paket verisi şifreleme

El sıkışma paketi, yarı açık bir biçimde gönderilmektedir, yalnızca 160 byte şifrelenmiştir ve kalıcı şifreler hakkında bilgi içermektedir. 

Bunları şifrelemek için, AES-CTR şifresi kullanmamız gerekmektedir, bunu elde etmek için 160 byte ve `ECDH ortak anahtar` üzerinden SHA256 hash'ine ihtiyacımız var.

**Şifreleme şu şekilde oluşturulur:**
- key = (0 - 15 byte public key) + (16 - 31 byte hash)
- iv = (0 - 3 hash byte) + (20 - 31 public key byte)

> **Şifre oluşturulduktan sonra, şifrelenmiş 160 byte ile verimizi şifreliyoruz.**

[Kod örneği](https://github.com/xssnick/tonutils-go/blob/2b5e5a0e6ceaf3f28309b0833cb45de81c580acc/liteclient/connection.go#L361)

### ECDH kullanarak ortak anahtar almak

Ortak anahtarı hesaplamak için, kendi özel anahtarımız ve sunucunun genel anahtarı gerekmektedir.

DH'nın özü, özel bilgileri açıklamadan ortak bir gizli anahtar elde etme işlemidir. **Bu süreç oldukça basit bir şekilde şöyle gerçekleşir:**
1. Gizli ve genel sayılar üretiriz, **6** ve **7** gibi
2. Sunucu gizli ve genel sayılar üretir, **5** ve **15** gibi
3. Genel sayıları sunucu ile değiş tokuş ederiz, sunucuya **7** göndeririz, o da bize **15** gönderir.
4. Hesaplarız: **7^6 mod 15 = 4**
5. Sunucu hesaplar: **7^5 mod 15 = 7**
6. **Aldığımız sayıları değiş tokuş ederiz, sunucuya 4 veririz, o da bize 7 verir.**
7. Hesaplarız **7^6 mod 15 = 4**
8. Sunucu hesaplar: **4^5 mod 15 = 4**
9. Ortak anahtar = **4**

> **ECDH'nın detayları basitlik adına belirtilmeyecektir.** Özel ve genel anahtarlar kullanılarak bir eğrinin ortak noktasını bulma işlemiyle hesaplanmaktadır. İlgilenenler için, bununla ilgili daha ayrıntılı bilgi edinmekte fayda var.

[Kod örneği](https://github.com/xssnick/tonutils-go/blob/2b5e5a0e6ceaf3f28309b0833cb45de81c580acc/liteclient/crypto.go#L32)

## Referanslar

_Buradaki [orijinal makaleye](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-TCP-Liteserver.md) [Oleg Baranov](https://github.com/xssnick) tarafından bir bağlantıdır._