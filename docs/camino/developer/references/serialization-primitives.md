---
sidebar_position: 70
---

# Serilizasyon Primitifleri

, tüm iç veriler için basit, tutarlı ve zarif bir temsil kullanır. Bu belge, primitive türlerin Camino Ağı'ndaki nasıl kodlandığını açıklar. İşlemler, bu temel primitive türlere göre kodlanmaktadır.

## Bayt

Baytlar, mesaj yüküne olduğu gibi yerleştirilir.

Örnek:

```text
Paketleme:
    0x01
Sonuç:
    [0x01]
```

## Kısa

Kısa değerler, mesaj yüküne BigEndian formatında yerleştirilir.

Örnek:

```text
Paketleme:
    0x0102
Sonuç:
    [0x01, 0x02]
```

## Tamsayı

Tamsayılar, 32 bit değerlerdir ve mesaj yüküne BigEndian formatında yerleştirilir.

Örnek:

```text
Paketleme:
    0x01020304
Sonuç:
    [0x01, 0x02, 0x03, 0x04]
```

## Uzun Tamsayılar

Uzun tamsayılar, 64 bit değerlerdir ve mesaj yüküne BigEndian formatında yerleştirilir.

Örnek:

```text
Paketleme:
    0x0102030405060708
Sonuç:
    [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]
```

## IP Adresleri

IP adresleri, 16 baytlık IPv6 formatında temsil edilir ve port kısa bir değer olarak mesaj yüküne eklenir. IPv4 adresleri, başına 12 bayt 0x00 eklenerek doldurulur.

IPv4 örneği:

```text
Paketleme:
    "127.0.0.1:9650"
Sonuç:
    [
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0xff, 0xff, 0x7f, 0x00, 0x00, 0x01,
        0x25, 0xb2,
    ]
```

IPv6 örneği:

```text
Paketleme:
    "[2001:0db8:ac10:fe01::]:12345"
Sonuç:
    [
        0x20, 0x01, 0x0d, 0xb8, 0xac, 0x10, 0xfe, 0x01,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x30, 0x39,
    ]
```

## Sabit Uzunluklu Dizi

Uzunluğu önceden bilinmesi ve bağlamla belirlenmiş olan sabit uzunluklu diziler, sırayla yerleştirilir.

Bayt dizisi örneği:

```text
Paketleme:
    [0x01, 0x02]
Sonuç:
    [0x01, 0x02]
```

Tamsayı dizisi örneği:

```text
Paketleme:
    [0x03040506]
Sonuç:
    [0x03, 0x04, 0x05, 0x06]
```

## Değişken Uzunluklu Dizi

Dizinin uzunluğu, tam sayı formatında öne eklenir ve ardından dizi içeriği, sabit uzunluklu dizi formatında paketlenir.

Bayt dizisi örneği:

```text
Paketleme:
    [0x01, 0x02]
Sonuç:
    [0x00, 0x00, 0x00, 0x02, 0x01, 0x02]
```

Tam sayı dizisi örneği:

```text
Paketleme:
    [0x03040506]
Sonuç:
    [0x00, 0x00, 0x00, 0x01, 0x03, 0x04, 0x05, 0x06]
```

## Dize

Bir Dize, değişken uzunluktaki bir bayt dizisi benzeri şekilde paketlenir. Ancak, uzunluk öne eklenen değer kısa (short) olarak verilir, tam sayı (int) değil. Dizeler, UTF-8 formatında kodlanır.

Örnek:

```text
Paketleme:
    "Cam"
Sonuç:
    [0x00, 0x03, 0x43, 0x41, 0x61]