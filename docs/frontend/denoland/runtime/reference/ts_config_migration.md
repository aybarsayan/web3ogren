---
title: "TypeScript'i Yapılandırma"
description: Deno ile TypeScript yapılandırma süreci hakkında kapsamlı bir rehber. JavaScript'ten TypeScript'e geçiş ve Tür Kontrolü gibi konuları ele alıyor.
keywords: [TypeScript, Deno, JavaScript, yapılandırma, tür kontrolü, JSDoc, derleyici seçenekleri]
---

Deno’nun esnekliği, TypeScript ve JavaScript'i eşit şekilde ele almasıyla öne çıkmaktadır. JavaScript'ten TypeScript'e veya tam tersine geçiş yapıyorsanız, Deno bu yolculuğu kolaylaştıracak özelliklere sahiptir.

## JavaScript’te Tür Kontrolü

JavaScript'inizi her yere tür açıklamaları eklemeden daha tür güvenli hale getirmek isteyebilirsiniz. Deno, JavaScript'in tür kontrolü için TypeScript tür denetleyicisini kullanmayı destekler. Bireysel dosyaları, dosyaya kontrol JavaScript pragma’sını ekleyerek işaretleyebilirsiniz:

```js
// @ts-check
```

Bu, tür denetleyicisinin JavaScript koduna dair tür bilgilerini çıkararak herhangi bir sorunu tanılayıcı sorunlar olarak bildirmesine neden olacaktır.

Bunlar, komut dosyasındaki `check JS` seçeneği `true` olarak ayarlanmış bir yapılandırma dosyasıyla tüm JavaScript dosyaları için açılabilir. Ardından, komut satırında çalıştırırken `--config` seçeneğini kullanın.

```json
{
  "compilerOptions": {
    "checkJs": true
  }
}
```

## JavaScript'te JSDoc Kullanımı

JavaScript'in tür kontrolünü yaparken veya JavaScript'i TypeScript'e aktarırken, JSDoc açıklamaları, kodun kendisinden çıkarılabilecek bilgilerin ötesinde ek tür bilgisi sağlayabilir. Deno, kodunuzu desteklenen
[TypeScript JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) ile çevrimiçi olarak açıklarsanız, bunu sorunsuz bir şekilde destekler.

Örneğin, bir dizinin türünü ayarlamak için aşağıdaki JSDoc yorumunu kullanın:

```js
/** @type {string[]} */
const a = [];
```

## Tür kontrolünü atlama

Deney yapmakta olduğunuz, sözdizimi geçerli ancak tamamen tür güvenli olmayan TypeScript kodunuz olabilir. `--no-check` bayrağını geçerek tüm program için tür kontrolünü atlayabilirsiniz.

Tür kontrolü etkinse, JavaScript dahil tüm dosyaların tür kontrolü yapılmamasını da `nocheck` pragma’sını kullanarak atlayabilirsiniz:

```js
// @ts-nocheck
```

## JS dosyalarını TS dosyalarına yeniden adlandırma

TypeScript dosyaları, TypeScript derleyicisinin kodunuzun daha kapsamlı güvenlik kontrollerini yapabilmesinden faydalanır. Bu çoğunlukla **katı mod** olarak adlandırılır. Bir `.js` dosyasını `.ts` olarak yeniden adlandırdığınızda, TypeScript'in daha önce tespit edemediği yeni tür hataları görebilirsiniz.

## Deno'da TypeScript'i Yapılandırma

TypeScript birçok yapılandırma seçeneği sunar; bu da özellikle TS'ye yeni başlıyorsanız zorlayıcı olabilir. Deno, TypeScript kullanmayı basitleştirmeyi hedefler, sizi sayısız ayar arasında boğmak yerine. Deno, TypeScript'i kutudan çıkar çıkmaz **çalışacak şekilde** yapılandırır. Ek yapılandırma sorunlarına gerek yok!

:::tip
Deno ile çalışırken, TypeScript yapılandırmanızı uygun şeklide yönetmek başarılı projeler için kritiktir.
:::

Ancak, TypeScript derleyici seçeneklerini değiştirmek isterseniz, Deno bunu `deno.json` dosyanızda yapmanıza olanak tanır. Komut satırında bir yol sağlayın veya varsayılanı kullanın. Örneğin:

```console
deno run --config ./deno.json main.ts
```

