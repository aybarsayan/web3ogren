import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Tekil Nominatör Havuzu

[Tekil Nominatör](https://github.com/orbs-network/single-nominator), soğuk cüzdan aracılığıyla TON blockchain'inde güvenli doğrulama sağlamayı mümkün kılan basit bir firewall TON akıllı sözleşmesidir. Sözleşme, kendilerini doğrulamak için yeterli öz paya sahip TON doğrulayıcıları için tasarlanmıştır, böylece üçüncü taraf nominatörlerin paylarına bağımlı kalmadan işlem yapabilirler. Sözleşme, yalnızca Tekil Nominatör'ü destekleyen `Nominatör Havuzu` akıllı sözleşmesi için alternatif bir basit uygulama sağlar. 

:::tip
Bu uygulamanın avantajı, saldırı yüzeyinin önemli ölçüde daha küçük olması nedeniyle daha güvenli olmasıdır.
:::

Bu, birden fazla üçüncü taraf nominatörü desteklemek durumunda olan Nominatör Havuzu'nun karmaşıklığındaki büyük bir azalmanın sonucudur.

## Doğrulayıcılar için go-to çözümü

Bu akıllı sözleşme, kendileri için doğrulamak için yeterli paya sahip TON doğrulayıcıları için bir go-to çözümü olmayı amaçlamaktadır. Diğer mevcut alternatifler şunlardır:
* [sıcak cüzdan](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) kullanmak (eğer doğrulayıcı düğümü hacklenirse soygunu önlemek için bir soğuk cüzdan gerektiğinden güvensiz)
* [kısıtlı cüzdan](https://github.com/EmelyanenkoK/nomination-contract/blob/master/restricted-wallet/wallet.fc) kullanmak (bakımı yapılmamış ve gaz boşaltma saldırıları gibi çözülmemiş saldırı vektörlerine sahip)
* [Nominatör Havuzu](https://github.com/ton-blockchain/nominator-pool) kullanmak, max_nominators_count = 1 (gereksiz yere karmaşık ve daha büyük bir saldırı yüzeyine sahip)

Aşağıda mevcut alternatiflerin daha ayrıntılı bir `karşılaştırmasını` görebilirsiniz.

## Resmi kod hash'i

Canlı bir sözleşmeye fon göndermeden önce bunu kontrol edin: https://verifier.ton.org

```
pCrmnqx2/+DkUtPU8T04ehTkbAGlqtul/B2JPmxx9bo=
```

## Mimari

Mimari, [Nominatör Havuzu](https://github.com/ton-blockchain/nominator-pool) sözleşmesine neredeyse aynıdır:

![image](../../../../images/ton/static/img/nominator-pool/single-nominator-architecture.png)

### İki role ayrım

* *Sahip* - yalnızca kendi fonları için (İnternete bağlı olmayan özel anahtar) soğuk cüzdan olan ve fonları elinde bulunduran tekil nominatördür.
* *Doğrulayıcı* - özel anahtarı doğrulayıcı düğümde bulunan cüzdan (blokları imzalayabilir ama stake için kullanılan fonları çalamaz)

### İş akışı

1. *Sahip*, staking için fonları ($$$) güvenli soğuk cüzdanında tutar.
2. *Sahip*, fonları ($$$) *SingleNominator* sözleşmesine yatırır (bu sözleşme).
3. *MyTonCtrl*, internete bağlı doğrulayıcı düğümde çalışmaya başlar.
4. *MyTonCtrl*, *SingleNominator*'a bir sonraki seçim döngüsüne girme talimatı vermek için *Doğrulayıcı* cüzdanını kullanır.
5. *SingleNominator*, stake'i ($$$) bir döngü için *Elector*'a gönderir.
6. Seçim döngüsü sona erer ve stake geri alınabilir.
7. *MyTonCtrl*, seçim döngüsünden stake'i geri almak için *SingleNominator*'a talimat vermek üzere *Doğrulayıcı* cüzdanını kullanır.
8. *SingleNominator*, önceki döngünün stake'ini *Elector*'dan geri alır.
9. Adımlar 4-8, *Sahip* doğrulamaya devam etmekten memnun kaldığı sürece tekrarlanır.
10. *Sahip*, *SingleNominator* sözleşmesinden fonları ($$$) çeker ve bunları evine geri alır.

## Azaltılmış saldırı vektörleri

* Doğrulayıcı düğüm, yeni blokları imzalamak için bir sıcak cüzdan gerektirir. Bu cüzdan, özel anahtarının İnternete bağlı olmasından dolayı doğası gereği güvensizdir. Bu anahtarın ele geçirilmesi durumunda bile, *Doğrulayıcı*, doğrulama için kullanılan fonları çıkaramaz. Sadece *Sahip*, bu fonları çekebilir.

* *Doğrulayıcı* cüzdanı ele geçirilirse bile, *Sahip*, *SingleNominator*'ın doğrulayıcı adresini değiştirmesini talimat verebilir. Bu, saldırganın *SingleNominator* ile etkileşimde bulunmasını engelleyecektir. Burada bir yarış durumu yoktur, *Sahip* her zaman öncelikli olacaktır.

* *SingleNominator* bakiyesi yalnızca asıl staking fonlarını tutar - bakiyesi gaz ücretleri için kullanılmaz. Seçim döngülerine girmek için gaz parası *Doğrulayıcı* cüzdanında tutulur. Bu, doğrulayıcıyı ele geçiren bir saldırganın asıl fonları gaz harcama saldırısı yoluyla boşaltmasını engeller.

* *SingleNominator*, *Doğrulayıcı* tarafından verilen tüm işlemlerin formatını doğrular, böylece geçersiz mesajların *Elector*'a iletilmesini sağlamaz.

* Acil bir durumda, örneğin *Elector* sözleşmesi güncellenirse ve arayüz değişirse, *Sahip* yine de *SingleNominator* olarak herhangi bir ham mesaj gönderebilir ve *Elector*'dan stake'i kurtarabilir.

* Aşırı acil bir durumda, *Sahip*, *SingleNominator*'ın kodunu ayarlayabilir ve beklenmedik durumlarla başa çıkmak için mevcut mantığını geçersiz kılabilir.

:::note
Bu saldırı vektörlerinin bazıları, doğrulayıcıyı yöneten kişinin, nominasyon fonlarından hırsızlık yapmasını önlemek için bu tür önlemlerin alınmadığı normal [Nominatör Havuzu](https://github.com/ton-blockchain/nominator-pool) sözleşmesi ile hafifletilemez. 
:::

Bu, *Owner* ve *Validator* aynı taraf tarafından sahip olunmuş olduğundan, *SingleNominator* ile bir sorun teşkil etmez.

### Güvenlik denetimleri

Tam güvenlik denetimi Certik tarafından yapılmış ve bu repoda mevcuttur - [Certik Denetimi](https://github.com/orbs-network/single-nominator/blob/main/certik-audit.pdf).

## Mevcut alternatiflerin karşılaştırması

Kendiniz için doğrulamak için yeterli paya sahip bir doğrulayıcı olduğunuzu varsayarsak, MyTonCtrl ile kullanabileceğiniz alternatif kurulumlar şunlardır:

---

### 1. Basit sıcak cüzdan

Bu, MyTonCtrl'nin, fonları tutan aynı [standart cüzdan](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) ile bağlı olduğu en basit kurulumdur. Bu cüzdan İnternete bağlı olduğundan, sıcak cüzdan olarak kabul edilir.

![image](../../../../images/ton/static/img/nominator-pool/hot-wallet.png)

:::warning
Bu, bir saldırganın özel anahtara erişim sağlayabileceği için güvensizdir. Özel anahtar ile saldırgan, stake fonlarını herhangi bir yere gönderebilir.
:::

---

### 2. Kısıtlı cüzdan

Bu kurulum, standart cüzdanın, yalnızca *Elector* ve sahibin adresine gibi sınırlı hedeflere çıkış işlemleri göndermeye izin veren bir [kısıtlı cüzdan](https://github.com/EmelyanenkoK/nomination-contract/blob/master/restricted-wallet/wallet.fc) ile değiştirilmesini içerir.

![image](../../../../images/ton/static/img/nominator-pool/restricted-wallet.png)

Kısıtlı cüzdan bakımı yapılmamıştır (nominatör havuzuyla değiştirilmiştir) ve gaz boşaltma saldırıları gibi çözülmemiş saldırı vektörlerine sahiptir. Aynı cüzdan hem gaz ücretlerini hem de stake ana parayı aynı bakiyede tuttuğundan, özel anahtarı ele geçirilen bir saldırgan, önemli ana kayıplarına neden olacak işlemler üretebilir. Ayrıca, çekim yaparken saldırgan ve sahibi arasında seqno çakışması nedeniyle bir yarış durumu vardır.

---

### 3. Nominatör havuzu

[Nominatör havuzu](https://github.com/ton-blockchain/nominator-pool), stake sahipleri (nominatörler) ve İnternete bağlı doğrulayıcı arasında net bir ayrım yapmak için ilk olarak ortaya çıkmıştır. Bu kurulum, 40 nominattörün aynı doğrulayıcıda birlikte staking yapmasına olanak tanır.

![image](../../../../images/ton/static/img/nominator-pool/nominator-pool.png)

Nominatör havuzu sözleşmesi, 40 eşzamanlı nominattörün desteği nedeniyle aşırı karmaşıktır. Ayrıca, sözleşme, farklı varlıklar oldukları için nominattörleri sözleşme dağıtıcılarından korumak zorundadır. Bu kurulum kabul edilebilir ancak saldırı yüzeyinin büyüklüğü nedeniyle tam olarak denetlenmesi çok zordur. Çözüm, çoğunlukla doğrulayıcının sadece tek başına doğrulamak için yetersiz stake'e sahip olduğu veya üçüncü taraf paydaşları ile paylaştırmak istediği durumlarda mantıklıdır.

---

### 4. Tekil nominayör

Bu, bu repoda uygulanmış kurulumdur. Bu, bir tekil nominayörü destekleyen ve bu nominayörü sözleşme dağıtıcılarından korumaya gerek kalmadan çok basitleştirilmiş bir versiyondur.

![image](../../../../images/ton/static/img/nominator-pool/single-nominator-architecture.png)

Eğer doğrulama için tüm stake'i elinde bulunduran tekil bir nominayörünüz varsa, bu kullanabileceğiniz en güvenli kurulumdur. Basitliğin yanı sıra, bu sözleşme, *Elector* yükseltmeleri gibi aşırı senaryolarda bile stake'i kurtarabilecek bir dizi acil durum güvencesi sunmaktadır.

### Sadece Sahip mesajları

Nominatör sahibi 4 işlem gerçekleştirebilir:

#### 1. `withdraw`
Sahip cüzdanına fonları çekmek için kullanılır. Fonları çekmek için, sahibi, kodu 0x1000 (32 bit), query_id (64 bit) ve çekim miktarını içeren bir mesaj göndermelidir. Nominatör sözleşmesi fonları BOUNCEABLE bayrağı ve mode=64 ile gönderecektir. 

:::info
Eğer sahip bir **sıcak cüzdan** kullanıyorsa (önerilmez), [withdraw-deeplink.ts](https://github.com/orbs-network/single-nominator/blob/main/scripts/ts/withdraw-deeplink.ts) tonkeeper cüzdanından bir çekim başlatmak için bir derin bağlantı oluşturmak için kullanılabilir.
:::

Komut satırı: `ts-node scripts/ts/withdraw-deeplink.ts single-nominator-addr withdraw-amount` burada:
* single-nominator-addr, sahibin çekmek istediği tekil nominayör adresidir.
* withdraw-amount, çekilecek miktardır. Nominatör sözleşmesi, sözleşmede 1 TON bırakacaktır, bu nedenle sahibin adresine gönderilecek gerçek miktar, istenen miktar ile sözleşme bakiyesi - 1 arasındaki minimum olacaktır. 

:::note
Sahip, derin bağlantıyı tonkeeper cüzdanı olan bir telefondan çalıştırmalıdır.
:::

Eğer sahip bir **soğuk cüzdan** kullanıyorsa (önerilir), [withdraw.fif](https://github.com/orbs-network/single-nominator/blob/main/scripts/fift/withdraw.fif) çekim op kodunu ve çekilecek miktarı içeren bir boc gövdesi oluşturmak için kullanılabilir. 
Komut satırı: `fift -s scripts/fif/withdraw.fif withdraw-amount` burada withdraw-amount, nominasyon sözleşmesinden sahibin cüzdanına çekilecek miktardır. Daha önce belirtildiği gibi, nominasyon sözleşmesi sözleşmede en az 1 TON bırakacaktır. 

Bu script, sahiple gönderilmesi gereken ve imzalanması gereken bir boc gövdesi (withdraw.boc olarak adlandırılacaktır) oluşturacaktır. 

Siyah bilgisayardan, sahip şu işlemleri gerçekleştirmelidir:
* tx oluşturup imzala: `fift -s wallet-v3.fif my-wallet single_nominator_address sub_wallet_id seqno amount -B withdraw.boc` burada my-wallet, sahibin pk dosyasıdır (uzantı olmadan). Miktar için 1 TON, ücretleri ödemek için yeterli olmalıdır (kalan miktar sahip geri dönecektir). Withdraw.boc yukarıda oluşturulan boc'tur.
* İnternete erişimi olan bir bilgisayardan şu komutu çalıştırın: `lite-client -C global.config.json -c 'sendfile wallet-query.boc'` geri gönderilen boc dosyasını (wallet-query.boc) göndermek için.

#### 2. `change-validator`
Doğrulayıcı adresini değiştirmek için kullanılır. Doğrulayıcı yalnızca NEW_STAKE ve RECOVER_STAKE'yi electora gönderebilir. Doğrulayıcı özel anahtarı ele geçirilirse, doğrulayıcı adresi değiştirilebilir. Bu durumda, fonlar güvendedir, çünkü yalnızca sahip bu fonları çekebilir.

:::tip
Eğer sahip bir **sıcak cüzdan** kullanıyorsa (önerilmez), [change-validator-deeplink.ts](https://github.com/orbs-network/single-nominator/blob/main/scripts/ts/change-validator-deeplink.ts) doğrulayıcı adresini değiştirmek için bir derin bağlantı oluşturmak için kullanılabilir.
:::

Komut satırı: `ts-node scripts/ts/change-validator-deeplink.ts single-nominator-addr new-validator-address` burada:
* single-nominator-addr, tekil nominayör adresidir.
* new-validator-address (ZERO adresi varsayılan) yeni doğrulayıcının adresidir. Eğer doğrulayıcıyı derhal devre dışı bırakmak ve sadece sonra yeni bir doğrulayıcı ayarlamak istiyorsanız, doğrulayıcı adresini ZERO adresi olarak ayarlamak uygun olabilir.
 
:::note
Sahip, derin bağlantıyı tonkeeper cüzdanı olan bir telefondan çalıştırmalıdır.
:::

Eğer sahip bir **soğuk cüzdan** kullanıyorsa (önerilir), [change-validator.fif](https://github.com/orbs-network/single-nominator/blob/main/scripts/fift/change-validator.fif) yeni doğrulayıcı adresini ve doğrulayıcı değiştirme op kodunu içeren bir boc gövdesi oluşturmak için kullanılabilir. 
Komut satırı: `fift -s scripts/fif/change-validator.fif new-validator-address`.

:::info
Bu script, sahibin cüzdanından imzalanıp gönderilmesi gereken bir boc gövdesi (change-validator.boc olarak adlandırılacaktır) oluşturacaktır.
:::

Siyah bilgisayardan, sahip şu işlemleri gerçekleştirmelidir:
* tx oluşturup imzala: `fift -s wallet-v3.fif my-wallet single_nominator_address sub_wallet_id seqno amount -B change-validator.boc` burada my-wallet, sahibin pk dosyasıdır (uzantı olmadan). Miktar için 1 TON, ücretleri ödemek için yeterli olmalıdır (kalan miktar sahip geri dönecektir). Change-validator.boc yukarıda oluşturulmuştur.
* İnternete erişimi olan bir bilgisayardan şu komutu çalıştırın: `lite-client -C global.config.json -c 'sendfile wallet-query.boc'` geri gönderilen boc dosyasını (wallet-query.boc) göndermek için.

#### 3. `send-raw-msg`
Bu op kodunun normal şartlarda kullanılmaması beklenmektedir. 

Nominatör sözleşmesindeki **herhangi** bir mesajı göndermek için kullanılabilir (imzalanmalı ve sahibin cüzdanından gönderilmelidir). 

:::note
Örneğin, eğer electora sözleşmesi adresi beklenmedik bir şekilde değişirse ve fonlar hala electorda kilitlenirse, bu op kodunu kullanmak isteyebilirsiniz. 
:::

Bu durumda, doğrulayıcıdan RECOVER_STAKE işlemi çalışmayacak ve sahip, özel bir mesaj oluşturmak zorunda kalacaktır. 
Mesaj gövdesi, şu bilgileri içermelidir: opcode=0x7702 (32 bit), query_id (64 bit), mod (8 bit), bir ham mesaj olarak gönderilecek hücreye olan referans. 

#### 4. `upgrade`
Bu bir acil durum op kodudur ve muhtemelen kullanılmamalıdır.

Nominatör sözleşmesini yükseltmek için kullanılabilir. 

:::danger
Mesaj gövdesi, şu bilgileri içermelidir: opcode=0x9903 (32 bit), query_id (64 bit), yeni hücre koduna referans. 
:::

## Ayrıca Bakınız

* [Tekil Nominator Havuzu sözleşmesi](https://github.com/orbs-network/single-nominator)
* `Tekil Nominator Havuzunu Kullanma`