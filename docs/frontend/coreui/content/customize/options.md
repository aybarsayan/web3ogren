---
layout: docs
title: Seçenekler
description: Bootstrap için CoreUI'yi, stil ve davranışı kontrol etmek için global CSS tercihlerini kolayca geçiştiren yerleşik değişkenlerle hızlı bir şekilde özelleştirin. Bu sayfa, her bir değişkenin değerlerini ve etkilerini detaylı bir şekilde anlatmaktadır.
keywords: [CoreUI, Bootstrap, CSS değişkenleri, özelleştirme, Sass]
---

CoreUI'yi Bootstrap için, yerleşik özel değişkenler dosyamızla özelleştirin ve yeni `$enable-*` Sass değişkenleri ile global CSS tercihlerini kolayca geçiştirme imkanına sahip olun. Bir değişkenin değerini geçersiz kılın ve gerektiğinde `npm run test` ile yeniden derleyin.

:::info
Bu değişkenleri, CoreUI için Bootstrap'ın `scss/_variables.scss` dosyasında ana global seçenekler için bulabilir ve özelleştirebilirsiniz.
:::


| Değişken                       | Değerler                             | Açıklama                                                                            |
| ------------------------------ | ---------------------------------- | -------------------------------------------------------------------------------------- |
| `$spacer`                      | `1rem` (varsayılan), ya da 0'dan büyük herhangi bir değer | Varsayılan boşluk değerini belirtir ve programatik olarak `spacer utilities` oluşturur. |
| `$enable-dark-mode`            | `true` (varsayılan) veya `false`        | Proje ve bileşenler genelinde yerleşik `karanlık mod desteğini` etkinleştirir. |
| `$enable-rounded`              | `true` (varsayılan) veya `false`        | Çeşitli bileşenlerde önceden tanımlanmış `border-radius` stillerini etkinleştirir. |
| `$enable-shadows`              | `true` veya `false` (varsayılan)        | Çeşitli bileşenlerde önceden tanımlanmış dekoratif `box-shadow` stillerini etkinleştirir. Odak durumları için kullanılan `box-shadow`'ları etkilemez. |
| `$enable-gradients`            | `true` veya `false` (varsayılan)        | Çeşitli bileşenlerde `background-image` stilleri aracılığıyla önceden tanımlanmış gradyanları etkinleştirir. |
| `$enable-transitions`          | `true` (varsayılan) veya `false`        | Çeşitli bileşenlerde önceden tanımlanmış `transition`'ları etkinleştirir. |
| `$enable-reduced-motion`       | `true` (varsayılan) veya `false`        | Kullanıcıların tarayıcı/işletim sistemi tercihlerine dayalı olarak belirli animasyonları/geçişleri bastıran `prefers-reduced-motion` medya sorgusu` etkinleştirir. |
| `$enable-grid-classes`         | `true` (varsayılan) veya `false`        | Izgara sistemi için CSS sınıflarının (örn. `.row`, `.col-md-1`, vb.) oluşturulmasını etkinleştirir. |
| `$enable-container-classes`    | `true` (varsayılan) veya `false`        | Yerleşim konteynerleri için CSS sınıflarının oluşturulmasını etkinleştirir. (v4.2.6'da yeni) |
| `$enable-caret`                | `true` (varsayılan) veya `false`        | `.dropdown-toggle` üzerinde sahte öğe imleci etkinleştirir. |
| `$enable-button-pointers`      | `true` (varsayılan) veya `false`        | Devre dışı bırakılmamış buton öğelerine "el" imleci ekler. |
| `$enable-rfs`                  | `true` (varsayılan) veya `false`        | Global olarak `RFS` etkinleştirir. |
| `$enable-validation-icons`     | `true` (varsayılan) veya `false`        | Metin girişleri ve bazı özel formlar içinde doğrulama durumları için `background-image` simgelerini etkinleştirir. |
| `$enable-negative-margins`     | `true` veya `false` (varsayılan)        | `Negatif kenar boşluğu yardımcıları` oluşturulmasını etkinleştirir. |
| `$enable-deprecation-messages` | `true` (varsayılan) veya `false`        | `v6`'da kaldırılması planlanan herhangi bir geçersiz kılınmış mixin ve işlevi kullanırken uyarıları gizlemek için `false` olarak ayarlayın. |
| `$enable-important-utilities`  | `true` (varsayılan) veya `false`        | Yardımcı sınıflarda `!important` takısını etkinleştirir. |
| `$enable-smooth-scroll`        | `true` (varsayılan) veya `false`        | Kullanıcıların `prefers-reduced-motion` medya sorgusu` aracılığıyla azalmış hareket talep etmediği sürece global olarak `scroll-behavior: smooth` uygular. |
| `$enable-ltr`                  | `false` veya `false` (varsayılan)       | Soldan Sağa etkinleştirir |
| `$enable-rtl`                  | `true` (varsayılan) veya `false`        | Sağdan Sola etkinleştirir |
