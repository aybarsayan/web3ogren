---
id: ertp-data-types
title: ERTP Veri Türleri
---

# ERTP Veri Türleri

ERTP, birkaç veri türünü tanıtır ve kullanır.

## Miktar

Bir **Miktar**, dijital varlıkların bir tanımıdır ve "ne kadar?" ( ****) ve "ne tür?" ( ****) sorularını yanıtlar. **** nesnesi, **Miktarları** manipüle etmek ve analiz etmek için kullanılabilecek yöntemlerin bir kütüphanesini tanıtır.

Not: **Miktarlar**, ya fungible (değiştirilebilir) ya da non-fungible (değiştirilemez) varlıkları tanımlayabilir.

```js
someAmount: {
  brand: someBrand,
  value: someValue
}
```

## MiktarŞekli

Bir **MiktarŞekli**, değiştirilemez dijital varlıkların bir tanımıdır. **** ile benzer şekilde, **MiktarŞekli** 2 özelliğe sahiptir: bir ****, bu varlığın ne türde olduğunu belirtir ve bir **DeğerŞekli**, bu değiştirilemez varlığı tanımlamak için gereken herhangi bir sayıda özelliği içeren bir nesnedir. Bir varlığın **DeğerŞekli**, varlığın **** oluşturulurken _elementShape_ parametresiyle tanımlanır.  

```js
someAmountShape: {
  brand: someBrand,
  valueShape: someValueShape
}
```



## MiktarDeğeri

Bir **MiktarDeğeri**,  olan bir nesnenin sahip olabileceği veya paylaşılabileceği değeri tanımlayan bir bileşendir: ne kadar, kaç tane, ya da $3, Pixel(3,2) veya “27 Eylül saat 21:00'deki gösteri için Koltuk J12” gibi benzersiz bir varlığın tanımı. Fungible bir **Miktar** için, **MiktarDeğeri** genellikle `10n` veya `137n` gibi negatif olmayan bir **BigInt**'dir. Değiştirilemez bir **Miktar** için, **MiktarDeğeri**, belirli hakların adlarını içeren dize içeren bir  içerebilir veya doğrudan hakları temsil eden nesneleri içerebilir. MiktarDeğerleri  olmalıdır.

## VarlıkTürü

Birkaç tür Varlık bulunmaktadır.

- **VarlıkTürü.NAT** : Değiştirilebilir varlıklarla kullanılır. **MiktarDeğerleri**, genellikle JavaScript  türünü kullanarak doğal sayılardır, bu sayede normal JavaScript **Number** türünü kullanmaktan kaynaklanan taşma riskleri önlenir.
- **VarlıkTürü.SET** : Kullanımdan kaldırıldı.
- **VarlıkTürü.KOPYA_KÜMESİ** : Değiştirilemez varlıklarla kullanılır ve burada kopyalar olamaz (örneğin, bir stadyumdaki tahsisli koltuklar). İçin  bakın.
- **VarlıkTürü.KOPYA_TORBA** : Yarı-değiştirilebilir varlıklarla kullanılır ve burada kopyalar olabilir. Aynı varlığın kopyaları birbirleriyle değiştirilebilir (örneğin, bir bilgisayar oyunundaki silahlar). İçin  bakın.

Farklı matematiksel işlemler gerçekleştirilmesine rağmen, **** yöntemleri her türlü varlık için çalışır.

Hangi **VarlıkTürü**'nü kullandığınızı belirtmek için **** kullanın. Bu yöntemi nasıl kullanacağınızla ilgili ayrıntılar için **** belgelerine bakın.

```js
import { VarlıkTürü, makeIssuerKit } from '@agoric/ertp';
makeIssuerKit('quatloos'); // Varsayılan olarak AssetKind.NAT ve tanımsız DisplayInfo
makeIssuerKit('kitties', VarlıkTürü.KOPYA_KÜMESİ); // Varsayılan olarak tanımsız DisplayInfo
```

## GörüntüBilgisi

Bir **GörüntüBilgisi** veri türü, bir **** ile ilişkilidir ve o **Marka**'nın **** nasıl görüntülemesi gerektiği hakkında bilgi verir. **GörüntüBilgisi**'nin bir isteğe bağlı özelliği, negatif olmayan bir tam sayı değeri alan **ondalıkHaneler**'dir.

**ondalıkHaneler** özelliği,  değerin, yaygın olarak kullanılan bir birimde görüntülenmesi için ondalık noktasının sola kaç yer hareket etmesi gerektiğini belirtir (örn. "10.00 dolar" yerine "1000 sent" olarak görüntülemek).

Değiştirilebilir dijital varlıklar, en küçük birimlerinde tam sayılar olarak temsil edilir. Örneğin, bir ABD doları için en küçük birim ya _dolar_ ya da _sent_ olabilir. Eğer _dolar_ ise, **ondalıkHaneler** değeri **0** olur. Eğer _sent_ ise, **ondalıkHaneler** değeri **2** olur. Benzer şekilde, Ethereum ağında kullanılan kripto para birimi olan ether'in en küçük birimi _wei_ (bir ether = 1018 wei) olsun isterseniz, o zaman **ondalıkHaneler** değeri **18** olur.

Değiştirilemez varlıkların değerleri diziler şeklinde olduğu için, onlara bir **ondalıkHaneler** değeri belirtmemelisiniz.

**ondalıkHaneler**, yalnızca görüntüleme amaçlı kullanılmalıdır. Başka bir kullanım anti-pattern'dir.

**GörüntüBilgisi** ayrıca bir **** özelliğine sahiptir. Bu özelliğin değeri, ilişkili varlığın türünü belirtir.