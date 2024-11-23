# Düşük seviyeli ücretler genel görünümü

:::caution
Bu bölüm, TON ile düşük seviyede etkileşim için talimatlar ve kılavuzlar içermektedir.
:::

:::caution
Burada TON üzerindeki komisyon ve ücretleri hesaplamak için **ham formülleri** bulacaksınız.

Ancak, bunların çoğu zaten **opcode'lar aracılığıyla uygulanmıştır**! Bu nedenle, **manuel hesaplamalar yerine bunları kullanıyorsunuz**.
:::

Bu belge, TON üzerindeki işlem ücretlerine ve özellikle FunC kodu için hesaplama ücretlerine genel bir bakış sağlar. Ayrıca [TVM beyaz kitabında ayrıntılı bir spesifikasyon bulunmaktadır](https://ton.org/tvm.pdf).

## İşlemler ve aşamalar

`TVM genel görünümünde` açıklandığı gibi, işlem yürütme birkaç aşamadan oluşur. Bu aşamalar sırasında, ilgili ücretler kesilebilir. `Yüksek düzeyde ücretler genel görünümü` bulunmaktadır.

## Depolama ücreti

TON doğrulayıcıları, akıllı sözleşmelerden depolama ücretleri toplar.

Depolama ücretleri, hesabın durumuna yönelik depolama ödemeleri için herhangi bir işlemin **Depolama aşamasında** akıllı sözleşme bakiyesinden toplanır (akıllı sözleşme kodu ve verileri dahil, mevcutsa). Akıllı sözleşme bu nedenle dondurulabilir.

:::tip
TON'da bir akıllı sözleşmenin yürütülmesi ve **kullanılan depolama** için ücret ödendiğini unutmamak önemlidir (bakınız [@thedailyton makalesi](https://telegra.ph/Commissions-on-TON-07-22)). 
:::

`storage fee` sözleşme boyutunuza bağlıdır: hücre sayısı ve bu hücrelerin bit sayısının toplamı. **Yalnızca benzersiz hash hücreleri depolama ve fwd ücretleri için hesaplanır, yani 3 aynı hash hücresi bir olarak sayılır**. Bu da, TON Cüzdanına sahip olmak için bir depolama ücreti ödemeniz gerektiği anlamına gelir (çok çok küçük olsa bile).

Eğer TON Cüzdanınızı uzun bir süre (1 yıl) kullanmadıysanız, _gönderme ve alma işlemlerinde cüzdanın komisyon ödediği için çok daha yüksek bir komisyon ödemeniz gerekecektir_.

### Formül

Akıllı sözleşmeler için depolama ücretlerini yaklaşık olarak bu formülle hesaplayabilirsiniz:

```cpp
storage_fee = (cells_count * cell_price + bits_count * bit_price) * time_delta / 2^16 
```

Her bir değeri daha yakından inceleyelim:

* `storage_fee`—`time_delta` saniye için depolama ücreti
* `cells_count`—akıllı sözleşme tarafından kullanılan hücre sayısı
* `bits_count`—akıllı sözleşme tarafından kullanılan bit sayısı
* `cell_price`—tek hücre fiyatı
* `bit_price`—tek bit fiyatı

Hem `cell_price` hem de `bit_price`, Network Config `param 18` üzerinden elde edilebilir.

Mevcut değerler:

* Çalışma zinciri.
    ```cpp
    bit_price_ps:1
    cell_price_ps:500
    ```
* Ana zincir.
    ```cpp
    mc_bit_price_ps:1000
    mc_cell_price_ps:500000
    ```

### Hesaplayıcı Örneği

Bir yıl boyunca çalışma zincirinde 1 MB için depolama fiyatını hesaplamak için bu JS scriptini kullanabilirsiniz.

```js live
// Canlı editöre hoş geldiniz!
// Herhangi bir değişkeni değiştirmekten çekinmeyin
// Kaynak kodu, ücret miktarı için RoundUp kullanır, dolayısıyla hesaplayıcı da öyle

function storageFeeCalculator() {
  const size = 1024 * 1024 * 8        // 1MB bit cinsinden  
  const duration = 60 * 60 * 24 * 365 // 1 Yıl saniye cinsinden

  const bit_price_ps = 1
  const cell_price_ps = 500

  const pricePerSec = size * bit_price_ps +
  + Math.ceil(size / 1023) * cell_price_ps

  let fee = Math.ceil(pricePerSec * duration / 2**16) * 10**-9
  let mb = (size / 1024 / 1024 / 8).toFixed(2)
  let days = Math.floor(duration / (3600 * 24))
  
  let str = `Depolama Ücreti: ${fee} TON (${mb} MB için ${days} gün)`
  
  return str
}
```

## İleri ücretler

İç mesajlar, mesajla ilişkilendirilmiş değerden düşülen ve mesajı IHR mekanizması ile dahil eden hedef shardchain doğrulayıcılarına ödüllendirilen `ihr_fee`'yi tanımlar. `fwd_fee`, HR mekanizmasını kullanmanın orijinal toplam yönlendirme ücretidir; bu, bazı yapılandırma parametrelerine ve mesajın oluşturulma anındaki boyutuna göre otomatik olarak hesaplanır. Yeni oluşturulan iç çıkış mesajının taşıdığı toplam değer, değer, `ihr_fee` ve `fwd_fee` toplamına eşittir. Bu toplam, kaynak hesabın bakiyesinden düşülür. Bu bileşenlerden yalnızca değer, mesaj tesliminde her zaman hedef hesaba kredi olarak yansıtılır. `fwd_fee`, kaynak ile varış noktası arasındaki HR yolundaki doğrulayıcılar tarafından toplanır, `ihr_fee` ise ya hedef shardchain doğrulayıcıları tarafından toplanır (eğer mesaj IHR üzerinden teslim edilirse) ya da hedef hesaba kredi olarak yansıtılır.

:::info
`fwd_fee` maliyetin 2/3'ünü karşılar çünkü 1/3, mesaj yaratıldığında `action_fee` olarak tahsis edilir.
```cpp
auto fwd_fee_mine = msg_prices.get_first_part(fwd_fee);
auto fwd_fee_remain = fwd_fee - fwd_fee_mine;

fees_total = fwd_fee + ihr_fee;
fees_collected = fwd_fee_mine;

ap.total_action_fees += fees_collected;
ap.total_fwd_fees += fees_total;
```
:::

## Hesaplama ücretleri

### Gaz

Tüm hesaplama maliyetleri gaz birimlerinde adlandırılmıştır. Gaz birimlerinin fiyatı, bu `zincir yapılandırması` tarafından belirlenir (Ana zincir için Parametre 20 ve Temel zincir için Parametre 21) ve yalnızca doğrulayıcıların mutabakatı ile değiştirilebilir. Diğer sistemlerin aksine, kullanıcının kendi gaz fiyatını ayarlayamayacağını ve bir ücret piyasasının olmadığını unutmayın.

Temel zincirdeki mevcut ayarlar şunlardır: 1 gaz birimi 400 nanotona mal olmaktadır.

### TVM talimatları maliyeti

En düşük seviyede (TVM talimat yürütme) çoğu temel işlevin gaz fiyatı, `P_b := 10 + b + 5r` olarak hesaplanan _temel gaz fiyatına_ eşittir; burada `b` talimat uzunluğu bit cinsindendir ve `r` ise talimata dahil olan hücre referanslarının sayısını ifade eder.

Bu temel ücretlerin yanı sıra, aşağıdaki ücretler ortaya çıkar:

| Talimat                 | GAZ  fiyatı  | Açıklama                                                                                                                                                                           | 
|-------------------------|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Hücre oluşturma         | **500**      | Oluşturucuyu hücreye dönüştürme işlemi.                                                                                                                                          |
| Hücreyi ilk kez ayrıştırma| **100**      | Mevcut işlemi sırasında hücreleri dilimlere dönüştürme işlemi.                                                                                                                   | 
| Hücreyi tekrar ayrıştırma| **25**       | Mevcut işlem sırasında daha önce ayrıştırılan hücreleri dilimlere dönüştürme işlemi.                                                                                             |
| İstisna fırlatma        | **50**       |                                                                                                                                                                                   | 
| Tuple ile işlem         | **1**        | Bu fiyat, tuple'ın her bir elemanının sayısı ile çarpılacaktır.                                                                                                                  | 
| Kesin Atlama            | **10**       | Mevcut devam hücresindeki tüm talimatlar yürütüldüğünde ödenir. Ancak, o devam hücresinde referanslar varsa ve yürütme akışı ilk referansa atlarsa ödenir.                      | 
| Kesin Geri Atlama       | **5**        | Mevcut devamdaki tüm talimatlar yürütüldüğünde ve yürütme akışı tamamlanmış devamdan geri dönmek için atladığında ödenir.                                                       |                                                                                      
| Yığın elemanlarını taşıma| **1**        | Devamlar arasında yığın elemanlarını taşımanın fiyatıdır. Ancak, ilk 32 eleman taşımak ücretsizdir.                                                                              |                                                                                       


### FunC yapılandırmaları gaz ücretleri

Bu makalede kullanılan hemen hemen tüm FunC fonksiyonları, FunC fonksiyonlarını Fift montaj talimatlarına eşleyen [stablecoin stdlib.fc sözleşmesinde](https://github.com/ton-blockchain/stablecoin-contract) tanımlanmıştır (aslında, yeni opcode'lar ile stdlib.fc şu anda **geliştirilme aşamasındadır** ve **ana ağ deposunda henüz sunulmamıştır**, ancak `stdlib.fc`'yi [stablecoin](https://github.com/ton-blockchain/ton) kaynak kodundan referans olarak kullanabilirsiniz) ve Fift montaj talimatları, [asm.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/fift/lib/Asm.fif) içindeki bit dizisi talimatlarına eşlenir. Dolayısıyla, talimat çağrısının size ne kadara mal olacağını anlamak istiyorsanız, `stdlib.fc` içinde `asm` temsiline bakmanız, ardından `asm.fif` içindeki bit dizisini bulmanız ve bit cinsinden talimat uzunluğunu hesaplamanız gerekir.

:::note
Ancak genel olarak, bit uzunlukları ile ilgili ücretler, hücre ayrıştırma ve oluşturma ile ilgili ücretlerle, ayrıca atlama ve sadece yürütülen talimat sayısı ile karşılaştırıldığında çok daha düşük kalmaktadır.
:::

Bu nedenle, kodunuzu optimize etmeye çalışırken mimari optimizasyonla başlamalı, hücre ayrıştırma/oluşturma işlemlerinin sayısını azaltmalı ve ardından atlama sayısını azaltmalısınız.

### Hücrelerle işlemler

Doğru hücre çalışmasının gaz maliyetlerini önemli ölçüde azaltabileceğine dair bir örnek.

Farz edin ki, çıkış mesajına bazı kodlanmış yük eklemek istiyorsunuz. Böyle bir uygulama aşağıdaki gibi olacaktır:

```cpp
slice payload_encoding(int a, int b, int c) {
  return
    begin_cell().store_uint(a,8)
                .store_uint(b,8)
                .store_uint(c,8)
    .end_cell().begin_parse();
}

() send_message(slice destination) impure {
  slice payload = payload_encoding(1, 7, 12);
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(destination)
    .store_coins(0)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; varsayılan mesaj başlıkları (bkz. mesaj gönderme sayfası)
    .store_uint(0x33bbff77, 32) ;; op-kodu (bkz. akıllı sözleşme yönergeleri)
    .store_uint(cur_lt(), 64)  ;; sorgu_id (bkz. akıllı sözleşme yönergeleri)
    .store_slice(payload)
  .end_cell();
  send_raw_message(msg, 64);
}
```

Bu kodun sorunu nedir? `payload_encoding`, bir bit dizesi oluşturmak için öncelikle `end_cell()` ile bir hücre oluşturur (+500 gaz birimi). Ardından, bu hücreyi ayrıştırır `begin_parse()` (+100 gaz birimi). Aynı kod, gereksiz işlemler olmadan bazı yaygın kullanılan türleri değiştirerek yazılabilir:

```cpp
;; bir montaj için bir oluşturucuyu diğerine depolayan işlevi ekliyoruz, stdlib'den yok
builder store_builder(builder to, builder what) asm(what to) "STB";

builder payload_encoding(int a, int b, int c) {
  return
    begin_cell().store_uint(a,8)
                .store_uint(b,8)
                .store_uint(c,8);
}

() send_message(slice destination) impure {
  builder payload = payload_encoding(1, 7, 12);
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(destination)
    .store_coins(0)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; varsayılan mesaj başlıkları (bkz. mesaj gönderme sayfası)
    .store_uint(0x33bbff77, 32) ;; op-kodu (bkz. akıllı sözleşme yönergeleri)
    .store_uint(cur_lt(), 64)  ;; sorgu_id (bkz. akıllı sözleşme yönergeleri)
    .store_builder(payload)
  .end_cell();
  send_raw_message(msg, 64);
}
```

Bit dizesini farklı bir formatta (dilim yerine oluşturucu) geçirerek, yalnızca kodda çok az bir değişiklikle hesaplama maliyetini önemli ölçüde azaltıyoruz.

### Inline ve inline_refs

Varsayılan olarak, bir FunC işleviniz olduğunda, ayrı bir `id` alır ve bu, id->function sözlüğünün ayrı bir yaprağında depolanır ve programın herhangi bir yerinde çağrıldığında, sözlükte sıralama yapılır ve ardından atlama gerçekleştirilir. Bu tür bir davranış, işlevinizin kodda birçok yerden çağrılması durumunda mantıklıdır ve böylece atlamalar, işlevin gövdesini yalnızca bir kez depolamakla kod boyutunu azaltmaya yardımcı olur. Ancak, işlev yalnızca bir veya iki kez kullanılıyorsa, bu işlevi `inline` veya `inline_ref` olarak tanımlamak genellikle çok daha ucuzdur. `inline` modifikatorü, işlevin gövdesini ana işlevin koduna yerleştirirken, `inline_ref` işlev kodunu bir başvuruya yerleştirir (başvuruya atlamak, hala sözlük girişine bakmaktan çok daha ucuzdur).

### Sözlükler

TON'daki sözlükler, hücrelerin ağaçları (kesin olarak DAG'ler) şeklinde tanıtılmıştır. Bu, sözlüğe veya anahtara eriştiğinizde, ağaçtaki ilgili dalın tüm hücrelerini ayrıştırmanız gerektiği anlamına gelir. Bu, 
   * a) sözlük işlemlerinin gaz maliyetinin sabit olmaması (çünkü dal içindeki düğümlerin boyutu ve sayısı verilen sözlüğe ve anahtara bağlıdır)
   * b) silme ve ekleme yerine `replace` gibi özel işlemler kullanarak sözlük kullanımını optimize etmenin akla yatkın olduğu
   * c) geliştiricilerin, tüm sözlükte gereksiz yinelemeleri önlemek için yineleme işlemleri (bir sonraki ve bir önceki gibi) ile `min_key`/`max_key` işlemlerinin farkında olmaları gerektiği 

