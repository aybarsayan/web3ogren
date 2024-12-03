---
title: Komut Satırı Kullanımı
seoTitle: Rippled Komut Satırı Kullanım Kılavuzu
sidebar_position: 4
description: Rippled sunucusu için komut satırı kullanım seçeneklerini açıklanır. Farklı modlarda nasıl çalıştırılacağına dair bilgiler içerir.
tags: 
  - rippled
  - komut satırı
  - daemon modu
  - istemci modu
  - bağımsız mod
  - birim testleri
keywords: 
  - rippled
  - komut satırı
  - daemon modu
  - istemci modu
  - bağımsız mod
  - birim testleri
---

# Komut Satırı Kullanımı

`rippled` çalıştırılabilir dosyası genellikle XRP Ledger'ı güçlendiren bir daemon olarak çalışır, ancak diğer modlarda da çalışabilir. **Bu sayfa**, komut satırından çalıştırıldığında `rippled`'e geçirebileceğiniz tüm seçenekleri açıklar.

## Mevcut Modlar

- **Daemon Modu** - Varsayılan. İşlemleri işlemek ve bir defter veri tabanı oluşturmak için XRP Ledger'a bağlanır.
- **Bağımsız Mod** - `-a` veya `--standalone` seçeneğini kullanın. Daemon moduna benzer, ancak diğer sunuculara bağlanmaz. Bu modu **işlem işleme veya diğer özellikleri test etmek için** kullanabilirsiniz.
- **İstemci Modu** - Başka bir `rippled` sunucusuna JSON-RPC istemcisi olarak bağlanmak için bir API yöntem adı belirtin, ardından çıkın. Bu, çalıştırılabilir dosyanın başka bir işleme göre zaten çalışıp çalışmadığını kontrol etmek için sunucu durumu ve defter verilerini sorgulamak için kullanılabilir.
- **Diğer Kullanım** - Aşağıdaki komutların her biri `rippled` çalıştırılabilir dosyasının bazı bilgileri yazdırmasını sağlar, ardından çıkar:
    - **Yardım** - Kullanım ifadesini yazdırmak için `-h` veya `--help` kullanın.
    - **Birim Testleri** - Birim testlerini çalıştırmak ve sonuçların bir özetini yazdırmak için `-u` veya `--unittest` kullanın. Bu, `rippled`'i başarılı bir şekilde derlediğinizi doğrulamak için yardımcı olabilir.
    - **Sürüm ifadesi** - `rippled`'in sürüm numarasını yazdırması için `--version` kullanın, ardından çıkın.

## Genel Seçenekler

Bu seçenekler çoğu moda uygulanır:

| Seçenek            | Açıklama                                                |
|:------------------|:---------------------------------------------------------|
| `--conf {FILE}`   | `{FILE}`'ı varsayılan konumlarda konfigürasyon dosyaları aramak yerine konfigürasyon dosyası olarak kullanın. Belirtilmemişse, `rippled` önce yerel çalışma dizininde `rippled.cfg` dosyasını kontrol eder. Linux'ta, bu dosya bulunamazsa, `rippled` ardından `$XDG_CONFIG_HOME/ripple/ripple.cfg` için kontrol eder. (Genellikle `$XDG_CONFIG_HOME` `$HOME/.config` ile eşleşir.) |

---

### Ayrıntılı Seçenekler

Aşağıdaki genel seçenekler, standart çıkış ve günlük dosyalarına yazılan bilgi miktarını etkiler:

| Seçenek      | Kısa Versiyon | Açıklama                                   |
|:------------|:---------------|:-------------------------------------------|
| `--debug`   |                | **KALDIRILDI** İzleme düzeyinde hata ayıklamayı etkinleştirir ( `--verbose` alias). Bunun yerine [log_level method][] kullanın. |
| `--silent`  |                | Başlangıçta standart çıkış ve standart hata günlüklerine yazma. Artan günlükleme azaltmak için `rippled`'i bir systemd birimi olarak başlatırken önerilir. |
| `--verbose` | `-v`           | **KALDIRILDI** İzleme düzeyinde hata ayıklamayı etkinleştirir. Bunun yerine [log_level method][] kullanın. |

