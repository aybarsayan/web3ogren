---
title: Dağıtık Tanımlayıcılar
seoTitle: Dağıtık Tanımlayıcılar - DIDs ve Kullanım Alanları
sidebar_position: 4
description: Dağıtık tanımlayıcılar (DIDs), doğrulanabilir, dağıtık dijital kimlikler sağlar. Bu belgede, DIDs’in işleyişi, belgeleri, gizlilik ve güvenlik endişeleri ile kullanım alanları ele alınmaktadır.
tags: 
  - Dağıtık Tanımlayıcılar
  - DID
  - Dijital Kimlik
  - Güvenlik
  - Gizlilik
  - Blok Zinciri
keywords: 
  - Dağıtık Tanımlayıcılar
  - DID
  - Dijital Kimlik
  - Güvenlik
  - Gizlilik
  - Blok Zinciri
---

## Dağıtık Tanımlayıcılar

_(Gerektirir [DID değişikliğini][])_

Dağıtık Tanımlayıcı (DID), Doğruluk Web Konsorsiyumu (W3C) tarafından tanımlanan yeni bir tanımlayıcı türüdür ve doğrulanabilir, dijital kimlikler sağlar. DIDs, tam olarak **DID sahibinin kontrolündedir** ve herhangi bir merkezi kayıt, kimlik sağlayıcısı veya sertifika otoritesinden bağımsızdır.

> "DIDs, kullanıcının kendi dijital kimliğini kontrol etmesini sağlayarak merkezi otoritelere olan bağımlılığı azaltır." — 

DID'in temel ilkeleri şunlardır:

- **Dağıtıklık:** Herhangi bir merkezi dağıtım ajansı DID'i kontrol etmez, bu da sahibin DID'i güncelleyebilmesini, çözümleyebilmesini veya devre dışı bırakabilmesini sağlar. Bu aynı zamanda kimliğinizin yüksek kullanılabilirliğe sahip olmasını sağlar, çünkü DIDs genellikle bir blok zincirinde saklanır ve her zaman doğrulama için mevcutturlar.
    
- **Doğrulanabilir Kimlik Bilgileri:** Herkes bir DID oluşturabilir ve üzerindeki bilgileri sahteleyebilir. Bir DID'in özgünlüğünü kanıtlamak için bir kullanıcı, şifreleme ile güvenli ve sahtecilik yapılması zor bir doğrulanabilir kimlik bilgisi (VC) sağlamalıdır. 
    
    DID ekosisteminde üç taraf bulunmaktadır: _kullanıcı_, _yayımcı_ ve _doğrulayıcı_. _Kullanıcı_, DID'i kontrol eder, ancak bilgiyi çevrimdışı doğrulamak için güvenilir bir _yayımcıya_ ihtiyaç duyar. Yayımcı, kullanıcının kimliğini doğrulamak için _doğrulayıcılara_ verdiği doğrulanabilir bir kimlik bilgisi sağlar. DID ekosistemi hakkında daha fazla bilgi için: [Eko Sistem Genel Görünümü](https://www.w3.org/TR/vc-data-model/#ecosystem-overview).

    :::tip
    DID belgeleri oluşturmadan önce W3C standartlarını dikkate almak iyi bir uygulamadır.
    :::

- **Etkileşimlilik:** DIDs, W3C DID standartlarını tanıyan herhangi bir çözüme açıktır. Bu, bir DID'in çeşitli dijital işlemler ve etkileşimlerde kimlik doğrulama ve güven tesis etmek için kullanılabileceği anlamına gelir.

