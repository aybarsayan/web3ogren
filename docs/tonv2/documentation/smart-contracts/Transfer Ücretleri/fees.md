# İşlem Ücretleri

Her TON kullanıcısı, _komisyonun birçok faktöre bağlı olduğunu_ unutmamalıdır.

## Gaz

Tüm `hesaplama maliyetleri` gaz birimlerinde belirtilir ve belirli bir gaz miktarında sabittir.

Gaz birimlerinin fiyatı [ağ yapılandırması](https://tonviewer.com/config#20) tarafından belirlenir ve yalnızca doğrulayıcıların mutabakatı ile değiştirilmesi mümkündür. Diğer sistemlerin aksine, kullanıcı kendi gaz fiyatını belirleyemez ve bir ücret pazarı yoktur.

Mevcut ayarlar temel zincirde şu şekildedir: 1 gaz birimi 400 nanotondur.

```cpp
1 gaz = 26214400 / 2^16 nanotondur = 0,000 000 4 TON
```

Mevcut ayarlar ana zincirde şu şekildedir: 1 gaz birimi 10000 nanotondur.

```cpp
1 gaz = 655360000 / 2^16 nanotondur = 0,000 01 TON
```

### Ortalama işlem maliyeti

> **TLDR:** Bugün, her işlem yaklaşık **~0.005 TON** tutuyor.  
> **TON fiyatı 100 kat artsa bile, işlemler ultra ucuz kalacak; 0,01 dolardan daha az.**  
> **Dahası, doğrulayıcılar, komisyonların pahalı hale geldiğini görürlerse bu değeri düşürebilirler** — `neden ilgilendiklerini okuyun`.

:::info
Mevcut gaz miktarı, Ağ Konfigürasyonu [parametre 20](https://tonviewer.com/config#20) ve [parametre 21](https://tonviewer.com/config#21) olarak ana zincir ve temel zincir için yazılıdır.
:::

### Gaz değişimi oylama süreci

Gaz ücreti, diğer birçok TON parametresi gibi, yapılandırılabilir ve ana ağda yapılan özel bir oy ile değiştirilebilir.

Herhangi bir parametrenin değiştirilmesi, doğrulayıcı oylarının %66'sını almayı gerektirir.

#### Gaz daha fazla maliyetli olabilir mi?

> *Bu, bir gün gaz fiyatlarının 1,000 kat artabileceği anlamına mı geliyor?*  
> **Teknik olarak, evet; ama gerçekte, hayır.**  
> **Doğrulayıcılar, işlemleri işlemek için küçük bir ücret alırlar ve daha yüksek komisyonlar talep etmek, işlem sayısında bir düşüşe yol açacak ve doğrulama sürecini daha az avantajlı hale getirecektir.** — 

### Ücretler nasıl hesaplanır?

TON üzerindeki ücretler önceden hesaplanması zor olduğu için; miktarları işlem süresi, hesap durumu, mesaj içeriği ve boyutu, blok zinciri ağ ayarları ve işlem gönderilene kadar hesaplanamayan diğer birçok değişkene bağlıdır.

Bu nedenle, NFT pazarları genellikle ek bir TON miktarı (_~1 TON_) alır ve (_`1 - transaction_fee`_) daha sonra iade eder.

:::info
Her sözleşme, gelen mesajları TON miktarının yeterli olup olmadığını kontrol etmelidir.

Komisyon hesaplama formülleri hakkında daha fazla bilgi edinmek için `düşük seviyeli ücretler genel bakışını` kontrol edin ve FunC sözleşmelerinde ücretleri nasıl hesaplayacağınızı öğrenmek için `ücret hesaplama` bölümünü inceleyin.
:::

Ancak, TON'daki ücretlerin nasıl işlediğini daha fazla okumaya devam edelim.

## Temel Ücretler Formülü

TON üzerindeki ücretler bu formül ile hesaplanır:

```cpp
transaction_fee = storage_fees
                + in_fwd_fees
                + computation_fees
                + action_fees
                + out_fwd_fees
```

## İşlem ücreti bileşenleri

* `storage_fees`, blok zincirinde bir akıllı sözleşmeyi depolamak için ödediğiniz tutardır. Gerçekte, akıllı sözleşme blok zincirinde her saniye depolandığında ödenir.
  * _Örnek_: TON cüzdanınız aynı zamanda bir akıllı sözleşmedir ve her seferinde, bir işlem aldığınızda veya gönderdiğinizde bir depolama ücreti öder. `Depolama ücretlerinin nasıl hesaplandığını` daha fazla okuyun.
* `in_fwd_fees`, yalnızca blok zincirinin dışından gelen mesajları (örn. `external` mesajları) içe aktarma ücreti. Her işlem yaptığınızda, doğrulayıcılara ulaşması gerekir. Sözleştten sözleşmeye sıradan mesajlar için bu ücret geçerli değildir. Giriş mesajları hakkında daha fazla bilgi edinmek için [TON Blockchain belgesini](https://docs.ton.org/tblkch.pdf) okuyun.
  * _Örnek_: Cüzdan uygulamanız (örneğin Tonkeeper) ile yaptığınız her işlem, öncelikle doğrulama düğümleri arasında dağıtılmalıdır.
* `computation_fees`, sanal makinede kodu çalıştırmak için ödediğiniz tutardır. Kod ne kadar büyükse, o kadar fazla ücret ödenmelidir.
  * _Örnek_: Cüzdanınızı kullanarak bir işlem yaptığınızda (bu bir akıllı sözleşmedir), cüzdan sözleşmenizin kodunu çalıştırırsınız ve bunun için ödeme yaparsınız.
* `action_fees`, bir akıllı sözleşme tarafından gönderilen çıkış mesajlarının, akıllı sözleşme kodunun güncellenmesi, kütüphanelerin güncellenmesi vb. için aldığı ücrettir.
* `out_fwd_fees`, TON Blockchain dışına mesaj göndermek için, dış hizmetlerle (örn. günlükler) ve harici blok zincirleriyle etkileşimde bulunmak için alınan ücreti temsil eder.

## SSS

TON ziyaretçilerinin en sık sorduğu sorular şunlardır:

### TON göndermenin ücreti nedir?

Herhangi bir miktarda TON göndermenin ortalama ücreti 0.0055 TON'dur.

### Jetton göndermenin ücreti nedir?

Herhangi bir miktarda özel jetton göndermenin ortalama ücreti 0.037 TON'dur.

### NFT basmanın maliyeti nedir?

Bir NFT basmanın ortalama ücreti 0.08 TON'dur.

### TON'da veri saklamanın maliyeti nedir?

TON'da 1 MB veri saklamanın bir yıllık maliyeti 6.01 TON'dur. **Genellikle blok zincirinde büyük miktarda veri depolamanıza gerek olmadığını unutmayın.**  
**Merkeziyetsiz depolama ihtiyacınız varsa** — `TON Storage` kullanmayı düşünün.

### Gazsız bir işlem göndermek mümkün mü?

TON'da, işlem için gaz ücretini ödeyen `cüzdan v5` kullanarak gazsız işlemler mümkündür.

### Hesaplama nasıl yapılır?

TON Blockchain'de `ücret hesaplama` hakkında bir makale bulunmaktadır.

## Referanslar

* [@thedailyton makalesine](https://telegra.ph/Commissions-on-TON-07-22) dayanmaktadır ve ilk olarak [menschee](https://github.com/menschee) tarafından yazılmıştır.*

## Ayrıca Bakınız

* `"Düşük seviyeli ücretler genel bakış"` — komisyon hesaplama formüllerini okuyun.
* [FunC'te ileri ücretleri hesaplamak için akıllı sözleşme fonksiyonu](https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc)