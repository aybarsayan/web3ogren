---
title: Token Geri Alma
seoTitle: Token Geri Alma - Clawback Özelliği Hakkında Bilgi
sidebar_position: 4
description: İhraç edenler, tokenleri ihraç etmeden önce Clawback özelliğini etkinleştirirlerse, uyum amacıyla tokenlerini geri alabilirler. Bu süreç, tokenlerin iade edilmesi ve güvenliğin sağlanması açısından kritik öneme sahiptir.
tags: 
  - Clawback
  - Token
  - İhraç
  - Güvenlik
  - Regülasyon
keywords: 
  - Clawback
  - Token
  - İhraç
  - Güvenlik
  - Regülasyon
---

# Token Geri Alma

partial file="/docs/_snippets/clawback-disclaimer.md" /%}

Regülasyon amaçları için bazı ihraç edenlerin, tokenler hesaplara dağıtıldıktan sonra geri alma yeteneğine ihtiyaçları vardır. Örneğin, bir ihraç eden, tokenlerin yasadışı faaliyetler için yaptırım uygulanmış bir hesaba gönderildiğini keşfederse, ihraç eden, fonları geri alabilir veya *claw back* işlemi yapabilir.

İhraç edenler, ihraç eden hesaplarında **Clawback’a İzin Ver** bayrağını etkinleştirerek tokenlerini geri alma yeteneği kazanabilirler. Bu bayrak, ihraç eden tokenleri zaten ihraç etmişse etkinleştirilemez.

:::info
Sadece sizin hesabınız tarafından oluşturulan ihraç edilmiş tokenleri geri alabilirsiniz. XRP'yi bu şekilde geri alamazsınız.
:::

Clawback varsayılan olarak devre dışıdır. Clawback kullanmak için, **Allow Trust Line Clawback** ayarını etkinleştirmek amacıyla bir [AccountSet işlemine][] göndermelisiniz. **Herhangi bir mevcut tokeni olan bir ihraç eden Clawback’ı etkinleştiremez.** Tamamen boş bir sahip dizinine sahip olduğunuz sürece **Allow Trust Line Clawback** etkinleştirilebilir; yani güvenilir hatlar, teklif, emanet, ödeme kanalları, çekler veya imza listeleri oluşturmadan önce bunu yapmalısınız.

> **Önemli Not:** `lsfAllowTrustLineClawback` ayarını `lsfNoFreeze` ayarı açıkken ayarlamaya çalıştığınızda, işlem `tecNO_PERMISSION` döner; çünkü Clawback, güvenilir hatları dondurma yeteneğini reddeden bir hesap üzerinde etkinleştirilemez. Tersi durumda, `lsfNoFreeze` ayarını `lsfAllowTrustLineClawback` ayarı açıkken ayarlamaya çalıştığınızda, işlem de `tecNO_PERMISSION` döner.

---

## Örnek Clawback İşlemi

```json
{
  "TransactionType": "Clawback",
  "Account": "rp6abvbTbjoce8ZDJkT6snvxTZSYMBCC9S",
  "Amount": {
      "currency": "FOO",
      "issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
      "value": "314.159"
    }
}
```

Eğer başarılı olursa, bu işlem rp6abvbTbjoce8ZDJkT6snvxTZSYMBCC9S tarafından ihraç edilen ve rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW tarafından tutulan en fazla 314.159 FOO tokenini geri alacaktır.

