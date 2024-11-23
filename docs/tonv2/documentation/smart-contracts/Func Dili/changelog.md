# FunC Tarihi

## İlk sürüm
İlk sürüm Telegram tarafından yapıldı ve aktif geliştirme Mayıs 2020'den sonra durduruldu. Mayıs 2020 sürümüne "ilk" olarak atıfta bulunuyoruz.

---

## Sürüm 0.1.0
[05.2022 güncellemesi](https://github.com/ton-blockchain/ton/releases/tag/v2022.05) ile yayımlandı.

Bu sürümde eklendi:
- `Sabitler`
- `Genişletilmiş dize sabitleri`
- `Semver pragmaları`
- `Dahil etmeler`

Düzeltildi:
- Nadiren gerçekleşen Asm.fif hataları düzeltildi.

:::tip
Bu sürüm, geliştiricilere daha fazla esneklik ve kontrol sağlamak amacıyla önemli güncellemeler içermektedir.
:::

---

## Sürüm 0.2.0
[08.2022 güncellemesi](https://github.com/ton-blockchain/ton/releases/tag/v2022.08) ile yayımlandı.

Bu sürümde eklendi:
- Dengesiz if/else dalları (bazı dalların döndürmesi ve bazılarının döndürmemesi durumunda)

Düzeltildi:
- [FunC while(false) döngülerini yanlış olarak işliyor #377](https://github.com/ton-blockchain/ton/issues/377)
- [FunC ifelse dalları için kodu yanlış üretiyor #374](https://github.com/ton-blockchain/ton/issues/374)
- [FunC koşuldan inline işlevlerde yanlış dönüş yapıyor #370](https://github.com/ton-blockchain/ton/issues/370)
- [Asm.fif: büyük işlev gövdelerinin bölünmesi inline'lar ile yanlış şekilde etkileşiyor #375](https://github.com/ton-blockchain/ton/issues/375)

:::warning
Dengesiz if/else dalları, kodun kontrol akışını etkileyebilir; bu nedenle dikkatli kullanılmalıdır.
:::

---

## Sürüm 0.3.0
[10.2022 güncellemesi](https://github.com/ton-blockchain/ton/releases/tag/v2022.10) ile yayımlandı.

Bu sürümde eklendi:
- `Çok satırlı asmlar`
- Sabitler ve asmlar için aynı tanımın çoğaltılmasına izin verildi
- Sabitler için bit düzeyinde işlemlere izin verildi

:::note
Çok satırlı asmlar, daha karmaşık işleyişleri kolaylaştırmak için faydalı olabilir.
:::

---

## Sürüm 0.4.0
[01.2023 güncellemesi](https://github.com/ton-blockchain/ton/releases/tag/v2023.01) ile yayımlandı.

Bu sürümde eklendi:
- `try/catch ifadeleri`
- `throw_arg işlevleri`
- Küresel değişkenlerin yerinde değiştirilmesi ve toplu atamalarına izin verildi: `a~inc()` ve `(a, b) = (3, 5)`, burada `a` küreseldir

Düzeltildi:
- Kullanılmasından sonra yerel değişkenlerin belirsiz şekilde değiştirilmesi yasaklandı: `var x = (ds, ds~load_uint(32), ds~load_unit(64));` yasak, ancak `var x = (ds~load_uint(32), ds~load_unit(64), ds);` yasak değildir
- Boş inline işlevlere izin verildi
- Nadiren oluşan `while` optimizasyon hatası düzeltildi

:::info
Yeni özellikler, hataların daha etkili bir şekilde yönetilmesine olanak tanır ve genel kod kalitesini artırabilir.
:::

---