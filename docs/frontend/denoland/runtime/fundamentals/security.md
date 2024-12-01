---
title: "Güvenlik ve izinler"
description: Deno'nun güvenlik modeli ve izin sisteminin temel ilkeleri üzerine bilgi sağlayarak, geliştiricilere güvenli kod yürütme pratiği konusunda rehberlik eder. İzinleri yönetmek için kullanılabilecek komut satırı bayrakları ve bu bayrakların kullanımı açıklanmaktadır.
keywords: [Deno, güvenlik, izinler, kod yürütme, komut satırı bayrakları]
---

Deno, varsayılan olarak güvenlidir. Özellikle etkinleştirmediğiniz sürece, Deno ile çalışan bir programın dosya sistemi erişimi, ağ bağlantısı veya ortam erişimi gibi hassas API'lere erişimi yoktur. Bu kaynaklara erişim iznini, komut satırı bayraklarıyla veya bir çalışma zamanı izin istemi ile açıkça vermeniz gerekmektedir. Bu, tüm sistem girdi/çıktısına tam erişimin otomatik olarak verildiği Node'dan önemli bir farktır ve bu durum projenize gizli güvenlik açıkları sokma potansiyeli taşımaktadır.

:::tip
Tamamen güvensiz kodu çalıştırmadan önce, aşağıdaki `kesimi okuyun`.
:::

## Temel İlkeler

İzinlerin ayrıntılarına dalmadan önce, Deno'nun güvenlik modelinin temel ilkelerini anlamak önemlidir:

- **Varsayılan olarak I/O erişimi yok**: Deno çalışma zamanında yürütülen kod, dosya sisteminde rastgele dosyaları okuma veya yazma, ağ istekleri yapma veya ağ dinleyicilerini açma, ortam değişkenlerine erişme veya alt süreçler başlatma hakkına sahip değildir.
- **Aynı ayrıcalık seviyesinde kod yürütmesi için sınırlama yok**: Deno, `eval`, `new Function`, dinamik içe aktarımlar ve web işçileri gibi birden fazla yol aracılığıyla herhangi bir kodun (JS/TS/Wasm) yürütülmesine izin verir; kodun nereden geldiği (ağ, npm, JSR vb.) ile ilgili çok az kısıtlama vardır.
- **Aynı uygulamanın birden fazla çağrısı verileri paylaşabilir**: Deno, yerleşik önbellekleme ve KV depolama API'leri aracılığıyla aynı uygulamanın birden fazla çağrısının veri paylaşmasına olanak tanır. Farklı uygulamalar birbirlerinin verilerini göremez.
- **Aynı iş parçacığında yürütülen tüm kod aynı ayrıcalık seviyesini paylaşır**: Aynı iş parçacığında yürütülen tüm kod, aynı ayrıcalık seviyesini paylaşır. Farklı modüllerin aynı iş parçacığı içinde farklı ayrıcalık seviyelerine sahip olması mümkün değildir.
- **Kod, kullanıcı onayı olmadan ayrıcalıklarını yükseltemez**: Deno çalışma zamanında yürütülen kod, kullanıcıdan etkileşimli bir istem veya bir çağrı anı bayrağı aracılığıyla açıkça bir yükseltme izni almadığı sürece ayrıcalıklarını yükseltemez.

> Deno çalışma zamanı, güvenli bir yürütme ortamı sağlamayı hedefler. 
> — Deno belgeleri

- **İlk statik modül grafiği yerel dosyaları sınırlama olmaksızın içe aktarabilir**: İlk statik modül grafiğinde içe aktarılan tüm dosyalar sınırlama olmaksızın içe aktarılabilir, bu nedenle o dosya için açık bir okuma izni verilmemiş olsa bile. Bu durum dinamik modül içe aktarımları için geçerli değildir.

Bu temel ilkeler, bir kullanıcının, ev sahibi makineye veya ağa zarar vermeden kodu yürütmesine olanak tanıyan bir ortam sağlamayı hedefler. Güvenlik modeli, anlaşılması kolay olacak şekilde tasarlanmış ve çalışma zamanı ile içindeki yürütülen kod arasında net bir ayrım sağlamayı amaçlar. Güvenlik modeli Deno çalışma zamanı tarafından uygulanır ve altında yatan işletim sistemine bağlı değildir.

---

## İzinler

Varsayılan olarak, çoğu sistem I/O erişimi reddedilir. Ancak, varsayılan olarak bile sınırlı kapasitelerde izin verilen bazı I/O işlemleri vardır. Bunlar aşağıda açıklanmıştır.

Bu işlemleri etkinleştirmek için kullanıcı, Deno çalışma zamanına açıkça izin vermelidir. Bunu `deno` komutuna `--allow-read`, `--allow-write`, `--allow-net`, `--allow-env` ve `--allow-run` bayraklarını geçirerek yapar.

### Dosya sistemi erişimi

```sh
# Dosya sisteminden tüm okumalara izin ver
deno run -R script.ts
# veya 
deno run --allow-read script.ts
```

