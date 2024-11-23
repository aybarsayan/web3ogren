---
title: Sözleşme Gereksinimleri
---



Zoe üzerinde çalışacak bir akıllı sözleşme yazarken, doğru biçim ve diğer beklentileri bilmeniz gerekmektedir.

Bir Zoe akıllı sözleşmesi, bir `start` fonksiyonu ihraç eden bir JavaScript modülüdür ve aşağıdakiler de dahil olmak üzere diğer kodları içe aktarabilir:

- : Tekrar eden derin dondurma işlemleri için bir paket.
- : Bir şeyin doğal sayı olup olmadığını test etmek için bir paket (doğal sayılar, yuvarlama problemlerinden kaçınmak için para ile ilgili programlamada önerilir) ve değilse hata fırlatır.
- : Akıllı bir şekilde sözleşmeleri çözmek için güncellemeler sağlayan bir paket.
- : Zoe, sözleşmelerin `@agoric/zoe/src/contractSupport/zoeHelpers.js`'yi içe aktararak kullanabileceği yardımcılar sunar.

Bir Zoe sözleşmesi paketlenecek, bu nedenle sözleşmenizi birden fazla dosyaya (örneğin, yardımcı fonksiyonları ayrı bir dosyaya koyabilirsiniz) bölebilir ve bunları içe aktarabilirsiniz.

Bir Zoe sözleşmesinin,  altında çalışabilme yeteneğine sahip olması gerekmektedir. Bazı eski JavaScript kodları, Lockdown'ın başlangıçta kullanmaya başladığınız JavaScript nesnelerini (ilk nesneler, örneğin `Object`) dondurması nedeniyle Sert JavaScript ile uyumsuzdur ve bazı eski kodlar bunları değiştirmeye çalışmaktadır.

