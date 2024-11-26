---
date: 22 Mar 2024
difficulty: intro
title: "Solana'da web ve Anchor projenizi inşa etmek"
seoTitle: "Web ve Anchor Projesini İnşa Et"
description:
  "Hackathonlar için oldukça faydalı olan, React/NextJS ve Anchor kullanarak projeleri inşa etme hızlı başlangıç kılavuzu!"
tags:
  - hızlı başlangıç
  - inşa et
  - oluştur
  - nextjs
  - reactjs
  - anchor
  - web
keywords:
  - hızlı başlangıç
  - inşa et
  - oluştur
  - iskelet
  - anchor
  - nextjs
  - reactjs
  - solana reactjs
  - solana nextjs
  - hackathon başlangıcı
---

Eğer Solana üzerinde bir şey inşa etme fikriniz varsa veya bir Solana hackathonuna katılmak istiyorsanız, bu iskelet kılavuzu önemli unsurlarla birlikte bir iskelet kod tabanı oluşturmanıza yardımcı olabilir; Solana cüzdan adaptörü, web3.js ve Anchor gibi, zaman ve kaynak tasarrufu sağlamanın yanı sıra, **daha ileri geliştirme için mükemmel bir temel sağlar**.

Bu kılavuzun dört bölümü var:

1. Gereksinimler
2. İskelet Oluşturma
3. İskeletlerle Pratik Deneyim
4. Bonus Solana Araçları

## 1. Gereksinimler

### NodeJS ve npm

