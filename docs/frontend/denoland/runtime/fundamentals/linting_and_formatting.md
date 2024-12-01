---
title: "Linting ve Formatlama"
description: Deno’nun yerleşik linting ve formatlama araçlarının kullanımı ile kodunuzu temiz, tutarlı ve hatalardan arındırma süreçleri ele alınmaktadır. Bu makalede, Deno’nun `deno fmt` ve `deno lint` komutları ile nasıl etkili bir şekilde çalışılacağı anlatılmaktadır.
keywords: [Deno, linting, formatlama, kod kalitesi, TypeScript, JavaScript, dprint]
---

İdeal bir dünyada, kodunuz her zaman **temiz**, **tutarlı** ve can sıkıcı hatalardan arınmış olur. Bu, Deno'nun yerleşik linting ve formatlama araçlarının vaadidir. Bu özellikleri doğrudan çalışma zamanına entegre ederek, Deno projelerinizdeki dış bağımlılıkları ve karmaşık konfigürasyonları ortadan kaldırır. Bu yerleşik araçlar hızlı ve performanslıdır; yalnızca **zaman kazandırmakla** kalmaz, aynı zamanda her kod satırının **en iyi uygulamalara** uygun olmasını da sağlar.

`deno fmt` ve `deno lint` ile harika kod yazmaya odaklanabilirsiniz, çünkü Deno sizin yanınızdadır. Bu, kod tabanınızı en iyi şekilde tutan dikkatli bir asistanınız varmış gibi, gerçekten önemli olan şeye—eşsiz uygulamalar inşa etmeye—odaklanmanıza olanak tanır.

## Linting

Linting, kodunuzun potansiyel hatalarını, **bugları** ve stil sorunlarını analiz etme sürecidir. Deno'nun yerleşik linter'ı, `deno lint` önerilen kural setini destekleyerek [ESLint](https://eslint.org/) ile kapsamlı geri bildirim sağlar. Bu, sözdizimi hatalarını tanımlamayı, kodlama kurallarını zorlamayı ve hatalara yol açabilecek potansiyel sorunları vurgulamayı içerir.

:::tip
Linter'ı çalıştırmak için terminalde aşağıdaki komutu kullanın:
:::

```bash
deno lint
```

Varsayılan olarak, `deno lint` mevcut dizindeki ve alt dizinlerindeki tüm TypeScript ve JavaScript dosyalarını analiz eder. Özellikle dosyaları veya dizinleri lintlemek istiyorsanız, bunları komutun argümanları olarak geçebilirsiniz. Örneğin:

```bash
deno lint src/
```

Bu komut, `src/` dizinindeki tüm dosyaları lintleyecektir.

Linter, bir `deno.json` dosyasında yapılandırılabilir. Lint sürecini ihtiyaçlarınıza göre özelleştirmek için özel kurallar, eklentiler ve ayarlar belirtebilirsiniz.

## Formatlama

Formatlama, kodunuzun **tutarlı** bir stile uyması için düzenini otomatik olarak ayarlama sürecidir. Deno'nun yerleşik formatlayıcısı `deno fmt`, kodunuzun her zaman temiz, okunabilir ve tutarlı olmasını sağlamak için güçlü [dprint](https://dprint.dev/) motorunu kullanır.

Kodunuzu formatlamak için terminalde aşağıdaki komutu çalıştırın:

```bash
deno fmt
```

Varsayılan olarak, `deno fmt` mevcut dizindeki ve alt dizinlerindeki tüm TypeScript ve JavaScript dosyalarını formatlar. Belirli dosyaları veya dizinleri formatlamak istiyorsanız, bunları komutun argümanları olarak geçebilirsiniz. Örneğin:

```bash
deno fmt src/
```

Bu komut, `src/` dizinindeki tüm dosyaları formatlayacaktır.

### Formatlamanızı Kontrol Etme

`deno fmt --check` komutu, kodunuzun Deno'nun varsayılan formatlama kurallarına uygun bir şekilde doğru biçimlendirilip biçimlendirilmediğini doğrulamak için kullanılır. **Dosyaları değiştirmek yerine**, onları kontrol eder ve herhangi bir formatlama sorununu bildirir. Bu özellikle sürekli entegrasyon (CI) süreçlerine veya ön-commit kancalarına entegre etmek için yararlıdır, böylece projeniz boyunca kod tutarlılığını sağlamış olursunuz.

:::info
Formatlama sorunları varsa, `deno fmt --check` formatlama gerektiren dosyaları listeleyecektir. Tüm dosyalar doğru biçimlendirilmişse, yalnızca herhangi bir çıktı olmadan çıkacaktır.
:::

### CI ile Entegrasyon

Formatlama sorunlarını otomatik olarak kontrol etmek için CI pipeline'ınıza `deno fmt --check` ekleyebilirsiniz. Örneğin, bir GitHub Actions iş akışında:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x
      - run: deno fmt --check
```

Bu, herhangi bir kod değişikliğinin projenin formatlama standartlarına uymasını sağlar.

### Kullanılabilir Seçenekler

| Kural               | Tanım                                                  | Varsayılan | Olası Değerler          |
| ------------------- | ------------------------------------------------------ | ---------- | ----------------------- |
| indent-width        | Girinti genişliğini tanımlama                          | **2**      | sayı                   |
| line-width          | Maksimum satır genişliğini belirleme                   | **80**     | sayı                   |
| no-semicolons       | Gerekli yerler dışında noktalı virgül kullanmama      | **false**  | true, false            |
| prose-wrap          | Prozanın nasıl sarılacağını tanımlama                  | **always** | always, never, preserve |
| single-quote        | Tek tırnak kullanma                                    | **false**  | true, false            |
| unstable-component  | Svelte, Vue, Astro ve Angular dosyalarını formatlama   |            |                         |
| unstable-css        | CSS, SCSS, Sass ve Less dosyalarını formatlama        |            |                         |
| unstable-html       | HTML dosyalarını formatlama                            |            |                         |
| unstable-yaml       | YAML dosyalarını formatlama                            |            |                         |
| use-tabs            | Girinti için boşluklar yerine sekmeler kullanma        | **false**  | true, false            |

Formatlayıcı, bir `deno.json` dosyasında yapılandırılabilir. Formatlama sürecini ihtiyaçlarınıza göre özelleştirmek için özel ayarlar belirtebilirsiniz.