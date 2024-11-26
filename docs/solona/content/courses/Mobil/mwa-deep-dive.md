---
title: Mobil Cüzdan Adaptörü Keşfi
objectives:
  - Web cüzdanı ile mobil cüzdan arasındaki farkları tanımlamak
  - Mobil cüzdandan işlemleri imzalamak ve bağlanmak
  - Basit bir mobil cüzdan oluşturmak
  - walletlib ile cüzdan uygulamaları arasındaki etkileşimi yüksek seviyede açıklamak
description:
  "Yerel mobil uygulamalarınızda mobil cüzdanlarda işlem başlatın."
---

## Özet

- Cüzdanlar, bir anahtar çiftinin etrafında yalnızca bir sarıcıdır, ancak güvenli anahtar yönetimi için gereklidir.
- Mobil ve Web dApp'ler cüzdan uygulaması bağlantısını farklı şekilde yönetir.
- **Mobil Cüzdan Adaptörü (MWA)**, tüm cüzdan etkileşimini, entegrasyonu kolaylaştırmak için cüzdanın tüm işlevselliklerini `transact` fonksiyonu içerisinde sarmalayarak gerçekleştirir.
- Solana Mobil'in `walletlib`i, cüzdan uygulamalarına cüzdan isteklerini iletmekte ağır yükü üstlenir.

---

## Ders

Cüzdanlar, gizli anahtarlarınızı korumak için var. Bazı uygulamalar uygulamaya özgü anahtarlara sahipken, birçok blockchain kullanım durumu, birden fazla uygulama arasında kullanılan tek bir kimliğe dayanır. Bu durumlarda, bu uygulamalar arasında imzalama işlemini nasıl sunacağınız konusunda çok dikkatli olmalısınız. Tüm gizli anahtarınızı onlarla paylaşmak istemezsiniz; bu da demektir ki, gizli anahtarınızı tutan güvenli bir cüzdan uygulamasına işlem göndermeleri için uygulamalara standart bir yol sağlamanız gerekiyor. İşte burada **Mobil Cüzdan Adaptörü (MWA)** devreye giriyor. Bu, mobil dApp'lerinizi cüzdanınıza bağlayan taşıma katmanıdır.

### MWA Nedir

Mobil Cüzdan Adaptörü (MWA), dApp'ler ile cüzdanlar arasındaki mobil bağlantıdır. Web'de alışık olduğumuz [cüzdan adaptörü](https://github.com/solana-labs/wallet-adapter) gibi, MWA'nın da yerel mobil dApp'ler oluşturmamıza olanak tanır. Ancak, web ve mobil farklı platformlar olduğundan, uygulama-cüzdan bağlantısına farklı bir yaklaşım benimsemek zorundayız.

Temel olarak, bir cüzdan uygulaması oldukça basittir. Sadece anahtar çiftinizin etrafında güvenli bir sargıdır. Harici uygulamalar, cüzdanın imzalama işlemlerini gerçekleştirmesini talep edebilir, ancak hiçbir zaman gizli anahtarınıza erişimleri olmaz. Hem web hem de mobil cüzdan adaptörleri, kendi platformları için bu etkileşimi tanımlar.

#### Web Cüzdanı Nasıl Çalışır?

Web cüzdanı, anahtar çiftlerini saklayan ve tarayıcının işlevlerine erişim talep etmesine olanak tanıyan basit bir tarayıcı uzantısıdır. Cüzdanın görevi, tarayıcıya hangi işlevlerin sunulması gerektiğini tanımlayan [cüzdan standartını](https://github.com/wallet-standard/wallet-standard) izlemektir:

- `registerWallet`
- `getWallets`
- `signAndSendTransaction`
- `signIn`
- `signTransaction`
- `signMessage`

Bu işlevler, global `window` nesnesi aracılığıyla tarayıcıya sunulmaktadır. Tarayıcı uzantısı kendisini bir cüzdan olarak kaydeder. Cüzdan adaptörü, bu kayıtlı cüzdanları arar ve istemcinin onlarla bağlantı kurmasına ve etkileşime girmesine olanak tanır.

Tarayıcı uzantısı cüzdanı, izole bir JavaScript çalıştırabilir. Bu, tarayıcıdaki `window` nesnesine işlevler enjekte edebileceği anlamına gelir. Tarayıcının gözünde, taşıma katmanı burada sadece ekstra bir JavaScript kodudur.

> Tarayıcı uzantılarının nasıl çalıştığını merak ediyorsanız, bazı [açık kaynaklı tarayıcı uzantılarına](https://github.com/solana-labs/browser-extension/tree/master) göz atabilirsiniz.

#### MWA, Web Cüzdanlarından Nasıl Farklıdır?

:::warning
Mobil Cüzdan Adaptörü (MWA) farklıdır. Web dünyasında, cüzdanlarımıza erişmek için yalnızca `window` nesnesine biraz kod enjekte etmemiz yeterli. Ancak, mobil uygulamalar sandbox içinde çalışmaktadır. Bu, her uygulamanın kodunun diğer uygulamalardan izole olduğu anlamına gelir. Uygulamalar arasında bir tarayıcının `window` nesnesiyle benzer bir paylaşılmış durum yoktur. Bu, cüzdan imzalaması için bir sorun teşkil etmektedir çünkü bir mobil cüzdan ve bir mobil dApp izole ortamlarda var olmaktadır.
:::

Yine de, iletişimi kolaylaştırmanın yolları vardır eğer yaratıcılığa açıksanız. Android'de, temel uygulamalar arası iletişim, [`Intents`](https://developer.android.com/guide/components/intents-filters) aracılığıyla yapılır. Bir Android Intent, başka bir uygulama bileşeninden bir eylem talep etmek için kullanılan bir mesajlaşma nesnesidir.

Bu belirli iletişim tek yönlüdür; oysa cüzdan işlevselliği için iki yönlü iletişim gereklidir. MWA, istek yapan uygulamadan bir intent kullanarak, cüzdan uygulaması ile iki yönlü iletişimi başlatmak için WebSockets kullanır.

Bu dersin geri kalanı, MWA arayüzü ve işlevselliği üzerine odaklanacaktır; ancak, daha fazla bilgi edinmek istiyorsanız [MWA spesifikasyonlarına](https://solana-mobile.github.io/mobile-wallet-adapter/spec/spec.html) göz atabilirsiniz.

### MWA ile Nasıl Çalışılır

MWA ile geleneksel cüzdan adaptörü arasındaki farklılıklar, uygulamalarınızın programlanma şeklinde küçük değişiklikler gerektirir.

#### Cüzdana Bağlanma

Karşılaştırma açısından, bir cüzdana bağlanma örneğine React ve React Native üzerinden bakalım.

Web'de, uygulamayı `WalletProvider` ile sarmalarsınız ve ardından çocuklar cüzdanı `useWallet` kancası aracılığıyla erişir. Bu aşamada, çocuklar cüzdanları görüntüleyebilir, seçebilir, bağlanabilir ve onlarla etkileşime girebilir.

```tsx
// Ebeveyn
<WalletProvider wallets={wallets}>{children}</WalletProvider>;

// Çocuk
const { wallets, select, connect } = useWallet();
const wallet = wallets[0]; // bir cüzdan seç
select(wallet); // cüzdanı seç
connect(); // bağlan
```

React Native'de, MWA kullanarak bu biraz farklı görünmektedir. Bu durumda, sağlayıcılara ihtiyaç yoktur. Bunun yerine, cüzdan bağlamı MWA paketi içindeki `transact` fonksiyonu aracılığıyla sağlanmaktadır. Arka planda, bu fonksiyon aktif Solana cüzdanlarını cihazlarda arar. Bu cüzdanları, kullanıcıya kısmi bir seçim penceresi aracılığıyla sunar. Kullanıcı bir cüzdan seçtiğinde, o cüzdan `transact` geri çağrısına bir argüman olarak sağlanır. Kodunuz, cüzdanla doğrudan etkileşime geçebilir.

```tsx
transact(async (wallet: Web3MobileWallet) => {
  // seçilen cüzdanın bağlamını döner
});
```

#### Cüzdanı Yetkilendirme

Web'de, bir cüzdanı tarayıcınızdaki bir siteye ilk bağladığınızda, cüzdan size siteyi yetkilendirmeniz için bir bildirim gösterir. Benzer şekilde, mobilde, talep eden uygulamanın, bir işlemi imzalamak gibi _ayrılmış_ yöntemler talep edebilmesi için yetkilendirilmesi gerekir.

Kodunuz, bu yetkilendirme sürecini `wallet.authorize()` çağrısıyla başlatabilir. Kullanıcı, yetkilendirme isteğini kabul etmesi veya reddetmesi için uyarılır. Döndürülen `AuthorizationResult`, kullanıcının kabulünü veya reddini gösterecektir. Kabul edildiği takdirde, bu sonuç nesnesi size kullanıcının hesabını ve `wallet.reauthorize()` ile sonraki çağrılarınızda kullanabileceğiniz bir `auth_token` sağlar. Bu auth token, diğer uygulamaların sizin uygulamanız gibi davranmasını engeller. Auth token, `authorize()` çağrısı sırasında oluşturulur ve dApp'ten gelen sonraki talepler, kullanıcıyı tekrar tekrar istemeden güvenli iletişimi sürdürmek için saklanan token ile `reauthorize()` yöntemini kullanabilir.

```tsx
transact(async (wallet: Web3MobileWallet) => {
  const authResult = wallet.authorize({
    cluster: "devnet",
    identity: { name: "Solana Counter Incrementor" },
  }); // Cüzdanı yetkilendirir

  const authToken = authResult.auth_token; // wallet.reauthorize() fonksiyonu için bunu kaydedin
  const publicKey = authResult.selectedAccount.publicKey;
});
```

::::note
`authorize` ve `deauthorize` hariç tüm yöntemlerin _ayrılmış_ yöntemler olduğunu belirtmek önemlidir. Bu nedenle, bir cüzdanın yetkilendirilip yetkilendirilmediğini takip etmek isteyeceksiniz ve `wallet.reauthorize()` çağrısını yapmanız gerekecektir. Aşağıda, yetkilendirme durumunu takip eden basit bir örnek bulunmaktadır:
::::

```tsx
const APP_IDENTITY = { name: "Solana Counter Incrementor" };
const [auth, setAuth] = useState<string | null>(null);

transact(async (wallet: Web3MobileWallet) => {
  let authResult;

  if (auth) {
    authResult = wallet.reauthorize({
      auth_token: auth,
      identity: APP_IDENTITY,
    });
  } else {
    authResult = wallet.authorize({
      cluster: "devnet",
      identity: APP_IDENTITY,
    });

    setAuth(authResult.auth_token);
  }

  const publicKey = authResult.selectedAccount.publicKey;
});
```

Yukarıdaki örneğin hata veya kullanıcı reddi durumlarını ele almadığını unutmayın. Üretim ortamında, yetkilendirme durumu ve yöntemlerini özel bir `useAuthorization` kancasıyla sarmak iyi bir fikirdir. Referans olarak, bunu `önceki derste yaptık`.

#### Cüzdanla Etkileşim

Cüzdanları bağlamak ve yetkilendirmek gibi, `signAndSendTransactions`, `signMessages` ve `signTransactions` gibi yöntemleri talep etmek web ve mobil arasında neredeyse aynıdır.

Web'de, bu yöntemlere `useWallet` kancası ile erişebilirsiniz. Bunları çağırmadan önce bağlandığınızdan emin olmalısınız:

```tsx
const { connected, signAllTransactions, signMessage, sendTransaction } = useWallet();

if (connected) {
  signAllTransactions(...);
  signMessage(...);
  sendTransaction(...);
}
```

MWA'da ise, bu yöntemleri `transact` geri aramasından sağlanan `wallet` bağlamında yalnızca çağırmanız gerekir:

```tsx
const APP_IDENTITY = { name: 'Solana Counter Incrementor' }
const [auth, setAuth] = useState<string | null>(null)

transact(async (wallet: Web3MobileWallet) => {
  let authResult;

  if (auth) {
    authResult = wallet.reauthorize({
          auth_token: auth,
          identity: APP_IDENTITY,
    })
  } else {
    authResult = wallet.authorize(
      {
        cluster: "devnet",
        identity: APP_IDENTITY
      }
    );
    setAuth(authResult.auth_token)
  }

  const publicKey = authResult.selectedAccount.publicKey

  // Etkileşiminizi seçin...
  wallet.signAndSendTransactions(...)
  wallet.signMessages(...)
  wallet.signTransactions(...)
});
```

:::tip
Bu yöntemleri her çağırmak istediğinizde, `wallet.authorize()` veya `wallet.reauthorize()` çağrısını yapmanız gerekecektir.

`wallet.signAndSendTransactions(...)` çağrısını yaparken, işlem hatalarını zarif bir şekilde ele almak önemlidir. İşlemler, ağ sorunları, imza uyuşmazlıkları veya yetersiz fonlar gibi çeşitli nedenlerle başarısız olabilir. Uygun hata yönetimi, kullanıcı deneyimini kolaylaştırır, işlem süreci sorunlarla karşılaşsa bile:
:::

```tsx
transact(async (wallet: Web3MobileWallet) => {
    try {
      const result = await wallet.signAndSendTransactions(...);
      // Başarıyı ele al
    } catch (error) {
      console.error("İşlemleri imzalama ve gönderme başarısız oldu:", error);
      // Hata yönetimi mantığını uygulayın
    }
});
```

Hepsi bu kadar! Başlamak için yeterli bilgiye sahip olmalısınız. Solana mobil ekibi, geliştirme deneyimini iki platform arasında mümkün olduğunca sorunsuz hale getirmek için çok çalıştı.

### MWA'nın Cüzdan Tarafında Yaptığı İşler

Bu ders, MWA'nın dApp'lerde ne yaptığını çoğunlukla ele almıştır, ancak MWA işlevselliğinin büyük bir kısmı cüzdanlarda gerçekleşmektedir. Kendi cüzdanınızı oluşturmak veya sistemi daha iyi anlamak istiyorsanız, MWA uyumlu cüzdanların yüksek seviyede ne yaptığını tartışmak önemlidir. Çoğu okuyucu için, bu bölümleri okuduktan sonra bir cüzdan oluşturabilme hissine sahip olmak zorunda değilsiniz; yalnızca genel akışı anlamaya çalışın.

#### `walletlib`e Giriş

Solana Mobile, `mobile-wallet-adapter-walletlib` oluşturarak ağır yükün çoğunu üstlenmiştir. Bu kütüphane, dApp'ler ve cüzdanlar arasındaki tüm düşük seviyeli iletişimi yönetir:

```bash
npm i @solana-mobile/mobile-wallet-adapter-walletlib
```

> **Bu paket** hala alfa aşamasındadır ve üretim için hazır değildir. Ancak, API stabildir ve önemli ölçüde değişmeyecektir; bu nedenle, cüzdanınızla entegrasyona başlayabilirsiniz.

Ancak, `walletlib` size bir kullanıcı arayüzü sağlamaz veya taleplerin sonucunu belirlemez. Bunun yerine, cüzdan kodunun talepleri almasına ve çözmesine olanak tanıyan bir kancayı açar. Cüzdan geliştiricisi, uygun kullanıcı arayüzünü görüntülemek, cüzdan davranışını yönetmek ve her talebi doğru şekilde çözmekten sorumludur.

#### Cüzdanlar `walletlib`i Nasıl Kullanır

Temel olarak, cüzdanlar `walletlib`i şu şekilde, tek bir fonksiyonu çağırarak kullanır: `useMobileWalletAdapterSession`. Bu fonksiyonu çağırırken, cüzdanlar aşağıdakileri sağlar:

1. Cüzdan ismi
2. `MobileWalletAdapterConfig` türünde bir yapılandırma nesnesi
3. Talepler için bir işleyici
4. Oturumlar için bir işleyici

Aşağıda, cüzdanların `walletlib`e nasıl bağlandığını gösteren bir örnek bileşen bulunmaktadır:

```tsx
import { useCallback, useMemo } from "react";
import { Text } from "react-native";
import { WalletProvider } from "./components/WalletProvider";
import {
  MWARequest,
  MWASessionEvent,
  MobileWalletAdapterConfig,
  useMobileWalletAdapterSession,
} from "./lib/mobile-wallet-adapter-walletlib/src";

function MWAApp() {
  const config: MobileWalletAdapterConfig = useMemo(() => {
    return {
      supportsSignAndSendTransactions: true,
      maxTransactionsPerSigningRequest: 10,
      maxMessagesPerSigningRequest: 10,
      supportedTransactionVersions: [0, "legacy"],
      noConnectionWarningTimeoutMs: 3000,
    };
  }, []);

  const handleRequest = useCallback((request: MWARequest) => {}, []);

  const handleSessionEvent = useCallback(
    (sessionEvent: MWASessionEvent) => {},
    [],
  );

  useMobileWalletAdapterSession(
    "React Native Fake Wallet",
    config,
    handleRequest,
    handleSessionEvent,
  );

  return <Text>Ben bir cüzdanım!</Text>;
}

export default MWAApp;
```

Kendi cüzdanınızı oluşturursanız, `config` nesnesini değiştirir ve `handleRequest` ve `handleSessionEvent` işleyicilerini uygun şekilde uygularsınız. Tüm bunlar gereklidir ve hepsi önemlidir; ancak, esas unsur istek işleyicisidir. Burada cüzdanlar, her isteğin uygulama mantığını sağlar; örn. bir dApp yetkilendirilmesi veya cüzdanın imzalayıp işlem göndermesi talep edildiğinde nasıl davranacağını belirler.

Örneğin, istek `MWARequestType.SignAndSendTransactionsRequest` türünde ise, kodunuz kullanıcıların gizli anahtarlarını kullanarak istekte sağlanan işlemi imzalar, isteği bir RPC sağlayıcısına gönderir ve ardından istek yapan dApp'e bir `resolve` fonksiyonu kullanarak yanıt verir.

`resolve` fonksiyonu, dApp'e ne olduğunu bildirir ve oturumu kapatır. `resolve` fonksiyonu iki argüman alır: `request` ve `response`. `request` ve `response` türleri, hangi türde bir orijinal istek olduğuna bağlı olarak farklıdır. Örneğin, `MWARequestType.SignAndSendTransactionsRequest` durumu için şu `resolve` fonksiyonunu kullanırsınız:

```ts
export function resolve(
  request: SignAndSendTransactionsRequest,
  response: SignAndSendTransactionsResponse,
): void;
```

`SignAndSendTransactionsResponse` türü aşağıdaki gibi tanımlanmıştır:

```ts
export type SignAndSendTransactionsCompleteResponse = Readonly<{
  signedTransactions: Uint8Array[];
}>;
export type SignAndSendTransactionsResponse =
  | SignAndSendTransactionsCompleteResponse
  | UserDeclinedResponse
  | TooManyPayloadsResponse
  | AuthorizationNotValidResponse
  | InvalidSignaturesResponse;
```

Hangi yanıtı gönderdiğiniz, işlemi imzalama ve gönderme girişiminizin sonucuna bağlı olacaktır.

:::info
`resolve` ile ilişkili tüm türleri öğrenmek isterseniz, [`walletlib` kaynak koduna](https://github.com/solana-mobile/mobile-wallet-adapter/blob/main/js/packages/mobile-wallet-adapter-walletlib/src/resolve.ts) göz atabilirsiniz.
:::

Son bir nokta, `walletlib` ile etkileşimde kullanılan bileşenin ayrıca uygulamanın `index.js` dosyasında MWA giriş noktası olarak kaydedilmesi gerektiğidir.

```js
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import MWAApp from "./MWAApp";

// Kötü durumları önlemek için sahte olay dinleyici işlevleri.
window.addEventListener = () => {};
window.removeEventListener = () => {};

AppRegistry.registerComponent(appName, () => App);

// MWA bileşenini kaydet
AppRegistry.registerComponent("MobileWalletAdapterEntrypoint", () => MWAApp);
```

### Laboratuvar

Şimdi mobil cüzdan inşa ederek pratik yapalım. Buradaki amaç, MWA sürecinin her iki tarafında neler olduğunu görmek ve uygulama-cüzdan ilişkisini daha iyi anlamaktır.

#### 0. Geliştirme ortamını kurun (gerekirse)

Cüzdanımızı programlamaya başlamadan önce bazı ayarlamalar yapmamız gerekiyor. Bir React Native geliştirme ortamına ve üzerinde test edilecek bir Solana dApp'e ihtiyacınız var. Eğer [Solana Mobile laboratuvarına](https://github.com/solana-developers/react-native-fake-wallet) tamamladıysanız, bu gereksinimlerden her ikisi de karşılanmalı ve sayaç uygulaması Android cihazınızda/emülatörünüzde kurulu olmalıdır.

Eğer [solana mobile'a giriş](https://github.com/solana-developers/react-native-fake-wallet) yapmadıysanız, gerekli adımlar:

1. Bir [Android React Native geliştirme ortamını](https://github.com/solana-developers/react-native-fake-wallet) bir cihaz veya emülatör ile kurun.
2. Aşağıdaki adımları terminalde izleyerek bir [Devnet Solana dApp'i](https://github.com/solana-developers/react-native-fake-wallet) kurun:

```bash
git clone https://github.com/solana-developers/react-native-fake-wallet
cd solana-react-native-counter
npm run install
```

#### 1. Uygulamanın yapısını planlama

Cüzdanı sıfırdan yapıyoruz, bu yüzden ana yapı taşlarımıza bir göz atalım.

Öncelikle, gerçek cüzdan uygulamasını (popup dahil değil) oluşturacağız. Bu, şunları içerecek:

- Bir `WalletProvider.tsx` oluşturmak
- `MainScreen.tsx` üzerinde değişiklik yapmak
- `App.tsx` üzerinde değişiklik yapmak

Sonra, cüzdanın başka bir dApp'den talep edildiğinde 'Ben bir Cüzdanım' yazan bir boilerplate MWA uygulaması oluşturacağız. Bu, şunları içerecek:

- Bir `MWAApp.tsx` oluşturmak
- `index.js` üzerinde değişiklik yapmak

Sonrasında, tüm UI ve istek yönlendirmemizi ayarlayacağız. Bu, şu anlama geliyor:

- `MWAApp.tsx` üzerinde değişiklik yapmak
- Bir `ButtonGroup.tsx` oluşturmak
- Bir `AppInfo.tsx` oluşturmak

Son olarak, iki gerçek istek işlevini, yetkilendirme ve imzalama ve gönderme işlemlerini gerçekleştireceğiz. Bu, aşağıdakileri oluşturmayı gerektirecek:

- `AuthorizeDappRequestScreen.tsx`
- `SignAndSendTransactionScreen.tsx`

#### 2. Cüzdan uygulamasını oluşturma

Uygulamayı şu şekilde oluşturuyoruz:

```bash
npx react-native@latest init wallet --npm
cd wallet
```

Şimdi bağımlılıklarımızı yükleyelim. Bunlar, `Solana Mobil laboratuvarına Giriş` kısmından alınan aynı bağımlılıklar ile birlikte iki ekleme yapılmıştır:

- `@react-native-async-storage/async-storage`: cihazda depolama erişimi sağlar
- `fast-text-encoding`: metin kodlaması için bir polyfill

:::note
Cüzdanın birden fazla oturum boyunca kalıcı olabilmesi için `async-storage`'ı anahtar çiftimizi depolamak için kullanacağız. 
Önemli bir nokta: `async-storage`, üretimde anahtarlarınızı saklamak için **_GÜVENLİ DEĞİLDİR_**. Tekrar, **_ÜRETİMDE KULLANMAYINIZ_**. Bunun yerine, [Android'in anahtar deposu sistemine](https://developer.android.com/privacy-and-security/keystore) bakın.
:::

Bu bağımlılıkları aşağıdaki komutla yükleyin:

```bash
npm install \
  @solana/web3.js \
  @solana-mobile/mobile-wallet-adapter-protocol-web3js \
  @solana-mobile/mobile-wallet-adapter-protocol \
  react-native-get-random-values \
  buffer \
  @coral-xyz/anchor \
  assert \
  bs58 \
  @react-native-async-storage/async-storage \
  fast-text-encoding
```

Solana'nın `mobile-wallet-adapter-walletlib` paketine bağımlı olmamız gerekiyor; bu paket tüm alt seviye iletişimi yönetir.

> Not: Bu paketin hala alfa aşamasında olduğunu ve üretime hazır olmadığını hatırlatmak isterim. Ancak, API kararlı ve büyük ölçüde değişmeyecek, bu nedenle cüzdanınızla entegrasyona başlayabilirsiniz.  
> — Geliştirici Notu

Paketi `lib` adında yeni bir klasörde yükleyelim:

```bash
npm i @solana-mobile/mobile-wallet-adapter-walletlib
```

Sonra, `android/build.gradle` dosyasında `minSdkVersion` değerini `23` olarak değiştirin.

```gradle
minSdkVersion = 23
```

Son olarak, uygulamayı inşa ederek başlangıç ayarını tamamlayın. Cihazınızda varsayılan React Native uygulamasının görünmesi gerekiyor./environment-setup?os=linux&platform=android&guide=native#jdk-studio

```bash
npm run android
```

Herhangi bir hata alırsanız, yukarıdaki adımları takip ettiğinizden emin olun.

---

#### 3. Ana cüzdan uygulamasını oluşturma

Oluşturacağımız cüzdan uygulamasının iki kısmı vardır:

1. Cüzdan uygulamasını manuel olarak açtığınızda gösterilen UI
2. Ayrı bir uygulama cüzdanı kullanmak istendiğinde alt sayfa olarak gösterilen UI

Bu laboratuvar boyunca bu kısımlara "ana cüzdan uygulaması" ve "cüzdan popup'ı" diyeceğiz.

- Uygulama ilk kez yüklendiğinde `Keypair` oluşturun
- Adresi ve Devnet SOL bakiyesini gösterin
- Kullanıcılara cüzdanlarına biraz Devnet SOL airdrop yapma imkanı tanıyın

Bunların hepsi iki dosya oluşturarak başarılabilir:

- `WalletProvider.tsx` - Bir Keypair oluşturur ve bunu `async-storage`'da saklar, sonraki oturumlarda anahtar çiftini alır. Ayrıca Solana `Connection`'ını sağlar
- `MainScreen.tsx` - Cüzdanı, bakiyesini ve bir airdrop butonunu gösterir

Önce `WalletProvider.tsx` ile başlayalım. Bu dosya, `Keypair`'in base58 kodlanmış bir versiyonunu saklamak için `async-storage` kullanacak. Sağlayıcı `@my_fake_wallet_keypair_key` depolama anahtarını kontrol edecek. Eğer hiçbir şey dönmezse, sağlayıcı bir anahtar çifti oluşturup saklayacaktır. `WalletProvider`, ardından `wallet` ve `connection` içeren bağlamını döndürecektir. Uygulamanın geri kalanı bu bağlamı `useWallet()` kancasıyla erişebilir.

:::warning
**_TEKRAR_**, asenkron depolama, gizli anahtarları üretimde saklamak için uygun değildir. Lütfen [Android'in anahtar deposu sistemi](https://developer.android.com/privacy-and-security/keystore) gibi bir şey kullanın.
:::

Yeni bir `components` adında bir dizinde `WalletProvider.tsx` dosyasını oluşturalım:

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Connection, Keypair } from "@solana/web3.js";
import { encode, decode } from "bs58";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

const ASYNC_STORAGE_KEY = "@my_fake_wallet_keypair_key";

interface EncodedKeypair {
  publicKeyBase58: string;
  secretKeyBase58: string;
}

function encodeKeypair(keypair: Keypair): EncodedKeypair {
  return {
    publicKeyBase58: keypair.publicKey.toBase58(),
    secretKeyBase58: encode(keypair.secretKey),
  };
}

function decodeKeypair(encodedKeypair: EncodedKeypair): Keypair {
  const secretKey = decode(encodedKeypair.secretKeyBase58);
  return Keypair.fromSecretKey(secretKey);
}

export interface WalletContextData {
  wallet: Keypair | null;
  connection: Connection;
}

const WalletContext = createContext<WalletContextData>({
  wallet: null,
  connection: new Connection("https://api.devnet.solana.com"),
});

export const useWallet = () => useContext(WalletContext);

export interface WalletProviderProps {
  rpcUrl?: string;
  children: ReactNode;
}

export function WalletProvider(props: WalletProviderProps) {
  const { rpcUrl, children } = props;
  const [keyPair, setKeyPair] = useState<Keypair | null>(null);

  const fetchOrGenerateKeypair = async () => {
    try {
      const storedKey = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
      let keyPair;
      if (storedKey) {
        const encodedKeypair: EncodedKeypair = JSON.parse(storedKey);
        keyPair = decodeKeypair(encodedKeypair);
      } else {
        // Yerel depolamada daha sonra geri almak için yeni rastgele bir anahtar çifti oluşturun ve saklayın
        // Bu güvenli değildir! Asenkron depolama demo amaçlı kullanılır. Anahtarları bu şekilde saklamayın!
        keyPair = Keypair.generate();
        await AsyncStorage.setItem(
          ASYNC_STORAGE_KEY,
          JSON.stringify(encodeKeypair(keyPair)),
        );
      }
      setKeyPair(keyPair);
    } catch (error) {
      console.log("Anahtar çiftini alma hatası: ", error);
    }
  };

  useEffect(() => {
    fetchOrGenerateKeypair();
  }, []);

  const connection = useMemo(
    () => new Connection(rpcUrl ?? "https://api.devnet.solana.com"),
    [rpcUrl],
  );

  const value = {
    wallet: keyPair,
    connection,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
```

`rpcUrl`'mizi Devnet olarak varsayılmaktadır.

Şimdi `MainScreen.tsx` dosyasını oluşturalım. Bu dosya, 'useWallet()' kancasından `wallet` ve `connection`'ı almalı ve ardından adres ve bakiyeyi göstermelidir. Ayrıca, tüm işlemlerin bir işlem ücreti gerektirdiğinden, bir airdrop butonunu da ekleyeceğiz.

`MainScreen.tsx` adında yeni bir dosya oluşturmak için `screens` adında yeni bir dizin oluşturalım:

```tsx
import { Button, StyleSheet, Text, View } from "react-native";
import { useWallet } from "../components/WalletProvider";
import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center", // Çocukları ana eksende (dikey olarak sütun) merkezler
    alignItems: "center", // Çocukları çapraz eksende (yatay olarak sütun) merkezler
  },
});

function MainScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<null | number>(null);
  const { wallet, connection } = useWallet();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    updateBalance();
  }, [wallet]);

  const updateBalance = async () => {
    if (wallet) {
      try {
        const lamports = await connection.getBalance(wallet.publicKey);
        setBalance(lamports / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Bakiye alma / güncelleme hatası:", error);
        setErrorMessage("Bakiyeyi almakta hata oluştu");
      }
    }
  };

  const airdrop = async () => {
    if (wallet && !isLoading) {
      setIsLoading(true);
      try {
        const signature = await connection.requestAirdrop(
          wallet.publicKey,
          LAMPORTS_PER_SOL,
        );
        await connection.confirmTransaction(signature, "max");
        await updateBalance();
      } catch (error) {
        console.log("Airdrop talep etme hatası", error);
        setErrorMessage("Airdrop başarısız oldu");
      }

      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Cüzdan:</Text>
      <Text>{wallet?.publicKey.toString() ?? "Cüzdan Yok"}</Text>
      <Text>Bakiyeniz:</Text>
      <Text>{balance?.toFixed(5) ?? ""}</Text>
      {isLoading && <Text>Yükleniyor...</Text>}
      {errorMessage && <Text style={{ color: "red" }}>{errorMessage}</Text>}
      {balance !== null && !isLoading && balance < 0.005 && (
        <Button title="1 SOL Airdrop" onPress={airdrop} />
      )}
    </View>
  );
}

export default MainScreen;
```

Son olarak, cüzdanımızın 'uygulama' kısmını tamamlamak için `App.tsx` dosyasını düzenleyelim:

```tsx
import { SafeAreaView, Text, View } from "react-native";
import MainScreen from "./screens/MainScreen";
import "react-native-get-random-values";
import { WalletProvider } from "./components/WalletProvider";
import React from "react";

function App(): JSX.Element {
  return (
    <SafeAreaView>
      <WalletProvider>
        <MainScreen />
      </WalletProvider>
    </SafeAreaView>
  );
}

export default App;
```

Her şeyin düzgün çalıştığından emin olmak için inşa edip dağıtın:

```bash
npm run android
```

---

#### 4. Yardımcı bileşenler oluşturma

Şimdi kısa bir mola verip cüzdan popup'ı için ihtiyaç duyacağımız bazı yardımcı UI bileşenleri oluşturalım. `AppInfo.tsx` içinde metinler için bir düzen ve `ButtonGroup.tsx` içinde bazı butonlar tanımlayacağız.

Öncelikle, `AppInfo.tsx` bize cüzdan bağlantısı talep eden dApp'den gelen ilgili bilgileri gösterecektir. Aşağıdaki içeriği `components/AppInfo.tsx` olarak oluşturun:

```tsx
import { Text, View } from "react-native";

interface AppInfoProps {
  title?: string;
  cluster?: string;
  appName?: string;
  scope?: string;
}

function AppInfo(props: AppInfoProps) {
  const { title, cluster, appName, scope } = props;
  return (
    <>
      <Text>{title}</Text>
      <View>
        <Text>Talep Verileri</Text>
        <Text>Küme: {cluster ? cluster : "NA"}</Text>
        <Text>Uygulama adı: {appName ? appName : "NA"}</Text>
        <Text>Kapsam: {scope ? scope : "NA"}</Text>
      </View>
    </>
  );
}

export default AppInfo;
```

İkincisi, `components/ButtonGroup.tsx` olarak bir "kabul" ve "reddet" butonunu gruplandıran bir bileşen oluşturalım:

```tsx
import { Button, Dimensions, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  button: { flex: 1, marginHorizontal: 8 },
  buttonGroup: {
    width: Dimensions.get("window").width,
    display: "flex",
    flexDirection: "row",
    marginVertical: 16,
  },
});

interface ButtonGroupProps {
  positiveOnClick: () => any;
  negativeOnClick: () => any;
  positiveButtonText: string;
  negativeButtonText: string;
}
const ButtonGroup = (props: ButtonGroupProps) => {
  return (
    <View style={styles.buttonGroup}>
      <Button
        onPress={props.positiveOnClick}
        title={props.positiveButtonText}
      />
      <Button
        onPress={props.negativeOnClick}
        title={props.negativeButtonText}
      />
    </View>
  );
};

export default ButtonGroup;
```

---

#### 5. Cüzdan popup'ı için iskelet oluşturma

Cüzdan popup'ı, Solana dApp'ın `solana-wallet://` için bir niyet gönderdiğinde görülen bileşendir. Cüzdanımız bunu dinleyecek, bir bağlantı kuracak ve popup'ı render edecektir.

Neyse ki, düşük seviyede bir şey uygulamak zorunda değiliz. Solana, `mobile-wallet-adapter-walletlib` kütüphanesinde zahmetli çalışmayı bizim için yaptı. Tek yapmamız gereken görünümü oluşturmak ve dApp'den gelen talepleri yönetmektir.

Öncelikle, popup'ın en basit hali ile başlayalım. Sadece bir dApp bağlandığında "Ben bir cüzdanım" mesajını verecektir.

Bu popup'ın bir Solana dApp erişim talep ettiğinde açılması için `walletName` - cüzdanın adı, `config` - `MobileWalletAdapterConfig` türünde basit cüzdan yapılandırmaları, `handleRequest` - dApp'den gelen istekleri yöneten geri çağırma fonksiyonu ve `handleSessionEvent` - oturum olaylarını yöneten bir geri çağırma fonksiyonu gereklidir.

`useMobileWalletAdapterSession`'ı tatmin etmek için minimum yapılandırmanın örneği:

```tsx
const config: MobileWalletAdapterConfig = useMemo(() => {
  return {
    supportsSignAndSendTransactions: true,
    maxTransactionsPerSigningRequest: 10,
    maxMessagesPerSigningRequest: 10,
    supportedTransactionVersions: [0, "legacy"],
    noConnectionWarningTimeoutMs: 3000,
  };
}, []);

const handleRequest = useCallback((request: MWARequest) => {}, []);

const handleSessionEvent = useCallback(
  (sessionEvent: MWASessionEvent) => {},
  [],
);

useMobileWalletAdapterSession(
  "React Native Sahte Cüzdan",
  config,
  handleRequest,
  handleSessionEvent,
);
```

Öncelikle `handleRequest` ve `handleSessionEvent`'i uygulayacağız, ama önce en basit popup'ın çalışmasını sağlayalım.

Projenizin kökünde `MWAApp.tsx` adında yeni bir dosya oluşturun:

```tsx
import { useCallback, useMemo } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { WalletProvider } from "./components/WalletProvider";
import {
  MWARequest,
  MWASessionEvent,
  MobileWalletAdapterConfig,
  useMobileWalletAdapterSession,
} from "./lib/mobile-wallet-adapter-walletlib/src";

const styles = StyleSheet.create({
  container: {
    margin: 0,
    bottom: 0,
    width: "100%",
    backgroundColor: "black",
  },
});

function MWAApp() {
  const config: MobileWalletAdapterConfig = useMemo(() => {
    return {
      supportsSignAndSendTransactions: true,
      maxTransactionsPerSigningRequest: 10,
      maxMessagesPerSigningRequest: 10,
      supportedTransactionVersions: [0, "legacy"],
      noConnectionWarningTimeoutMs: 3000,
    };
  }, []);

  const handleRequest = useCallback((request: MWARequest) => {}, []);

  const handleSessionEvent = useCallback(
    (sessionEvent: MWASessionEvent) => {},
    [],
  );

  useMobileWalletAdapterSession(
    "React Native Sahte Cüzdan",
    config,
    handleRequest,
    handleSessionEvent,
  );

  return (
    <SafeAreaView>
      <WalletProvider>
        <View style={styles.container}>
          <Text style={{ fontSize: 50 }}>Ben bir cüzdanım!</Text>
        </View>
      </WalletProvider>
    </SafeAreaView>
  );
}

export default MWAApp;
```

Son yapmamız gereken şey, `index.js` dosyasında MWA uygulamamızı `MobileWalletAdapterEntrypoint` adı altında giriş noktası olarak kaydetmek.

`index.js` dosyasını aşağıdaki gibi değiştirin:

```js
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import MWAApp from "./MWAApp";

// Hata vermelerini engellemek için sahte olay dinleyicisi işlevleri.
window.addEventListener = () => {};
window.removeEventListener = () => {};

AppRegistry.registerComponent(appName, () => App);

// MWA bileşenini kaydet
AppRegistry.registerComponent("MobileWalletAdapterEntrypoint", () => MWAApp);
```

Bunun çalıştığından emin olmak için bunu test edin. Öncelikle

```bash
npm run android
```

Devnet Solana dApp'inizi açın, ideal olarak önceki dersten `counter` uygulaması, ardından bir istek yapın.

Ekranın altından "Ben bir cüzdanım" mesajını içeren bir sheet görmelisiniz.

#### 6. MWA iskeletini oluşturun

`MWAApp.tsx` dosyasını geliştirelim, böylece daha sonra kullanıcıların bağlanmasını, imza atmasını ve işlemleri göndermesini sağlayacak olan mimarinin bazı bölümlerini scaffolding yapmış olalım. Şimdilik, MWA fonksiyonlarından yalnızca ikisi için bu işlemi gerçekleştireceğiz: `authorize` ve `signAndSendTransaction`.

Başlamak için `MWAApp.tsx` dosyasına birkaç şey ekleyeceğiz:

1. `currentRequest` ve `currentSession` değerlerini `useState`'te saklayarak yaşam döngüsü yönetimi yapın. Bu, bir bağlantının yaşam döngüsünü takip etmemize olanak tanır.
   
   :::note
   Bu, kullanıcı etkileşimlerinin yönetimi için önemlidir.
   :::

2. Pop-up'ı nazikçe kapatmak için bir `hardwareBackPress` dinleyicisi ekleyin. Bu, `resolve` fonksiyonunu `MWARequestFailReason.UserDeclined` ile çağırmalıdır.
3. `SessionTerminatedEvent` dinleyicisi ekleyin, bu da pop-up'ı kapatmak için `useEffect` içerisinde `exitApp` fonksiyonunu çağıracaktır. Bunu işlevselliği korumak için yardımcı bir fonksiyonda gerçekleştireceğiz.
4. `ReauthorizeDappRequest` istek türünü dinleyin ve otomatik olarak çözümleyin.
5. Farklı istek türleri için uygun içeriği `renderRequest()` fonksiyonu ile görüntüleyin. Bu, istek türüne bağlı olarak farklı UI'lere yönlendirme yapacak bir `switch` ifadesi olmalıdır.

`MWAApp.tsx` dosyanızı aşağıdaki gibi değiştirebilirsiniz:

```tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BackHandler,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WalletProvider } from "./components/WalletProvider";
import {
  AuthorizeDappRequest,
  MWARequest,
  MWARequestFailReason,
  MWARequestType,
  MWASessionEvent,
  MWASessionEventType,
  MobileWalletAdapterConfig,
  ReauthorizeDappCompleteResponse,
  ReauthorizeDappResponse,
  SignAndSendTransactionsRequest,
  getCallingPackage,
  resolve,
  useMobileWalletAdapterSession,
} from "./lib/mobile-wallet-adapter-walletlib/src";

const styles = StyleSheet.create({
  container: {
    margin: 0,
    width: "100%",
    backgroundColor: "black",
    color: "black",
  },
});

function MWAApp() {
  const [currentRequest, setCurrentRequest] = useState<MWARequest | null>(null);
  const [currentSession, setCurrentSession] = useState<MWASessionEvent | null>(
    null,
  );
  // ------------------- FONKSYONLAR --------------------

  const endWalletSession = useCallback(() => {
    setTimeout(() => {
      BackHandler.exitApp();
    }, 200);
  }, []);

  const handleRequest = useCallback((request: MWARequest) => {
    setCurrentRequest(request);
  }, []);

  const handleSessionEvent = useCallback((sessionEvent: MWASessionEvent) => {
    setCurrentSession(sessionEvent);
  }, []);

  // ------------------- ETKİNLİKLER --------------------

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (currentRequest) {
          switch (currentRequest.__type) {
            case MWARequestType.AuthorizeDappRequest:
            case MWARequestType.SignAndSendTransactionsRequest:
            case MWARequestType.SignMessagesRequest:
            case MWARequestType.SignTransactionsRequest:
              resolve(currentRequest, {
                failReason: MWARequestFailReason.UserDeclined,
              });
              break;
            default:
              console.warn("İşlenmemiş istek türü");
          }
        }
        return true; // Varsayılan geri düğmesi davranışını engeller
      },
    );
    return () => backHandler.remove();
  }, [currentRequest]);

  useEffect(() => {
    if (currentSession?.__type === MWASessionEventType.SessionTerminatedEvent) {
      endWalletSession();
    }
  }, [currentSession]);

  useEffect(() => {
    if (!currentRequest) {
      return;
    }

    if (currentRequest.__type === MWARequestType.ReauthorizeDappRequest) {
      resolve(currentRequest, {
        authorizationScope: new TextEncoder().encode("app"),
      });
    }
  }, [currentRequest, endWalletSession]);

  // ------------------- MWA --------------------

  const config: MobileWalletAdapterConfig = useMemo(() => {
    return {
      supportsSignAndSendTransactions: true,
      maxTransactionsPerSigningRequest: 10,
      maxMessagesPerSigningRequest: 10,
      supportedTransactionVersions: [0, "legacy"],
      noConnectionWarningTimeoutMs: 3000,
    };
  }, []);

  useMobileWalletAdapterSession(
    "React Native Fake Wallet",
    config,
    handleRequest,
    handleSessionEvent,
  );

  // ------------------- GÖRÜNTÜLEME --------------------

  const renderRequest = () => {
    if (!currentRequest) {
      return <Text>Hiçbir istek yok</Text>;
    }

    switch (currentRequest?.__type) {
      case MWARequestType.AuthorizeDappRequest:
      case MWARequestType.SignAndSendTransactionsRequest:
      case MWARequestType.SignMessagesRequest:

      case MWARequestType.SignTransactionsRequest:      
      default:
        return <Text>TODO Ekranı göster için {currentRequest?.__type}</Text>;
    }
  };

  // ------------------- GÖRÜNTÜLEME --------------------

  return (
    <SafeAreaView>
      <WalletProvider>
        <View style={styles.container}>
          <Text>İSTEK: {currentRequest?.__type.toString()}</Text>
          {renderRequest()}
        </View>
      </WalletProvider>
    </SafeAreaView>
  );
}

export default MWAApp;
```

Dikkat edin ki `renderRequest` şu anda kullanışlı bir şey render etmiyor. Farklı istekleri nasıl *işleyeceğimizi* hala belirlememiz gerekiyor.

---

#### 7. Yetkilendirme açılır penceresini implement edin

Yeni yetkilendirmeleri işlemek için ilk ekranımızı bir araya getirelim. Bu ekranın tek görevi, hangi uygulamanın yetkilendirme istediğini göstermek ve kullanıcının isteği kabul etmesine veya reddetmesine olanak tanımaktır. Bu işlemi `walletlib`'den `resolve` fonksiyonunu kullanarak gerçekleştireceğiz.

`AppInfo` ve `ButtonGroup` bileşenlerimizi kullanarak tüm UI'mizi burada oluşturacağız. Tek yapmamız gereken doğru bilgileri eklemek ve isteği kabul etme ve reddetme mantığını yazmaktır.

Yetkilendirme için kullanacağımız `resolve` fonksiyonu, `AuthorizeDappRequest` ve `AuthorizeDappResponse` türlerini kullananıdır. 

> **Dikkat:** 
> `AuthorizeDappResponse`, `AuthorizeDappCompleteResponse` ve `UserDeclinedResponse` türlerinin birleşimidir. Her birinin tanımı aşağıda gösterilmiştir:

```ts
export type AuthorizeDappResponse =
  | AuthorizeDappCompleteResponse
  | UserDeclinedResponse;

export type AuthorizeDappCompleteResponse = Readonly<{
  publicKey: Uint8Array;
  accountLabel?: string;
  walletUriBase?: string;
  authorizationScope?: Uint8Array;
}>;

export type UserDeclinedResponse = Readonly<{
  failReason: MWARequestFailReason.UserDeclined;
}>;
```

Mantığımız, isteği çözerken bunlardan hangisini kullanacağımızı belirleyecektir.

Tüm bu bağlamı elde ettiğimize göre, her şeyi `screens/AuthorizeDappRequestScreen.tsx` adlı yeni bir dosyaya bir araya getirebiliriz:

```tsx
import "fast-text-encoding";
import React from "react";
import { useWallet } from "../components/WalletProvider";
import {
  AuthorizeDappCompleteResponse,
  AuthorizeDappRequest,
  MWARequestFailReason,
  resolve,
} from "../lib/mobile-wallet-adapter-walletlib/src";
import AppInfo from "../components/AppInfo";
import ButtonGroup from "../components/ButtonGroup";
import { Text, View } from "react-native";

export interface AuthorizeDappRequestScreenProps {
  request: AuthorizeDappRequest;
}

function AuthorizeDappRequestScreen(props: AuthorizeDappRequestScreenProps) {
  const { request } = props;
  const { wallet } = useWallet();

  if (!wallet) {
    throw new Error("Cüzdan bulunamadı");
  }

  const authorize = () => {
    resolve(request, {
      publicKey: wallet?.publicKey.toBytes(),
      authorizationScope: new TextEncoder().encode("app"),
    } as AuthorizeDappCompleteResponse);
  };

  const reject = () => {
    resolve(request, {
      failReason: MWARequestFailReason.UserDeclined,
    });
  };

  return (
    <View>
      <AppInfo
        title="Dapp Yetkilendirme"
        appName={request.appIdentity?.identityName}
        cluster={request.cluster}
        scope={"app"}
      />

      <ButtonGroup
        positiveButtonText="Yetkilendir"
        negativeButtonText="Reddet"
        positiveOnClick={authorize}
        negativeOnClick={reject}
      />
    </View>
  );
}

export default AuthorizeDappRequestScreen;
```

Artık `MWAApp.tsx` dosyamızı bu durumu işlemek üzere güncelleyebiliriz ve `renderRequest` switch durumuna ekleme yapabiliriz:

```tsx
switch (currentRequest?.__type) {
  case MWARequestType.AuthorizeDappRequest:
    return (
      <AuthorizeDappRequestScreen
        request={currentRequest as AuthorizeDappRequest}
      />
    );
  case MWARequestType.SignAndSendTransactionsRequest:
  case MWARequestType.SignMessagesRequest:
  case MWARequestType.SignTransactionsRequest:
  default:
    return <Text>TODO Ekranı göster için {currentRequest?.__type}</Text>;
}
```

Cüzdanınızı tekrar oluşturup çalıştırmaktan çekinmeyin. Başka bir Solana uygulamasıyla ilk etkileşiminizde, yeni yetkilendirme ekranımız artık görünecektir.

---

#### 8. İmza ve gönderimi açılır penceresini implement edin

Cüzdan uygulamamızı imza ve gönderim işlem ekranı ile tamamlayalım. Burada, işlemleri `request`'ten alacağız, onları `WalletProvider`'dan gizli anahtarımız ile imzalayacağız ve ardından bir RPC'ye göndereceğiz.

UI'imiz yetkilendirme sayfamıza çok benzeyecek. `AppInfo` ile uygulama hakkında bazı bilgiler sağlayacağız ve `ButtonGroup` ile bazı düğmeler oluşturacağız. Bu sefer, `resolve` fonksiyonu için `SignAndSendTransactionsRequest` ve `SignAndSendTransactionsResponse`'i yerine getireceğiz.

```ts
export function resolve(
  request: SignAndSendTransactionsRequest,
  response: SignAndSendTransactionsResponse,
): void;
```

Daha spesifik olarak, `SignAndSendTransactionsResponse` ile birleştirilen şunlara uymamız gerekecek:

```ts
export type SignAndSendTransactionsCompleteResponse = Readonly<{
  signedTransactions: Uint8Array[];
}>;
export type SignAndSendTransactionsResponse =
  | SignAndSendTransactionsCompleteResponse
  | UserDeclinedResponse
  | TooManyPayloadsResponse
  | AuthorizationNotValidResponse
  | InvalidSignaturesResponse;
```

Sadece `SignAndSendTransactionsCompleteResponse`, `InvalidSignaturesResponse` ve `UserDeclinedResponse`'yi ele alacağız.

Özellikle, `InvalidSignaturesResponse`'ye uymamız gerekecek:

```ts
export type InvalidSignaturesResponse = Readonly<{
  failReason: MWARequestFailReason.InvalidSignatures;
  valid: boolean[];
}>;
```

**Not:** `InvalidSignaturesResponse` benzersizdir çünkü her biri başarısız bir işleme karşılık gelen bir boolean dizisi gerektirir. Bu nedenle buna dikkat etmemiz gerekecek.

İmza atma ve gönderme işlemleri için biraz çalışmamız gerekecek. İşlemleri soketler üzerinden gönderdiğimiz için, işlem verileri byte'lara serileştirilmiştir. Önce imzalamadan önce işlemleri deserialize etmemiz gerekecek.

Bunu iki fonksiyonda gerçekleştirebiliriz:

- `signTransactionPayloads`: imzalanmış işlemleri ve birbiriyle ilgili `valid` boolean dizisini döndürür. Bu diziyi, bir imzanın başarısız olup olmadığını kontrol etmek için kullanacağız.
- `sendSignedTransactions`: imzalanmış işlemleri alır ve bunları RPC'ye gönderir. Benzer şekilde, hangi işlemlerin başarısız olduğunu bilmek için bir dizi `valid` boolean tutar.

Tüm bunları `screens/SignAndSendTransactionScreen.tsx` adlı yeni bir dosyada bir araya getirelim:

```tsx
import {
  Connection,
  Keypair,
  TransactionSignature,
  VersionedTransaction,
} from "@solana/web3.js";
import { useState } from "react";
import {
  MWARequestFailReason,
  SignAndSendTransactionsRequest,
  resolve,
} from "../lib/mobile-wallet-adapter-walletlib/src";

import { useWallet } from "../components/WalletProvider";
import { Text, View } from "react-native";
import AppInfo from "../components/AppInfo";
import ButtonGroup from "../components/ButtonGroup";
import { decode } from "bs58";

export async function sendSignedTransactions(
  signedTransactions: Array<Uint8Array>,
  minContextSlot: number | undefined,
  connection: Connection,
): Promise<[boolean[], Uint8Array[]]> {
  const valid = signedTransactions.map(_ => true);
  const signatures: (Uint8Array | null)[] = await Promise.all(
    signedTransactions.map(async (byteArray, index) => {
      try {
        const transaction: VersionedTransaction =
          VersionedTransaction.deserialize(byteArray);

        const signature: TransactionSignature =
          await connection.sendTransaction(transaction, {
            minContextSlot: minContextSlot,
            preflightCommitment: "finalized",
            skipPreflight: true,
          });

        const response = await connection.confirmTransaction(
          signature,
          "confirmed",
        );

        return decode(signature);
      } catch (error) {
        console.log("İşlem gönderiminde hata: " + error);
        valid[index] = false;
        return null;
      }
    }),
  );

  return [valid, signatures as Uint8Array[]];
}

export function signTransactionPayloads(
  wallet: Keypair,
  payloads: Uint8Array[],
): [boolean[], Uint8Array[]] {
  const valid = payloads.map(_ => true);

  const signedPayloads = payloads.map((payload, index) => {
    try {
      const transaction: VersionedTransaction =
        VersionedTransaction.deserialize(new Uint8Array(payload));

      transaction.sign([
        {
          publicKey: wallet.publicKey,
          secretKey: wallet.secretKey,
        },
      ]);
      return transaction.serialize();
    } catch (error) {
      console.log("İmza hatası: " + error);
      valid[index] = false;
      return new Uint8Array([]);
    }
  });

  return [valid, signedPayloads];
}

export interface SignAndSendTransactionScreenProps {
  request: SignAndSendTransactionsRequest;
}

function SignAndSendTransactionScreen(
  props: SignAndSendTransactionScreenProps,
) {
  const { request } = props;
  const { wallet, connection } = useWallet();
  const [loading, setLoading] = useState(false);

  if (!wallet) {
    throw new Error("Cüzdan null veya tanımsız");
  }

  const signAndSendTransaction = async (
    wallet: Keypair,
    connection: Connection,
    request: SignAndSendTransactionsRequest,
  ) => {
    const [validSignatures, signedTransactions] = signTransactionPayloads(
      wallet,
      request.payloads,
    );

    if (validSignatures.includes(false)) {
      resolve(request, {
        failReason: MWARequestFailReason.InvalidSignatures,
        valid: validSignatures,
      });
      return;
    }

    const [validTransactions, transactionSignatures] =
      await sendSignedTransactions(
        signedTransactions,
        request.minContextSlot ? request.minContextSlot : undefined,
        connection,
      );

    if (validTransactions.includes(false)) {
      resolve(request, {
        failReason: MWARequestFailReason.InvalidSignatures,
        valid: validTransactions,
      });
      return;
    }

    resolve(request, { signedTransactions: transactionSignatures });
  };

  const signAndSend = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signAndSendTransaction(wallet, connection, request);
    } catch (error) {
      const valid = request.payloads.map(() => false);
      resolve(request, {
        failReason: MWARequestFailReason.InvalidSignatures,
        valid,
      });
      console.error("İşlem başarısız oldu:", error);
    } finally {
      setLoading(false);
    }
  };

  const reject = () => {
    resolve(request, { failReason: MWARequestFailReason.UserDeclined });
  };

  return (
    <View>
      <AppInfo
        title="İmza ve Gönderim İşlemi"
        appName={request.appIdentity?.identityName}
        cluster={request.cluster}
        scope={"app"}
      />
      <Text>Yüklemeler</Text>
      <Text>
        Bu isteğin {request.payloads.length}{" "}
        {request.payloads.length > 1 ? "yüklemesi" : "yükleme"} imzalanması gerekiyor.
      </Text>
      <ButtonGroup
        positiveButtonText="İmzala ve Gönder"
        negativeButtonText="Reddet"
        positiveOnClick={signAndSend}
        negativeOnClick={reject}
      />
      {loading && <Text>Yükleniyor...</Text>}
    </View>
  );
}

export default SignAndSendTransactionScreen;
```

Son olarak, `MWAApp.tsx` dosyasını güncelleyip yeni ekranımızı switch durumuna ekleyelim:

```tsx
switch (currentRequest?.__type) {
  case MWARequestType.AuthorizeDappRequest:
    return (
      <AuthorizeDappRequestScreen
        request={currentRequest as AuthorizeDappRequest}
      />
    );
  case MWARequestType.SignAndSendTransactionsRequest:
    return (
      <SignAndSendTransactionScreen
        request={currentRequest as SignAndSendTransactionsRequest}
      />
    );
  case MWARequestType.SignMessagesRequest:
  case MWARequestType.SignTransactionsRequest:
  default:
    return <Text>TODO Ekranı göster için {currentRequest?.__type}</Text>;
}
```

Cüzdan uygulamanızı oluşturup çalıştırın. Artık dApp'inizi yetkilendirebilir ve işlemleri imzalayıp gönderebilirsiniz. `SignMessagesRequest` ve `SignTransactionsRequest`'i boş bıraktığımızı unutmayın, böylece bunu Challenge'da yapabilirsiniz.

---

### Challenge

Şimdi bağımsız bir şekilde pratik yapma sırası sizde. Son iki istek türünü implement etmeye çalışın: `SignMessagesRequest` ve `SignTransactionsRequest`.

Bunu yardım almadan yapmaya çalışın, çünkü harika bir pratik ama takılırsanız [repo'daki çözüm koduna](https://github.com/solana-developers/react-native-fake-solana-wallet) bakmayı unutmayın.


Kodunuzu GitHub'a itin ve
[bize bu ders hakkındaki düşüncelerinizi söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=5a3d0f62-c5fc-4e03-b8a3-323c2c7b8f4f)!
