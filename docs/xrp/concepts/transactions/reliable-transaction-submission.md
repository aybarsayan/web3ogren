---
title: Güvenilir İşlem Gönderimi
seoTitle: XRP Defteri ile Güvenilir İşlem Gönderimi
sidebar_position: 4
description: XRP Defterinde güvenli ve hızlı işlem göndermenin en iyi uygulamalarını keşfedin. İşlemlerinizi doğrulanabilir hale getirerek olası hatalardan nasıl kaçınabileceğinizi öğrenin.
tags: 
  - XRP
  - işlem gönderimi
  - güvenilir
  - geliştirme
  - blockchain
  - en iyi uygulamalar
  - iş süreçleri
keywords: 
  - XRP
  - işlem gönderimi
  - güvenilir
  - geliştirme
  - blockchain
  - en iyi uygulamalar
  - iş süreçleri
---

## Güvenilir İşlem Gönderimi

XRP Defteri'ni kullanan finansal kuruluşlar ve diğer hizmetler, burada açıklanan en iyi uygulamaları kullanarak işlemlerin doğrulanmasını veya reddedilmesini **doğrulanabilir** ve **hızlı** bir şekilde sağlamalıdır. İşlemleri güvenilir `rippled` sunucularına göndermelisiniz.

Bu belgede detaylandırılan en iyi uygulamalar, uygulamaların XRP Defteri'ne işlemleri gönderirken aşağıdakileri elde etmesine olanak tanır:

1. [İdempotans](https://en.wikipedia.org/wiki/Idempotence) - İşlemler bir kez işlenmeli veya hiç işlenmemelidir.
2. Doğrulanabilirlik - Uygulamalar bir işlemin nihai sonucunu belirleyebilir.

:::tip
Uygulamalar, yukarıda belirtilen en iyi uygulamaları takip ederek potansiyel hatalardan kaçınabilir.
:::

En iyi uygulamaları uygulamayan uygulamalar, aşağıdaki hatalarla karşılaşma riski altındadır:

- İstenmeden hiç yürütülmeyen işlemleri göndermek.
- Geçici işlem sonuçlarını nihai, değişmez sonuçlar ile karıştırmak.
- Daha önce deftere uygulanan işlemlerin yetkili sonuçlarını bulamamak.

Bu tür hatalar potansiyel olarak ciddi sorunlara yol açabilir. Örneğin, önceki bir başarılı ödeme işlemini bulamayan bir uygulama yanlışlıkla başka bir işlem gönderebilir ve bu, orijinal ödemenin kopyalanmasına neden olur. Bu, uygulamaların eylemlerini, bu belgede açıklanan teknikleri kullanarak, yetkili işlem sonuçlarına dayandırmasının önemini vurgulamaktadır.

## Arka Plan

XRP Defteri protokolü, ağdaki tüm sunucular arasında paylaşılan bir defter sağlar. `Konsensüs ve doğrulama süreci` aracılığıyla, ağ işlemlerin deftere uygulanma (veya çıkarılma) sırasını kabul eder.

Güvenilir XRP Defteri sunucularına sunulan iyi biçimlendirilmiş işlemler genellikle birkaç saniye içinde doğrulanır veya reddedilir. Ancak, iyi biçimlendirilmiş bir işlem bu kadar hızlı bir şekilde ne doğrulanır ne de reddedilir. Bir durum, küresel `işlem maliyeti` uygulama bir işlem gönderildikten sonra artarsa ortaya çıkabilir. İşlem maliyeti, işlemin içinde belirtilen değerin üstüne çıkarsa, işlem bir sonraki doğrulanan deftere dahil edilmez. Daha sonraki bir tarihte küresel işlem maliyeti azalırsa, işlem sonraki bir deftere dahil edilebilir. İşlemin süresi dolmadıysa, bu ne kadar sonra olacağı konusunda bir sınırlama yoktur.

:::warning
Bir güç veya ağ kesintisi meydana gelirse, uygulamalar gönderilen işlemlerin durumunu bulmakta daha fazla zorluk yaşar.
:::

Uygulamalar, bir işlemi doğru bir şekilde göndermenin yanı sıra, daha sonra yetkili sonuçları almak için de dikkatli olmalıdır.

### İşlem Zaman Çizelgesi

XRP Defteri'ne bir işlem gönderdiğinizde, `HTTP API`, bir `istemci kütüphanesi` veya başka bir uygulama kullanıp kullanmadığınıza bakılmaksızın, işlemin deftere uygulanma süreci aynıdır. Süreç şu şekilde işler:

1. Bir hesap sahibi bir işlem oluşturur ve imzalar.
2. Sahip, işlemi ağda bir aday işlem olarak gönderir.
    - Bozuk veya anlamsız işlemler hemen reddedilir.
    - İyi biçimlendirilmiş işlemler geçici olarak başarılı olabilir, sonra başarısız olabilir.
    - İyi biçimlendirilmiş işlemler geçici olarak başarısız olabilir, sonra başarılı olabilir.
    - İyi biçimlendirilmiş işlemler geçici olarak başarılı olabilir ve ardından hafifçe farklı bir şekilde başarılı olabilir. (Örneğin, `para birimlerini ticaret ederken` döviz kuru değişebilir.)
3. Konsensüs ve doğrulama yoluyla, işlem deftere uygulanır. Başarısız olan bazı işlemler bile ağa yayılma maliyetinin zorunlu tutulması için uygulanır.
4. Doğrulanan defter, işlemi içerir ve etkileri defter durumuna yansır.
    - İşlem sonuçları artık geçici değildir; başarı veya başarısızlık artık değişmezdir.

:::info
Bir [gönderme yöntemi][] ile dönen başarılı bir durum kodu, sunucunun aday işlemi aldığını gösterir. İşlem doğrulanan bir deftere uygulanabilir veya uygulanmayabilir.
:::

API'lar, geçici sonuçları mevcut olan, devam eden deftere aday işlemlerin uygulanması sonucuna dayalı olarak dönebilir. Uygulamalar, bunları nihai, *değişmez* sonuçlarla karıştırmamalıdır. Değişmez sonuçlar yalnızca doğrulanan defterlerde bulunur. Uygulamalar, işlem sonuçlarının bulunduğu defterin doğrulandığı ana kadar, bir işlemin durumunu tekrar tekrar sorgulamak zorunda kalabilir.

---

İşlemleri uygulatırken `rippled` sunucuları, tüm ağın doğruladığı işlemlere dayanan defter durumunun bir görüntüsü olan *son doğrulanan defteri* kullanır. Konsensüs ve doğrulama süreci, en son doğrulanan deftere yeni işlemler setini, belirli bir sırayla ekleyerek yeni bir doğrulanan defter oluşturur. Bu yeni doğrulanan defter sürümü ve onu takip eden sürümler, defter tarihini oluşturur.

Her doğrulanan defter sürümünün bir defter indeksi vardır; bu da bir önceki defter sürümünün defter indeksinden 1 daha büyüktür. Her defter ayrıca, içeriğinden benzersiz olarak belirlenen bir tanımlayıcı hash değerine sahiptir. Çeşitli ilerideki defter sürümleri, aynı defter indeksine sahip olabilir ancak farklı hash değerlerine sahip olabilir. Sadece bir sürüm doğrulanabilir.

Her doğrulanan defter, işlemlerin uygulandığı bir kanonik sıraya sahiptir. Bu sıra, defterin son işlem setine dayalı olarak belirlenmiştir. Buna karşın, her `rippled` sunucusunun devam eden defteri, işlemler alındıkça kademeli olarak hesaplanır. İşlemlerin geçici olarak yürütülme sırası genellikle, yeni bir doğrulanan defter oluşturma işlemlerinin yürütülme sırası ile aynı değildir. Bu nedenle, bir işlemin geçici sonucu nihai sonuçtan farklı olabilir. Örneğin, bir ödemenin, aynı teklifi kullanacak başka bir ödemenin önce veya sonra yürütülüp yürütülmemesine bağlı olarak farklı bir nihai döviz kuru alması mümkündür.

### LastLedgerSequence

`LastLedgerSequence`, tüm işlemlerin `parametrelerinden biridir`. Bu, XRP Defteri'ne, bir işlemin belirli bir defter sürümünde veya öncesinde doğrulanması gerektiğini belirtir. XRP Defteri, bir işlemin `LastLedgerSequence` parametresinden daha yüksek bir defter indeksine sahip bir defter sürümünde işlemi hiçbir zaman dahil etmez.

:::note
`LastLedgerSequence` parametresini, bir işlemin zamanında onaylanmadığı ancak gelecekte bir deftere dahil edilebileceği istenmeyen durumları önlemek için kullanın.
:::

Her işlemde `LastLedgerSequence` parametresini belirtilmelisiniz. Otomatik süreçler, bir işlemin öngörülebilir ve hızlı bir şekilde doğrulanmasını veya reddedilmesini sağlamak için son doğrulanan defter indeksine 4 ek bir değer kullanmalıdır.

`HTTP / WebSocket API'lerini` kullanan uygulamalar, işlemleri gönderirken açıkça bir `LastLedgerSequence` belirtmelidir. Bazı `istemci kütüphaneleri` de `otomatik doldurma` yapılacak makul bir değer sağlayabilir; detaylar kütüphaneye göre değişir.

## En İyi Uygulamalar

Aşağıdaki diyagram, bir işlemi göndermenin ve sonucunu belirlemenin önerilen akışını özetler:


### Güvenilir İşlem Gönderimi

İşlem gönderen uygulamalar, bir süreç başarısız olsa dahi işlemleri güvenilir bir şekilde göndermek için aşağıdaki uygulamaları kullanmalıdır. Uygulama işlem sonuçları, nihai ve onaylı sonuçlara dayanarak doğrulanmalıdır.

Gönderim ve doğrulama, bu belgede açıklanan mantığı kullanarak uygulanabilecek iki ayrı prosedürdür.

1. Gönderim - İşlem ağa gönderilir ve geçici bir sonuç döner.
2. Doğrulama - Yetkili sonuç, doğrulanan defterlerin incelenmesi ile belirlenir.

### Gönderim

Bir güç kaybı veya ağ kesintisi durumunda işlemin gönderiminden önce [sürekleyin](https://en.wikipedia.org/wiki/Persistence_%28computer_science%29) işlem ayrıntılarını. Yeniden başlatıldığında, saklanan değerler, işlemin durumunu doğrulamak için mümkün kılar.

Gönderim süreci:

1. İşlemi hazırla ve imzala
    - `LastLedgerSequence` parametresini ekle
2. İşlem ayrıntılarını sakla ve şunları kaydet:
    - İşlem hash'i
    - `LastLedgerSequence`
    - Gönderen adresi ve sıra numarası
    - Gönderim sırasında en son onaylanan defter indeksi
    - Gerektiğinde uygulama ile ilgili veriler
3. İşlemi gönder

### Doğrulama

Normal çalışma sırasında, uygulamalar gönderilen işlemlerin durumunu hash'leri aracılığıyla kontrol edebilir; veya, kullanılan API'ye bağlı olarak, işlemler doğrulandığında (veya başarısız olduğunda) bildirimler alabilirler. Bu normal işleyiş, ağ kesintileri veya güç kesintileri gibi durumlarla kesintiye uğrayabilir. Böyle bir kesinti durumunda uygulamalar, kesintiden önce ağa gönderilmiş olan işlemlerin durumunu doğrulamak zorundadır.

Yeniden başlatıldığında veya yeni bir son doğrulanan defter belirlendiğinde (pseudocode):

```
Doğrulanmamış her işlem için:
    Hash ile işlemi sorgula
    Eğer (sonuç herhangi bir doğrulanan defterde görünüyorsa)
        # Sonuç nihai
        Nihai sonucu sakla
        Eğer (sonuç kodu tesSUCCESS ise)
            Uygulama başarılı işlem sonuçlarına dayanarak harekete geçebilir
        Aksi takdirde
            İşlem başarısız oldu (1)
            Uygun ise ve başarısızlık türüne uygun ise, yeni
                LastLedgerSequence ve Ücret ile gönder

    Aksi takdirde (LastLedgerSequence > en yeni doğrulanan defter)
        # Sonuç henüz nihai değil
        Daha fazla defterin doğrulanmasını bekleyin

    Aksi takdirde
        Eğer (sunucu, defterin işlem gönderildiği zaman diliminden başlayarak
              LastLedgerSequence ile tanımlanan deftere kadar olan sürekli defter geçmişine sahipse)

            # Akıl sağlığı kontrolü
            Eğer (gönderen hesap sırası > işlem sırası)
                Bu sıraya sahip farklı bir işlemin nihai sonucu var.
                Manuel müdahale önerilir (3)
            Aksi takdirde
                İşlem başarısız oldu (2)

        Aksi takdirde
            # Sonuç nihai, ancak bir defter boşluğundan dolayı bilinmiyor
            Sürekli defter tarihine ulaşmak için bekleyin
```

#### Hata Durumları

İki işlem hata durumu arasındaki fark (pseudocode'ta (1) ve (2) olarak etiketlenmiştir), işlemin doğrulanan bir deftere dahil olup olmadığıdır. Her iki durumda da hatayı nasıl işleyeceğinizi dikkatlice belirlemelisiniz.

- Hata durumu (1) için, işlem doğrulanan bir defterde yer aldı ve `XRP işlem maliyetini` yok etti, ancak başka hiçbir şey yapmadı. Bu, likidite eksikliğinden, yanlış tanımlanmış `yollar` veya diğer durumlardan kaynaklanabilir. Bu tür birçok hata için, benzer bir işlem ile hemen yeniden denemek muhtemelen aynı sonuca yol açacaktır. Durumların değişmesini bekleyerek farklı sonuçlar elde edebilirsiniz.

- Hata durumu (2) için, işlem doğrulanan bir deftere dahil edilmedi, bu nedenle hiçbiri yok. Bu, işlem maliyetinin XRP Defteri'ndeki mevcut yük için çok düşük olmasından, `LastLedgerSequence`'nin çok erken olmasından veya dengesiz bir ağ bağlantısı gibi diğer nedenlerden kaynaklanabilir.

    - Hata durumu (1) ile karşılaştırıldığında, yalnızca `LastLedgerSequence`'yi ve muhtemelen `Fee`'yi değiştirirseniz, yeni bir işlemin başarılı olması daha muhtemeldir ve yine de gönderin. İlgili işlem için aynı `Sıra` numarasını kullanın.

    - Ayrıca, işlemin defter durumundan dolayı başarılı olamayabileceği de mümkündür; örneğin, gönderen adresi işlem imzalamak için kullanılan anahtar çiftini devre dışı bıraktıysa. İşlemin geçici sonucu bir `tef` sınıf kodu` ise, daha fazla değişiklik olmadan başarılı olması muhtemel değildir.

- Hata durumu (3), beklenmeyen bir durumu temsil eder. Bir işlem işlenmediğinde, en son doğrulanan defterde gönderen hesabının `Sıra` numarasını kontrol etmelisiniz. (Bunu [account_info method][] ile yapabilirsiniz.) Eğer hesabın en son doğrulanan defterdeki `Sıra` değeri, işlemin `Sıra` değerinden büyükse, o zaman aynı `Sıra` değerine sahip farklı bir işlem doğrulanan bir deftere dahil edilmiştir. Sistemin diğer işlemi bilmemesi durumunda, beklenmedik bir durumdasınız ve neden meydana geldiğini belirleyene kadar işlem yapmayı durdurmalısınız; aksi takdirde, sisteminiz aynı şeyi yapmak için birden fazla işlem gönderebilir. Alınacak adımlar, hangi durumun neden olduğunu belirlemenize bağlı olacaktır. Bazı olasılıklar şunlardır:

    - Önceden gönderilmiş bir işlem `malleable` olabilir ve aslında doğrulanan bir deftere dahil edilmiştir, ancak beklediğinizden farklı bir hash ile. Bu, belirtilen bir dizi bayrak içeriyorsa `tfFullyCanonicalSig` bayrağını içermemesi veya işlemin daha fazla imzacı tarafından çoklu imzalanması durumunda olabilir. Bu durumdaysanız, farklı hash'i ve işlemin nihai sonucunu kaydedin, ardından normal etkinliklerinize devam edin.

    - İşlemi `iptal ettiniz` ve yerine bir işlem koydunuz, ve yer değiştirme işlemi yerine işlendi. Bir kesintiden toparlanıyorsanız, yer değiştirme işleminin kaydını kaybetmiş olabilirsiniz. Bu durumda, başlangıçta aradığınız işlem kalıcı olarak başarısız oldu ve yer değiştirme işleminin nihai sonucu doğrulanan bir defter sürümünde kaydedildi. Her iki nihai sonucu da kaydedin, herhangi başka kaybolan veya yer değiştirilen işlemleri kontrol edin ve ardından normal faaliyetlerinize devam edin.

    - İki veya daha fazla işlem gönderen sistemin aktif/pasif bir failover yapılandırmasında bulunması durumunda, pasif sistem, aktif sistemin başarısız olduğunu düşünerek yanlışlıkla aktif hale geçmiş olabilir ve orijinal aktif sistem hala işlemler göndermeye devam ediyorsa. Sistemler arasındaki bağlantıyı kontrol edin ve en fazla birinin aktif olduğundan emin olun. Hesabınızın işlem geçmişini kontrol edin (örneğin, [account_tx method][] ile) ve doğrulanan defterlerde dahil edilen tüm işlemlerin nihai sonucunu kaydedin. Aynı `Sıra` numarasına sahip farklı işlemler kalıcı olarak başarısız olmuştur; bu nihai sonuçları da kaydedin. Tüm sistemlerden gelen farklılıkları uzlaştırmayı tamamladıktan ve sistemlerin aynı anda etkinleşmesine neden olan sorunları çözdükten sonra, normal faaliyetlerinize devam edin.

        :::success
        `AccountTxnID` alanı`, bu durumda tekrarlayan işlemlerin başarılı olmasını önlemeye yardımcı olabilir.
        :::

    - Kötü niyetli bir aktör, işlemi göndermek için gizli anahtarınızı kullanmış olabilir. Bu durumda, mümkünse `anahtar çiftinizi değiştirin` ve başka gönderilen işlemleri kontrol edin. Gizli anahtarınızın daha büyük bir sızma veya güvenlik açığı parçası olup olmadığını belirlemek için ağınızı denetlemelisiniz. Anahtar çiftinizi başarıyla değiştirdiğinizde ve kötü niyetli aktörün artık hesaplarınıza ve sistemlerinize erişimi olmadığından emin olduğunuzda, normal faaliyetlerinize devam edebilirsiniz.

#### Defter Boşlukları

Eğer sunucunuz, işlemin orijinal olarak gönderildiği zamandan başlayarak `LastLedgerSequence` ile tanımlanan deftere kadar olan sürekli bir defter tarihine sahip değilse, işlemin nihai sonucunu bilemeyebilirsiniz. (Eğer, sunucunuzun eksik olduğu defter sürümlerinden birine dahil olduysa, başarısından ya da başarısızlığından emin olamazsınız.)

`rippled` sunucunuz, gönderim tamamlanmadan önce eksik defter sürümlerini otomatik olarak edinmelidir (CPU/RAM/disk IO için yeterli kaynağı olduğunda), sunucunun `saklayacak yapılandırılmış tarih miktarı` kadar eski defter sürümlerinde olunduğunda. Boşluğun boyutuna ve sunucunuzun kaynak kullanımına bağlı olarak, eksik defterleri edinmek birkaç dakika sürmelidir. Sunucunuzun eksik tarihli defter sürümlerini almak için [ledger_request method][] kullanabilirsiniz; ancak yine de sunucunuzun yapılandırılmış tarih aralığının dışındaki defter sürümlerinden işlem sonuçlarını aramak mümkün olmayabilir.

Alternatif olarak, ihtiyacınız olan defter tarihine zaten sahip olan farklı bir `rippled` sunucusunu kullanarak işlemin durumunu kontrol edebilirsiniz; örneğin, Ripple'ın `s2.ripple.com` adresindeki tam tarihli sunucuları. Bu amaç için yalnızca güvendiğiniz bir sunucuyu kullanın. Kötü niyetli bir sunucu, bir işlemin durumu ve sonucu hakkında yanlış bilgi sağlayacak şekilde programlanmış olabilir.

## Teknik Uygulama

İşlem gönderimi ve doğrulama en iyi uygulamalarını uygulamak için, uygulamalar aşağıdakileri yapmalıdır:

1. İmzalama hesabının bir sonraki sıra numarasını belirleyin
    * Her işlem, hesaba özgü bir `sıra numarasına` sahiptir. Bu, bir hesap tarafından imzalanan işlemlerin yürütülme sırasını garanti eder ve bir işlemi yeniden göndermenin tehlikesiz olmasını sağlar.
2. Bir `LastLedgerSequence` belirleyin
     * Bir işlemin `LastLedgerSequence`'si, en son doğrulanan defter indeksinden hesaplanır.
3. İşlemi oluşturun ve imzalayın
    * Gönderimden önce imzalı bir işlemin ayrıntılarını saklayın.
4. İşlemi gönderin
    * İlk sonuçlar geçici ve değişime tabi olacaktır.
5. Bir işlemin nihai sonucunu belirleyin
    * Nihai sonuçlar, defter tarihinin değişmez bir parçasıdır.

Uygulamanın bu eylemleri nasıl gerçekleştireceği, uygulamanın kullandığı API'ye bağlıdır. Bir uygulama, aşağıdaki arayüzlerden herhangi birini kullanabilir:

- XRP Defteri sunucuları tarafından sağlanan `HTTP / WebSocket API'leri`
- Bir `istemci kütüphanesi`
- Yukarıdaki API'lerin üzerine yerleşik diğer ara yazılımlar veya API'ler

### rippled - İşlemleri Göndermek ve Doğrulamak

---
title: Hesap Sırasını Belirle
seoTitle: XRP Hesap Sırasını Belirleme Yöntemleri
sidebar_position: 9
description: Bu belgede, bir XRP hesabının son onaylanan defterdeki hesap sırasını öğrenmek için gerekli adımlar açıklanmaktadır. Kullanıcılar, ayrıca, işlemleri oluşturma ve gönderme süreçlerini detaylı bir şekilde inceleyebilirler.
keywords: [XRP, hesap sırası, işlem oluşturma, defter, ripple]
---

#### Hesap Sırasını Belirle

`rippled`, bir hesabın son onaylanan defterdeki sıra numarasını öğrenmek için [account_info method][]'unu sağlar.

JSON-RPC İsteği:

```json
{
  "method": "account_info",
  "params": [
    {
      "account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
      "ledger_index": "validated"
    }
  ]
}
```

Yanıt gövdesi:

```json
{
    "result": {
        "validated": true,
        "status": "success",
        "ledger_index": 10266396,
        "account_data": {
            "index": "96AB97A1BBC37F4F8A22CE28109E0D39D709689BDF412FE8EDAFB57A55E37F38",
            "Sequence": 4,
            "PreviousTxnLgrSeq": 9905632,
            "PreviousTxnID": "CAEE0E34B3DB50A7A0CA486E3A236513531DE9E52EAC47CE4C26332CC847DE26",
            "OwnerCount": 2,
            "LedgerEntryType": "AccountRoot",
            "Flags": 0,
            "Balance": "49975988",
            "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
        }
    }
}
```

:::info
Bu örnekte, hesabın sırası **4**'tür (not alın: `"Sequence": 4`, `"account_data"` içinde) en son onaylanan defterde (not alın: `"ledger_index": "validated"` istek içinde, ve `"validated": "true"` yanıt içinde). 
:::

Eğer bir uygulama bu hesapla imzalanmış üç işlem gönderirse, sıra numaralarını 4, 5 ve 6 kullanacaklardır. Birden fazla işlemi her birinin onaylanmasını beklemeden göndermek için, **bir uygulama sürekli bir hesap sıra numarasını korumalıdır.**

---
title: Güvenilir İşlem Gönderimi
seoTitle: Güvenilir İşlem Gönderimi - Ripple
sidebar_position: 1
description: Bu bölüm, güvenilir işlem gönderimini kapsamaktadır. İlgili yöntemler ve örnek istek/yanıtlarıyla birlikte işlemlerin nasıl yönetileceğine dair bilgi verir.
tags:
  - güvenilir işlemler
  - ripple
  - blockchain
  - uygulama geliştirme
keywords:
  - güvenilir işlem
  - ripple
  - blockchain
  - uygulama geliştirme
---

## Son Onaylanan Defteri Belirle

[server_state method][] son onaylanan defterin defter indeksini döner.

İstek:

```json
{
  "id": "client id 1",
  "method": "server_state"
}
```

Yanıt:

```json
{
    "result": {
        "status": "success",
        "state": {
            "validation_quorum": 3,
            "validated_ledger": {
                "seq": 10268596,
                "reserve_inc": 5000000,
                "reserve_base": 20000000,
                "hash": "0E0901DA980251B8A4CCA17AB4CA6C3168FE83FA1D3F781AFC5B9B097FD209EF",
                "close_time": 470798600,
                "base_fee": 10
            },
            "server_state": "full",
            "published_ledger": 10268596,
            "pubkey_node": "n9LGg37Ya2SS9TdJ4XEuictrJmHaicdgTKiPJYi8QRSdvQd3xMnK",
            "peers": 58,
            "load_factor": 256000,
            "load_base": 256,
            "last_close": {
                "proposers": 5,
                "converge_time": 3004
            },
            "io_latency_ms": 2,
            "fetch_pack": 10121,
            "complete_ledgers": "10256331-10256382,10256412-10268596",
            "build_version": "0.26.4-sp3-private"
        }
    }
}
```

:::note
Bu örnekte son onaylanan defter indeksi **10268596**'dır (yanıt içerisinde `result.state.validated_ledger` altında bulunur). Ayrıca bu örnek, defter geçmişinde bir boşluk olduğunu göstermektedir.
:::

Buradaki sunucu, o boşlukta uygulanan işlemler hakkında bilgi sağlayamayacaktır (defterler 10256383 ile 10256411 arasındadır). Eğer bu şekilde yapılandırılmışsa, sunucu nihayetinde defter geçmişinin o kısmını geri alacaktır.

---

## İşlemi Oluştur

`rippled`, bir işlemi göndermek için hazırlamak üzere [sign method][]'unu sağlar. Bu yöntem, yalnızca güvenilir `rippled` örneklerine iletilmesi gereken bir hesap gizli anahtarı gerektirir. Bu örnek, **10 FOO** (hayali bir para birimi) başka bir XRP Defter adresine iletmektedir.

İstek:

```json
{
    "method": "sign",
    "params": [
        {
            "offline": true,
            "secret": "s████████████████████████████",
            "tx_json": {
               "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                "Sequence": 4,
                "LastLedgerSequence": 10268600,
                "Fee": "10000",
                "Amount": {
                    "currency": "FOO",
                    "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                    "value": "10"
                },
                "Destination": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
                "TransactionType": "Payment"
            }
        }
    ]
}
```

:::tip
Uygulamanın daha önce `account_info` çağrısından öğrendiği hesap sırasını `"Sequence": 4` olarak belirttiğini unutmayın ve `tefPAST_SEQ` hatalarını önlemek için dikkate almıştır.
:::

Ayrıca, uygulamamızın `server_state` ile öğrendiği son onaylanan deftere dayanan `LastLedgerSequence`'i de unutmayın. Arka uç uygulamaları için öneri, *(son onaylanan defter indeksi + 4)* kullanmaktır. Alternatif olarak, *(mevcut defter + 3)* değeri kullanın. Eğer `LastLedgerSequence` hesaplanırken yanlış yapılır ve son onaylanan defterden daha az olursa, işlem `tefMAX_LEDGER` hatası ile başarısız olur.

Yanıt:

```json
{
    "result": {
        "tx_json": {
            "hash": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE57",
            "TxnSignature": "304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C753",
            "TransactionType": "Payment",
            "SigningPubKey": "0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5",
            "Sequence": 4,
            "LastLedgerSequence": 10268600,
            "Flags": 2147483648,
            "Fee": "10000",
            "Destination": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
            "Amount": {
                "value": "10",
                "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                "currency": "FOO"
            },
            "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
        },
        "tx_blob": "12000022800000002400000004201B009CAFB861D4C38D7EA4C68000000000000000000000000000464F4F0000000000AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A68400000000000271073210267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC57446304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C7538114AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A831438BC6F9F5A6F6C4E474DB0D59892E90C2C7CED5C",
        "status": "success"
    }
}
```

:::warning
Uygulamalar, işlem gönderilmeden önce işlemin hash'ini saklamalıdır. `sign` yönteminin sonucu, hash'i `tx_json` altında içerir.
:::

---

## İşlemi Gönder

`rippled`, imzalanmış işlemi göndermek için [submit method][]'unu sağlar. Bu, `sign` yönteminden dönen `tx_blob` parametresini kullanır.

İstek:

```json
{
    "method": "submit",
    "params": [
        {
        "tx_blob": "12000022800000002400000004201B009CAFB861D4C38D7EA4C68000000000000000000000000000464F4F0000000000AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A68400000000000271073210267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC57446304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C7538114AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A831438BC6F9F5A6F6C4E474DB0D59892E90C2C7CED5C"
        }
    ]
}
```

Yanıt:

```json
{
    "result": {
        "tx_json": {
            "hash": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE57",
            "TxnSignature": "304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C753",
            "TransactionType": "Payment",
            "SigningPubKey": "0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5",
            "Sequence": 4,
            "LastLedgerSequence": 10268600,
            "Flags": 2147483648,
            "Fee": "10000",
            "Destination": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
            "Amount": {
                "value": "10",
                "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                "currency": "FOO"
            },
            "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
        },
        "tx_blob": "12000022800000002400000004201B009CAFB861D4C38D7EA4C68000000000000000000000000000464F4F0000000000AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A68400000000000271073210267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC57446304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C7538114AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A831438BC6F9F5A6F6C4E474DB0D59892E90C2C7CED5C",
        "status": "success",
        "engine_result_message": "İşlem uygulandı.",
        "engine_result_code": 0,
        "engine_result": "tesSUCCESS"
    }
}
```

:::danger
Bu bir **ön sonuç**tur. Nihai sonuçlar yalnızca onaylanan defterlerden temin edilebilir. `"validated": true` alanının olmaması, bunun **değişmez bir sonuç** olmadığını göstermektedir.
:::

---

## İşlemi Doğrula

İşlem hash'i, işlem imzalandığında oluşturulan, [tx method][]'una geçilir ve işlemin sonucunu almak için kullanılır.

İstek:

```json
{
    "method": "tx",
    "params": [
        {
            "transaction": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE57",
            "binary": false
        }
    ]
}
```

Yanıt:

```json
{
    "result": {
        "validated": true,
        "status": "success",
        "meta": {
            "TransactionResult": "tesSUCCESS",
            "TransactionIndex": 2,
            "AffectedNodes": [...]
        },
        "ledger_index": 10268599,
        "inLedger": 10268599,
        "hash": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE57",
        "date": 470798270,
        "TxnSignature": "304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C753",
        "TransactionType": "Payment",
        "SigningPubKey": "0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5",
        "Sequence": 4,
        "LastLedgerSequence": 10268600,
        "Flags": 2147483648,
        "Fee": "10000",
        "Destination": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
        "Amount": {
            "value": "10",
            "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
            "currency": "FOO"
        },
        "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
    }
}
```

:::tip
Bu örnek yanıt, `"validated": true` alanını gösterir, yani işlem onaylanan bir deftere dahil edilmiştir, böylece işlemin sonucu değişmez. Ayrıca, metadata `"TransactionResult": "tesSUCCESS"` içermektedir, bu da işlemin deftere uygulandığını göstermektedir.
:::

Eğer yanıt `"validated": true` içermezse, sonuç geçici olup değişebilir. Nihai bir sonucu almak için uygulamalar `tx` yöntemini tekrar çağırmalıdır, ağın daha fazla defter versiyonunu onaylamak için yeterince zaman tanımaları gerekir. Belirtilen `LastLedgerSequence`'deki defterin onaylanmasını beklemek gerekebilir, ancak işlem, daha önce onaylanan bir deftere dahil edilmişse, o anda sonuç değişmez hale gelir.

---

## Kaybolan İşlemi Doğrula

Uygulamalar, [tx method][] çağrısı `txnNotFound` hatası döndüğünde bu durumları yönetmelidir.

```json
{
    "result": {
        "status": "error",
        "request": {
            "transaction": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE56",
            "command": "tx",
            "binary": false
        },
        "error_message": "İşlem bulunamadı.",
        "error_code": 24,
        "error": "txnNotFound"
    }
}
```

:::warning
`txnNotFound` sonucu, işlemin hiçbir deftere dahil edilmediği durumlarda meydana gelir. Bununla birlikte, ayrıca bir `rippled` örneğinin eksik bir defter geçmişine sahip olduğu veya işlemin henüz `rippled` örneğine yayılmadığı durumlarda da meydana gelebilir. Uygulamalar, nasıl tepki vereceklerini belirlemek için daha fazla sorgu yapmalıdır.
:::

Daha önce son onaylanan defteri belirlemek için kullanılan [server_state method][] `result.state.complete_ledgers` altında defter geçmişinin ne kadar eksiksiz olduğunu gösterir.

```json
{
    "result": {
        "status": "success",
        "state": {
            "validation_quorum": 3,
            "validated_ledger": {
                "seq": 10269447,
                "reserve_inc": 5000000,
                "reserve_base": 20000000,
                "hash": "D05C7ECC66DD6F4FEA3A6394F209EB5D6824A76C16438F562A1749CCCE7EAFC2",
                "close_time": 470802340,
                "base_fee": 10
            },
            "server_state": "full",
            "pubkey_node": "n9LJ5eCNjeUXQpNXHCcLv9PQ8LMFYy4W8R1BdVNcpjc1oDwe6XZF",
            "peers": 84,
            "load_factor": 256000,
            "load_base": 256,
            "last_close": {
                "proposers": 5,
                "converge_time": 2002
            },
            "io_latency_ms": 1,
            "complete_ledgers": "10256331-10256382,10256412-10269447",
            "build_version": "0.26.4-sp3-private"
        }
    }
}
```

:::note
Örneğimizdeki işlem, belirtilen `LastLedgerSequence` **10268600** olarak, o zamanki son onaylanan defterin üzerine dört eklenerek belirlenmiştir. Kaybolmuş işlemin kalıcı olarak başarısız olup olmadığını belirlemek için, `rippled` sunucusunun 10268597 ile 10268600 arasındaki defterleri bulundurması gerekir.
:::

Eğer sunucu bu onaylanan defterleri geçmişinde bulunduruyorsa, **ve** `tx` `txnNotFound` dönerse, işlem başarısız olmuş ve gelecekte hiçbir deftere dahil edilmemiştir. Bu durumda, uygulama mantığı, aynı hesap sırasıyla güncellenmiş bir `LastLedgerSequence` ile bir yedek işlem inşa edip göndermeyi gerektirebilir.

Sunucu, belirtilen `LastLedgerSequence`'den daha düşük bir son onaylanan defter indeksi rapor edebilir. Eğer öyleyse, `txnNotFound`, ya (a) gönderilen işlemin ağa yayılmadığını, ya da (b) işlemin ağa dağıtılmış olduğunu, fakat henüz işlenmediğini gösterir. İlk durumu ele almak için, uygulamalar aynı imzalı işlemi tekrar gönderebilir. İşlemin benzersiz bir hesap sıra numarasına sahip olması nedeniyle, en fazla bir kez işlenebilir.

Son olarak, sunucu işlem geçmişinde bir veya daha fazla boşluk gösterebilir. Yukarıdaki yanıtta gösterilen `completed_ledgers` alanı, 10256383 ile 10256411 arasındaki defterlerin bu `rippled` örneğinden kaybolduğunu belirtmektedir. Örneğimizdeki işlem yalnızca 10268597 - 10268600 defterlerinde (ne zaman gönderildiği ve `LastLedgerSequence`'e dayalı olarak) yer alabilir, bu yüzden buradaki gösterilen boşluk ilgili değildir. Ancak, eğer gösterilen boşluk o aralıkta bir defterin kaybolduğunu gösteriyorsa, o zaman bir uygulamanın kaybolan defterleri almak için başka bir `rippled` sunucusunu sorgulaması (veya bu sunucunun kaybolan defterleri geri almasını beklemesi) gerekecektir, böylece `txnNotFound` sonucu değişmez olduğu anlaşılabilir.

---

## Ayrıca Bakınız

- `İşlem Formatları`
- `İşlem Maliyeti`
- `İşlem Malleabilitesi`
- `XRP Defter Konsensüs Süreci Genel Bakış`
- `Konsensüs Prensipleri ve Kuralları`

