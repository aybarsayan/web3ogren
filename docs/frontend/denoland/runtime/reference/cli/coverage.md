---
title: "deno coverage"
description: Deno coverage aracı, JavaScript ve TypeScript projeleri için kod kapsamını analiz etmenize yardımcı olur. Bu dökümantasyonda, dahil etme ve hariç tutma seçenekleri, çıkış formatları ve örnek uygulamalar ele alınmaktadır.
keywords: [Deno, coverage, kod kapsamı, JavaScript, TypeScript, lcov, html]
---

## Dahil Etmeler ve Hariç Tutmalar

Varsayılan olarak, coverage yerel dosya sisteminde bulunan kodların ve bunların
içe aktarımlarının hepsini içerir.

:::tip
Dahil etme ve hariç tutma seçeneklerini kişiselleştirirken, projelerinizde daha iyi kontrol sağlarsınız.
:::

`--include` ve `--exclude` seçeneklerini kullanarak dahillerinizi ve hariç
tutmalarınızı özelleştirebilirsiniz.

Yerel dosya sisteminde bulunmayan dosyaları dahil etmek için `--include`
seçeneğini kullanarak regex desenini özelleştirebilirsiniz.

```bash
deno coverage --include="^file:|https:"
```

Varsayılan dahil etme deseni çoğu kullanım durumu için yeterli olmalıdır, ancak
coverage raporunuzda hangi dosyaların dahil edileceği konusunda daha spesifik
olmak için bunu özelleştirebilirsiniz.

Adında `test.js`, `test.ts`, `test.jsx` veya `test.tsx` geçen dosyalar
varsayılan olarak hariç tutulur.

> "Bu, aşağıdakine eşdeğerdir:"  
> — Deno Dökümantasyonu

```bash
deno coverage --exclude="test\.(js|mjs|ts|jsx|tsx)$"
```

Bu varsayılan ayar, test kodunuzun coverage raporunuza katkıda bulunmasını
önler. Bir URL'nin eşleşmesi için dahil etme desenine uyması ve hariç tutma
desenine uymaması gerekir.

---

## Çıktı Formatları

Varsayılan olarak, Deno'nun kendi coverage formatını destekliyoruz - ancak
coverage raporlarınızı lcov formatında veya html formatında da çıktısını
alabilirsiniz.

```bash
deno coverage --lcov --output=cov.lcov
```

Bu lcov dosyası, lcov formatını destekleyen diğer araçlarla kullanılabilir.

```bash
deno coverage --html
```

Bu, bir coverage raporunu html dosyası olarak çıktısını alır.

:::info
lcov formatı, birçok farklı raporlama ve entegrasyon aracı ile uyumlu çalışmaktadır.
:::

---

## Örnekler

Çalışma alanınızdaki varsayılan coverage profilinden bir coverage raporu
oluşturun.

```bash
deno test --coverage
deno coverage
```

Özelleştirilmiş bir ad ile coverage profilinden bir coverage raporu
oluşturun.

```bash
deno test --coverage=custom_profile_name
deno coverage custom_profile_name
```

Belirli bir desene uyan coverage'ı yalnızca dahil edin - bu durumda,
yalnızca main.ts'den testleri dahil edin.

```bash
deno coverage --include="main.ts"
```

Varsayılan coverage profilinden test coverage'ını bir lcov dosyasına
aktarın.

```bash
deno test --coverage
deno coverage --lcov --output=cov.lcov
```


Ek Bilgiler

Daha fazla bilgi için Deno'nun resmi dökümantasyonuna başvurabilirsiniz.

