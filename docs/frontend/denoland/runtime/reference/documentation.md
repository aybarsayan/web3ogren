---
title: "Dokümantasyon Testleri"
description: Deno, dokümantasyon örneklerinizin tip kontrolünü destekler, ancak mevcut durumda dokümantasyondaki kod parçacıkları için çalışma zamanı davranışı test edilmemektedir. Bu içerik, örneklerinizi güncel tutmanız için gerekli bilgileri sunmaktadır.
keywords: [Deno, dokümantasyon, tip kontrol, kod parçacıkları, örnekler, test çalıştırıcısı]
---

Deno, dokümantasyon örneklerinizin _tip kontrolünü_ destekler.

:::info
Şu anda dokümantasyondaki kod parçacıkları için hiçbir çalışma zamanı davranışı test edilmemektedir. 
Takip etme durumu: [denoland/deno#4716](https://github.com/denoland/deno/issues/4716)
:::

Bu, dokümantasyonunuz içindeki örneklerin güncel ve çalışır durumda olmasını sağlar.

**Temel fikir şudur:**

````ts
/**
 * # Örnekler
 *
 * ```ts
 * const x = 42;
 * ```
 */
````

Üçlü ters tırnak işareti kod bloklarının başlangıcını ve sonunu işaret eder, _dil_, kod bloğunun çıkarıldığı kaynak belgenin medya türüne göre belirlenir.

Aşağıdaki dil tanımlayıcılarında herhangi biri kullanılabilir:

- `js`
- `javascript`
- `mjs`
- `cjs`
- `jsx`
- `ts`
- `typescript`
- `mts`
- `cts`
- `tsx`

:::tip
Eğer bir dil tanımlayıcı belirtilmemişse, dil, kod bloğunun çıkarıldığı kaynak belgenin medya türüne göre çıkarılır.
:::

Desteklenen bir diğer özellik ise `ignore`’dır; bu, test çalıştırıcısına kod bloğunun tip kontrolünü atlaması talimatını verir.

````ts
/**
 * # Tip kontrolünden geçmez
 *
 * ```typescript ignore
 * const x: string = 42;
 * ```
 */
````

Eğer bu örnek `foo.ts` adlı bir dosyada yer alıyorsa, `deno test --doc foo.ts` komutu bu örneği çıkaracak ve ardından onu belgelendirilen modül ile aynı dizinde yaşayan bağımsız bir modül olarak tip kontrolünden geçirecektir.

:::warning
İhracatlarınızı belgelendirmek için modülü görel bir yol belirleyici kullanarak içe aktarın:
:::

````ts
/**
 * # Örnekler
 *
 * ```ts
 * import { foo } from "./foo.ts";
 * ```
 */
export function foo(): string {
  return "foo";
}
````