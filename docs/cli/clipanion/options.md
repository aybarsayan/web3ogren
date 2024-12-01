---
description: Clipanion, birden fazla seçenek türünü destekleyen güçlü bir komut satırı arayüzüdür. Bu sayfa, diziler, gruplar, booleanlar gibi farklı seçenek türleri hakkında bilgi vermektedir.
keywords: [Clipanion, seçenek türleri, CLI, diziler, gruplar, booleanlar, pozisyonel seçenekler]
---

# Seçenekler

Clipanion, birçok farklı **seçenek türünü** destekler. Çoğu durumda hem kısa stil hem de uzun stil seçenekler desteklenmektedir; ancak her birinin kullanılabileceği zamanları hafifçe etkileyen kendi karakteristikleri bulunmaktadır.

## Diziler

Diziler, birden fazla kez ayarlanabilen sadece dize seçenekleridir:

```
--email foo@baz --email bar@baz
    => Komut {"email": ["foo@baz", "bar@baz"]}
```

Dize seçenekleri gibi, ayrıca demetleri de desteklerler, böylece aşağıdaki gibi beyan edilebilir:

```
--point x1 y1 --point x2 y2
    => Komut {"point": [["x1", "y1"], ["x2", "y2"]]}
```

:::{tip}
Dizileri kullanarak birden fazla kurulumda aynı seçenek değerini kolayca geçebilirsiniz.
:::

---

## Gruplar

Gruplar, "ücretsiz" bir özellik olup, açıkça belirtmeniz gerekmez. Kısa yolları boolean seçeneklerine yapılandırdığınız sürece, bunları tek bir argümanda referans alabilirsiniz. Örneğin, `-p` / `-i` / `-e` geçerli boolean seçenekleri varsayılırsa, aşağıdaki kullanım kabul edilir:

```
-pie
    => Komut {"p": true, "i": true, "e": true}
```

:::{info}
Gruplar, kullanıcı deneyimini artırmak için birden fazla seçeneği bir arada tutmanın etkili bir yoludur.
:::

---

## Booleanlar

Booleanlar, en klasik seçenek türüdür; yalnızca varlıklarına göre normal booleanlarla eşlenirler.

```
--foo
    => Komut {"point": true}
--no-foo
    => Komut {"point": false}
```

## Sayıcılar

Sayıcılar, kaç kez etkinleştirildiklerini takip eden boolean seçenekleridir. `--no-` ön eki ile geçiş yapmak sayacı sıfırlar.

```
-vvvv
    => Komut {"v": 4}
-vvvv --no-verbose
    => Komut {"v": 0}
```

---

## Pozisyonel Seçenekler

Pozisyonel seçenekler, belirli bir etiket gerektirmezler, ancak katı bir sıralamaya dayanırlar. Gereken veya gereksiz hale getirilebilirler. Rastgele sayıda pozisyonel argüman kabul etmek için `Rests` bölümüne bakın.

## Proxy'ler

Proxy'ler, bir rastgele sayıda pozisyonel argüman kabul ettikleri için, rastlara benzerler. Farklılık, karşılaşıldığında, proxy'lerin komut satırının daha fazla ayrıştırılmasını durdurmasıdır. Genellikle, komutunuz başka bir komuta proxy olarak çalışıyorsa proxy'lere ihtiyacınız vardır.

> “Aşağıdaki örnekte, `yarn run foo` ayrıştırıldıktan sonra proxy devreye girer.”  
> — Clipanion Documentation

```
yarn run foo --hello --world
    => Komut {"proxy": ["--hello", "--world"]}
```

## Rests

Rests, varsayılan olarak rastgele miktarda veri kabul eden pozisyonel argümanlardır. Aşağıdaki örnekte, `yarn add` sonrasındaki her şey rest seçeneğine eklenir:

```
yarn add webpack webpack-cli
    => Komut {"rest": ["webpack", "webpack-cli"]}
```

Çoğu diğer CLI frameworklerinin aksine, Clipanion, rest seçeneğinin her iki tarafında da pozisyonel argümanları destekler; bu, `cp` komutunu, rest seçeneğinden sonra bir gerekli pozisyonel argüman ekleyerek uygulayabileceğiniz anlamına gelir:

```
cp src1 src2 src3 dest/
    => Komut {"srcs": ["src1", "src2", "src3"], "dest": "dest/"}
```

---

## Dize Seçenekleri

Dize seçenekleri, rastgele bir argüman kabul eder.

```
--path /path/to/foo
    => Komut {"path": "/path/to/foo"}
--path=/path/to/foo
    => Komut {"path": "/path/to/foo"}
```

Varsayılan olarak bu argüman zorunludur, ancak `tolerateBoolean` bayrağı kullanılarak isteğe bağlı hale getirilebilir. Bu bayrak ayarlandığında, bir argüman geçirirken `=` ayırıcı zorunludur (aksi takdirde, parametrenin bir argüman olarak mı yoksa pozisyonel seçeneğin bir parçası olarak mı ifade edildiği belirsiz olur).

```
--inspect
    => Komut {"inspect": true}
--inspect=9009
    => Komut {"inspect": "9009"}
```

Clipanion, otomatik olarak değişken türlerini anlamaya çalışmayacaktır - örneğin, yukarıdaki örnekte `--inspect=9009` `"9009"` (bir dize) verir, `9009` (bir sayı) değil. Değerleri açıkça değiştirmek için `validator'lar` sayfasına bakın.