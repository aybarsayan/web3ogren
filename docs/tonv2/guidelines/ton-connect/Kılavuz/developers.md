# TON Connect SDK'ları

## SDK Listesi

:::info
Mümkünse, dApp'leriniz için [@tonconnect/ui-react](https://github.com/ton-connect/sdk/tree/main/packages/ui-react) kitini kullanmanız önerilir. Sadece ürününüz için gerçekten gerekli ise SDK'nın daha alt seviyelerine geçin veya protokolün kendi versiyonunu yeniden uygulayın.
:::

Bu sayfa, TON Connect için yararlı kütüphanelerin listesini içermektedir.

- `TON Connect React` 
- `TON Connect JS SDK`
- `TON Connect Vue`
- `TON Connect Python SDK`
- `TON Connect Dart`
- `TON Connect C#`
- `TON Connect Unity`
- `TON Connect Go`

---

## TON Connect React

- [@tonconnect/ui-react](https://github.com/ton-connect/sdk/tree/main/packages/ui-react) - React uygulamaları için TON Connect Kullanıcı Arayüzü (UI)

TonConnect UI React, TonConnect SDK için bir React UI kitidir. Bunu, uygulamanızı React uygulamalarında TonConnect protokolü aracılığıyla TON cüzdanlarına bağlamak için kullanabilirsiniz.

:::tip
* `@tonconnect/ui-react` ile bir DApp örneği: [GitHub](https://github.com/ton-connect/demo-dapp-with-react-ui)
* Yayınlanan `demo-dapp-with-react-ui` örneği: [GitHub](https://ton-connect.github.io/demo-dapp-with-react-ui/)
:::

```bash
npm i @tonconnect/ui-react
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui-react)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui-react)
- [API Belgelendirmesi](https://ton-connect.github.io/sdk/modules/_tonconnect_ui_react.html)

---

## TON Connect JS SDK

TON Connect deposu aşağıdaki ana paketleri içerir:

- `@tonconnect/ui` - TON Connect Kullanıcı Arayüzü (UI)
- `@tonconnect/sdk`  - TON Connect SDK
- `@tonconnect/protocol` - TON Connect protokol spesifikasyonları

### TON Connect UI

TonConnect UI, TonConnect SDK için bir UI kitidir. Bunu uygulamanızı TonConnect protokolü aracılığıyla TON cüzdanlarına bağlamak için kullanabilirsiniz. "Cüzdanı bağla butonu", "cüzdan seçme iletişim kutusu" ve onay modalları gibi UI bileşenlerini kullanarak TonConnect'i uygulamanıza entegre etmenizi kolaylaştırır.

```bash
npm i @tonconnect/ui
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui)
- [API Belgelendirmesi](https://ton-connect.github.io/sdk/modules/_tonconnect_ui.html)

:::note
TON Connect Kullanıcı Arayüzü (UI), geliştiricilerin uygulama kullanıcıları için kullanıcı deneyimini (UX) geliştirmelerine olanak tanıyan bir çerçevedir.
:::

TON Connect, "cüzdanı bağla butonu", "cüzdan seçme iletişim kutusu" ve onay modalları gibi basit UI bileşenlerini kullanarak uygulamalara kolayca entegre edilebilir. 

**TON Connect'in uygulamalarda UX'i nasıl geliştirdiğine dair üç ana örnek:**

- DApp tarayıcısında uygulama işlevselliği örneği: [GitHub](https://ton-connect.github.io/demo-dapp/)
- Yukarıdaki DApp'in arka uç bölümü örneği: [GitHub](https://github.com/ton-connect/demo-dapp-backend)
- Go kullanarak köprü sunucusu: [GitHub](https://github.com/ton-connect/bridge)

---

### TON Connect SDK

Geliştiricilerin TON Connect'i uygulamalarına entegre etmelerine yardımcı olan üç çerçeveden en düşük seviyeli olanı TON Connect SDK'dır. Bu, uygulamaları TON cüzdanlarına TON Connect protokolü aracılığıyla bağlamak için temel olarak kullanılır.

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
- [NPM](https://www.npmjs.com/package/@tonconnect/sdk)

:::warning
Bu çerçeve, daha karmaşık uygulamalarda kullanılmak üzere dikkatle seçilmelidir.
:::

### TON Connect Protokol Modelleri

Bu paket, protokol isteklerini, protokol yanıtlarını, etkinlik modellerini ve kodlama ve kod çözme işlevlerini içerir. TypeScript'te yazılmış cüzdan uygulamalarına TON Connect'i entegre etmek için kullanılabilir. Bir DApp'e TON Connect'i entegre etmek için [@tonconnect/sdk](https://www.npmjs.com/package/@tonconnect/sdk) kullanılmalıdır.

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/protocol)
- [NPM](https://www.npmjs.com/package/@tonconnect/protocol)

---

## TON Connect Vue

TonConnect UI Vue, TonConnect SDK için bir Vue UI kitidir. Bunu uygulamanızı TonConnect protokolü aracılığıyla TON cüzdanlarına bağlamak için Vue uygulamalarında kullanabilirsiniz.

:::tip
* `@townsquarelabs/ui-vue` ile bir DApp örneği: [GitHub](https://github.com/TownSquareXYZ/demo-dapp-with-vue-ui)
* Yayınlanan `demo-dapp-with-vue-ui` örneği: [GitHub](https://townsquarexyz.github.io/demo-dapp-with-vue-ui/)
:::

```bash
npm i @townsquarelabs/ui-vue
```

- [GitHub](https://github.com/TownSquareXYZ/tonconnect-ui-vue)
- [NPM](https://www.npmjs.com/package/@townsquarelabs/ui-vue)

---

## TON Connect Python

### pytonconnect

TON Connect 2.0 için Python SDK'sı. `@tonconnect/sdk` kütüphanesinin bir eşdeğeri.

Bunu, uygulamanızı TonConnect protokolü aracılığıyla TON cüzdanlarına bağlamak için kullanabilirsiniz.

```bash
pip3 install pytonconnect
```

- [GitHub](https://github.com/XaBbl4/pytonconnect)

### ClickoTON-Foundation tonconnect

TON Connect'i Python uygulamalarına bağlamak için bir kütüphane

```bash
git clone https://github.com/ClickoTON-Foundation/tonconnect.git
pip install -e tonconnect
```

- [GitHub](https://github.com/ClickoTON-Foundation/tonconnect)

---

## TON Connect Dart

TON Connect 2.0 için Dart SDK'sı. `@tonconnect/sdk` kütüphanesinin bir eşdeğeri.

Bunu, uygulamanızı TonConnect protokolü aracılığıyla TON cüzdanlarına bağlamak için kullanabilirsiniz.

```bash
$ dart pub add darttonconnect
```

:::info
* [GitHub](https://github.com/romanovichim/dartTonconnect)
:::

---

## TON Connect C#

TON Connect 2.0 için C# SDK'sı. `@tonconnect/sdk` kütüphanesinin bir eşdeğeri.

Bunu, uygulamanızı TonConnect protokolü aracılığıyla TON cüzdanlarına bağlamak için kullanabilirsiniz.

```bash
$ dotnet add package TonSdk.Connect
```

:::note
* [GitHub](https://github.com/continuation-team/TonSdk.NET/tree/main/TonSDK.Connect)
:::

---

## TON Connect Go

TON Connect 2.0 için Go SDK'sı.

Bunu, uygulamanızı TonConnect protokolü aracılığıyla TON cüzdanlarına bağlamak için kullanabilirsiniz.

```bash
go get github.com/cameo-engineering/tonconnect
```

* [GitHub](https://github.com/cameo-engineering/tonconnect)

---

## Genel Sorular ve Endişeler

Eğer geliştiricilerimiz veya topluluk üyelerimiz TON Connect 2.0'ı uygulama sırasında ek sorunlarla karşılaşırsa, lütfen [Tonkeeper geliştirici](https://t.me/tonkeeperdev) kanalına ulaşın.

Herhangi bir ek sorunla karşılaşırsanız veya TON Connect 2.0'ı geliştirmek için bir öneri sunmak istiyorsanız, lütfen ilgili [GitHub dizini](https://github.com/ton-connect/) aracılığıyla doğrudan bizimle iletişime geçin.

---

## TON Connect Unity

TON Connect 2.0 için Unity varlığı. `continuation-team/TonSdk.NET/tree/main/TonSDK.Connect` kullanır.

Bunu, TonConnect protokolünü oyununuza entegre etmek için kullanın.

:::tip
* [GitHub](https://github.com/continuation-team/unity-ton-connect)
* [Belgeler](https://docs.tonsdk.net/user-manual/unity-tonconnect-2.0/getting-started)
:::

---

## Ayrıca Bakınız

- [İlk web istemcinizi oluşturma için adım adım kılavuz](https://ton-community.github.io/tutorials/03-client/)
- [[YouTube] TON Akıllı Sözleşmeleri | 10 | Telegram DApp[EN]](https://www.youtube.com/watch?v=D6t3eZPdgAU&t=254s&ab_channel=AlefmanVladimir%5BEN%5D)
- [Ton Connect Başlarken](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
- `Entegrasyon Kılavuzu`
- [[YouTube] TON Geliştirici Eğitim TON Connect Protokolü [RU]](https://www.youtube.com/playlist?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_)