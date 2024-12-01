---
title: Strapi Dosya Yapısı
description: Strapi dosya yapısı hakkında bilgi ve dosya sağlayıcılarının nasıl çalıştığına dair detaylar sunulmaktadır. Bu doküman, Strapi ile veri kontrolü ve transferine yönelik rehber işlevi görmektedir.
keywords: [Strapi, dosya yapısı, veri transferi, JSON Lines, yapılandırma, metadata, sağlayıcılar]
---

# Strapi Dosya Yapısı

Strapi dosya sağlayıcıları, içsel olarak POSIX tarzı dosya yollarını kullanan, isteğe bağlı olarak gzip ile sıkıştırılmış ve/veya 'aes-128-ecb' ile şifrelenmiş bir .tar dosyası bekler. Dosya yapısı aşağıdaki gibidir:

```
./
configuration
entities
links
metadata.json
schemas

./configuration:
configuration_00001.jsonl

./entities:
entities_00001.jsonl

./links:
links_00001.jsonl

./schemas:
schemas_00001.jsonl
```

## metadata.json

Bu dosya, verilerin orijinal kaynağı hakkında metadata sağlar. En azından, bir createdAt zaman damgası ve dosyanın oluşturulduğu Strapi sürümünü içermelidir (uyumluluk kontrolleri için).

```json
{
  "createdAt": "2023-06-26T07:31:20.062Z",
  "strapi": {
    "version": "4.11.2"
  }
}
```

:::info
**Önemli Not:** metadata.json dosyasında yer alan bilgiler, verilerin yönetimi ve sürekliliği açısından kritik öneme sahiptir.
:::

## Her veri aşaması için bir dizin

Her veri aşaması için sıralı numaralandırılmış JSON Lines (.jsonl) dosyalarını içeren bir dizin de olmalıdır.

Dosyalar, şu formatta adlandırılır: `{stage}\{stage}_{5-haneli sıra numarası}.jsonl`

Her aşama için istenilen sayıda dosya sağlanabilir, yeter ki sıra numaraları sıralı olsun. Yani, önce 00001 okunduktan sonra, dosya sağlayıcısı 00002 dosyasını okumaya çalışacak ve eğer bulunamazsa, aşamanın tamamlandığını kabul edecektir.

### JSONL dosyaları

> JSON Lines dosyaları, temel olarak JSON dosyalarıdır. Ancak yeni satır karakterleri JSON nesnelerini ayırmak için kullanılır.  
> — JSON Veri Yönetimi

:::tip
JSON Lines formatı sayesinde, büyük veri setleri bellekte tutulmadan etkin bir şekilde işlenebilir.
:::


JSONL Dosyalarının Avantajları
- **RAM Kullanımını Azaltır:** Dosyaların tamamı yerine satır satır okuma yapılır.
- **Esneklik:** Herhangi bir miktarda veri içeren dosyaların okunmasına olanak tanır.
- **Verimlilik:** Transfer sırasında belleğe yükleme gereksinimini ortadan kaldırır.
