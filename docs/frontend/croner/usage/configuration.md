---
title: "Yapılandırma"
parent: "Kullanım"
nav_order: 3
description: Bu bölümde, Croner'ın yapılandırma seçeneklerinin detaylarına ulaşabilirsiniz. Kullanıcıların yapılandırma ayarlarını anlamalarına yardımcı olmak amacıyla her bir anahtar ve açıklamaları sunulmaktadır.
keywords: [yapılandırma, cron, iş, zamanlayıcı, ayarlar]
---

# Yapılandırma

---

| Anahtar      | Varsayılan değer | Veri türü      | Açıklamalar                               |
|--------------|------------------|----------------|-------------------------------------------|
| name         | undefined        | String         | İş için bir ad belirtirseniz, Croner işin referansını dışa aktarılan `scheduledJobs` dizisinde saklayacaktır. Referans `.stop()` ile kaldırılacaktır. |
| maxRuns      | Infinite         | Number         |                                           |
| catch        | false            | Boolean\|Function | Tetiklenen fonksiyondaki işlenmemiş hataları yakalayın. `true` geçmek hataları sessizce yoksayar. Bir geri çağırma fonksiyonu geçmek, hata durumunda bu geri çağırmayı tetikler. |
| timezone     | undefined        | String         | Avrupa/Stockholm formatında saat dilimi  |
| startAt      | undefined        | String         | ISO 8601 formatında tarih saat (2021-10-17T23:43:00)yerel saatte (geçersiz kılınmışsa saat dilimi parametresine göre) |
| stopAt       | undefined        | String         | ISO 8601 formatında tarih saat (2021-10-17T23:43:00)yerel saatte (geçersiz kılınmışsa saat dilimi parametresine göre) |
| interval     | 0                | Number         | Tetiklemeler arasındaki minimum saniye sayısı. |
| paused       | false            | Boolean        | İşin başlangıçta duraklatılması gerekip gerekmediği. |
| context      | undefined        | Any            | Tetiklenen fonksiyona ikinci parametre olarak geçen |
| legacyMode   | true             | boolean        | Ayın günü ile haftanın gününü birleştirin, true = VEYA, false = VE |
| unref        | false            | boolean        | Bunu true olarak ayarlamak, dahili zamanlayıcıyı serbest bırakır, bu da bir cron işi çalışırken işlemin çıkış yapmasına olanak tanır. |
| utcOffset    | undefined        | number         | Belirli bir utc ofseti ile dakikada programlama. Bu, yaz saati uygulamasını dikkate almaz, muhtemelen bunun yerine `timezone` seçeneğini kullanmak istersiniz. |
| protect      | undefined        | boolean\|Function | Aşım korumasını etkinleştirin. Eski bir tetikleme devam ettiği sürece yeni tetiklemeleri engelleyecektir. Bunu etkinleştirmek için ya `true` ya da bir geri çağırma fonksiyonu geçin. |

> **Uyarı**
> Zamanlayıcıların referansının kaldırılması (seçenek `unref`) yalnızca Node.js ve Deno tarafından desteklenmektedir. 
> Tarayıcılar bu özelliği henüz uygulamamıştır ve bir tarayıcı ortamında kullanmak mantıklı değildir.
{ .warning }