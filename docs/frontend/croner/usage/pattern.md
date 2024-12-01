---
title: "Desen"
description: "Bu belge, Croner ifadeleri ve onların kullanımı hakkında bilgi verir. Temel ifadeler ve özel karakterlerin nasıl kullanılacağına dair detaylar sunulmaktadır."
keywords: [Croner, Vixie Cron, zamanlama, ifadeler, JavaScript, ISO 8601]
parent: "Kullanım"
nav_order: 2
---

# Desen

---

{% include multiplex.html %}

Croner tarafından kullanılan ifadeler, aşağıda açıklandığı gibi birkaç ekleme ve değişiklikle birlikte Vixie Cron ile çok benzerdir:

```ts
// ┌──────────────── (isteğe bağlı) saniye (0 - 59)
// │ ┌────────────── dakika (0 - 59)
// │ │ ┌──────────── saat (0 - 23)
// │ │ │ ┌────────── ayın günü (1 - 31)
// │ │ │ │ ┌──────── ay (1 - 12, OCA-ARA)
// │ │ │ │ │ ┌────── haftanın günü (0 - 6, PAZ-Çar) 
// │ │ │ │ │ │       (0'dan 6'ya kadar Pazar'dan Cumartesi'ye; 7 Pazar'dır, 0 ile aynıdır)
// │ │ │ │ │ │
// * * * * * *
```

*   Croner ifadeleri aşağıdaki ek değiştiricilere sahiptir:
	-   *?*: Soru işareti, başlangıç zamanıyla değiştirilir. Örneğin, `? ? * * * *` yeni Kron oluşturulurken `? ? * * * *` yerine `25 8 * * * *` ile değiştirilir, zaman :08:25 olduğunda. Soru işareti, herhangi bir alanda kullanılabilir.
	-   *L*: 'L' harfi, ayın günü alanında ayın son gününü belirtmek için kullanılabilir. Haftanın günü alanında # karakteri ile birlikte kullanıldığında, ayın son belirli haftaiçi gününü gösterir. Örneğin, `5#L` ayın son Cuma'sını temsil eder.
	-	*#*: # karakteri, bir ay içindeki belirli bir günün "nıncı" occurrence'ını belirtir. Örneğin, hafta günü alanında `5#2` sağlamak, ayın ikinci Cuma'sını belirtir. Bu, aralıklarla birleştirilebilir ve gün adlarını destekler. Örneğin, `MON-FRI#2` şeklinde tanımlandığında, ayın ikinci haftasındaki Pazartesi ile Cuma'yı eşleştirir.

:::tip
Croner, bir JavaScript Date objesi veya ISO 8601 formatında bir dizeyi bir desen olarak geçmenize olanak tanır.
:::

*   Croner ayrıca, haftanın günü ve ayın günü koşullarının nasıl birleştirileceğini değiştirmenize de olanak tanır. Varsayılan olarak, Croner (ve Vixie cron) ya ayın günü ya da haftanın günü koşullarından biri eşleştiğinde tetiklenecektir. Örneğin, `0 20 1 * MON` ayın birinci gününde ve her Pazartesi tetiklenecektir. Eğer sadece ayın birinci günü olan Pazartesileri tetiklemek istiyorsanız, `{ legacyMode: false }` geçebilirsiniz. Daha fazla bilgi için [#53](https://github.com/Hexagon/croner/issues/53) konusuna bakınız.

| Alan         | Gerekli | İzin verilen değerler | İzin verilen özel karakterler | Notlar                               |
|--------------|----------|----------------|----------------------------|---------------------------------------|
| Saniye       | İsteğe bağlı | 0-59           | * , - / ?                  |                                       |
| Dakika       | Evet      | 0-59           | * , - / ?                  |                                       |
| Saat         | Evet      | 0-23           | * , - / ?                  |                                       |
| Ayın Günü    | Evet      | 1-31           | * , - / ? L                |                                       |
| Ay           | Evet      | 1-12 veya OCA-ARA| * , - / ?                  |                                       |
| Haftanın Günü| Evet      | 0-7 veya PAZ-Çar | * , - / ? L #               | 0'dan 6'ya Pazar'dan Cumartesi'ye7 Pazar'dır, 0 ile aynıdır# haftaiçi günün nıncı occurrence'ını belirtmek için kullanılır            |

> Haftaiçi ve ay adları büyük/küçük harf duyarsızdır. Hem `MON` hem de `mon` geçerlidir.
> Haftanın Günü alanında `L` kullanıldığında, belirtilen tüm haftaiçi günlerini etkiler. Örneğin, `5-6#L` ayın son Cuma ve Cumartesi günlerini ifade eder.
> # karakteri, ayın "nıncı" haftaiçi gününü belirtmek için kullanılabilir. Örneğin, `5#2` ayın ikinci Cuma'sını temsil eder.
{ .note }

Ayrıca aşağıdaki "takma adları" desen olarak kullanmak mümkündür:


Takma Adlar Listesi

| Takma Ad   | Açıklama |
|------------|----------|
| \@yıllık   | Yılda bir kez çalıştırılır, yani "0 0 1 1 *". |
| \@yıllık   | Yılda bir kez çalıştırılır, yani "0 0 1 1 *". |
| \@aylık    | Ayda bir kez çalıştırılır, yani "0 0 1 * *". |
| \@haftalık | Haftada bir kez çalıştırılır, yani "0 0 * * 0". |
| \@günlük   | Günde bir kez çalıştırılır, yani "0 0 * * *". |
| \@saatlik  | Saate bir kez çalıştırılır, yani "0 * * * *". |
