# Highload Cüzdan

Kısa bir süre içinde birçok mesajla çalışırken, **Highload Cüzdan** adı verilen özel bir cüzdana ihtiyaç duyulmaktadır. Highload Cüzdan V2, uzun süre boyunca TON'daki ana cüzdan oldu, ancak onunla çok dikkatli olmak gerekiyordu. Aksi takdirde, [tüm fonları kilitleyebilirdiniz](https://t.me/tonstatus/88).

> **Not:** Highload Cüzdan V3'ün ortaya çıkmasıyla, bu sorun sözleşme mimarisi düzeyinde çözülmüş ve daha az gaz tüketmektedir. Bu bölüm, Highload Cüzdan V3'ün temellerini ve hatırlanması gereken önemli nüansları kapsayacaktır.  
> — Highload Cüzdan Ekibi

## Highload Cüzdan v3

Bu cüzdan, çok yüksek oranlarda işlem göndermesi gerekenler için yapılmıştır. Örneğin, kripto borsaları.

- [Kaynak kodu](https://github.com/ton-blockchain/Highload-wallet-contract-v3)

Bir Highload v3'e verilen her dış mesaj (transfer talebi) şunları içerir:
- Üst düzey hücrede bir imza (512 bit) - diğer parametreler o hücrenin referansında
- Alt cüzdan ID'si (32 bit)
- Gönderilecek mesajın referansı (gönderilecek seri haldeki iç mesaj)
- Mesajın gönderim modu (8 bit)
- Bileşik sorgu ID'si - 13 bit "shift" ve 10 bit "bit sayısı", ancak bit sayısının 10 biti yalnızca 1022'ye kadar gidebilir, 1023'e kadar değil, ayrıca en son kullanılabilir sorgu ID'si (8388605) acil durumlar için ayrılmıştır ve normalde kullanılmamalıdır
- Oluşturulma zamanı veya mesaj zaman damgası
- Zaman aşımı

:::tip
Zaman aşımı, Highload'da bir parametre olarak saklanır ve tüm isteklerdeki zaman aşımı ile karşılaştırılır - bu nedenle tüm isteklerin zaman aşımı eşittir.
:::

Mesaj, Highload cüzdanına geldiğinde zaman aşımından daha eski olmamalıdır, yani kodda `created_at > now() - timeout` olması gerekmektedir. Sorgu ID'leri, tekrar koruması amaçlarıyla en az zaman aşımı süresince ve muhtemelen 2 * zaman aşımına kadar saklanır, ancak bunların zaman aşımından daha uzun süre saklanmasını beklemek gereksizdir. Alt cüzdan ID'si, cüzdanda saklanan ile karşılaştırılır. İç referansın hash'i, cüzdanın genel anahtarı ile birlikte imza ile kontrol edilir.

Highload v3, herhangi bir dış mesajdan yalnızca 1 mesaj gönderebilir, ancak o mesajı kendisine özel bir op kodu ile gönderebilir; bu, o iç mesajı çağırırken herhangi bir işlem hücresini ayarlamayı sağlar ve bu şekilde 1 dış mesaj başına 254'e kadar (bu 254'ün arasında Highload cüzdanına yeniden başka bir mesaj gönderilirse muhtemelen daha fazlasını) mesaj göndermek mümkün hale gelir.

Highload v3, tüm kontroller geçildikten sonra sorgu ID'sini (tekrar koruma) her zaman saklayacaktır, ancak bazı koşullardan dolayı bir mesaj gönderilmeyebilir, bunlar arasında, ancak bunlarla sınırlı olmamak üzere:
- **Durum başlatma içeriyorsa** (bu tür mesajlar, gerekirse, Highload cüzdanından kendisine gönderilen bir iç mesajdan sonra işlem hücresini ayarlamak için özel op kodu kullanılarak gönderilebilir)
- Yetersiz bakiye
- Geçersiz mesaj yapısı (bu, yalnızca iç mesajların dış mesaja doğrudan gönderilebileceği dış çıkış mesajlarını içerir)

:::warning
Highload v3, aynı `query_id` **ve** `created_at` içeren birden fazla dış mesajı asla yürütmeyecek - verilen herhangi bir `query_id`'yi unuttuğunda, `created_at` koşulu böyle bir mesajın yürütülmesini engelleyecektir.
:::

Bu, etkili bir şekilde `query_id` **ve** `created_at`'ın bir transfer talebi için Highload v3'ün "birincil anahtarı" yaptığını gösterir.

Sorgu ID'sini iterasyon (arttırma) yaparken, TON'un ücretleri açısından daha ucuzdur bit sayısı üzerinden önce ilerlemek ve ardından kaydırma yapmak, normal bir sayıyı artırırken olduğu gibi. Son sorgu ID'sine ulaştıktan sonra (acil durum sorgu ID'sini hatırlayın - yukarıya bakın), sorgu ID'sini 0'a sıfırlayabilirsiniz, ancak Highload'ın zaman aşımı süresi henüz geçmemişse, o zaman tekrar koruma sözlüğü dolu olacaktır ve zaman aşımı süresinin geçmesini beklemeniz gerekecektir.

---

## Highload cüzdan v2

:::danger
Eski sözleşme, Highload cüzdan v3'ün kullanılması önerilmektedir.
:::

Bu cüzdan, kısa bir zaman diliminde yüzlerce işlem göndermesi gerekenler için yapılmıştır. Örneğin, kripto borsaları.

Tek bir akıllı sözleşme çağrısında `254` adede kadar işlem göndermenizi sağlar. Ayrıca, tekrar saldırılarını çözmek için seqno yerine biraz farklı bir yaklaşım kullanmaktadır, bu nedenle bu cüzdanı birden çok kez arayarak hatta bir saniyede binlerce işlem gönderebilirsiniz.

:::caution Sınırlamalar
Highload cüzdan ile çalışırken aşağıdaki sınırlamaların kontrol edilmesi ve dikkate alınması gerektiğini unutmayın.
:::

1. **Depolama boyut limiti.** Mevcut durumda, sözleşme depolama boyutu 65535 hücreden az olmalıdır. Eğer `eski_sorgular` bu limitin üzerine çıkarsa, **ActionPhase**'de bir istisna fırlatılacak ve işlem başarısız olacaktır. Başarısız işlem yeniden oynatılabilir.
2. **Gaz limiti.** Mevcut durumda, gaz limiti 1.000.000 GAS birimidir, bu da bir tx'de ne kadar eski sorgunun temizlenebileceği hakkında bir sınır olduğu anlamına gelir. Süresi dolmuş sorguların sayısı daha yüksekse, sözleşme takılacaktır.

Bu nedenle, çok yüksek bir zaman aşımı tarihi ayarlamanız önerilmez: zaman aşımı süresinde sorgu sayısı 1000'i geçmemelidir.

Ayrıca, bir işlemde temizlenen süresi dolmuş sorguların sayısı 100'ün altında olmalıdır.

---

## Nasıl Yapılır

`Highload Cüzdan Eğitimleri` makalesini de okuyabilirsiniz.

Cüzdanın kaynak kodu:
 * [ton/crypto/smartcont/Highload-wallet-v2-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)