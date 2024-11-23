# JavaScript SDK ile Entegrasyon Kılavuzu

Bu kılavuzda, TON Connect 2.0 kimlik doğrulamasını destekleyen bir örnek web uygulaması oluşturacağız. Bu, taraflar arasında anlaşma kurulmadan sahte kimlik taklidi olasılığını ortadan kaldırmak için imza doğrulamasına olanak tanıyacaktır.

## Belgelere Bağlantılar

1. [@tonconnect/sdk belgelemesi](https://www.npmjs.com/package/@tonconnect/sdk)  
2. [Cüzdan-uygulama mesaj değişim protokolü](https://github.com/ton-connect/docs/blob/main/requests-responses.md) 
3. [Tonkeeper cüzdan tarafı uygulaması](https://github.com/tonkeeper/wallet/tree/main/packages/mobile/src/tonconnect)

## Ön Koşullar

Uygulamalar ve cüzdanlar arasında bağlantının akıcı olması için, web uygulaması cüzdan uygulamaları aracılığıyla erişilebilir bir manifest kullanmalıdır. Bunu başarmak için gereken ön koşul genellikle statik dosyalar için bir barındırıcıdır. Örneğin, bir geliştirici GitHub sayfalarını kullanmak isterse veya web sitesini bilgisayarında barındırılan TON Siteleri aracılığıyla dağıtmak isterse. Bu, dolayısıyla, web uygulamalarının açıkça erişilebilir olduğu anlamına gelir.

## Cüzdan Desteği Listesinin Alınması

TON Blockchain'in genel kabulünü artırmak için, TON Connect 2.0'ın çok sayıda uygulama ve cüzdan bağlantı entegrasyonlarını kolaylaştırması gerekmektedir. Son zamanlarda ve önemli ölçüde, TON Connect 2.0'ın sürekli geliştirilmesi, Tonkeeper, TonHub, MyTonWallet ve diğer cüzdanların çeşitli TON Ekosistem Uygulamaları ile bağlantı kurmasına olanak tanımıştır. Amacımız, sonunda TON Connect protokolü aracılığıyla TON tabanlı uygulamalar ve tüm cüzdan türleri arasında veri alışverişine izin vermektir. Şu anda, TON Connect'in mevcut durumda çalışan geniş cüzdan listelerini yükleme yeteneği sağladığını görmekteyiz.

**Şu anda, örnek web uygulamamız aşağıdakileri sağlar:**

1. TON Connect SDK'sını yükler (entegrasyonu kolaylaştırmak için tasarlanmış kütüphane),
2. Bir konektör oluşturur (şu anda bir uygulama manifesti olmadan),
3. Desteklenen cüzdanların listesini yükler ([wallets.json on GitHub](https://raw.githubusercontent.com/ton-connect/wallets-list/main/wallets.json) adresinden).

:::note
Öğrenme amaçları için, aşağıdaki kod ile tanımlanan HTML sayfasına bir göz atalım:
:::

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js" defer></script>  <!-- (1) -->
  </head>
  <body>
    <script>
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();  // (2)
        const walletsList = await connector.getWallets();  // (3)
        
        console.log(walletsList);
      }
    </script>
  </body>
</html>
```

Bu sayfayı tarayıcıda yüklediğinizde ve konsola baktığınızda, şunu alabilirsiniz:

```bash
> Array [ {…}, {…} ]

0: Object { name: "Tonkeeper", imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png", aboutUrl: "https://tonkeeper.com", … }
  aboutUrl: "https://tonkeeper.com"
  bridgeUrl: "https://bridge.tonapi.io/bridge"
  deepLink: undefined
  embedded: false
  imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png"
  injected: false
  jsBridgeKey: "tonkeeper"
  name: "Tonkeeper"
  tondns: "tonkeeper.ton"
  universalLink: "https://app.tonkeeper.com/ton-connect"
```

TON Connect 2.0 spesifikasyonlarına göre, cüzdan uygulaması bilgileri her zaman aşağıdaki formatı kullanır:
```js
{
    name: string;
    imageUrl: string;
    tondns?: string;
    aboutUrl: string;
    universalLink?: string;
    deepLink?: string;
    bridgeUrl?: string;
    jsBridgeKey?: string;
    injected?: boolean; // bu cüzdanın web sayfasına enjekte edilip edilmediği
    embedded?: boolean; // DApp'in bu cüzdanın tarayıcısında açılıp açılmadığı
}
```

## Çeşitli Cüzdan Uygulamaları İçin Buton Gösterimi

Butonlar, web uygulamanızın tasarımına göre değişebilir. Mevcut sayfa aşağıdaki sonucu üretir:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js" defer></script>

    // highlight-start
    <style>
      body {
        width: 1000px;
        margin: 0 auto;
        font-family: Roboto, sans-serif;
      }
      .section {
        padding: 20px; margin: 20px;
        border: 2px #AEFF6A solid; border-radius: 8px;
      }
      #tonconnect-buttons>button {
        display: block;
        padding: 8px; margin-bottom: 8px;
        font-size: 18px; font-family: inherit;
      }
      .featured {
        font-weight: 800;
      }
    </style>
    // highlight-end
  </head>
  <body>
    // highlight-start
    <div class="section" id="tonconnect-buttons">
    </div>
    // highlight-end
    
    <script>
      const $ = document.querySelector.bind(document);
      
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();
        const walletsList = await connector.getWallets();

        // highlight-start
        let buttonsContainer = $('#tonconnect-buttons');
        
        for (let wallet of walletsList) {
          let connectButton = document.createElement('button');
          connectButton.innerText = 'Bağlan ' + wallet.name;
          
          if (wallet.embedded) {
            // `embedded` uygulamayı cüzdan uygulamasından gezdiğimizi belirtir
            // bu oturum açma seçeneğini bir şekilde vurgulamalıyız
            connectButton.classList.add('featured');
          }
          
          if (!wallet.bridgeUrl && !wallet.injected && !wallet.embedded) {
            // `bridgeUrl` yoksa bu cüzdan uygulaması JS kodu enjekte ediyor demektir
            // herhangi bir `injected` ve `embedded` yoksa -> uygulama bu sayfada erişilemez
            connectButton.disabled = true;
          }
          
          buttonsContainer.appendChild(connectButton);
        }
        // highlight-end
      };
    </script>
  </body>
</html>
```

**Şunları not ediniz ki:**

1. Eğer web sayfası bir cüzdan uygulaması aracılığıyla görüntüleniyorsa, `embedded` özelliği `true` olarak ayarlanır. Bu, oturum açma seçeneğini vurgulamanın önemli olduğu anlamına gelir çünkü en yaygın kullanılanıdır.
2. Eğer belirli bir cüzdan yalnızca JavaScript kullanılarak oluşturulmuşsa (hiç `bridgeUrl` yoksa) ve `injected` (ya da `embedded`, güvenlik açısından) özelliğini ayarlamamışsa, bu cüzdanın erişilebilir olmadığı anlamına gelir ve buton devre dışı bırakılmalıdır.

## Uygulama manifesti olmadan bağlantı

Eğer bağlantı uygulama manifesti olmadan yapılırsa, script aşağıdaki şekilde değiştirilmelidir:

```js
      const $ = document.querySelector.bind(document);
      
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();
        const walletsList = await connector.getWallets();
        
        const unsubscribe = connector.onStatusChange(
          walletInfo => {
            console.log('Bağlantı durumu:', walletInfo);
          }
        );
        
        let buttonsContainer = $('#tonconnect-buttons');

        for (let wallet of walletsList) {
          let connectButton = document.createElement('button');
          connectButton.innerText = 'Bağlan ' + wallet.name;
          
          if (wallet.embedded) {
            // `embedded` uygulamayı cüzdan uygulamasından gezdiğimizi belirtir
            // bu oturum açma seçeneğini bir şekilde vurgulamalıyız
            connectButton.classList.add('featured');
          }
          
          // highlight-start
          if (wallet.embedded || wallet.injected) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              connector.connect({jsBridgeKey: wallet.jsBridgeKey});
            };
          } else if (wallet.bridgeUrl) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              console.log('Bağlantı bağlantısı:', connector.connect({
                universalLink: wallet.universalLink,
                bridgeUrl: wallet.bridgeUrl
              }));
            };
          } else {
            // cüzdan uygulaması herhangi bir kimlik doğrulama yöntemi sunmuyor
            connectButton.disabled = true;
          }
          // highlight-end
          
          buttonsContainer.appendChild(connectButton);
        }
      };
```

Yukarıdaki süreç gerçekleştirildikten sonra, durum değişiklikleri kaydedilmektedir (TON Connect'in çalışıp çalışmadığını görmek için). Bağlantı için QR kodları içeren modalların gösterilmesi bu kılavuzun kapsamının dışındadır. Test amaçları için, bir tarayıcı uzantısı kullanmak veya bağlantı isteği linkini kullanıcının telefonuna herhangi bir şekilde (örneğin Telegram kullanarak) gönderilmesi mümkündür.

:::warning
Not: Henüz bir uygulama manifesti oluşturmadık. Şu anda, bu gereksinim karşılanmadığında nihai sonucu analiz etmek en iyi yaklaşımdır.
:::

### Tonkeeper ile Giriş

Tonkeeper'a giriş yapmak için aşağıdaki bağlantı kimlik doğrulaması için oluşturulur (referans için sağlanmıştır):
```
https://app.tonkeeper.com/ton-connect?v=2&id=3c12f5311be7e305094ffbf5c9b830e53a4579b40485137f29b0ca0c893c4f31&r=%7B%22manifestUrl%22%3A%22null%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%5D%7D
```
Açıklandığında, `r` parametresi aşağıdaki JSON formatını üretir:
```js
{"manifestUrl":"null/tonconnect-manifest.json","items":[{"name":"ton_addr"}]}
```

Mobil telefon bağlantısına tıkladığınızda, Tonkeeper otomatik olarak açılır ve ardından isteği reddederek kapanır. Ayrıca, web uygulaması sayfa konsolunda şu hata görünür:
`Hata: [TON_CONNECT_SDK_ERROR] null/tonconnect-manifest.json alınamıyor.`

Bu, uygulama manifestinin indirilmek üzere mevcut olması gerektiği anlamına gelir.

## Uygulama manifesti kullanarak bağlantı

Bu noktadan itibaren, kullanıcı dosyalarını (genellikle tonconnect-manifest.json) bir yerde barındırmak gerekmektedir. Bu durumda, başka bir web uygulamasından manifest kullanacağız. Bu, üretim ortamları için önerilmez, ancak test amaçları için izin verilir.

Aşağıdaki kod parçası:

```js
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();
        
        const walletsList = await connector.getWallets();
        
        const unsubscribe = connector.onStatusChange(
          walletInfo => {
            console.log('Bağlantı durumu:', walletInfo);
          }
        );
```
Bu sürümle değiştirilmelidir:
```js
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect({manifestUrl: 'https://ratingers.pythonanywhere.com/ratelance/tonconnect-manifest.json'});
        // highlight-next-line
        window.connector = connector;  // tarayıcı konsolunda denemek için
        
        const walletsList = await connector.getWallets();
        
        const unsubscribe = connector.onStatusChange(
          walletInfo => {
            console.log('Bağlantı durumu:', walletInfo);
          }
        );
        // highlight-next-line
        connector.restoreConnection();
```

Yukarıdaki yeni sürümde, `connector` değişkeninin `window` içinde saklanması eklendi, böylece tarayıcı konsolunda erişilebilir hale geldi. Ayrıca, her web uygulaması sayfasında oturum açmak zorunda kalmamaları için `restoreConnection` eklendi.

### Tonkeeper ile Giriş

Eğer cüzdan isteğimizi reddedersek, konsolda beliren sonuç `Hata: [TON_CONNECT_SDK_ERROR] Cüzdan isteği reddetti` olacaktır.

Böylece, kullanıcı bağlantı isteğini sakladığı takdirde aynı giriş isteğini kabul edebilir. **Bu, web uygulamasının kimlik doğrulama reddini son bir durum olarak ele alması gerektiği anlamına gelir, böylece doğru çalışır.**

Sonrasında, giriş isteği kabul edilir ve web tarayıcı konsoluna hemen şu şekilde yansır:

```bash
22:40:13.887 Bağlantı durumu:
Object { device: {…}, provider: "http", account: {…} }
  account: Object { address: "0:b2a1ec...", chain: "-239", walletStateInit: "te6cckECFgEAAwQAAgE0ARUBFP8A9..." }
  device: Object {platform: "android", appName: "Tonkeeper", appVersion: "2.8.0.261", …}
  provider: "http"
```

Yukarıdaki sonuçlar aşağıdakileri göz önünde bulundurmaktadır:

1. **Hesap**: bilgi: adresi (işlem zinciri + hash), ağ (ana ağ/test ağı) ve genel anahtar çıkarımı için kullanılan cüzdan stateInit'sini içerir.
2. **Cihaz**: bilgi: cüzdan uygulama adını ve sürümünü içerir (bu, başlangıçta talep edilenle eşit olmalıdır, ancak bu doğruluğu sağlamak için kontrol edilebilir) ve platform adı ve desteklenen özellikler listesi.
3. **Sağlayıcı**: tüm isteklerin ve yanıtların cüzdan ile web uygulamaları arasında köprü üzerinden sunulabilmesini sağlayan http içerir.

## Çıkış Yapma ve TonProof Talep Etme

Artık Mini Uygulamamıza giriş yaptık, ancak... arka uç bunu doğru taraf olduğumuzdan nasıl bilir? Bunu doğrulamak için, cüzdan sahipliği kanıtını talep etmemiz gerekir.

**Bu yalnızca kimlik doğrulama kullanılarak tamamlanabilir, bu nedenle çıkış yapmamız gerekir.** Bu yüzden, konsolda aşağıdaki kodu çalıştırırız:

```js
connector.disconnect();
```

Bağlantı kesme işlemi tamamlandığında, `Bağlantı durumu: null` görüntülenecektir.

TonProof eklenmeden önce, mevcut uygulamanın güvenli olmadığını göstermek için kodu değiştirelim:

```js
let connHandler = connector.statusChangeSubscriptions[0];
connHandler({
  device: {
    appName: "Uber Singlesig Cold Wallet App",
    appVersion: "4.0.1",
    features: [],
    maxProtocolVersion: 3,
    platform: "ios"
  },
  account: {
    /* TON Foundation adresi */
    address: '0:83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8',
    chain: '-239',
    walletStateInit: 'te6ccsEBAwEAoAAFcSoCATQBAgDe/wAg3SCCAUyXuiGCATOcurGfcbDtRNDTH9MfMdcL/+ME4KTyYIMI1xgg0x/TH9Mf+CMTu/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOjRAaTIyx/LH8v/ye1UAFAAAAAAKamjF3LJ7WtipuLroUqTuQRi56Nnd3vrijj7FbnzOETSLOL/HqR30Q=='
  },
  provider: 'http'
});
```

Konsoldaki sonuç satırları, ilk başlatıldığında gösterilenlere çok benzer. Dolayısıyla, arka uç kullanıcının kimliğini beklenildiği gibi doğru bir şekilde doğrulamıyorsa, düzgün çalışıp çalışmadığını test etmek için bir yol gereklidir. Bunu başarmak için, konsolda TON Vakfı gibi davranmak mümkündür, bu şekilde token bakiyelerinin ve token sahipliği parametrelerinin test edilebilmesi sağlanır. Doğal olarak, sağlanan kod, bağlayıcının içindeki hiçbir değişkeni değiştirmez, ancak kullanıcı uygulamayı istediği gibi kullanmaya devam edebilir, aksi halde o bağlayıcı kapatılmıştır. Böyle bir durumda bile, bir hata ayıklayıcı ve kodlama kesme noktaları kullanarak bunu çıkarmak zor değildir.

Artık kullanıcının kimliği doğrulandığına göre, kodu yazmaya geçelim.

## TonProof ile Bağlantı

TON Connect SDK belgelendirmesine göre, ikinci argüman cüzdan tarafından sarılacak ve imzalanacak olan `connect()` metoduna işaret eder. Bu nedenle, sonuç yeni bağlantı kodudur:

```js
if (wallet.embedded || wallet.injected) {
    connectButton.onclick = () => {
        connectButton.disabled = true;
        connector.connect({jsBridgeKey: wallet.jsBridgeKey},
                          {tonProof: 'doc-example-<BACKEND_AUTH_ID>'});
    };
} else if (wallet.bridgeUrl) {
    connectButton.onclick = () => {
        connectButton.disabled = true;
        console.log('Bağlantı linki:', connector.connect({
            universalLink: wallet.universalLink,
            bridgeUrl: wallet.bridgeUrl
        }, {tonProof: 'doc-example-<BACKEND_AUTH_ID>'}));
    };
}
```

Bağlantı linki:

```
https://app.tonkeeper.com/ton-connect?v=2&id=4b0a7e2af3b455e0f0bafe14dcdc93f1e9e73196ae2afaca4d9ba77e94484a44&r=%7B%22manifestUrl%22%3A%22https%3A%2F%2Fratingers.pythonanywhere.com%2Fratelance%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%2C%7B%22name%22%3A%22ton_proof%22%2C%22payload%22%3A%22doc-example-%3CBACKEND_AUTH_ID%3E%22%7D%5D%7D
```

Genişletilmiş ve basitleştirilmiş `r` parametresi:

```js
{
  "manifestUrl":
    "https://ratingers.pythonanywhere.com/ratelance/tonconnect-manifest.json",
  "items": [
    {"name": "ton_addr"},
    {"name": "ton_proof", "payload": "doc-example-<BACKEND_AUTH_ID>"}
  ]
}
```

Sonraki adım, url adres bağlantısının bir mobil cihaza gönderilmesi ve Tonkeeper kullanılarak açılmasıdır.

Bu işlemin tamamlanmasının ardından, aşağıdaki cüzdan spesifik bilgileri alınır:

```js
{
  "device": {
    "platform": "android",
    "appName": "Tonkeeper",
    "appVersion": "2.8.0.261",
    "maxProtocolVersion": 2,
    "features": [
      "SendTransaction"
    ]
  },
  "provider": "http",
  "account": {
    "address": "0:b2a1ecf5545e076cd36ae516ea7ebdf32aea008caa2b84af9866becb208895ad",
    "chain": "-239",
    "walletStateInit": "te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4CAVgKCwA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjFyM60x2mt5eboNyOTE+5RGOe9Ee2rK1Qcb+0ZuiP9vb7QJRlz/c="
  },
  "connectItems": {
    "tonProof": {
      "name": "ton_proof",
      "proof": {
        "timestamp": 1674392728,
        "domain": {
          "lengthBytes": 28,
          "value": "ratingers.pythonanywhere.com"
        },
        "signature": "trCkHit07NZUayjGLxJa6FoPnaGHkqPy2JyNjlUbxzcc3aGvsExCmHXi6XJGuoCu6M2RMXiLzIftEm6PAoy1BQ==",
        "payload": "doc-example-<BACKEND_AUTH_ID>"
      }
    }
  }
}
```

Alınan imzayı doğrulayalım. Bunu başarmak için imza doğrulama Python kullanılarak gerçekleştirilir çünkü backend ile kolayca etkileşim kurabilir. Bu süreci gerçekleştirmek için gereken kütüphaneler `pytoniq` ve `pynacl`dır.

:::tip
**Not:** Python'da imza doğrulama süreci için `pytoniq` ve `pynacl` kütüphaneleri gereklidir.
:::

Sonraki adım, cüzdanın genel anahtarını elde etmektir. Bunu başarmak için `tonapi.io` veya benzeri hizmetler kullanılmaz çünkü nihai sonuç güvenilir bir şekilde güvenilir olmayabilir. Bunun yerine, `walletStateInit` ayrıştırılarak bu işlem gerçekleştirilir.

:::warning
**Dikkat:** `address` ve `walletStateInit`'in eşleştiğinden emin olunması kritik öneme sahiptir. Aksi takdirde yük (payload) kendi cüzdan anahtarıyla imzalanabilir ve `stateInit` alanında kendi cüzdanlarını ve `address` alanında başka bir cüzdan belirtebilirler.
:::

`StateInit` iki referans türünden oluşur: biri kod ve diğeri veri. Bu bağlamda, genel anahtarı almak için veri referansı yüklenir. Ardından 8 bayt atlanır (4 bayt `seqno` alanı için ve 4 bayt tüm modern cüzdan sözleşmelerinde `subwallet_id` içindir) ve sonraki 32 bayt (256 bit) yüklenir - genel anahtar.

```python
import nacl.signing
import pytoniq

import hashlib
import base64

received_state_init = 'te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4CAVgKCwA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjFyM60x2mt5eboNyOTE+5RGOe9Ee2rK1Qcb+0ZuiP9vb7QJRlz/c='
received_address = '0:b2a1ecf5545e076cd36ae516ea7ebdf32aea008caa2b84af9866becb208895ad'

state_init = pytoniq.Cell.one_from_boc(base64.b64decode(received_state_init))

address_hash_part = state_init.hash.hex()
assert received_address.endswith(address_hash_part)

public_key = state_init.refs[1].bits.tobytes()[8:][:32]

# bytearray(b'#:\xd3\x1d\xa6\xb7\x97\x9b\xa0\xdc\x8eLO\xb9Dc\x9e\xf4G\xb6\xac\xadPq\xbf\xb4f\xe8\x8f\xf6\xf6\xfb')

verify_key = nacl.signing.VerifyKey(bytes(public_key))
```

Yukarıdaki sıralama kodu uygulandıktan sonra, hangi parametrelerin doğrulandığı ve imzalandığı kontrol edilmek üzere doğru belgeler kontrol edilir:

> ```
> message = utf8_encode("ton-proof-item-v2/") ++  
>           Address ++  
>           AppDomain ++  
>           Timestamp ++  
>           Payload
> 
> signature = Ed25519Sign(
>   privkey,
>   sha256(0xffff ++ utf8_encode("ton-connect") ++ sha256(message))
> )
> ```

Burada:
- `Address`, cüzdan adresini temsil eder ve şu şekilde kodlanır:
    - `workchain`: 32-bit işaretli tam sayı big-endian;
    - `hash`: 256-bit işaretsiz tam sayı big-endian;
- `AppDomain`, Length ++ EncodedDomainName'dır:
    - `Length`, utf-8 kodlamalı uygulama alanı adı uzunluğunun byte cinsinden 32-bit değerini kullanır;
    - `EncodedDomainName`, `Length` bayt uzunluğundaki utf-8 kodlamalı uygulama alanı adıdır;
- `Timestamp`, imza işleminin 64-bit unix epoch zamanını ifade eder;
- `Payload`, değişken uzunlukta bir ikili dizeyi ifade eder;
- `utf8_encode`, uzunluk prefiksleri olmadan düz bir bayt dizesi oluşturur.

Bunu Python'da yeniden uygulayalım. Yukarıdaki bazı tamsayıların endianlıkları belirtilmemiştir, bu nedenle birkaç örnek dikkate alınmalıdır. Lütfen aşağıdaki Tonkeeper uygulamasına başvurun ve ilgili örnekleri detaylandırın: [ConnectReplyBuilder.ts](https://github.com/tonkeeper/wallet/blob/77992c08c663dceb63ca6a8e918a2150c75cca3a/src/tonconnect/ConnectReplyBuilder.ts#L42).

```python
received_timestamp = 1674392728
signature = 'trCkHit07NZUayjGLxJa6FoPnaGHkqPy2JyNjlUbxzcc3aGvsExCmHXi6XJGuoCu6M2RMXiLzIftEm6PAoy1BQ=='

message = (b'ton-proof-item-v2/'
         + 0 .to_bytes(4, 'big') + si.bytes_hash()
         + 28 .to_bytes(4, 'little') + b'ratingers.pythonanywhere.com'
         + received_timestamp.to_bytes(8, 'little')
         + b'doc-example-<BACKEND_AUTH_ID>')
# b'ton-proof-item-v2/\x00\x00\x00\x00\xb2\xa1\xec\xf5T^\x07l\xd3j\xe5\x16\xea~\xbd\xf3*\xea\x00\x8c\xaa+\x84\xaf\x98f\xbe\xcb \x88\x95\xad\x1c\x00\x00\x00ratingers.pythonanywhere.com\x984\xcdc\x00\x00\x00\x00doc-example-<BACKEND_AUTH_ID>'

signed = b'\xFF\xFF' + b'ton-connect' + hashlib.sha256(message).digest()
# b'\xff\xffton-connectK\x90\r\xae\xf6\xb0 \xaa\xa9\xbd\xd1\xaa\x96\x8b\x1fp\xa9e\xff\xdf\x81\x02\x98\xb0)E\t\xf6\xc0\xdc\xfdx'

verify_key.verify(hashlib.sha256(signed).digest(), base64.b64decode(signature))
# b'\x0eT\xd6\xb5\xd5\xe8HvH\x0b\x10\xdc\x8d\xfc\xd3#n\x93\xa8\xe9\xb9\x00\xaaH%\xb5O\xac:\xbd\xcaM'
```

Yukarıdaki parametreler uygulandıktan sonra, bir saldırgan bir kullanıcıyı taklit etmeye çalışırsa ve geçerli bir imza sunmazsa, aşağıdaki hata görüntülenecektir:

```bash
nacl.exceptions.BadSignatureError: İmza sahte veya bozuktu.
```

---

## Sonraki adımlar

Bir dApp yazarken, aşağıdakiler de dikkate alınmalıdır:

- Bağlantı tamamlandığında (ya yenilenmiş ya da yeni bir bağlantı), birkaç `Connect` butonu yerine `Disconnect` butonu gösterilmelidir.
- Bir kullanıcı bağlantıyı kestikten sonra, `Disconnect` butonları yeniden oluşturulmalıdır.
- Cüzdan kodu kontrol edilmelidir, çünkü:
   - Daha yeni cüzdan sürümleri genel anahtarları farklı bir konuma yerleştirebilir ve sorun yaratabilir.
   - Mevcut kullanıcı, bir cüzdan yerine başka bir sözleşme türü kullanarak oturum açabilir. Neyse ki, bu beklenen konumdaki genel anahtarı içerecektir.

İyi şanslar ve dApp yazarken eğlenin!