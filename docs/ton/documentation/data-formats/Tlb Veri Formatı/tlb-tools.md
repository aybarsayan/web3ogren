# TL-B Araçları

## TL-B Ayrıştırıcılar

TL-B ayrıştırıcıları temel `TL-B türleri` serileştirmesinde yardımcı olur. Her biri, TL-B türlerini bir nesne olarak uygulamakta ve serileştirilmiş ikili veriyi döndürmektedir.

| Dil         | SDK                                                                                                      | Sosyal                  |
|-------------|----------------------------------------------------------------------------------------------------------|-------------------------|
| Kotlin      | [ton-kotlin](https://github.com/ton-community/ton-kotlin/tree/main/tlb) (+ `.tlb` dosyalarını ayrıştırma) | https://t.me/tonkotlin  |
| Go          | [tonutils](https://github.com/xssnick/tonutils-go/tree/master/tlb)                                       | https://t.me/tonutils   |
| Go          | [tongo](https://github.com/tonkeeper/tongo/tree/master/tlb) (+ `.tlb` dosyalarını ayrıştırma)         | https://t.me/tongo_lib  |
| TypeScript  | [tlb-parser](https://github.com/ton-community/tlb-parser)                                                | -                       |
| Python      | [ton-kotlin](https://github.com/disintar/tonpy) (+ `.tlb` dosyalarını ayrıştırma)                        | https://t.me/dtontech   |

:::note
Her bir ayrıştırıcının `.tlb` dosyalarını başarılı bir şekilde ayrıştırmak için belirli yapılandırmalara ihtiyacı olabilir.
:::

## TL-B Oluşturucu

[tlb-codegen](https://github.com/ton-community/tlb-codegen) paketi, sağlanan TLB şemasına göre yapıları serileştirmek ve serileştirmek için Typescript kodu oluşturmanıza olanak tanır.

:::tip
**Öneri:** TLB şemasını oluştururken, tiplerin doğruluğuna dikkat etmek, daha az hata ile sonuçlanmanızı sağlar.
:::

[tonpy](https://github.com/disintar/tonpy) paketi, sağlanan TLB şemasına göre yapıları serileştirmek ve serileştirmek için Python kodu oluşturmanıza olanak tanır.

:::warning
**Hatalar:** Yanlış yapılandırılmış bir TLB şemasının, çıkış kodunda beklenmedik hatalara yol açabileceğini unutmayın.
:::