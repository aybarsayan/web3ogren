---
description: Bu belge, seçeneklerin beyanı ve kullanımı ile ilgili ayrıntılı bilgi sağlar. Ayrıştırma belirsizlikleri ve çeşitli durumlarla ilgili öneriler içermektedir.
keywords: [seçenekler, ayrıştırma, komut, argüman, Commander, options, kullanım]
---


# Derinlemesine Seçenekler

README, seçeneklerin beyanı ve kullanımı ile ilgili olup, çoğunlukla ayrıştırmanın sizin ve kullanıcılarınızın beklediği şekilde çalışacağını belirtmektedir. Bu sayfa bazı özel durumları ve ince sorunları derinlemesine ele almaktadır.

- `Farklı sayıda seçenek-argümanı alan seçenekler`
  - `Ayrıştırma belirsizliği`
    - `Alternatif: `--`'yi sözdiziminizin bir parçası yapın`
    - `Alternatif: Seçenekleri sona koyun`
    - `Alternatif: Komut-argümanları yerine seçenekleri kullanın`
- `Kısa seçenekleri birleştirme ve argüman alan seçenekler`
  - `Kısa seçenekleri boolean gibi birleştirme`

---

## Farklı sayıda seçenek-argümanı alan seçenekler

Bazı seçenekler, değişen sayıda argüman alır:

```js
program
   .option('-c, --compress [yüzde]') // 0 veya 1
   .option('--preprocess <dosya...>') // 1 veya daha fazla
   .option('--test [isim...]') // 0 veya daha fazla
```

Bu bölüm, 0 veya 1 argüman alan seçeneklerle ilgili örnekler kullanmaktadır, ancak tartışmalar aynı zamanda daha fazla argüman alan değişken seçeneklere de uygulanmaktadır.

:::note
Bu belgede kullanılan terimler hakkında bilgi için: `terminoloji`
:::

---

### Ayrıştırma belirsizliği

Bilinmesi gereken bir olumsuz durum vardır. Eğer bir komut hem komut-argümanları hem de çeşitli seçenek-argümanlarına sahip seçenekler içeriyorsa, bu bir ayrıştırma belirsizliği yaratır ve bu durum programınızın kullanıcısını etkileyebilir. Commander, öncelikle seçenek-argümanlarını arar, ancak kullanıcı, seçeneğin ardından gelen argümanı bir komut veya komut-argümanı olarak amaçlayabilir.

```js
program
  .name('cook')
  .argument('[technique]')
  .option('-i, --ingredient [ingredient]', 'peynir veya belirtilen malzeme ekle')
  .action((technique, options) => {
    console.log(`technique: ${technique}`);
    const ingredient = (options.ingredient === true) ? 'peynir' : options.ingredient;
    console.log(`ingredient: ${ingredient}`);
  });

program.parse();
```

```sh
$ cook scrambled
technique: scrambled
ingredient: undefined

$ cook -i
technique: undefined
ingredient: peynir

$ cook -i egg
technique: undefined
ingredient: yumurta

$ cook -i scrambled  # hata
technique: undefined
ingredient: scrambled
```

Bunu çözmenin açık yolu, seçeneklerin ve seçenek-argümanlarının sonunu belirtmek için `--` kullanmaktır:

```sh
$ node cook.js -i -- scrambled
technique: scrambled
ingredient: peynir
```

Kullanıcılarınızın `--`'yi ne zaman kullanacağını öğrenmesini istemiyorsanız, alabileceğiniz birkaç yaklaşım vardır.

#### Alternatif: `--`'yi sözdiziminizin bir parçası yapın

Kullanıcılarınıza `--`'nin ne yaptığını öğretmek yerine, bunu sadece sözdiziminizin bir parçası haline getirebilirsiniz.

```js
program.usage('[options] -- [technique]');
```