Bu tür bir tür açıklamasını eklerseniz, TypeScript uyumlu araçlar (vsCode ve WebStorm gibi IDE'ler) geliştiren kişinin sözleşmenizin `startInstance` parametreleri ve dönüş değerleri hakkında bilgilendirilmesini sağlayacak ve uyuşmazlıklar hakkında uyaracaktır. Sözleşme kodunuzun başlangıcından önce ekleyin.

```js
/**
 * @type {ContractStartFn}
 */
```

Sözleşme kodunuz, varsayılan olmayan bir ihracat olarak bir `start` fonksiyonu ihraç etmelidir. `zcf`, sözleşmeye sağlanan ilk argümandır . İkinci argüman olan `privateArgs`, `startInstance` çağrısından gizli kalması gereken argümanları geçirmek için kullanılır. `privateArgs`, `startInstance` çağrısını yapan kişi tarafından belirlenen anahtarlar ve değerlerden oluşan bir nesnedir. Gizli argümanlar geçilmezse, `privateArgs` undefined olarak belirlenir.

```js
const start = (zcf, privateArgs) => {
  // ...
  // buraya kodunuzu yazın
  return harden({ creatorFacet, creatorInvitation, publicFacet });
};
harden(start);
export { start };
```

Sözleşme, aşağıdakilerden herhangi birini (veya hiçbirini) barındıran bir kayıt döndürmelidir:

- **creatorFacet**: Genellikle yönetim yetkisi olan bir nesne. Sadece `E(zoe).startInstance()` çağrısını yapan birime verilir; yani mevcut sözleşme `instance`'ının yaratıcısı olan taraf. Diğer taraflar için `invitations` yaratabilir veya teklif yapma ile ilgisi olmayan eylemleri gerçekleştirebilir.
- **creatorInvitation**: Sadece `E(zoe).startInstance()` çağrısını yapan birime verilen bir Zoe `invitation`'ıdır; yani mevcut sözleşme `instance`'ının yaratıcısı olan taraf. Bu genellikle bir tarafın öncelikle bir teklif yapması gerektiğinde, bir açık artırmada satışa sunulacak malın teminatı olarak kullanılır.
- **publicFacet**: Sözleşme `instance`'ını bilen herkes tarafından Zoe üzerinden erişilebilir bir nesnedir. Genel sorgular ve işlemler için `publicFacet`'i kullanın; örneğin, mevcut fiyatı almak veya genel `invitations` oluşturmak gibi.

Sözleşme, rastgele JavaScript kodu içerebilir, ancak bir sözleşme olarak hareket etmek ve Zoe ile zcf (içsel sözleşme yüzeyi) ile etkileşimde bulunmak için yapmanız gereken birkaç şey vardır.

Kullanıcıların teklif yapabilmesi için, sözleşme `invitation` kullanılarak bir teklif oluşturulduğunda ne yapılacağını belirleyen bir işleyici içermelidir. Bu işleyici, `zcf.makeInvitation()`'a geçirilir ve sonuçta elde edilen `invitation`, `creatorFacet`, `publicFacet` veya belirli bir sözleşmenin mantığına göre neyin mantıklı olduğuna göre erişilebilir hale getirilir.

Örneğin, AtomicSwap iki `invitation` oluşturur. İlki, başlangıç teklifini oluşturmak için kullanılır, böylece karşı tarafın yanıt vermesi gereken şartları tanımlar. İkinci taraf bir eşleşen teklifi yapmak zorundadır, bu nedenle daha fazla kısıtlama vardır.

İlk tarafın `invitation`'ını oluşturmak için `zcf.makeInvitation()`'ı kullanın:

```js
const creatorInvitation = zcf.makeInvitation(
  makeMatchingInvitation,
  'firstOffer'
);
```

`makeMatchingInvitation()` ikinci `invitation`'ı oluşturur.

```js
const matchingSeatInvitation = zcf.makeInvitation(
  matchingSeatOfferHandler,
  'matchOffer',
  {
    asset: give.Asset,
    price: want.Price
  }
);
```

Üçüncü argüman (ilk `invitation` için gerekli olmayan opsiyonel bir argümandır), karşı tarafın ilk tarafın `want.Price` değerine uyacak bir `amount` teklif etmesi gerektiğini ve ilk tarafın `give.Asset`'ını talep etmesi gerektiğini belirtir. `makeInvitation()`'a eklenen opsiyonel üçüncü argüman, `invitation`'ın `terms`'i içereceğinden böylece `invitation` alıcısı bunlara dayanabilir.

Bu çok basit sözleşmedeki `matchingSeatOfferHandler`, her iki tarafın da diğerinin sunduğu şeyi istediği basit bir durum için bir yardımcı olan `swap()`'ı çağırır. Şartlar eşleşirse, Zoe her birine istedikleri `payout`'ları verir ve sözleşmeyi kapatır. Şartlar eşleşmezse, her biri takasa getirdiklerini geri alır ve bu durumda da işlem sona erer.

```js
const matchingSeatOfferHandler = matchingSeat => {
  const swapResult = swap(zcf, firstSeat, matchingSeat);
  zcf.shutdown();
  return swapResult;
};
```

Diğer sözleşmeleri incelediğinizde, hepsinin bu temel biçime sahip olduğunu göreceksiniz. Amaçlarına bağlı olarak, ek muhasebe yapabilir, birden fazla teklif arasında uyumlu şartlar arayabilir veya yeni varlıklar oluşturabilirler.

## Davet Oluşturma

Sözleşme içinde bir davet oluşturmak için, Zoe Sözleşme Yüzeyi yöntemini kullanın .

## bundleSource Kullanma

Modüller, diskteki dosyalar olarak başlar, ancak daha sonra bir arşiv içinde paketlenir ve bir deri altına yüklendikten sonra. Paketleme aracı, dahil edilmesi gereken diğer modülleri bulmak için birkaç standart fonksiyon kullanır. Bunlar, Sert JavaScript'in bir parçası değildir, ancak modül kaynak kodunda izinlidir ve yürütmeden önce çevrimiçi veya kaldırılır.

- `import` ve `export` sözdizimi, ESM tarzı modüllerde (CommonJS'den ziyade tercih edilen) kullanılabilir. Bunlar tam olarak global değildir, ancak modül grafiklerini tanımlayan üst düzey bir sözdizimidir.
- `require`, `module`, `module.exports` ve `exports`, CommonJS tarzı modüllerde kullanılabilir ve beklendiği gibi çalışmalıdır. Ancak, yeni kod ESM modülleri olarak yazılmalıdır. Bunlar ya paketleme sürecine dahil edilir, sağlanan (herhangi bir biçimde) yürütme ortamında ya da mantıklı biçimde çalışacak şekilde yeniden yazılmalıdır.
- `__dirname` ve `__filename` sağlanmaz.
- Dinamik `import` ifadesi (`await import('name')`), mevcut `vat` kodunda yasaklanmıştır, ancak gelecekteki bir SES uygulaması Sert JavaScript'in buna izin verebilir.

 "yerleşik modüller" içermekte olup, örneğin `http` ve `crypto` bulunmaktadır. Bazıları açıkça platforma özgüdür (örneğin `v8`), bazıları ise o kadar belirgin değildir (`stream`). Tüm bu modüllere erişmek için bir modül içe aktarılarak (`const v8 = require('v8')` CommonJS modüllerinde ya da `import v8 from 'v8'` ESM modüllerinde) ulaşılır. Bu modüller, saf JS değil, yerel kod (C++) ile oluşturulmuştur.

Bu yerleşik modüllerin hiçbiri `vat` koduna erişilemez. Saf JS modülleri üzerinde `require` veya `import` kullanılabilir, ancak yerel kod içeren modüller üzerinde kullanılamaz. Bir `vat`, bir yerleşik modülün yetkisini kullanabilmek için, yerleşik modülün fonksiyonları ile bir _aygıt_ yazmanız ve ardından `vat`'ın aygıta mesajlar göndermesi gerekmektedir.

## Kütüphane Uyumluluğu

`vat` kodu, yalnızca Sert JavaScript ortamıyla uyumlu olan, yalnızca JS kodundan oluşan diğer kütüphaneleri `import` veya `require()` kullanarak içe aktarabilir. Bu, NPM kayıtlarının önemli bir bölümünü kapsamaktadır.

Ancak, birçok NPM paketi yerleşik Node.js modüllerini kullanmaktadır. İçe aktarım zamanı (üst düzey kodlarında) kullanıldıklarında, `vat` kodu paketi kullanamaz ve hiç yüklenemez. Yerleşik özellikleri çalıştırma zamanında kullanıyorlarsa, paket yüklenebilir. Ancak, belirli bir işlevin çağrılması ile kaybolan işlevselliğe erişim sağlanırsa, daha sonra başarısız olabilecektir. Bu nedenle bazı NPM paketleri kısmen uyumludur; belirli özellikleri çağırmadığınız sürece bunları kullanabilirsiniz.

Aynı şey, kaybolan global değişkenler kullanan veya donmuş ilk nesneleri değiştirmeye çalışan NPM paketleri için geçerlidir.