:::note
Yapılandırma dosyası gerektiren kütüphaneler oluşturuyorsanız, TS modüllerinizin tüm tüketicilerinin de bu yapılandırma dosyasına ihtiyaç duyacağını unutmayın. Ayrıca, yapılandırma dosyasında bulunan ayarlar, diğer TypeScript modülleriyle uyumsuz hale getirebilir.
:::

## TS Derleyici Seçenekleri

Değiştirilebilecek derleyici seçeneklerinin, Deno'daki varsayılanlarının ve bu seçenekle ilgili diğer notların bir tablosu:

| Seçenek                           | Varsayılan               | Notlar                                                                                                                                     |
| ----------------------------------| -----------------------  | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `allowJs`                        | `true`                  | Bu neredeyse hiç değiştirilmeye ihtiyaç duymaz                                                                                             |
| `allowUnreachableCode`          | `false`                 |                                                                                                                                           |
| `allowUnusedLabels`              | `false`                 |                                                                                                                                           |
| `checkJs`                        | `false`                 | `true` olduğunda, TypeScript JavaScript'in tür kontrolünü yapar                                                                            |
| `jsx`                            | `"react"`               |                                                                                                                                           |
| `jsxFactory`                     | `"React.createElement"` |                                                                                                                                           |
| `jsxFragmentFactory`             | `"React.Fragment"`      |                                                                                                                                           |
| `keyofStringsOnly`               | `false`                 |                                                                                                                                           |
| `lib`                            | `[ "deno.window" ]`     | Bunun varsayılanı Deno'daki diğer ayarlara bağlı olarak değişiklik gösterebilir. Sağlandığında varsayılanı geçersiz kılar. Aşağıda daha fazla bilgi vardır. |
| `noErrorTruncation`              | `false`                 |                                                                                                                                           |
| `noFallthroughCasesInSwitch`     | `false`                 |                                                                                                                                           |
| `noImplicitAny`                  | `true`                  |                                                                                                                                           |
| `noImplicitOverride`             | `true`                  |                                                                                                                                           |
| `noImplicitReturns`              | `false`                 |                                                                                                                                           |
| `noImplicitThis`                 | `true`                  |                                                                                                                                           |
| `noImplicitUseStrict`            | `true`                  |                                                                                                                                           |
| `noStrictGenericChecks`          | `false`                 |                                                                                                                                           |
| `noUnusedLocals`                 | `false`                 |                                                                                                                                           |
| `noUnusedParameters`             | `false`                 |                                                                                                                                           |
| `noUncheckedIndexedAccess`       | `false`                 |                                                                                                                                           |
| `reactNamespace`                 | `React`                 |                                                                                                                                           |
| `strict`                         | `true`                  |                                                                                                                                           |
| `strictBindCallApply`            | `true`                  |                                                                                                                                           |
| `strictFunctionTypes`            | `true`                  |                                                                                                                                           |
| `strictPropertyInitialization`   | `true`                  |                                                                                                                                           |
| `strictNullChecks`               | `true`                  |                                                                                                                                           |
| `suppressExcessPropertyErrors`   | `false`                 |                                                                                                                                           |
| `suppressImplicitAnyIndexErrors` | `false`                 |                                                                                                                                           |
| `useUnknownInCatchVariables`     | `true`                  |                                                                                                                                           |

