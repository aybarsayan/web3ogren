---
title: Handler
description: Akış Dönüşümü - kullanıcı işleyici fonksiyonu. Bu belgede, işleyici fonksiyonları ve senkron/aşenkron çalışma modları hakkında bilgiler bulabilirsiniz. Dönüşüm işlemleri sırasında dikkat edilmesi gereken noktalar açıklanmaktadır.
keywords: [akış, dönüştür, işleyici, senkron, asenkron, değiştirme, atlama, kopyalama]
sort: 5
---

# Akış Dönüşümü kullanıcı işleyici fonksiyonu

İşleyici fonksiyonu, tüm kayıt dönüşümlerini yönetmekle sorumludur. Bunu yazmak, geliştiricinin sorumluluğundadır. Giriş kayıtlarını kopyalayabilir veya değiştirebilir, atlayabilir ve birden fazla kayıt yayımlayabilir.

## Senkron ve Asenkron Çalışma

Mod, dönüşüm fonksiyonunun geri dönüş değeri veya imzasıyla tanımlanır:

- **senkron mod**  
  İşleyici, yalnızca bir argüman bildirdiğinde ve geri dönüş değeri bir promise değildir, senkron olarak çalışır.
- **promise ile asenkron mod**  
  İşleyici, yalnızca bir argüman bildirdiğinde ve geri dönüş değeri bir promise olduğunda asenkron olarak çalışır.
- **callback ile asenkron mod**  
  İşleyici, iki argüman bildirdiğinde ve dönüşüm verisi hazır olduğunda çağrılması gereken callback ile asenkron olarak çalışır; bunlar dönüştürülecek veri ve çağrılacak callback'dir.

:::tip
Bir callback kullanmanın avantajlardan biri, daha fazla kayıt yayımlama seçeneği sunmasıdır.
:::

## Senkron Dönüşümler Tanımlama

[Senkron örnekte](https://github.com/adaltas/node-csv/blob/master/packages/stream-transform/samples/mode.sync.js), dönüşüm fonksiyonu, yalnızca bir argüman bildirdiği için senkron olarak çalışır; bu argüman dönüştürülecek veridir. Dönüştürülen veriyi döndürmesi veya bir hata atması beklenir.

`embed:packages/stream-transform/samples/mode.sync.js`

## Promise ile Asenkron Dönüşümler Tanımlama

[Promise örneğinde](https://github.com/adaltas/node-csv/blob/master/packages/stream-transform/samples/mode.promise.js), dönüşüm fonksiyonu, yalnızca bir argüman bildirdiği ve geri dönüş değeri dönüşüm kayıtları ile bir promise olduğu için asenkron olarak çalışır.

`embed:packages/stream-transform/samples/mode.promise.js`

## Asenkron Dönüşümler Tanımlama

[Callback örneğinde](https://github.com/adaltas/node-csv/blob/master/packages/stream-transform/samples/mode.callback.js), dönüşüm callback'i iki argüman bildirir; bunlar dönüşüm yapılacak veri ve veri hazır olduğunda çağrılacak callback'dir. Dönüşüm callback'i, maksimum 20 paralel yürütme ile eşzamanlı olarak gerçekleştirilir.

`embed:packages/stream-transform/samples/mode.callback.js`

## Sağlanan Verileri Değiştirme veya Kopyalama

Dönüşüm fonksiyonu içinde alınan veri, orijinal veridir ve değiştirilmez veya kopyalanmaz. **Orijinal veriyi değiştirmek isterseniz, dönüşüm fonksiyonunuzda orijinal değiştirilen veri yerine yeni bir veri göndermek sizin sorumluluğunuzdadır.**

:::info
Verinin değiştirilmesi veya kopyalanması konusunda dikkatli olun; yanlış kullanım verinin kaybına neden olabilir.
:::

## Kayıt Atlama

Kayıt atlamak, senkron modda null döndürerek veya asenkron modda callback işleyicisine null geçirerek kolayca yapılabilir.

## Birden Fazla Kayıt Oluşturma

Birden fazla kayıt oluşturmak yalnızca bir callback çağırırken hata argümanından sonra n-argüman sağlayarak asenkron modda desteklenir.