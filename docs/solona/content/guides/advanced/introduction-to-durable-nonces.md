---
date: 2024-06-29T00:00:00Z
difficulty: advanced
title: "Dayanıklı & Çevrimdışı İşlem İmzalamak için Nonceler"
description:
  "Solana'nın Dayanıklı Nonceleri için tek durak: Solana dapp'lerinizi
  çalıştırmanın kolay bir yolu"
tags:
  - cli
  - web3js
keywords:
  - eğitim
  - dayanıklı nonceler
  - çevrimdışı imzalama
  - işlemler
  - solana geliştirmeye giriş
  - blok zinciri geliştiricisi
  - blok zinciri eğitimi
  - web3 geliştiricisi
altRoutes:
  - /developers/guides/introduction-to-durable-nonces
---

Bu kılavuz, Solana'nın Dayanıklı Nonceleri için tek durak olmayı amaçlamaktadır: Solana dapp'lerinizi güçlendirmek ve kullanıcı deneyimini daha güvenilir ve belirleyici hale getirmek için oldukça az kullanılmış ve takdir edilmeyen bir yol.

> Bu kılavuzun koduna
> [bu depo](https://github.com/0xproflupin/solana-durable-nonces)'da ulaşabilirsiniz ve
> örnekleri yerel olarak çalıştırarak Dayanıklı Nonceleri daha iyi anlamak
> için takip etmeniz önerilir.

## Dayanıklı Nonce Uygulamaları

Dayanıklı Noncelere derinlemesine dalmadan önce, dayanıklı noncelerin gelecekte herhangi bir zamanda gönderilebilecek bir işlemi oluşturma ve imzalama fırsatı sunduğunu ve çok daha fazlasını anlamak önemlidir. Bu, aksi takdirde mümkün olmayan veya uygulanması çok zor olan geniş bir kullanım yelpazesini açar:

1. **Planlı İşlemler**: Dayanıklı Noncelerin en belirgin uygulamalarından biri, işlemleri planlama yeteneğidir. Kullanıcılar bir işlemi önceden imzalayabilir ve daha sonra daha sonraki bir tarihte göndererek planlı transferler, sözleşme etkileşimleri veya önceden belirlenmiş yatırım stratejilerini gerçekleştirebilirler.

:::info
**Not**: Planlı işlemler, özellikle yatırım stratejileri için büyük kolaylık sağlar.
:::

2. **Çok İmzalı Cüzdanlar**: Dayanıklı Nonceler, bir tarafın bir işlemi imzalayıp diğerlerinin daha sonra onaylayabileceği çok imzalı cüzdanlar için oldukça faydalıdır. Bu özellik, güvenilmez bir sistem içinde bir işlemin önerilmesini, gözden geçirilmesini ve daha sonra gerçekleştirilmesini sağlar.

3. **Gelecek Etkileşim Gerektiren Programlar**: Solana'daki bir program gelecekte etkileşim gerektiriyorsa (örneğin, bir vesting sözleşmesi veya fonların zamanlı bir salınımı), bir işlem bir Dayanıklı Nonce kullanılarak önceden imzalanabilir. Bu, sözleşme etkileşiminin doğru zamanda gerçekleşmesini sağlar ve işlem yaratıcısının bulunmasını zorunlu kılmaz.

4. **Karma Zincir Etkileşimleri**: Başka bir blok zinciriyle etkileşime geçmeniz gerektiğinde ve onaylar için beklemeniz gerekiyorsa, işlemi Dayanıklı Nonce ile imzalayabilir ve ardından gerekli onaylar alındığında yürütme gerçekleştirebilirsiniz.

:::note
**İlginç bilgi**: Karma zincir etkileşimleri, blok zinciri ekosisteminde önemli bir rol oynamaktadır.
:::

5. **Merkeziyetsiz Türev Platformları**: Merkeziyetsiz bir türev platformunda, karmaşık işlemlerin belirli tetikleyicilere göre yürütülmesi gerekebilir. Dayanıklı Nonceler ile bu işlemler önceden imzalanabilir ve tetikleyici koşulu karşılandığında gerçekleştirilebilir.

## Dayanıklı Noncelere Giriş

### İkili Harcama

MagicEden veya Tensor'dan bir NFT satın aldığınızı hayal edin. Pazar yerinin programının cüzdanınızdan biraz SOL çıkarmasına izin veren bir işlemi imzalamanız gerekiyor.

Onların imzanızı tekrar SOL çıkarmak için yeniden kullanmasını ne engelliyor? İşlemin daha önce bir kez gönderilip gönderilmediğini kontrol etmenin bir yolu olmadan, imzalı işlemi göndermeye devam edebilirler. 

> **Temel Bilgi**: Bu, İkili Harcama problemi olarak bilinir ve blok zincirleri gibi Solana'nın çözdüğü temel sorunlardan biridir. 

Naif bir çözüm, geçmişte yapılan tüm işlemleri karşılaştırmak ve imzayı orada bulup bulamayacağımızı kontrol etmek olabilir. Bu praktikte mümkün değildir, çünkü Solana defterinin boyutu >80 TB'dir.

### Son Blok Hashleri

Çözüm: Sadece belli bir dönem içerisindeki imzaları kontrol etmek ve işlem "çok" yaşlıysa iptal etmek.

Bu, Son Blok Hashleri kullanılarak elde edilir. Bir blok hash'i 32 byte'lık bir SHA-256 hash'idir. Bir istemcinin defteri en son ne zaman gözlemlediğini belirtmek için kullanılır. Son blok hash'leri kullanılarak, işlemler son 150 blokta kontrol edilir. Eğer bulunursa, reddedilir. 150 bloktan daha yaşlı olduklarında da reddedilirler. Kabul edildikleri tek durum ise benzersiz olmaları ve blok hash'inin 150 bloktan daha yeni olmasıdır (~80-90 saniye).

:::warning
**Uyarı**: Son blok hash'leri ile işlem gönderim süreleri sınırlıdır; dikkat edilmelidir.
:::

Gördüğünüz gibi, son blok hash'leri kullanmanın bir yan etkisi, bir işlemin gönderilmesinden önce zorunlu bir ölümlülüğü olmasıdır.

Blok hash'leriyle ilgili bir diğer sorun, çok küçük zaman dilimlerinde imzalı işlemlerin zorunlu olarak benzersiz olmamasıdır. Bazı durumlarda, işlemler çok hızlı bir şekilde arka arkaya gerçekleştirildiğinde, bazıları yüksek olasılıkla aynı son blok hash'lerini alabilir ve bu da 
[bunların kopya yapılmasına ve yürütülmelerinin engellenmesine neden olur](https://solana.stackexchange.com/questions/1161/how-to-avoid-sendtransactionerror-this-transaction-has-already-been-processed?rq=1).

Özetlemek gerekirse:

1. Hemen işlemi göndermek istemiyorsam ne olur?
2. Anahtarlarımı internete bağlı bir cihazda tutmak istemediğim için işlemi çevrimdışı imzalamak istersem ne olur?
3. Birden fazla kişi tarafından sahip olunan birden fazla cihazdan işlemi eş imzalamak istersem ve bu eş imzalama 90 saniyeden fazla sürerse, DAO tarafından işletilen bir çok imza durumunda ne olur?
4. İşlemler serisini imzalayıp göndermek istersem ve bunların kopyalanmaları nedeniyle başarısız olmasını istemiyorsam ne olur?

### Çözüm
**Dayanıklı Noncelerdir⚡️.**

### Dayanıklı Nonceler

Dayanıklı İşlem Nonceleri, 32 byte uzunluğunda (genellikle base58 kodlu dizeler olarak temsil edilir), her işlemi benzersiz hale getirerek ikili harcamayı önlemek için son blok hash'lerinin yerinde kullanılırken, yürütülmemiş işlem üzerindeki ölümlülüğü kaldırır.

> Nasıl oluyor da ikili harcamayı önlemek için işlemleri benzersiz hale getiriyorlar?
>
> Eğer nonceler son blok hash'lerinin yerinde kullanılıyorsa, işlemin ilk talimatı `nonceAdvance` talimatı olmak zorundadır. Bu talimat nonce'yi değiştirir veya ilerletir. Bu, son blok hash'i olarak nonce kullanılarak imzalanan her işlemin, başarılı bir şekilde gönderilip gönderilmediğine bakılmaksızın, benzersiz olmasını garantiler.

Dayanıklı noncelerle Solana işlemleri için önemli olan birkaç hesap bakalım.

### Nonce Hesabı

Nonce Hesabı, nonce'nin değerini saklayan hesaptır. Bu hesap `SystemProgram` tarafından sahiplenilir ve kira muafiyetine sahiptir; dolayısıyla kira muafiyeti için minimum bakiyeyi (yaklaşık 0.0015 SOL) korumalıdır.

### Nonce Yetkilisi

Nonce yetkilisi, Nonce Hesabı'nı kontrol eden hesaptır. Yeni bir nonce oluşturma, nonce'yi ilerletme veya Nonce Hesabı'ndan SOL çekme yetkisine sahiptir. Varsayılan olarak, Nonce Hesabı'nı oluşturan hesap, Nonce Yetkilisi olarak yetkilendirilir, ancak yetki başka bir anahtar çiftine devretmek mümkündür.

## Solana CLI ile Dayanıklı Nonceler

Artık Dayanıklı Noncelerin ne olduğunu bildiğimize göre, bunları dayanıklı işlemler göndermek için kullanma zamanı.

> Solana CLI'niz yoksa, lütfen
> [bu eğitim](https://docs/intro/installation.md)'i inceleyin ve Solana CLI'yi kurun ve devnet'te airdrop'lanan bazı SOL içeren bir anahtar çifti oluşturun.

### Nonce Yetkilisini Oluşturma

Yeni bir anahtar çifti oluşturarak Nonce yetkilimiz olarak kullanmaya başlayalım. Solana CLI'mizde şu anda yapılandırılmış anahtar çiftini kullanabiliriz, ancak temiz bir tane yapmak daha iyidir (devnet'te olduğunuzdan emin olun).

```shell
solana-keygen new -o nonce-authority.json
```

Geçerli Solana CLI anahtar çiftini `nonce-authority.json` olarak ayarlayın ve buna biraz SOL airdrop edin.

```shell
solana config set -k ~/<path>/nonce-authority.json
solana airdrop 2
```

Tamam, şimdi hazırız. Şimdi nonce hesabımızı oluşturalım.

### Nonce Hesabı Oluşturma

Yeni bir anahtar çifti olan `nonce-account` oluşturun ve bu anahtar çiftini Nonce Hesabı olarak devretmek için `create-nonce-account` talimatını kullanın. Ayrıca, Nonce Yetkisinden Nonce Hesabına 0.0015 SOL transfer edeceğiz; bu miktar genellikle kira muafiyeti için gereken minimumdan biraz fazladır.

```shell
solana-keygen new -o nonce-account.json
solana create-nonce-account nonce-account.json 0.0015
```

Çıktı

```shell
Signature: skkfzUQrZF2rcmrhAQV6SuLa7Hj3jPFu7cfXAHvkVep3Lk3fNSVypwULhqMRinsa6Zj5xjj8zKZBQ1agMxwuABZ
```

Explorer'da
[imzayı](https://solscan.io/tx/skkfzUQrZF2rcmrhAQV6SuLa7Hj3jPFu7cfXAHvkVep3Lk3fNSVypwULhqMRinsa6Zj5xjj8zKZBQ1agMxwuABZ?cluster=devnet) aradığımızda, Nonce Hesabı'nın oluşturulduğunu ve `InitializeNonce` talimatının hesap içinde bir nonce başlatmak için kullanıldığını görebiliriz.

### Nonce'i Alma

Nonce'in saklanan değerini şu şekilde sorgulayabiliriz.

```shell
solana nonce nonce-account.json
```

Çıktı

```shell
AkrQn5QWLACSP5EMT2R1ZHyKaGWVFrDHJ6NL89HKtwjQ
```

Bu, bir işlemi imzalarken son blok hash'lerinin yerinde kullanılacak base58 kodlu hash'dir.

### Nonce Hesabını Gösterme

Nonce Hesabının detaylarını daha güzel bir formatta inceleyebiliriz.

```shell
solana nonce-account nonce-account.json
```

Çıktı

```shell
Balance: 0.0015 SOL
Minimum Balance Required: 0.00144768 SOL
Nonce blockhash: AkrQn5QWLACSP5EMT2R1ZHyKaGWVFrDHJ6NL89HKtwjQ
Fee: 5000 lamports per signature
Authority: 5CZKcm6PakaRWGK8NogzXvj8CjA71uSofKLohoNi4Wom
```

### Nonce'i İlerletme

Daha önce tartışıldığı gibi, Nonce'i ilerletmek veya nonce değerini değiştirmek, sonraki işlemleri benzersiz hale getirmek için önemli bir adımdır. Nonce Yetkilisi, `nonceAdvance` talimatıyla işlemi imzalamalıdır.

```shell
solana new-nonce nonce-account.json
```

Çıktı

```shell
Signature: 4nMHnedguiEtHshuMEm3NsuTQaeV8AdcDL6QSndTZLK7jcLUag6HCiLtUq6kv21yNSVQLoFj44aJ5sZrTXoYYeyS
```

Nonce'i tekrar kontrol edersek, nonce değerinin değiştiğini veya ilerlediğini göreceğiz.

```shell
solana nonce nonce-account.json
```

Çıktı

```shell
DA8ynAQTGctqQXNS2RNTGpag6s5p5RcrBm2DdHhvpRJ8
```

### Nonce Hesabından Çekme

Nonce Hesabını oluşturduğumuzda 0.0015 SOL transfer ettik. Nonce Yetkilisi, bu fonları kendisine veya başka bir hesaba geri transfer edebilir.

```shell
solana withdraw-from-nonce-account nonce-account.json nonce-authority.json 0.0000001
```

Çıktı

```shell
Signature: 5zuBmrUpqnubdePHVgzSNThbocruJZLJK5Dut7DM6WyoqW4Qbrc26uCw3nq6jRocR9XLMwZZ79U54HDnGhDJVNfF
```

Çekim işlemi sonrasında Nonce Hesabının durumunu kontrol edebiliriz; bakiye değişmiş olmalıdır.

```shell
solana nonce-account nonce-account.json
```

Çıktı

```shell
Balance: 0.0014999 SOL
Minimum Balance Required: 0.00144768 SOL
Nonce blockhash: DA8ynAQTGctqQXNS2RNTGpag6s5p5RcrBm2DdHhvpRJ8
Fee: 5000 lamports per signature
Authority: 5CZKcm6PakaRWGK8NogzXvj8CjA71uSofKLohoNi4Wom
```

## Canlı Örnek: DAO Çevrimdışı Eş İmzalama

Bir DAO komitesinin yeni bir cüzdana bazı SOL transfer etmesi gereken bir örnek kullanacağız. SOL göndermeden önce iki eş imzalayıcıya ihtiyaç var; burada `co-sender` işlem ücretini ödeyecek ve `sender` SOL'u gönderecek. Buna ek olarak, `co-sender` cihazını internete bağlama konusunda çok dikkatli ve bu nedenle işlemi çevrimdışı imzalamak istiyor.

Üç yeni anahtar çifti oluşturalım; bunlar DAO'nun iki üyesi ve alıcı olarak görev yapacaklar. Bu örnek için anahtar çiftlerini aynı sistemde oluşturuyor olsak da, bu hesapların farklı sistemlerde olduğunu varsayacağız.

```shell
solana-keygen new -o sender.json
# pubkey: H8BHbivzT4DtJxL4J4X53CgnqzTUAEJfptSaEHsCvg51

solana-keygen new -o co-sender.json
# pubkey: HDx43xY4piU3xMxNyRQkj89cqiF15hz5FVW9ergTtZ7S

solana-keygen new -o receiver.json
# pubkey: D3RAQxwQBhMLum2WK7eCn2MpRWgeLtDW7fqXTcqtx9uC
```

Üye cüzdanlarına biraz SOL ekleyelim.

```shell
solana airdrop -k sender.json 0.5
solana airdrop -k co-sender.json 0.5
```

### Son Blok Hashleri Kullanma

Dayanıklı bir işlemi imzalamadan ve göndermeden önce, işlemlerin genelde nasıl gönderildiğine bakalım.

> Dayanıklı noncelerin burada neden gerekli olduğunu takdir etmemize yardımcı olması için, yukarıyı denemeye çalışmamıza rağmen beklenen sonuç başarısızlıktır.

İlk adım, `sender`'dan `receiver`'a bir transfer işlemi oluşturmak ve bunu `co-sender`'ın cüzdanı ile imzalamaktır.

Çevrimdışı bir işlemi imzalamak için şunları kullanmamız gerekir:

1. `--sign-only`: bu istemcilerin işlemi göndermesini engeller.
2. `--blockhash`: bu, istemcinin çevrimdışı bir ayar içinde bunu almak için denememesi için yeni bir son blok hash belirlememize olanak tanır.

- Yakın bir blok hash'i almak için
  [solscan](https://solscan.io/blocks?cluster=devnet)'ten alabiliriz. Listeden ilk blok hash'ini kopyalayın.
- Ayrıca `sender`'ın pubkey'sine de ihtiyacımız var:
  `H8BHbivzT4DtJxL4J4X53CgnqzTUAEJfptSaEHsCvg51`
- Bu işlemi `co-sender`'ın cüzdanı ile imzalamak için internetinizi kapatabilirsiniz :).

```shell
solana transfer receiver.json 0.1 \
  --sign-only \
  --blockhash F13BkBgNTyyuruUQFSgUkXPMJCfPvKhhrr217eiqGfVE \
  --fee-payer co-sender.json \
  --from H8BHbivzT4DtJxL4J4X53CgnqzTUAEJfptSaEHsCvg51 \
  --keypair co-sender.json
```

Çıktı

```shell
Blockhash: F13BkBgNTyyuruUQFSgUkXPMJCfPvKhhrr217eiqGfVE
Signers (Pubkey=Signature):
 HDx43xY4piU3xMxNyRQkj89cqiF15hz5FVW9ergTtZ7S=2gUmcb4Xwm3Dy9xH3a3bePsWVKCRMtUghqDS9pnGZDmX6hqtWMfpubEbgcai5twncoAJzyr9FRn3yuXVeSvYD4Ni
Absent Signers (Pubkey):
 H8BHbivzT4DtJxL4J4X53CgnqzTUAEJfptSaEHsCvg51
```

İşlem `co-sender`'ın cüzdanı ile imzalandı, kim işlem ücretini ödeyecek. Ayrıca `sender`'ın cüzdanından ( `H8BHbivzT4DtJxL4J4X53CgnqzTUAEJfptSaEHsCvg51` ) bekleyen imza hakkında da bilgilendirildik.

:::tip
**İpucu**: Gerçek bir senaryoda, `co-sender` bu bilgiyi `sender` ile paylaşabilir. Bu, işlemi göndermesi gerekecek.
:::

Bu paylaşım bir dakikadan fazla sürebilir. `Sender` bu çifti aldıktan sonra transferi başlatabilir.

```shell
solana transfer receiver.json 0.1 \
  --allow-unfunded-recipient \
  --blockhash F13BkBgNTyyuruUQFSgUkXPMJCfPvKhhrr217eiqGfVE \
  --from sender.json \
  --keypair sender.json \
  --signer HDx43xY4piU3xMxNyRQkj89cqiF15hz5FVW9ergTtZ7S=2gUmcb4Xwm3Dy9xH3a3bePsWVKCRMtUghqDS9pnGZDmX6hqtWMfpubEbgcai5twncoAJzyr9FRn3yuXVeSvYD4Ni
```

Çıktı

```shell
Error: Hash has expired F13BkBgNTyyuruUQFSgUkXPMJCfPvKhhrr217eiqGfVE
```

Transfer işlemi başarısız oldu çünkü hash süresi dolmuş durumda. Süresi dolmuş blok hash'leri sorununu nasıl aşacağız? **Dayanıklı Nonceler kullanarak!**

### Dayanıklı Nonceler Kullanma

Daha önce oluşturduğumuz `nonce-account.json` ve `nonce-authority.json` anahtar çiftlerini kullanacağız. `nonce-account` içinde önceden bir nonce başlatılmış durumda. Birinci adım olarak onu alalım.

```shell
solana new-nonce nonce-account.json
solana nonce-account nonce-account.json
```

Çıktı

```shell
Signature: 3z1sSU7fmdRoBZynVLiJEqa97Ja481nb3r1mLu8buAgwMnaKdF4ZaiBkzrLjPRzn1HV2rh4AHQTJHAQ3DsDiYVpF

Balance: 0.0014999 SOL
Minimum Balance Required: 0.00144768 SOL
Nonce blockhash: HNUi6La2QpGJdfcAR6yFFmdgYoCvFZREkve2haMBxXVz
Fee: 5000 lamports per signature
Authority: 5CZKcm6PakaRWGK8NogzXvj8CjA71uSofKLohoNi4Wom
```

Harika, şimdi `co-sender`'ın cüzdanıyla çevrimdışı işlemin imzalanmasına başlayalım, ancak bu sefer yukarıda basılan `Nonce blockhash`'ini yani `nonce`'yi transfer işlemi için blok hash'i olarak kullanacağız.

```shell
solana transfer receiver.json 0.1 \
  --sign-only \
  --nonce nonce-account.json \
  --blockhash HNUi6La2QpGJdfcAR6yFFmdgYoCvFZREkve2haMBxXVz \
  --fee-payer co-sender.json \
  --from H8BHbivzT4DtJxL4J4X53CgnqzTUAEJfptSaEHsCvg51 \
  --keypair co-sender.json
```

Çıktı

```shell
Blockhash: HNUi6La2QpGJdfcAR6yFFmdgYoCvFZREkve2haMBxXVz
Signers (Pubkey=Signature):
 HDx43xY4piU3xMxNyRQkj89cqiF15hz5FVW9ergTtZ7S=5tfuPxsXchbVFU745658nsQr5Gqhb5nRnZKLnnovJ2PZBHbqUbe7oB5kDbnq7tjeJ2V8Mywa4gujUjT4BWKRcAdi
Absent Signers (Pubkey):
 H8BHbivzT4DtJxL4J4X53CgnqzTUAEJfptSaEHsCvg51
```

Bu, son blok hash'ini kullandığımızdan imzalamamız gereken işlemlerle oldukça benzer. Şimdi, transfer işlemi için `sender`ın cüzdanı ile imzala ve gönder.

```shell
solana transfer receiver.json 0.1 \
  --nonce nonce-account.json \
  --nonce-authority nonce-authority.json \
  --blockhash HNUi6La2QpGJdfcAR6yFFmdgYoCvFZREkve2haMBxXVz \
  --from sender.json \
  --keypair sender.json \
  --signer HDx43xY4piU3xMxNyRQkj89cqiF15hz5FVW9ergTtZ7S=5tfuPxsXchbVFU745658nsQr5Gqhb5nRnZKLnnovJ2PZBHbqUbe7oB5kDbnq7tjeJ2V8Mywa4gujUjT4BWKRcAdi
```

Çıktı

```shell
Signature: anQ8VtQgeSMoKTnQCubTenq1J7WKxAa1dbFMDLsbDWgV6GGL135G1Ydv4QTNd6GptP3TxDQ2ZWi3Y5qnEtjM7yg
```

İşlem başarıyla gönderildi!

Eğer bunu
[explorer](https://solscan.io/tx/anQ8VtQgeSMoKTnQCubTenq1J7WKxAa1dbFMDLsbDWgV6GGL135G1Ydv4QTNd6GptP3TxDQ2ZWi3Y5qnEtjM7yg?cluster=devnet)'da kontrol edersek, daha önce tartıştığımız gibi, işlem önüne bir `AdvanceNonce` talimatının eklendiğini görebiliriz. Bu, aynı nonce'nin tekrar kullanılmamasını sağlamak içindir.

İşte, Dayanıklı Noncelerin çok gerçekçi bir kullanım durumunu incelemiş olduk. Şimdi bunları işlemlerde kullanmanın nasıl olduğunu,
[`@solana/web3.js`](https://solana-labs.github.io/solana-web3.js/v1.x/) paketini kullanarak görelim.

## Solana Web3.js ile Dayanıklı Nonceler

Dayanıklı nonceleri kullanarak işlemleri göndermek için, basit bir transfer yapmak için benzer bir örnek kullanacağız.

### Nonce Yetkilisi Oluşturma (Web3.js)

```ts
const nonceAuthKP = Keypair.generate();
```

_Eğer SOL'e ihtiyacınız varsa, biraz almak için
[faucet.solana.com](https://faucet.solana.com/) kullanabilirsiniz._

### Nonce Hesaplarını Oluşturma (Web3.js)

```ts
const nonceKeypair = Keypair.generate();
const tx = new Transaction();

// ücret ödeyen herhangi bir hesap olabilir
tx.feePayer = nonceAuthKP.publicKey;

// nonce hesabını oluşturmak için, en son blok hash'ini alabilir
// veya farklı, önceden var olan bir nonce hesabından kullanın
tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

tx.add(
  // kira muafiyeti için minimum miktarla sistem hesabı oluşturun.
// NONCE_ACCOUNT_LENGTH bir nonce hesabının aldığı alanı temsil eder
  SystemProgram.createAccount({
    fromPubkey: nonceAuthKP.publicKey,
    newAccountPubkey: nonceKeypair.publicKey,
    lamports: 0.0015 * LAMPORTS_PER_SOL,
    space: NONCE_ACCOUNT_LENGTH,
    programId: SystemProgram.programId,
  }),
  // oluşturulan nonceKeypair'in pubkey'ini noncePubkey olarak kullanarak nonce'i başlatın
  // ayrıca nonce hesabının yetkilisini belirtin
  SystemProgram.nonceInitialize({
    noncePubkey: nonceKeypair.publicKey,
    authorizedPubkey: nonceAuthKP.publicKey,
  }),
);

// nonce anahtar çifti ve yetki anahtar çifti ile işlemi imzala
tx.sign(nonceKeypair, nonceAuthKP);

// işlemi gönder
const sig = await sendAndConfirmRawTransaction(
  connection,
  tx.serialize({ requireAllSignatures: false }),
);
console.log("Nonce başlatıldı: ", sig);
```

### Nonce Hesabını Alma (Web3.js)

```ts
const accountInfo = await connection.getAccountInfo(nonceKeypair.publicKey);
const nonceAccount = NonceAccount.fromAccountData(accountInfo.data);

### Dayanıklı Nonce ile İşlem İmzalama

```ts
// bir sistem transfer talimatı oluştur
const ix = SystemProgram.transfer({
  fromPubkey: publicKey,
  toPubkey: publicKey,
  lamports: 100,
});

// bir nonce ilerletme talimatı oluştur
const advanceIX = SystemProgram.nonceAdvance({
  authorizedPubkey: nonceAuthKP.publicKey,
  noncePubkey: noncePubKey,
});

// bunları bir işleme ekle
const tx = new Transaction();
tx.add(advanceIX);
tx.add(ix);

// nonceAccount'ın saklanan nonce'unu recentBlockhash olarak kullan
tx.recentBlockhash = nonceAccount.nonce;
tx.feePayer = publicKey;

// işlemi nonce yetkilisinin anahtarı ile imzala
tx.sign(nonceAuthKP);

// publicKey'in sahibi olan kişinin işlemi imzalamasını sağla
// bu bir cüzdan penceresi açmalı ve kullanıcının işlemi imzalamasını sağlamalı
const signedTx = await signTransaction(tx);

// imzalı işlemi elde ettikten sonra, bunu seri hale getirebilir ve
// bir veritabanına depolayabilir veya başka bir cihaza gönderebilirsin. Daha sonra
// işlemi sunmak için zamanlayabilirsin, işlem süreli olmayacak
const serialisedTx = bs58.encode(
  signedTx.serialize({ requireAllSignatures: false }),
);
console.log("İmzalı Dayanıklı İşlem: ", serialisedTx);
```

## Canlı Örnek: Anket Simülasyon Uygulaması
Anket Simülasyon uygulaması, seçmenlerin belirli bir zaman diliminde oy kullanabileceği gerçek bir anket mekanizmasını simüle eder. Anket sonuçlarını belirleme zamanı geldiğinde: oylar sayılır, sonuç kamuya açıklanır ve kazanan ilan edilir.

:::info
Bu, on-chain üzerinde inşa etmek zordur zira bir hesabın durumunu on-chain üzerinde değiştirmek kamuya açık bir eylemdir.
:::

Dolayısıyla, bir kullanıcı birine oy verirse, diğerleri bunu bilmiş olur ve bu nedenle oy sayısı oy verme işlemi tamamlanana kadar kamuya kapalı kalamaz.

:::tip
Dayanıklı nonceler bu durumu kısmen düzeltmek için kullanılabilir.
:::

Adayınıza oy verirken işlemi imzalamak ve göndermek yerine, dapp kullanıcının dayanıklı nonceler kullanarak işlemi imzalamasına imkan tanıyabilir, yukarıda web3.js örneğinde gösterildiği gibi işlemi seri hale getirip veritabanında saklayabilir.

:::note
Oyların sayılması için dapp, ardından tüm imzalı işlemleri tek tek senkronize etmeli, göndermeli veya sunmalıdır.
:::

Her sunulan işlemle birlikte, on-chain üzerinde durum değişikliği gerçekleşecek ve kazanan belirlenebilecektir.

### Canlı Uygulama

- Uygulama şu adreste aktiftir:
  [**https://durable-nonces-demo.vercel.app/**](https://durable-nonces-demo.vercel.app/)

- dapp'in nasıl kullanılacağına dair bilgiye
  [buradan](https://github.com/0xproflupin/solana-durable-nonces/blob/main/durable-nonces-demo/README.md#how-to-use-the-dapp) ulaşabilirsiniz.

- dapp'in yerel olarak nasıl inşa edileceğine dair bilgiye
  [buradan](https://github.com/0xproflupin/solana-durable-nonces/blob/main/durable-nonces-demo/README.md#how-to-build-the-dapp-locally) ulaşabilirsiniz.

## Referanslar

- [Neodyme Blog: Bir Zamanlar Nonce, ya da Tam Fon Kaybı](https://neodyme.io/blog/nonce-upon-a-time/)
- [Solana Dayanıklı Nonces CLI](https://docs.solanalabs.com/cli/examples/durable-nonce)
- [Solana Dayanıklı İşlem Nonces Teklifi](https://docs.solanalabs.com/implemented-proposals/durable-tx-nonces)