Node (JavaScript çalıştırıcısı), npm (paket yöneticisi) ve npx (node paket yürütücüsü) elde etmek için [NodeJS'i yükleyin](https://nodejs.org/en/download).

### Kod Düzenleyici

[VSCode yüklemenizi](https://code.visualstudio.com/#alt-downloads) öneriyoruz, ancak tercih ettiğiniz düzenleyiciyi de kullanabilirsiniz.

### Solana Geliştirme Ortamı

Eğer daha önce Solana CLI, Rust veya Anchor yüklemediyseniz, [faydalı yükleme kılavuzumuzu takip ederek](https://solana.com/docs/intro/installation) bunu kolayca yapabilirsiniz.

> **Not**: Bu iskelet şu an yalnızca TypeScript’i destekliyor, ama endişelenmeyin, TypeScript yalnızca bilginiz olan JavaScript üzerine yararlı tür tanımlamaları ekleyen bir genişletmedir.

## 2. İskelet Oluşturma

Boilerplate'yi oluşturmak için şu komutu çalıştırın:

```bash
npx create-solana-dapp@latest
```

### Proje Adı

Boilerplate'yi oluşturmak için komutu çalıştırın: Projenizi oluşturmak istediğiniz kök klasörde bunu yapmanızı öneririm. Öncelikle **muhteşem proje adınızı** girmeniz istenecek. Şu an hello_solana kullanıyorum.

```
┌  create-solana-dapp 2.0.1
│
◆  Proje adını girin
│  - hello_solana
└
```

### Web Ön Yüzü

Sonra, kullanacağınız bir ön ayar istenecektir; bu Next.js veya React + React Router DOM olabilir.

Bu belgede Next.js kullanılıyor çünkü Next.js dosya tabanlı yönlendirme ve uygulama yönlendirmesi sunarken, isterseniz React + React Router DOM'u da kullanabilirsiniz.

```
◆  Bir ön ayar seçin
│  ● Next.js
│  ○ React + React Router DOM
```

### UI Kütüphanesi

Bir framework seçtikten sonra, bir stil kütüphanesi seçmeniz istenecek.

```
◆  Bir UI kütüphanesi seçin
│  ○ Yok
│  ● Tailwind
└
```

Burada Tailwind CSS ve Daisy UI kullanıyoruz, ama tercih ettiğiniz bir kütüphane varsa 'yok' seçeneğini de seçebilirsiniz.

### Anchor Şablonu

Sonra, bu iskelet CLI sizden hangi anchor şablonunu kullanmak istediğinizi sorar. Anchor, on-chain Solana programları yazmak için bir framework’tür.

```
◆  Bir Anchor şablonu seçin
│  ○ sayaç
│  ● hello-world
│  ○ yok
└
```

İskeletin yüklenirken bir şeyler atıştırmak için biraz patlamış mısır yapın - bu işlem yaklaşık 3 dakika sürmelidir.

```
◓  npm ile yeni çalışma alanı oluşturuluyor...
```

İşlem tamamlandığında, projenizin dizinine geçin:

```
◇  Başarılı bir şekilde @solana-developers/preset-next@2.0.1 ön ayarını yüklediniz.
│
└  Başlamak için `cd ./hello_solana-app` komutunu çalıştırın.
```

`pwd` yazarak yolunuzun doğru olup olmadığını kontrol edin, ardından `code .` yazarak VSCode'u iskeletlenmiş projede açın.

İskeletinizde, istediğiniz her zaman çalıştırabilmeniz için beş script sizi bekliyor. Tüm mevcut scriptleri görmek için `npm run` yazın.

```
@counter-app/source@0.0.0 içindeki mevcut scriptler `npm run-script` ile:
  anchor
    nx run anchor:anchor
  anchor-build
    nx run anchor:anchor build
  anchor-localnet
    nx run anchor:anchor localnet
  anchor-test
    nx run anchor:anchor test
  build
    nx build web
  dev
    nx serve web
```

Bu scriptlerden herhangi birini çalıştırmak için `npm run ` yazın; örneğin, `npm run dev` ile web sitenizin geliştirme sunucusunu başlatabilirsiniz veya `npm run anchor-test` ile iskeletlenmiş Solana programınızdaki testleri çalıştırabilirsiniz.

## 3. İskeletlerle Pratik Deneyim

### Anchor Programı

Başlamadan önce, yaptığınız değişiklikleri takip etmek için projenizi `git init` ile başlatın. İşte projemizin kökünde görünecek klasör yapımız:

```
    hello_solana
    |
    ├── anchor
    │   ├── migrations
    │   ├── programs
    |   |   └── hello_world
    │   └── tests
    ├── web
    │   ├── app
    │   ├── components
        └── public
```

`anchor > programs > hello-world > src > lib.rs` içine girerek **talimatlarımızı yazmaya başlayabiliriz**.

Bu programı inşa etmek için `npm run anchor-build` komutunu çalıştırın. Anchor projeniz inşa edilecek ve hedef klasörde bir IDL oluşturulacaktır. **IDL**, programınızdaki talimat yöneticisini ve argümanlarını tanımlayan bir spesifikasyondur. `hello_world.json` dosyanızdan metadata içindeki adresi kopyalayın ve Anchor programınızın `lib.rs` dosyasındaki `program_id` bölümüne yapıştırın.

Artık Anchor testlerini çalıştırabilir ve programınızın başarılı bir şekilde çalışıp çalışmadığını kontrol edebilirsiniz.

![Anchor Hello World Code Screenshot](../../../images/solana/public/assets/guides/scaffolds/scaffolds---1-anchor-view.png)

```
    hello_solana
    |
    ├── anchor
    │   ├── migrations
    │   ├── programs
		|   |   └── hello_world
    │   └── tests
		|   |   └── hello-world.spec.ts
    │   └── target
    │        └── idl
    │            └── hello_world.json
```

hello_world talimatını test etmek için `npm run anchor-test` komutunu çalıştırın.

```
 PASS   anchor  tests/hello-world.spec.ts
  hello-world
    ✓ Başlatıldı! (686 ms)

Test Kutuları: 1 geçerli, 1 toplam
Testler:       1 geçerli, 1 toplam
Snapshotlar:   0 toplam
Zaman:        1.207 s
Tüm test kutuları çalıştırıldı.

 ————————————————————————————————————————————————————————————————
 >  NX   anchor projesi için hedef jest başarıyla çalıştı (3s)
```

### NextJS Uygulaması

![NextJS Starter view](../../../images/solana/public/assets/guides/scaffolds/scaffolds---1-anchor-view.png)

NextJS İskeletimiz, sürüm 13'te tanıtılan App Router'ı kullanıyor ve bu, paylaşılan düzenler, iç içe yönlendirme, yükleme durumları ve hata işleme desteği sunuyor.

```
    hello_solana
    |
    ├── anchor
    ├── web
    │   ├── app
    │   │   └── layout.tsx
    │   ├── components
    │       └── solana
		|          └── solana-provider.tsx
    │       ├── ui
                └── ui-layout.tsx
```

`solana-provider.tsx` cüzdan özelliklerinin tamamını barındırır; **Solana cüzdanının otomatik olarak bağlanmasını** kolayca halleder ve cüzdan durumlarının yönetildiği web uygulamanızın birçok bileşenine geçiş yapabilirsiniz. Bu NextJS uygulaması, web uygulamalarınızda sunucu durumunu kolayca almak, önbelleğe almak, senkronize etmek ve güncellemek için `[@tanstack/react-query](https://tanstack.com/query/latest)` kullanıyor. React-Query burada, cüzdanınızın bakiyesini almak için `useGetBalance`, SOL transferi yapmak için `useTransferSol` gibi tüm veri alma ihtiyaçlarınız için kullanılmaktadır. Benzer şekilde, RPC'lerden almak istediğiniz özellikleri uygulayabilirsiniz. React-query'nin, **Hesap navigasyonunda** burada kullanıldığını görebilirsiniz.

![NextJS web Accounts view](../../../images/solana/public/assets/guides/scaffolds/scaffolds---3-web-accounts-view.png)

Bu uygulama ayrıca, NextJS uygulamanızda **global React durum yönetimi için** kullanılan `Jotai`'yi de içeriyor. Bileşenimiz, küme ve RPC bilgilerini depolar; bu bilgileri uygulamanızın herhangi bir yerinde alabilir ve işlemin hangi yerde gönderilmesi gerektiğini yönetebilirsiniz.

![NextJS web Clusters view](../../../images/solana/public/assets/guides/scaffolds/scaffolds---4-web-cluster-view.png)

`anchor build` işleminden sonra, `target` klasöründen oluşturduğunuz IDL dosyanızı ve/veya Türlerinizi kopyalayın ve bileşenler içinde talimatları çağırmak için kullanmak üzere içe aktarın.

## 4. Bonus Solana Araçları

Bu sadece Solana topluluğu tarafından oluşturulan daha fazla aracı kullanmak istiyorsanız bir bonus bölümü. Ancak, bunların **denetlenmediğinden ve/veya bakımının yapılmadığından emin olun**. [Solana Araçları Kütüphanesine Göz Atın](https://github.com/solana-developers/solana-tools)

Solana Geliştiricileri tarafından sağlanan yardımcılar, testnet devnet için airdrop almanıza yardımcı olabilecek yardımcı fonksiyonlar içerir; **Solana'nın hata mesajlarını daha okunabilir hale** getirir ve [daha fazlasını](https://github.com/solana-developers/helpers?tab=readme-ov-file#what-can-i-do-with-this-module) sunar.

[Portal Ödemeleri tarafından Solana Cüzdan İsimleri](https://github.com/portalpayments/solana-wallet-names), Solana cüzdan isimlerini `.sol`, `.backpack`, `.abc` vb. gibi kullanmanıza yardımcı olabilir.

[Amman (Metaplex tarafından)](https://github.com/metaplex-foundation/amman), yerel bir doğrulayıcıda Solana SDK kütüphanelerini ve uygulamalarını test etmenize yardımcı olmak için bir dizi araçtır.

[Solita (Metaplex tarafından)](https://github.com/metaplex-foundation/solita), **Solana Rust programlarınız için Anchor veya Shank tarafından çıkarılan IDL'den düşük düzeyde bir TypeScript SDK oluşturur.**

---

Tebrikler! Nihayet projenizi istediğiniz şekilde hayata geçirme aşamasına geldiniz. Harika şeyler yaratmanızı görmek için sabırsızlanıyoruz! **Solana'da inşa ederken eğlenin.**