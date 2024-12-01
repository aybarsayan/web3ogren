---
description: Bu belge, kullanıcıların kısayol tuşları ile komutları nasıl etkin bir şekilde kullanacaklarını ve imleç yönetimini anlamalarına yardımcı olur.
keywords: [kısayol tuşları, kullanıcı girişi, komut yönetimi, imleç taşıma, seçim komutları]
---

# Enquirer Kısayol Tuşları

## Tüm komutlar

Bu tuş kombinasyonları, tüm komutlarla birlikte kullanılabilir.

| **komut**                       | **açıklama**                          |
| ------------------------------- | ------------------------------------ |
| ctrl  +  c | Komutu iptal et.                    |
| ctrl + g   | Komutu başlangıç durumuna sıfırla.  |



## İmleci Taşı

Bu kombinasyonlar, kullanıcı girişini destekleyen komutlarda kullanılabilir (örn. `giriş komutu`, `şifre komutu` ve `görünmez komut`).

| **komut**                     | **açıklama**                            |
| ------------------------------ | -------------------------------------- |
| sol                | İmleci bir karakter geri alın.          |
| sağ                | İmleci bir karakter ileri alın.         |
| ctrl + a | İmleci satırın başına götür             |
| ctrl + e | İmleci satırın sonuna götür             |
| ctrl + b | İmleci bir karakter geri alın            |
| ctrl + f | İmleci bir karakter ileri alın           |
| ctrl + x | İlk pozisyon ile imleç pozisyonu arasında geçiş yap |



:::tip
İmleci taşırken dikkatli olun, yanlış bir hareket verilerinizi etkileyebilir.
:::

## Girişi Düzenle

Bu tuş kombinasyonları, kullanıcı girişini destekleyen komutlarda kullanılabilir (örn. `giriş komutu`, `şifre komutu` ve `görünmez komut`).

| **komut**                     | **açıklama**                            |
| ------------------------------ | -------------------------------------- |
| ctrl + a | İmleci satırın başına götür             |
| ctrl + e | İmleci satırın sonuna götür             |
| ctrl + b | İmleci bir karakter geri alın            |
| ctrl + f | İmleci bir karakter ileri alın           |
| ctrl + x | İlk pozisyon ile imleç pozisyonu arasında geçiş yap |



| **komut (Mac)**                 | **komut (Windows)**            | **açıklama**                                                                                                                         |
| -------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| sil                   | backspace             | Soldan bir karakter sil.                                                                                                             |
| fn + sil   | sil                | Sağdan bir karakter sil.                                                                                                             |
| option + yukarı   | alt + yukarı   | Geçmişteki önceki öğeye kaydır (`Giriş komutu` yalnızca, `geçmiş etkin olduğunda`).    |
| option + aşağı | alt + aşağı | Geçmişteki bir sonraki öğeye kaydır (`Giriş komutu` yalnızca, `geçmiş etkin olduğunda`).|

## Seçenekleri Seç

Bu tuş kombinasyonları, *birden fazla* seçeneği destekleyen komutlarda kullanılabilir. Örneğin `çoklu seçim komutu` veya `multiple` seçeneği true olduğunda `seçim komutu`.

| **komut**        | **açıklama**                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| boşluk  | `options.multiple` true olduğunda, mevcut seçimi geçersiz kıl.                                            |
| numara | Verilen indeks konumundaki seçeneğe kaydır. Ayrıca `options.multiple` true olduğunda, seçilen seçeneği geçersiz kılar. |
| a      | Tüm seçenekleri etkinleştir veya devre dışı bırak.                                                       |
| i      | Mevcut seçimlerin tersini al.                                                                           |
| g      | Mevcut seçim grubunu geçersiz kıl.                                                                      |



:::info
Seçeneklerle çalışırken, hangi seçeneklerin aktif olduğuna dikkat edin.
:::

## Seçenekleri Gizle/Göster

| **komut**                     | **açıklama**                               |
| ----------------------------- | ------------------------------------------- |
| fn + yukarı   | Görünür seçenek sayısını bir azalt.          |
| fn + aşağı | Görünür seçenek sayısını bir artır.          |



## İmleci Taşı/Kilitle

| **komut**                        | **açıklama**                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| numara               | Verilen indeks konumundaki seçeneğe kaydır. Ayrıca `options.multiple` true olduğunda, seçilen seçeneği geçersiz kılar. |
| yukarı               | İmleci yukarı taşı.                                                                                                |
| aşağı                | İmleci aşağı taşı.                                                                                                 |
| ctrl + a  | İmleci ilk *görünür* seçeneğe taşı.                                                                              |
| ctrl + e  | İmleci son *görünür* seçeneğe taşı.                                                                              |
| shift + yukarı   | İmleç pozisyonunu değiştirmeden bir seçeneği yukarı kaydır (kaydırma sırasında imleci kilitler).                     |
| shift + aşağı | İmleç pozisyonunu değiştirmeden bir seçeneği aşağı kaydır (kaydırma sırasında imleci kilitler).                     |



| **komut (Mac)**                | **komut (Windows)** | **açıklama**                                            |
| ------------------------------- | -------------------- | ------------------------------------------------------- |
| fn + sol  | ana sayfa       | İmleci seçenekler dizisindeki ilk seçeneğe taşı.        |
| fn + sağ | son          | İmleci seçenekler dizisindeki son seçeneğe taşı.       |