---
title: "`deno doc`, belge üretici"
description: "`deno doc` komutu, kaynak dosyalarındaki JSDoc belgelerini oluşturmanıza olanak tanır. Bu belge, kullanım örnekleri ve hata denetimi gibi önemli bilgileri içerir."
keywords: [deno, documentation, JSDoc, command, JSON]
---

## Örnekler

`deno doc`, bir veya daha fazla kaynak dosyasının ardından geldiğinde, her modülün **dışa aktarılan** üyeleri için JSDoc belgesini yazdıracaktır.

Örneğin, içeriği olan bir `add.ts` dosyası verildiğinde:

```ts
/**
 * x ve y'yi toplar.
 * @param {number} x
 * @param {number} y
 * @returns {number} x ile y'nin toplamı
 */
export function add(x: number, y: number): number {
  return x + y;
}
```

Deno `doc` komutunu çalıştırmak, fonksiyonun JSDoc yorumunu `stdout`'a yazdırır:

```shell
deno doc add.ts
function add(x: number, y: number): number
  x ve y'yi toplar. @param {number} x @param {number} y @returns {number} x ile y'nin toplamı
```

## Hata Denetimi

:::info
Belgeniz oluşturulurken sorunları kontrol etmek için `--lint` bayrağını kullanabilirsiniz. `deno doc`, üç tür problem belirler:
:::

1. Dışa aktarılan bir türün kök modülden dışa aktarılmamış bir türü referans alması için hata.
   - API kullanıcılarının API'nin kullandığı tüm türlere erişimini sağlar. Bu, türü kök modülden dışa aktararak (komut satırında `deno doc` için belirtilen dosyalardan biri) veya türü `@internal` jsdoc etiketi ile işaretleyerek bastırılabilir.
1. **Halka açık** bir türde eksik dönüş türü veya özellik türü için hata.
   - `deno doc`'un dönüş/özellik türünü görüntülemesini sağlar ve tür doğrulama performansını artırır.
1. **Halka açık** bir türde eksik JS belge yorumun için hata.
   - Kodun belgelenmesini sağlar. Bunu bir jsdoc yorumu ekleyerek veya belgelerden hariç tutmak için bir `@ignore` jsdoc etiketi ile bastırabilirsiniz. Alternatif olarak, belgelerde kalmak için bir `@internal` etiketi ekleyebilir, ancak bunun dahili olduğunu belirtirsiniz.

Örneğin:

```ts title="/mod.ts"
interface Person {
  name: string;
  // ...
}

export function getName(person: Person) {
  return person.name;
}
```

```shell
$ deno doc --lint mod.ts
Type 'getName' references type 'Person' which is not exported from a root module.
Eksik JS belge yorumu.
Eksik dönüş türü.
    at file:///mod.ts:6:1
```

:::warning
Bu denetimler, daha iyi belgeler yazmanıza ve projelerinizde tür doğrulamayı hızlandırmanıza yardımcı olmak içindir. Herhangi bir sorun bulunursa, program sıfırdan farklı bir çıkış kodu ile çıkar ve çıktı standart hataya raporlanır.
:::

## Desteklenen JSDoc etiketleri

Deno, büyük bir JSDoc etiket setini uygular, aynı zamanda JSDoc spesifikasyonunda belirtilmemiş ek etiketler de vardır. Aşağıdaki etiketler desteklenmektedir:

- [`constructor`/`class`](https://jsdoc.app/tags-class): bir fonksiyonu bir yapıcı olarak işaretler.
- [`ignore`](https://jsdoc.app/tags-ignore): bir sembolün çıktıya dahil edilmesini göz ardı eder.
- internal: bir sembolü yalnızca dahili olarak kullanılacak şekilde işaretler. HTML üreticisinde, sembol listede yer almaz, ancak hala oluşturulabilir ve bir dahili olmayan sembol ona bağlantı verirse erişilebilir.
- [`public`](https://jsdoc.app/tags-public): bir sembolü halka açık API olarak değerlendirin. TypeScript `public` anahtar sözcüğünün karşılığıdır.
- [`private`](https://jsdoc.app/tags-private): bir sembolü özel API olarak değerlendirin. TypeScript `private` anahtar sözcüğünün karşılığıdır.
- [`protected`](https://jsdoc.app/tags-protected): bir özellik veya yöntemi korunmuş API olarak değerlendirin. TypeScript `protected` anahtar sözcüğünün karşılığıdır.
- [`readonly`](https://jsdoc.app/tags-readonly): bir sembolü yalnızca okunur olarak işaretler, yani üzerine yazılabilir değildir.
- [`experimental`](https://tsdoc.org/pages/tags/experimental): bir sembolü deneysel olarak işaretler, yani API değişebilir veya kaldırılabilir, veya davranış iyi tanımlanmamıştır.
- [`deprecated`](https://jsdoc.app/tags-deprecated): bir sembolü kullanım dışı olarak işaretler, yani artık desteklenmez ve gelecekteki bir sürümde kaldırılabilir.
- [`module`](https://jsdoc.app/tags-module): bu etiket, üst düzey bir JSDoc yorumuna tanımlanabilir, bu da o yorumun dosya için olduğunu belirtir.
- `category`/`group`: bir sembolün belirli bir kategori/gruba ait olduğunu işaretler. Bu, çeşitli sembolleri bir araya grublamak için yararlıdır.
- [`see`](https://jsdoc.app/tags-see): sembolle ilgili bir dış referans tanımlar.
- [`example`](https://jsdoc.app/tags-example): sembol için bir örnek tanımlar.
- `tags`: bir sembol için ek özel etiketler tanımlar, virgülle ayrılmış bağımsız bir liste ile.
- [`since`](https://jsdoc.app/tags-since): sembolün ne zamandan beri mevcut olduğunu tanımlar.
- [`callback`](https://jsdoc.app/tags-callback): bir geri çağırma tanımlar.
- [`template`/`typeparam`/`typeParam`](https://tsdoc.org/pages/tags/typeparam): bir geri çağırma tanımlar.
- [`prop`/`property`](https://jsdoc.app/tags-property): bir sembolde bir özelliği tanımlar.
- [`typedef`](https://jsdoc.app/tags-typedef): bir tür tanımlar.
- [`param`/`arg`/`argument`](https://jsdoc.app/tags-param): bir işlevde bir parametre tanımlar.
- [`return`/`returns`](https://jsdoc.app/tags-returns): bir işlevin dönüş türünü ve/veya yorumunu tanımlar.
- [`throws`/`exception`](https://jsdoc.app/tags-throws): bir işlev çağrıldığında neyi istisna ettiğini tanımlar.
- [`enum`](https://jsdoc.app/tags-enum): bir nesneyi bir enum olarak tanımlar.
- [`extends`/`augments`](https://jsdoc.app/tags-augments): bir işlevin uzandığı bir tür tanımlar.
- [`this`](https://jsdoc.app/tags-this): bir işlevde `this` anahtar kelimesinin neyi ifade ettiğini tanımlar.
- [`type`](https://jsdoc.app/tags-type): bir sembolün türünü tanımlar.
- [`default`](https://jsdoc.app/tags-default): bir değişken, özellik veya alan için varsayılan değeri tanımlar.

## HTML çıktısı

Statik bir site oluşturmak için `--html` bayrağını kullanın.

```console
$ deno doc --html --name="Benim kütüphanem" ./mod.ts

$ deno doc --html --name="Benim kütüphanem" --output=./documentation/ ./mod.ts

$ deno doc --html --name="Benim kütüphanem" ./sub1/mod.ts ./sub2/mod.ts
```

Oluşturulan belge, her statik site barındırma hizmetine dağıtılabilecek çok sayfalı bir statik sitedir.

Oluşturulan sitede istemci tarafı arama mevcuttur, ancak kullanıcının tarayıcısı JavaScript'i devre dışı bırakmışsa mevcut değildir.

## JSON çıktısı

Belgeleri JSON formatında çıktı almak için `--json` bayrağını kullanın. Bu JSON formatı, [deno doc web sitesi](https://github.com/denoland/docland) tarafından tüketilir ve modül belgelerini oluşturmak için kullanılır.