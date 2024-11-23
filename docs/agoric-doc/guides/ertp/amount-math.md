---
id: amount-math
title: AmountMath
---

# AmountMath



Dijital varlıkların bir `purse` içine yatırılması ve çekilmesi ile `payment` miktarlarının manipüle edilmesi, dijital varlıkların toplanmasını ve çıkarılmasını gerektirir. ERTPres fonksiyonları tüm bu işlemler için `AmountMath` kütüphanesini kullanır.

`AmountMath` kütüphanesi işlevleri, hem fungible hem de non-fungible tokenlar için çalışır. İki `AssetKinds` bulunmaktadır ve her biri aynı yöntemleri uygular. Belirli bir `brand` için hangi türün kullanıldığı, `brand` ve onun `issuer`'ı oluşturulurken neyin belirlendiğine bağlıdır. Bunlar:

- `AssetKind.NAT` ("nat"): Fungible varlıklarla kullanılır. Değerler, JavaScript  türünü kullanarak doğal sayılardır; böylece genellikle kullanılan JavaScript `Number` türünden kaynaklanabilecek aşım riskleri önlenir.
- `AssetKind.SET` ("set"): Non-fungible varlıklarla kullanılır. Değerler, sıkı dizelerden oluşan  gibi dizilerdir.

## AmountMath Yöntemleri

Aşağıda her `AmountMath` yöntemi için kısa bir açıklama ve örnek bulunmaktadır. Daha fazla ayrıntı için, yöntemin adını tıklayarak  bölümüne gidebilirsiniz.

Birçok yöntemin `brand` argümanı vardır; bu argüman ya zorunludur ya da isteğe bağlıdır. İsteğe bağlı olduğunda, "amount" argüman(lar)ının `brand`inin, aldığı `brand` ile eşleştiğini doğrulamak için bir issuer'dan (veya Zoe'den) aldığınız `brand`'i kullanmalısınız.

- **Bilgi Alma Yöntemleri**
  - 
    - `amount` argümanının `value` değerini döner. Fungible varlıklar için bu bir `BigInt` olacaktır.
    - <<< @/../snippets/ertp/guide/test-amount-math.js#getValue
- **Karşılaştırma Yöntemleri**
  - 
    - Eğer `amount` argümanı boşsa `true`, aksi takdirde `false` döner. İsteğe bağlı `brand` argümanı, `amount` argümanı markasıyla aynı değilse hata fırlatır.
    - <<< @/../snippets/ertp/guide/test-amount-math.js#isEmpty
  - 
    - `leftAmount` argümanı `rightAmount` argümanına eşit veya büyükse `true`, aksi takdirde `false` döner. İsteğe bağlı `brand` argümanı, `amount` argümanlarının markalarıyla aynı değilse hata fırlatır.
    - <<< @/../snippets/ertp/guide/test-amount-math.js#isGTE
  - 
    - `leftAmount` argümanı `rightAmount` argümanına eşitse `true`, aksi takdirde `false` döner. İsteğe bağlı `brand` argümanı, `amount` argümanlarının markalarıyla aynı değilse hata fırlatır.
    - <<< @/../snippets/ertp/guide/test-amount-math.js#isEqual
  - 
    - Bir `amount` alır ve geçerliyse onu döner. Geçersizse hata fırlatır.
    - <<< @/../snippets/ertp/guide/test-amount-math.js#coerce
- **Manipülatör Yöntemleri**
  - 
    - `leftAmount` ve `rightAmount` `amount` argümanlarının birleşimi olan bir `amount` döner. Fungible `amount` için bu, değerlerini eklemek anlamına gelir. Non-fungible `amount` için bu genellikle her iki `leftAmount` ve `rightAmount`'taki tüm elemanları içermek anlamına gelir. İsteğe bağlı `brand` argümanı, `amount` argümanlarının markalarıyla aynı değilse hata fırlatır.
    - <<< @/../snippets/ertp/guide/test-amount-math.js#add
  - 
    - `leftAmount` argümanı ile `rightAmount` argümanını çıkartan yeni bir `amount` döner (yani, `leftAmount`'taki her şeyden `rightAmount`'taki her şeyin çıkarılması). Eğer `leftAmount`, `rightAmount`'ın içeriklerini içermiyorsa hata fırlatır. İsteğe bağlı `brand` argümanı, `amount` argümanlarının markalarıyla aynı değilse hata fırlatır.
    - <<< @/../snippets/ertp/guide/test-amount-math.js#subtract
- **Amount Oluşturma Yöntemleri**
  - 
    - Bir `value` argümanı alır ve `AmountMath` ile ilişkili `brand` ve `value` ile bir kayıt oluşturarak bir `amount` döner. `value` argümanı `BigInt` olarak temsil edilmelidir, örneğin `10n` şeklinde, değilse `10`.
    - <<< @/../snippets/ertp/guide/test-amount-math.js#make
  - 
    - `AmountMath`'ın `add()` ve `subtract()` işlemleri için kimlik elemanı olan bir boş `amount`ı temsil eden bir `amount` döner. Bu değerin, `brand` ve `AssetKind.NAT` veya `AssetKind.SET` türüne bağlı olarak farklılık gösterdiğini unutmamak önemlidir.
    - <<< @/../snippets/ertp/guide/test-amount-math.js#makeEmpty
  - 
    - Başka bir `amount` kullanarak yeni boş `amount`ın `brand` ve `assetKind` özelliklerini temsil eden bir boş `amount` döner.
    - <<< @/../snippets/ertp/guide/test-amount-math.js#makeEmptyFromAmount

## Diğer Nesnelerdeki Yöntemler

Bu yöntemler bir **** döner:

- 
  - `issuer`'ın `brand`inin `AssetKind` döner. (`AssetKind.NAT` veya `AssetKind.SET`).
  - <<< @/../snippets/ertp/guide/test-amount-math.js#getAssetKind2
- 
  - `brand` argümanının `AssetKind`'ını döner.
  - <<< @/../snippets/ertp/guide/test-amount-math.js#zcfGetAssetKind