## Daemon Modu Seçenekleri

```bash
rippled [OPTIONS]
```

Daemon modu `rippled` için varsayılan çalışma modudur. `Genel Seçenekler`'e ek olarak, aşağıdakilerden herhangi birini sağlayabilirsiniz:

| Seçenek              | Açıklama                                            |
|:----------------------|:----------------------------------------------------|
| `--fg`                | Daemon'ı ön planda tek bir süreç olarak çalıştırın. Aksi takdirde, `rippled` bir monitör olarak çalışan ilk süreç için daemon'ın ikinci bir sürecini fork'lar. |
| `--import`            | Tam olarak başlamadan önce, başka bir `rippled` sunucusunun defter deposundan defter verilerini içe aktarın. Konfigürasyon dosyasında geçerli bir `[import_db]` dizesinin bulunmasını gerektirir. |
| `--newnodeid`        | Sunucu için rastgele bir düğüm kimliği oluşturun. |
| `--nodeid {VALUE}`    | Bir düğüm kimliği belirtin. `{VALUE}` ayrıca sunucuyu çalıştıran konteyner veya donanımla ilişkili bir parametre olabilir, örneğin `$HOSTNAME`. |
| `--nodetoshard`       | Tam olarak başlamadan önce, defter deposundaki tamamlanmış `tarih parçalarını` parça deposuna kopyalayın, parça deposunun yapılandırılmış maksimum disk alanına kadar. Büyük miktarda CPU ve I/O kullanır. :::warning Dikkat: Bu komut verileri kopyalar (taşımak yerine), bu nedenle hem parça deposunda hem de defter deposunda verileri depolamak için yeterli disk alanına sahip olmalısınız. ::: |
| `--quorum {QUORUM}`  | Bu seçenek `test ağları` başlatmak için tasarlanmıştır. `{QUORUM}` güvenilir doğrulayıcıların bir anlaşma gerektirmesiyle doğrulama için minimum oybirliğini geçersiz kılın. Varsayılan olarak, doğrulama için oybirliği güvenilir doğrulayıcıların sayısına bağlı güvenli bir sayıyla otomatik olarak ayarlanır. Eğer bazı doğrulayıcılar çevrimiçi değilse, bu seçenek normalden daha düşük bir oybirliği ile ilerlemeye olanak tanıyabilir. **Uyarı:** Oybirliğini elle ayarlarsanız, ağın geri kalanından sapmaması için fazla düşük olabilir. Bu seçeneği yalnızca konsensüs konusunda derin bir anlayışa sahip olduğunuzda ve standart dışı bir yapılandırmayı kullanma ihtiyacı varsa kullanın. |

---

Aşağıdaki seçenek kaldırılmıştır: `--validateShards`. badge href="https://github.com/XRPLF/rippled/releases/tag/1.7.0Kaldırıldı: rippled 1.7.0/badge %}

## Bağımsız Mod Seçenekleri

```bash
rippled --standalone [OPTIONS]
rippled -a [OPTIONS]
```
`bağımsız modda` çalıştırın. Bu modda, `rippled` ağa bağlanmaz veya konsensüs gerçekleştirir. (Aksi halde, `rippled` daemon modunda çalışır.)

## İlk Defter Seçenekleri

Aşağıdaki seçenekler, başlatıldığında ilk hangi defterin yükleneceğini belirler. Bu seçenekler hata ayıklama ve ağlar başlatmak için tasarlanmıştır. Bu seçenekler hem bağımsız modda hem de ağ modunda çalışır. Varsayılan olarak, sunucu başlangıçta en son ağ tarafından doğrulanan defterin en son durumuna göre yerel olarak kaydedilen veriler ile eşler arası ağdan indirilen veriler karışımı kullanarak ilk defterini yükler.

