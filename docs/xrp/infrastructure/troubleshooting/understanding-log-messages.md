---
title: Günlük Mesajlarını Anlamak
seoTitle: Günlük Mesajlarını Anlamak - Hata Ayıklama Rehberi
sidebar_position: 4
description: Hata ayıklama günlüğündeki uyarı ve hata mesajlarını yorumlayın. Bu rehber, en yaygın günlük mesajı türlerini ve analiz yöntemlerini açıklamaktadır.
tags: 
  - hata ayıklama
  - günlük mesajları
  - rippled
  - sunucu
  - sorun giderme
  - hata mesajları
keywords: 
  - hata ayıklama
  - günlük mesajları
  - rippled
  - sunucu
  - sorun giderme
  - hata mesajları
---

# Günlük Mesajlarını Anlamak

:::info
Aşağıdaki bölümler, `rippled` sunucusunun `hata ayıklama günlüğünde` görünebilecek en yaygın günlük mesajı türlerinden bazılarını ve bunların nasıl yorumlanacağını açıklar.
:::

Bu, `rippled` ile **Problemleri Teşhis Etmek** için önemli bir adımdır.

## Günlük Mesajı Yapısı

Aşağıdaki, günlük dosyasının formatını göstermektedir:

```text
2020-Jul-08 20:10:17.372178946 UTC Peer:WRN [236] n9J2CP7hZypxDJ27ZSxoy4VjbaSgsCNaRRJtJkNJM5KMdGaLdRy7'den okunan mesaj: stream truncated
2020-Jul-08 20:11:13.582438263 UTC PeerFinder:ERR Mantıksal test 52.196.126.86:13308 ile hata, Bağlantı zaman aşımına uğradı
2020-Jul-08 20:11:57.728448343 UTC Peer:WRN [242] n9J2CP7hZypxDJ27ZSxoy4VjbaSgsCNaRRJtJkNJM5KMdGaLdRy7'den okunan mesaj: stream truncated
2020-Jul-08 20:12:12.075081020 UTC LoadMonitor:WRN Görev: sweep run: 1172ms bekle: 0ms
```

Her satır, aşağıdaki bölümlerle bir günlük kaydını temsil eder ve boşluklarla ayrılır:

1. Günlük kaydının yazıldığı tarih, örneğin `2020-Jul-08`.
2. Günlük kaydının yazıldığı zaman, örneğin `20:12:12.075081020`.
3. Zaman dilimi göstergesi: `UTC`. (Günlük tarihleri her zaman UTC'dir.)
4. Günlük bölümü ve ciddiyet, örneğin `LoadMonitor:WRN`.
5. Günlük mesajı, örneğin `Görev: sweep run: 1172ms bekle: 0ms`.

Kolaylık olması açısından, bu sayfadaki örnekler tarih, saat ve zaman dilimi göstergesini atlamaktadır.

---

## Çöküşler

Günlük içinde çalışma zamanı hatalarını belirten mesajlar sunucunun çöktüğünü gösterebilir. Bu mesajlar genellikle aşağıdaki örneklerden biriyle başlar:

```
Throw<std::runtime_error>
```

```
Terminating thread rippled: main: unhandled St13runtime_error
```

Eğer sunucunuz her zaman başlatıldığında çöküyorsa, olası durumlar için `Sunucu Başlamıyor` kısmına bakın.

Eğer sunucunuz çalışma sırasında veya belirli komutların sonucunda rastgele çöküyorsa, `güncel` olduğunuzdan emin olun. En son sürümdeyseniz ve sunucunuz hâlâ çöküyorsa, aşağıdakileri kontrol edin:

- Sunucunuzun bellekten mi düştüğünü kontrol edin. Bazı sistemlerde `rippled`, Bellek Dışı (OOM) Killer veya başka bir izleme süreci tarafından sonlandırılabilir.
- Sunucunuz paylaşımlı bir ortamda çalışıyorsa, diğer kullanıcıların veya yöneticilerin makine veya hizmeti yeniden başlatmasına neden olup olmadığını kontrol edin. Örneğin, bazı barındırılan sağlayıcılar, uzun bir süre büyük miktarda paylaşılan bir makinenin kaynaklarını kullanan herhangi bir hizmeti otomatik olarak sonlandırır.
- Sunucunuzun `rippled`'i çalıştırmak için `minimum gereksinimleri` karşılayıp karşılamadığını kontrol edin. Üretim sunucuları için `önerilere` ne dersiniz?

Eğer yukarıdakilerin hiçbiri geçerli değilse, lütfen durumu Ripple'a güvenlik hassasiyetli bir hata olarak bildirin. Eğer Ripple çöküşü yeniden üretebilirse, bir ödüle uygun olabilirsiniz. Detaylar için adresine bakın.

---

## Zaten doğrulandı sırası ya da sonrası

Aşağıdaki gibi günlük mesajları, bir sunucunun farklı defter indeksleri için doğrulamaları sırayla aldığını gösterir.

```text
Validations:WRN 2137ACEFC0D137EFA1D84C2524A39032802E4B74F93C130A289CD87C9C565011 için doğrulama, nHUeUNSn3zce2xQZWNghQvd9WRH6FWEnCBKYVJu2vAizMxnXegfJ imza anahtarı n9KcRZYHLU9rhGVwB9e4wEMYsxXvUfgFxtmX25pc1QPNgweqzQf5 zaten 12133663'te veya sonrasında doğrulandı
```

Bu tür mesajlar nadir olarak sorun göstermez. Eğer bu tür bir mesaj sürekli olarak aynı gönderen doğrulayıcıyla birlikte ortaya çıkıyorsa, aşağıdakiler de dahil olmak üzere bir sorun olabileceğini gösterebilir (yaklaşık olarak en olasıdan en az olasıya):

- Mesajı yazan sunucunun ağ sorunları yaşıyor.
- Mesajda açıklanan doğrulayıcının ağ sorunları yaşıyor.
- Mesajda açıklanan doğrulayıcı kötü niyetli bir şekilde davranıyor.

---

## async_send başarısız oldu

Aşağıdaki günlük mesajı, `StatsD dışa aktarmasının` başarısız olduğunu gösterir:

```text
Collector:ERR async_send failed: Connection refused
```

Bu, aşağıdakilerden birine işaret edebilir:

- StatsD yapılandırmanızın yanlış IP adresi veya bağlantı noktasına sahip olması.
- Dışa aktarmak istediğiniz StatsD sunucusunun kapalı veya `rippled` sunucunuzdan erişilebilir olmaması.

`rippled`'in yapılandırma dosyasındaki `[insight]` dizesini kontrol edin ve `rippled` sunucunuzun StatsD sunucunuza ağ bağlantısının olduğunu doğrulayın.

Bu hatanın, `rippled` sunucusu üzerinde başka hiçbir etkisi yoktur; sunucu, StatsD metriklerinin gönderimi dışında normal çalışmaya devam etmelidir.

---

## Güncelleme kontrolü

Aşağıdaki mesaj, sunucunun en az %60'ının güvenilir doğrulayıcılarından daha eski bir yazılım sürümü çalıştırdığını tespit ettiğini gösterir:

```text
LedgerMaster:ERR Güncelleme kontrolü: Güvenilir doğrulayıcıların çoğunluğu daha yeni bir sürüm çalıştırıyor.
```

Bu, kesinlikle bir sorun değildir, ancak eski bir sunucu sürümü `değişiklik engelli` hale gelme olasılığı yüksektir. En son stabil sürüme `rippled`'i `güncellemenizi` öneririz. (Eğer `devnet` ile bağlıysanız, bunun yerine en son gece yarısı sürümünü güncelleyin.)

---

## Eşten bağlantı sıfırlandı

Aşağıdaki günlük mesajı, bir eş `rippled` sunucusunun bir bağlantıyı kapattığını gösterir:

```text
Peer:WRN [012] onReadMessage: Eşten bağlantı sıfırlandı
```

Zaman zaman bağlantı kaybetmek, herhangi bir eşler arası ağ için normaldir. **Bu tür mesajların nadiren yaşanması bir sorunu belirtmez.**

Aynı zaman diliminde bu tür mesajların büyük bir sayısı, aşağıdakileri içeren bir sorunu gösterebilir:

- İnternet bağlantınız bir ya da daha fazla eşle kesilmiş.
- Sunucunuz eşin istekleriyle aşırı yüklenebilir, bu da eşin sunucunuzu koparmasına neden olabilir.

---

## Tüketici kaydı, düşme eşiğinde veya üzerinde bakiyeyle bırakıldı

Aşağıdaki günlük mesajı, sunucunun genel API'sine erişen bir istemcinin `oran kısıtlaması` nedeniyle düştüğünü gösterir:

```text
Resource:WRN Tüketici kaydı 169.55.164.21, 15000'lik düşme eşiğinde veya üzerindeki 15970'lik bakiye ile düşürüldü
```

Giriş, oran limitini aşan istemcinin IP adresini ve istemcinin API'yi ne kadar kullandığını tahmin eden bir skoru, istemcinin "bakiye" sayısını içerir. Bir istemcinin düşme eşiği, [15000'lik bir skora sabitlenmiştir](https://github.com/XRPLF/rippled/blob/06c371544acc3b488b9d9c057cee4e51f6bef7a2/src/ripple/resource/impl/Tuning.h#L34-L35).

Aynı IP adresinden sık mesajlar görüyorsanız, bu IP adreslerini ağınızdan engellemeyi düşünebilirsiniz; bu, sunucunuzun genel API'sindek yükü azaltabilir. (Örneğin, bu IP adreslerini engellemek için güvenlik duvarınızı yapılandırabilirsiniz.)

Kendi sunucunuzda oran kısıtlamalarından düşmemek için, `admin olarak bağlanın`.

---

## InboundLedger 11 günlüğü zaman aşımına uğradı

```text
InboundLedger:WRN 11 zaman aşımına uğradı 8265938 için
```

Bu, sunucunuzun eşlerinden belirli defter verilerini talep etmede sorun yaşadığını gösterir. Eğer `defter indeksi`, en son doğrulanan defterin indeksine kıyasla çok daha düşükse, sunucunuzun bir `tarih parçası` indiriyor olması muhtemeldir.

Bu kesinlikle bir sorun değildir, ancak defter tarihini daha hızlı edinmek istiyorsanız, `rippled`'in tam tarihli eşlerle bağlanmasını sağlamak için `[ips_fixed]` yapılandırma dizesini ekleyebilir veya düzenleyebilirsiniz ve sunucuyu yeniden başlatabilirsiniz. Örneğin, Ripple'ın tam tarihli sunucularından birine her zaman bağlanmak için:

```
[ips_fixed]
s2.ripple.com 51235
```

---

## InboundLedger İstediği hash

Aşağıdaki gibi günlük mesajları, sunucunun diğer sunuculardan defter verileri talep ettiğini gösterir:

```text
InboundLedger:WRN İstiyor: 5AE53B5E39E6388DBACD0959E5F5A0FCAF0E0DCBA45D9AB15120E8CDD21E019B
```

Eğer sunucunuz senkronize oluyorsa, geçmişi dolduruyorsa veya `tarih parçaları` indiriyorsa bu normaldir.

---

## LoadMonitor Görevi

Aşağıdaki gibisinden mesajlar, bir işlevin çalışmasının uzun sürmesi (bu örnekte 11 saniyeden fazla) durumunda oluşur:

```text
2018-Aug-28 22:56:36.180827973 LoadMonitor:WRN Görev: gotFetchPack run: 11566ms bekle: 0ms
```

Benzer bir mesaj, bir işin uzun süre beklemesi durumunda (yine bu örnekte 11 saniyeden fazla) meydana gelir:

```text
LoadMonitor:WRN Görev: processLedgerData run: 0ms bekle: 11566ms
LoadMonitor:WRN Görev: AcquisitionDone run: 0ms bekle: 11566ms
LoadMonitor:WRN Görev: processLedgerData run: 0ms bekle: 11566ms
LoadMonitor:WRN Görev: AcquisitionDone run: 0ms bekle: 11566ms
```

Bu iki tür mesaj genellikle birlikte ortaya çıkar; uzun süren bir işin diğer işlerin bitmesi için uzun süre beklemesine neden olduğu durumlar.

Sunucuyu başlattıktan sonra **ilk birkaç dakika** içinde bu tür birkaç mesajın görünmesi **normaldir**.

Eğer bu mesajlar, sunucuyu başlattıktan sonraki 5 dakikadan fazla devam ederse, özellikle `run` süreleri 1000 ms’nin çok üzerindeyse, bu, **sunucunuzun yeterli disk I/O, RAM veya CPU'ya sahip olmadığını** gösterebilir. Bu, yeterince güçlü donanım kullanılmadığı veya aynı donanımda çalışan diğer süreçlerin `rippled` ile kaynaklar için rekabet ettiğinden kaynaklanabilir. (`rippled` ile kaynaklar için rekabet edebilecek diğer süreçlerden bazıları, programlı yedeklemeler, virüs tarayıcıları ve periyodik veritabanı temizleyicileridir.)

Başka bir muhtemel sebep, döner sabit disklerde NuDB kullanmaya çalışmaktır; NuDB yalnızca katı hal sürücülerle (SSD'ler) kullanılmalıdır. Ripple, `rippled`'in veritabanaları için her zaman SSD depolama kullanılmasını önermektedir, ancak döner disklerde `rippled`'i başarıyla çalıştırmanız mümkün olabilir, eğer RocksDB kullanıyorsanız. Eğer döner diskler kullanıyorsanız, hem `[node_db]` hem de `[shard_db]` (varsa) yapılandırmalarının RocksDB kullanacak şekilde ayarlandığından emin olun. Örneğin:

```
[node_db]
type=RocksDB
# ... daha fazla yapılandırma atlandı

[shard_db]
type=RocksDB
```

---

## Fetch paketi için hash yok

Aşağıdaki tür mesajlar, `tarih parçalaması` için tarihi defterleri indirirken `rippled` v1.1.0 ve öncesindeki bir hatadan kaynaklanmaktadır:

```text
2018-Aug-28 22:56:21.397076850 LedgerMaster:ERR Fetch paketi için hash yok. Eksik İndeks 7159808
```

Bu mesajlar güvenli bir şekilde göz ardı edilebilir.

---

## Silinmiyor

Aşağıdaki gibisinden mesajlar, `çevrimiçi silmenin kesintiye uğraması` durumunda meydana gelir:

```text
SHAMapStore:WRN Silinmiyor. durum: senkronizasyon. yaş 25s
```

`durum`, `sunucu durumu` belirtir. `yaş`, en son doğrulanan defterin kapatılmasından bu yana geçen saniye sayısını gösterir. (Son doğrulanan defter için sağlıklı bir yaş, 7 saniye veya daha azdır.)

Başlama sırasında, bu tür mesajlar normaldir ve güvenli bir şekilde göz ardı edilebilir. Diğer zamanlarda, bu tür mesajlar genellikle sunucunun çevrimiçi silmeyi gerçekleştirirken `sistem gereksinimlerini` karşılamadığına, özellikle disk I/O'suna işaret eder.

---

## Potansiyel Sansür

Aşağıdaki gibi günlük mesajları, XRP Defteri potansiyel işlem sansürünü tespit ettiğinde verilir. Bu günlük mesajları ve işlem sansürü dedektörü hakkında daha fazla bilgi için `İşlem Sansür Tespiti`.

**Uyarı Mesajı**

```text
LedgerConsensus:WRN Potansiyel Sansür: Uygun tx E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7, yani 18851530 defterinden izlediğimiz, 18851545 defterinde dahil edilmemiştir.
```

**Hata Mesajı**

```text
LedgerConsensus:ERR Potansiyel Sansür: Uygun tx E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7, yani 18851530 defterinden izlediğimiz, 18851605 defterinde dahil edilmemiştir. Ek uyarılar bastırıldı.
```

---

## döngüde doğrulandıSeq

Bu mesaj, `çevrimiçi silmenin` çalışmaya başladığını gösterir:

```text
SHAMapStore:WRN döngüde doğrulandıSeq 54635511 sonDönüş 54635255 silmeAralığı 256 silinebilir_ 4294967295
```

Bu günlük mesajı normaldir ve çevrimiçi silmenin beklendiği gibi çalıştığını gösterir.

Günlük mesajı, mevcut çevrimiçi silme çalışmasını tanımlayan değerleri içerir. Her anahtar kelime, hemen ardından gelen değere karşılık gelir:

| Anahtar Kelime    | Değer                | Açıklama                                |
|:-------------------|:--------------------|:----------------------------------------|
| `doğrulandıSeq`    | [Defter İndeksi][]   | Geçerli doğrulanan defter sürümü.      |
| `sonDönüş`         | [Defter İndeksi][]   | `"eski" (salt okunur) veritabanındaki` defter aralığının sonu. Çevrimiçi silme, bu defter sürümünü ve daha önceki defter sürümlerini siler. |
| `silmeAralığı`     | Sayı                | Çevrimiçi silmeden sonra ne kadar defter sürümünü tutacağınızı belirtir. `online_delete` ayarı` bu değeri kontrol eder. |
| `silinebilir_`     | [Defter İndeksi][]   | `öneri silme` kullanılıyorsa, sunucunun silebileceği en yeni defter sürümü. Öneri silme kullanılmıyorsa, bu değer göz ardı edilir. |

Çevrimiçi silme tamamlandığında, şu günlük mesajı yazılır:

```text
SHAMapStore:WRN döngü tamamlandı 54635511
```

Mesajın sonundaki sayı, çevrimiçi silmenin başladığı anda doğrulanan defterin [defter indeksi][] olup, "döngüde" mesajındaki `doğrulandıSeq` değerine eşittir. Bu, çevrimiçi silme sonraki çalışmasında `sonDönüş` değerine dönüşecektir.

Eğer sunucu çevrimiçi silme sırasında senkronizasyondan düşerse, çevrimiçi silmeyi kesintiye uğratır ve yerine "Silinmiyor" günlük mesajı `Not Deleting` yazar.

---

## Shard: Böyle bir dosya veya dizin yok

Aşağıdaki gibi günlük mesajları, `tarih parçalama` özelliğinin etkin olması durumunda meydana gelebilir:

```text
ShardStore:ERR shard 1804: Böyle bir dosya veya dizin yok
```

Bu, sunucunun yeni bir tarih parçası elde etmeye çalıştığını ancak altındaki dosya sistemine yazamadığını gösterir. Olası sebepler arasında:

- Depolama medyasının donanım arızası
- Dosya sisteminin çıkartılmış olması
- Parça klasörünün silinmesi

:::tip
`rippled`'in veritabanı dosyalarını hizmet durmuşken silmek genellikle güvenlidir, ancak sunucu çalışırken asla silmemelisiniz.
:::

---

## Ataerinin hash'ini belirlemek mümkün değil

Aşağıdaki gibi günlük mesajları, sunucu bir eşten bir doğrulama mesajı gördüğünde ve üzerinde çalıştığı ana defter sürümünü bilmediğinde meydana gelir. Bu, sunucunun ağ ile senkronize olmadığı durumlarda ortaya çıkabilir:

```text
Validations:WRN Ataerinin hash'ini belirlemek mümkün değil seq=3 defter hash=00B1E512EF558F2FD9A0A6C263B3D922297F26A55AEB56A009341A22895B516E seq=12133675
```

partial file="/docs/_snippets/unsynced_warning_logs.md" /%}

---

## [veto_amendments] yapılandırma dosyasında göz ardı edildi

Aşağıdaki gibi günlük mesajları, `rippled.cfg` dosyanızda eski bir `[veto_amendments]` dizesi bulunduğunda meydana gelir. Sunucu ilk kez 1.7.0 veya daha yüksek bir sürümde başlatıldığında, dizeyi amendment oylamalarını ayarlamak için okur; sonraki yeniden başlatmalarda, `[amendments]` ve `[veto_amendments]` dizelerini göz ardı eder ve bunun yerine şu mesajı yazdırır.

```text
Amendments:WRN [veto_amendments] yapılandırma dosyasında göz ardı edildi, verileri db/wallet.db'deki verilere karşı tercih edildi.
```

Bu hatayı çözmek için `[amendments]` ve `[veto_amendments]` dizesini yapılandırma dosyanızdan kaldırın. Daha fazla bilgi için `Amendment Oylaması` kısmına bakın.

---

## Konsensüs görünümü açıkken değişti

Aşağıdaki gibi günlük mesajları, bir sunucunun ağ ile senkronize olmadığı zamanlarda meydana gelir:

```text
LedgerConsensus:WRN Açıkken konsensüs görünümü değişti durum=açık, mod=öneriyor
LedgerConsensus:WRN 96A8DF9ECF5E9D087BAE9DDDE38C197D3C1C6FB842C7BB770F8929E56CC71661'dan 00B1E512EF558F2FD9A0A6C263B3D922297F26A55AEB56A009341A22895B516E'ye gitti
LedgerConsensus:WRN {"accepted":true,"account_hash":"89A821400087101F1BF2D2B912C6A9F2788CC715590E8FA5710F2D10BF5E3C03","close_flags":0,"close_time":588812130,"close_time_human":"2018-Aug-28 22:55:30.000000000","close_time_resolution":30,"closed":true,"hash":"96A8DF9ECF5E9D087BAE9DDDE38C197D3C1C6FB842C7BB770F8929E56CC71661","ledger_hash":"96A8DF9ECF5E9D087BAE9DDDE38C197D3C1C6FB842C7BB770F8929E56CC71661","ledger_index":"3","parent_close_time":588812070,"parent_hash":"5F5CB224644F080BC8E1CC10E126D62E9D7F9BE1C64AD0565881E99E3F64688A","seqNum":"3","totalCoins":"100000000000000000","total_coins":"100000000000000000","transaction_hash":"0000000000000000000000000000000000000000000000000000000000000000"}
```

partial file="/docs/_snippets/unsynced_warning_logs.md" /%}

---

## Konsensüs defteri üzerinde çalışmıyoruz

```text
NetworkOPs:WRN Konsensüs defteri üzerinde çalışmıyoruz
```

partial file="/docs/_snippets/unsynced_warning_logs.md" /%}

---

## Ayrıca Bakınız

- **Kavramlar:**
    - `rippled` Sunucusu`
    - `Teknik SSS`
- **Eğitimler:**
    - `Problemleri Teşhis Etmek`
    - `Kapasite Planlaması`
- **Referanslar:**
    - `rippled API Referansı`
        - `rippled` Komut Satırı Kullanımı`
        - [server_info metodu][]