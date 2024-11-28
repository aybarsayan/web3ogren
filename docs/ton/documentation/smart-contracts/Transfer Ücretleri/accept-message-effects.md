# Mesaj Kabul Etme Etkileri

`accept_message` ve `set_gas_limit`, `stdlib referansı` içerisinde belirtildiği gibi tam olarak yapılan işlemler sırasında o kadar basit etkiler yaratmayabilir.

## Harici Mesajlar

Harici mesajlar aşağıdaki gibi işlenir: 

- `gas_limit`, 10k gaz ile eşit olan `gas_credit` (ConfigParam 20 ve ConfigParam 21) olarak ayarlanır.
- Bu kredilerin harcanması sırasında, bir sözleşmenin mesaj işleme ücretlerini ödemeye hazır olduğunu belirten `accept_message` çağrısı yapması gerekir.
- Eğer `gas_credit` ulaşılır veya hesaplama tamamlanır ve `accept_message` çağrılmazsa, mesaj tamamen reddedilir (sanki hiç olmamış gibi).

:::tip
Aksi takdirde, `contract_balance/gas_price` ( `accept_message` durumunda) veya özel bir sayı ( `set_gas_limit` durumunda) ile eşit olan yeni bir gaz limiti ayarlanır.
:::

- İşlem sona erdikten sonra, işlem ücretleri sözleşme bakiyesinden düşülür (bu şekilde, `gas_credit` gerçekten de **kredi**, serbest gaz değildir).

Dikkat edilmesi gereken bir diğer nokta, `accept_message` sonrasında bir hata oluşursa (ComputePhase veya ActionPhase' da), işlem blok zincirine yazılacak ve ücretler sözleşme bakiyesinden düşülecektir. Ancak, depolama güncellenmeyecek ve eylemler uygulanmayacaktır; bu durum, hatalı çıkış koduna sahip her işlem için geçerlidir.

> Sonuç olarak, eğer sözleşme bir harici mesaj kabul ederse ve ardından mesaj verilerindeki bir hata veya yanlış bir şekilde serileştirilmiş bir mesaj gönderilmesi nedeniyle bir istisna fırlatırsa, işlem ücretini ödeyecek ancak mesajın tekrarını önlemenin bir yolu olmayacaktır.  
> — Önemli Not

**Aynı mesaj, sözleşme tarafından sürekli olarak kabul edilecek ve tüm bakiye tükenene kadar devam edecektir.**

## Dahili Mesaj

Varsayılan olarak, bir sözleşme bir dahili mesaj aldığında, gaz limiti `message_balance`/`gas_price` olarak ayarlanır. Diğer bir deyişle, mesaj kendi işleme ücretini öder. `accept_message`/`set_gas_limit` kullanarak, sözleşme yürütme sırasında gaz limitini değiştirebilir.

Dikkat edilmesi gereken bir diğer nokta, gaz limitlerinin manuel ayarlarının sıçrama davranışlarını etkilemediğidir; eğer mesaj sıçrayabilir modda gönderilirse ve işlenmesi ve sıçrama mesajlarının oluşturulması için yeterli parayı içeriyorsa, mesajlar sıçrayacaktır.

:::info örnek
Örneğin, 1 TON bakiyeye sahip bir sözleşme tarafından kabul edilen, temel zincirde 0.1 TON ile gönderilen bir sıçrayabilir mesaj varsa ve hesaplama maliyeti 0.005 TON, mesaj ücreti ise 0.001 TON ise, sıçrama mesajı `0.1 - 0.005 - 0.001` = `0.094` TON içerecektir.
:::

Aynı örnekte, hesaplama maliyeti 0.5 (0.005 yerine) olursa, sıçrama olmayacaktır (mesaj bakiyesi `0.1 - 0.5 - 0.001 = -0.401` olacaktır, dolayısıyla sıçrama yoktur) ve sözleşme bakiyesi `1 + 0.1 - 0.5` = `0.6` TON olacaktır.