# Akıllı Sözleşme Adresleri

[//]: # (TODO, this is gpt)

TON Blockchain üzerinde her aktör, cüzdanlar ve akıllı sözleşmeler dahil, bir adres ile temsil edilir. Bu adresler, mesajlar ve işlemler almak ve göndermek için kritik öneme sahiptir. Akıllı sözleşme adresleri için iki ana format vardır: **ham adresler** ve **kullanıcı dostu adresler**.

## Adres Bileşenleri

TON'daki her adres iki ana bileşenden oluşur:

- **Workchain ID**: Sözleşmenin hangi iş zincirine ait olduğunu gösteren işaretli 32-bit tam sayı (örneğin, Masterchain için `-1` ve Basechain için `0`).
- **Account ID**: Sözleşme için benzersiz bir tanımlayıcı, genellikle Masterchain ve Basechain için 256 bit uzunluğundadır.

---

## Ham vs. Kullanıcı Dostu Adresler

### Ham Adres

Bir **ham adres** yalnızca temel öğeleri içerir:

- **Workchain ID** (örneğin, Masterchain için `-1`)
- **Account ID**: 256-bit benzersiz tanımlayıcı

**Örnek:**  
`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

:::warning
Ham adreslerin iki ana sorunu vardır:
1. Yerleşik hata kontrolü yoktur, bu da kopyalama hatalarının fon kaybına yol açabileceği anlamına gelir.
2. Bounceable/non-bounceable bayrakları gibi ek özellikleri desteklemezler.
:::

### Kullanıcı Dostu Adres

Bir **kullanıcı dostu adres**, şu özellikleri ekleyerek bu sorunları çözer:

1. **Bayraklar**: Adresin bounceable (sözleşmeler için) veya non-bounceable (cüzdanlar için) olduğunu gösterir.
2. **Checksum**: Hata kontrol mekanizması (CRC16), gönderimden önce hataları tespit etmeye yardımcı olur.
3. **Kodlama**: Ham adresi, base64 veya base64url kullanarak okunabilir ve kompakt bir forma dönüştürür.

**Örneğin**, aynı ham adres kullanıcı dostu bir adrese dönüştürülebilir:  
`kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny` (base64)

Kullanıcı dostu adresler, hataları önleyerek ve başarısız işlemlerde fonların iade edilmesini sağlayarak işlemleri daha güvenli hale getirir.

## Adres Durumları

TON üzerindeki her adres aşağıdaki durumlardan birinde olabilir:

- **Mevcut Değil**: Adresin verisi yok (tüm adresler için başlangıç durumu).
- **Başlatılmamış**: Adresin bakiyesi vardır ancak akıllı sözleşme kodu yoktur.
- **Aktif**: Adres, akıllı sözleşme kodu ve bakiyesiyle canlıdır.
- **Donmuş**: Adres, depolama maliyetleri bakiyesini aştığı için kilitlenmiştir.

---

## Adres Formatları Arasında Dönüştürme

:::tip
Ham ve kullanıcı dostu adresler arasında dönüştürmek için TON API'larını veya [ton.org/address](https://ton.org/address) gibi geliştirici araçlarını kullanabilirsiniz. Bu yardımcı programlar, sorunsuz dönüştürme sağlar ve işlemler gönderilmeden önce doğru biçimlendirmeyi garanti eder.
:::

Bu adreslerle nasıl başa çıkılacağı, kodlama örnekleri ve işlem güvenliği hakkında daha fazla detay için `Adresler Dokümantasyonu` tam kılavuzuna başvurabilirsiniz.

## Ayrıca Bakınız

* `Akıllı Sözleşmeler Adresleri Dokümantasyonu`