| Seçenek                | Açıklama                                           |
|:----------------------|:---------------------------------------------------|
| `--ledger {LEDGER}`   | `{LEDGER}` (ya bir defter hash'i ya da defter indeksi) ile belirlenen defter sürümünü ilk defter olarak yükleyin. Belirtilen defter sürümü sunucunun defter deposunda bulunmalıdır. |
| `--ledgerfile {FILE}` | Belirtilen `{FILE}`'dan defter sürümünü yükleyin, bu dosya JSON formatında eksiksiz bir defter içermelidir. Böyle bir dosyaya örnek olarak sağlanan repo-link path="_api-examples/rippled-cli/ledger-file.json`ledger-file.json`/repo-link %}'e bakın. |
| `--load`              | İlk defteri yüklerken yalnızca disk üzerindeki defter deposunu kullanın. |
| `--net`               | İlk defteri yüklerken yalnızca ağdan verileri kullanın. |
| `--replay`            | Belirli bir defteri yeniden oynamak için `--ledger` ile birlikte kullanın. Sunucunuz, söz konusu defteri ve doğrudan atalarına zaten defter deposunda sahip olmalıdır. Önceki defteri bir temel olarak kullanarak, sunucu belirtilen defterdeki tüm işlemleri işleyerek belirtilen defteri yeniden oluşturur. Bir hata ayıklayıcı ile, belirli işlem işleme mantığını analiz etmek için kırılma noktaları ekleyebilirsiniz. |
| `--start`             | Varsayılan oylar temelinde, bilinen değişiklikler etkin olan yeni bir başlangıç defteri ile başlayın. Bu, değişikliklerin işlevselliğini hemen kullanımınıza sunar, böylece değişiklik sürecinin `Değişiklik Süreci` için iki hafta beklemek zorunda kalmazsınız. Ayrıca bakınız: `Bağımsız Modda Yeni Bir Başlangıç Defteri Başlatma`. |
| `--valid`             | Başlangıç defterini, ağla tamamen senkronize olmadan geçerli bir ağ defteri olarak değerlendirin. Bu, ağları başlatmak veya bir ağı bilinen bir önceki duruma geri döndürmek için kullanılabilir, yeter ki o ağın doğrulayıcılarının %80'i aynı defteri aynı zaman diliminde yüklesin. |

## İstemci Modu Seçenekleri

```bash
rippled [OPTIONS] -- {COMMAND} {COMMAND_PARAMETERS}
```

İstemci modunda, `rippled` çalıştırılabilir dosyası başka bir `rippled` hizmetine istemci olarak çalışır. (Hizmet, yerel olarak ayrı bir süreçte çalışan aynı çalıştırılabilir dosya olabilir veya başka bir sunucudaki `rippled` sunucusu olabilir.)

İstemci modunda çalıştırmak için, `rippled` API` yöntemlerinden birine ilişkin `komut satırı sözdizimi` sağlayın.

Bireysel komutların yanı sıra, istemci modu `Genel Seçenekler` ve aşağıdaki seçenekleri kabul eder:

| Seçenek                   | Açıklama                                        |
|:---------------------------|:------------------------------------------------|
| `--rpc`                    | Sunucunun istemci modunda çalışması gerektiğini açıkça belirtin. Gerekli değildir. |
| `--rpc_ip {IP_ADDRESS}`    | Belirtilen IP Adresindeki `rippled` sunucusuna bağlanın, isteğe bağlı olarak bir port numarası ekleyin. |
| `--rpc_port {PORT}`        | **KALDIRILDI** Belirtilen portta `rippled` sunucusuna bağlanın. Portu IP adresi ile birlikte `--rpc_ip` kullanarak belirtin. |

:::tip
Bazı argümanlar negatif sayılar olarak değer alabilir. API komutlarına yönelik argümanların seçenekler olarak yanlış yorumlanmadığından emin olmak için, komut adından önce `--` argümanını geçirin.
:::

Örnek kullanım (hesaba ait işlem geçmişini mevcut en eski ve en yeni defter versiyonlarından almak için):

```bash
rippled -- account_tx r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 -1 -1
```

## Birim Testleri

```bash
rippled --unittest [OPTIONS]
rippled -u [OPTIONS]
```

Birim testleri, `rippled` kaynak koduna yerleştirilen testleri çalıştırarak çalıştırılabilir dosyanın beklenildiği gibi çalışıp çalışmadığını onaylar. Birim testleri çalıştırıldıktan sonra, işlem bir özet sonuç gösterir ve çıkar. **Birim testleri**, yerleşik veri türleri ve işlem işleme rutinleri gibi işlevselliği kapsar.

> Eğer birim testleri bir hata rapor ederse, bu genellikle şu durumlardan birini gösterir:
> — `rippled` derlenirken bir sorun oluştu ve beklenildiği gibi çalışmıyor  
> — `rippled` kaynak kodunda bir hata bulunuyor  
> — Birim testinde bir hata bulunuyor veya yeni davranışları hesaba katacak şekilde güncellenmemiş  

Birim testleri çalıştırırken, `Genel Seçenekler`'i ve aşağıdaki seçenekleri belirtebilirsiniz:

| Seçenek                             | Kısa Versiyon | Açıklama             |
|:-------------------------------------|:--------------|:--------------------|
| `--unittest-ipv6`                    |               | Birim testleri çalıştırıldığında yerel sunucuya bağlanmak için [IPv6](https://en.wikipedia.org/wiki/IPv6) kullanın. Belirtilmemişse, birim testleri bunun yerine IPv4 kullanır. |
| `--unittest-jobs {NUMBER_OF_JOBS}`   |               | Belirtilen sayıda süreci birim testlerini çalıştırmak için kullanın. Bu, çok çekirdekli sistemlerde testlerin daha hızlı tamamlanmasını sağlayabilir. `{NUMBER_OF_JOBS}` pozitif bir tam sayı olarak kullanılmalıdır ve kullanılacak proses sayısını belirtir. |
| `--unittest-log`                     |               | Birim testleri `--quiet` ifadesi belirtilse bile günlüğe yazmasına izin verin. (Aksi takdirde, etkisi yoktur.) |
| `--quiet`                            | `-q`          | Birim testleri çalıştırılırken daha az teşhis mesajı yazdırın. |

### Belirli Birim Testleri

```bash
rippled --unittest={TEST_OR_PACKAGE_NAME}
```

Varsayılan olarak, `rippled` "manuel" olarak sınıflandırılmayan tüm birim testlerini çalıştırır. Bireysel bir testi çalıştırmak için ismini belirtebilir veya bir test paketinden belirli bir alt küme çalıştırabilirsiniz.

Testler, test durumu adıyla biten ve `.` karakterleri ile ayrılmış bir paket hiyerarisi içinde gruplanmıştır.

#### Birim Testlerini Yazdırma

```bash
rippled --unittest=print
```

`print` birim testi, mevcut testlerin bir listesini paketleri ile birlikte yazdıran özel bir durumdur.

#### Manuel Birim Testleri

Belirli birim testleri "manuel" olarak sınıflandırılmıştır çünkü tamamlanması uzun sürer. Bu testler, `print` birim testinin çıktısında `|M|` ile işaretlenmiştir. Manuel testler, tüm birim testlerini çalıştırdığınızda veya birim testlerinden bir paketi çalıştırdığınızda varsayılan olarak çalışmaz. Manuel testleri bireysel olarak, testin ismini belirterek çalıştırabilirsiniz. Örneğin:

```bash
$ ./rippled --unittest=ripple.tx.OversizeMeta
ripple.tx.OversizeMeta
En uzun süre alma:
   60.9s ripple.tx.OversizeMeta
60.9s, 1 paket, 1 durum, toplam 9016 test, 0 başarısız
```

#### Birim Testlerine Argüman Sağlama

Belirli manuel birim testleri bir argüman kabul eder. Argümanı aşağıdaki seçenekle verebilirsiniz:

| Seçenek                  | Açıklama                                        |
|:------------------------|:-------------------------------------------------|
| `--unittest-arg {ARG}`  | Geçerli olarak yürütülen birim testlerine `{ARG}` argümanını sağlayın. Her birim testi argüman kabul ederse kendi argüman formatını tanımlar. |

