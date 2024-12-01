---
title: "Sürekli Entegrasyon"
description: Deno'nun yerleşik araçları, projeleriniz için Sürekli Entegrasyon (CI) süreçlerini ayarlamayı kolaylaştırır. Test, linting ve biçimlendirme işlemlerini yapabilir ve kod kapsamı raporları oluşturabilirsiniz.
keywords: [Deno, Sürekli Entegrasyon, CI, GitHub Actions, kod kapsamı, test, linting]
---

Deno'nun yerleşik araçları, projeleriniz için **Sürekli Entegrasyon (CI)** süreçlerini ayarlamayı kolaylaştırır. `Test`, `linting ve biçimlendirme` işlemlerini `deno test`, `deno lint` ve `deno fmt` komutlarıyla gerçekleştirebilirsiniz. Ayrıca, test sonuçlarından `deno coverage` ile kod kapsamı raporları oluşturabilirsiniz.

## Temel bir sürecin ayarlanması

Deno projeleri için GitHub Actions'ta temel süreçler ayarlayabilirsiniz. Bu sayfada açıklanan kavramlar, Azure Pipelines, CircleCI veya GitLab gibi diğer CI sağlayıcıları için de büyük ölçüde geçerlidir.

Deno için bir süreci oluşturmanın genellikle başlangıcı, depoyu kontrol etmek ve Deno'yu kurmaktır:

```yaml
name: Build

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x # En son kararlı Deno ile çalıştırın.
```

İş akışını genişletmek için ihtiyaç duyabileceğiniz `deno` alt komutlarını ekleyin:

```yaml
# Kodun Deno'nun varsayılan
# biçimlendirme kurallarına göre biçimlendirilip
# biçimlendirilmediğini kontrol edin.
- run: deno fmt --check

# Kodun sözdizimi hataları ve stil sorunları için taramasını yapın. Eğer
# özel bir linter yapılandırması kullanmak istiyorsanız, --config <myconfig> ile bir yapılandırma dosyası ekleyebilirsiniz.
- run: deno lint

# Depodaki tüm test dosyalarını çalıştırın ve kod kapsamını toplayın. Örnek
# tüm izinlerle çalışır, ancak programınızın ihtiyaç duyduğu en minimal izinlerle çalıştırmak önerilir (örneğin --allow-read).
- run: deno test --allow-all --coverage=cov/

# Bu, `deno test --coverage` ile toplanan kapsamdan bir rapor oluşturur. 
# Codecov, Coveralls ve Travis CI gibi hizmetlerle iyi entegre olan bir .lcov dosyası olarak saklanır.
- run: deno coverage --lcov cov/ > cov.lcov
```

## Çoklu platform iş akışları

Bir Deno modülü yöneticisi olarak, kodunuzun günümüzde kullanılan tüm büyük işletim sistemlerinde çalışıp çalışmadığını bilmek isteyebilirsiniz: Linux, MacOS ve Windows. Çoklu platform iş akışı, paralel işlerin bir matrisini çalıştırarak gerçekleştirilebilir; her biri farklı bir işletim sisteminde derleme yapar:

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    steps:
      - run: deno test --allow-all --coverage cov/
```

:::caution
Not: GitHub Actions, Windows tarzı satır sonlarını (CRLF) yönetmekte bilinen bir [sorun](https://github.com/actions/checkout/issues/135) vardır. Bu, `windows` üzerinde çalışan işlerde `deno fmt` çalıştırırken sorun yaratabilir. Bunu önlemek için, `actions/checkout@v3` adımından önce Actions çalıştırıcısını Linux tarzı satır sonlarını kullanacak şekilde yapılandırın:

```sh
git config --system core.autocrlf false
git config --system core.eol lf
```
:::

Eğer deneysel veya istikrarsız Deno API'leri ile çalışıyorsanız, Deno'nun kanarya sürümünü çalıştıran bir matris işi ekleyebilirsiniz. Bu, kırıcı değişiklikleri erken tespit etmeye yardımcı olabilir:

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    continue-on-error: ${{ matrix.canary }} # Kanarya çalışması başarısız olursa devam et
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        deno-version: [v1.x]
        canary: [false]
        include:
          - deno-version: canary
            os: ubuntu-latest
            canary: true
```

## Deno süreçlerini hızlandırma

### Tekrarları azaltma

Çoklu platform çalıştırmalarında, bir sürecin belirli adımları her işletim sistemi için mutlaka çalıştırılmak zorunda değildir. Örneğin, Linux, MacOS ve Windows üzerinde aynı test kapsamı raporunu oluşturan adımlar biraz gereksizdir. Bu durumlarda GitHub Actions'ın `if` koşullu anahtarını kullanabilirsiniz. Aşağıdaki örnek, kod kapsamı oluşturma ve yükleme adımlarını yalnızca `ubuntu` (Linux) çalıştırıcısında nasıl çalıştıracağınızı göstermektedir:

