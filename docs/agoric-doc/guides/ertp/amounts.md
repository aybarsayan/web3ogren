# Miktarlar, Değerler ve Markalar

## Miktarlar



Bir `miktar`, dijital varlıkları tanımlar. `miktar` API yöntemleri yoktur, ancak  yöntemleri `miktar`ları argüman olarak alarak bunlar hakkında bilgi edinmek ve manipüle etmek için kullanılır.

`AmountMath.make()` genellikle yeni `miktar`lar oluşturmanın yoludur. Ancak, bir `marka` ve bir `değer` kaydederek bir nesne literal olarak da bir `miktar` oluşturabilirsiniz. Uygun nesne yönelimli programlama için `AmountMath.make()` önerilir, ancak bu aynı sonucu verir:



## MiktarDeğerleri



MiktarDeğerleri, bir `miktar`ın "kaç tane" kısmını temsil eder.

Fungible varlıklar için sayı değerlerinin `BigInt` olarak temsil edildiğini unutmayın; `Number` olarak değil. `10` yerine `10n` yazınız.

`değer` yöntemleri yoktur, ancak iki `AmountMath` yöntemi bunları kullanmakta veya döndürmektedir.

- 
  - `miktar` argümanının `değer`ini döner.
  - <<< @/../snippets/ertp/guide/test-amounts.js#getValue
- 
  - Bir `marka` ve bir `değer`den `miktar` oluşturur.
  - <<< @/../snippets/ertp/guide/test-amounts.js#make