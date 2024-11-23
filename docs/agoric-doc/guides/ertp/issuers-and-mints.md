# İhracılar ve Mintler



**Not**: Bir İhracı, dağıtım betiğinde oluşturmamalısınız. Dağıtım betikleri geçicidir, bu nedenle orada oluşturulan herhangi bir nesne, betik durduğu anda yok olur.

Arka planda, bir `issuer`, basılmış dijital varlıkları bir `purse` veya `payment` içindeki yerleriyle eşler. Bir `issuer`, dijital varlıkları doğrular, taşır ve manipüle eder. Özel yönetici bileşeni bir `mint`tir ve bu, ile bire bir ilişki içindedir. Sadece bir `mint`, yeni dijital varlıklar oluşturabilir; bir `issuer` bunu yapamaz.

Bir `issuer`, ayrıca bir `brand` ile de bire bir ilişkiye sahiptir. Yani, eğer `brand`'imiz hayali para birimi olan Quatloos ise, yalnızca Quatloos `brand` ile bire bir ilişkide olan `issuer` şu işlemleri yapabilir:

- Quatloos depolayabilen yeni bir boş `purse` oluşturmak.
- Quatloos cinsinden bir `payment` işlemini talep etmek, bölmek, birleştirmek, yok etmek veya miktarını almak.

Bir `issuer`, güvenilir bir kaynaktan elde edilmeli ve ardından aynı `brand`'den gelen güvenilir olmayan bir `payment`in geçerli olup olmadığı konusunda otorite olarak göz önünde bulundurulmalıdır.



`Issuer` yöntemleri:

- Bir `issuer` hakkında bilgi döndürmek.
- Yeni bir `issuer` oluşturmak.
- Yeni bir `purse` oluşturmak.
- `payment` argümanları üzerinde işlem yapmak.

Aşağıda, her bir `Issuer` yönteminin kısa bir tanımı ve örneği yer almaktadır. Daha fazla ayrıntı almak için yöntemin adına tıklayarak  sayfasına gidin.

- **İhracı oluşturma işlemi**
  - 
    - Yeni bir `issuer` ve bununla ilişkili `mint` ve `brand` oluşturur ve döndürür.
    - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#import
      <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#makeIssuerKit
- **İhracı hakkında bilgi edinme işlemleri**
  - 
    - `issuer` için `allegedName` (ilişkili `brand`'in güvenilir olmayan insan tarafından okunabilir adı) döndürür.
    - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#getAllegedName
  - 
    - `issuer`'ın varlık türünü döndürür; ya `AssetKind.NAT` ("nat") ya da `AssetKind.SET` ("set").
    - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#getAssetKind
  - 
    - `issuer` için `brand` döndürür.
    - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#getBrand
- **Purse işlemi**
  - 
    - `issuer` ile ilişkili `brand` varlıklarını tutmak için boş bir `purse` oluşturur ve döndürür.
    - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#makeEmptyPurse
- **Ödeme işlemleri**
  - 
    - `payment` içindeki tüm dijital varlıkları yok eder.
    - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#burn
  - 
    - `payment`'in bakiyesini bir Miktar olarak tanımlar.
    - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#getAmountOf
  - 
    - `payment`'in ihracısı tarafından oluşturulmuş ve kullanılabilir olduğunu (tükenmemiş veya yok olmamış) belirtir.
    - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#isLive
    ::: warning DEPREKATE
  - 
    - Tek bir `payment`'i iki yeni Ödeme'ye böler.
    - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#split
  - 
    - Tek bir `payment`'i birden fazla Ödeme'ye böler.
    - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#splitMany
- 
  - Tüm dijital varlıkları `payment`'den yeni bir Ödeme'ye transfer eder.
  - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#claim
  - 
    - Birden fazla Ödeme'yi yeni bir Ödeme'de birleştirir.
    - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#combine
    :::

**İlgili Yöntemler:**

**Not**: Bu yöntemler doğru `issuer`'ı bulmanıza yardımcı olur, ancak otorite niteliğinde değildir. Bir `mint`, `brand` veya `purse`, yalnızca `issuer` kendisi ilişkiyi onayladığında gerçekten bir `issuer` ile ilişkilidir.

- 
  - `mint` ile benzersiz olarak ilişkilendirilmiş `issuer`'ı döndürür.
  - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#mintGetIssuer
- 
  - `issuer` markanın `issuer`'ıysa `true`, değilse `false` döndürür.
  - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#isMyIssuer

## Mintler



Bir `mint`, ilişkili `brand`'in yeni dijital varlıklarını yeni bir `payment` nesnesi olarak basar. Bu varlıklar, para birimi benzeri (hayali Quatloos para birimimiz), mal benzeri değerli eşyalar (oyunlar için sihirli kılıçlar) veya elektronik haklar (bir sözleşmeye katılma hakkı) olabilir. Sadece bir `mint` nesnesinin sahibi, bundan yeni varlıklar oluşturabilir.

Başka bir deyişle, diyelim ki dolaşımda 1000 Quatloos var. Yalnızca Quatloos ile ilişkili `mint`in sahipleri, dolaşımı 2000'e artıracak daha fazla Quatloos basabilir.

Bu ilişkiler bire bir ve değiştirilemez olduğundan:

- Bir varlık `brand`'ı oluşturmak için yaratılan bir `mint`, örneğin Quatloos, yalnızca o `brand` varlığını oluşturabilir. Örneğin, yalnızca Quatloos, Moola veya başka bir şey değil.
- Bir varlık `brand`ı oluşturan bir `mint`, yalnızca o `brand`'ı oluşturabilen tek `mint`tir. Sadece o Quatloos `mint` yeni Quatloos üretebilir.
- Bir varlık `brand`ı oluşturan bir `mint`, farklı bir `brand` yaratmak için değiştirilemez. Yani bir Quatloos `mint`, asla Moola `mint` veya başka bir non-Quatloos varlık haline gelemez.

İki adet `mint` yöntemi ve yeni mintler oluşturan bir yöntem bulunmaktadır. Yöntemin adına tıklayarak  sayfasına gidebilirsiniz.

- 
  - `mint` ile benzersiz olarak ilişkilendirilmiş `issuer`'ı döndürür.
  - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#mintGetIssuer
- 
  - `mint`'in ilişkili `brand`inin yeni dijital varlıklarını oluşturur.
  - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#mintMintPayment
- 
  - Yeni bir `issuer` ve onunla ilişkili `mint` ve `brand` oluşturur ve döndürür.
  - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#makeIssuerKitMint