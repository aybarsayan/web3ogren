---
title: Cüzdanlar ve Ödemeler
---

# Cüzdanlar ve Ödemeler

Farklı türlerde dijital varlıklar mevcuttur:

- Para benzeri, hayali Quatloos gibi.
- Mal benzeri, tiyatro biletleri veya bir oyunda kullanılacak sihirli silahlar gibi.
- Soyut haklar, belirli bir sözleşmeye katılım gibi.

ERTP'de, dijital varlıklar her zaman ya bir **cüzdan** ya da bir **ödemeler** nesnesinde bulunur.

- **Cüzdan**: 
  Aynı markaya ait dijital varlıkların belirli bir miktarını, bir ödeme yapılana kadar tutar. Yeni bir cüzdan, bir verici (issuer) tarafından yaratılır ve yalnızca o vericinin markasına ait varlıkları tutabilir.
  
- **Ödeme**: 
  Başka bir tarafa aktarmak üzere aynı markaya sahip dijital varlıkların bir miktarını tutar. 
  Bir ödeme, ya bir mints'ten yeni varlıklar ya da bir cüzdandan çekilen ya da bir veya daha fazla tüketilen ödemeden transfer edilen mevcut varlıkları içerecek şekilde oluşturulur. 
  Yalnızca kaynak (source) markası ile aynı markaya ait varlıkları tutabilir.

Herhangi bir sayıda `cüzdan` veya `ödeme`, herhangi bir belirli `marka`nın varlıklarını tutabilir. Ne bir `cüzdan` ne de bir `ödeme`, ilişkili `markalarını` değiştirebilir.

Her `cüzdan` ve `ödeme` nesnesi, hiç yoksa ("boş" anlamında  terimlerinde) belirli bir miktarda dijital varlık içerir. Olabilir ki farklı amaçlar için ayrı banka hesaplarınız olsun, aynı `marka`daki dijital varlıklar için de ayrı cüzdanlarınız olabilir. Bir cüzdanınız 2 Quatloos tutarken, diğer bir cüzdan 9000 Quatloos tutabilir.

Bir `cüzdan`a varlık yatırdığınızda, orada zaten mevcut olan varlıklarla eklenir. Yani 3 Quatloos'luk bir depozit, 8 Quatloos olan bir `cüzdan`a yatırıldığında toplamda 11 Quatloos olan bir `cüzdan` elde edersiniz.

Bir `ödemeyi` bir `cüzdan`a eklerken, tüm `ödemeyi` eklemeniz gerekmektedir. Yalnızca bir kısmını eklemek istiyorsanız, önce  veya  yöntemini çağırmalı ve onu iki veya daha fazla yeni `ödemeye` bölmelisiniz.

`Mints`, tamamen yeni dijital varlıklar yaratır ve bunları yeni bir `ödemeye` ekler. Ayrıca bir `cüzdan`dan varlıkları çekerek, var olan bir `ödemeyi` bölerek veya birden fazla `ödemeyi` bir araya getirerek de bir `ödeme` oluşturabilirsiniz. Not edin ki yeni `ödemenin` markası, onu oluşturan `mints`, `cüzdan` veya `ödeme` ile ilişkili olan `marka` ile aynıdır.

ERTP'de, varlıklar doğrudan bir `cüzdan`dan başka bir `cüzdan`a aktarılmaz. Bunun yerine, transferin bir `ödeme` ile ara buluculuk yapılması gerekir, aşağıda gösterildiği gibi. Agoric yığını içinde, gerçek gönderim ve alma işlemleri  tarafından sağlanmaktadır.

- Gönderen:
  1. Bir `cüzdan`dan bir `miktar` ile tanımlanan varlıkları çekin ve bir `ödemeye` dönüştürün.
  2. Bu `ödemeyi` bir alıcıya gönderin.
  
- Alıcı:
  1. Eğer halihazırda yoksa, alacağınız varlık `markası` için bir `cüzdan` oluşturun.
  2. `Ödeme` ile birlikte mesajı alın.
  3. `ödemeyi` markaya uygun bir `cüzdan`a yatırın.

## Cüzdanlar

