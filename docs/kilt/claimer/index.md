# Claimer 🦸‍♂️

Bu kısımda birlikte `Claimer` bireyinin yaptığı işlemleri adım adım gerçekleştireceğiz. 🚀

:::info 🤔 Claimer mı? O ne ola ki? 🤔

- Bir Claimer, kimliği veya yetenekleri hakkında bir iddia veya beyanda bulunan bir birey veya kurumdur. 🗣️ Bu iddialarını kanıtlamak için kimlik bilgilerini kullanabilir, ve bu bilgiler üçüncü taraf kurumlar tarafından doğrulanabilir. 💪

- Herkes bir Claimer olabilir! 🙌 Yapmanız gereken tek şey bir Ctype doldurmak ve bir iddia oluşturmaktır. Sonrasında, bu iddialarınızı Onaylayıcılara (Attesters) gönderip onaylatabilirsiniz. 📝🔒

- Claimer'lar, Öz-Yönetimli Kimlik (Self-Sovereign Identity) sisteminin kahramanlarıdır! 🦸‍♀️ Verileri üzerinde tam kontrol sahibidirler ve hangi veri parçalarını, nerede ve nasıl paylaşacaklarına kendileri karar verirler. 🛡️🔐

- Kimlik bilgilerini kendi dijital cüzdanlarında saklarlar, böylece hangi bilgileri hangi servise sağlayacaklarına kendileri karar verirler. 💼🔏

- Zincir üzerinde bir DID oluşturmanıza gerek yok, yani tamamen bağımsınız! 🆓 Claimer'lar, bir zincir bağlantısına ihtiyaç duymadan hesaplarını kullanabilirler. ⛓️🔓
:::

## 🗺️ Yol Haritası 🗺️

1. İlk adımda, DID oluşturacağız. 🆔 Bu DID'ler, Attester için oluşturduğumuz DID'lerden biraz farklı olacak. Detaylarıyla inceleyeceğiz. 🕵️‍♀️
2. Sonrasında bir `Claim` oluşturacağız, bu iddiayı onaylatmak için bir talep açacağız ve onaylanmış iddia üzerinden bir `credential` oluşturacağız. 📜🔏
3. Ve son olarak, bu belgeleri Verifier bireyine teslim edeceğiz. 🤝

## 📂 Dosya Mimarisi 📂

`Claimer` klasörü içerisine aşağıda gösterilen dosyaları oluşturacağız. 📁 Bu dosyalar, bize `Claimer`'ın perspektifini gösterecek. 🎥

```bash
└─ kilt-rocks/ # proje
  └─ claimer/ # tüm claimer kodları
    ├─ createClaim.ts # bir iddia oluşturur
    ├─ createPresentation.ts # doğrulayıcılar için bir sunum oluşturur
    ├─ generateCredential.ts # onaylayıcıya gönderilecek kimlik bilgisi nesnesini oluşturur
    ├─ generateKeypairs.ts # hafif DID için anahtar çiftleri oluşturur
    └─ generateLightDid.ts # claimer için light bir DID oluşturur

```

:::caution 🚨 Dikkat! 🚨
Hadi Claimer olalım! 🎉🙌 
:::
