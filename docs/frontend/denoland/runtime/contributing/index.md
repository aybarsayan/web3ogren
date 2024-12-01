---
title: "Katkıda Bulunma ve Destek"
description: Deno'ya nasıl katkıda bulunacağınızı ve destek sağlayacağınızı öğrenin. Bu sayfa, projelerin özellikleri, öneriler ve iyi uygulamalar sunmaktadır.
keywords: [Deno, katkı, yazılım geliştirme, projeler, belgelendirme, Rust, TypeScript]
---

Deno'ya yapılan tüm katkıları memnuniyetle karşılıyoruz ve takdir ediyoruz.

Bu sayfa, katkıda bulunmaya başlamanıza yardımcı olmayı amaçlar.

## Projeler

Deno ekosisteminin bir parçası olan [`denoland`](https://github.com/denoland) kuruluşunda birçok depo bulunmaktadır.

Depolar farklı kapsamlar, çeşitli programlama dilleri kullanmakta ve katkı açısından farklı zorluk seviyelerine sahiptir. Hangi deponun katkıda bulunmak için en iyi başlangıç noktası olabileceğini belirlemenize yardımcı olmak için, işte kısa bir karşılaştırma (**kod tabanları esasen kalın yazılan dilleri içermektedir**):

### [deno](https://github.com/denoland/deno)

Bu, `deno` CLI'yi sağlayan ana depodur.

Bir hatayı düzeltmek veya `deno`ya yeni bir özellik eklemek istiyorsanız, katkıda bulunmak için doğru depo burasıdır.

>  İlk katkınızı yapmak istiyorsanız, burası iyi bir başlangıç noktasıdır.  
> — Deno Projeleri

Bazı sistemler, Node.js uyumluluk katmanının büyük bir kısmı JavaScript ve TypeScript modülleri ile uygulanmıştır. 

:::tip
Bu tür modüllerde geçerken, `cargo` bayraklarınıza `--features hmr` eklemeniz önerilir. 
:::

Aşağıdaki komutları kullanmak için, önce sisteminizde gerekli araçları kurmalısınız; bu, `burada` açıklanmıştır.

```sh
# cargo build
cargo build --features hmr

# cargo run -- run hello.ts
cargo run --features hmr -- run hello.ts

# cargo test integration::node_unit_tests::os_test
cargo test --features hmr integration::node_unit_tests::os_test
```

Ayrıca, bu özellik bayrağını editör ayarlarınızda referans vermeyi unutmayın. VSCode kullanıcıları için, aşağıdakileri çalışma alanı dosyanıza ekleyin:

```jsonc
{
  "settings": {
    "rust-analyzer.cargo.features": ["hmr"],
    // Dahili `ext:*` modüllerini çözümlemek için destek ekler
    "deno.importMap": "tools/core_import_map.json"
  }
}
```

## Genel Notlar

- `stil kılavuzunu` okuyun.
- [performans ölçümlerini](https://deno.land/benchmarks) kötüleştirmeyin.
- [topluluk sohbet odasında](https://discord.gg/deno) yardım isteyin.
- Bir sorun üzerinde çalışacaksanız, başlamadan önce sorun açıklamalarında belirtin.
- Yeni bir özellik üzerinde çalışacaksanız, başlamadan önce bir sorun oluşturun ve diğer katkıda bulunanlarla tartışın; tüm katkıları memnuniyetle karşılıyoruz ancak önerilen tüm özellikler kabul edilmeyecektir.

:::warning
Bu nedenle, kabul edilmeyecek bir kod üzerinde saatler harcamanızı istemiyoruz.
:::

## Bir pull request (PR) gönderme

Herhangi bir depoya PR göndermeden önce, aşağıdakilerin yapılmış olduğundan emin olun:

1. PR için açıklayıcı bir başlık verin.

İyi PR başlığı örnekleri:
- fix(std/http): Sunucudaki yarış koşulunu düzelt
- docs(console): Doküman dizelerini güncelle
- feat(doc): İç içe yeniden ihracatları işleme

Kötü PR başlığı örnekleri:
- fix #7123
- docs güncelle
- hataları düzelt

2. İlgili bir sorun olduğundan ve bunun PR metninde referans verildiğinden emin olun.
3. Değişiklikleri kapsayan testlerin olduğundan emin olun.

### [`deno`](https://github.com/denoland/deno) için PR gönderme

Yukarıdakilere ek olarak, aşağıdakilerin de sağlandığından emin olun:

> Aşağıdaki komutları kullanmak için, önce sisteminizde gerekli araçları kurmalısınız; bu, `burada` açıklanmıştır.

1. `cargo test` geçer - bu, birim testleri, entegrasyon testleri ve Web Platform Testleri dahil olmak üzere `deno` için tam test kümesini çalıştırır.
2. `./tools/format.js` çalıştırın - bu, tüm kodu depo içindeki tutarlı stile uygun olarak biçimlendirir.
3. `./tools/lint.js` çalıştırın - bu, Rust ve JavaScript kodunu yaygın hatalar ve hatalar için kontrol eder; `clippy` (Rust için) ve `dlint` (JavaScript için) kullanarak.

### API'leri Belgelendirme

Tüm halka açık API'lerin belgelendirilmesi önemlidir ve bunu kodla birlikte inline olarak yapmak istemekteyiz. Bu, kod ve belgelerin birlikte sıkı bir şekilde bağlı olmasını sağlamaya yardımcı olur.

### JavaScript ve TypeScript

`deno` modülü ile global/`window` ad alanı aracılığıyla halka açık olarak sergilenen tüm API'ler ve türlerin JSDoc belgelendirmesine sahip olması gerekir. 

```ts
/** Basit bir JSDoc yorumu */
export const FOO = "foo";
```

Daha fazlasını bulmak için: https://jsdoc.app/

### Rust

Rust kodunda belgelendirme yorumları yazmak için [bu kılavuzu](https://doc.rust-lang.org/rustdoc/how-to-write-documentation.html) kullanın.