### Yığın işlemleri

FunC'nin yığın girişleriyle arka planda etkileşim kurduğunu unutmayın. Yani, aşağıdaki kod:

```cpp
(int a, int b, int c) = some_f();
return (c, b, a);
```

birkaç talimata çevrilecektir ve bu, yığındaki elemanların sırasını değiştirecektir.

Yığın girişlerinin sayısı önemli (10+), ve farklı sıralarda aktif olarak kullanılıyorsa, yığın işlemleri ücretleri dikkate değer hale gelebilir.

## İşlem ücreti

İşlem ücreti, Hesaplama aşamasından sonra gerçekleştirilen işlem listesinin işlenmesi sırasında kaynak hesabın bakiyesinden düşülmektedir. Aşağıdaki işlemler ücret ödenmesine neden olur:

* `SENDRAWMSG`, ham bir mesaj gönderir.
* `RAWRESERVE`, N Nanotonu rezerve edecek bir çıktı işlemi oluşturur.
* `RAWRESERVEX`, `RAWRESERVE`'ye benzer, ancak ek para birimleri içeren bir sözlük de kabul eder.
* `SETCODE`, bu akıllı sözleşme kodunu değiştirecek bir çıktı işlemi oluşturur.
* `SETLIBCODE`, bu akıllı sözleşme kütüphanelerinin koleksiyonunu verilen kod ile kütüphane ekleyerek veya kaldırarak değiştirecek bir çıktı işlemi oluşturur.
* `CHANGELIB`, `SETLIBCODE`'ye benzer bir çıktı işlemi oluşturur, ancak kütüphane kodu yerine hash değerini kabul eder.
* `FB08–FB3F`, çıktı işlemifiyatları için ayrılmıştır.