Derleyici seçeneklerinin tam listesi ve bunların TypeScript'i nasıl etkilediği için lütfen
[TypeScript El Kitabı](https://www.typescriptlang.org/docs/handbook/compiler-options.html) adresine başvurun.

## "lib" Özelliğini Kullanma

Birden fazla çalışma zamanına kod gönderdiğiniz bir projede çalışıyorsanız, `compilerOptions` içindeki "lib" özelliği aracılığıyla varsayılan türleri değiştirebilirsiniz.

Kullanıcıları ilgilendiren yerleşik kütüphaneler:

- `"deno.ns"` - Bu, tüm özel `Deno` genel ad alanı API'lerini ve `import.meta`'ya Deno eklerini içerir. Bu genellikle diğer kütüphaneler veya genel türlerle çakışmamalıdır.
- `"deno.unstable"` - Bu, ek olarak dengesiz `Deno` genel ad alanı API'lerini içerir.
- `"deno.window"` - Bu, Deno ana çalışma zamanı betiklerini denetlerken kullanılan "varsayılan" kütüphanedir. `"deno.ns"` ile birlikte Deno içinde yerleşik olan tür kütüphanelerini içerir. Bu kütüphane, `"dom"` ve `"dom.iterable"` gibi standart TypeScript kütüphaneleri ile çakışacaktır.
- `"deno.worker"` - Bu, bir Deno web işçi betiğini kontrol ederken kullanılan kütüphanedir. Web işçileri hakkında daha fazla bilgi için
`Web İşçileri için Tür Kontrolü` başlığına bakın.
- `"dom.asynciterable"` - TypeScript, şu anda Deno'nun (artı birkaç tarayıcının) uyguladığı DOM async iterables'ları içermemektedir; bu nedenle bunu kendimiz uyguladık.

Varsayılan olarak etkinleştirilmemiş bu yaygın kütüphaneler, başka bir çalışma zamanında da çalışması amaçlanan kod yazarken yararlıdır:

- `"dom"` - TypeScript ile birlikte gönderilen ana tarayıcı genel kütüphanesi. Tür tanımları `deno.window` ile birçok şekilde çakışmaktadır; bu nedenle `"dom"` kullanılırsa, Deno'ya özgü API'leri açığa çıkarmak için yalnızca `"deno.ns"` kullanmayı düşünün.
- `"dom.iterable"` - Tarayıcı genel kütüphanesine ek olarak iterable uzantıları.
- `"scripthost"` - Microsoft Windows Script Host için kütüphane.
- `"webworker"` - Tarayıcıda web işçileri için ana kütüphane. `"dom"` gibi, bu da `"deno.window"` veya `"deno.worker"` ile çakışacaktır; bu nedenle, yalnızca Deno'ya özgü API'leri açığa çıkarmak için yalnızca `"deno.ns"` kullanmayı düşünün.
- `"webworker.importscripts"` - Web işçisindeki `importScripts()` API'sini açığa çıkaran kütüphane.
- `"webworker.iterable"` - Web işçisi içindeki nesnelere iterable ekleyen kütüphane. Modern tarayıcılar bunu destekler.

## Deno ve Tarayıcı Hedefleme

Hem Deno'da hem de tarayıcıda kesintisiz çalışan bir kod yazmak isteyebilirsiniz. Bu durumda, herhangi birine özgü API'leri kullanmadan önce yürütme ortamını koşullu olarak kontrol etmeniz gerekecektir. Bu tür durumlarda tipik bir `compilerOptions` yapılandırması aşağıdaki gibi görünebilir:

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "dom.asynciterable", "deno.ns"]
  }
}
```

Bu, çoğu kodun Deno tarafından düzgün bir şekilde tür kontrolüne tabi tutulmasını sağlamalıdır.

Deno kodunu `--unstable` bayrağı ile çalıştırmayı bekliyorsanız, bu kütüphaneyi karışıma da eklemelisiniz:

```json title="deno.json"
{
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "dom.asynciterable",
      "deno.ns",
      "deno.unstable"
    ]
  }
}
```

Genellikle, TypeScript'te `"lib"` seçeneğini kullandığınızda, bir "es" kütüphanesini de dahil etmeniz gerekir. `"deno.ns"` ve `"deno.unstable"` durumunda, bunları eklediğinizde otomatik olarak `"esnext"` dahil edilir.

:::note
**document** veya **HTMLElement** gibi tür hataları alıyorsanız, kullandığınız kütüphanenin DOM’a dayalı bağımlılıkları olduğu muhtemeldir. Bu, hem bir tarayıcıda hem de sunucu tarafında çalışabilen paketler için yaygındır. Varsayılan olarak, Deno yalnızca doğrudan desteklenen kütüphaneleri dahil eder. Paket, çalışma zamanında hangi ortamda çalıştığını doğru şekilde tanımlıyorsa, kodu tür kontrolü için DOM kütüphanelerini kullanmak "güvenli" olacaktır.
:::

## Türler ve Tür Bildirimleri

Deno, _yalnızca standart olmayan modül çözümlemesi olmaması_ ilkesini benimsemektedir. TypeScript bir dosyayı kontrol ettiğinde, yalnızca türlerine odaklanır. Buna karşın, `tsc` derleyicisi bu türleri çözmek için karmaşık mantık kullanmaktadır. Varsayılan olarak, `tsc` belirsiz modül belirteçleri ile uzantıları (örneğin, `.ts`, `.d.ts` veya `.js`) beklemektedir. Ancak Deno, açık belirlestirmelerle ilgilenmektedir.

İşte burada ilginçleşiyor: Zaten JavaScript’e dönüştürülmüş bir TypeScript dosyasını ve tür tanım dosyasını (`mod.js` ve `mod.d.ts`) tüketmek istiyorsanız. `mod.js`'yi Deno'ya aktarırken, tamamen isteğinizi izler ve JavaScript dosyasını içe aktarır. Ancak işte sıkıntı burada: Kodunuz, TypeScript'in `mod.d.ts` dosyasını `mod.js` dosyasıyla birlikte dikkate aldığı kadar kapsamlı bir şekilde tür kontrolüne tabi tutulmaz.

Bunu ele almak için Deno iki çözüm sunar; her biri belirli senaryolar için tasarlanmıştır:

- **İçe Aktaran Olarak:** Bir JavaScript modülüne hangi türlerin uygulanacağına dair bilginiz varsa, tür kontrolünü açıkça türleri belirterek geliştirebilirsiniz.
- **Sağlayıcı Olarak:** Modülün sağlayıcısı veya barındırıcısıysanız, onu kullanan herkes, tür çözümü konusunda endişelenmeden faydalanır.

## İçe Aktarım Yaparken Türleri Sağlama

Bir JavaScript modülünü kullanıyorsanız ve ya türler oluşturduysanız (bir `.d.ts` dosyası) ya da kullanmak istediğiniz türleri başka bir şekilde temin ettiyseniz, Deno'ya tür kontrolü yaparken JavaScript dosyası yerine bu dosyayı kullanmasını istemek için `@ts-types` derleyici ipucunu kullanabilirsiniz.

Örneğin, bir JavaScript modülünüz `coolLib.js` ve ayrı bir `coolLib.d.ts` dosyanız varsa, onu şu şekilde içe aktarabilirsiniz:

```ts
// @ts-types="./coolLib.d.ts"
import * as coolLib from "./coolLib.js";
```

`coolLib` üzerinde tür kontrolü yaparken ve dosyanızda kullanırken, `coolLib.d.ts` dosyasından alınan TypeScript tür tanımlamaları, JavaScript dosyasını incelemeye göre öncelikli olacaktır.

Derleyici ipucu desen eşleşmesi oldukça esnektir; belirticide hem alıntılı hem alıntısız değerleri kabul eder ve eşittir işareti etrafındaki boşlukları dikkate almaz.

## Barındırırken Türleri Sağlama

Modülün kaynak kodu üzerinde kontrol sahibiyseniz veya dosyanın bir web sunucusunda nasıl barındırıldığını biliyorsanız, Deno'ya belirli bir modül için türleri bilmesini sağlamak üzere iki yol vardır (bu, içe aktarım alanından herhangi bir özel eylem gerektirmeyecektir).

### @ts-self-types

Bir JavaScript dosyası sağlıyorsanız ve bu dosya için türleri içeren bir bildirim dosyası sağlamak istiyorsanız, JS dosyasına açıklama dosyasına işaret ederek bir `@ts-self-types` direktifi ekleyebilirsiniz.

Örneğin, bir `coolLib.js` kütüphanesi oluşturduysanız ve tür tanımlarını `coolLib.d.ts` dosyasında yazdıysanız, `ts-self-types` direktifi şu şekilde görünmelidir:

```js title="coolLib.js"
// @ts-self-types="./coolLib.d.ts"

