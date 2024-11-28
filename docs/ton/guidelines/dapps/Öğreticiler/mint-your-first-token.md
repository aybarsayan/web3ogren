# İlk Jetton'unuzu Mintleme

Hoşgeldiniz, geliştirici! Burada olmanız harika. 👋

Bu makalede, TON üzerinde ilk fungible token'ınızı (Jetton) nasıl oluşturacağınızı anlatacağız.

Jetton'ları mintlemek için [TON Minter](https://minter.ton.org/) / [TON Minter testnet](https://minter.ton.org/?testnet=true) tarayıcı hizmetini kullanacağız.

## 📖 Ne öğreneceksiniz

Bu makalede şunları öğreneceksiniz:

- bir Jetton'u tarayıcınız ile dağıtmak
- token'ınızı özelleştirmek
- token'ınızı yönetmek ve kullanmak
- token parametrelerini düzenlemek

## 📌 Başlamadan önce hazırlık

1. Öncelikle [Tonhub](https://ton.app/wallets/tonhub-wallet) / [Tonkeeper](https://ton.app/wallets/tonkeeper) cüzdanına veya hizmette desteklenen herhangi bir cüzdana sahip olmalısınız.
2. Bakiyenizde 0.25 Toncoin'den fazla olmalı ve blockchain komisyonunu karşılamak için ek fonlara sahip olmalısınız.

:::tip Başlangıç ipucu
 ~0.5 TON bu eğitim için yeterli olmalıdır.
:::

## 🚀 Hadi başlayalım!

Web tarayıcınızı kullanarak [TON Minter](https://minter.ton.org/) / [TON Minter testnet](https://minter.ton.org/?testnet=true) hizmetini açın.

![image](../../../../images/ton/static/img/tutorials/jetton/jetton-main-page.png)

### Jetton'u tarayıcınız ile dağıtma

#### Cüzdanı Bağla

[**Cüzdanı Bağla**](https://ton.app/wallets/tonhub-wallet) butonuna tıklayarak [Tonhub](https://ton.app/wallets/tonhub-wallet) cüzdanınızı veya aşağıdaki cüzdanlardan birini bağlayın.

#### ![image](../../../../images/ton/static/img/tutorials/jetton/jetton-connect-wallet.png)

**QR kodunu tarayın** bir [Mobil cüzdan (örneğin, Tonhub)](https://ton.app/wallets/tonhub-wallet)

#### Boşlukları ilgili bilgilerle doldurun

1. İsim (genellikle 1-3 kelime).
2. Sembol (genellikle 3-5 büyük harf).
3. Miktar (örneğin, 1.000.000).
4. Token'ın açıklaması (isteğe bağlı).

#### Token logosu URL'si (isteğe bağlı)

![image](../../../../images/ton/static/img/tutorials/jetton/jetton-token-logo.png)

Etkileyici bir Jetton token'ınız olsun istiyorsanız, güzel bir logoyu bir yere barındırmanız gerekir. Örneğin:

* https://bitcoincash-example.github.io/website/logo.png

:::info
Logonun URL yerleşimi hakkında kolayca bilgi alabilirsiniz [depo](https://github.com/ton-blockchain/minter-contract#jetton-metadata-field-best-practices) içindeki "Bu metadata nerede saklanıyor" paragrafında.

* Zincir üzerinde.
* Zincir dışı IPFS.
* Zincir dışı web sitesi.
:::

#### Logonuzun URL'sini nasıl oluşturabilirsiniz?

1. Şeffaf arka plana sahip **256x256** PNG formatında bir logo resmi hazırlayın.
2. Logonuzun bağlantısını alın. İyi bir çözüm [GitHub Pages](https://pages.github.com/)dır. Onları kullanacağız.
3. [Yeni bir kamu deposu oluşturun](https://docs.github.com/en/get-started/quickstart/create-a-repo) ismi `website`.
4. Hazırladığınız resmi git'e yükleyin ve `GitHub Pages`'i etkinleştirin.
    1. [Depounuza GitHub Pages ekleyin](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
    2. [Resminizi yükleyin ve bir bağlantı alın](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).
5. Kendi alan adınız varsa, `.org` kullanmak iyi olur `github.io` yerine.

## 💸 Jetton Gönder

Ekranın sağ tarafında, [Tonkeeper](https://tonkeeper.com/) veya [Tonhub](https://ton.app/wallets/tonhub-wallet) gibi çoklu para birimi cüzdanlarına **token gönderilebilir**.

![image](../../../../images/ton/static/img/tutorials/jetton/jetton-send-tokens.png)

:::info
Jetton'larınızı miktarlarını azaltmak için her zaman **yakabilirsiniz**.

![image](../../../../images/ton/static/img/tutorials/jetton/jetton-burn-tokens.png)
:::

### 📱 Tonkeeper üzerinden telefondan token gönderme

Ön koşullar:

1. Göndermek için bakiyenizde zaten token'lar olmalıdır.
2. İşlem ücretlerini ödemek için en az 0.1 Toncoin bulunmalıdır.

#### Adım adım rehber

Ardından, **token'ınıza** gidin, **göndermek için miktarı** ayarlayın ve **alıcı adresini** girin.

![image](../../../../images/ton/static/img/tutorials/jetton/jetton-send-tutorial.png)

## 📚 Sitede token kullanma

Token'ınızı sahip olarak yönetmek için sitenin üst kısmındaki **arama alanına** token'ın adresini girerek erişebilirsiniz.

:::info
Adres, zaten sahip panelindeyseniz sağ tarafta bulunabilir veya airdrop alırken token adresini bulabilirsiniz.

![image](../../../../images/ton/static/img/tutorials/jetton/jetton-wallet-address.png)
:::

## ✏️ Jetton (token) özelleştirme

`FunC` dili ile token'ın davranışını kendi lehinize değiştirebilirsiniz.

Herhangi bir değişiklik yapmak için buradan başlayın:

* https://github.com/ton-blockchain/minter-contract

### Geliştiriciler için adım adım kılavuz

1. [tonstarter-contracts](https://github.com/ton-defi-org/tonstarter-contracts) deposundaki tüm "Bağımlılıklar ve Gereksinimler"i kontrol edin.
2. [minter-contract deposunu](https://github.com/ton-blockchain/minter-contract) klonlayın ve projeyi yeniden adlandırın.
3. Kurmak için root dizininde bir terminal açın ve şunu çalıştırın:

    ```bash
    npm2yarn
    npm install
    ```

4. Orijinal akıllı sözleşme dosyalarını kök terminalde aynı şekilde düzenleyin. Tüm sözleşme dosyaları `contracts/*.fc` içindedir.

5. Bir projeyi yapmak için:

    ```bash
    npm2yarn
    npm run build
    ```
    Yapım sonucu, gerekli dosyaların oluşturulma sürecini, ayrıca akıllı sözleşmelerin aranmasını tanımlayacaktır.

:::info
Konsolu okuyun, birçok ipucu var!
:::

6. Değişikliklerinizi test etmek için:

    ```bash
    npm2yarn
    npm run test
    ```

7. `build/jetton-minter.deploy.ts` içindeki token'ın **ismini** ve diğer metadata bilgilerini `JettonParams` objesini değiştirerek düzenleyin.

    ```js
    // Bu örnek veridir - Bu parametreleri kendi jetton'unuz için değiştirin!
    // - Veriler zincir üzerinde saklanır (görsel verisi hariç)
    // - Sahibi genellikle dağıtan cüzdanın adresi olmalıdır.

    const jettonParams = {
      owner: Address.parse("EQD4gS-Nj2Gjr2FYtg-s3fXUvjzKbzHGZ5_1Xe_V0-GCp0p2"),
      name: "MyJetton",
      symbol: "JET1",
      image: "https://www.linkpicture.com/q/download_183.png", // Görsel URL
      description: "My jetton",
    };
    ```

8. Token'ı dağıtmak için aşağıdaki komutu kullanın:

    ```bash
    npm2yarn
    npm run deploy
    ```
    Projenizi çalıştırmanın sonucu:

    ```js
    > @ton-defi.org/jetton-deployer-contracts@0.0.2 deploy
    > ts-node ./build/_deploy.ts

    =================================================================
    Dağıtım betiği çalışıyor, dağıtmak için bazı sözleşmeleri bulalım..

    * 'mainnet' ile çalışıyoruz

    * Dağıtım için kullanılacak '.env' yapılandırma dosyası bulundu!
     - Dağıtım için kullanılan cüzdan adresi: YOUR-ADDRESS
     - Cüzdan bakiyesi YOUR-BALANCE TON, gaz ödemesi için kullanılacak

    * 'build/jetton-minter.deploy.ts' ana sözleşmesi bulundu - bunu dağıtalım:
     - Başlangıç kodu+verilerinize göre yeni sözleşme adresiniz: YOUR-ADDRESS
     - Sözleşmeyi zincir üzerinde dağıtıyoruz..
     - Dağıtım işlemi başarıyla gönderildi
     - Block explorer bağlantısı: https://tonwhales.com/explorer/address/YOUR-ADDRESS
     - Sözleşmenin gerçekten dağıtılıp dağıtılmadığını kontrol etmek için 20 saniyeye kadar bekleniyor..
     - BAŞARI! Sözleşme başarıyla şu adrese dağıtıldı: YOUR-ADDRESS
     - Yeni sözleşme bakiyesi artık YOUR-BALANCE TON, kirayı ödemek için yeterli olduğundan emin olun
     - Dağıtım sonrası testi çalıştırma:
    {
      name: 'MyJetton',
      description: 'My jetton',
      image: 'https://www.linkpicture.com/q/download_183.png',
      symbol: 'JET1'
    }
    ```

## Sırada ne var?

Eğer daha derinlemesine gitmek istiyorsanız, Tal Kol'un bu makalesini okuyun:  
* [Akıllı sözleşmenizi nasıl parçalamalı ve neden—TON Jettonlarının anatomisini inceliyoruz](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)

## Referanslar

 - Proje: https://github.com/ton-blockchain/minter-contract
 - Slava tarafından ([Telegram @delovoyslava](https://t.me/delovoyslava), [delovoyhomie GitHub'da](https://github.com/delovoyhomie))
 - `Jetton işlemleri`

--- 

:::note
**Kısa bir hatırlatma:** Token'larınızı güvenli bir şekilde saklamak ve yönetmek önemlidir. Cüzdanınıza ve token bilginize dikkat edin!
:::