Deno'daki bazı API'ler, dosya sistemi işlemleri kullanılarak uygulanmıştır, ancak belirli dosyalara doğrudan okuma/yazma erişimi sağlamazlar. Bu API'ler, diske okuma ve yazma işlemleri yapar ama herhangi bir açık okuma/yazma izni gerektirmez. Bu API'lere bazı örnekler şöyledir:

- `localStorage`
- Deno KV
- `caches`
- `Blob`

---

### Ağ erişimi

Varsayılan olarak, yürütülen kod ağ istekleri yapamaz, ağ dinleyicileri açamaz veya DNS çözümlemesi gerçekleştiremez. Bu, HTTP istekleri yapmayı, TCP/UDP soketleri açmayı ve TCP veya UDP üzerinde gelen bağlantıları dinlemeyi içerir.

Ağ erişimi, `--allow-net` bayrağı ile verilir. Bu bayrak, belirli ağ adreslerine erişime izin vermek için bir IP adresi veya ana bilgisayar adı listesiyle belirtilebilir.

```sh
# Ağ erişimine izin ver
deno run -N script.ts
# veya
deno run --allow-net script.ts
```

---

### Ortam değişkenleri

Varsayılan olarak, yürütülen kod ortam değişkenlerini okuyamaz veya yazamaz. Bu, ortam değişkenlerini okumayı ve yeni değerler ayarlamayı içerir.

Ortam değişkenlerine erişim, `--allow-env` bayrağı ile verilmektedir. Bu bayrak, belirli ortam değişkenlerine erişime izin vermek için bir ortam değişkeni listesi ile belirtilebilir.

```sh
# Tüm ortam değişkenlerine erişime izin ver
deno run -E script.ts
# veya
deno run --allow-env script.ts
```

---

### Sistem Bilgileri

Varsayılan olarak, yürütülen kod sistem bilgilerine, işletim sistemi sürümüne, sistem çalışma süresine, yük ortalamasına, ağ arayüzlerine ve sistem bellek bilgilerine erişemez.

Sistem bilgilerine erişim, `--allow-sys` bayrağı ile verilmektedir. Bu bayrak, aşağıdaki listeden izin verilen arayüzlerle belirtilebilir: `hostname`, `osRelease`, `osUptime`, `loadavg`, `networkInterfaces`, `systemMemoryInfo`, `uid` ve `gid`. 

```sh
# Tüm sistem bilgi API'lerine izin ver
deno run -S script.ts
# veya
deno run --allow-sys script.ts
```

---

### Alt süreçler

Deno çalışma zamanında yürütülen kod, varsayılan olarak alt süreçler başlatamaz; çünkü bu, kodun kullanıcı onayı olmadan ayrıcalıklarını yükseltmesi ilkesini ihlal eder.

Deno, alt süreçleri çalıştırma mekanizması sağlar; ancak bu, kullanıcıdan açıkça izin alınmasını gerektirir. Bu, `--allow-run` bayrağı ile yapılır.

```sh
# Tüm alt süreçlerin çalıştırılmasına izin ver
deno run --allow-run script.ts
```

:::warning
Muhtemelen ebeveyn sürecin `--allow-all` verisi yoksa, `--allow-run=deno` kullanmak istemezsiniz; çünkü bir `deno` süreci başlatma yeteneği, script'in tam yetkilere sahip bir başka `deno` süreci başlatmasına yol açabilir.
:::

---

### FFI

Deno, Deno çalışma zamanı içinde Rust, C ya da C++ gibi diğer dillerde yazılmış kodu yürütmek için bir mekanizma sağlar. 

FFI'de hem `Deno.dlopen` hem de NAPI yerel eklentileri, `--allow-ffi` bayrağı ile açıkça izin gerektirir.

```sh
# Tüm dinamik kütüphaneleri yüklemeye izin ver
deno run --allow-ffi script.ts
```

---

### Web’den İçe Aktarma

Web’den kod içe aktarmaya izin verin. Varsayılan olarak, Deno içe aktarılabilecek ana bilgisayarları sınırlamaktadır. 

```sh
# `https://example.com` adresinden kod içe aktarmaya izin ver
deno run --allow-import=example.com main.ts
```

---

## Kodun Değerlendirilmesi

Deno, aynı ayrıcalık seviyesindeki kodun yürütülmesi üzerinde herhangi bir sınırlama koymaz. Bu, bir Deno çalışma zamanında yürütülen kodun `eval`, `new Function` veya dinamik içe aktarma gibi yöntemlerle **rastgele** kodu yürütmesine izin verir.

## Güvensiz Kodu Yürütme

Deno, ev sahibi makineyi ve ağı zarardan korumayı amaçlayan güvenlik özellikleri sunsa da, güvensiz kod hâlâ korkutucudur. Güvensiz kodu yürütürken, birden fazla savunma katmanına sahip olmak önemlidir. Güvensiz kodu yürütme sırasında dikkate almanız gereken önemli noktalar:

- `deno`'yu sınırlı izinlerle çalıştırın ve gerçekten hangi kodun çalışması gerektiğini önceden belirleyin. 
- `chroot`, `cgroups`, `seccomp` gibi işletim sistemi tarafından sağlanan kumanda mekanizmalarını kullanın.
- Bir VM veya MicroVM (gVisor, Firecracker vb.) gibi bir kumanda ortamı kullanın.