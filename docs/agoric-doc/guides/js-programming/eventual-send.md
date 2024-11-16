# E() ile Eventual Send

Web tarayıcılarında, uzak iletişim için yaygın bir model, 
 kullanmaktır:

 { ... })
  .catch(err => { ... });
```

## Eventual Send

, herhangi bir akıllı sözleşmenin aşırı işlem süresi veya yığın bellek alanı kullanmasını önlemek için kendi  çalışmasıdır. Akıllı sözleşmeler de ayrı vatslarda çalışır.



`E(zoe).install(bundle)` çağrısı yapıldığında, bu bir _eventual send_ meydana gelir:

1. `install` yöntem adını ve `bundle` argümanını içeren bir mesaj  ve düz bir string haline getirilerek `zoe`'nin geldiği vat'a iletilmek üzere sıraya alınır.
2. `E(zoe).install(bundle)` geriye bir sonuç için bir promes döner.
3. `then` ve `catch` yöntemleri, promesin çözümlendiğinde veya reddedildiğinde çağrılacak geri çağırmaları sıraya alır. 
   İşlem, yığın boşalana kadar devam eder ve bu döngü tamamlanır.
4. _Sonunda_ `zoe` yanıt verir, bu da bu vatın mesaj kuyruğuna yeni bir mesaj ve olay döngüsünde yeni bir döngü sağlar. Mesaj serileştirilir ve sonuçlar ilgili geri çağırmaya iletilir.

Bu şekilde, ayrı vatslardaki nesnelerle iletişim kurmak, aynı vat içerisindeki nesnelerle iletişim kurmak kadar kolaydır; yalnızca bir fark vardır: iletişim _asenkron_ olmalıdır.

`E()` sarmalayıcısı aşağıdaki ile çalışır:

- Uzak varlıklar (uzak vatslardaki nesneler için yerel proxy'ler).
- Yerel nesneler (aynı vat içinde).
- Uzak varlıklar veya yerel nesneler için promesler.

Tüm durumlarda, `E(x).method(...args)` bir promes döner.

::: tip Promes Boru Hattı
`E()` promesleri kabul ettiğinden, eventual send'leri birleştirebiliriz:
`E(E(object1).method1(...args1)).method2(...args2)`. Bu şekilde, tek bir gidiş-dönüş yeterli olur.
:::

::: tip Uzak çağrıları sorun giderme
`E()` fonksiyonu, uzak nesnenin hangi yöntemlere sahip olduğunu bilmeyen bir yönlendirme oluşturur. 
Yöntem adını yanlış yazarsanız veya hatalı büyük/küçük harf kullanırsanız, yerel ortam bunun farkına varamaz. Sadece runtime sırasında uzak nesne, bu yöntemi bilmediği için bir hata vererek durumu bileceksiniz.

Eğer sıradan bir senkron çağrı (`obj.method()`) başarısız olursa, bu yöntem mevcut değilse, `obj` uzaktaki bir nesne olabilir; bu durumda `E(obj).method()` işe yarayabilir.
:::

::: tip Derin Yığınlarla Test Etme

Vatslar arası yığın izlerini elde etmek için:

```
TRACK_TURNS=enabled DEBUG=track-turns yarn test test/contract.test.js
```

Bakınız:

- 
- 
- 

:::

## E() ve Marşal: Daha Yakından Bakış

::: tip İzle: Marşal Tartışması

-  Temmuz 2023

:::

Eğer SDK'yı yalnızca akıllı sözleşmeler yazmak için kullanmak istiyorsanız, **bu bölümü atlayabilirsiniz**. Ancak daha fazla ayrıntılı anlayış gerektiren bir şey üzerinde çalışıyorsanız, `E(x).method(...args)` ile marşalin nasıl yapıldığını inceleyelim.

 belgelerinde şunları görüyoruz:

> `marshal` modülü, "yetki taşıyan verilerin" dönüştürülmesine yardımcı olur; burada yapılandırılmış girişin bir kısmı "proxy ile geçme" veya "varlık ile geçme" nesnelerini temsil eder ve bunlar özel "slot tanımlayıcıları" referansını içeren değerlere serileştirilmelidir. `toCapData()` fonksiyonu, giriş verisinin serileştirmesini içeren bir `body`'ye sahip bir "CapData" yapısı döner ve slot tanımlayıcılarını tutan bir `slots` dizisi barındırır. `fromCapData()` bu CapData yapısını alır ve nesne grafiğini döner. Proxy'lere/varlıklara dönüştürmek için geçme nesneleri ile slot tanımlayıcıları arasında dönüşüm yapmak için genel bir yol yoktur, bu nedenle marşalleyici slot tanımlayıcılarını oluşturmak ve bunları proxy'lere/varlıklara geri dönüştürmek için bir çift fonksiyon ile parametreleşir.

Örneğin, bir uzaktan erişilebilen sayacı slot tanımlayıcısı `c1` kullanarak marşalayabiliriz:




:::