Bir cüzdanın bakiyesini değiştirmek için ya `deposit()` (varlık eklemek için) ya da `withdraw()` (varlık çıkarmak için) yöntemini çağırmalısınız. Bir cüzdan boş olabilir ve bu, fungible (değiştirilebilir) varlıklar için sıfır değerine sahiptir. Non-fungible (değiştirilemez) varlıklar için ise, örneğin tiyatro biletleri, hiç bileti yoktur.

`Ödemeler`den farklı olarak, `cüzdanlar` başkalarına gönderilmek üzere tasarlanmamıştır. Dijital varlıkları aktarmak için, bir `cüzdan`dan bir `ödemeyi` çekip başka bir tarafa göndermelisiniz.

Bir `cüzdan` için bir  oluşturabilirsiniz. Deposit facet'ler ya diğer tarafa gönderilir ya da kamuoyuna bilgilendirilir. Herhangi bir taraf, deposit facet'e bir `ödemeyi` yatırabilir, bu da onu ilişkili `cüzdan`a yatırır. Ancak kimse, bir deposit facet ile `cüzdan`ından çekim yapamaz veya cüzdanın bakiyesini göremez.

Eğer bir deposit facet'e sahipseniz, ilişkili `cüzdan`ın `ödemesini` almak için `depositFacet.receive(payment)` çağrısını yaparak bir depozit yatırırsınız. Unutmayın ki bir `cüzdan`a `deposit()` yöntemi ile bir `ödemeyi` eklerken; `depositFacet`'e `receive()` yöntemi ile bir `ödemeyi` eklersiniz.

`Ödeme`nin `markası`, `cüzdan`ınki ile uyuşmalıdır. Aksi takdirde bir hata meydana gelir. Bir deposit facet objesini bir tarafa gönderirken, hangi `markayı` kabul ettiğini bildirmelisiniz.



Aşağıdaki kısım, her `cüzdan` yönteminin kısa bir tanımı ve örneğini içermektedir. Daha fazla ayrıntı için, yöntemin adına tıklayarak  sayfasına gidebilirsiniz.

- 
  - `Cüzdan`ın mevcut bakiyesini bir Miktar olarak açıklar. Not edin ki bir `cüzdan` boş olabilir.
  - <<< @/../snippets/ertp/guide/test-purses-and-payments.js#getCurrentAmount
- 
  - Belirtilen miktardaki dijital varlıkları bu `cüzdan`dan yeni bir `ödemeye` çeker.
  - <<< @/../snippets/ertp/guide/test-purses-and-payments.js#withdraw
- 
  - `Ödeme`nin tüm içeriğini bu `cüzdan`a yatırır ve bir miktar döndürür.
  - <<< @/../snippets/ertp/guide/test-purses-and-payments.js#deposit
- 
  - `Cüzdan` üzerinde sadece depozito yapılabilen bir facet döndürür. Not edin ki bir `Ödeme`nin varlıklarını eklemek için kullanılan komut `deposit()` değil, `receive()` olmalıdır.
  - <<< @/../snippets/ertp/guide/test-purses-and-payments.js#getDepositFacet

Ayrıca, yeni ve boş bir `cüzdan` yaratmak için `verici` üzerinde çağrılan metod:

- 
  - `Verici` ile ilişkili olan `markanın` varlıklarını tutan boş bir `cüzdan` üretir ve döndürür.
  - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#makeEmptyPurse

## Ödemeler



Ödemeler, başka bir tarafa aktarılmak üzere tasarlanmış dijital varlıkları tutar. Doğrusaldır, yani bir `ödeme` ya tam orijinal bakiyesini taşır ya da tamamen kullanılır. Bir `ödemeyi` kısmen kullanmak imkansızdır.

Başka bir deyişle, eğer 10 Quatloos içeren bir `ödeme` oluşturursanız, bu `ödeme` her zaman ya 10 Quatloos tutar ya da verici kayıtlarından silinir ve değerini kaybeder. Bir `ödeme`, ya diğerleriyle birleştirilebilir ya da birden fazla `ödemeye` bölünebilir; her iki durumda da orijinal `ödeme(ler)` tüketilir ve sonuçlar bir veya daha fazla yeni `ödeme`ye aktarılır.

Bir `ödeme`, bir `cüzdan`a yatırılabilir, birden fazla `ödemeye` bölünebilir, diğer `ödemeler` ile birleştirilebilir veya talep edilebilir (bir özel `ödeme` alıp başkalarının erişimini iptal edebilirsiniz).

