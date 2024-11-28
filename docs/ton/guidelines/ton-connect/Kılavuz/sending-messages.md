# Mesaj Gönderimi

TON Connect 2.0, dApp'te kullanıcıların kimlik doğrulamasının ötesinde daha güçlü seçeneklere sahiptir: bağlı cüzdanlar aracılığıyla çıkış mesajları göndermek mümkündür!

Şunları anlayacaksınız:
- DApp'ten blok zincirine nasıl mesaj gönderileceği
- Tek bir işlemde birden fazla mesaj nasıl gönderileceği
- TON Connect kullanarak bir sözleşme nasıl dağıtılacağı

---

## Oyun Alanı Sayfası

JavaScript için düşük seviyeli [TON Connect SDK](https://github.com/ton-connect/sdk/tree/main/packages/sdk) kullanacağız. Cüzdanın zaten bağlı olduğu bir sayfada tarayıcı konsolunda deneyler yapacağız. İşte örnek sayfa:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js"></script>
    <script src="https://unpkg.com/tonweb@0.0.41/dist/tonweb.js"></script>
  </head>
  <body>
    <script>
      window.onload = async () => {
        window.connector = new TonConnectSDK.TonConnect({
          manifestUrl: 'https://ratingers.pythonanywhere.com/ratelance/tonconnect-manifest.json'
        });
        connector.restoreConnection();
      }
    </script>
  </body>
</html>
```

Bunu tarayıcı konsolunuza kopyalayıp yapıştırmaktan çekinmeyin ve çalıştırın.

---

## Birden Fazla Mesaj Gönderme

### 1) Bir Görevi Anlamak

Tek bir işlemde iki ayrı mesaj göndereceğiz: biri kendi adresinize 0.2 TON taşıyan ve diğeri diğer cüzdan adresine 0.1 TON taşıyan mesaj.

:::note
Bu arada, bir işlemde gönderilen mesajlar için bir sınır vardır:
- standart (`v3`/`v4`) cüzdanlar: 4 çıkış mesajı;
- yüksek yük cüzdanları: 255 çıkış mesajı (blok zinciri sınırlamalarına yakın).
:::

### 2) Mesajları Göndermek

Aşağıdaki kodu çalıştırın:

```js
console.log(await connector.sendTransaction({
  validUntil: Math.floor(new Date() / 1000) + 360,
  messages: [
    {
      address: connector.wallet.account.address,
      amount: "200000000"
    },
    {
      address: "0:b2a1ecf5545e076cd36ae516ea7ebdf32aea008caa2b84af9866becb208895ad",
      amount: "100000000"
    }
  ]
}));
```

Bu komutun konsola hiçbir şey (null veya undefined) yazdırmadığını, hiçbir şey döndürmeyen işlevler gibi olduğunu fark edeceksiniz. Bu, `connector.sendTransaction`'ın hemen çıkmadığı anlamına gelir.

Cüzdan uygulamanızı açın ve nedenini göreceksiniz. Göndereceğinizi ve paraların nereye gideceğini gösteren bir istek var. Lütfen kabul edin.

### 3) Sonucu Almak

Fonksiyon çıkacak ve blok zincirinden gelen çıktı yazdırılacaktır:

```json
{
  boc: "te6cckEBAwEA4QAC44gBZUPZ6qi8Dtmm1cot1P175lXUARlUVwlfMM19lkERK1oCUB3RqDxAFnPpeo191X/jiimn9Bwnq3zwcU/MMjHRNN5sC5tyymBV3SJ1rjyyscAjrDDFAIV/iE+WBySEPP9wCU1NGLsfcvVgAAACSAAYHAECAGhCAFlQ9nqqLwO2abVyi3U/XvmVdQBGVRXCV8wzX2WQRErWoAmJaAAAAAAAAAAAAAAAAAAAAGZCAFlQ9nqqLwO2abVyi3U/XvmVdQBGVRXCV8wzX2WQRErWnMS0AAAAAAAAAAAAAAAAAAADkk4U"
}
```

BOC, TON'da verilerin nasıl saklandığına dair bir `Hücreler Torbası` dır. Şimdi bunu çözebiliriz.

Bu BOC'yi tercih ettiğiniz araçta çözün ve aşağıdaki hücreler ağacını elde edeceksiniz:

```bash
x{88016543D9EAA8BC0ED9A6D5CA2DD4FD7BE655D401195457095F30CD7D9641112B5A02501DD1A83C401673E97A8D7DD57FE38A29A7F41C27AB7CF0714FCC3231D134DE6C0B9B72CA6055DD2275AE3CB2B1C023AC30C500857F884F960724843CFF70094D4D18BB1F72F5600000024800181C_}
 x{42005950F67AAA2F03B669B5728B753F5EF9957500465515C257CC335F6590444AD6A00989680000000000000000000000000000}
 x{42005950F67AAA2F03B669B5728B753F5EF9957500465515C257CC335F6590444AD69CC4B40000000000000000000000000000}
```

Bu, dışsal bir mesajın serileştirilmiş halidir ve iki referans çıktıda mesajların temsilidir.

```bash
x{88016543D9EAA8BC0ED9A6D5CA2DD4FD7BE655D401195457095F30CD7D964111...
  $10       ext_in_msg_info
  $00       src:MsgAddressExt (null adres)
  "EQ..."a  dest:MsgAddressInt (cüzdanınız)
  0         import_fee:Grams
  $0        (state_init yok)
  $0        (gövde bu hücrede başlar)
  ...
```

Gönderilen işlemin BOC'sini döndürmenin amacı bunu takip etmektir.

---

## Karmaşık İşlemler Göndermek

### Hücrelerin Serileştirilmesi

Devam etmeden önce, göndereceğimiz mesajların formatından bahsedelim.

* **payload** (string base64, isteğe bağlı): Base64'te kodlanmış ham bir hücre Torbası.
  * bunu aktarma üzerindeki metin yorumunu saklamak için kullanacağız
* **stateInit** (string base64, isteğe bağlı): Base64'te kodlanmış ham bir hücre Torbası.
  * bunu akıllı sözleşmeyi dağıtmak için kullanacağız

Bir mesaj oluşturduktan sonra, bunu BOC olarak serileştirebilirsiniz.

```js
TonWeb.utils.bytesToBase64(await payloadCell.toBoc())
```

### Yorumla Transfer

Hücreleri BOC olarak serileştirmek için [toncenter/tonweb](https://github.com/toncenter/tonweb) JS SDK veya tercih ettiğiniz herhangi bir aracı kullanabilirsiniz.

Transfer üzerindeki metin yorumu, opcode 0 (32 sıfır bit) + yorumun UTF-8 baytları olarak kodlanmıştır. İşte bunu bir hücreler torbasına dönüştürmenin bir örneği.

```js
let a = new TonWeb.boc.Cell();
a.bits.writeUint(0, 32);
a.bits.writeString("TON Connect 2 tutorial!");
let payload = TonWeb.utils.bytesToBase64(await a.toBoc());

console.log(payload);
// te6ccsEBAQEAHQAAADYAAAAAVE9OIENvbm5lY3QgMiB0dXRvcmlhbCFdy+mw
```

### Akıllı Sözleşme Dağıtımı

Ve [Doge sohbet botu](https://github.com/LaDoger/doge.fc) gibi çok basit bir örneği dağıtacağız. Bu, `akıllı sözleşme örneklerinden` biri olarak belirtilmiştir. Öncelikle, kodunu yüklüyor ve verilerde benzersiz bir şey saklıyoruz, böylece başkası tarafından dağıtılmamış kendi örneğimizi alıyoruz. Ardından, kodu ve veriyi stateInit'e birleştiriyoruz.

```js
let code = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes('te6cckEBAgEARAABFP8A9KQT9LzyyAsBAGrTMAGCCGlJILmRMODQ0wMx+kAwi0ZG9nZYcCCAGMjLBVAEzxaARfoCE8tqEssfAc8WyXP7AN4uuM8='));
let data = new TonWeb.boc.Cell();
data.bits.writeUint(Math.floor(new Date()), 64);

let state_init = new TonWeb.boc.Cell();
state_init.bits.writeUint(6, 5);
state_init.refs.push(code);
state_init.refs.push(data);

let state_init_boc = TonWeb.utils.bytesToBase64(await state_init.toBoc());
console.log(state_init_boc);
// te6ccsEBBAEAUwAABRJJAgE0AQMBFP8A9KQT9LzyyAsCAGrTMAGCCGlJILmRMODQ0wMx+kAwi0ZG9nZYcCCAGMjLBVAEzxaARfoCE8tqEssfAc8WyXP7AAAQAAABhltsPJ+MirEd

let doge_address = '0:' + TonWeb.utils.bytesToHex(await state_init.hash());
console.log(doge_address);
// 0:1c7c35ed634e8fa796e02bbbe8a2605df0e2ab59d7ccb24ca42b1d5205c735ca
```

Ve işlemimizi göndermenin zamanı geldi!

```js
console.log(await connector.sendTransaction({
  validUntil: Math.floor(new Date() / 1000) + 360,
  messages: [
    {
      address: "0:1c7c35ed634e8fa796e02bbbe8a2605df0e2ab59d7ccb24ca42b1d5205c735ca",
      amount: "69000000",
      payload: "te6ccsEBAQEAHQAAADYAAAAAVE9OIENvbm5lY3QgMiB0dXRvcmlhbCFdy+mw",
      stateInit: "te6ccsEBBAEAUwAABRJJAgE0AQMBFP8A9KQT9LzyyAsCAGrTMAGCCGlJILmRMODQ0wMx+kAwi0ZG9nZYcCCAGMjLBVAEzxaARfoCE8tqEssfAc8WyXP7AAAQAAABhltsPJ+MirEd"
    }
  ]
}));
```

:::info
Transfer NFT ve Jettonlar için daha fazla örnek almak üzere `Mesajları Hazırlama` sayfasını ziyaret edin.
:::

Onaydan sonra, işlemin tamamlandığını [tonscan.org](https://tonscan.org/tx/pCA8LzWlCRTBc33E2y-MYC7rhUiXkhODIobrZVVGORg=) adresinde görebiliriz.

---

## Kullanıcı işlem isteğini reddederse ne olur?

İstek reddini ele almak oldukça kolaydır, ancak bir proje geliştiriyorsanız, önceden neler olacağını bilmek daha iyidir.

:::warning
Bir kullanıcı cüzdan uygulamasındaki açılır pencerede "İptal" butonuna tıkladığında, bir istisna atılır: 
`Error: [TON_CONNECT_SDK_ERROR] Cüzdan isteği reddetti`. 
Bu hata nihai olarak kabul edilebilir (bağlantı iptali gibi değil) - bu hata meydana geldiyse, o istenen işlem kesinlikle bir sonraki istek gönderilene kadar gerçekleşmeyecektir.
:::

---

## Ayrıca Bakın

* `Mesajları Hazırlama`