// ... geri kalan JavaScript ...
```

### X-TypeScript-Types

Deno, bir modül için türlerin nerede bulunacağını belirtmek üzere uzak modüller için bir başlık destekler. Örneğin, 
`https://example.com/coolLib.js` için bir yanıt şöyle görünebilir:

```console
HTTP/1.1 200 OK
Content-Type: application/javascript; charset=UTF-8
Content-Length: 648
X-TypeScript-Types: ./coolLib.d.ts
```

Bu başlığı gördüğünde, Deno `https://example.com/coolLib.d.ts` dosyasını almaya çalışır ve tür kontrolü için orijinal modülü kullanır.

## Ortam veya Genel Türleri Kullanma

Genel olarak, Deno ile birlikte modül/UMD tür tanımlarını kullanmak daha iyidir; burada bir modül, bağımlı olduğu türleri açıkça içe aktarır. Modüler tür tanımları, tür tanımında `declare global` aracılığıyla 
[global alanının genişletilmesini](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html) ifade edebilir. Örneğin:

```ts
declare global {
  var AGlobalString: string;
}
```

Bu, tür tanımını içe aktarırken `AGlobalString`'in küresel ad alanında mevcut olmasını sağlar.

Bununla birlikte, diğer mevcut tür kütüphanelerini kullanırken bazen modüler tür tanımlarını kullanmak mümkün olmayabilir. Bu nedenle, programları tür kontrolü yaparken rastgele tür tanımlarını dahil etmenin yolları vardır.