## Ücret hesaplama formülleri

### storage_fees

```cpp
storage_fees = ceil(
                    (account.bits * bit_price
                    + account.cells * cell_price)
               * period / 2 ^ 16)
```

### in_fwd_fees, out_fwd_fees

```cpp
msg_fwd_fees = (lump_price
             + ceil(
                (bit_price * msg.bits + cell_price * msg.cells) / 2^16)
             )
             
ihr_fwd_fees = ceil((msg_fwd_fees * ihr_price_factor) / 2^16)
```

:::info
Yalnızca benzersiz hash hücreleri depolama ve fwd ücretleri için hesaplanır, yani 3 aynı hash hücresi bir olarak sayılır.

Özellikle, verileri iki katına çıkarır: Farklı dallarda olan birkaç eşdeğer alt hücre varsa, bunların içeriği yalnızca bir kez depolanır.

`Daha fazla bilgi için` okuyun.
:::

// Bir mesajın kök hücresindeki bitler msg.bits'e dahil edilmez (lump_price bunlar için ödenir)

### action_fees

```cpp
action_fees = sum(out_ext_msg_fwd_fee) + sum(int_msg_mine_fee)
```

## Ücret yapılandırma dosyası

Tüm ücretler nanotondur veya yükseklik tipi kullanarak doğruluğu korumak için 2^16 ile çarpılmış nanotondur ve değiştirilebilir. Yapılandırma dosyası, mevcut ücret maliyetini sergilemektedir.

* storage_fees = [p18](https://tonviewer.com/config#18)
* in_fwd_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)
* computation_fees = [p20](https://tonviewer.com/config#20), [p21](https://tonviewer.com/config#21)
* action_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)
* out_fwd_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)

:::info
[Ana ağ canlı yapılandırma dosyasına doğrudan bir bağlantı](https://tonviewer.com/config)

Eğitim amaçları için [eski bir örnek](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05)
:::

## Referanslar

* @thedailyton [makalesine](https://telegra.ph/Fees-calculation-on-the-TON-Blockchain-07-24) dayanmaktadır, 24.07*

## Ayrıca Bakınız

* `TON Ücretleri genel görünümü`
* `İşlemler ve Aşamalar`
* `Ücret hesaplama`