# Jetton İşleme

## Jetton İşleme Üzerine En İyi Uygulamalar

Jettonlar TON Blockchain üzerindeki token'lardır - bunları Ethereum'daki ERC-20 token'larına benzer şekilde düşünebilirsiniz.

:::info İşlem Onayı
TON işlemleri yalnızca bir onaydan sonra geri alınamazdır. En iyi kullanıcı deneyimi için ek beklemelerden kaçının.
:::

#### Çekim

`Yüksek Yük Cüzdanı v3` - bu, jetton çekimleri için altın standart olan TON Blockchain'in en son çözümüdür. Toplu çekimlerden yararlanmanıza olanak tanır.

[Toplu çekimler](https://github.com/toncenter/examples/blob/main/withdrawals-jettons-highload-batch.js) - Birden fazla çekimin gruplar halinde gönderilmesi anlamına gelir, bu da hızlı ve ucuz çekimlere olanak tanır.

#### Yatırımlar

:::info
Daha iyi performans için birkaç MEMO depo cüzdanı ayarlamanız önerilir.
:::

[Memo Yatırımları](https://github.com/toncenter/examples/blob/main/deposits-jettons.js) - Bu, bir depo cüzdanı tutmanıza olanak tanır ve kullanıcıların sisteminiz tarafından tanımlanabilmeleri için bir memo eklemelerini sağlar. Bu, tüm blockchain'i taramanıza gerek kalmaması anlamına gelir, ancak kullanıcılar için biraz daha az kolaydır.

[Memosuz yatırımlar](https://github.com/gobicycle/bicycle) - Bu çözüm de mevcuttur, ancak entegrasyonu daha zordur. Ancak, bu yönü tercih ederseniz size yardımcı olabiliriz. Bu yöntemi uygulamadan önce lütfen bize bildirin.

### Ek Bilgiler

:::caution İşlem Bildirimi
Ecosystem'deki her hizmetin, bir jetton çekimi yapıldığında, başarılı bir transfer yapıldığında bir Jetton Bildirimi göndermek için `forward_ton_amount`'ın 0.000000001 TON (1 nanoton) olarak ayarlanması beklenmektedir. Aksi takdirde, transfer standart uyumluluğu olmayacak ve diğer CEX'ler ve hizmetler tarafından işlenemeyecektir.
:::

- Lütfen resmi TON Foundation JS kütüphanesi olan [tonweb](https://github.com/toncenter/tonweb) örneğini inceleyin.

- Java kullanmak istiyorsanız, [ton4j](https://github.com/neodix42/ton4j/tree/main) üzerinde göz atabilirsiniz.

- Go için, [tonutils-go](https://github.com/xssnick/tonutils-go) üzerinde durulmalıdır. Şu anda, JS kütüphanesini öneriyoruz.

## İçerik Listesi

:::tip
Aşağıdaki belgeler, genel olarak Jetton mimarisi ile birlikte EVM-benzeri ve diğer blockchain'lerden farklı olabilecek TON'un temel kavramları hakkında ayrıntılar sunmaktadır. Bu, birinin TON'u iyi bir şekilde anlaması için hayati öneme sahiptir ve büyük ölçüde yardımcı olacaktır.
:::

Bu belge şu sıradaki konuları tanımlar:
1. Genel Bakış 
2. Mimari
3. Jetton Ana Kontratı (Token Minter)
4. Jetton Cüzdan Kontratı (Kullanıcı Cüzdanı)
5. Mesaj Düzenleri
6. Jetton İşleme (off-chain)
7. Jetton İşleme (on-chain)
8. Cüzdan işlemesi
9. En İyi Uygulamalar

## Genel Bakış

:::info
TON işlemleri yalnızca bir onaydan sonra geri alınamaz. Okuyucunun, `belgelerimizin bu bölümünde` açıklanan varlık işleme ile ilgili temel prensiplere aşina olması önemlidir. Özellikle, `sözleşmelere`, `cüzdanlara`, `mesajlara` ve dağıtım sürecine aşina olmak önemlidir.
:::

:::info
En iyi kullanıcı deneyimi için, işlemler SON Blockchain üzerinde tamamlandıktan sonra ek bloklarda beklemekten kaçınılması önerilir. Daha fazla bilgi için [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3) adresini okuyun.
:::

Jetton işleme ile ilgili temel tanıma hızlı bir geçiş:

Merkezi İşleme

  On-Chain İşleme




TON Blockchain ve onun temel ekosistemi, fungible token'ları (FT'ler) jettonlar olarak sınıflandırır. Sharding uygulandığı için TON Blockchain üzerindeki fungible token'ların uygulanması, benzer blockchain modellerine kıyasla benzersizdir.

Bu analizde jettonların [davranışını](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) ve [meta verilerini](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) detaylandıran resmi standartlara daha derinlemesine bir bakış yapıyoruz. 

Jetton mimarisinin daha az resmi bir sharding odaklı genel bakışına [jettonların anatomisi blog yazımızda](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons) ulaşabilirsiniz.

Ayrıca, kullanıcıların hem Toncoin hem de jettonları ayrı bir depo adresi kullanarak yatırıp çekmelerine olanak tanıyan üçüncü taraf açık kaynak TON Ödeme İşlemcimiz hakkında belirli ayrıntılar sağladık ([bicycle](https://github.com/gobicycle/bicycle)).

## Jetton Mimarisi

TON üzerindeki standartlaştırılmış token'lar, aşağıdaki akıllı sözleşmeler seti kullanılarak uygulanmaktadır:
* [Jetton ana](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc) akıllı sözleşmesi
* [Jetton cüzdanı](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc) akıllı sözleşmeleri


  
    <img width="420" src="../../../../images/ton/static/img/docs/asset-processing/jetton_contracts.svg" alt="sözleşme şeması" />
      


## Jetton ana akıllı sözleşmesi
Jetton ana akıllı sözleşmesi, jetton hakkında genel bilgileri saklar (toplam arz, bir meta veri bağlantısı veya meta veri kendisi dahil).

:::warning Jetton dolandırıcılığına karşı dikkatli olun
Herhangi bir kullanıcının değerli bir jettonun neredeyse orijinaline benzer bir **taklit** oluşturması mümkündür (rastgele bir ad, ticker, resim vb. kullanarak). Neyse ki, sahte jettonlar **adresleri ile ayırt edilebilir** ve oldukça kolay bir şekilde tanımlanabilir.

`symbol` == `TON` olan jettonlar veya `ERROR`, `SYSTEM` gibi sistem bildirim mesajlarını içerenler. Jettonların arayüzünüzde TON transferleri, sistem bildirimleri vb. ile karıştırılamayacak şekilde görüntülendiğinden emin olun. Bazen, hatta `symbol`, `name` ve `image`, kullanıcıları yanıltma amacıyla neredeyse orijinal gibi görünecek şekilde oluşturulacaktır.

TON kullanıcıları için dolandırıcılık olasılığını ortadan kaldırmak için, belirli jetton türleri için **orijinal jetton adresini** (Jetton ana sözleşmesi) araştırmanızı veya projenin resmi sosyal medya kanalını veya web sitesini takip etmenizi tavsiye ederiz. Dolandırıcılık olasılığını ortadan kaldırmak için varlıkları, [Tonkeeper ton-varlık listesi](https://github.com/tonkeeper/ton-assets) ile kontrol edin.
:::

### Jetton verilerini alma

Daha spesifik Jetton verilerini almak için sözleşmenin _get_ yöntemini `get_jetton_data()` kullanın.

Bu yöntem aşağıdaki verileri döndürür:

| İsim                 | Tür    | Açıklama          |
|----------------------|---------|----------------------|
| `total_supply`       | `int`   | bölünemez birimlerde ölçülen toplam jetton sayısı. |
| `mintable`           | `int`   | yeni jettonların basılıp basılamayacağını belirtir. Bu değer ya -1 (basılabilir) ya da 0 (basılamaz). |
| `admin_address`      | `slice` |                      |
| `jetton_content`     | `cell`  | [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) ile uyumlu veriler, daha fazla bilgi için `jetton meta veri ayrıştırma sayfasını` kontrol edin. |
| `jetton_wallet_code` | `cell`  |                      |

Ayrıca, zaten kodlanmış Jetton verilerini ve meta verileri almak için [Toncenter API](https://toncenter.com/api/v3/#/default/get_jetton_masters_api_v3_jetton_masters_get) üzerinden `/jetton/masters` yöntemini kullanmak da mümkündür. Ayrıca (js) [tonweb](https://github.com/toncenter/tonweb/blob/master/src/contract/token/ft/JettonMinter.js#L85) ve (js) [ton-core/ton](https://github.com/ton-core/ton/blob/master/src/jetton/JettonMaster.ts#L28), (go) [tongo](https://github.com/tonkeeper/tongo/blob/master/liteapi/jetton.go#L48) ve (go) [tonutils-go](https://github.com/xssnick/tonutils-go/blob/33fd62d754d3a01329ed5c904db542ab4a11017b/ton/jetton/jetton.go#L79), (python) [pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L742) ve birçok diğer `SDK'da` yöntemleri geliştirdik.

> tonweb kullanarak bir get yöntemini çalıştırma ve off-chain meta verileri için URL alma örneği:

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<JETTON_MASTER_ADDRESS>"});
const data = await jettonMinter.getJettonData();
console.log('Toplam arz:', data.totalSupply.toString());
console.log('Off-chain meta verilere URI:', data.jettonContentUri);
```

### Jetton minter

Daha önce belirtildiği gibi, jettonlar ya `mintable` ya da `non-mintable` olabilir.

Eğer mintable değillerse, mantık basit hale gelir—ilave token basmak için herhangi bir seçenek yoktur. Jettonları ilk kez basmak için, `ilk jettonunuzu basın` sayfasına bakın.

Eğer jettonlar mintable ise, ek jettonlar basmak için [minter sözleşmesinde](https://github.com/ton-blockchain/minter-contract/blob/main/contracts/jetton-minter.fc) özel bir fonksiyon bulunmaktadır. Bu fonksiyon, admin adresinden belirli bir opcode ile `internal message` göndererek çağrılabilir.

Eğer jetton yöneticisi jetton yaratımını kısıtlamak istiyorsa, bunu yapmanın üç yolu vardır:

1. Sözleşmenin kodunu güncelleyemez veya istemiyorsanız, yönetici mevcut yöneticiden sıfır adrese sahip olana devretmelidir. Bu, sözleşmeyi geçerli bir yönetici olmadan bırakır, dolayısıyla kimsenin jetton basmasını önler. Ancak, bu aynı zamanda jetton meta verilerinde herhangi bir değişiklik yapmayı da engeller.
2. Kaynak koduna erişiminiz varsa ve değiştirebiliyorsanız, sözleşmede jetton oluşturma sürecini iptal edecek bir işlev oluşturabilirsiniz ve basım işlevinde bu bayrağı kontrol etmek için bir ifade ekleyebilirsiniz.
3. Sözleşme kodunu güncelleyebiliyorsanız, zaten dağıtılmış sözleşmenin kodunu güncelleyerek kısıtlamalar ekleyebilirsiniz.

## Jetton cüzdan akıllı sözleşmesi
`Jetton cüzdanı` sözleşmeleri jettonları **göndermek**, **almak** ve **yakmak** için kullanılır. Her bir _jetton cüzdan sözleşmesi_, belirli kullanıcılar için cüzdan bakiyesine dair bilgileri saklar. Belirli durumlarda, jetton cüzdanları her jetton türü için bireysel jetton sahipleri için kullanılır.

`Jetton cüzdanları`, yalnızca Toncoin varlığını destekleyip yöneten (ör. v3R2 cüzdanları, yüksek yük cüzdanları ve diğerleri gibi) cüzdanlarla **karıştırılmamalıdır**; bunun dışında yalnızca belirli bir jetton türünü desteklemek ve yönetmek için tasarlanmıştır.

### Jetton Cüzdan Dağıtımı
`Jetton’ları` cüzdanlar arasında `aktarmak` için işlemler (mesajlar) belirli bir miktarda TON gerektirir. Bu, alıcının jettonları almadan önce bir jetton cüzdanı dağıtması gerekmediği anlamına gelir. Alıcının jetton cüzdanı otomatik olarak, göndericinin gerekli gaz ücretlerini ödemek için yeterli TON'a sahip olması durumunda dağıtılacaktır.

### Verilen bir kullanıcı için jetton cüzdan adreslerini alma
Bir `sahip adresi` (bir TON Cüzdan adresi) kullanarak bir `jetton cüzdanı` `adresini` almak için, `Jetton ana sözleşmesi`, `get_wallet_address(slice owner_address)` yöntemini sağlar.




> `/runGetMethod` yöntemi üzerinden `get_wallet_address(slice owner_address)` çalıştırın. Gerçek durumlarda (test durumları değil) her zaman cüzdanın gerçekten istenen Jetton Master'a atandığını kontrol etmek önemlidir. Daha fazla bilgi için kod örneğini kontrol edin.




```js
import TonWeb from 'tonweb';
const tonweb = new TonWeb();
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, { address: '<JETTON_MASTER_ADDRESS>' });
const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(new TonWeb.utils.Address('<OWNER_WALLET_ADDRESS>'));

// Cüzdanın gerçekten istenen Jetton Master'a atandığını kontrol etmek önemlidir:
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
  address: jettonWalletAddress
});
const jettonData = await jettonWallet.getData();
if (jettonData.jettonMinterAddress.toString(false) !== jettonMinter.address.toString(false)) {
  throw new Error('jetton cüzdanından gelen jetton minter adresi yapılandırma ile eşleşmiyor');
}

console.log('Jetton cüzdan adresi:', jettonWalletAddress.toString(true, true, true));
```




:::tip
Daha fazla örnek için `TON Cookbook` sayfasını okuyun.
:::


### Belirli bir Jetton cüzdanı için veri alma

Bir jetton cüzdan sözleşmesine kaydedilmiş hesabın bakiyesi, sahip tanımlama bilgileri ve diğer bilgiler almak için `get_wallet_data()` alma yöntemini kullanın.

Bu yöntem aşağıdaki verileri döndürür:

| İsim                 | Tür    |
|----------------------|---------|
| `balance`            | int     |
| `owner`              | slice   |
| `jetton`             | slice   |
| `jetton_wallet_code` | cell    |




> Daha önce kodlanmış jetton cüzdan verilerini almak için [Toncenter API](https://toncenter.com/api/v3/#/default/get_jetton_wallets_api_v3_jetton_wallets_get) üzerinden `/jetton/wallets` alma yöntemini kullanın.





```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const walletAddress = "EQBYc3DSi36qur7-DLDYd-AmRRb4-zk6VkzX0etv5Pa-Bq4Y";
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider,{address: walletAddress});
const data = await jettonWallet.getData();
console.log('Jetton bakiyesi:', data.balance.toString());
console.log('Jetton sahip adresi:', data.ownerAddress.toString(true, true, true));
// Jetton Master'ın gerçekten cüzdanı tanıyıp tanımadığını kontrol etmek önemlidir
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: data.jettonMinterAddress.toString(false)});
const expectedJettonWalletAddress = await jettonMinter.getJettonWalletAddress(data.ownerAddress.toString(false));
if (expectedJettonWalletAddress.toString(false) !== new TonWeb.utils.Address(walletAddress).toString(false)) {
  throw new Error('jetton minter cüzdanı tanımıyor');
}

console.log('Jetton ana adresi:', data.jettonMinterAddress.toString(true, true, true));
```




## Mesaj Düzenleri

:::tip Mesajlar
Mesajlar hakkında daha fazla bilgi için `buradan` okuyun.
:::

Jetton cüzdanları ile TON cüzdanları arasındaki iletişim aşağıdaki iletişim dizisi ile gerçekleşir:

![](../../../../images/ton/static/img/docs/asset-processing/jetton_transfer.svg)

#### Mesaj 0
`Gönderen -> gönderenin jetton cüzdanı`. _Transfer_ mesajı aşağıdaki verileri içerir:

| İsim                   | Tür       | Açıklama                                                                                                                                                                                                             |
|------------------------|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `query_id`             | uint64     | Uygulamaların üç mesajlaşma türünü `Transfer`, `Transfer bildirimi` ve `Aşırılıklar` birbirine bağlamasını sağlar. Bu sürecin doğru bir şekilde yürütülmesi için **her zaman benzersiz bir sorgu kimliği kullanmanız önerilir**. |
| `amount`               | coins      | Mesajla gönderilecek toplam `ton coin` miktarı.                                                                                                                                                                  |
| `destination`          | address    | jettonların yeni sahibi olacak adres                                                                                                                                                                                 |
| `response_destination` | address    | fazla ton coinlerini geri göndermek için kullanılan cüzdan adresi.                                                                                                                                                  |
| `custom_payload`       | maybe cell | Boyut her zaman >= 1 bit. Gönderen veya alıcı jetton cüzdanı için iç mantıkta kullanılan özel veriler.                                                                                                        |
| `forward_ton_amount`   | coins      | `ilerletme yükü` ile `transfer bildirimi mesajı` göndermek istiyorsanız 0'dan büyük olmalıdır. Bu, **`amount` değerinin bir parçasıdır** ve **`amount`'dan daha az olmalıdır**.                                                            |
| `forward_payload`      | maybe cell | Boyut her zaman >= 1 bit. İlk 32 bit = 0x0 ise bu sadece basit bir mesajdır.                                                                                                                                                          |

#### Mesaj 2'
`alacaklının jetton cüzdanı -> alacaklı`. Transfer bildirim mesajı. **Sadece** `forward_ton_amount` **sıfır değilse** gönderilir. Aşağıdaki verileri içerir:

| İsim              | Tür    |
|-------------------|---------|
| `query_id`        | uint64  |
| `amount`          | coins   |
| `sender`          | address |
| `forward_payload` | cell    |

Burada `gönderen` adresi Alice'in `Jetton cüzdanı` adresidir.

#### Mesaj 2''
`alacaklının jetton cüzdanı -> Gönderen`. Aşırı mesaj gövdesi. **Sadece, ücretleri ödedikten sonra herhangi bir ton coin kalmışsa** gönderilir. Aşağıdaki verileri içerir:

| İsim                 | Tür           |
|----------------------|----------------|
| `query_id`           | uint64         |

:::tip Jetton standardı
Jetton cüzdan sözleşmesi alanlarının ayrıntılı açıklamasını [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) `Jetton standardı` arayüz tanımında bulabilirsiniz.
:::

## Jetton transferleri yorumlar ve bildirimlerle nasıl gönderilir

Bu transfer, **ücretler** ve **transfer bildirim mesajı** için bazı ton coinleri gerektirir.

**Yorum** göndermek için `forward payload` ayarlamanız gerekir. **ilk 32 bit'i 0x0 olarak ayarlayın** ve **metninizi ekleyin**, `forward payload` `jetton notify 0x7362d09c` iç mesajında gönderilir. Bu, yalnızca `forward_ton_amount` > 0 olduğunda oluşturulacaktır.

:::info
Yorum ile jetton transferi için önerilen `forward_ton_amount` 1 nanotondur.
:::

Son olarak, `Excess 0xd53276db` mesajını almak için `response destination` ayarlamanız gerekir.

Bazen, bir jetton gönderirken `709` hatası ile karşılaşabilirsiniz. Bu hata, mesaja eklenen Toncoin miktarının göndermek için yeterli olmadığını belirtir. `Toncoin > to_nano(TRANSFER_CONSUMPTION) + forward_ton_amount` olduğundan emin olun; bu genellikle >0.04'tür. Aksi takdirde, bu miktar büyükse, ilerleme yükselebilir. Komisyon, çeşitli faktörlere bağlıdır; bunlar arasında Jetton kod detayları ve alıcı için yeni bir Jetton cüzdanının dağıtılıp dağıtılmayacağı bulunmaktadır. Mesaja biraz Toncoin eklemeniz ve `Excess 0xd53276db` mesajlarını almak için adresinizi `response_destination` olarak ayarlamanız önerilir. Örneğin, mesajınıza 0.05 TON ekleyebilir ve `forward_ton_amount`'ı 1 nanoton olarak ayarlayabilirsiniz (bu miktar TON, `jetton notify 0x7362d09c` mesajına eklenecektir).

Ayrıca, jettonların başarıyla gönderildiğini ancak başka hesaplamaların yapılmadığını belirten `cskip_no_gas` hatası ile karşılaşabilirsiniz. Bu, `forward_ton_amount` değerinin 1 nanoton ile eşit olduğu durumlarda yaygın bir durumdur.

:::tip
Yorumlarla jetton göndermek için _"en iyi uygulamalar"_ `en iyi uygulamaları` kontrol edin.
:::

---

## Jetton off-chain işleme

:::info
İşlem Onayı
TON işlemleri yalnızca bir onaydan sonra geri alınamaz. En iyi kullanıcı deneyimi için, işlemler TON Blockchain'de tamamlandığında ek blokları beklemekten kaçınılması önerilir. Daha fazla bilgi için [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3) sayfasını okuyun.
:::

Jetton'ları kabul etmenin iki yolu vardır:
- **merkezi sıcak cüzdan** içinde.
- **her bir kullanıcı** için **ayrı bir adres** kullanan bir cüzdan kullanarak.

Güvenlik nedenleriyle, **ayrı Jettonlar** için **ayrı sıcak cüzdanlar** bulundurulması tercih edilir (her varlık tipi için birçok cüzdan).

Fonları işlerken, otomatik depozito ve çekim işlemlerine katılmayan fazla fonları saklamak için bir soğuk cüzdan sağlamanız da önerilir.

### Varlık işleme ve başlangıç doğrulaması için yeni Jettonlar eklemek

1. Doğru `akıllı sözleşme adresini` bulun.
2. `meta verileri` alın.
3. `dolandırıcılığı` kontrol edin.

### Bilinmeyen bir Jetton'un tanımlanması alındığında bir transfer bildirimi mesajı

Eğer cüzdanınıza bilinmeyen bir Jetton ile ilgili bir transfer bildirimi mesajı gelirse, cüzdanınız belirli bir Jetton'u tutmak üzere oluşturulmuştur.

`Transfer notification` içeriğini içeren iç mesajın gönderim adresi yeni Jetton cüzdanının adresidir.  
`Transfer notification` `gövdesindeki` `gönderici` alanıyla karıştırılmamalıdır.

1. `cüzdan verilerini almak` yoluyla yeni Jetton cüzdanı için Jetton ana adresini alın.
2. Jetton ana sözleşmeyi kullanarak, cüzdan adresiniz (sahip olarak) için Jetton cüzdan adresini alın: `Verilen bir kullanıcı için Jetton cüzdan adresini almak`
3. Ana sözleşme tarafından döndürülen adres ile cüzdan tokeninin gerçek adresini karşılaştırın.
   Eğer eşleşiyorsa, ideal olan budur. Değilse, muhtemelen sahte bir Jetton gönderildi.
4. Jetton meta verilerini alın: `Jetton meta verilerini almak`.
5. Dolandırıcılığın belirtileri için `symbol` ve `name` alanlarını kontrol edin. Gerekirse kullanıcıyı uyarın. `Varlık işleme ve başlangıç kontrolleri için yeni Jettonlar ekleme`.

---

### Kullanıcılardan merkezi bir cüzdan üzerinden Jetton kabul etmek

:::info
Tek bir cüzdana gelen işlemlerde darboğaz oluşumunu önlemek için, birden fazla cüzdan üzerinden depozitoların kabul edilmesi ve bu cüzdanların sayısının gerektiği kadar artırılması önerilir.
:::

:::caution
İşlem Bildirimi  
Her hizmetin, bir jetton çekildiğinde `forward_ton_amount` değerini 0.000000001 TON (1 nanoton) olarak ayarlaması beklenmektedir. Aksi takdirde, Jetton Bildirimleri, [başarılı transfer](https://testnet.tonviewer.com/transaction/a0eede398d554318326b6e13081c2441f8b9a814bf9704e2e2f44f24adb3d407) yapılmayacak ve diğer CEX'ler ve hizmetler tarafından işlenemeyecektir.
:::

Bu senaryoda, ödeme hizmeti her gönderici için merkezi cüzdanın adresini ve gönderilen miktarları açıklayan benzersiz bir not tanımlayıcısı oluşturur. Gönderen, belirlenen merkezi adrese, yorumda zorunlu olan not ile birlikte token gönderir.

**Bu yönteminin avantajları:** Bu yöntem çok basit bir yöntemdir çünkü tokenler kabul edilirken ek bir ücret alınmaz ve doğrudan sıcak cüzdanda alınır.

**Bu yönteminin dezavantajları:** Bu yöntem, tüm kullanıcıların transferle birlikte bir yorum eklemelerini gerektirir ve bu da daha fazla depozit hatası (unutulmuş notlar, yanlış notlar vb.) ile sonuçlanabilir; bu da destek personeli için daha yüksek bir iş yükü anlamına gelir.

Tonweb örnekleri:

1. [Yorumlarla bireysel Sıcak cüzdana Jetton yatırımı kabul etme](https://github.com/toncenter/examples/blob/main/deposits-jettons.js)
2. [Jetton çekim örneği](https://github.com/toncenter/examples/blob/main/withdrawals-jettons.js)

---

#### Hazırlıklar

1. `Kabul edilen Jettonlar listesini hazırlayın` (Jetton ana adresleri).
2. Soğuk cüzdan dağıtımını gerçekleştirin (eğer Jetton çekimleri beklenmiyorsa v3R2 kullanarak; Jetton çekimleri bekleniyorsa yüksek yük v3 kullanarak). `Cüzdan dağıtımı`.
3. Cüzdanı başlatmak için sıcak cüzdan adresini kullanarak test Jetton transferi gerçekleştirin.

---

#### Gelen Jettonları işleme

1. Kabul edilen Jettonlar listesini yükleyin.
2. `Verilen kullanıcı için Jetton cüzdan adresini alın` ve dağıtılan sıcak cüzdan için.
3. Her Jetton cüzdanı için Jetton ana adresini almak için `cüzdan verilerini alın`.
4. 1. adımda ve 3. adımda (doğrudan yukarıda) Jetton ana sözleşmelerinin adreslerini karşılaştırın.
   Eğer adresler eşleşmiyorsa, bir Jetton adresi doğrulama hatası bildirilmelidir.
5. Bir sıcak cüzdan hesabı kullanarak en son işlenmemiş işlemlerin bir listesini alın ve
   sıralayın (her bir işlemi birer birer kontrol ederek). Şuna bakın: `Sözleşmelerin işlemlerini kontrol etme`.
6. İşlemler için girdi mesajını (in_msg) kontrol edin ve girdi mesajından kaynak adresini alın. [Tonweb örneği](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L84)
7. Eğer kaynak adresi bir Jetton cüzdan içindeki adresle eşleşiyorsa, işlemi işlemeye devam etmek gerekir.
   Aksi takdirde, işlemi atlayın ve bir sonraki işlemi kontrol edin.
8. Mesaj gövdesinin boş olmadığından ve mesajın ilk 32 bitinin `transfer notification` op kodu `0x7362d09c` ile eşleştiğinden emin olun.  
   [Tonweb örneği](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L91)  
   Eğer mesaj gövdesi boşsa veya op kodu geçersizse - işlemi atlayın.
9. Mesaj gövdesinin diğer verilerini okuyun; `query_id`, `amount`, `sender`, `forward_payload`.  
   `Jetton kontrat mesaj düzenlemeleri`, [Tonweb örneği](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L105)
10. `forward_payload` verisinden metin yorumlarını almak için çaba gösterin. İlk 32 bit, metin yorum op kodu `0x00000000` ile eşleşmelidir ve kalan - UTF-8 kodlu metin olmalıdır.  
    [Tonweb örneği](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L110)
11. Eğer `forward_payload` verisi boşsa veya op kodu geçersizse - işlemi atlayın.
12. Alınan yorumu kaydedilen notlarla karşılaştırın. Eşleşme varsa (kullanıcı kimliği her zaman mümkündür) - transferi yatırın.
13. 5. adımından başlayarak işlemi tekrarlayın.

---

### Kullanıcı depozit adreslerinden Jetton kabul etme

Kullanıcı depozit adreslerinden Jetton kabul etmek için, ödeme hizmetinin her katılımcı için kendi bireysel adresini (depozit) oluşturması gerekmektedir. Bu durumda hizmet sağlanması, yeni depozitolar oluşturma, işlemler için blokları tarama, depozitolardan sıcak cüzdana para çekme gibi birkaç paralel sürecin yürütülmesini kapsamaktadır.

Bir sıcak cüzdan, her Jetton türü için bir Jetton cüzdanı kullanabileceğinden, depozitoları başlatmak için birden fazla cüzdan oluşturulması gerekmektedir. Çok sayıda cüzdan oluşturmak ancak aynı zamanda bunları bir seed phrase (veya özel anahtar) ile yönetmek için, cüzdan oluştururken farklı bir `subwallet_id` belirtmek gerekmektedir. TON'da, bir alt cüzdan oluşturmak için gerekli olan işlevsellik v3 cüzdanlar ve üstü sürümlerde desteklenmektedir.

---

#### Tonweb'de bir alt cüzdan oluşturma

```js
const WalletClass = tonweb.wallet.all['v3R2'];
const wallet = new WalletClass(tonweb.provider, {
    publicKey: keyPair.publicKey,
    wc: 0,
    walletId: <SUBWALLET_ID>,
});
```

---

#### Hazırlık

1. `Kabul edilen Jettonlar listesini hazırlayın`.
2. Soğuk cüzdan dağıtımını gerçekleştirin (eğer Jetton çekimleri beklenmiyorsa v3R2 kullanarak; Jetton çekimleri bekleniyorsa yüksek yük v3 kullanarak). `Cüzdan dağıtımı`.

---

#### Depozitolar oluşturma

1. Kullanıcı için yeni bir depozito oluşturma talebini kabul edin.
2. Sıcak cüzdan seed'ine dayalı olarak yeni bir alt cüzdan (/v3R2) adresi oluşturun. `Tonweb'de bir alt cüzdan oluşturma`
3. Alınan adres kullanıcıya Jetton yatırımları için kullanılacak adres olarak verilebilir (bu, depozit Jetton cüzdanının sahibinin adresidir). Cüzdanın başlatılması gereksizdir, bu işlem Jetton'ları depozito yaparken gerçekleştirilebilir.
4. Bu adres için Jetton cüzdan adresini Jetton ana sözleşmesi aracılığıyla hesaplamanız gerekmektedir.  
   `Verilen bir kullanıcı için Jetton cüzdan adresini almak`.
5. Jetton cüzdan adresini işlem izleme için adres havuzuna ekleyin ve alt cüzdan adresini kaydedin.

---

#### İşlemleri işleme

:::info
İşlem Onayı  
TON işlemleri yalnızca bir onaydan sonra geri alınamaz. En iyi kullanıcı deneyimi için, işlemler TON Blockchain'de tamamlandığında ek blokları beklemekten kaçınılması önerilir. Daha fazla bilgi için [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3) sayfasını okuyun.
:::

Mesajdan alınan Jetton miktarını belirlemek her zaman mümkün değildir, çünkü Jetton cüzdanları `transfer notification`, `excesses` ve `internal transfer` mesajlarını göndermeyebilir. Bunlar standart değildir. Bu, `internal transfer` mesajının kodlanıp kodlanamayacağına dair bir garanti olmadığı anlamına gelir.

Bu nedenle, cüzdanda alınan miktarı belirlemek için, get yöntemini kullanarak bakiyeleri talep etmek gerekir. Anahtar verileri alırken bloklar, belirli bir blok üzerinde hesabın durumu için kullanılır.  
[Blok kabulü için hazırlık, Tonweb kullanılarak](https://github.com/toncenter/tonweb/blob/master/src/test-block-subscribe.js).

Bu işlem aşağıdaki gibi gerçekleştirilir:

1. Blok kabulü için hazırlık (sistemi yeni bloklar almaya hazırlamak).
2. Yeni bir blok alın ve önceki blok ID'sini kaydedin.
3. Bloklardan işlemleri alın.
4. Sadece depozit Jetton cüzdan havuzundaki adreslerle kullanılan işlemleri filtreleyin.
5. Daha ayrıntılı verileri almak için `transfer notification` gövdesini kullanarak mesajları kodlayın; `sender` adresi, Jetton `miktarı` ve yorum. (Bknz: `Gelen Jettonları işleme`)
6. Eğer `transfer notification` ve `excesses` için op kodlarını içermeyen kodlanamayan çıkış mesajlarıyla en az bir işlem varsa veya hesapta hiç çıkış mesajı yoksa, o zaman mevcut blok için get yöntemini kullanarak Jetton bakiyesi talep edilmelidir; önceki blok, bakiyelerdeki farkı hesaplamak için kullanılacaktır. Şimdi, her bir blok içerisinde gerçekleştirilen işlemler nedeniyle toplam bakiye depozit değişiklikleri açığa çıkmaktadır.
7. Jetton'ların tanımlanamayan bir transferinin (transfer bildirimi olmadan) benzersiz bir tanımlayıcı olarak, yalnızca bir böyle işlem veya blok verileri kullanılarak işlem verileri kullanılabilir (eğer bir bloked birden çok varsa).
8. Şimdi, depozito bakiyesinin doğru olduğundan emin olmanız gerekir. Eğer depozito bakiyesi sıcak cüzdan ile mevcut Jetton cüzdanı arasında bir transfer başlatmak için yeterli miktarda ise, Jetton'ların çekilmesi gerekir, böylece cüzdan bakiyesi düşmüş olur.
9. 2. adımından başlayarak işlemi tekrarlayın.

---

#### Depozitlerden yapılan çekimler

Her depozito yenilendiğinde bir depozitodan sıcak cüzdana transfer yapılmamalıdır, çünkü transfer işlemi için TON'da bir komisyon alınır (ağ gaz ücretleriyle ödenir). Transferi kayda değer kılmak için gereken belirli bir minimum Jetton miktarı (ve dolayısıyla depozito miktarı) belirlenmelidir.

Varsayılan olarak, Jetton depozito cüzdanı sahipleri başlatılmamıştır. Bunun nedeni, depolama ücretlerini ödemek için önceden belirlenmiş bir gerekliliğin olmamasıdır. Jetton depozito cüzdanları, `transfer` gövdesine sahip mesajlar gönderdiklerinde dağıtılabilir ve daha sonra hemen imha edilebilir. Bunu yapmak için mühendis, mesaj göndermek için özel bir mekanizma kullanmalıdır: `128 + 32`.

1. Sıcak cüzdana çekim yapmak için işaretlenen depozitoların listesini alın.
2. Her depozito için kaydedilen sahip adreslerini alın.
3. Ardından, her sahip adresine (birkaç böyle mesajı bir grup olarak birleştirerek) yüksek yük cüzdanından ekli bir TON Jetton miktarıyla mesajlar gönderilir. Bu, v3R2 cüzdan başlatma işlemi için kullanılan ücretlerin + `transfer` gövdesiyle mesaj göndermenin ücretleri  + `forward_ton_amount` ile ilgili bir TON miktarını (eğer gerekliyse) ekleyerek belirlenir. Ekli TON miktarı, v3R2 cüzdan başlatma ücreti (değer) + `transfer` gövdesiyle mesaj göndermenin ücreti (değer) + `forward_ton_amount` için eklenen bir TON miktarı (değer) (eğer gerekliyse) kullanılarak belirlenir.
4. Adresteki bakiye sıfırdan farklı hale geldiğinde, hesap durumu değişir. Birkaç saniye bekleyin ve hesabın durumunu kontrol edin; kısa süre içinde `nonexists` durumundan `uninit` durumuna geçecektir.
5. `uninit` durumu olan her sahip adresi için, cüzdanın başlatılması ve cüzdan Jetton'u için depozitoya yatırılması amacıyla `transfer` mesajı özelliği ile dış bir mesaj göndermek gerekmektedir. Kullanıcı, `destination` ve `response destination` olarak sıcak cüzdan adresini belirtmelidir.  
   Bir metin yorum eklemek, transferin tanımlanmasını kolaylaştırabilir.
6. Jetton'un sıcak cüzdan adresine teslimatını doğrulamak, `gelen Jettonları işleme hakkında burada` belirtilen bilgileri dikkate alarak mümkündür.

---

### Jetton çekimleri

:::info
Önemli  
**Önerilir** ki `jetton transferinin nasıl çalıştığını` ve `yorumla jetton gönderme` makalelerini okumadan ve anlamadan bu bölümü okumayın.
:::

Aşağıda, jetton çekimlerini işlemenin adım adım nasıl olduğu anlatılmaktadır.

Jetton'ları çekmek için, cüzdan ilgili Jetton cüzdanına `transfer` gövdesi ile mesajlar gönderir. Jetton cüzdanı daha sonra Jetton'ları alıcıya gönderir. Bir `transfer notification` tetiklemek için bazı TON'ları (en az 1 nanoTON) `forward_ton_amount` olarak eklemek önemlidir (ve `forward_payload` için isteğe bağlı bir yorum). Şuna bakın: `Jetton kontrat mesaj düzenlemeleri`

---

#### Hazırlık

1. Çekimler için Jettonlar listesini hazırlayın: `Varlık işleme ve başlangıç doğrulaması için yeni Jettonlar ekleme`
2. Soğuk cüzdan dağıtımını başlatın. Yüksek yük v3 önerilmektedir. `Cüzdan Dağıtımı`
3. Jetton cüzdanını başlatmak ve bakiyesini yenilemek için sıcak cüzdan adresi kullanarak Jetton transferi gerçekleştirin.

#### Paraçekim İşlemleri

1. İşlenmiş Jettonların bir listesini yükleyin.
2. Dağıtılan sıcak cüzdan için Jetton cüzdan adreslerini alın: `Belirli bir kullanıcı için Jetton cüzdan adreslerini nasıl alabilirim`
3. Her Jetton cüzdanı için Jetton ana adreslerini alın: `Jetton cüzdanları için verileri nasıl alabilirim`. Bir `jetton` parametresi gereklidir (bu, aslında Jetton ana sözleşmesinin adresidir).
4. 1. ve 3. adımlardaki Jetton ana sözleşmelerinden gelen adresleri karşılaştırın. Eğer adresler eşleşmiyorsa, Jetton adresi doğrulama hatası bildirilmelidir.
5. Alınan para çekme talepleri, aslında Jetton türünü, transfer edilen miktarı ve alıcı cüzdan adresini belirtir.
6. Para çekimini gerçekleştirmek için Jetton cüzdanının bakiyesini kontrol edin.
7. Bir `mesaj` oluşturun.
8. Yüksek yük cüzdanı kullanırken, birden fazla mesajın toplanması ve tek bir seferde gönderilmesi, ücretleri optimize etmek için önerilir.
9. Dışa giden mesajlar için son kullanma zamanını kaydedin (bu, cüzdanın mesajı başarılı bir şekilde işleyebileceği zamandır; bu işlem tamamlandıktan sonra cüzdan mesajı kabul etmeyecektir).
10. Tek bir mesaj gönderin veya birden fazla mesaj (toplu mesajlaşma) gönderin.
11. Sıcak cüzdan hesabındaki en son işlenmemiş işlemlerin listesini alın ve üzerinde yineleme yapın. Daha fazla bilgi için buraya bakın: `Sözleşmelerin işlemlerini kontrol etme`,  
    [Tonweb örneği](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-single-wallet.js#L43) veya  
    Toncenter API `/getTransactions` yöntemini kullanın.
12. Hesaptaki dışa giden mesajlara bakın.
13. Eğer `transfer` op kodu ile bir mesaj varsa, `query_id` değerini almak için bu mesajı çözmelisiniz. Alınan `query_id` değerleri, başarıyla gönderildi olarak işaretlenmelidir.

14. Şu anda taranan işlemin işlenmesi için geçen süre sona erme zamanından büyükse ve verilen `query_id` ile dışa giden mesaj bulunamazsa, talebin (bu isteğe bağlıdır) sona ermiş olarak işaretlenmesi ve güvenle yeniden gönderilmesi gerekmektedir.
15. Hesaptaki gelen mesajları kontrol edin.
16. Eğer `Excess 0xd53276db` op kodunu kullanan bir mesaj varsa, bu mesajı çözmeli ve `query_id` değerini almalısınız. Bulunan `query_id`, başarıyla teslim edildi olarak işaretlenmelidir.
17. 5. adıma dönün. Başarıyla gönderilmeyen süresi dolmuş talepler, para çekme listesine geri alınmalıdır.

---

## Jetton Zincir İçi İşleme

Genel olarak, jettonları kabul etmek ve işlemek için, iç mesajlardan sorumlu olan bir mesaj işleyici `op=0x7362d09c` op kodunu kullanır.

:::info İşlem Onayı
TON işlemleri sadece bir onay sonrasında geri alınamaz. En iyi kullanıcı deneyimi için, işlemler TON Blockchain üzerinde nihai hale geldiğinde ek blokların beklenmemesi önerilmektedir. Daha fazla bilgi için [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3) belgesine göz atın.
:::

### Zincir İçi İşleme Önerileri
Aşağıda, **zincir içi jetton işleme** gerçekleştirirken dikkate alınması gereken bir `öneriler listesi` bulunmaktadır:

1. **Gelen jettonları** cüzdan türüne göre tanımlayın, Jetton ana sözleşmesine göre değil. Başka bir deyişle, sözleşmeniz belirli bir jetton cüzdanı ile etkileşimde bulunmalıdır (belirsiz bir cüzdanla değil, belirli bir Jetton ana sözleşmesini kullanarak).
2. Jetton Cüzdanı ve Jetton Ana Sözleşmesi bağlandığında, **kontrol edin** ki bu **bağlantı iki yönlüdür**, cüzdan ana sözleşmesini tanır ve tersine. Örneğin, eğer sözleşme sisteminiz bir jetton cüzdanından (bu cüzdanın MySuperJetton'u ana sözleşmesi olarak kabul ettiğini) bir bildirim alırsa, transfer bilgileri kullanıcıya gösterilmeden önce, `simge`, `isim` ve `görüntü` gibi MySuperJetton sözleşmesine ait bilgilerin doğruluğundan emin olun. Ayrıca, eğer sözleşme sisteminiz bir sebepten ötürü MySuperJetton veya MySuperJetton ana sözleşmelerini kullanarak jetton göndermesi gerekiyorsa, cüzdan X'in aynı sözleşme parametrelerini kullanan bir cüzdan olduğundan emin olun.  
   Ek olarak, X'e bir `transfer` isteği göndermeden önce MySuperJetton'un ana sözleşmesi olarak tanındığından emin olun.
3. **Dağıtık finansmanın (DeFi) gerçek gücü**, protokollerin üst üste yığılabilme yeteneğine dayanmaktadır. Örneğin, jetton A jetton B ile takas edilirse, bu daha sonra bir kredi protokolünde kaldıraç olarak kullanılır (bir kullanıcı likidite sağlarken) ve bu, bir NFT satın almak için kullanılır .... ve bu şekilde devam eder. Bu nedenle, sözleşmenin yalnızca zincir dışı kullanıcıları değil, zincir içi varlıkları da nasıl hizmet edebileceğini düşünün ve bir transfer bildirimine eklenen tokenizasyon değerini ekleyerek, bir transfer bildirimiyle gönderilen özel bir yük oluşturun.
4. **Farkında olun** ki tüm sözleşmeler aynı standartları takip etmez. Ne yazık ki, bazı jettonlar saldırgan olabilir (saldırı tabanlı vektörler kullanarak) ve sadece unsuspecting kullanıcıları hedef almak amacıyla oluşturulmuştur. Güvenlik açısından, söz konusu protokol birden fazla sözleşmeden oluşuyorsa, aynı türde çok sayıda jetton cüzdanı oluşturmamanız önerilir. Özel olarak, depo sözleşmesi, hazinedeki sözleşme veya kullanıcı hesap sözleşmesi vb. arasında protokol içinde jetton göndermeyin. Saldırganlar, transfer bildirimlerini, jetton miktarlarını veya yük parametrelerini sahteleyerek sözleşme mantığına müdahale etmeyi amaçlayabilir. Saldırı potansiyelini azaltmak için sistemde her jetton için yalnızca bir cüzdan kullanarak işlemleri gerçekleştirin (tüm depo ve para çekme işlemleri için).
5. Her bir bireyselleştirilmiş jetton için alt sözleşmeler oluşturmak da **genellikle iyi bir fikirdir** adres taklidi olasılığını azaltmak için (örneğin, jetton B'ye göndermek için jetton A için tasarlanmış bir sözleşme kullanılırken).
6. **Kesinlikle önerilir** ki sözleşme düzeyinde bölünemeyen jetton birimleri ile çalışın. Ondalık ile ilgili mantık genellikle kullanıcı arayüzünün (UI) görünümünü geliştirmek için kullanılır ve sayısal zincir içi kayıt tutma ile ilgili değildir.

:::note
**Daha fazla bilgi** için [CertiK'in FunC ile Güvenli Akıllı Sözleşme Programlaması](https://blog.ton.org/secure-smart-contract-programming-in-func) makalesini okuyabilirsiniz; geliştirme sürecinde **tüm akıllı sözleşme istisnalarını yönetmeleri** önerilir, böylece uygulama geliştirme sırasında atlanmazlar.
:::

---

## Jetton Cüzdanı İşleme Önerileri
Genel olarak, zincir dışı jetton işleme için kullanılan tüm doğrulama prosedürleri cüzdanlar için de uygundur. Jetton cüzdanı işlemeyi gerçekleştirmek için en önemli önerilerimiz aşağıdaki gibidir:

1. Bir cüzdan, bilinmeyen bir jetton cüzdanından transfer bildirimi aldığında, jetton cüzdanına ve ana adresine güvenmek **hayati önem taşır** çünkü bu, kötü niyetli bir sahte olabilir. Kendinizi korumak için, sağlanan adresi kullanarak Jetton Ana Sözleşmesini kontrol edin ve doğrulama süreçlerinizin jetton cüzdanını meşru olarak tanımasını sağlayın. Cüzdanı güvenilir bulduktan ve meşru olarak doğruladıktan sonra, cüzdanın hesap bakiyelerinize ve diğer cüzdan içi verilere erişmesine izin verebilirsiniz. Eğer Jetton Ana Sözleşmesi bu cüzdanı tanımıyorsa, jetton transferlerinizi başlatmamanız veya açıklamamanız ve yalnızca gelen TON transferlerini (transfer bildirimlerine ekli TONcoin) göstermeniz tavsiye edilir.
2. Pratikte, kullanıcı jetton cüzdanıyla değil, bir Jetton ile etkileşimde bulunmak istiyorsa. Başka bir deyişle, kullanıcılar `EQAjN...`/`EQBLE...` yerine wTON/oUSDT/jUSDT, jUSDC, jDAI gönderiyorlar. Bu genellikle, bir kullanıcı bir jetton transferi başlatırken cüzdanın, transfer isteğini başlatacak olan ilgili jetton ana sözleşmesini sorduğu anlamına gelir. Jetton cüzdanına bir transfer isteği göndermeden önce, bu verilerin ana sözleşmeden (ana sözleşme) gelişine asla körü körüne güvenmemeniz **kritik öneme sahiptir**. Her zaman, jetton cüzdanının gerçekten kendisine ait olduğu Jetton Ana Sözleşmesine uygun olduğunu doğrulamalısınız.
3. **Farkında olun** ki saldırgan Jetton Ana Sözleşmeleri/jetton cüzdanları **zamanla** cüzdanlarını/anasözleşmelerini değiştirebilir. Bu nedenle, kullanıcıların etkileşimde bulundukları her cüzdanın meşruiyetini kontrol etmeleri ve her kullanım öncesinde gerekli araştırmaları yapmaları önemlidir.
4. **Her zaman, jettonları arayüzünüzde TON transferleri, sistem bildirimleri vb. ile **karıştırmayacak şekilde** görüntülediğinizden emin olun. Hatta `simge`, `isim` ve `görüntü` parametreleri kullanıcıları yanıltacak şekilde tasarlanabilir ve bunlardan etkilenenler potansiyel dolandırıcılık kurbanları haline gelebilir. Kötü niyetli jettonların, TON transferlerini, bildirim hatalarını, ödül kazançlarını veya varlık dondurma bildirimlerini taklit etmek için kullanıldığı birkaç örnek olmuştur.
5. Kötü niyetli aktörlerin sahte jettonlar oluşturmasına karşı her zaman dikkatli olun; kullanıcıların ana kullanıcı arayüzlerinde istenmeyen jettonları ortadan kaldırabilmeleri için gereken işlevselliği sağlamaları iyi bir fikirdir.

Yazan:  
[kosrk](https://github.com/kosrk),  
[krigga](https://github.com/krigga),  
[EmelyanenkoK](https://github.com/EmelyanenkoK/) ve  
[tolya-yanot](https://github.com/tolya-yanot/).

---

## En İyi Uygulamalar

Test etmeye hazır örnekler istiyorsanız `SDK'lar` bölümüne göz atın ve çalıştırmayı deneyin. Aşağıda, jetton işleme konusunda anlayışınızı artıracak kod örnekleri bulunmaktadır.

### Yorumla Jetton Gönderme





Kaynak kodu


```js
// ilk 4 bayt, metin yorumunun etiketi
const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode('text comment')]);

await wallet.methods.transfer({
  secretKey: keyPair.secretKey,
  toAddress: JETTON_WALLET_ADDRESS, // Jetton göndericisinin Jetton cüzdan adresi
  amount: TonWeb.utils.toNano('0.05'), // transfer mesajına eklenmiş toplam TON miktarı
  seqno: seqno,
  payload: await jettonWallet.createTransferBody({
    jettonAmount: TonWeb.utils.toNano('500'), // Jetton miktarı (temel bölünemeyen birimlerde)
    toAddress: new TonWeb.utils.Address(WALLET2_ADDRESS), // alıcı kullanıcının cüzdan adresi (Jetton cüzdanı değil)
    forwardAmount: TonWeb.utils.toNano('0.01'), // Transfer bildirim mesajını aktarmak için bazı TON miktarı
    forwardPayload: comment, // Transfer bildirim mesajı için metin yorumu
    responseAddress: walletAddress // komisyonlar düşüldükten sonra TON'ları göndericinin cüzdan adresine geri gönderin
  }),
  sendMode: 3,
}).send()
```








Kaynak kodu


```go
client := liteclient.NewConnectionPool()

// testnet hafif sunucusuna bağlan
err := client.AddConnectionsFromConfigUrl(context.Background(), "https://ton.org/global.config.json")
if err != nil {
   panic(err)
}

ctx := client.StickyContext(context.Background())

// ton api hafif bağlantı sarmalayıcıyı başlat
api := ton.NewAPIClient(client)

// hesap için anahtar kelimeler, herhangi bir cüzdanla veya wallet.NewSeed() metodunu kullanarak oluşturabilirsiniz
words := strings.Split("birth pattern then forest walnut then phrase walnut fan pumpkin pattern then cluster blossom verify then forest velvet pond fiction pattern collect then then", " ")

w, err := wallet.FromSeed(api, words, wallet.V3R2)
if err != nil {
   log.Fatalln("FromSeed err:", err.Error())
   return
}

token := jetton.NewJettonMasterClient(api, address.MustParseAddr("EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw"))

// jetton cüzdanımızı bulun
tokenWallet, err := token.GetJettonWallet(ctx, w.WalletAddress())
if err != nil {
   log.Fatal(err)
}

amountTokens := tlb.MustFromDecimal("0.1", 9)

comment, err := wallet.CreateCommentCell("Hello from tonutils-go!")
if err != nil {
   log.Fatal(err)
}

// alıcının cüzdan adresi (jetton cüzdanı değil, sıradan)
to := address.MustParseAddr("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")
transferPayload, err := tokenWallet.BuildTransferPayload(to, amountTokens, tlb.ZeroCoins, comment)
if err != nil {
   log.Fatal(err)
}

// TON bakiyeniz 0.05'ten fazla olmalıdır
msg := wallet.SimpleMessage(tokenWallet.Address(), tlb.MustFromTON("0.05"), transferPayload)

log.Println("işlem gönderiliyor...")
tx, _, err := w.SendWaitTransaction(ctx, msg)
if err != nil {
   panic(err)
}
log.Println("işlem onaylandı, hash:", base64.StdEncoding.EncodeToString(tx.Hash))
```








Kaynak kodu


```py
my_wallet = Wallet(provider=client, mnemonics=my_wallet_mnemonics, version='v4r2')

# TonCenterClient ve LsClient için
await my_wallet.transfer_jetton(destination_address='address', jetton_master_address=jetton.address, jettons_amount=1000, fee=0.15) 

# tüm istemciler için
await my_wallet.transfer_jetton_by_jetton_wallet(destination_address='address', jetton_wallet='your jetton wallet address', jettons_amount=1000, fee=0.1)  
```









Kaynak kodu


```py
from pytoniq import LiteBalancer, WalletV4R2, begin_cell
import asyncio

mnemonics = ["your", "mnemonics", "here"]

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)
    USER_ADDRESS = wallet.address
    JETTON_MASTER_ADDRESS = "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"
    DESTINATION_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"

    USER_JETTON_WALLET = (await provider.run_get_method(address=JETTON_MASTER_ADDRESS,
                                                        method="get_wallet_address",
                                                        stack=[begin_cell().store_address(USER_ADDRESS).end_cell().begin_parse()]))[0].load_address()
    forward_payload = (begin_cell()
                      .store_uint(0, 32) # TextComment op kodu
                      .store_snake_string("Comment")
                      .end_cell())
    transfer_cell = (begin_cell()
                    .store_uint(0xf8a7ea5, 32)          # Jetton Transfer op kodu
                    .store_uint(0, 64)                  # query_id
                    .store_coins(1 * 10**9)             # Nanojetton cinsinden transfer edilecek jetton miktarı
                    .store_address(DESTINATION_ADDRESS) # Hedef adres
                    .store_address(USER_ADDRESS)        # Yanıt adresi
                    .store_bit(0)                       # Özel yük yok
                    .store_coins(1)                     # Nanoton cinsinden transfer için TON miktarı
                    .store_bit(1)                       # forward_payload'i referans olarak sakla
                    .store_ref(forward_payload)         # İleri yük
                    .end_cell())

    await wallet.transfer(destination=USER_JETTON_WALLET, amount=int(0.05*1e9), body=transfer_cell)
    await provider.close_all()

asyncio.run(main())
```






### Jetton Transfer'ı yorum ayrıştırması ile kabul et






Kaynak kod


```ts
import {
    Address,
    TonClient,
    Cell,
    beginCell,
    storeMessage,
    JettonMaster,
    OpenedContract,
    JettonWallet,
    Transaction
} from '@ton/ton';


export async function retry<T>(fn: () => Promise<T>, options: { retries: number, delay: number }): Promise<T> {
    let lastError: Error | undefined;
    for (let i = 0; i < options.retries; i++) {
        try {
            return await fn();
        } catch (e) {
            if (e instanceof Error) {
                lastError = e;
            }
            await new Promise(resolve => setTimeout(resolve, options.delay));
        }
    }
    throw lastError;
}

export async function tryProcessJetton(orderId: string) : Promise<string> {

    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'TONCENTER-API-KEY', // https://t.me/tonapibot
    });

    interface JettonInfo {
        address: string;
        decimals: number;
    }

    interface Jettons {
        jettonMinter : OpenedContract<JettonMaster>,
        jettonWalletAddress: Address,
        jettonWallet: OpenedContract<JettonWallet>
    }

    const MY_WALLET_ADDRESS = 'INSERT-YOUR-HOT-WALLET-ADDRESS'; // sizin HOT cüzdanınız

    const JETTONS_INFO : Record<string, JettonInfo> = {
        'jUSDC': {
            address: 'EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728', //
            decimals: 6
        },
        'jUSDT': {
            address: 'EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA',
            decimals: 6
        },
    }
    const jettons: Record<string, Jettons> = {};

    const prepare = async () => {
        for (const name in JETTONS_INFO) {
            const info = JETTONS_INFO[name];
            const jettonMaster = client.open(JettonMaster.create(Address.parse(info.address)));
            const userAddress = Address.parse(MY_WALLET_ADDRESS);

            const jettonUserAddress =  await jettonMaster.getWalletAddress(userAddress);
          
            console.log('Benim ' + name + ' için jetton cüzdanım ' + jettonUserAddress.toString());

            const jettonWallet = client.open(JettonWallet.create(jettonUserAddress));

            const jettonData = await client.runMethod(jettonUserAddress, "get_wallet_data")

            jettonData.stack.pop(); // bakiye atla
            jettonData.stack.pop(); // sahip adresini atla
            const adminAddress = jettonData.stack.readAddress();


            if (adminAddress.toString() !== (Address.parse(info.address)).toString()) {
                throw new Error('jetton cüzdanından alınan jetton üretici adresi yapılandırmayla eşleşmiyor');
            }

            jettons[name] = {
                jettonMinter: jettonMaster,
                jettonWalletAddress: jettonUserAddress,
                jettonWallet: jettonWallet
            };
        }
    }

    const jettonWalletAddressToJettonName = (jettonWalletAddress : Address) => {
        const jettonWalletAddressString = jettonWalletAddress.toString();
        for (const name in jettons) {
            const jetton = jettons[name];

            if (jetton.jettonWallet.address.toString() === jettonWalletAddressString) {
                return name;
            }
        }
        return null;
    }

    // Abone ol
    const Subscription = async ():Promise<Transaction[]> =>{

      const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'TONCENTER-API-KEY', // https://t.me/tonapibot
      });

        const myAddress = Address.parse('INSERT-YOUR-HOT-WALLET'); // Alıcı TON cüzdan adresi
        const transactions = await client.getTransactions(myAddress, {
            limit: 5,
        });
        return transactions;
    }

    return retry(async () => {

        await prepare();
        const Transactions = await Subscription();

        for (const tx of Transactions) {

            const sourceAddress = tx.inMessage?.info.src;
            if (!sourceAddress) {
                // harici mesaj - jettonlarla ilgili değil
                continue;
            }

            if (!(sourceAddress instanceof Address)) {
                continue;
            }

            const in_msg = tx.inMessage;

            if (in_msg?.info.type !== 'internal') {
                // harici mesaj - jettonlarla ilgili değil
                continue;
            }

            // jetton master sözleşme adresi kontrolü
            const jettonName = jettonWalletAddressToJettonName(sourceAddress);
            if (!jettonName) {
                // bilinmeyen veya sahte jetton transferi                
                continue;
            }

            if (tx.inMessage === undefined || tx.inMessage?.body.hash().equals(new Cell().hash())) {
                // in_msg veya in_msg gövdesi yok
                continue;
            }

            const msgBody = tx.inMessage;
            const sender = tx.inMessage?.info.src;
            const originalBody = tx.inMessage?.body.beginParse();
            let body = originalBody?.clone();
            const op = body?.loadUint(32);
            if (!(op == 0x7362d09c)) {
                continue; // op != transfer_notification
            }

            console.log('op kodu kontrolü geçti', tx.hash().toString('hex'));

            const queryId = body?.loadUint(64);
            const amount = body?.loadCoins();
            const from = body?.loadAddress();
            const maybeRef = body?.loadBit();
            const payload = maybeRef ? body?.loadRef().beginParse() : body;
            const payloadOp = payload?.loadUint(32);
            if (!(payloadOp == 0)) {
                console.log('transfer_notification içinde metin yorumu yok');
                continue;
            }

            const comment = payload?.loadStringTail();
            if (!(comment == orderId)) {
                continue;
            }
            
            console.log('Aldım ' + jettonName + ' jetton yatırımı ' + amount?.toString() + ' birim ile metin yorumu "' + comment + '"');
            const txHash = tx.hash().toString('hex');
            return (txHash);
        }
        throw new Error('İşlem bulunamadı');
    }, {retries: 30, delay: 1000});
}
```








Kaynak kod


```go
import (
	"context"
	"fmt"
	"log"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/jetton"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

const (
	MainnetConfig   = "https://ton.org/global.config.json"
	TestnetConfig   = "https://ton.org/global.config.json"
	MyWalletAddress = "INSERT-YOUR-HOT-WALLET-ADDRESS"
)

type JettonInfo struct {
	address  string
	decimals int
}

type Jettons struct {
	jettonMinter        *jetton.Client
	jettonWalletAddress string
	jettonWallet        *jetton.WalletClient
}

func prepare(api ton.APIClientWrapped, jettonsInfo map[string]JettonInfo) (map[string]Jettons, error) {
	userAddress := address.MustParseAddr(MyWalletAddress)
	block, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		return nil, err
	}

	jettons := make(map[string]Jettons)

	for name, info := range jettonsInfo {
		jettonMaster := jetton.NewJettonMasterClient(api, address.MustParseAddr(info.address))
		jettonWallet, err := jettonMaster.GetJettonWallet(context.Background(), userAddress)
		if err != nil {
			return nil, err
		}

		jettonUserAddress := jettonWallet.Address()

		jettonData, err := api.RunGetMethod(context.Background(), block, jettonUserAddress, "get_wallet_data")
		if err != nil {
			return nil, err
		}

		slice := jettonData.MustCell(0).BeginParse()
		slice.MustLoadCoins() // bakiye atla
		slice.MustLoadAddr()  // sahip adresini atla
		adminAddress := slice.MustLoadAddr()

		if adminAddress.String() != info.address {
			return nil, fmt.Errorf("jetton cüzdanından alınan jetton üretici adresi yapılandırmayla eşleşmiyor")
		}

		jettons[name] = Jettons{
			jettonMinter:        jettonMaster,
			jettonWalletAddress: jettonUserAddress.String(),
			jettonWallet:        jettonWallet,
		}
	}

	return jettons, nil
}

func jettonWalletAddressToJettonName(jettons map[string]Jettons, jettonWalletAddress string) string {
	for name, info := range jettons {
		if info.jettonWallet.Address().String() == jettonWalletAddress {
			return name
		}
	}
	return ""
}

func GetTransferTransactions(orderId string, foundTransfer chan<- *tlb.Transaction) {
	jettonsInfo := map[string]JettonInfo{
		"jUSDC": {address: "EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728", decimals: 6},
		"jUSDT": {address: "EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA", decimals: 6},
	}

	client := liteclient.NewConnectionPool()

	cfg, err := liteclient.GetConfigFromUrl(context.Background(), MainnetConfig)
	if err != nil {
		log.Fatalln("konfigürasyon alma hatası: ", err.Error())
	}

	// lite sunuculara bağlan
	err = client.AddConnectionsFromConfig(context.Background(), cfg)
	if err != nil {
		log.Fatalln("bağlantı hatası: ", err.Error())
	}

	// ton api lite bağlantı sarmalayıcılarını başlat
	api := ton.NewAPIClient(client, ton.ProofCheckPolicySecure).WithRetry()
	master, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		log.Fatalln("ana zincir bilgilerini alma hatası: ", err.Error())
	}

	// ödeme kabul ettiğimiz adres
	treasuryAddress := address.MustParseAddr("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")

	acc, err := api.GetAccount(context.Background(), master, treasuryAddress)
	if err != nil {
		log.Fatalln("ana zincir bilgilerini alma hatası: ", err.Error())
	}

	jettons, err := prepare(api, jettonsInfo)
	if err != nil {
		log.Fatalln("jetton verilerini hazırlamak için hata: ", err.Error())
	}

	lastProcessedLT := acc.LastTxLT

	transactions := make(chan *tlb.Transaction)

	go api.SubscribeOnTransactions(context.Background(), treasuryAddress, lastProcessedLT, transactions)

	log.Println("aktarımlar için bekleniyor...")

	// kanaldan yeni işlemleri dinle
	for tx := range transactions {
		if tx.IO.In == nil || tx.IO.In.MsgType != tlb.MsgTypeInternal {
			// harici mesaj - jettonlarla ilgili değil
			continue
		}

		msg := tx.IO.In.Msg
		sourceAddress := msg.SenderAddr()

		// jetton master sözleşme adresi kontrolü
		jettonName := jettonWalletAddressToJettonName(jettons, sourceAddress.String())
		if len(jettonName) == 0 {
			// bilinmeyen veya sahte jetton transferi
			continue
		}

		if msg.Payload() == nil || msg.Payload() == cell.BeginCell().EndCell() {
			// in_msg gövdesi yok
			continue
		}

		msgBodySlice := msg.Payload().BeginParse()

		op := msgBodySlice.MustLoadUInt(32)
		if op != 0x7362d09c {
			continue // op != transfer_notification
		}

		// bitleri atlayın
		msgBodySlice.MustLoadUInt(64)
		amount := msgBodySlice.MustLoadCoins()
		msgBodySlice.MustLoadAddr()

		payload := msgBodySlice.MustLoadMaybeRef()
		payloadOp := payload.MustLoadUInt(32)
		if payloadOp == 0 {
			log.Println("transfer_notification içinde metin yorumu yok")
			continue
		}

		comment := payload.MustLoadStringSnake()
		if comment != orderId {
			continue
		}

		// işlemi işle
		log.Printf("Aldım %s jetton yatırımı %d birim ile metin yorumu %s\n", jettonName, amount, comment)
		foundTransfer <- tx
	}
}
```


Kaynak kod


```py
import asyncio

from pytoniq import LiteBalancer, begin_cell

MY_WALLET_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"


async def parse_transactions(provider: LiteBalancer, transactions):
    for transaction in transactions:
        if not transaction.in_msg.is_internal:
            continue
        if transaction.in_msg.info.dest.to_str(1, 1, 1) != MY_WALLET_ADDRESS:
            continue

        sender = transaction.in_msg.info.src.to_str(1, 1, 1)
        value = transaction.in_msg.info.value_coins
        if value != 0:
            value = value / 1e9

        if len(transaction.in_msg.body.bits) < 32:
            print(f"{sender} adresinden {value} TON'luk transfer")
            continue

        body_slice = transaction.in_msg.body.begin_parse()
        op_code = body_slice.load_uint(32)
        if op_code != 0x7362D09C:
            continue

        body_slice.load_bits(64)  # query_id'yi atla
        jetton_amount = body_slice.load_coins() / 1e9
        jetton_sender = body_slice.load_address().to_str(1, 1, 1)
        if body_slice.load_bit():
            forward_payload = body_slice.load_ref().begin_parse()
        else:
            forward_payload = body_slice

        jetton_master = (
            await provider.run_get_method(
                address=sender, method="get_wallet_data", stack=[]
            )
        )[2].load_address()
        jetton_wallet = (
            (
                await provider.run_get_method(
                    address=jetton_master,
                    method="get_wallet_address",
                    stack=[
                        begin_cell()
                        .store_address(MY_WALLET_ADDRESS)
                        .end_cell()
                        .begin_parse()
                    ],
                )
            )[0]
            .load_address()
            .to_str(1, 1, 1)
        )

        if jetton_wallet != sender:
            print("SAHTE Jetton Transfer")
            continue

        if len(forward_payload.bits) < 32:
            print(
                f"{jetton_sender} adresinden {jetton_amount} Jetton'luk transfer"
            )
        else:
            forward_payload_op_code = forward_payload.load_uint(32)
            if forward_payload_op_code == 0:
                print(
                    f"{jetton_sender} adresinden {jetton_amount} Jetton'luk transfer ve yorum: {forward_payload.load_snake_string()}"
                )
            else:
                print(
                    f"{jetton_sender} adresinden {jetton_amount} Jetton'luk transfer ile bilinmeyen yük: {forward_payload} "
                )

        print(f"İşlem hash: {transaction.cell.hash.hex()}")
        print(f"İşlem lt: {transaction.lt}")


async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()
    transactions = await provider.get_transactions(address=MY_WALLET_ADDRESS, count=5)
    await parse_transactions(provider, transactions)
    await provider.close_all()


if __name__ == "__main__":
    asyncio.run(main())
```




## SDK'lar
Çeşitli diller (js, python, golang, C#, Rust vb.) için SDK'ların bir listesini burada bulabilirsiniz [/v3/guidelines/dapps/apis-sdks/sdk].

---

## Ayrıca Bakınız

* `Ödemelerin İşlenmesi`
* `TON'da NFT İşlemleri`
* `TON'da Metadata Ayrıştırma`