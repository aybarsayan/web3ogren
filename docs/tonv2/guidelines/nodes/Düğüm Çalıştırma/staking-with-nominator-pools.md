# Nominator Havuzları ile Stake Etme

## Genel Bakış 

TON akıllı sözleşmeleri ile istediğiniz herhangi bir stake ve depo mekanizmasını uygulayabilirsiniz.

Ancak, TON Blockchain'de "yerel stake etme" vardır - Toncoin'inizi stake etme için doğrulayıcılara ödünç verebilir ve doğrulama için ödül paylaşabilirsiniz.

Doğrulayıcıya ödünç veren kişi **nominator** olarak adlandırılır.

Bir akıllı sözleşme, bir veya birden fazla nominatörün bir doğrulayıcı stake'inde Toncoin ödünç vermesine olanak tanır ve doğrulayıcının o Toncoin'i yalnızca doğrulama için kullanmasını sağlar. Ayrıca, akıllı sözleşme ödülün dağıtımını garanti eder.

---

## Doğrulayıcılar vs Nominatörler

Kripto paralar hakkında bilgi sahibiyseniz, **doğrulayıcılar** ve **nominatörler** hakkında mutlaka duymuşsunuzdur. Bu kelimeler, kripto ile ilgili kanallarda sıkça yer almakta (bizim kanalımız da bir istisna değildir). Artık bu iki ana aktörü keşfetme zamanı.

### Doğrulayıcılar

Öncelikle, doğrulayıcılardan bahsedelim. Bir doğrulayıcı, önerilen blokları doğrulayarak (veya onaylayarak) ve bunları blockchain'e kaydederek blockchain'in çalışmasını sağlamaya yardımcı olan bir ağ düğümüdür.

Doğrulayıcı olabilmek için iki gereksinimi karşılamanız gerekir: yüksek performanslı bir sunucuya sahip olmak ve stake oluşturmak için ciddi bir TON miktarına (600.000) sahip olmak. Yazı yazıldığı sırada TON'da 227 doğrulayıcı bulunmaktadır.

### Nominatörler

:::info
Nominator Havuzu'nun yeni versiyonu mevcut, daha fazla bilgi için Tekli Nominatör ve Varlık Sözleşmesi sayfalarına göz atın.
:::

Görünen o ki, herkesin hesap bakiyesinde **100.000'lerce Toncoin** bulundurması mümkün değil - burada nominasyon devreye giriyor. Kısacası, nominatör, Toncoin'ini doğrulayıcılara ödünç veren bir kullanıcıdır. Doğrulayıcı, blokları doğrulayarak her seferinde bir ödül kazandığında, bu ödül ilgili katılımcılar arasında dağıtılır.

Bir süre önce, **Ton Whales**, TON üzerinde asgari **50 TON** ile ilk staking havuzunu işletmeye başladı. Daha sonra, TON Vakfı ilk açık nominatör havuzunu başlattı. Artık kullanıcılar, **10.000 TON** ile tamamen merkeziyetsiz bir şekilde Toncoin stake edebilirler.

> _TON Topluluğu gönderisinden_  
> — [TON Topluluğu](https://t.me/toncoin/543)

Havuz bakiyesinde her zaman **10 TON** bulunmalıdır - bu, ağ depolama ücreti için minimum bakiyedir.

---

## Aylık Maliyet

Doğrulama turu ~18 saat sürdüğünden, her doğrulama turu için yaklaşık **5 TON** gerekmekte ve 1 Nominator Havuzu hem çift hem de tek doğrulama turlarına katıldığından, havuzun işletilmesi için **~105 TON/ay** gerekecektir.

## Nasıl Katılabilirim?

* [TON nominatör havuzlarının listesi](https://tonvalidators.org/)

## Kaynak Kodu

* [Nominator Havuzu akıllı sözleşme kaynak kodu](https://github.com/ton-blockchain/nominator-pool)

:::info
Nominatörlerin teorisi, [TON Beyaz Kitabı](https://docs.ton.org/ton.pdf) içinde, bölümler 2.6.3, 2.6.25'te açıklanmaktadır.
:::