Bir `ödemeyi` genellikle diğer taraflardan alırsınız, ancak kendiliğinden doğrulanmaz ve kendi gerçek değerini sağlama konusunda güvenilmez. Bir `ödemenin` doğrulanmış bakiyesini almak için, güvenilir `verici` üzerinde `getAmountOf(payment)` yöntemini kullanmalısınız.

Daha önce oluşturmadığınız bir `markanın` vericisini almak için, güvendiğiniz birine danışmalısınız. Örneğin, gösterim için biletlerini oluşturan mekan, biletlerin `verici`si olarak güvenilir kabul edilebilir. Veya bir arkadaşınıza ait bir kripto para birimini güveniyorsanız, verdiği `verici`nin geçerli olduğunu kabul edebilirsiniz.

Bir `ödemeyi` yeni bir `cüzdan`a tüketmek için:

1. `Ödeme`nin güvenilir `verici`si alın.
2. O `marka` için boş bir `cüzdan` oluşturmak için `vericiyi` kullanın.
3. `Ödemeyi`, yeni `cüzdan`a yatırın.

`Ödemeler` yalnızca bir API metoduna sahiptir, ancak diğer ERTP bileşenleri için birçok yöntem `ödemeleri` argüman olarak alır ve etkili bir şekilde bir `ödeme` üzerinde işlem yapar. Aşağıda her `ödemeyle` ilgili metodun kısa bir açıklaması ve örneği verilmiştir. Daha fazla ayrıntı için, yöntemin adına tıklayarak  sayfasına gidebilirsiniz.

- 
  - Bu `ödemeyi` temsil eden ve hangi `vericinin` kullanılacağını gösteren `markayı` döndürür.
    Çünkü `ödemeler` güvenilir değildir, bunlar üzerindeki tüm yöntem çağrıları dikkatle ele alınmalıdır ve başka yerlerden doğrulanmalıdır. `Ödeme` üzerinde `verici` tarafından gerçekleştirilen her başarılı işlem, onu doğrular.

### Diğer Nesnelerin Ödeme ile ilgili Yöntemleri

- 
  - `Ödeme`nin içindeki tüm dijital varlıkları yok eder.
  - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#burn
- 
  - `Ödeme` nin bakiyesini bir Miktar olarak açıklar.
  - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#getAmountOf
- 
  - Eğer `ödemeyi` oluşturan `verici` tarafından oluşturulmuş ve kullanılabilir (tüketilmemiş veya yakılmamışsa) ise `true` döndürür.
- 
  - `Verici` ile ilişkili `markanın` yeni dijital varlıklarını oluşturur.
  - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#mintMintPayment
- 
  - `Ödeme`nin tüm içeriğini `cüzdan`a yatırır.
  - <<< @/../snippets/ertp/guide/test-purses-and-payments.js#deposit
- 
  - `Cüzdan`a `ödemeleri` yatırmak için diğer tarafların herhangi birine izin veren yeni bir depozit çerçevesi oluşturur.
  - <<< @/../snippets/ertp/guide/test-purses-and-payments.js#getDepositFacet
- 
  - Belirtilen miktardaki dijital varlıkları `cüzdan`dan yeni bir `ödemeye` çeker.
  - <<< @/../snippets/ertp/guide/test-purses-and-payments.js#withdraw
    ::: warning DEPRECATED
- 
  - Birden fazla `Ödemeyi` bir yeni `Ödeme` içine birleştirir.
  - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#combine
- 
  - Tüm dijital varlıkları `ödemeden` yeni bir `ödemeye` aktarır.
  - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#claim
- 
  - Tek bir `ödemeyi` birçok `ödemeye` böler.
  - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#splitManyConcise
- 
  - Tek bir `ödemeyi` iki yeni `ödemeye` böler.
  - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#split
    :::

## Cüzdan ve Ödeme Örneği

Aşağıdaki kod, `quatloos` markası için yeni bir `cüzdan` oluşturur, `cüzdan`a 10 Quatloos yatırır, `cüzdan`dan 3 Quatloos çekerek bir `ödemeye` aktarır ve nihayetinde `cüzdan`da mevcut olan miktarı, yani 7 Quatloos'u döndürür.

<<< @/../snippets/ertp/guide/test-purses-and-payments.js#example