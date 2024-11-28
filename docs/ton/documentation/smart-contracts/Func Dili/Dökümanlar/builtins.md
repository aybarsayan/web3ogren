# Yerleşikler
Bu bölüm, önceki makalelerde tanımlananlardan daha az temel olan bazı dil yapılarını açıklamaktadır. Bunlar `stdlib.fc` içinde tanımlanabilir, ancak FunC optimizasyonu için daha az alan bırakır.

## İstisna Fırlatma
İstisnalar, `throw_if`, `throw_unless` koşullu primitifleri ve koşulsuz `throw` ile fırlatılabilir. İlk argüman **hata kodudur**; ikinci argüman **koşuldur** (`throw` yalnızca bir argüman alır). Bu primitiflerin parametreli versiyonları `throw_arg_if`, `throw_arg_unless` ve `throw_arg` vardır. İlk argüman herhangi bir türde istisna parametresidir; ikinci argüman hata kodudur; üçüncü argüman koşuldur (`throw_arg` yalnızca iki argüman alır).

:::tip
**İstisna fırlatma** mekanizmasını kullanırken koşullarınızı dikkatlice tanımlayın.
:::

## Booleans
- `true`, `-1`'in takma adıdır
- `false`, `0`'ın takma adıdır

## Değişken Dump
Bir değişken, `~dump` fonksiyonu ile hata ayıklama günlüğüne yazılabilir.

## String Dump
Bir string, `~strdump` fonksiyonu ile hata ayıklama günlüğüne yazılabilir.

## Tam Sayı İşlemleri
- `muldiv`, önce çarpma ardından bölme işlemi yapar. Ara sonuç **513-bit tam sayıda** saklanır, böylece gerçek sonuç **257-bit tam sayıya** sığarsa taşma yapmaz.
- `divmod`, iki sayıyı parametre olarak alan ve bunların bölümünün miktarını ve kalanını veren bir işlemdir.

:::info
Tam sayı işlemleri sırasında taşma riskini minimize etmek için her zaman ara sonuçların saklandığı bit boyutuna dikkat edin.
:::

## Diğer Primitifler
- `null?` argümanın `null` olup olmadığını kontrol eder. TVM türünden `null` değeri tarafından, `Null` FunC bazı atomik türlerin bir değerinin yokluğunu temsil eder; `null değerleri` bölümüne bakınız.
- `touch` ve `~touch`, bir değişkeni yığının en üstüne taşır.
- `at`, belirtilen konumdaki bir tuple bileşeninin değerini alır.

:::note
**`null?`** fonksiyonu, kodunuzun hata ayıklama sürecinde kullanışlıdır ve `null` değerlerinin yönetimini kolaylaştırır.
:::