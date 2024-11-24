## Performansı Karşılaştırma: Döngüler vs. Yineleyiciler

Döngülerin mi yoksa yineleyicilerin mi kullanılacağına karar vermek için, `search` fonksiyonunun açık bir `for` döngüsü ile mi yoksa yineleyiciler ile mi daha hızlı olduğunu bilmeniz gerekir.

:::tip
**Önemli:** Performans karşılaştırmalarında, her iki yöntemi de optimal koşullar altında test etmek en iyi sonuçları verir.
:::

Sir Arthur Conan Doyle'un *Sherlock Holmes'ün Maceraları* adlı eserinin tüm içeriğini bir `String`'e yükleyerek içeriğinde *the* kelimesini aradık. İşte `for` döngüsü kullanan `search` versiyonu ve yineleyicileri kullanan versiyon üzerindeki benchmark sonuçları:

```text
test bench_search_for  ... bench:  19,620,300 ns/iter (+/- 915,700)
test bench_search_iter ... bench:  19,234,900 ns/iter (+/- 657,200)
```

Yineleyici versiyonu hafifçe daha hızlıydı! Burada benchmark kodunu açıklamayacağız, çünkü amaç bu iki versiyonun eşdeğer olduğunu kanıtlamak değil, bu iki uygulamanın performans açısından nasıl karşılaştırıldığına dair genel bir anlayış elde etmektir.

:::info
**Not:** Daha kapsamlı bir benchmark için çeşitli boyutlardaki farklı metinleri `contents` olarak, farklı kelimeleri ve farklı uzunluktaki kelimeleri `query` olarak kullanmayı ve her türlü diğer varyasyonu kontrol etmelisiniz.
:::

Şu nokta önemlidir: Yineleyiciler, yüksek seviye bir soyutlama olmasına rağmen, aslında yazdığınız düşük seviyeli kod ile yaklaşık aynı kodda derlenir. Yineleyiciler, Rust’ın *sıfır maliyetli soyutlamaları* arasındadır; bu, soyutlamanın ek bir çalışma zamanı yükü getirmediği anlamına gelir. **Bu,** Bjarne Stroustrup'un, C++'ın orijinal tasarımcısı ve uygulayıcısı olarak "C++ Temelleri" (2012) kitabında *sıfır yük* tanımına benzer:

> Genel olarak, C++ uygulamaları sıfır yük ilkelerine uyar: Kullanmadığınız, bunun için ödeme yapmazsınız. Dahası: Kullandığınız şeyi, daha iyi elde edemezsiniz.
> — Bjarne Stroustrup

Bir diğer örnek, aşağıdaki kod bir ses dekoderinden alınmıştır. Çözme algoritması, önceki örneklerin doğrusal işlevine dayanan gelecekteki değerleri tahmin etmek için doğrusal tahmin matematiksel işlemini kullanır. 

:::note
Bu kod, üç değişken üzerinde matematik yapacak bir yineleyici zinciri kullanır: `buffer` veri dilimi, 12 `coefficients` dizisi ve verileri `qlp_shift` kadar kaydırmak için bir miktar.
:::

Bu örnekteki değişkenleri tanımladık ama onlara hiçbir değer vermedik; bu kodun bağlamı dışında pek bir anlamı olmasa da, Rust'ın yüksek seviye fikirleri düşük seviye koda nasıl dönüştüğüne dair özlü, gerçek bir örnektir.

```rust,ignore
let buffer: &mut [i32];
let coefficients: [i64; 12];
let qlp_shift: i16;

for i in 12..buffer.len() {
    let prediction = coefficients.iter()
                                 .zip(&buffer[i - 12..i])
                                 .map(|(&c, &s)| c * s as i64)
                                 .sum::<i64>() >> qlp_shift;
    let delta = buffer[i];
    buffer[i] = prediction as i32 + delta;
}
```

`prediction` değerini hesaplamak için bu kod, `coefficients` dizisindeki her bir 12 değeri üzerinde yineleme yapar ve `zip` metodunu kullanarak katsayı değerlerini `buffer`'daki önceki 12 değer ile eşleştirir. Ardından, her çift için değerleri çarpıyor, tüm sonuçları topluyor ve toplamda `qlp_shift` bitini sağa kaydırıyoruz.

:::warning
**Dikkat:** Ses dekoderleri gibi uygulamalardaki hesaplamalar genellikle performansı en yüksek öncelik olarak alır. Burada, bir yineleyici oluşturuyoruz, iki adaptör kullanıyoruz ve ardından değeri tüketiyoruz.
:::

Bu Rust kodu hangi montaj koduna derlenecek? Şu anki yazım itibariyle, yazdığınız montajla aynı montaja derleniyor. `coefficients` değerleri üzerinde yineleme için hiç döngü yok: Rust, 12 yineleme olduğunu bildiği için döngüyü "unroll" (açıkça yazma) ediyor. *Unroll* (açma), döngüyü kontrol eden kodun yükünü kaldıran ve bunun yerine döngünün her yinelemesi için tekrarlanan kod üreten bir optimizasyon türüdür.

Tüm katsayılar, kayıtlarda saklanır, bu da değerlere erişimin çok hızlı olduğu anlamına gelir. Dizi erişimi sırasında çalışma zamanında hiçbir sınır kontrolü yoktur. Rust'ın uygulayabildiği tüm bu optimizasyonlar, sonuçta ortaya çıkan kodun son derece verimli olmasını sağlar. **Artık bunu bildiğinize göre, yineleyicileri ve kapamaları korkusuzca kullanabilirsiniz!** Bu, kodun daha yüksek seviyeli görünmesini sağlarken, bunun için bir çalışma zamanı performans cezası getirmiyor.

---

## Özet

Kapamalar ve yineleyiciler, işlevsel programlama dilinden ilham alan Rust özellikleridir. Rust'ın, yüksek seviye düşünceleri düşük seviye performansla net bir şekilde ifade etme yeteneğine katkıda bulunur. Kapama ve yineleyici uygulamaları, çalışma zamanı performansını etkilemeyecek şekilde tasarlanmıştır. Bu, Rust'ın sıfır maliyetli soyutlamalar sağlama hedefinin bir parçasıdır.

:::info
Giriş/çıkış projemizin ifadesini geliştirdiğimize göre, projeyi dünyayla paylaşmamıza yardımcı olacak `cargo`'nun daha fazla özelliğine bakalım.
:::