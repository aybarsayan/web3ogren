---
sidebar_position: 30
---

# Camino Akıllı Sözleşmeleri

Camino Ağı, KYC doğrulaması, gaz ücreti oylaması ve dApp teşvikleri gibi çeşitli idari görevleri yönetmek için akıllı sözleşmeler kullanmaktadır. Aşağıda bu sözleşmeler ve ilgili adresleri hakkında bilgi bulabilirsiniz.

## `CaminoAdmin`

Bu akıllı sözleşme, KYC, gaz ücreti, kara liste gibi rollerin belirlenmesi gibi idari görevlerden sorumludur. Bu bir  sözleşmesidir; yani uygulama, `ADMIN_ROLE` yetkisine sahip bir adres tarafından yükseltilebilir.

### KYC Akıllı Sözleşmesi

Camino Ağı'nın Kontrat Zinciri (C-Chain) üzerinde, diğer akıllı sözleşmeler, belirli bir adresin KYC doğrulama durumunu almak için sağlanan adres üzerinden CaminoAdmin sözleşmesi ile etkileşimde bulunabilir.

|    Adres      | `0x010000000000000000000000000000000000000a` |
| :-----------: | :------------------------------------------: |
| Uygulama      | `0x010000000000000000000000000000000000000b` |

Kaynak: 

## `CaminoIncentives`

Bu akıllı sözleşme, Camino dApp Teşvik Havuzu'ndan sorumludur. Şu anda gelecekteki geliştirmeler için bir yer tutucudur. `CaminoAdmin` sözleşmesinde olduğu gibi, bu da bir  sözleşmesidir ve `ADMIN_ROLE` yetkisine sahip bir adres tarafından yükseltilebilir.

|    Adres      | `0x010000000000000000000000000000000000000c` |
| :-----------: | :------------------------------------------: |
| Uygulama      | `0x010000000000000000000000000000000000000d` |

Kaynak: 