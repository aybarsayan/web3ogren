---
description: Bu belge, CLI için yerleşik fonksiyonlar hakkında bilgi sağlamaktadır. Turing in yerleşik komutları açıklanmaktadır ve bunların nasıl kullanılacağı hakkında bilgiler içermektedir.
keywords: [yerleşik fonksiyonu, CLI, komutlar, JSON spesifikasyonu, yardım komutu, sürüm komutu]
---

# Gömülü Fonksiyonlar

Aşağıdaki komutlar bazı bağlamlarda faydalı olabilir, ancak mutlaka hepsi için geçerli değildir. Bu nedenle, bunları cli'nize açıkça kaydetmeniz gerekir:

```ts
cli.register(Builtins.HelpCommand);
```

## `Builtins.DefinitionsCommand`

`--clipanion=definitions` bayrağı ile tek argüman olarak aracı çalıştırarak tetiklenen komut. Çağrıldığında, mevcut cli için tam JSON spesifikasyonunu standart çıktıya yazdıracaktır. Dış araçlar, bu bilgiyi **diğer medya için belgeler oluşturmak** üzere kullanabilir (örneğin, bunu Yarn CLI belgeleri oluşturmak için kullanıyoruz).

:::info
**Önemli Not:** JSON spesifikasyonu, CLI'nin çalışması için kritik bir bileşen olabilir ve dış araçlarla entegrasyonu sağlayabilir.
:::

## `Builtins.HelpCommand`

`-h,--help` bayrağı ile tek argüman olarak aracı çalıştırarak tetiklenen komut. Çağrıldığında, standart çıktıda mevcut tüm komutların listesini (gizli olanlar hariç) yazdıracaktır.

:::tip
**İpucu:** `HelpCommand`'ı kullanarak, mevcut komutların hızlı bir özetine erişebilirsiniz.
:::

## `Builtins.VersionCommand`

`--version` bayrağı ile tek argüman olarak aracı çalıştırarak tetiklenen komut. Çağrıldığında, `binaryVersion` alanının değerini yazdıracaktır. 

:::note
*VersionCommand*, CLI aracının hangi sürümde çalıştığını kontrol etmek için yararlı bir yöntemdir.
:::