### Üçlü-kaydırma direktifi

Bu seçenek, tür tanımlarını kodun kendisine bağlar. Bir TS dosyasına (JS dosyası değil!) modülün türü etrafında `types` direktifini ekleyerek tür kontrolü dosyayı tür tanımını dahil eder. Örneğin:

```ts
/// <reference types="./types.d.ts" />
```

Burada sağlanan belirtici, Deno'daki diğer belirticilerle aynı şekilde çözülür; bu da bir uzantı gerektirdiği ve onu referans alan modül ile ilgili olduğu anlamına gelir. Tam nitelikli bir URL de olabilir:

```ts
/// <reference types="https://deno.land/x/pkg@1.0.0/types.d.ts" />
```

### "types" Sağlama deno.json

Diğer bir seçenek de, `deno.json` dosyanızdaki `"compilerOptions"` içinde bir `"types"` değeri sağlamaktır. Örneğin:

```json title="deno.json"
{
  "compilerOptions": {
    "types": [
      "./types.d.ts",
      "https://deno.land/x/pkg@1.0.0/types.d.ts",
      "/Users/me/pkg/types.d.ts"
    ]
  }
}
```

Tıpkı yukarıdaki üçlü-kaydırma referansında olduğu gibi, `"types"` dizisinde sağlanan belirtici, Deno'daki diğer belirticilerle aynı şekilde çözülür. Göreli belirticiler için, yapılandırma dosyasına göre ilgili yol bulunur. Deno'nun bu dosyayı kullanmasını sağlamak için `--config=path/to/file` bayrağını belirtmeyi unutmayın.

## Web İşçilerini Tür Kontrolü

Deno, bir web işçisinde bir TypeScript modülü yüklediğinde, modülü ve bağımlılıklarını Deno web işçisi kütüphanesine karşı otomatik olarak tür kontrolüne tabi tutacaktır. Bu, `deno check` veya editörler gibi diğer bağlamlarda bir zorluk oluşturabilir. Deno'ya standart Deno kütüphanelerinin yerine işçi kütüphanelerini kullanmasını yönlendirmek için birkaç yol vardır.

---
title: Üçlü-slaş Yönergeleri
description: Bu içerik, Deno'da üçlü-slaş yönergelerinin nasıl kullanılacağına dair bilgi verir. Ayrıca, deno.json dosyasındaki "lib" ayarını belirleme ve JavaScript'in tür kontrolü sırasında Deno'nun davranışını ele alır.
keywords: [Deno, üçlü-slaş, tür bildirimleri, deno.json, JavaScript, TypeScript, modül grafiği]
---

### Üçlü-slaş yönergeleri

Bu seçenek, kütüphane ayarlarını kodla birleştirir. Çalışan betiğinin giriş noktasında aşağıdaki üçlü-slaş yönergelerini ekleyerek, Deno artık bunu bir Deno çalışan betiği olarak tür kontrolünden geçirecektir, modülün nasıl analiz edildiğine bakılmaksızın:

```ts
/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />
```

İlk yönerge, başka hiçbir varsayılan kütüphanenin kullanılmadığını garanti eder. Bu atlanırsa, bazı çelişkili tür tanımları alırsınız, çünkü Deno standart Deno kütüphanesini de uygulamaya çalışacaktır. İkincisi, Deno'ya yerleşik Deno çalışan tür tanımlarını ve bağımlı kütüphaneleri (örneğin, `"esnext"` gibi) uygulamasını söyler.

:::warning
Bunun bir dezavantajı, kodun `tsc` gibi diğer Deno dışı platformlara daha az taşınabilir hale gelmesidir; çünkü yalnızca Deno, `"deno.worker"` kütüphanesini içine alır.
:::

### deno.json dosyasında "lib" ayarı sağlama

Kütüphane dosyalarını kullanması için Deno'ya talimat vermek amacıyla `deno.json` dosyanızda bir "lib" seçeneği sağlayabilirsiniz. Örneğin:

