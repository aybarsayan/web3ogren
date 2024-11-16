# Far(), Remotable ve Marshaling

Vats arasındaki bir  işleminin detaylarına bakalım:



İhracat vatında, _remotable_ sayaçlar oluşturmak için `makeCounter`  alacağız ve bunu  ile işaretleyeceğiz:

<<< @/../snippets/test-distributed-programming.js#makeFarCounter

## Kopyalama veya Varlık ile Marshaling

Bir  işlemindeki ilk adımın _metot adını_ ve argümanlarını _marshaling_ etmek olduğunu unutmayın. , bir veri yapısını depolama veya iletim için uygun bir formata dönüştürmektir.  paketi  kullanır, ancak doğrudan JSON olarak ifade edilemeyen Javascript değerlerini de (örneğin, `undefined` ve `BigInt` gibi) yönetebilir.

<<< @/../snippets/test-marshal.js#marshal-json-steroids

Ayrıca, birçok veri türü vatlar arasında kopyalanırken, remotables marshaled edilirler, böylece unmarshaled olduklarında uzaktan _varlıklar_ haline gelirler. Başka bir vat, dışa aktarılan sayaçları kullanabilir:

<<< @/../snippets/test-distributed-programming.js#useFarCounter

## Geçiş Stilini Belirleme ve Harden

Uzaktan varlıklara yapılan çağrılar yalnızca _geçirilebilir_ argümanlar içermeli ve _geçirilebilir_ sonuçlar döndürmelidir. Geçirilebilir, marshaled edilebilen bir  değerdir. Dört ana tür geçilebilir vardır:

- Kopya ile geçirilen **ilkel** değerler: `undefined`, `null`, booleans `true` ve `false`, sayılar,
  ,
  dizeler ve ya
   ya da
   semboller.
- Döngüsel olmayan kopya ile geçirilen **kapsayıcılar**, non-kapsayıcı geçilirlerle sona eren.
  Böyle kapsayıcılar, `harden(['foo', 'bar'])` gibi _CopyArrays_,
  `harden({ keys: [0, 1], values: ['foo', 'bar'] })` gibi _CopyRecords_ ve
  CopySet, CopyBag ve CopyMap gibi türleri temsil eden _CopyTaggeds_ içerir.
- Referansla geçirilen "**PassableCaps**":
  - _Remotables_: uzaktan sistemlerle paylaşılabilen nesneler, bu nesnelerin
    örneğin `E()` eventual send notasyonu ile metodları çağırabilmesini sağlar. Remotables, 
    ve ilgili fonksiyonlar ile oluşturulur.
  - Geçirilebilirler için _Promises_.
- Özel bir durum olarak, **Hatalar**, diğer geçilebilirleri içerebilen kopya ile geçirilen veriler olarak ele alınır.

Bir akıllı kontrattan dışa aktarılan her nesne, örneğin `publicFacet` veya
`creatorFacet`, geçirilebilir olmalıdır. Sözleşmenizde kullanılan tüm nesneler
geçirilebilir olmalıdır.

Tüm Geçirilebilirlerin hardened hale getirilmesi gerekir. Diyelim ki uzaktan bir `item` ile
geçirilebilir bir kopya verisi göndermediğimizde ne olabileceğine bakalım:

```js
let amount1 = { brand: brand1, value: 10n };
await E(item).setPrice(amount1); // Bir hata fırlatır, ama hayal edelim ki fırlatmadı.
amount1.value = 20n;
```

Artık `amount1` hem yerel hem de uzaktan vatlarda mevcut olduğunu varsayıyoruz, ancak `value`
yerel vatda `20n` değerinde iken, uzaktan vatda `10n` değerindedir. (Daha da kötüsü: uzaktan vat
yerel vat ile aynı olabilir.) Kopya ile geçirilen verilerin `harden()` çağrısını gerektirmesi,
vatlar arasında anlaşılır bir davranışa neden olur.

## passStyleOf API

<<< @/../snippets/test-distributed-programming.js#import-pass-style

`passStyleOf(passable)` bir `PassStyle` dizesi döndürür ve `passable` türünü kategorize eder.

- `passable` `{Passable}`
- Dönüş değeri: `{PassStyle}`

`PassStyle` değerleri, geçilebilirlerin farklı türleriyle ilişkilidir:

- Kopya ile geçirilen **ilkel** değerler: `"undefined"`, `"null"`, `"boolean"`, `"number"`, `"bigint"`, `"string"` veya `"symbol"`.
- Kopya ile geçirilen **kapsayıcılar**: `"copyArray"`, `"copyRecord"` veya `"copyTagged"`.
- Referansla geçirilen **PassableCaps**: `"remotable"` veya `"promise"`.
- Kopya ile geçirilen **Hatalar**: `"error"`.

Eğer `passable` geçirilebilir değilse (örneğin, henüz hardened edilmemişse veya
karmaşık bir prototip zincirine sahipse), o zaman `passStyleOf` bir hata fırlatacaktır.

::: tip Güvenilmeyen yapılandırılmış verileri işlerken `passStyleOf`'u kontrol edin
Bir argümanın string veya sayı olduğunu kontrol etmek için `typeof` kullanırmış gibi, bir `copyRecord` bekliyorsanız `passStyleOf` kullanın; bu, kötü niyetli istemcilerin döngüsel verilerle oyun oynamasını önler.
:::

## Far() API

<<< @/../snippets/test-distributed-programming.js#importFar

`Far(farName, objectWithMethods)` bir nesneyi Remotable olarak işaretler.

- `farName` `{ String }`
- `objectWithMethods` `{ Object }` - Opsiyonel.
- Dönüş değeri: Bir `Remotable` nesne.

`farName` parametresi, `Remotable` için hata ayıklama amacıyla bir _arayüz adı_ verir. Bu sadece `console` üzerinden, örneğin `console.log` ile kaydedildiğinde görünür.

Opsiyonel `objectWithMethods` parametresi, nesnenin işlevleri olarak görev yapan özelliklere sahip bir nesne olmalıdır.
Bu nesne zaten hardened veya donmuş olmamalıdır (ancak `Far()` başarılı bir şekilde döndürmeden önce onu hardened edecektir).
Sağlanmazsa, yeni boş bir nesne kullanılacaktır.

Başarılı olmadan önce, `Far()` fonksiyonu:

- Nesnenin her bir özellik değerinin fonksiyon olup olmadığını kontrol eder ve aksi takdirde bir hata fırlatır.
  - Erişimciler (örneğin, `get()` ve `set()`) izin verilmez.
- Arayüz adını nesneye kaydeder.
- Nesneyi hardened eder.

::: tip Kazara dışa aktarımlardan kaçının
Eğer bir nesne diğer vatlara asla açığa çıkarılmamalıysa, ona **Far()** kullanmamaya özen göstermelisiniz. Eğer bir nesne Remotable olarak işaretlenmemişse fakat kazara açığa çıkmışsa, bir hata fırlatılır. Bu, bu tür kazara açığa çıkmalardan kaynaklanan herhangi bir güvenlik açığını önler.
:::