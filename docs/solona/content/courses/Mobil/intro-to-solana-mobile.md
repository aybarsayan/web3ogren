---
title: Solana Mobil'e Giriş
objectives:
  - Mobil öncelikli uygulama deneyimlerinin faydalarını açıklamak
  - Yüksek seviyede Mobil Cüzdan Adaptörü (MWA) akışını açıklamak
  - React ve React Native arasındaki yüksek seviyedeki farkları açıklamak
  - React Native kullanarak basit bir Android Solana uygulaması oluşturmak
description:
  "Blockchain işlevselliğini kullanarak yerel mobil uygulamalar nasıl oluşturulacağını öğrenin"
---

## Özet

- **Solana Mobil Cüzdan Adaptörü** (**MWA**), mobil uygulamaların mobil cüzdanlar ile WebSocket bağlantısı üzerinden imzalanmak için işlemler göndermesine olanak tanır.
- Solana mobil uygulamaları oluşturmaya başlamak için en kolay yol, Solana Mobil’in
  [React Native paketlerini](https://docs.solanamobile.com/react-native/setup) kullanmaktır -
  `@solana-mobile/mobile-wallet-adapter-protocol` ve
  `@solana-mobile/mobile-wallet-adapter-protocol-web3js`

## Ders Genel Bakışı

Bu derslerde, Solana ağı ile etkileşime giren mobil uygulamalar geliştireceğiz, bu da blockchain kullanım durumları ve davranışlarında tamamen yeni bir paradigma açıyor. **Solana Mobil Yığını** (**SMS**) geliştiricilerin mobil uygulamaları sorunsuz bir şekilde oluşturmalarına yardımcı olmak için tasarlanmıştır. İçerir:
[Mobile Wallet Adapter (MWA)](https://docs.solanamobile.com/getting-started/overview#mobile-wallet-adapter)
, React Native kullanan bir Solana Mobil SDK,
[Seed Vault](https://docs.solanamobile.com/getting-started/overview#seed-vault)
ve
[Solana uygulama Mağazası](https://docs.solanamobile.com/getting-started/overview#solana-app-store).
Bu kaynaklar, benzer bir deneyim ile mobil geliştirmeyi basitleştirirken, mobil özel özellikler sunar.

Bu ders, Solana ağı ile entegre olan basit bir Android uygulaması oluşturmak için React Native kullanmaya odaklanmaktadır. Eğer React veya Solana ile programlamaya aşina değilseniz, [Solana’ya Giriş dersi](https://github.com/solana-foundation/developer-content/tree/main/content/courses/intro-to-solana) ile başlamanızı ve hazır olduğunuzda geri dönmenizi öneririz. Eğer aşinaysanız, haydi başlayalım!

## Solana Mobil'e Giriş

Yerel mobil cüzdanlar, gizli anahtarlarınızı saklar ve bunları web uzantı cüzdanları gibi işlemleri imzalamak ve göndermek için kullanır. Ancak yerel mobil cüzdanlar, herhangi bir uygulamanın herhangi bir cüzdan ile çalışabilmesini sağlamak için
[Mobile Wallet Adapter](https://github.com/solana-mobile/mobile-wallet-adapter)
(MWA) standardını kullanır, 
[Wallet Adapter](https://github.com/anza-xyz/wallet-adapter) yerine.

MWA'nın detaylarına bir
`sonraki derste` gireceğiz, ancak temelde uygulamalar arasında iletişimi kolaylaştırmak için bir WebSocket açar. Böylece ayrı bir uygulama, imzalanıp gönderilmek üzere cüzdan uygulamasına bir işlem sağlayabilir ve cüzdan uygulaması uygun durum güncellemeleri ile yanıt verebilir.

### Solana ile Mobil Kullanım Durumları

Geliştirmeden önce, Web3 mobil geliştirme manzarasını anlamak, potansiyel engelleri ve fırsatları öngörmek önemlidir. Solana mobil geliştirmenin açabileceği birkaç örnek:

**Mobil Bankacılık ve Ticaret (DeFi)**

Şu anda çoğu geleneksel bankacılık, yerel mobil uygulamalar üzerinden gerçekleşiyor. SMS ile, artık kendi cüzdanınızla yerel mobil uygulamalar üzerinden bankacılık ve ticaret yapabilirsiniz; burada kendi anahtarlarınızı tutarsınız.

**Solana Mikropaydaşları ile Mobil Oyun**

> **Anahtar Not:** Mobil oyunlar, video oyun endüstrisinin toplam değerinin yaklaşık %50'sini temsil ediyor; bu durum büyük ölçüde küçük oyun içi satın alımlara bağlı. Ancak, ödeme işlem ücretleri genellikle bu oyun içi satın alımların minimumda 0.99 USD olmasına sebep oluyor. Solana ile gerçek mikropaydaşların kilidini açmak mümkün. Ekstra bir hayat mı istiyorsunuz? O zaman bu 0.0001 SOL.

**Mobil E-Ticaret**

SMS, yeni bir dalgalanma oluşturabilir ve mobil e-ticaret alışverişçilerinin tercih ettikleri Solana cüzdanından doğrudan ödeme yapmalarını sağlayabilir. Solana cüzdanınızı Apple Pay kadar kolay kullanabileceğiniz bir dünyayı hayal edin.

Özetle, mobil blockchain işlemleri birçok fırsat açabilir. Hadi inşa etmeye başlayalım!

### Desteklenen İşletim Sistemleri

Şu anda, MWA yalnızca Android’i destekliyor. Android'de, cüzdan uygulaması arka planda olsa bile uygulamalar arasında bir WebSocket bağlantısı devam edebilir.

iOS'ta, OS bir uygulama arka plana alındığında websocket bağlantılarını hızla askıya alır, bu yüzden standart  
[Wallet Adapter](https://github.com/solana-labs/wallet-adapter) kütüphanesi kullanılır.

Bu dersin geri kalanı, MWA ile Android uygulamaları geliştirmeye odaklanacaktır.

### Desteklenen Frameworklar

Solana Mobil, birkaç farklı frameworkü desteklemektedir. Resmi olarak desteklenenler React Native ve yerel Android’dir; Flutter, Unity ve Unreal Engine için topluluk SDK'ları bulunmaktadır.

**Solana SDK'ları:**

- [React Native](https://docs.solanamobile.com/react-native/quickstart) (Regular ve Expo)
- [Android](https://docs.solanamobile.com/android-native/quickstart)

**Topluluk SDK'ları:**

- [Flutter](https://docs.solanamobile.com/flutter/overview)
- [Unity](https://docs.solanamobile.com/unity/unity_sdk)
- [Unreal Engine](https://docs.solanamobile.com/unreal/unreal_sdk)

Geliştirme deneyimini diğer derslere olabildiğince yakın tutmak için yalnızca React Native ile çalışacağız.

## React'tan React Native'e

React Native, mobil için tasarlanmış olan React'a çok benzerdir. İşte dikkate alınması gereken bazı önemli noktalar:

- React Native, yerel Android ve iOS uygulamalarına derlenirken, React bir dizi web sayfasına derlenir.
- `` gibi web öğeleri yerine, `` gibi mobil yerel öğeler kullanacaksınız.
- React Native, React web uygulamalarının erişemeyeceği kameralar ve ivmeölçer gibi mobil donanımlara erişim sağlar.
- Birçok standart React ve Node paketinin React Native ile uyumlu olmayabilir ve React Native kurmak zorlayıcı olabilir. Neyse ki, [React Native Dokümanları](https://reactnative.dev/docs/environment-setup?guide=native) ihtiyacınız olabilecek her şeyi içeriyor.
- Geliştirme için Android uygulamaları için [Android Studio](https://developer.android.com/studio/intro/) ayarlamanız ve test için bir emülatör veya fiziksel cihaz kullanmanız gerekecek.

:::note
**NOT:** Bir öğrenme eğrisi var ama React biliyorsanız, mobil uygulamalar geliştirme konusunda düşündüğünüzden çok daha uzaktasınız! Başlamak biraz garip gelebilir, ancak birkaç saatlik React Native geliştirmeden sonra çok daha rahat hissetmeye başlayacaksınız. Size yardımcı olması için aşağıda bir `Laboratuvar` bölümü ekledik.
:::

## Solana'da React Native Uygulaması Oluşturma

Solana React Native uygulamaları, React uygulamalarına hemen hemen benzer. Temel fark, cüzdan etkileşiminde yatmaktadır. Cüzdanın tarayıcıda değil, uygulamanızın WebSocket kullanarak tercih ettiğiniz cüzdan uygulaması ile bir MWA oturumu oluşturmasıdır. Neyse ki, bu durum sizin için MWA kütüphanesinde soyutlanmıştır. Tek fark, cüzdanla iletişim kurmanız gerektiğinde `transact` fonksiyonunun kullanılacağında, bu fonksiyonla ilgili daha fazla ayrıntı dersin ilerleyen bölümlerinde.

![Uygulama Akışı](../../../images/solana/public/assets/courses/unboxed/basic-solana-mobile-flow.png)

## Veri Okuma

Solana kümesinden veri okumak, React’teki gibi React Native’de de aynı şekilde çalışır. `useConnection` kancasını kullanarak, Solana ağıyla etkileşimden sorumlu olan `connection` nesnesine erişim sağlayabilirsiniz.

Solana'da, bir hesap, zincir üzerinde depolanan herhangi bir nesneye atıfta bulunur ve genellikle bir
[public key](https://solana.com/docs/terminology#public-key-pubkey) ile referans alındığıdır.

Aşağıda, `getAccountInfo` methodunu kullanarak hesap bilgilerini nasıl okuyabileceğinize dair bir örnek verilmiştir:

```javascript
const { connection } = useConnection();
const publicKey = new PublicKey("your-wallet-public-key-here"); // Geçerli bir public key ile değiştirin
const account = await connection.getAccountInfo(publicKey);
```

> **NOT:** Eğer bir tazeleme ihtiyacınız varsa, [Veri Okuma'ya Giriş dersi](https://solana.com/developers/courses/onchain-development/intro-to-anchor-frontend)'ne göz atabilirsiniz. 

## Bir Cüzdana Bağlanma

Blockchain'e veri yazma işlemi bir **işlem** üzerinden yapılmalıdır. İşlemler, bir veya daha fazla gizli anahtar tarafından imzalanmayı gerektirir ve işlenmek üzere bir [RPC sağlayıcısına](https://academy.subquery.network/subquery_network/node_operators/rpc_providers/introduction.html) gönderilmelidir. Neredeyse her durumda, bu etkileşim bir cüzdan uygulaması aracılığıyla gerçekleştirilir.

### Web ile Mobil Cüzdan Etkileşimleri

Uygulama ve cüzdanı bağlayan websocket, MWA kullanılarak yönetilir ve **Android niyetleri** kullanılarak başlatılır; dApp, `solana-wallet://` şemasını kullanarak niyetini yayınlar.
![Bağlanma](../../../images/solana/public/assets/courses/unboxed/basic-solana-mobile-connect.png)

Cüzdan uygulaması niyet yayınını aldığında, oturumu başlatan uygulama ile bir WebSocket bağlantısı açar. Uygulama bu bağlantıyı aşağıda gösterildiği gibi `transact` fonksiyonunu kullanarak başlatır:

```tsx
transact(async (wallet: Web3MobileWallet) => {
  // Cüzdan eylem kodunuz buraya gelecek
});
```

Bu fonksiyon, imzalama işlemleri veya cüzdan verileri ile etkileşim gibi eylemler gerçekleştirmenizi sağlayan `Web3MobileWallet` nesnesine erişim sağlar. Unutmayın, tüm cüzdan etkileşimleri `transact` fonksiyonunun geri çağırma fonksiyonu içinde gerçekleşmelidir.

### İşlemleri İmzalama ve Gönderme

Bir işlemi imzalama ve gönderme süreci şu şekildedir:

- `transact` fonksiyonunu kullanarak cüzdan ile bir oturum başlatın. Bu fonksiyon, asenkron bir geri çağırma alır:
  `async (wallet: Web3MobileWallet) => {...}`.
- Geri çağırma içinde, cüzdanın durumuna bağlı olarak `wallet.authorize()` veya `wallet.reauthorize()` ile cüzdan yetkilendirmesi isteyin (aktif bir oturum olup olmadığını kontrol edin).
- Cüzdan yetkilendirildikten sonra, şunlardan birini yapabilirsiniz:
  - İşlemi `wallet.signTransactions()` kullanarak imzalamak, veya
  - İşlemi doğrudan cüzdan ile `wallet.signAndSendTransactions()` kullanarak imzalamak ve göndermek.

![İşlem Yapma](../../../images/solana/public/assets/courses/unboxed/basic-solana-mobile-transact.png)

Cüzdanın yetkilendirme durumunu yönetmek için, `useAuthorization()` kancasını oluşturmayı düşünebilirsiniz. Bu kanca, uygulamanız içinde yetkilendirmeyi yönetme sürecini kolaylaştırabilir, özellikle cüzdan ile birden fazla etkileşiminiz varsa.

> Bu kancanın kullanımını daha fazla uygulama pratiği yaparak ilerleyen laboratuvar çalışmaları sırasında keşfedeceğiz.

Aşağıda, MWA kullanarak bir işlem göndermenin bir örneği yer almaktadır:

```tsx
// gerekli bağımlılıkları içe aktarın (varsa)

const { authorizeSession } = useAuthorization();
const { connection } = useConnection();

const sendTransactions = async (transaction: Transaction) => {
  try {
    // Cüzdan ile bir oturum başlat
    await transact(async (wallet: Web3MobileWallet) => {
      // İşlem için en son blockhash'i al
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      // Cüzdan oturumunu yetkilendir
      const authResult = await authorizeSession(wallet);

      // En son blockhash ve feePayer ile güncellenmiş bir işlem oluştur
      const updatedTransaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: authResult.publicKey,
      }).add(transaction);

      // İşlemi cüzdan aracılığıyla imzala ve gönder
      const signatures = await wallet.signAndSendTransactions({
        transactions: [updatedTransaction],
      });

      console.log(`İşlem başarılı! İmza: ${signatures[0]}`);
    });
  } catch (error) {
    console.error("İşlem gönderirken hata:", error);
    throw new Error("İşlem başarısız oldu");
  }
};
```

## Hata Ayıklama

Solana mobil işlemleri ile çalışırken hata ayıklama zor olabilir, çünkü iki ayrı uygulama ilgili: uygulamanız ve mobil cüzdan. Tipik tek uygulamalı yapılandırmaların aksine, cüzdanın günlüklerine doğrudan erişiminiz olmayacaktır; bu durum sorunları izlemeyi daha karmaşık hale getirir.

Ancak, Android Studio’nun [Logcat](https://developer.android.com/studio/debug/logcat) özelliği faydalı bir çözüm sunar - cihazınızdaki tüm uygulamalardan gelen günlükleri görmek için. Logcat’i kullanarak, uygulamanız ve cüzdan arasındaki etkileşimi izleyebilir ve işlem imzalama ve gönderme sırasında meydana gelen sorunları belirleyebilirsiniz.

Logcat tercih ettiğiniz bir araç değilse, alternatif bir yaklaşım, cüzdanı yalnızca işlemleri imzalamak için kullanmak, gerçek işlem gönderimini uygulamanızın kodunda gerçekleştirmektir. Bu yöntem, hata ayıklama üzerinde daha fazla kontrol sağlar çünkü istemci tarafında işlem akışını daha ayrıntılı inceleyebilirsiniz.

## Solana Mobil için Dağıtım

Mobil uygulamaları dağıtmak zor olabilir ve blockchain tabanlı uygulamalarla başa çıkmak karmaşıklığı artırır. Bu zorluğun başlıca iki nedeni vardır: müşteri güvenliği ve finansal teşvikler.

### Müşteri Güvenliği ve Düzenleyici Belirsizlik

Çoğu mobil uygulama pazarı, Apple App Store ve Google Play Store gibi, blockchain ile ilgili uygulamalara kısıtlamalar getiren politikalara sahiptir. Blockchain hala nispeten yeni ve gelişen bir teknoloji olduğundan, platformlar düzenleyici uyuma karşı temkinli davranır. Kullanıcıları blockchain uygulamalarına karşı oluşabilecek potansiyel risklerden korumak için genellikle katı kurallar benimserler.

### Uygulama İçi Satın Alımlar ve Platform Ücretleri

Blockchain işlemlerini uygulama içi satın alımlar için kullanmak, başka bir önemli zorluktur. Birçok platform, uygulamaları içinde yapılan satın alımlar için işlem ücreti uygular (bu ücretler %15 ile %30 arasında değişmektedir). Blockchain üzerinden ödeme yapmak, genellikle bu ücretleri aşma yolu olarak görülmekte ve bu durum çoğu uygulama mağazası tarafından açıkça yasaklanmaktadır. Bu platformlar, gelir akışlarını koruma önceliklerine sahiptir ve bu nedenle in-app purchases için blockchain ödemelerini kolaylaştıran uygulamalara karşı sıkı politikalar uygularlar.

> Geleneksel uygulama mağazaları, gelirlerini korumak ve düzenlemelere uymak için blockchain işlemlerine katı kurallar uygularken, Solana uygulama Mağazası gibi alternatif dağıtım yöntemleri, geliştiricilere Solana tabanlı mobil uygulamaları dağıtmak için daha esnek bir platform sunmaktadır. Bu merkeziyetsiz yaklaşım, merkezi uygulama pazarlarındaki birçok kısıtlamayı aşarak uygulamaların daha blockchain dostu bir ekosistemde gelişmesine olanak sağlar.

## Sonuç

Solana mobil geliştirmeye başlamak, Solana Mobil Yığını (SMS) sayesinde her zamankinden daha erişilebilir. React Native, React ile bazı farklılıklar getirse de, yazacağınız kodların çoğu tanıdık kalmaya devam edecek, özellikle UI yapılandırması ve durum yönetimi açısından. En büyük ayrım, cüzdanlarla etkileşim kurma biçimindedir; bu, cüzdan oturumlarını kurmak, işlemleri imzalamak ve Solana blockchain’i ile iletişim kurmak için `transact` geri çağırmasını kullanmayı gerektirir.

Solana mobil uygulamalar geliştirmeye devam ederken öğrenmeye ve becerilerinizi geliştirmeye devam etmek önemlidir. İlginiz için ek kaynaklara göz atmayı unutmayın:

- Solana'nın temel kütüphaneleri ve en iyi uygulamaları hakkında kapsamlı kılavuzlar için [Resmi Solana Geliştirici Belgeleri](https://solana.com/docs).

- Sorunlarının çözülmesi, düşüncelerin paylaşılması ve ekosistemdeki en son değişikliklerden haberdar olmak için [Solana Stack Exchange](https://solana.stackexchange.com/) forumunu ziyaret edin.

Mobil Solana geliştirmeye hakim olmak, merkeziyetsiz finans (DeFi), oyun ve e-ticaret alanında yeni fırsatlar açarak size kesintisiz kullanıcı deneyimi sunan son teknoloji uygulamalar geliştirme imkanı sağlayacaktır. Meraklı kalın ve mobil uygulamalarla neler başarabileceğinizi sınamak için farklı araçlarla denemeler yapın. Gelin bilgilerimizi test edelim ve Android OS için React Native ile bir sayı sayma uygulaması inşa edelim!

## Laboratuvar: React Native ile Mobil Sayaç Uygulaması Geliştirme

Bu uygulama bir sayaç gösterecek ve kullanıcıların Solana blockchain üzerinde bir işlem ile artırmalarına olanak tanıyacak. Uygulama, işlemleri imzalamak için bir cüzdan ile de bağlantı kuracaktır.

Zincir üzerinde sayaç programı ile etkileşim kurmak için **Anchor framework**'ünü kullanacağız. İstemci tarafı, daha önceki derslerimizden biri olan
[İstemci Tarafı Anchor Geliştirmeye Giriş](https://solana.com/developers/courses/onchain-development/intro-to-anchor-frontend)'de zaten geliştirilmiştir; daha fazla bağlam için kodunu kontrol edebilirsiniz.

Temel kavramları tam olarak anlayabilmeniz için, bu uygulamayı başlangıç şablonu olmadan vanilla React Native ile yazacağız. Solana Mobil, bazı genel kodlarla başa çıkacak şablonlar sunsa da, sıfırdan inşa etmek, çok daha derin bir anlayış sağlar.

### Başlarken

Başlamak için, React Native geliştirme ortamınızı düzgün bir şekilde ayarlamanız gerekecek; eğer henüz yapmadıysanız. Bu
[makale](https://reactnative.dev/docs/set-up-your-environment) size nasıl yapılacağına dair bilgi vermektedir. Eğer bir
[Framework](https://reactnative.dev/architecture/glossary#react-native-framework) kullanıyorsanız bu adım gereksizdir.

Sisteminizde [Node.js](https://nodejs.org/en/download) yüklü olduğundan emin olun. Bu, JavaScript paketlerinizi yönetecektir. Android Studio’yu yükleyin:

Android Studio, Android emülatörünü çalıştırmak ve React Native uygulamanızı Android cihazlar için derlemek için gereklidir. ANDROID_HOME Ortam Değişkenini yapılandırın:

:::tip
**NOT:** Terminalinizin Android'in SDK araçlarını tanıması için `ANDROID_HOME` ortam değişkenini yapılandırmanız gerekecektir. Bu adım, uygulamanızı Android'de çalıştırmak ve inşa etmek için kritik öneme sahiptir.
:::

## Proje Kurulumu

Emülatör kurulumunu sağlamak için bir Örnek Proje oluşturun, böylece Android ortamınızın doğru bir şekilde ayarlandığından emin olabilirsiniz. Terminalinizde, tercih ettiğiniz dizin içinde aşağıdaki kodu çalıştırarak yeni bir React Native projesi oluşturun; burada `SampleProject` sizin tercih ettiğiniz proje adıdır. Projeyi Android Studio'da açabilir ve Android emülatörde doğru bir şekilde çalıştığını kontrol edebilirsiniz.

```bash
  npx react-native init SampleProject --npm
```

### MWA'yı Klonlama ve Çalıştırma

1. `SampleProject` dizininde repo'yu klonlayın

    ```bash
    git clone https://github.com/solana-mobile/mobile-wallet-adapter.git
    ```

2. Android Studio'da, _Proje Aç > Klonlanan dizine git > mobile-wallet-adapter/android'ı seç_
3. Android Studio projenizi yükledikten sonra, sağ üstteki derleme/çalıştırma yapılandırma açılır menüsünde `fakewallet` seçin.

    ![Sahte Cüzdan](../../../images/solana/public/assets/courses/unboxed/basic-solana-mobile-fake-wallet.png)

4. Daha kolay hata ayıklama için **Logcat** kullanın. İlgileniyorsanız [Logcat kurulum kılavuzuna](https://developer.android.com/studio/debug/logcat) göz atabilirsiniz.
5. Artık sahte cüzdan emülatörde çalışıyorken, _Görünüm -> Araç Pencereleri -> Logcat_ seçin. Bu, sahte cüzdanın ne yaptığını konsolda günlüğe kaydedecektir.

6. (İsteğe bağlı) Google Play mağazasından diğer [Solana cüzdanlarını](https://play.google.com/store/search?q=solana%20wallet&c=apps) yükleyin.

Son olarak, bağımlılık hatalarını önlemek için _java sürüm 11_ yüklemenizi öneririz. Yüklediğiniz sürümü öğrenmek için terminalinizde `java --version` komutunu çalıştırın.

### 1. Uygulama Yapısının Planlanması

Herhangi bir kod yazmadan önce, uygulamanın taslağını kavramsallaştırmak faydalı olacaktır. Tekrar hatırlamak gerekir ki, bu uygulama, Devnet’e daha önce dağıttığımız sayaç programı ile bağlantı kuracak ve etkileşime girecektir. Bunu yapmak için ihtiyacımız olacak:

- Solana ile etkileşimde bulunmak için bir `Connection` nesnesi (`ConnectionProvider.tsx`)
- Sayaç programımıza erişim (`ProgramProvider.tsx`)
- Talepleri imzalamak ve göndermek için bir cüzdanın yetkilendirilmesi (`AuthProvider.tsx`)
- Sayaç değerimizi göstermek için metin (`CounterView.tsx`)
- Sayaç değerimizi artırmak için basılacak bir buton (`CounterButton.tsx`)

Daha fazla dosya ve husus olacak, ancak bu, yaratacağımız ve üzerinde çalışacağımız en önemli dosyalardır.

### 2. Uygulama Oluşturma

Temel ayarlarımızı ve yapımızı tamamladıktan sonra, aşağıdaki komut ile yeni bir uygulama oluşturacağız:

```bash
npx react-native@latest init counter --npm
```

Bu, bizim için `counter` adında yeni bir React Native projesi oluşturur.

Her şeyin doğru şekilde ayarlandığından emin olmak için varsayılan uygulamayı başlatarak Android emülatörümüzde çalıştıracağız.

```bash
cd counter
npm run android
```

Bu, uygulamayı Android emülatörünüzde açıp çalıştırmalıdır. Problemlerle karşılaşırsanız, `_Başlarken_` bölümündeki tüm adımları başarıyla tamamladığınızdan emin olun.

### 3. Bağımlılıkları Yükleme

Solana bağımlılıklarımızı içe aktarmamız gerekecek. [Solana Mobil belgeleri, ihtiyaç duyduğumuz paketlerin güzel bir listesini sağlar](https://docs.solanamobile.com/react-native/setup) ve bunları neden ihtiyaç duyduğumuz hakkında açıklamalar sunar:

- `@solana-mobile/mobile-wallet-adapter-protocol`: MWA uyumlu cüzdanlarla etkileşimi sağlayan bir React Native/Javascript API'si
- `@solana-mobile/mobile-wallet-adapter-protocol-web3js`: Yaygın temel yapı taşlarını kullanmak için [@solana/web3.js](https://github.com/solana-labs/solana-web3.js) gibi bir kolaylık sarmalayıcı, `Transaction` ve `Uint8Array` gibi
- `@solana/web3.js`: Solana ağı ile etkileşimde bulunmak için Solana Web Kütüphanesi, [JSON RPC API](https://github.com/solana-foundation/developer-content/blob/main/docs/rpc/http/index.mdx) üzerinden
- `@react-native-get-random-values`: React Native'deki `web3.js` alt yapısı için güvenli rastgele sayı üretici polyfill
- `buffer`: `web3.js` için gereken Buffer polyfill

:::tip
Ekleyeceğimiz diğer paketler:
- `@coral-xyz/anchor`: Anchor TS istemcisi.
- `assert`: Anchor'ın çalışmasını sağlayan bir polyfill.
- `text-encoding-polyfill`: `Program` nesnesini oluşturmak için gereken bir polyfill.
:::

Eğer polyfill'lerle tanışık değilseniz; polyfill’ler, Node'un çalışmadığı her alanda çalışmasını sağlamak için Node'a özgü kütüphaneler sunar. Polyfill kurulumumuzu kısa zamanda tamamlayacağız. Şimdilik, bağımlılıkları aşağıdaki komut ile yükleyin:

```bash
npm install \
  @solana/web3.js \
  @solana-mobile/mobile-wallet-adapter-protocol-web3js \
  @solana-mobile/mobile-wallet-adapter-protocol \
  react-native-get-random-values \
  buffer \
  @coral-xyz/anchor \
  assert \
  text-encoding-polyfill
```

### 4. ConnectionProvider.tsx Dosyası Oluşturma

Şimdi Solana işlevselliğimizi eklemeye başlayalım. `components` adında yeni bir klasör oluşturun ve içinde `ConnectionProvider.tsx` adında bir dosya oluşturun. Bu sağlayıcı, tüm uygulamayı saracak ve `Connection` nesnemizi her yerde kullanılabilir hale getirecek. Umarım, kullanılan deseni fark ediyorsunuzdur: bu, kurs boyunca kullandığımız React desenleriyle birebir aynı.

```tsx
import { Connection, ConnectionConfig } from "@solana/web3.js";
import React, { ReactNode, createContext, useContext, useMemo } from "react";

export interface ConnectionProviderProps {
  children: ReactNode;
  endpoint: string;
  config?: ConnectionConfig;
}

export interface ConnectionContextState {
  connection: Connection;
}

const ConnectionContext = createContext<ConnectionContextState>(
  {} as ConnectionContextState,
);

export function ConnectionProvider({
  children,
  endpoint,
  config = { commitment: "confirmed" },
}: ConnectionProviderProps) {
  const connection = useMemo(
    () => new Connection(endpoint, config),
    [config, endpoint],
  );

  return (
    <ConnectionContext.Provider value={{ connection }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export const useConnection = (): ConnectionContextState =>
  useContext(ConnectionContext);
```

### 5. AuthProvider.tsx Dosyası Oluşturma

Bir sonraki Solana sağlayıcımız **auth provider** olacak. Bu, mobil ve web geliştirme arasındaki ana farklılıklardan biridir. Burada gerçekleştirdiğimiz şey, web uygulamalarında alışık olduğumuz `WalletProvider`'a kabaca eşdeğerdir. Ancak, Android ve yerel olarak yüklü cüzdanları kullanıyor olduğumuz için, bunlarla bağlanmak ve kullanmak için akış biraz farklıdır. En önemlisi, MWA protokolüne uymamız gerekiyor.

Bunu `AuthProvider`'ımızda aşağıdakileri sağlayarak yapıyoruz:

- `accounts`: Eğer kullanıcıda birden fazla cüzdan varsa, farklı hesaplar bu hesaplar dizisinde tutulur.
- `selectedAccount`: İşlem için mevcut seçili hesap.
- `authorizeSession(wallet)`: Kullanıcı için cüzdanı yetkilendirir (veya token süresi dolarsa yeniden yetkilendirir) ve oturum için seçili hesap olarak kullanılacak bir hesap döndürür. `wallet` değişkeni, cüzdanla etkileşime geçmek istediğiniz her yerde bağımsız olarak çağırdığınız `transact` fonksiyonunun geri çağrısından gelir.
- `deauthorizeSession(wallet)`: Cüzdanı yetkisiz hale getirir.
- `onChangeAccount`: `selectedAccount` değiştiğinde bir işleyici olarak çalışır.

:::info
Ayrıca bazı yardımcı yöntemler de ekleyeceğiz:
- `getPublicKeyFromAddress(base64Address)`: Verilen Base64 adresinden yeni bir Public Key nesnesi oluşturur.
- `getAuthorizationFromAuthResult`: Yetkilendirme sonucunu işleyerek ilgili verileri çıkarır ve `Authorization` bağlam nesnesini döndürür.
:::

Bunların tamamını `useAuthorization` kancası aracılığıyla sunacağız.

Bu sağlayıcının tüm uygulamalarda aynı olduğunu düşünerek, kopyalayıp yapıştırabileceğiniz tam uygulamayı vereceğiz. MWA detaylarına gelecekteki bir derste gireceğiz.

`components` klasöründe `AuthProvider.tsx` dosyasını oluşturun ve aşağıdakileri yapıştırın:

```tsx
import { Cluster, PublicKey } from "@solana/web3.js";
import {
  Account as AuthorizedAccount,
  AuthorizationResult,
  AuthorizeAPI,
  AuthToken,
  Base64EncodedAddress,
  DeauthorizeAPI,
  ReauthorizeAPI,
} from "@solana-mobile/mobile-wallet-adapter-protocol";
import { toUint8Array } from "js-base64";
import { useState, useCallback, useMemo, ReactNode } from "react";
import React from "react";

const AuthUtils = {
  getAuthorizationFromAuthResult: (
    authResult: AuthorizationResult,
    previousAccount?: Account,
  ): Authorization => {
    const selectedAccount =
      previousAccount === undefined ||
      !authResult.accounts.some(
        ({ address }) => address === previousAccount.address,
      )
        ? AuthUtils.getAccountFromAuthorizedAccount(authResult.accounts[0])
        : previousAccount;

    return {
      accounts: authResult.accounts.map(
        AuthUtils.getAccountFromAuthorizedAccount,
      ),
      authToken: authResult.auth_token,
      selectedAccount,
    };
  },

  getAccountFromAuthorizedAccount: (
    authAccount: AuthorizedAccount,
  ): Account => ({
    ...authAccount,
    publicKey: new PublicKey(toUint8Array(authAccount.address)),
  }),
};

type Account = Readonly<{
  address: Base64EncodedAddress;
  label?: string;
  publicKey: PublicKey;
}>;

type Authorization = Readonly<{
  accounts: Account[];
  authToken: AuthToken;
  selectedAccount: Account;
}>;

const APP_IDENTITY = {
  name: "Solana Counter Incrementor",
};

type AuthorizationProviderContext = {
  accounts: Account[] | null;
  authorizeSession: (wallet: AuthorizeAPI & ReauthorizeAPI) => Promise<Account>;
  deauthorizeSession: (wallet: DeauthorizeAPI) => void;
  onChangeAccount: (nextSelectedAccount: Account) => void;
  selectedAccount: Account | null;
};

const AuthorizationContext = React.createContext<AuthorizationProviderContext>({
  accounts: null,
  authorizeSession: () => {
    throw new Error("Provider not initialized");
  },
  deauthorizeSession: () => {
    throw new Error("Provider not initialized");
  },
  onChangeAccount: () => {
    throw new Error("Provider not initialized");
  },
  selectedAccount: null,
});

type AuthProviderProps = {
  children: ReactNode;
  cluster: Cluster;
};

function AuthorizationProvider({ children, cluster }: AuthProviderProps) {
  const [authorization, setAuthorization] = useState<Authorization | null>(
    null,
  );

  const handleAuthorizationResult = useCallback(
    async (authResult: AuthorizationResult): Promise<Authorization> => {
      const nextAuthorization = AuthUtils.getAuthorizationFromAuthResult(
        authResult,
        authorization?.selectedAccount,
      );
      setAuthorization(nextAuthorization);
      return nextAuthorization;
    },
    [authorization],
  );

  const authorizeSession = useCallback(
    async (wallet: AuthorizeAPI & ReauthorizeAPI) => {
      const authorizationResult = authorization
        ? await wallet.reauthorize({
            auth_token: authorization.authToken,
            identity: APP_IDENTITY,
          })
        : await wallet.authorize({ cluster, identity: APP_IDENTITY });
      return (await handleAuthorizationResult(authorizationResult))
        .selectedAccount;
    },
    [authorization, cluster, handleAuthorizationResult],
  );

  const deauthorizeSession = useCallback(
    async (wallet: DeauthorizeAPI) => {
      if (authorization?.authToken) {
        await wallet.deauthorize({ auth_token: authorization.authToken });
        setAuthorization(null);
      }
    },
    [authorization],
  );

  const onChangeAccount = useCallback((nextAccount: Account) => {
    setAuthorization(currentAuthorization => {
      if (
        currentAuthorization?.accounts.some(
          ({ address }) => address === nextAccount.address,
        )
      ) {
        return { ...currentAuthorization, selectedAccount: nextAccount };
      }
      throw new Error(`${nextAccount.address} is no longer authorized`);
    });
  }, []);

  const value = useMemo(
    () => ({
      accounts: authorization?.accounts ?? null,
      authorizeSession,
      deauthorizeSession,
      onChangeAccount,
      selectedAccount: authorization?.selectedAccount ?? null,
    }),
    [authorization, authorizeSession, deauthorizeSession, onChangeAccount],
  );

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  );
}

const useAuthorization = () => React.useContext(AuthorizationContext);

export {
  AuthorizationProvider,
  useAuthorization,
  type Account,
  type AuthProviderProps,
  type AuthorizationProviderContext,
};
```

### 6. ProgramProvider.tsx Dosyası Oluşturma

Son ihtiyaç duyduğumuz sağlayıcı program sağlayıcımızdır. Bu, etkileşimde bulunmak istediğimiz sayaç programını sunacaktır.

:::note
Anchor TS istemcisini programımızla etkileşimde bulunmak için kullanacağız, bu yüzden programın IDL'sine ihtiyacımız var.
:::

Öncelikle `models` adında bir kök klasör oluşturun, ardından `anchor-counter.ts` adında yeni bir dosya oluşturun. Anchor Counter IDL'sinin içeriğini bu yeni dosyaya yapıştırın.

Ardından, bileşenlerin içinde `ProgramProvider.tsx` dosyasını oluşturun. İçine program sağlayıcımızı oluşturacağız:

```tsx
import {
  AnchorProvider,
  IdlAccounts,
  Program,
  setProvider,
} from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { AnchorCounter, IDL } from "../models/anchor-counter";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useConnection } from "./ConnectionProvider";

export type CounterAccount = IdlAccounts<AnchorCounter>["counter"];

export type ProgramContextType = {
  program: Program<AnchorCounter> | null;
  counterAddress: PublicKey | null;
};

export const ProgramContext = createContext<ProgramContextType>({
  program: null,
  counterAddress: null,
});

export type ProgramProviderProps = {
  children: ReactNode;
};

export function ProgramProvider({ children }: ProgramProviderProps) {
  const { connection } = useConnection();
  const [program, setProgram] = useState<Program<AnchorCounter> | null>(null);
  const [counterAddress, setCounterAddress] = useState<PublicKey | null>(null);

  const setup = useCallback(async () => {
    const programId = new PublicKey(
      "ALeaCzuJpZpoCgTxMjJbNjREVqSwuvYFRZUfc151AKHU",
    );

    // MockWallet, AnchorProvider'ı başlatmak için kullanılan bir yer tutucu cüzdandır.
    // Mobil bir uygulamada, burada gerçek bir cüzdana ihtiyacımız yok çünkü gerçek imzalama
    // kullanıcıların mobil cüzdan uygulamasıyla yapılacaktır. Bu sahte cüzdan, sağlayıcıyı
    // gerçek bir cüzdan örneği olmadan kurmamıza olanak sağlar.

    const MockWallet = {
      signTransaction: () => Promise.reject(),
      signAllTransactions: () => Promise.reject(),
      publicKey: Keypair.generate().publicKey,
    };

    const provider = new AnchorProvider(connection, MockWallet, {});
    setProvider(provider);

    const programInstance = new Program<AnchorCounter>(
      IDL,
      programId,
      provider,
    );

    const [counterProgramAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("counter")],
      programId,
    );

    setProgram(programInstance);
    setCounterAddress(counterProgramAddress);
  }, [connection]);

  useEffect(() => {
    setup();
  }, [setup]);

  const value: ProgramContextType = useMemo(
    () => ({
      program,
      counterAddress,
    }),
    [program, counterAddress],
  );

  return (
    <ProgramContext.Provider value={value}>{children}</ProgramContext.Provider>
  );
}

export const useProgram = () => useContext(ProgramContext);
```

### 7. App.tsx Dosyasını Düzenleme

Artık tüm sağlayıcılarımızın olduğunu göre, uygulamamızı onlarla sarmalayalım. Varsayılan `App.tsx`'yi aşağıdaki değişikliklerle yeniden yazacağız:

- Sağlayıcılarımızı içe aktarın ve polyfill'leri ekleyin.
- Uygulamayı önce `ConnectionProvider`, sonraki `AuthorizationProvider`, ve son olarak `ProgramProvider` ile sarın.
- `ConnectionProvider`'a Devnet uç noktamızı geçin.
- `AuthorizationProvider`'a küme bilgimizi geçin.
- Varsayılan dahili `` ile ``'i değiştirin; bu ekranı bir sonraki adımda oluşturacağız.

```tsx
// Polyfill'ler en üstte
import "text-encoding-polyfill";
import "react-native-get-random-values";
import { Buffer } from "buffer";
global.Buffer = Buffer;

import { clusterApiUrl } from "@solana/web3.js";
import { ConnectionProvider } from "./components/ConnectionProvider";
import { AuthorizationProvider } from "./components/AuthProvider";
import { ProgramProvider } from "./components/ProgramProvider";
import { MainScreen } from "./screens/MainScreen"; // Bunu yapacağız
import React from "react";

export default function App() {
  const cluster = "devnet";
  const endpoint = clusterApiUrl(cluster);

  return (
    // ConnectionProvider: Solana ağına bağlantıyı yönetir
    <ConnectionProvider
      endpoint={endpoint}
      config={{ commitment: "processed" }}
    >
      // AuthorizationProvider: Cüzdan yetkilendirmesini yönetir
      <AuthorizationProvider cluster={cluster}>
        // ProgramProvider: Solana programına erişim sağlar
        <ProgramProvider>
          <MainScreen />
        </ProgramProvider>
      </AuthorizationProvider>
    </ConnectionProvider>
  );
}
```

### 8. MainScreen.tsx Dosyasını Oluşturma

Şimdi, her şeyi bir araya getirip UI'mizi oluşturalım. `screens` adında yeni bir klasör oluşturun ve içinde `MainScreen.tsx` adında yeni bir dosya oluşturun. Bu dosyada, henüz oluşturulmamış iki bileşeni göstermek için ekranı yapılandırıyoruz: `CounterView` ve `CounterButton`.

Ayrıca, bu dosyada React Native'in `StyleSheet`'ini tanıtıyoruz. Bu, sıradan React'ten bir başka fark. Endişelenmeyin, CSS'e çok benzeyen bir şekilde davranır.

`screens/MainScreen.tsx` dosyasına aşağıdakileri yapıştırın:

```tsx
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { CounterView } from "../components/CounterView";
import { CounterButton } from "../components/CounterButton";

export function MainScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="darkblue" />
      <View style={[styles.container, styles.counterContainer]}>
        <CounterView />
      </View>
      <View style={styles.incrementButtonContainer}>
        <CounterButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "lightgray",
  },
  incrementButtonContainer: {
    position: "absolute",
    right: "5%",
    bottom: "3%",
  },
  counterContainer: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});
```

### 9. CounterView.tsx Dosyasını Oluşturma

`CounterView`, iki program-a özgü dosyamızdan birincisidir. `CounterView`'in tek görevi, `Counter` hesabımızı almak ve güncellemeleri dinlemektir. Sadece dinleme yaptığı için, MWA ile ilgili bir işlem yapmamıza gerek yoktur. Görünüş olarak bir web uygulamasına tamamen benzemelidir. `ProgramProvider.tsx`'de belirlenen `programAddress` için dinlemek amacıyla `Connection` nesnemizi kullanacağız. Hesap değiştirildiğinde, UI'mizi güncelliyoruz.

`components/CounterView.tsx` dosyasına aşağıdakileri yapıştırın:

```tsx
import { View, Text, StyleSheet } from "react-native";
import { useConnection } from "./ConnectionProvider";
import { useProgram, CounterAccount } from "./ProgramProvider";
import { useEffect, useState } from "react";
import { AccountInfo } from "@solana/web3.js";
import React from "react";

const counterStyle = StyleSheet.create({
  counter: {
    fontSize: 48,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
});

export function CounterView() {
  const { connection } = useConnection();
  const { program, counterAddress } = useProgram();
  const [counter, setCounter] = useState<CounterAccount>();

  // Sayaç Bilgilerini Al
  useEffect(() => {
    if (!program || !counterAddress) return;

    program.account.counter.fetch(counterAddress).then(setCounter);

    const subscriptionId = connection.onAccountChange(
      counterAddress,
      (accountInfo: AccountInfo<Buffer>) => {
        try {
          const data = program.coder.accounts.decode(
            "counter",
            accountInfo.data,
          );
          setCounter(data);
        } catch (e) {
          console.log("hesap çözümleme hatası: " + e);
        }
      },
    );

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [program, counterAddress, connection]);

  if (!counter) return <Text>Yükleniyor...</Text>;

  return (
    <View>
      <Text>Mevcut sayaç</Text>
      <Text style={counterStyle.counter}>{counter.count.toString()}</Text>
    </View>
  );
}

### 10. CounterButton.tsx Dosyasını Oluşturun

Son olarak, son bileşenimiz `CounterButton`. Bu yüzer eylem düğmesi, yeni bir `incrementCounter` işlevinde aşağıdakileri gerçekleştirecektir:

- Bir mobil cüzdana erişim almak için `transact` çağrısı yapın
- `useAuthorization` kancası aracılığıyla oturumu `authorizeSession` ile yetkilendirin
- Yeterli Devnet SOL yoksa işlemi finanse etmek için bir Devnet airdrop isteyin
- Bir `increment` işlemi oluşturun
- Cüzdanın işlemi imzalayıp göndermesi için `signAndSendTransactions` çağrısını yapın

:::note
Kullandığımız sahte Solana cüzdanı, sahte cüzdan uygulamasını her yeniden başlattığınızda yeni bir anahtar çifti üretir, bu nedenle her seferinde fonda kontrol etmek ve airdrop almak gerekir. Bu yalnızca demo amaçlıdır, gerçek ortamda bunu yapamazsınız.
:::

`CounterButton.tsx` dosyasını oluşturun ve aşağıdakileri yapıştırın:

```tsx
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
} from "react-native";
import { useAuthorization } from "./AuthProvider";
import { useProgram } from "./ProgramProvider";
import { useConnection } from "./ConnectionProvider";
import {
  transact,
  Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { useState } from "react";
import React from "react";

const floatingActionButtonStyle = StyleSheet.create({
  container: {
    height: 64,
    width: 64,
    alignItems: "center",
    borderRadius: 40,
    justifyContent: "center",
    elevation: 4,
    marginBottom: 4,
    backgroundColor: "blue",
  },

  text: {
    fontSize: 24,
    color: "white",
  },
});

export function CounterButton() {
  const { authorizeSession } = useAuthorization();

  const { program, counterAddress } = useProgram();  
  const { connection } = useConnection();
  const [isTransactionInProgress, setIsTransactionInProgress] = useState(false);

  const showToastOrAlert = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const incrementCounter = () => {
    if (!program || !counterAddress) return;

    if (!isTransactionInProgress) {
      setIsTransactionInProgress(true);

      transact(async (wallet: Web3MobileWallet) => {
        const authResult = await authorizeSession(wallet);
        const latestBlockhashResult = await connection.getLatestBlockhash();

        const ix = await program.methods
          .increment()
          .accounts({ counter: counterAddress, user: authResult.publicKey })
          .instruction();

        const balance = await connection.getBalance(authResult.publicKey);

        console.log(
          `Cüzdan ${authResult.publicKey} bakiyesi: ${balance}`,
        );

        // Devnet'te, airdrop oran sınırı nedeniyle her oturum için SOL'u manuel olarak transfer etmek isteyebilirsiniz
        const minBalance = LAMPORTS_PER_SOL / 1000;

        if (balance  {
          console.log(e);
          showToastOrAlert(`Hata: ${JSON.stringify(e)}`);
        })
        .finally(() => {
          setIsTransactionInProgress(false);
        });
    }
  };

  return (
    <>
      
        +
      
    
  );
}
```

### 11. Oluştur ve Çalıştır

Artık her şeyin çalıştığını test etme zamanı! Aşağıdaki komutla oluşturun ve çalıştırın:

```bash
npm run android
```

Bu, uygulamanızı emülatörde açacaktır; sağ alt köşedeki + düğmesine tıklayın. Bu, "sahte cüzdanı" açacaktır. **"Sahte cüzdan"** hata ayıklamaya yardımcı olmak için çeşitli seçenekler sunar. Aşağıdaki resim, uygulamanızı doğru bir şekilde test etmek için tıklamanız gereken düğmeleri belirtmektedir:

![Counter App](../../../images/solana/public/assets/courses/unboxed/basic-solana-mobile-counter-app.png)

Eğer sorunlarla karşılaşırsanız, bunların neler olabileceği ve nasıl düzeltileceğine dair bazı örnekler:

- Uygulama derlenmiyor → Metro'yu _Ctrl+C_ ile kapatın ve tekrar deneyin
- `CounterButton` düğmesine bastığınızda hiçbir şey olmuyor → Solana cüzdanının yüklü olduğundan emin olun (örneğin Prerequisites bölümünde yüklediğimiz sahte cüzdan gibi)
- `increment` çağrısında sonsuz döngüye sıkışıyorsunuz → Bu muhtemelen bir Devnet airdrop oran sınırına ulaştığınız içindir. `CounterButton` içindeki airdrop bölümünü kaldırın ve cüzdan adresinize (konsolda yazdırılan) manuel olarak bazı Devnet SOL gönderin

Hepsi bu! İlk **Solana Mobil** uygulamanızı yaptınız. Eğer takılırsanız,

> [full solution code](https://github.com/solana-developers/react-native-counter)  
> — depo 'main' dalında mevcut olan çözüm kodunu kontrol edebilirsiniz.

## Meydan Okuma

Bir sonraki meydan okumanız, uygulamayı genişletmek ve `decrement` işlevini eklemektir. Solana programında `decrement` metodunu çağıracak başka bir düğme oluşturmanız gerekiyor. Decrement işlevine ait mantık zaten programın **IDL** (**Arayüz Tanım Dili**) içerisinde mevcut, bu yüzden göreviniz onunla etkileşime geçen istemci tarafı kodunu yazmaktır.

Bunu tamamladığınızda, çözümünüzü mevcut olan çözüm koduyla karşılaştırabilirsiniz

> [solution branch](https://github.com/solana-developers/react-native-counter)  
> — çözüm kodunuz ile karşılaştırın.

:::success
**Tebrikler!**  
Laboratuvarı başarıyla tamamladıysanız, kodunuzu GitHub'a yükleyin ve bu dersle ilgili geri bildirimlerinizi şu [form](https://form.typeform.com/to/IPH0UGz7#answers-lesson=c15928ce-8302-4437-9b1b-9aa1d65af864) aracılığıyla paylaşın.
:::