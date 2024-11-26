---
title: Expo ile Solana Mobil dApp'leri Oluşturma
objectives:
  - Expo ile Solana dApp'leri oluşturma
  - Mobil spesifik çevresel durumları ve yetenekleri kullanma
  - Ekosistem kütüphanelerini mobil dApp'lerinize entegre etme
description: "Expo uygulamalarınızda Solana'yı nasıl kullanacağınız."
---

## Özet

- Expo, React Native'in etrafında dönen açık kaynaklı bir araç ve kütüphane koleksiyonudur; tıpkı Next.js'in React üzerine inşa edilmiş bir çerçeve olması gibi.
- Kurulum ve dağıtım sürecini basitleştirmenin yanı sıra, Expo mobil cihaz çevresel durumlarına ve yeteneklerine erişim sağlayan paketler sunar.
- Birçok Solana ekosistem kütüphanesi yerel olarak React Native'i desteklemiyor, ancak genellikle uygun [polyfill'lerle](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill) kullanılabilirler.

## Ders

Şu ana kadar Solana Mobil'i keşfederken, oldukça basit mobil dApp'ler oluşturmak için vanilla React Native kullandık. Birçok web geliştiricisi, Next.js gibi React üzerine inşa edilmiş çerçeveler kullanmayı tercih ederken, birçok React Native geliştiricisi de React Native geliştirmesini, testini ve dağıtım sürecini basitleştiren çerçeveler ve araçlar kullanmayı tercih ediyor. Bunun en yaygını [React Native Expo](https://docs.expo.dev/tutorial/introduction/)dır.

Bu ders iki ana konuyu keşfedecek:

1. **React Native geliştirmesini hızlandırmak için React Native Expo'yu nasıl kullanacağınız**
2. **React Native'i açıkça desteklemeyen Solana ekosisteminden JS/TS kütüphanelerini nasıl entegre edeceğiniz** (örneğin, Metaplex)

Bu konular en iyi uygulamalı bir şekilde keşfedileceği için bu dersin çoğunluğu laboratuvar ile geçirilecektir.

### React Native Expo

Expo, React Native'in etrafında dönen, Android, iOS ve web için evrensel yerel uygulamalar oluşturmak için kullanılan açık kaynaklı bir platformdur; tıpkı Next.js'in React üzerine inşa edilmiş bir çerçeve olması gibi.

Expo'nun üç ana bileşeni vardır:

1. **Expo CLI**
2. **Expo Go Uygulaması**
3. **Çeşitli mobil cihaz yeteneklerine erişim sağlayan bir dizi kütüphane.**

Expo CLI, geliştirme sürecini basitleştiren güçlü bir araçtır. Muhtemelen, sadece bir geliştirme sunucusu oluşturduğunuzda veya başlattığınızda etkileşimde bulunmanız gerekecektir. Sadece çalışır.

[Expo Go Uygulaması](https://expo.dev/client), _çoğu_ uygulamanın bir emülatör veya fiziksel cihaz kullanmadan geliştirilebilmesini sağlayan harika bir teknolojidir. Uygulamayı indiriyorsunuz, derleme çıktısından QR kodunu tarıyorsunuz ve sonra telefonunuzda çalışan bir geliştirici ortamına sahip oluyorsunuz. Ancak, bu Solana Mobil SDK ile çalışmaz. 

:::warning
Geleneksel Expo Go geliştirme akışı sadece belirli seçilmiş modüllerle sınırlıdır ve Solana Mobil SDK'larının ihtiyaç duyduğu daha fazla özelleştirilmiş yerel kodu desteklememektedir. Bunun yerine, Expo ile tamamen uyumlu hale getirmek için özel bir geliştirme yapmamız gerekecek.
:::

Son olarak, en önemlisi, Expo cihazın yerleşik çevresel durumlarına, kamera, pil ve hoparlör gibi, erişim sağlayan [kapsamlı kütüphaneler](https://docs.expo.dev/versions/latest/) sunarak inanılmaz bir iş çıkarıyor. Kütüphaneler sezgisel ve belgeler fenomenal.

#### Expo uygulaması nasıl oluşturulur

Expo'yu kullanmaya başlamak için, öncelikle [Solana Mobil'e Giriş](https://docs.solanamobile.com/react-native/expo) bölümündeki Kurulum talimatlarını izleyin. Daha sonra bir
[Expo Uygulama Hizmetleri (EAS) hesabı](https://expo.dev/eas) oluşturmalısınız.

EAS hesabınız olduktan sonra, EAS CLI'yi kurabilir ve giriş yapabilirsiniz:

```bash
npm install -g eas-cli
eas login
```

Son olarak, `create-expo-app` komutunu kullanarak yeni bir Expo uygulaması oluşturabilirsiniz:

```bash
npx create-expo-app
```

#### Expo uygulaması nasıl oluşturulur ve çalıştırılır

Bazı uygulamalar için Expo, Expo Go Uygulaması ile gerçekten kolay bir şekilde inşa edilir. Expo Go Uygulaması projeyi uzaktan bir sunucuda oluşturur ve belirttiğiniz emülatöre veya cihaza dağıtır.

Ne yazık ki, bu Solana Mobil uygulamaları ile çalışmaz. Bunun yerine, yerel olarak inşa etmeniz gerekecek. Bunu yapmak için, proje dağıtımının "içeride" olduğuna dair bir ek yapılandırma dosyası, `eas.json`, gerekecektir. Bu dosyanın içine şunları koymalısınız:

```json
{
  "cli": {
    "version": ">= 5.12.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

EAS yapılandırma dosyanız hazır olduğunda, `eas build` komutunu kullanarak projenizi oluşturabilirsiniz. Bu, APK'nızın Expo'nun bulut altyapısını kullanarak oluşturulacağı EAS Build hizmetine bir iş gönderir. Yerel olarak oluşturmak istiyorsanız, `--local` bayrağını ekleyebilirsiniz. Örneğin, aşağıdaki komut, projeyi yerel olarak Android için özel bir geliştirme profili ile oluşturur:

```bash
eas build --profile development --platform android --message "Android'de Geliştirme!" --local
```

Ardından, çıktıyı APK'yı cihazınıza veya emülatörünüze yüklemeniz gerekir. Emülatör kullanıyorsanız, APK dosyasını emülatör penceresine sürüklemek kadar basit. Fiziksel bir cihaza sahipseniz, Android Debug Bridge (ADB) kullanmalısınız:

```bash
adb install your-apk-file.apk
```

Yüklenen APK, uygulamanızı çalıştırmayı kolaylaştıran Expo'dan bir iskelet uygulamadır. Uygulamanızı içinde yüklemek için geliştirme sunucusunu başlatmanız gerekir:

```bash
npx expo start --dev-client --android
```

#### Expo SDK paketlerini uygulamanıza nasıl eklenir

Expo SDK, React Native geliştirmesi ile ilgili her türlü şeyi basitleştirmek için paketler içerir; UI elemanlarından cihaz çevresel durumlarını kullanmaya kadar. Tüm paketleri [Expo SDK belgelerinde](https://docs.expo.dev/versions/latest/) görebilirsiniz.

Örneğin, uygulamanıza
[pedometre işlevselliği](https://docs.expo.dev/versions/latest/sdk/pedometer/) eklemek için `expo-sensors` paketini kurarsınız:

```bash
npx expo install expo-sensors
```

Ardından, normalde JS/TS kullanırken beklediğiniz gibi kodunuza import edebilirsiniz.

```tsx
import { Pedometer } from "expo-sensors";
```

Pakete bağlı olarak, ek kurulum gerekebilir. Örneğin, `expo-camera` paketini kullanıyorsanız, paketi yüklemenin yanı sıra, Android için `app.json` veya `AndroidManifest.xml` dosyanızda uygun izinleri yapılandırmanız ve kameraya erişim için çalışma zamanı izinlerini istemeniz gerekir. Yeni bir paketle çalışırken [Expo belgelerini](https://docs.expo.dev/versions/latest/) okumayı unutmayın.

### Ekosistem kütüphanelerini Expo uygulamanıza entegre etme

Tüm React ve Node kütüphaneleri, kutudan çıkar çıkmaz React Native ile çalışmaz. Ya React Native ile çalışmak üzere özel olarak oluşturulmuş kütüphaneleri bulmanız gerekir ya da kendiniz bir geçici çözüm oluşturmalısınız.

Özellikle Solana ile çalışırken, ekosistem kütüphanelerinin büyük çoğunluğu kutudan çıkar çıkmaz React Native'i desteklemiyor. Neyse ki, bunları React Native ortamında çalışacak şekilde uyumlu hale getirmek için tek yapmamız gereken, Expo'yu doğru [polyfill'lerle](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill) yapılandırmaktır.

Polyfill'ler, Node.js çalışmayan ortamlar için yerini alacak çekirdek kütüphanelerdir. Expo, Node.js çalıştırmaz. Ne yazık ki, belirli bir uygulama için hangi polyfill'lere ihtiyacınız olduğunu bilmek zor olabilir. Önceden bilmiyorsanız, polyfill'leri hata ayıklamak, derleyici hatalarını incelemeyi ve stack overflow'da arama yapmayı içerebilir. Eğer inşa edilmiyorsa, genellikle bir polyfill sorunudur.

Neyse ki, yalnızca bazı standart Solana kütüphanelerinin değil, aynı zamanda Metaplex için de ihtiyaç duyacağınız polyfill'lerin bir listesini derledik.

#### Solana Polyfill'leri

Solana + Expo uygulaması için aşağıdakilere ihtiyacınız olacak:

- `@solana-mobile/mobile-wallet-adapter-protocol`: MWA uyumlu cüzdanlarla etkileşimi sağlayan bir React Native/Javascript API'si.
- `@solana-mobile/mobile-wallet-adapter-protocol-web3js`: [@solana/web3.js](https://github.com/solana-labs/solana-web3.js) gibi ortak yapı taşlarını kullanmak için bir kolaylık sarmalayıcı – `Transaction` ve `Uint8Array`.
- `@solana/web3.js`: Solana ağı ile etkileşim kurmak için Solana Web Kütüphanesi `JSON RPC API'si` üzerinden.
- `expo-crypto`: React Native'de web3.js'nin temel Crypto kütüphanesi için güvenli rastgele sayı üreteci polyfill'idir. Bu özellik yalnızca Expo SDK sürüm 49+ ile desteklenmektedir ve Expo Router gerektirir. Kurulumunuzun bu gereksinimlere göre güncellenmiş olduğundan emin olun.
- `buffer`: React Native'de `web3.js` için gerekli olan Buffer polyfill'i.

#### Metaplex Polyfill'leri

Eğer Metaplex SDK'sını kullanmak istiyorsanız, Metaplex kütüphanesini eklemeniz ve birkaç ek polyfill eklemeniz gerekecek:

- `@metaplex-foundation/umi` `@metaplex-foundation/umi-bundle-defaults` `@metaplex-foundation/mpl-core` - Metaplex Kütüphanesi
- Ek polyfill'ler
  - `assert`
  - `crypto-browserify`
  - `readable-stream`
  - `zlib`
  - `react-native-url-polyfill` Yukarıdaki polyfill'lerin yerini almak üzere tasarlanan kütüphanelerin çoğu, Metaplex kütüphaneleri tarafından arkaday kullanılır. Dolayısıyla, bunların hiçbiri doğrudan kodunuza dahil olunmayacak. Bu nedenle, polyfill'leri kullanmak için `metro.config.js` dosyası oluşturmanız gerekecek. Bu, Metaplex'in polyfill'leri kullanmasını sağlayacaktır; desteklenmeyen Node.js kütüphaneleri yerine. Aşağıda bir örnek `metro.config.js` dosyası bulunmaktadır:

```js
// Daha fazla bilgi edinin https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Polyfill çözücüleri ekleyin
config.resolver.extraNodeModules.crypto = require.resolve("expo-crypto");

module.exports = config;
```

### Hepsini Bir Araya Getirmek

Çoğu yeni araç veya çerçeve ile olduğu gibi, ilk kurulum zor olabilir. İyi haber, uygulamanız derlenip çalışmaya başladıktan sonra, web ve mobil uygulamalar için yazdığınız kodda çok az farklılık olmasıdır ve React Native ile Expo uygulamaları arasında karşılaştırma yaptığınızda neredeyse hiç fark yoktur.

## Laboratuvar

Bu dersi birlikte Mint-A-Day uygulamasını oluşturarak pratiğe dökelim; kullanıcıların günlük yaşamlarının tek bir NFT anlık görüntüsünü oluşturmasına olanak tanır, böylece kalıcı bir günlük yaratırlar.

NFT'leri mintlemek için Metaplex'in Umi kütüphanelerini ve resimleri ve metadata depolamak için [Pinata Cloud](https://pinata.cloud/) kullanacağız. Bu eğitimde Pinata kullanıyoruz, ancak
[uzun vadeli görüntü depolamak için birçok iyi çözüm vardır](https://solana.com/developers/guides/getstarted/how-to-create-a-token#create-and-upload-image-and-offchain-metadata).
Tüm onchain çalışmamız Devnet üzerinde olacak.

Bu laboratuvarın ilk yarısı Expo, Solana ve Metaplex'in birlikte çalışmasını sağlamak için gerekli bileşenleri bir araya getirmektir. Bunu modüler bir şekilde yapacağız, böylece hangi kısımların hangi bölümle ilişkili olduğunu bileceksiniz.

### 1. Yerel bir Expo uygulaması oluşturma, inşa etme ve çalıştırma

Bu ilk bölüm, bir emülatörde bir TypeScript Expo uygulaması çalıştıracaktır. Eğer zaten bir React Native geliştirme ortamınız varsa, 0. adımı atlayabilirsiniz.

#### 0. React Native geliştirme ortamını kurma

Makinenizde React Native'in yüklü olması ve çalışan bir emülatör veya fiziksel cihaza ihtiyacınız olacak.
[Bunu React Native hızlı başlangıcı ile yapabilirsiniz](https://reactnative.dev/docs/environment-setup?guide=native).
Bu kurulum hakkında daha fazla ayrıntıya da [Solana Mobil'e Giriş dersinde](https://docs.solanamobile.com/react-native/expo) ulaşabilirsiniz.

:::note
Expo kullanıyor olsak da, başlangıç için React Native CLI rehberini takip etmeniz gerekecektir.
:::

:::note
Eğer bir emülatör çalıştırıyorsanız, emüle edilecek daha yeni bir telefon sürümü kullanmanız ve çalışması için birkaç GB RAM sağlamanız şiddetle tavsiye edilir. Bizim tarafımızda 5 GB RAM kullanıyoruz.
:::

#### 1. Expo EAS CLI için kaydolma

Expo sürecini basitleştirmek için bir Expo Uygulama Hizmetleri (EAS) hesabına ihtiyacınız olacak. Bu, uygulamayı inşa etmenize ve çalıştırmanıza yardımcı olacaktır.

Öncelikle bir [EAS hesabı](https://expo.dev/eas) oluşturun.

Sonra, EAS CLI'yi yükleyin ve giriş yapın:

```bash
npm install -g eas-cli
eas login
```

#### 2. Uygulama iskeletini oluşturma

Aşağıdaki komutla uygulamamızı oluşturalım:

```bash
npx create-expo-app --template blank-typescript solana-expo
cd solana-expo
npx expo install expo-dev-client # Bu, özel geliştirme yapılarını oluşturmak için kullanılacak bir kütüphaneyi yükler ve hata ayıklama ve test için yararlı araçlar sağlar. Opsiyonel olmakla birlikte, daha akıcı bir geliştirme deneyimi için önerilir.
```

Bu, `blank-typescript` şablonuna dayalı yeni bir iskelet oluşturmak için `create-expo-app` kullanır. TypeScript etkinleştirilmiş bir Boş şablon.

#### 3. Yerel inşa yapılandırması

Expo, uzaktan bir sunucuda oluşturmayı varsayılan olarak ayarlasa da, Solana Mobil'in doğru çalışabilmesi için yerel olarak oluşturmalıyız. Derleyiciye ne yaptığımızı bildiren yeni bir yapılandırma dosyası eklememiz gerekecek. Dizininizin kökünde `eas.json` adında bir dosya oluşturun.

```bash
touch eas.json
```

Yeni oluşturulan `eas.json` dosyasının içine aşağıdaki içerikleri kopyalayın ve yapıştırın:

```json
{
  "cli": {
    "version": ">= 3.12.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

#### 4. Oluşturma ve emüle etme

Şimdi projeyi yerel olarak oluşturalım. Her cevabınızda `y` seçeneğini seçeceksiniz. Bu işlemin tamamlanması biraz zaman alabilir.

```bash
npx eas build --profile development --platform android --local
```

Komut tamamlandığında, dizininizin kökünde bir çıktı dosyası alacaksınız. Bu dosyanın adı `build-XXXXXXXXXXX.apk` biçiminde olacaktır. Dosya gezgininde bu dosyayı bulun ve **_sürükleyin_** emülatörünüze. Emülatör, yeni APK'nın yüklendiğini gösteren bir mesaj görüntülemelidir. Yükleme tamamlandığında, emülatörde bir uygulama simgesi olarak APK'yı görmelisiniz.

Yüklenen uygulama, Expo'dan sadece bir iskelet uygulamadır. Geliştirme sunucusunu çalıştırmak için aşağıdaki komutu çalıştırmalısınız:

```bash
npx expo start --dev-client --android
```

:::note
Her yeni bağımlılık eklediğinizde, uygulamayı tekrar oluşturup yeniden yüklemeniz gerekecek. Görsel veya mantık tabanlı her şey sıcak yeniden yükleyici tarafından yakalanmalıdır.
:::

### 2. Expo uygulamanızı Solana ile çalışacak şekilde yapılandırma

Artık bir Expo uygulamamız çalıştığına göre, emülatörde kullanabileceğimiz bir cüzdan da dahil olmak üzere Solana bağımlılıklarımızı eklememiz gerekiyor. Eğer Devnet destekli bir cüzdanınız yoksa, 0. adımı atlayabilirsiniz.

#### 0. Devnet destekli bir Solana cüzdanı yükleme

Test etmek için Devnet'i destekleyen bir cüzdan gerekecek. Bizim `Mobil Cüzdan Adaptörü dersinde` bu cüzdanlardan birini oluşturmuştuk. Bunu uygulamamızdan farklı bir dizinde repodan yükleyelim:

```bash
cd ..
git clone https://github.com/solana-developers/react-native-fake-solana-wallet
cd react-native-fake-solana-wallet
yarn
```

Cüzdan, emülatörünüzde veya cihazınızda yüklenmiş olmalıdır. Yeni yüklenen cüzdanı açmayı ve kendinize biraz SOL airdrop yapmayı unutmayın.

Cüzdan dizinine geri dönmeyi unutmayın çünkü laboratuvar boyunca orada çalışacağız.

```bash
cd ..
cd solana-expo
```

#### 1. Solana bağımlılıklarını yükleme

Tüm Solana mobil uygulamalarında muhtemelen ihtiyaç duyulacak temel Solana bağımlılıklarını yükleyeceğiz. Bu, React Native ile uyumsuz olan paketlerin çalışmasına izin veren bazı polyfill'leri içerecektir:

```bash
yarn add \
  @solana/web3.js \
  @solana-mobile/mobile-wallet-adapter-protocol-web3js \
  @solana-mobile/mobile-wallet-adapter-protocol \
  expo-crypto \
  buffer
```

#### 3. Solana iskelet sağlayıcılarını ekleme

Şimdi, sizi çoğu Solana tabanlı uygulamalara yönlendirecek bir Solana iskeleti ekleyelim. 

`components` ve `screens` adında iki yeni klasör oluşturalım.

Solana Mobil dersinin [ilk dersinden](https://docs.solanamobile.com/react-native/expo) bazı başlangıç kodlarını kullanacağız. `components/AuthorizationProvider.tsx` ve `components/ConnectionProvider.tsx` dosyalarını kopyalayacağız. Bu dosyalar bize bir `Connection` nesnesi ve dapp'imizi yetkilendiren bazı yardımcı işlevler sağlar.

`components/AuthorizationProvider.tsx` dosyasını oluşturun ve [Github'daki mevcut Auth Provider'ımızın](https://raw.githubusercontent.com/solana-developers/mobile-apps-with-expo/main/components/AuthProvider.tsx) içeriğini yeni dosyaya kopyalayın.

İkinci olarak, `components/ConnectionProvider.tsx` adında bir dosya oluşturun ve [Github'daki mevcut Connection Provider'ımızın](https://raw.githubusercontent.com/solana-developers/mobile-apps-with-expo/main/components/ConnectionProvider.tsx) içeriğini yeni dosyaya kopyalayın.

Şimdi `screens/MainScreen.tsx` dosyasını ana ekranımız için bir iskelet oluşturacak şekilde oluşturalım:

```tsx
import { View, Text } from "react-native";
import React from "react";

export function MainScreen() {
  return (
    <View>
      <Text>Solana Expo Uygulaması</Text>
    </View>
  );
}
```

Son olarak, Solana bağımlılıklarıyla çalışabilmesi için React Native ile tüm bileşenlerin çalışabilmesi adına `polyfills.ts` dosyasını oluşturalım.

```typescript filename="polyfills.ts"
import { getRandomValues as expoCryptoGetRandomValues } from "expo-crypto";
import { Buffer } from "buffer";

// Global Buffer'ı ayarla
global.Buffer = Buffer;

// getRandomValues yöntemi ile Crypto sınıfını tanımla
class Crypto {
  getRandomValues = expoCryptoGetRandomValues;
}

// Global alanda crypto zaten tanımlı mı kontrol et
const hasInbuiltWebCrypto = typeof window.crypto !== "undefined";

// Mevcut crypto varsa kullan, aksi takdirde yeni bir Crypto örneği oluştur
const webCrypto = hasInbuiltWebCrypto ? window.crypto : new Crypto();

// Eğer crypto zaten tanımlı değilse, crypto nesnesini polyfill et
if (!hasInbuiltWebCrypto) {
  Object.defineProperty(window, "crypto", {
    configurable: true,
    enumerable: true,
    get: () => webCrypto,
  });
}
```

Son olarak, `App.tsx` dosyasını uygulamamızı oluşturduğumuz iki sağlayıcı ile sarmak için değiştirin:

```tsx
import { ConnectionProvider } from "./components/ConnectionProvider";
import { AuthorizationProvider } from "./components/AuthorizationProvider";
import { clusterApiUrl } from "@solana/web3.js";
import { MainScreen } from "./screens/MainScreen";
import "./polyfills";

export default function App() {
  const cluster = "devnet";
  const endpoint = clusterApiUrl(cluster);

  return (
    <ConnectionProvider
      endpoint={endpoint}
      cluster={cluster}
      config={{ commitment: "processed" }}
    >
      <AuthorizationProvider cluster={cluster}>
        <MainScreen />
      </AuthorizationProvider>
    </ConnectionProvider>
  );
}
```

:::note
Polyfill dosyası `polyfills.ts` eklendiğini unutmayın. Bu, Solana bağımlılıklarının doğru çalışması için gereklidir.
:::

#### 4. Solana başlangıç şablonunu oluştur ve çalıştır

`package.json` dosyanıza aşağıdaki kullanışlı çalışma betiklerini ekleyin.

```json
  "scripts": {
    "start": "expo start --dev-client",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build": "npx eas build --profile development --platform android",
    "build:local": "npx eas build --profile development --platform android --local",
    "test": "echo \"No tests specified\" && exit 0",
    "clean": "rm -rf node_modules && yarn"
  }
```

Her şeyin düzgün çalıştığından ve derlendiğinden emin olalım. Expo'da, bağımlılıkları değiştirdiğinizde, uygulamayı yeniden derlemeniz ve yeniden yüklemeniz gerekecek.

**_İsteğe Bağlı:_** Olası yapı sürüm çakışmalarını önlemek için, yeni dosyayı sürükleyip bırakmadan önce eski sürümü _kaldırmak_ isteyebilirsiniz.

Yerel olarak derleyin:

```bash
yarn run build:local
```

Kurulum: **_Çek_** çıkan yapıyı emülatörünüze sürükleyin.

Çalıştırın:

```bash
yarn run android
```

Her şey derlenmelidir ve bir başlangıç şablonu Solana Expo uygulamanız olmalıdır.

---

### 3. Expo uygulamanızı Metaplex ile çalışacak şekilde yapılandırın

Metaplex, NFT API ihtiyaçlarınız için tek durak noktanızdır. Ancak, biraz daha kurulum gerektirmektedir. İyi haber şu ki, gelecekte uygulamalarınızda NFT'leri almak, mintlemek veya düzenlemek isterseniz, burada referans alabileceğiniz başka bir şablonunuz olacak.

#### 1. Metaplex bağımlılıklarını yükleyin

[Metaplex programları ve araçları](https://developers.metaplex.com/programs-and-tools), NFT'lerle çalışmanın pek çok ayrıntısını soyutlar, ancak esasen Node.js için yazılmıştır, bu yüzden çalışmasını sağlamak için birkaç polyfill daha eklememiz gerekecek:

```bash
yarn add assert \
  util \
  crypto-browserify \
  stream-browserify \
  readable-stream \
  browserify-zlib \
  path-browserify \
  react-native-url-polyfill \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @metaplex-foundation/umi-signer-wallet-adapters \
  @metaplex-foundation/umi-web3js-adapters \
  @metaplex-foundation/mpl-token-metadata \
  @metaplex-foundation/mpl-candy-machine
```

#### 2. Polyfill yapılandırması

Yukarıdaki polyfill'lerin hiçbiri kodumuza doğrudan eklenmeyecek, bu yüzden Metaplex'in bunları kullanabilmesi için bir `metro.config.js` dosyası eklememiz gerekiyor:

```bash
touch metro.config.js
```

Aşağıdakileri `metro.config.js` dosyasına kopyalayın ve yapıştırın:

```javascript
// Daha fazla bilgi için https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Polyfill çözücülerini ekleyin
config.resolver.extraNodeModules.crypto = require.resolve("expo-crypto");

module.exports = config;
```

#### 3. Metaplex sağlayıcısı

NFT'leri [Metaplex'in MPL Token Metadata kütüphanesini](https://developers.metaplex.com/token-metadata) kullanarak oluşturacağız, bu `Umi` nesnesini kullanarak, birçok Metaplex uygulamasında yaygın olarak kullanılan bir araçtır. Bu kombinasyon, NFT oluşturma için gerekli olan `fetch` ve `create` gibi temel işlevlere erişim sağlar. Bunu kurmak için `/components/UmiProvider.tsx` adında yeni bir dosya oluşturacağız ve mobil cüzdan adaptörümüzü `Umi` nesnesine bağlayacağız. Bu, bizim adımıza token meta verileri ile etkileşimde bulunmak gibi ayrıcalıklı eylemleri gerçekleştirmemizi sağlar.

```tsx
import { createContext, ReactNode, useContext } from "react";
import type { Umi } from "@metaplex-foundation/umi";
import {
  createNoopSigner,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { useAuthorization } from "./AuthorizationProvider";

type UmiContext = {
  umi: Umi | null;
};

const DEFAULT_CONTEXT: UmiContext = {
  umi: null,
};

export const UmiContext = createContext<UmiContext>(DEFAULT_CONTEXT);

export const UmiProvider = ({
  endpoint,
  children,
}: {
  endpoint: string;
  children: ReactNode;
}) => {
  const { selectedAccount } = useAuthorization();
  const umi = createUmi(endpoint)
    .use(mplTokenMetadata())
    .use(mplCandyMachine());
  if (selectedAccount === null) {
    const noopSigner = createNoopSigner(
      publicKey("11111111111111111111111111111111"),
    );
    umi.use(signerIdentity(noopSigner));
  } else {
    umi.use(walletAdapterIdentity(selectedAccount));
  }

  return <UmiContext.Provider value={{ umi }}>{children}</UmiContext.Provider>;
};

export function useUmi(): Umi {
  const umi = useContext(UmiContext).umi;
  if (!umi) {
    throw new Error(
      "Umi context was not initialized. " +
        "Did you forget to wrap your app with <UmiProvider />?",
    );
  }
  return umi;
}
```

#### 4. NFT Sağlayıcısı

Ayrıca, NFT durum yönetimini kolaylaştıran daha üst düzey bir NFT sağlayıcısı oluşturuyoruz. Bu, `ConnectionProvider`, `AuthorizationProvider` ve `UmiProvider`'ımızı birleştirir ve `Umi` nesnemizi oluşturmamıza olanak tanır. Bunu daha sonra tamamlayacağız; şimdilik, iyi bir başlangıç şablonu oluşturur.

Yeni dosyayı `components/NFTProvider.tsx` olarak oluşturalım:

```tsx
import "react-native-url-polyfill/auto";
import { useConnection } from "./ConnectionProvider";
import { Account, useAuthorization } from "./AuthorizationProvider";
import React, { ReactNode, createContext, useContext, useState } from "react";
import { useUmi } from "./UmiProvider";
import { Umi } from "@metaplex-foundation/umi";

export interface NFTProviderProps {
  children: ReactNode;
}

export interface NFTContextState {
  umi: Umi | null;
}

const DEFAULT_NFT_CONTEXT_STATE: NFTContextState = {
  umi: null,
};

const NFTContext = createContext<NFTContextState>(DEFAULT_NFT_CONTEXT_STATE);

export function NFTProvider(props: NFTProviderProps) {
  const { children } = props;

  const { connection } = useConnection();
  const { authorizeSession } = useAuthorization();
  const [account, setAccount] = useState<Account | null>(null);
  const { umi } = useUmi(connection, account, authorizeSession);

  const state: NFTContextState = {
    umi,
  };

  return <NFTContext.Provider value={state}>{children}</NFTContext.Provider>;
}

export const useNFT = (): NFTContextState => useContext(NFTContext);
```

Yukarıda `import "react-native-url-polyfill/auto";` ile yeni bir polyfill eklediğimizi unutmayın.

#### 5. Sağlayıcıyı Sarmalayın

Şimdi, yeni `NFTProvider'ımızı `App.tsx` içindeki `MainScreen` etrafında saralım:

```tsx
import "./polyfills";
import { ConnectionProvider } from "./components/ConnectionProvider";
import { AuthorizationProvider } from "./components/AuthorizationProvider";
import { clusterApiUrl } from "@solana/web3.js";
import { MainScreen } from "./screens/MainScreen";
import { NFTProvider } from "./components/NFTProvider";

export default function App() {
  const cluster = "devnet";
  const endpoint = clusterApiUrl(cluster);

  return (
    <ConnectionProvider
      endpoint={endpoint}
      cluster={cluster}
      config={{ commitment: "processed" }}
    >
      <AuthorizationProvider cluster={cluster}>
        <NFTProvider>
          <MainScreen />
        </NFTProvider>
      </AuthorizationProvider>
    </ConnectionProvider>
  );
}
```

#### 6. Derle ve çalıştır

Son olarak, her şeyin hala çalıştığından emin olmak için uygulamayı oluşturup yeniden yükleyelim.

Derleme:

```bash
npx eas build --profile development --platform android --local
```

Kurulum:

**_Çek_** çıkan yapıyı emülatörünüze sürükleyin.

Çalıştırın:

```bash
npx expo start --dev-client --android
```

---

### 4. Expo uygulamanızı fotoğrafları almak ve yüklemek için yapılandırın

Şu ana kadar yaptığımız her şey etkili bir şekilde başlangıç şablonudur. Mint-A-Day uygulamamız için sahip olmayı amaçladığımız işlevselliği eklememiz gerekiyor. Mint-A-Day bir günlük anlık görüntü uygulamasıdır. Kullanıcıların günlük yaşamlarının bir anlık görüntüsünü alma olanağı sağlar ve bunu bir NFT mintleme şeklinde temsil eder.

Uygulama, cihazın kamerasına erişime ve yakalanan görüntüleri uzaktan depolamak için bir yere ihtiyaç duyacaktır. Neyse ki, Expo SDK kamera erişimi sağlayabilir ve [Pinata Cloud](https://pinata.cloud/) NFT dosyalarınızı güvenli bir şekilde depolayabilir.

#### 1. Kamera kurulumu

Kullanacağımız Expo'ya özgü bağımlılığı ayarlayarak başlayalım: `expo-image-picker`. Bu, cihazın kamerasını kullanarak fotoğraflar çekmemize olanak tanır ve daha sonra bunları NFT'lere dönüştüreceğiz. Emülatörlerde kameramız olmadığından, bu paketi kamera yerine kullanıyoruz. Bu paket, emülatörde bizim için bir kamera simüle edecektir. Aşağıdaki komutla yükleyin:

```bash
npx expo install expo-image-picker
```

Kurulumun yanı sıra, `expo-image-picker` paketinin `app.json` dosyasına bir eklenti olarak eklenmesi gerekiyor:

```json
  "expo": {
    // ....
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Solana NFT'leri oluşturmak için resimleri kullanmanıza izin verir"
        }
      ]
    ],
    // ....
  }
```

Bu bağımlılık, kamerayı kullanmayı son derece kolay hale getirir. Kullanıcının bir fotoğraf çekmesine ve resmi döndürmesine olanak tanımak için aşağıdakini çağırmanız yeterlidir:

```tsx
// Resim Seçici ile fotoğraf çekmek için kamerayı başlat
const result = await ImagePicker.launchCameraAsync({
  // Medya türlerini yalnızca resimlerle sınırlayın (video yok)
  mediaTypes: ImagePicker.MediaTypeOptions.Images,

  // Kullanıcının görüntüyü çekim yaptıktan sonra düzenlemesine/kesmesine izin verin
  allowsEditing: true,

  // Kırpma çerçevesinin en boy oranını belirtin (1:1 kare için)
  aspect: [1, 1],

  // Görüntü kalitesini maksimum olarak ayarlayın (1.0 = en yüksek kalite, 0.0 = en düşük)
  quality: 1,
});

// 'result', yakalanan görüntü hakkında bilgi içerecektir
// Kullanıcı iptal ederse, result.cancelled true olacak, aksi takdirde görüntü URI'sini içerecektir
```

Bunu henüz hiçbir yere eklemeye gerek yok - bunu birkaç adımda yapacağız.

#### 2. Pinata Cloud kurulumu

Yapmamız gereken bir diğer şey ise [Pinata Cloud](https://pinata.cloud/) erişimimizi ayarlamaktır. Bir API anahtarına ihtiyacımız olacak ve bunu bir ortam değişkeni olarak eklememiz gerekecek, ardından yükleyebileceğimiz görüntülerimizi bir dosya türüne dönüştürmek için bir son bağımlılık daha eklememiz gerekiyor.

NFT'lerimizi IPFS ile barındırmak için Pinata Cloud'ı kullanacağız çünkü bunu çok ucuz bir fiyatla yapıyorlar. Bu API anahtarını özel tutmayı unutmayın.

En iyi uygulamalar, API anahtarlarını bir `.env` dosyasında saklamayı, `.env`nin `.gitignore` dosyanıza eklenmesini önerir. Ayrıca, projeye gereken ortam değişkenlerini gösteren bir `.env.example` dosyası oluşturmak ve bunu deponuza eklemek de iyi bir fikirdir.

Her iki dosyayı dizininizin köküne oluşturun ve `.env`yi `.gitignore` dosyanıza ekleyin.

Ardından, API anahtarınızı `.env` dosyasına `EXPO_PUBLIC_NFT_PINATA_JWT` değişken adı ile ekleyin. Bu, uygulama içinde API anahtarınıza güvenli bir şekilde `process.env.EXPO_PUBLIC_NFT_PINATA_JWT` kullanarak erişmenizi sağlar, geleneksel `import "dotenv/config"`'den farklıdır, bu da Expo ile çalışırken ek polyfill'ler gerektirebilir. Gizli bilgileri güvenli bir şekilde saklamak hakkında daha fazla bilgi için [Expo'nun ortam değişkenleri belgelerine](https://docs.expo.dev/build-reference/variables/#importing-secrets-from-a-dotenv-file) bakabilirsiniz.

---

#### 3. Son derleme

Her şeyin çalıştığından emin olmak için tekrar derleyin ve yeniden yükleyin. Laboratuvarımız için bunu yapmak zorunda olduğumuz son kez. Her şey sıcak yüklenebilir olmalıdır.

Derleme:

```bash
npx eas build --profile development --platform android --local
```

Kurulum:

**_Çek_** çıkan yapıyı emülatörünüze sürükleyin.

Çalıştırın:

```bash
npx expo start --dev-client --android
```

---

### 5. Expo uygulamanızı tamamlamak için işlevsellik ekleyin

Kurulumdan geçtik! Mint-A-Day uygulamamız için gerçek işlevselliği oluşturalım. Neyse ki, artık odaklanmamız gereken sadece iki dosya var:

- `NFTProvider.tsx` uygulama durumumuzu ve NFT verilerimizi büyük ölçüde yönetecek.
- `MainScreen.tsx` girişi alacak ve NFT'lerimizi gösterecek.

**_Ana Akış:_**
1. Kullanıcı `transact` işlevini kullanarak bağlanır (yetkilendirir) ve geri çağırma içinde `authorizeSession`'ı çağırır.
2. Kodumuz daha sonra `Umi` nesnesini kullanarak kullanıcının oluşturduğu tüm NFT'leri alır.
3. Eğer mevcut gün için bir NFT oluşturulmamışsa, kullanıcıya fotoğraf çekme, yükleme ve NFT olarak mintleme izni verilir.

#### 1. NFT Sağlayıcı

`NFTProvider.tsx` özel `NFTProviderContext` ile durumu kontrol edecektir. Aşağıdaki alanları içermelidir:

- `umi: Umi | null` - `fetch` ve `create` çağrıları için kullandığımız metaplex nesnesini tutar.
- `publicKey: PublicKey | null` - NFT yaratıcısının genel anahtarı
- `isLoading: boolean` - Yükleme durumunu yönetir
- `loadedNFTs: (DigitalAsset)[] | null` - Kullanıcının anlık NFT'lerinin bir dizisi
- `nftOfTheDay: (DigitalAsset) | null` - Bugün oluşturulan NFT'ye referans
- `connect: () => void` - Devnet etkin cüzdana bağlanmak için bir işlev
- `fetchNFTs: () => void` - Kullanıcının anlık NFT'lerini getiren bir işlev
- `createNFT: (name: string, description: string, fileUri: string) => void` - Yeni bir anlık NFT oluşturulmasına yönelik bir işlev

`DigitalAsset` tipi `@metaplex-foundation/mpl-token-metadata` içindendir ve meta veriler, zincir dışı meta veriler, koleksiyon verileri, eklentiler (Attributes dahil) ve daha fazlasını içerir.

```tsx
export interface NFTContextState {
  metaplex: Metaplex | null; // `fetch` ve `create` çağrıları için kullandığımız metaplex nesnesini tutar.
  publicKey: PublicKey | null; // Yetkilendirilmiş cüzdanın genel anahtarı
  isLoading: boolean; // Yükleme durumu
  loadedNFTs: DigitalAsset[] | null; // Meta veri içeren yüklenen NFT'lerin dizisi
  nftOfTheDay: DigitalAsset | null; // Bugün oluşturulan NFT anlık görüntüsü
  connect: () => void; // Devnet etkin cüzdana bağlanır (ve yetkilendirir)
  fetchNFTs: () => void; // `metaplex` nesnesini kullanarak NFT'leri getirir
  createNFT: (name: string, description: string, fileUri: string) => void; // NFT oluşturur
}
```

:::info
Durum akışı şudur: `connect`, `fetchNFTs`, ve ardından `createNFT`. Her bir kodu gözden geçireceğiz ve ardından dosyanın tamamını en son göstereceğiz:
:::

1. `connect` - Bu işlev uygulamayı bağlayacak ve yetkilendirecek, ardından elde edilen `publicKey`'yi duruma saklayacaktır.

   ```tsx
   const connect = () => {
     if (isLoading) return;

     setIsLoading(true);
     transact(async wallet => {
       const auth = await authorizeSession(wallet);
       setAccount(auth);
     }).finally(() => {
       setIsLoading(false);
     });
   };
   ```

2. `fetchNFTs` - Bu işlev `fetchAllDigitalAssetByCreator` kullanarak NFT'leri getirecektir:

```tsx
const fetchNFTs = useCallback(async () => {
  if (!umi || !account || isLoading) return;
  setIsLoading(true);
  try {
    const creatorPublicKey = fromWeb3JsPublicKey(account.publicKey);
    const nfts = await fetchAllDigitalAssetByCreator(umi, creatorPublicKey);
    setLoadedNFTs(nfts);
  } catch (error) {
    console.error("NFT'leri getirme başarısız oldu:", error);
  } finally {
    setIsLoading(false);
  }
}, [umi, account, isLoading]);
```

3. `createNFT` - Bu işlev bir dosyayı Pinata Cloud'a yükler ve ardından cüzdanınıza bir NFT oluşturmak ve basmak için `createNft` işlevini kullanır. Bu üç kısımdan oluşur: resmi yükleme, meta verileri yükleme ve ardından NFT'yi basma. Pinata Cloud'a yüklemek için, dosya yüklemeleri için API ile etkileşim sağlayan [HTTP API uç noktasını](https://docs.pinata.cloud/api-reference/endpoint/upload-a-file) kullanabilirsiniz.

   Resmi ve meta verileri ayrı ayrı yüklemek için iki yardımcı işlev oluşturacağız, ardından bunları tek bir `createNFT` işlevinde birleştireceğiz:

```tsx
const ipfsPrefix = `https://${process.env.EXPO_PUBLIC_NFT_PINATA_GATEWAY_URL}/ipfs/`;
async function uploadImageFromURI(fileUri: string) {
  try {
    const form = new FormData();
    const randomFileName = `image_${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;

    form.append("file", {
      uri: Platform.OS === "android" ? fileUri : fileUri.replace("file://", ""),
      type: "image/jpeg", // Gerekirse tipi ayarlayın
      name: randomFileName, // Gerekirse ismi ayarlayın
    });

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_NFT_PINATA_JWT}`,
        "Content-Type": "multipart/form-data",
      },
      body: form,
    };

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      options,
    );
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error("Yükleme başarısız oldu:", error);
  } finally {
    console.log("Yükleme işlemi tamamlandı.");
  }
}

async function uploadMetadataJson(
  name: string,
  description: string,
  imageCID: string,
) {
  const randomFileName = `metadata_${Date.now()}_${Math.floor(Math.random() * 10000)}.json`;
  const data = JSON.stringify({
    pinataContent: {
      name,
      description,
      imageCID,
    },
    pinataMetadata: {
      name: randomFileName,
    },
  });
  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_NFT_PINATA_JWT}`,
      },
      body: data,
    },
  );
  const responseBody = await response.json();

  return responseBody;
}

const uploadImage = useCallback(async (fileUri: string): Promise<string> => {
  const upload = await uploadImageFromURI(fileUri);
  return upload.IpfsHash;
}, []);

const uploadMetadata = useCallback(
  async (
    name: string,
    description: string,
    imageCID: string,
  ): Promise<string> => {
    const uploadResponse = await uploadMetadataJson(
      name,
      description,
      imageCID,
    );
    return uploadResponse.IpfsHash;
  },
  [],
);
```

Resim ve meta veriler yüklendikten sonra NFT'yi basmak, `@metaplex-foundation/mpl-token-metadata`'dan `createNft` çağrısını yapmak kadar basittir. Aşağıda her şeyi bir araya getiren `createNFT` işlevi gösterilmektedir:

```tsx
const createNFT = useCallback(
  async (name: string, description: string, fileUri: string) => {
    if (!umi || !account || isLoading) return;
    setIsLoading(true);
    try {
      console.log(`NFT oluşturuluyor...`);
      const imageCID = await uploadImage(fileUri);
      const metadataCID = await uploadMetadata(name, description, imageCID);
      const mint = generateSigner(umi);
      const transaction = createNft(umi, {
        mint,
        name,
        uri: ipfsPrefix + metadataCID,
        sellerFeeBasisPoints: percentAmount(0),
      });
      await transaction.sendAndConfirm(umi);
      const createdNft = await fetchDigitalAsset(umi, mint.publicKey);
      setNftOfTheDay(createdNft);
    } catch (error) {
      console.error("NFT oluşturma başarısız oldu:", error);
    } finally {
      setIsLoading(false);
    }
  },
  [umi, account, isLoading, uploadImage, uploadMetadata],
);
```

Tüm yukarıdakileri `NFTProvider.tsx` dosyasına koyacağız. Tüm bunlar aşağıdaki gibi görünüyor:

```tsx
import "react-native-url-polyfill/auto";
import {
  DigitalAsset,
  createNft,
  fetchAllDigitalAssetByCreator,
  fetchDigitalAsset,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  PublicKey,
  Umi,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import { fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import { clusterApiUrl, PublicKey as solanaPublicKey } from "@solana/web3.js";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUmi } from "./UmiProvider";
import { useMobileWallet } from "../utils/useMobileWallet";
import { Account, useAuthorization } from "./AuthorizationProvider";
import { Platform } from "react-native";

export interface NFTProviderProps {
  children: ReactNode;
}


export interface NFTContextState {  umi: Umi | null; // `fetch` ve `create` çağrıları için kullandığımız Umi nesnesini tutar.
  publicKey: PublicKey | null; // Yetkilendirilmiş cüzdanın genel anahtarı
  isLoading: boolean; // Yükleme durumu
  loadedNFTs: DigitalAsset[] | null; // Meta veri içeren yüklenen NFT dizisi
  nftOfTheDay: DigitalAsset | null; // Bugün oluşturulan NFT anlık görüntüsü
  connect: () => void; // Devnet etkin cüzdana bağlanır (ve yetkilendirir)
  fetchNFTs: () => void; // `metaplex` nesnesini kullanarak NFT'leri getirir
  createNFT: (name: string, description: string, fileUri: string) => void; // NFT oluşturur
}

export function formatDate(date: Date) {
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
}

const NFTContext = createContext<NFTContextState | null>(null);

export function NFTProvider(props: NFTProviderProps) {
  const ipfsPrefix = `https://${process.env.EXPO_PUBLIC_NFT_PINATA_GATEWAY_URL}/ipfs/`;
  const [account, setAccount] = useState<Account | null>(null);
  const [nftOfTheDay, setNftOfTheDay] = useState<DigitalAsset | null>(null);
  const [loadedNFTs, setLoadedNFTs] = useState<DigitalAsset[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const umi = useUmi();
  const { children } = props;
  const connect = () => {
    if (isLoading) return;

    setIsLoading(true);
    transact(async wallet => {
      const auth = await authorizeSession(wallet);
      setAccount(auth);
    }).finally(() => {
      setIsLoading(false);
    });
  };
  async function uploadImageFromURI(fileUri: string) {
    try {
      const form = new FormData();
      const randomFileName = `image_${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;

      // React Native'de, özellikle form verileri ve dosyalarla çalışırken, dosyaları, özellikle Android ve iOS platformlarında bir URI (dosya yolu) içeren bir nesne kullanarak göndermeniz gerekebilir. Ancak bu yapı TypeScript'in katı tür kontrolü tarafından tanınmayabilir
      // @ts-ignore
      form.append("file", {
        uri:
          Platform.OS === "android" ? fileUri : fileUri.replace("file://", ""),
        type: "image/jpeg", // Gerekirse tipi ayarlayın
        name: randomFileName, // Gerekirse ismi ayarlayın
      });

      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_NFT_PINATA_JWT}`,
          "Content-Type": "multipart/form-data",
        },
        body: form,
      };

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        options,
      );
      const responseJson = await response.json();
      console.log(responseJson.IpfsHash);

      return responseJson;
    } catch (error) {
      console.error("Yükleme başarısız oldu:", error);
    } finally {
      console.log("Yükleme işlemi tamamlandı.");
    }
  }

  async function uploadMetadataJson(
    name = "Solanify",
    description = "Gününüzün gerçekten tatlı bir NFT'si.",
    imageCID = "bafkreih5aznjvttude6c3wbvqeebb6rlx5wkbzyppv7garjiubll2ceym4",
  ) {
    const randomFileName = `metadata_${Date.now()}_${Math.floor(Math.random() * 10000)}.json`;
    const data = JSON.stringify({
      pinataContent: {
        name,
        description,
        imageCID,
      },
      pinataMetadata: {
        name: randomFileName,
      },
    });
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_NFT_PINATA_JWT}`,
        },
        body: data,
      },
    );
    const responseBody = await response.json();

    return responseBody;
  }

  const fetchNFTs = useCallback(async () => {
    if (!umi || !account || isLoading) return;
    setIsLoading(true);
    try {
      const creatorPublicKey = fromWeb3JsPublicKey(account.publicKey);
      const nfts = await fetchAllDigitalAssetByCreator(umi, creatorPublicKey);
      setLoadedNFTs(nfts);
    } catch (error) {
      console.error("NFT'leri getirme başarısız oldu:", error);
    } finally {
      setIsLoading(false);
    }
  }, [umi, account, isLoading]);

  const uploadImage = useCallback(async (fileUri: string): Promise<string> => {
    const upload = await uploadImageFromURI(fileUri);
    return upload.IpfsHash;
  }, []);

  const uploadMetadata = useCallback(
    async (
      name: string,
      description: string,
      imageCID: string,
    ): Promise<string> => {
      const uploadResponse = await uploadMetadataJson(
        name,
        description,
        imageCID,
      );
      return uploadResponse.IpfsHash;
    },
    [],
  );

  const createNFT = useCallback(
    async (name: string, description: string, fileUri: string) => {
      if (!umi || !account || isLoading) return;
      setIsLoading(true);
      try {
        console.log(`NFT oluşturuluyor...`);
        const imageCID = await uploadImage(fileUri);
        const metadataCID = await uploadMetadata(name, description, imageCID);
        const mint = generateSigner(umi);
        const transaction = createNft(umi, {
          mint,
          name,
          uri: ipfsPrefix + metadataCID,
          sellerFeeBasisPoints: percentAmount(0),
        });
        await transaction.sendAndConfirm(umi);
        const createdNft = await fetchDigitalAsset(umi, mint.publicKey);
        setNftOfTheDay(createdNft);
      } catch (error) {
        console.error("NFT oluşturma başarısız oldu:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [umi, account, isLoading, uploadImage, uploadMetadata],
  );

  const publicKey = useMemo(
    () =>
      account?.publicKey
        ? fromWeb3JsPublicKey(account.publicKey as solanaPublicKey)
        : null,
    [account],
  );

  const state: NFTContextState = {
    isLoading,
    publicKey,
    umi,
    nftOfTheDay,
    loadedNFTs,
    connect,
    fetchNFTs,
    createNFT,
  };

  return <NFTContext.Provider value={state}>{children}</NFTContext.Provider>;
}

export const useNFT = (): NFTContextState => {
  const context = useContext(NFTContext);
  if (!context) {
    throw new Error("useNFT NFTProvider içinde kullanılmalıdır");
  }
  return context;
};

#### 2. Ana Ekran

Ana ekranımız üç bölümden oluşacaktır: **Günün resmi**, **işlem butonumuz** ve **önceki anlık görüntülerin döngüsü**.

**Günün resmi** uygulamanın üst yarısında görüntülenir, işlem butonu hemen altında ve döngü de onun altında yer alır.

**İşlem butonu**, `NFTProvider` durumunu takip eder: önce `connect`, ardından `fetchNFTs` ve nihayetinde `mintNFT`. Bunlardan yalnızca `mintNFT` için biraz ekstra çalışma yapmamız gerekiyor.

:::info
`mintNFT` fonksiyonu, kamerayı açmak için Expo kütüphanesini kullanır ve `ImagePicker.launchCameraAsync` ile çalışır.
:::

Bir görüntü alındığında, yerel yolu döner. Yapmamız gereken son şey, görüntünün ne zaman alındığını belirtmektir. Ardından NFT'nin adını `MM.DD.YY` formatında tarih yapacağız ve unix zaman damgasını açıklama olarak saklayacağız. Son olarak, görüntü yolunu, adını ve açıklamasını `createNFT` fonksiyonumuza `NFTProvider` üzerinden geçirerek NFT'yi oluşturacağız.

> **Not:** Bu aşamada, ekstra dikkat ve detay gerekmektedir. 
> — Geliştirici Notu

```tsx
const mintNFT = async () => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    setCurrentImage({
      uri: result.assets[0].uri,
      date: todaysDate,
    });

    createNFT(
      formatDate(todaysDate),
      `${todaysDate.getTime()}`,
      result.assets[0].uri,
    );
  }
};
```

**`MainScreen.tsx` için tam kod aşağıdaki gibidir:**

```tsx
import {
  View,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import React, { useEffect } from "react";
import { formatDate, useNFT } from "../components/NFTProvider";
import * as ImagePicker from "expo-image-picker";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292524",
  },
  titleText: {
    color: "white",
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingTop: 30,
  },
  imageOfDay: {
    width: "80%",
    height: "80%",
    resizeMode: "cover",
    margin: 10,
  },
  bottomSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carousel: {
    justifyContent: "center",
    alignItems: "center",
  },
  carouselText: {
    textAlign: "center",
    color: "white",
  },
  carouselImage: {
    width: 100,
    height: 100,
    margin: 5,
    resizeMode: "cover",
  },
});

export interface NFTSnapshot {
  uri: string;
  date: Date;
}

// Yer tutucu resim URL'si veya yerel kaynak
const PLACEHOLDER: NFTSnapshot = {
  uri: "https://placehold.co/400x400/png",
  date: new Date(Date.now()),
};
const DEFAULT_IMAGES: NFTSnapshot[] = new Array(7).fill(PLACEHOLDER);

export function MainScreen() {
  const {
    fetchNFTs,
    connect,
    publicKey,
    isLoading,
    createNFT,
    loadedNFTs,
    nftOfTheDay,
  } = useNFT();
  const [currentImage, setCurrentImage] =
    React.useState(PLACEHOLDER);
  const [previousImages, setPreviousImages] =
    React.useState(DEFAULT_IMAGES);
  const todaysDate = new Date(Date.now());
  const ipfsPrefix = `https://${process.env.EXPO_PUBLIC_NFT_PINATA_GATEWAY_URL}/ipfs/`;
  
  type NftMetaResponse = {
    name: string;
    description: string;
    imageCID: string;
  };
  
  const fetchMetadata = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const metadata = await response.json();
      return metadata as NftMetaResponse;
    } catch (error) {
      console.error("Metadata alınırken hata:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!loadedNFTs) return;

    const loadSnapshots = async () => {
      const loadedSnapshots = await Promise.all(
        loadedNFTs.map(async loadedNft => {
          if (!loadedNft.metadata.name) return null;
          if (!loadedNft.metadata.uri) return null;

          const metadata = await fetchMetadata(loadedNft.metadata.uri);
          if (!metadata) return null;

          const { imageCID, description } = metadata;
          if (!imageCID || !description) return null;

          const unixTime = Number(description);
          if (isNaN(unixTime)) return null;

          return {
            uri: ipfsPrefix + imageCID,
            date: new Date(unixTime),
          } as NFTSnapshot;
        }),
      );

      // Null değerleri filtrele
      const cleanedSnapshots = loadedSnapshots.filter(
        (snapshot): snapshot is NFTSnapshot => snapshot !== null,
      );

      // Tarihe göre sırala
      cleanedSnapshots.sort((a, b) => b.date.getTime() - a.date.getTime());

      setPreviousImages(cleanedSnapshots);
    };

    loadSnapshots();
  }, [loadedNFTs]);

  useEffect(() => {
    if (!nftOfTheDay) return;

    const fetchNftOfTheDayMetadata = async () => {
      try {
        if (!nftOfTheDay.metadata.uri) {
          console.error("nftOfTheDay için metadata URI bulunamadı");
          return;
        }

        const response = await fetchMetadata(nftOfTheDay.metadata.uri);

        if (!response?.imageCID) {
          console.error("nftOfTheDay metadata'sında resim bulunamadı");
          return;
        }

        setCurrentImage({
          uri: ipfsPrefix + response.imageCID,
          date: todaysDate,
        });
      } catch (error) {
        console.error("nftOfTheDay metadata'sı alınırken hata:", error);
      }
    };

    fetchNftOfTheDayMetadata();
  }, [nftOfTheDay, todaysDate]);
  
  const mintNFT = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setCurrentImage({
        uri: result.assets[0].uri,
        date: todaysDate,
      });

      createNFT(
        formatDate(todaysDate),
        `${todaysDate.getTime()}`,
        result.assets[0].uri,
      );
    }
  };

  const handleNFTButton = async () => {
    if (!publicKey) {
      connect();
    } else if (loadedNFTs === null) {      
      fetchNFTs();
    } else if (!nftOfTheDay) {
      mintNFT();
    } else {
      alert("Günün tamamı yapıldı!");
    }
  };

  const renderNFTButton = () => {
    let buttonText = "";
    if (!publicKey) buttonText = "Cüzdanı Bağla";
    else if (loadedNFTs === null) buttonText = "NFT'leri Al";
    else if (!nftOfTheDay) buttonText = "Anlık Görüntü Oluştur";
    else buttonText = "Hepsi Tamam!";

    if (isLoading) buttonText = "Yükleniyor...";

    return ;
  };

  const renderPreviousSnapshot = (snapshot: NFTSnapshot, index: number) => {
    const date = snapshot.date;
    const formattedDate = formatDate(date);

    return (
      
        
        {formattedDate}
      
    );
  };

  return (
    
      {/* Üst Yarım */}
      
        Mint-A-Day
        
        {renderNFTButton()}
      

      {/* Alt Yarım */}
      
        
          {previousImages.map(renderPreviousSnapshot)}
        
      
    
  );
}
```

---

#### 3. Test

Artık ilk anlık görüntümüzü oluşturma zamanı! Öncelikle Devnet etkin cüzdanınızı açın ve bazı SOL'lara sahip olduğunuzdan emin olun. Ardından, **`Cüzdanı Bağla`** butonuna tıklayın ve uygulamayı onaylayın. **`NFT'leri Al`** butonuna tıklayarak tüm NFT'leri alın. Son olarak, **`Anlık Görüntü Oluştur`** butonuna tıklayarak yükleyin ve mint edin.

> **Tebrikler!** Bu kolay veya hızlı bir laboratuvar değildi. Bu noktaya kadar geldiyseniz harika ilerliyorsunuz. 
> — Eğitimci Notu

Herhangi bir sorunla karşılaşırsanız, lütfen laboratuvarı tekrar gözden geçirin ve/veya son çözüm koduna bakmak için [**`main` dalında Github**](https://github.com/solana-developers/mobile-apps-with-expo) kontrol edin.

## Mücadele

Şimdi senin sıran. Sıfırdan kendi Expo uygulamanı oluştur. Kendi seçiminin yanı sıra, aşağıdaki fikirlerden birini de seçebilirsin:

- Günlük görüntü yerine, kullanıcıların gün için bir günlük girişi yazmasına ve ardından bunu NFT olarak mintlemesine izin veren bir uygulama oluşturun.
- Harika JPEG'lerinizi görebilmeniz için basit bir NFT görüntüleyici uygulama oluşturun.
- `expo-sensors` kullanarak [Stepn](https://stepn.com/) uygulamasının basitleştirilmiş bir klonunu yapın.

<Callout type="success" title="Laboratuvarı tamamladınız mı?">
Kodunuzu GitHub'a yükleyin ve 
[bize bu dersi nasıl bulduğunuzu söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=19cf8d3a-89a0-465e-95da-908cf8f45409)!
</Callout>