```sh
$ cook --help
Kullanım: cook [options] -- [technique]

Seçenekler:
  -i, --ingredient [ingredient]  peynir veya belirtilen malzeme ekle
  -h, --help                     komut için yardım göster

$ cook -- scrambled
technique: scrambled
ingredient: undefined

$ cook -i -- scrambled
technique: scrambled
ingredient: peynir
```

#### Alternatif: Seçenekleri sona koyun

Commander, ayrıştırma için GNU kuralını takip eder ve seçeneklerin komut-argümanlarının önünde veya arkasında veya karışık olarak olmasına izin verir. Bu nedenle seçenekleri sona koyarak, komut-argümanları seçenek-argümanlarıyla karışmaz.

```js
program.usage('[technique] [options]');
```

```sh
$ cook --help
Kullanım: cook [technique] [options]

Seçenekler:
  -i, --ingredient [ingredient]  peynir veya belirtilen malzeme ekle
  -h, --help                     komut için yardım göster

$ node cook.js scrambled -i
technique: scrambled
ingredient: peynir
```

#### Alternatif: Komut-argümanları yerine seçenekleri kullanın

Bu biraz daha radikal bir yaklaşımdır, ancak ayrıştırma belirsizliğinden tamamen kaçınır!

```js
program
  .name('cook')
  .option('-t, --technique <technique>', 'pişirme tekniği')
  .option('-i, --ingredient [ingredient]', 'peynir veya belirtilen malzeme ekle')
  .action((options) => {
    console.log(`technique: ${options.technique}`);
    const ingredient = (options.ingredient === true) ? 'peynir' : options.ingredient;
    console.log(`ingredient: ${ingredient}`);
  });
```

```sh
$ cook -i -t scrambled
technique: scrambled
ingredient: peynir
```

---

## Kısa seçenekleri birleştirme ve argüman alan seçenekler

Birden fazla boolean kısa seçenek, tek bir `-` sonrasında birleştirilebilir, örneğin `ls -al`. Ayrıca, izleyen karakterlerin bir değer olarak alınacağı herhangi bir kısa seçeneği de içerebilirsiniz.

Bu, varsayılan olarak, bir argüman alabilecek kısa seçenekleri birleştirmenize izin vermez.

```js
program
  .name('collect')
  .option("-o, --other [count]", "diğer porsiyonlar")
  .option("-v, --vegan [count]", "vegan porsiyonlar")
  .option("-l, --halal [count]", "helal porsiyonlar");
program.parse(process.argv);

const opts = program.opts();
if (opts.other) console.log(`other servings: ${opts.other}`);
if (opts.vegan) console.log(`vegan servings: ${opts.vegan}`);
if (opts.halal) console.log(`halal servings: ${opts.halal}`);
```

```sh
$ collect -o 3
other servings: 3
$ collect -o3
other servings: 3
$ collect -l -v
vegan servings: true
halal servings: true
$ collect -lv  # hata
halal servings: v
```

Eğer, boolean seçenek olarak değişken argüman alan seçenekleri kullanmak istiyorsanız, bunları ayrı ayrı belirtmeniz gerekir.

```console
$ collect -a -v -l
any servings: true
vegan servings: true
halal servings: true
```

### Kısa seçenekleri boolean gibi birleştirme

Commander v5'ten önce, kısa bir seçeneği ve değerini birleştirmek desteklenmiyordu ve birleştirilen kısa bayraklar her zaman genişletiliyordu. Yani `-avl`, `-a -v -l` şeklinde genişletiliyordu.

Geriye dönük uyumlu bir davranış istiyorsanız veya kısa seçenekleri boolean gibi birleştirmeyi, kısa seçenek ve değeri birleştirmeye tercih ediyorsanız, davranışı değiştirebilirsiniz.

Seçeneklerin isteğe bağlı bir değeri alma ayrıştırmasını değiştirmek için:

```js
.combineFlagAndOptionalValue(true)  // `-v45`, `--vegan=45` gibi muamele görmektedir, bu varsayılan davranıştır
.combineFlagAndOptionalValue(false) // `-vl`, `-v -l` gibi muamele görmektedir