:::info
XRP Ledger'da DIDs'in uygulanması, [DID v1.0 spesifikasyonuna](https://www.w3.org/TR/did-core/) uygundur.
:::

---

## Nasıl Çalışır

1. **Bir XRPL hesap sahibi**, hesap tarafından kontrol edilen bir DID oluşturur.  
2. **DID**, W3C spesifikasyonları tarafından tanımlanan bir DID belgesi ile ilişkilendirilir.  
3. **Bir kullanıcı**, dijital bir görev için bir doğrulayıcıya DID'ini ve VC'sini verir.  
4. **Doğrulayıcı**, DID'yi belgesine çözer ve özgünlüğünü doğrulamak için VC'yi kullanır.

---

## DID Belgeleri

DID belgeleri, bir DID belgesinde tanımlanan konunun kimliğini şifreleme ile doğrulamak için gerekli bilgileri içerir. Konu, bir kişi, organizasyon veya nesne olabilir. Örneğin, bir DID belgesi, DID konusu tarafından kendisini doğrulamak ve DID ile olan ilişkisini kanıtlamak için kullanılabilecek şifreleme kamu anahtarlarını içerebilir.

:::info
DID belgeleri genellikle bir JSON veya JSON-LD temsiline serileştirilir.
:::

XRP Ledger'da, bir DID'i bir DID belgesi ile ilişkilendirmek için birkaç yol vardır:

1. `DID` nesnesinin `URI` alanında, başka bir merkeziyetsiz depolama ağında (IPFS veya STORJ gibi) saklanan bir belgeye işaret eden bir referans saklayın.
2. `DID` nesnesinin `DIDDocument` alanında minimal bir DID belgesi saklayın.
3. DID ve diğer mevcut kamu bilgileri ile oluşturulan minimal bir _örtük_ DID belgesini kullanın.
    
    :::info
    Daha basit kullanım durumları yalnızca imzalar ve basit yetkilendirme belirteçleri gerektirebilir. Ledger'da açıkça bir DID belgesi olmadığında, bunun yerine örtük bir belge kullanılır. Örneğin, `did:xrpl:1:0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020` için örtük DID belgesi, yalnızca bu DID belgesinde değişiklik yetkilendirmek veya DID adına kimlik bilgileri imzalamak için `0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020` anahtarının kullanılmasını sağlar.
    :::

---

### Örnek XRPL DID Belgesi

```
{
    "@context": "https://w3id.org/did/v1",
    "id": "did:xrpl:1:rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "publicKey": [
        {
            "id": "did:xrpl:1:rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn#keys-1",
            "type": ["CryptographicKey", "EcdsaKoblitzPublicKey"],
            "curve": "secp256k1",
            "expires": 15674657,
            "publicKeyHex": "04f42987b7faee8b95e2c3a3345224f00e00dfc67ba882..."
        }
    ]
}
```

DID belgesinin temel özellikleri hakkında daha fazla bilgi için: [Dağıtık Tanımlayıcılar (DID'ler) v1.0](https://www.w3.org/TR/did-core/#core-properties).

---

## Gizlilik ve Güvenlik Endişeleri

- Bir XRPL hesabının özel anahtarlarını kontrol eden, DID'i ve buna işaret eden DID belgesinin referansını kontrol eder. Özel anahtarlarınızı tehlikeye atmamaya dikkat edin.
- Bir DID belgesinde herhangi bir içeriği dahil edebilirsiniz, ancak bunu doğrulama yöntemleri ve hizmet noktaları ile sınırlandırmalısınız. XRPL'deki DIDs halka açık olduğundan, kişisel bilgilerinizi dahil etmemelisiniz.
- IPFS, hiç kimsenin içerikleri dağıtılmış bir ağda kaydetmesini sağlar. Yaygın bir yanlış anlama, herkesin o içeriği düzenleyebileceğidir; ancak, IPFS'in içerik adreslenebilirlik özelliği, düzenlenen içeriğin orijinalden farklı bir adrese sahip olacağı anlamına gelir. Bir varlık, bir XRPL hesabının `DIDDocument` veya `URI` alanlarıyla bağlanmış bir DID belgesini kopyalayabilir, ancak eşleşen `DID` nesnesini oluşturmak için özel anahtara sahip olmadıkça belgeyi değiştiremez.

---

## Kullanım Alanları

DIDs, aşağıdaki gibi birçok kullanım alanını mümkün kılar:

- Müşterini Tanıma (KYC) ve Kara Para Aklama (AML) standartlarını karşılama.
- XRP Ledger'da kullanıcı kimliği yönetimi.
- DeFi uygulamalarına farklı erişim.
- Dijital belgeleri imzalama.
- Güvenli çevrimiçi işlemler yapma.
- Web sitelerine giriş yapma.