```json title="deno.json"
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["deno.worker"]
  }
}
```

Sonra Deno alt komutunu çalıştırırken, `--config path/to/file` argümanını geçirmeniz gerekecektir ya da bir IDE kullanıyorsanız ve Deno dil sunucusundan yararlanıyorsanız, `deno.config` ayarını yapılandırmalısınız.

Eğer çalışan olmayan betikleriniz de varsa, ya `--config` argümanını atlamanız ya da çalışan olmayan betiklerinizin gereksinimlerini karşılayacak şekilde yapılandırılmış bir tane bulundurmanız gerekecektir.

---

## Önemli noktalar

### Tür bildirimleri anlamı

Tür bildirim dosyaları (`.d.ts` dosyaları) Deno'daki diğer dosyalarla aynı anlama sahiptir. Bu, bildirim dosyalarının modül bildirimleri (_UMD bildirimleri_) olarak varsayıldığı ve çevresel/global bildirimler olmadığı anlamına gelir. 

> Deno'nun çevresel/global bildirimleri nasıl işleyeceği öngörülemezdir.  
> — Deno Belgeleri

Ayrıca, bir tür bildirimi başka bir şeyi içe aktarıyorsa, örneğin başka bir `.d.ts` dosyası gibi, onun çözümlemesi Deno'nun normal içe aktarma kurallarını takip eder. İnternette üretilen ve mevcut olan birçok `.d.ts` dosyası, Deno ile uyumlu olmayabilir.

[esm.sh](https://esm.sh), varsayılan olarak tür bildirimleri sağlayan bir CDN'dir ( `X-TypeScript-Types` başlığı aracılığıyla). Bu, içe aktarma URL'sine `?no-dts` eklenerek devre dışı bırakılabilir:

```ts
import React from "https://esm.sh/react?no-dts";
```

---

## JavaScript'in tür kontrolü sırasında davranışı

Deno içinde JavaScript kodunu TypeScript'e ithal ettiğinizde, `checkJs`'i `false` olarak ayarlamış olsanız bile (bu, Deno için varsayılan davranıştır), TypeScript derleyicisi yine de JavaScript modülünü analiz edecektir. 

:::info
Modülden yapılan ithalatı doğrulamak için, o modülden çıkışların şeklini çözmeye çalışır.
:::

Genellikle, bu standart bir ES modülünü ithal ederken bir sorun teşkil etmez. Ancak, özel paketleme veya küresel UMD (Evrensel Modül Tanımı) modülleri içeren durumlarda TypeScript'in analizi başarısız olabilir. Bu gibi durumlarla karşılaştığınızda, daha önce belirtilen yöntemlerden biriyle tür bilgisi sağlamak en iyi yaklaşımdır.

### İçsel durumlar

Deno'nun iç işleyişini anlamak, Deno ile TypeScript'i iyi bir şekilde kullanmak için gerekli değildir, ancak nasıl çalıştığını anlamak yardımcı olabilir.

Herhangi bir kod çalıştırılmadan veya derlenmeden önce, Deno kök modülünü ayrıştırarak bir modül grafiği oluşturur ve ardından tüm bağımlılıklarını tespit eder, ardından bu modülleri geri alır ve ayrıştırır; bu, tüm bağımlılıklar alınana kadar öreklemsel olarak devam eder.

Her bağımlılık için, kullanılan iki potansiyel "slot" vardır. Kod slotu ve tür slotudur. Modül grafiği doldurulduğunda, eğer modül JavaScript'e iletilebilir bir şeyse, kod slotunu doldurur; yalnızca tür bağımlılıkları, yani `.d.ts` dosyaları tür slotunu doldurur.

:::note
Modül grafiği oluşturulduğunda ve grafiği tür kontrolünden geçirme ihtiyacı doğduğunda, Deno TypeScript derleyicisini başlatır ve JavaScript olarak iletilebilecek modüllerin adlarını ona besler.
:::

Bu süreç sırasında, TypeScript derleyicisi ek modüller talep eder ve Deno, bağımlılığın slotlarına bakarak, önce tür slotu doluysa bunu sunar, daha sonra kod slotunu sunar.

Bu, bir `.d.ts` modülünü içe aktardığınızda veya yukarıdaki çözümlerden birini kullanarak JavaScript kodu için alternatif tür modülleri sağladığınızda, bu bilgilerin TypeScript'e sağlandığı anlamına gelir.