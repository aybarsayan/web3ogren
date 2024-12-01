---
title: "Web Platform Test"
description: Deno, Web Platform Testler için özel bir test çalıştırıcısı sağlar. Bu belgede WPT testlerini nasıl çalıştıracağınız ve beklentileri güncelleyebileceğiniz hakkında bilgi bulunmaktadır.
keywords: [WPT, Deno, web platform testleri, test çalıştırıcısı, beklentiler güncelleme]
oldUrl: /runtime/manual/references/contributing/web_platform_tests/
---

Deno, Web Platform Testler için özel bir test çalıştırıcısı kullanır. Bu, `./tools/wpt.ts` dosyasında bulunabilir.

## Testleri Çalıştırma

> Eğer Windows kullanıyorsanız veya sisteminiz hashbang'leri desteklemiyorsa, tüm `./tools/wpt.ts` komutlarını şu şekilde başlayın: `deno run --unstable --allow-write --allow-read --allow-net --allow-env --allow-run`.

WPT testlerini ilk kez çalıştırmadan önce, lütfen WPT kurulumunu gerçekleştirin. Ayrıca, `./test_util/wpt` alt modülü her güncellendiğinde bu komutu çalıştırmalısınız:

```shell
./tools/wpt.ts setup
```

Tüm mevcut web platform testlerini çalıştırmak için aşağıdaki komutu çalıştırın:

```shell
./tools/wpt.ts run

# Hangi test dosyalarının çalıştırılacağını filtrelemek için filtreleri belirtebilirsiniz:
./tools/wpt.ts run -- streams/piping/general hr-time
```

:::tip
Test çalıştırıcısı her web platform testini çalıştıracak ve durumunu (başarısız veya başarılı) kaydedecektir.
:::

Ardından, bu çıktıyı `./tools/wpt/expectation.json` dosyasında belirtilen her testin beklenen çıktısıyla karşılaştıracaktır. Bu dosya, `./test_utils/wpt` dizinini yansıtan iç içe geçmiş bir JSON yapısıdır. Her test dosyası için, tamamının geçmesi gerektiğini (tüm testler geçiyor, `true`), tamamının başarısız olması gerektiğini (test çalıştırıcısı bir test dışındaki bir istisna ile karşılaşıyor veya tüm testler başarısız, `false`) veya hangi testlerin başarısız olmasını beklediğini tanımlar (test durum adlarının bir dize dizisi).

## Etkin testleri veya beklentileri güncelleme

`./tools/wpt/expectation.json` dosyasını manuel olarak, JSON yapısındaki her test dosyası girişinin değerini değiştirerek güncelleyebilirsiniz. Alternatif ve tercih edilen seçenek, WPT çalıştırıcısının tüm testleri veya filtrelenmiş bir alt kümesini çalıştırmasını sağlamak ve ardından `expectation.json` dosyasını mevcut duruma uyacak şekilde otomatik olarak güncellemektir. Bunu `./wpt.ts update` komutuyla yapabilirsiniz. Örnek:

```shell
./tools/wpt.ts update -- hr-time
```

> Bu komutu çalıştırdıktan sonra, `expectation.json` dosyası, çalıştırılan tüm testlerin mevcut çıktısıyla eşleşecektir. Bu, `wpt.ts run` komutunu hemen ardından bir `wpt.ts update` çalıştırıldığında her zaman başarılı olacağı anlamına gelir.

## Alt Komutlar

### `setup`

Çevrenizin doğru yapılandırıldığını doğrular veya yapılandırmanıza yardımcı olur. Bu, python3'ün (Windows'ta `python.exe`) gerçekten Python 3 olup olmadığını kontrol edecektir.

:::note
Davranışı özelleştirmek için aşağıdaki bayrakları belirtebilirsiniz:
:::

```console
--rebuild
    İndirmek yerine manifesti yeniden oluşturun. Bu 3 dakikaya kadar sürebilir.

--auto-config
    /etc/hosts yapılandırılmamışsa otomatik olarak yapılandırır (hiçbir istem gösterilmeyecek).
```

### `run`

Tüm testleri `expectation.json`'da belirtildiği gibi çalıştırır.

:::info
Davranışı özelleştirmek için aşağıdaki bayrakları belirtebilirsiniz:
:::

```console
--release
    ./target/release/deno ikilisini kullanın, ./target/debug/deno yerine

--quiet
    `ok` test durumlarının yazdırılmasını devre dışı bırakır.

--json=<file>
    Test sonuçlarını belirtilen dosyaya JSON olarak çıktılar.
```

Tam olarak hangi testlerin çalıştırılacağını belirtmek için `--`'dan sonra bir veya daha fazla filtre belirtebilirsiniz:

```console
./tools/wpt.ts run -- hr-time streams/piping/general
```

### `update`

`expectation.json` dosyasını mevcut duruma uyacak şekilde günceller.

:::warning
Davranışı özelleştirmek için aşağıdaki bayrakları belirtebilirsiniz:
:::

```console
--release
    ./target/release/deno ikilisini kullanın, ./target/debug/deno yerine

--quiet
    `ok` test durumlarının yazdırılmasını devre dışı bırakır.

--json=<file>
    Test sonuçlarını belirtilen dosyaya JSON olarak çıktılar.
```

Tam olarak hangi testlerin çalıştırılacağını belirtmek için `--`'dan sonra bir veya daha fazla filtre belirtebilirsiniz:

```console
./tools/wpt.ts update -- hr-time streams/piping/general
```

## SSS

### wpt alt modülünü güncelleme:

```shell
cd test_util/wpt/
git fetch origin
git checkout origin/epochs/daily
cd ../../
git add ./test_util/wpt
```

> Tüm katkı sağlayıcıların bundan sonra `./tools/wpt.ts setup` komutunu yeniden çalıştırmaları gerekecek.

WPT'yi güncellemek genellikle beklentileri, tüm yukarı akış değişikliklerini kapsayacak şekilde güncellemeyi gerektirdiğinden, bunu ayrı bir PR olarak yapmak, bir hata veya özellik gerçekleştiren bir PR ile birlikte yapmak yerine daha iyidir.