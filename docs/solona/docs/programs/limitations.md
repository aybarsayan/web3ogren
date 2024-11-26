---
title: "Sınırlamalar"
sidebarSortOrder: 6
---

Solana blockchain üzerinde program geliştirmek, bazı doğuştan sınırlamalar içerir. Aşağıda karşılaşabileceğiniz yaygın sınırlamaların bir listesi bulunmaktadır.

## Rust kütüphaneleri

:::info
Rust tabanlı onchain programlar, kaynak kısıtlı, tek iş parçacıklı bir ortamda çalışırken belirleyici olmalıdır. Bu nedenle çeşitli kütüphaneler üzerinde bazı sınırlamalar vardır.
:::

On-chain Rust programları, Rust’ın libstd, libcore ve liballoc'un çoğunu, ayrıca birçok üçüncü parti crate'i destekler.

Bu programların kaynak kısıtlı, tek iş parçacıklı bir ortamda çalışmasından ve belirleyici olmalarından dolayı bazı sınırlamalar vardır:

- **Erişim yok:**
  - `rand`
  - `std::fs`
  - `std::net`
  - `std::future`
  - `std::process`
  - `std::sync`
  - `std::task`
  - `std::thread`
  - `std::time`
  
- **Sınırlı erişim:**
  - `std::hash`
  - `std::os`

- **Bincode**, hem işlem döngüsü hem de çağrı derinliği açısından son derece hesaplama açısından pahalıdır ve kaçınılmalıdır.
- **Dize biçimlendirme**, aynı zamanda hesaplama açısından pahalı olduğu için kaçınılmalıdır.
- `println!`, `print!` desteği yok, bunun yerine
  [`msg!`](https://github.com/solana-labs/solana/blob/d9b0fc0e3eec67dfe4a97d9298b15969b2804fab/sdk/program/src/log.rs#L33)
  makrosunu kullanın.
  
:::warning
Çalışma zamanı, bir programın bir talebin işlenmesi sırasında yürütmesine izin verilen talimat sayısında bir sınır uygular. Daha fazla bilgi için  
`hesaplama bütçesi` bakın.
:::

## Hesaplama bütçesi

:::tip
Blockchain'in hesaplama kaynaklarının kötüye kullanılmasını önlemek için, her bir işleme bir `hesaplama bütçesi` tahsis edilir. Bu hesaplama bütçesinin aşılması, işlemin başarısız olmasına neden olacaktır.
:::

Daha spesifik detaylar için `hesaplama kısıtlamaları` belgesine bakın.

## Çağrı yığını derinliği - `CallDepthExceeded` hatası

Solana programları hızlı çalışmak üzere kısıtlanmıştır ve bunu kolaylaştırmak için, programın çağrı yığını maksimum **64 çerçeve** derinliği ile sınırlıdır.

:::note
Bir program izin verilen çağrı yığını derinliği sınırını aşarsa, `CallDepthExceeded` hatası alır.
:::

## CPI çağrı derinliği - `CallDepth` hatası

Çapraz program çağrıları, programların diğer programları doğrudan çağırmasına olanak tanır, ancak derinlik şu anda `4` ile sınırlıdır.

:::tip
Bir program izin verilen
`çapraz program çağrısı derinliğini` aşarsa, `CallDepth` hatası alır.
:::

## Float Rust türleri desteği

Programlar, Rust'ın float işlemlerinin sınırlı bir alt kümesini destekler. Bir program desteklenmeyen bir float işlemi kullanmaya çalışırsa, çalışma zamanı çözülmemiş sembol hatası bildirir.

> Float işlemleri, yazılım kütüphaneleri aracılığıyla, özellikle LLVM'nin float yerleşik işlevleri aracılığıyla gerçekleştirilir. Yazılım simülasyonu nedeniyle, tamsayı işlemlerine göre daha fazla hesaplama birimi tüketirler. Genel olarak, mümkün olduğunda sabit nokta işlemleri önerilir.  
> — Solana Geliştirici Rehberi

[Solana Program Kütüphanesi matematik](https://github.com/solana-labs/solana-program-library/tree/master/libraries/math) testleri, bazı matematik işlemlerinin performansını raporlayacaktır. Testi çalıştırmak için repo'yu senkronize edin ve çalıştırın:

```shell
cargo test-sbf -- --nocapture --test-threads=1
```

Sonuçlar gösteriyor ki, float işlemleri, tamsayı eşdeğerlerine göre daha fazla talimat alıyor. Sabit nokta uygulamaları değişiklik gösterebilir ancak yine de float eşdeğerlerinden daha az olacaktır:

```text
          u64   f32
Çarpma     8   176
Bölme      9   219
```

## Statik yazılabilir veri

Program paylaşılan nesneleri yazılabilir paylaşılan verileri desteklemez. Programlar, aynı paylaşılan salt okunur kod ve veriyi kullanarak birden fazla paralel yürütme arasında paylaşılır. 

:::danger
Bu nedenle, geliştiricilerin programlarda herhangi bir statik yazılabilir veya global değişken içermemesi gerekir. Gelecekte yazılabilir veri desteği için bir kopyala-üzerine yaz mekanizması eklenebilir.
:::

## İmzalı bölme

SBF komut seti, imzalı bölmeyi desteklememektedir.