```yaml
- name: Kapsam raporu oluştur
  if: matrix.os == 'ubuntu-latest'
  run: deno coverage --lcov cov > cov.lcov

- name: Coveralls.io'ya kapsam yükle
  if: matrix.os == 'ubuntu-latest'
  # Herhangi bir kod kapsamı hizmeti kullanılabilir; Coveralls.io burada bir örnek olarak kullanılmıştır.
  uses: coverallsapp/github-action@master
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }} # GitHub tarafından oluşturulmuştur.
    path-to-lcov: cov.lcov
```

### Bağımlılıkları önbelleğe alma

Bir proje büyüdükçe, daha fazla bağımlılığın eklenmesi eğilimindedir. Deno, bu bağımlılıkları test sırasında indirecektir ve bir iş akışı günde birçok kez çalıştırıldığında, bu zaman alıcı bir süreç haline gelebilir. Süreçleri hızlandırmanın yaygın bir çözümü, bağımlılıkların yeniden indirilmesine gerek kalmaması için bunları önbelleğe almaktır.

Deno, bağımlılıkları yerel olarak bir önbellek dizininde saklar. Bir süreçte önbellek, `DENO_DIR` ortam değişkenini ayarlayarak ve iş akışına bir önbellekleme adımı ekleyerek korunabilir:

```yaml
# DENO_DIR'yi çalıştırıcıda mutlak veya göreli bir yola ayarlayın.
env:
  DENO_DIR: my_cache_directory

steps:
  - name: Deno bağımlılıklarını önbelleğe al
    uses: actions/cache@v2
    with:
      path: ${{ env.DENO_DIR }}
      key: my_cache_key
```

:::note
Bu iş akışı ilk kez çalıştığında önbellek henüz boş olur ve `deno test` gibi komutlar hala bağımlılıkları indirmek zorunda kalır, ancak iş başarılı olduğunda `DENO_DIR` içerikleri kaydedilir ve sonraki çalışmalarda bunlar önbellekten geri yüklenebilir.
:::

Yukarıdaki iş akışında hala bir sorun vardır: O anda önbellek anahtarının adı `my_cache_key` olarak sabit kodlanmıştır ve bu her seferinde aynı önbelleği geri yükleyecektir, hatta bir veya daha fazla bağımlılık güncellenmiş olsa bile. Bu, bazı bağımlılıkları güncellediğinizde boru hattında daha eski sürümlerin kullanılmasına neden olabilir. Çözüm, önbelleği güncellememiz gerektiğinde her seferinde farklı bir anahtar üretmektir; bu, bir kilit dosyası kullanarak ve GitHub Actions tarafından sağlanan `hashFiles` işlevini kullanarak başarılabilir:

```yaml
key: ${{ hashFiles('deno.lock') }}
```

Bunun çalışabilmesi için Deno projenizde bir kilit dosyasına sahip olmanız gerekecektir; bu konuyla ilgili detaylı bilgi `burada` yer almaktadır. Artık `deno.lock` dosyasının içeriği değişirse, yeni bir önbellek oluşturulacak ve sonraki iş akışı çalıştırmalarında kullanılacaktır.

Göstermek gerekirse, diyelim ki `[`@std/log`](https://jsr.io/@std/log)` kütüphanesini kullanan bir projeniz var:

```ts
import * as log from "jsr:@std/log@0.224.5";
```

Bu sürümü artırmak için `import` ifadesini güncelleyebilir ve ardından önbelleği yeniden yükleyebilir ve kilit dosyasını yerel olarak güncelleyebilirsiniz:

```console
deno install --reload --lock=deno.lock --frozen=false --entrypoint deps.ts
```

Bunu çalıştırdıktan sonra kilit dosyasının içeriğinde değişiklikler görmelisiniz. Bu, taahhüt edildiğinde ve boru hattından geçirilirken, `hashFiles` işlevinin yeni bir önbellek kaydedip ardından gelecek tüm çalıştırmalarda kullanıldığını görmelisiniz.

#### Önbelleği temizleme

Zaman zaman, çeşitli nedenlerden ötürü bozulmuş veya hatalı bir önbellekle karşılaşabilirsiniz. GitHub Actions UI'sinden bir önbelleği temizlemek mümkündür veya basitçe önbellek anahtarının adını değiştirebilirsiniz. Ön bellek anahtarında değişiklik yapmak için zorlayıcı olarak kilit dosyasını değiştirmenize gerek kalmadan, anahtar ismine bir değişken eklemek pratik bir yöntemdir; bu, bir GitHub gizlisi olarak saklanabilir ve yeni bir önbelleğe ihtiyaç duyulduğunda değiştirilebilir:

```yaml
key: ${{ secrets.CACHE_VERSION }}-${{ hashFiles('deno.lock') }}
```