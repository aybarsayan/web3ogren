---
title: Gerekli Yeteneklerin Bildirimi
---

# Gerekli Yeteneklerin Bildirimi

Çoğu sözleşme dağıtımının `BootstrapPowers`'ın tümüne ihtiyacı yoktur. Kullanılmadıkları şeyleri gözle kontrol ile doğrulamak oldukça zordur. Bu nedenle, eriştikleri yetenekler için üst bir sınır bildirmek amacıyla bir `BootstrapManifestPermit` ile teklifler gelir. Bir özellik erişimi `powers.P` için, izin `{ P: true }` şeklindeyse, erişim başarılı olur. Aslında, her _doğru değer_ işe yarar. Yeniden ve döngüsel olarak, bir özellik erişimi `powers.P.Q.R` başarılıdır eğer izin `{ P: { Q: { R: true } } }` şeklindeyse.

`startSellConcertTicketsContract` için izin aşağıdaki gibidir:

```js
/** @type { import("@agoric/vats/src/core/lib-boot").BootstrapManifestPermit } */
export const permit = harden({
  consume: {
    agoricNames: true,
    brandAuxPublisher: true,
    startUpgradable: true, // sözleşmeyi başlatmak ve adminFacet'i kaydetmek için
    zoe: true // sözleşme şartlarını almak için, yayıcı / marka dahil
  },
  installation: {
    consume: { [contractName]: true },
    produce: { [contractName]: true }
  },
  instance: { produce: { [contractName]: true } },
  issuer: { consume: { IST: true }, produce: { Ticket: true } },
  brand: { consume: { IST: true }, produce: { Ticket: true } }
});

export const main = startSellConcertTicketsContract;
```

## Seçilen BootstrapPowers

En üst seviye sözleşme alanında şunlar mevcuttur:

- **agoricNames**:  ad hizmetine yalnızca okunabilir erişim.

- **agoricNamesAdmin**:  ve içinde barındırdığı isim hub'larına yönetici / güncelleme erişimi.
  **Uyarı:** Bu, mevcut bağlılıkları örnekler, markalar vb. üzerine yazma hakkını içerir.

- **bankManager**: cosmos varlıklarının ERTP varlıkları olarak yansımasını yönetmek; bir denom ile ilişkilendirilmek üzere bir yayıcı kaydı yapmak veya herhangi bir adres için bir cüzdanlar bankası almak. **Uyarı:** Bu, herhangi bir hesap için varlık harcama hakkını içerir.

- **board**:  ad hizmeti.
  **Not:** board yalnızca büyür; depolama geri almak için herhangi bir mekanizma oluşturulmamıştır.

- **chainStorage**: .
  **Uyarı:** Bu, daha önce tahsis edilmiş depolama düğümlerini üzerine yazma erişimini içerir.

- **chainTimerService**: mevcut zamanlayıcıyı almak ve zamanlayıcı uyandırmalarını ayarlamak için; örneğin, bir yönetişim oylamasının sonucunda.
   için bakın.
  **Not:** Bu, sonsuza dek tekrarlayan olayları planlama erişimini içerir.

- **namesByAddress**: ; özellikle, bir `depositFacet`.

- **namesByAddressAdmin**: **namesByAddress**'a yönetici (yazma) erişimi.
  **Uyarı:** Bu, bir adrese yönelik ödemelerin nereye gideceğini yeniden yönlendirme erişimini içerir.

- **priceAuthority**: fiyat tekliflerini ve tetikleyicileri almak için erişim;  için bakın.

- **priceAuthorityAdmin**:  kullanarak fiyat teklif kaynaklarını eklemek ve değiştirmek için erişim.

- **zoe**: 