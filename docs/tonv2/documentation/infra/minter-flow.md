# Ekstra Para Basımı

## Ekstra Para
[Ton Blockchain Whitepaper 3.1.6](https://ton-blockchain.github.io/docs/tblkch.pdf#page=55)‘ye göre, TON Blockchain kullanıcılarının Toncoin dışında, belirli koşullar karşılandığında, keyfi kripto para birimleri veya tokenlar tanımlamasına olanak tanır. Böyle ek kripto para birimleri, **32-bit** _currency_ids_ ile tanımlanır. 

:::tip
**Önemli Not**: Tanımlı ek kripto para birimlerinin listesi blok zinciri yapılandırmasının bir parçasıdır ve masterchain’de saklanır.
:::

Her içsel mesaj ve hesap bakiyesi, `ExtraCurrencyCollection` (bir mesaja eklenmiş veya bakiyede tutulan ek para birimlerinin seti) için özel bir alan içerir:
```tlb
extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) = ExtraCurrencyCollection;
currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;
```

## Ekstra Para Yapılandırması
Mint edilecek tüm para birimlerinin bir sözlüğü veya daha doğru bir deyişle `ExtraCurrencyCollection`, `ConfigParam7`‘de saklanır:
```tlb
_ to_mint:ExtraCurrencyCollection = ConfigParam 7;
```

`ConfigParam 6`, mint işlemi ile ilgili verileri içerir:
```tlb
_ mint_new_price:Grams mint_add_price:Grams = ConfigParam 6;
```

`ConfigParam2`, _Minter_ adresini içerir.

---

## Düşük Seviyeli Minting Akışı
Her blokta, collator eski küresel bakiyeyi (önceki bloktaki tüm para birimlerinin küresel bakiyesi) `ConfigParam7` ile karşılaştırır. 

:::warning
**Dikkat**: Eğer `ConfigParam7`‘deki herhangi bir para birimi için herhangi bir miktar küresel bakiyeden **az** ise yapılandırma geçersizdir.
:::

Eğer `ConfigParam7`‘deki herhangi bir para birimi için herhangi bir miktar küresel bakiyeden daha yüksek ise bir minting mesajı oluşturulacaktır.

Bu minting mesajının kaynağı:
```
-1:0000000000000000000000000000000000000000000000000000000000000000 
```
ve hedef olarak `ConfigParam2`‘den _Minter_ vardır ve `ConfigParam7`‘de yer alan ek para birimlerinin eski küresel bakiyeden fazla olanlarını içerir.

> **Anahtar Bilgi**: Buradaki sorun, minting mesajının yalnızca ek para birimlerini içermesi ve TON coin’lerini içermemesidir. Bu, _Minter_‘ın temel bir akıllı sözleşme olarak ayarlanmış olsa bile (bu `ConfigParam31`‘de sunulmuştur), bir minting mesajının işlemin iptal edilmesine neden olacağı anlamına gelir: 
> 
> `compute_ph:(tr_phase_compute_skipped reason:cskip_no_gas)`  
> — TON Blockchain Whitepaper

## Yüksek Seviyeli Minting Akışı
_Minter_ akıllı sözleşmesi, yeni ek para birimlerinin oluşturulması veya mevcut olanlar için ek tokenların mint edilmesi talebini aldığında:
1. `ConfigParam6`‘da belirlenen ücretin talep mesajından düşülebileceğini kontrol etmelidir.
2. 
   1. mevcut tokenlar için: mint etme yetkilisini kontrol et (sadece _sahibi_ yeni olanları mint edebilir).
   2. yeni para birimlerinin oluşturulması için: kripto para biriminin kimliğinin boş olmadığını kontrol et ve yeni para biriminin sahibini sakla.
3. yapılandırma sözleşmesine mesaj gönder (bu mesaj, `ConfigParam7`‘deki `ExtraCurrencyCollection`‘e ek yapılmasını sağlamalıdır).
4. `0:0000...0000` adresine ek para birimi kimliği ile mesaj gönder (bu mesaj, bir sonraki veya takip eden bloklarda geri dönecektir).

`0:0000...0000` adresinden mesaj alındığında:
1. geri dönen mesajdan ek para birimi kimliğini oku.
2. eğer karşılık gelen id ile minting bakiyesinde token varsa, bu para biriminin sahibine `ok` mesajı ile gönder.
3. aksi takdirde para birimi sahibine `fail` mesajı gönder.

---

## Çözülmesi Gereken Sorunlar
1. `0:0000...0000` adresine mesaj göndererek talep işleme erteleme işlemi oldukça **kirli**.
2. Minting’in başarısız olduğu durumlar düşünülmelidir. Şu anda, tek olası durum, bir para birimi miktarının 0 olması veya mevcut bakiyenin üzerine mint edilen miktarın (VarUInteger 32) içine sığmamasıdır.
3. **Nasıl yakılır?** İlk bakışta, hiç yol yok gibi görünüyor.
4. Minting ücretleri yasaklayıcı mı olmalıdır? Başka bir deyişle, milyonlarca ek para biriminin (büyük yapılandırma, sınırsız sayıdaki dict işlemleri nedeniyle potansiyel DoS) olması tehlikeli midir?