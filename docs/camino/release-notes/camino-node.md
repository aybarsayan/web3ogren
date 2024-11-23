---
sidebar_position: 1
---

# Camino-Node Sürümleri

:::note GÜNCEL BİLGİ

`camino-node` çok hızlı bir gelişim sürecindedir, bu sayfa güncel olmayabilir.

Daha güncel bilgiler için lütfen  sayfasını kontrol edin.

:::

## v1.0.0-rc1

Ön Sürüm
Mevcut Testnet (Columbus) Sürümü



- [Bağımlılıklar, Versiyon] caminoethvm -> caminogo (Athens 1.0.1) @evlekht tarafından
- [[PVM] Ön-Athens tx'leri için pre-Athens rewardsImportTx mantığı döndürülür] @evlekht tarafından
- [[PVM, Harcama] Farklı sahipler için harcamaların serbest bırakılan tokenleri yatırmasına izin verir] @evlekht tarafından
- [[Bağımlılık, düzeltme] State sync versiyon (fork kalıntısı) düzeltildi] @evlekht tarafından

## v1.0.0

Athens Aşaması
Mevcut Mainnet (Camino) Sürümü



- Resmi Athens Aşaması Sürümü
- ** Sürüm notları `v1.0.0-rc1` ile aynıdır**

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.4.9...v1.0.0

## v1.0.0-rc1

Athens Aşaması (Ön Sürüm)
Ön Sürüm



- Athens sürümü @evlekht tarafından #68

**caminogo**

- Athens Yükseltmesi
- AddDepositOffer, depozit tekliflerinin oluşturulmasını sağlar
- Whitelist / Sahip kontrollü depozit teklifleri
- AddressStateTx yükseltmesi MsigAlias yeteneği kazandırmak için
- AddValidatorTx RewardOwner düzeltmesi
- SystemUnlockDepositTx başlangıcının düzeltilmesi (boş Creds[0])
- AddddressStateTx Rolleri düzeltmesi
- Admin API gizli anahtarı (dns saldırısı)

**camino-node**

- Bağımlılıkları güncelle
- Admin API gizli anahtarı için Config bayraklarını ayarla
- 1.9.16 avax geliştirmeye geçiş @evlekht tarafından #65
- Dockerfile'daki git versiyonunu güncelle @mo-c4t tarafından #67
- Admin API DNS Rebinding tespit düzeltmesi @DerTiedemann tarafından #62
- Kamu IP değiştiğinde Validator yeniden bağlantısını düzelt

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.4.9...v1.0.0-rc1

## v0.4.9



- caminogo: RewardValTx sonrası başlangıç sorunlarını düzelt
- caminogo: Deposit API'yi (zaman damgası ile sorgulama) ve uint64 sonuç türleri için dizeleri değiştir.

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.4.9-rc1...v0.4.9

## v0.4.9-rc1



- CaminoAddValidator NodeOwnerAuth
- Mevcut UnsortedCredential denetleyicisi ile ilgili sorunlar nedeniyle, CaminoAddValidatorTx'e bir subnetAuth eklendi.
- Bu kimlik doğrulaması, Kayıtlı NodeID sahibini doğrulayan kimlik bilgilerini yönetmelidir.

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.4.8-rc1...v0.4.9-rc1

## v0.4.8-rc1



- Sürüm 0.4.8 (== uyumluluk)
- Deposit (durum) içinde RewardOwner ekle
- Birden Fazla Sahibin alabileceği talepler
- PVM Servisi: APIOwner'ı kaldır, bunun yerine mevcut platformapi.Owner kullan
- Columbus için NodeID'leri düzelt @Noctunus tarafından #64

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.4.7-rc1...v0.4.8-rc1

## v0.4.7-rc1



- Genel genesis güncellemesi @Noctunus tarafından #63
- ClaimTx yeniden işlenmesi (CaminoGo)

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.4.6-rc2...v0.4.7-rc1

## v0.4.6-rc2



- caminogo: camino beacon'ı düzelt (kaynak portu eksik)

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.4.6-rc1...v0.4.6-rc2

## v0.4.6-rc1



- Camino genesis üretimi @Noctunus tarafından #60
- caminojs: genesis dosyaları / versiyon yükseltme 0.4.6 (== uyumluluk)
- caminojs: reward UTXO sıralama

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.4.5-rc1...v0.4.6-rc1

## v0.4.5-rc1



- Genesis dosyasında güncelleme (kopernikus) @pnowosie tarafından #58
- CaminoGo
  - CrossTransferOut, dışa aktarım sırasında alma alıcısını belirt
  - PlatformVM: P -> P transferini etkinleştirmek için BaseTx'yi uygulayın

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.4.4-rc1...v0.4.5-rc1

## v0.4.4-rc1



- Temizlik Sürümü
- **Bu sürüm önceki camino-node sürümleriyle UYUMLU DEĞİLDİR**
- DepositOffer DB depolamasını basitleştir
- Columbus Genesis'i güncelle

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.4.3-rc3...v0.4.4-rc1

## v0.4.3-rc2



- UnlockDeposit düzelt
- MultisigAlias işlemlerini yeniden işleme
- Genesis dosyalarını güncelle (columbus / kopernikus)
- Ödüller için API değişiklikleri (deposit / hazine ayrımı)
- MultisigAlias fonlarının dışa aktarımını yasakla
- Auto-UnlockDeposit uygulama
- MSigAliases için LRU önbelleği (16384)
- SigIndex math.Uint32 sihirli sayısını geri yükle
- RegisterNodeTx: zaten kayıtlı olan düğümün kaydını yasakla

(Çıkmamış `v0.4.3-rc1` sürüm değişiklik günlüğünü içerir)

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.4.2-rc2...v0.4.3-rc2

## v0.4.2-rc2



- Genesis üreteci güncellemesi
- Publickey kurtarma testleri
- Ücretsiz fonların P/X hedefini seçmeye izin ver
- Kopernikus ve columbus json dosyalarının yeniden üretilmesi
- Deposit tekliflerinin xls'den okunması
- Bağımlılıklar ve formatlama
- Eşik, Multisig çalışma kitabına taşındı
- Kaçırılan sütunların doğrulaması: KYC, konsorsiyum
- Yeniden üretilen genesis dosyaları
- [Bağımlılıklar] Son düzeltmeler
- [GENESIS] Genesis üretici aracı için ek kontroller
- README'deki bozuk bağlantıları düzelt
- Columbus genesis'i son duruma güncelle
- [BAĞIMLILIKLAR] caminoethvm (GasFee / ExportLimit) -> caminogo (talepler)

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.4.2-rc1...v0.4.2-rc2

## v0.4.2-rc1



- Genesis üreteci güncellemesi
- Publickey kurtarma testleri
- Ücretsiz fonların P/X hedefini seçmeye izin ver
- Kopernikus ve columbus json dosyalarının yeniden üretilmesi
- Deposit tekliflerinin xls'den okunması
- Bağımlılıklar ve formatlama
- Eşik, Multisig çalışma kitabına taşındı
- Kaçırılan sütunların doğrulaması: KYC, konsorsiyum
- Yeniden üretilen genesis dosyaları
- [Bağımlılıklar] Son düzeltmeler
- [GENESIS] Genesis üretici aracı için ek kontroller
- README'deki bozuk bağlantıları düzelt
- Columbus genesis'i son duruma güncelle
- [BAĞIMLILIKLAR] caminoethvm (GasFee / ExportLimit) -> caminogo (talepler)
- Peak3d/yükselt

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.4.1-rc2...v0.4.2-rc1

## v0.4.1-rc2



- Genesis `platformAllocation`'ı yalnızca `maxStakingAmount` stake edin
- Daha önce bağlı olan UTXO'lar için depositTx girdileri ekle

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.4.1-rc1...v0.4.1-rc2

---

## v0.4.1-rc1

:::caution UYARI

Bu dalda hatalar var. Bunun yerine lütfen  sürümünü kullanın.

:::



Avalanchego v1.9.4 (Banff) tabanlıdır.

#### PlatformVM:

- Camino ağları için stake/delegate yerine DepositBond modu
- KYC / Konsorsiyum Üyeleri için AddressStates
- Kayıtlı NodeID `` Konsorsiyum üyesi
- Multisigaddress'ler

#### X-Chain:

- Değişmedi

#### C-Chain

- Temel Ücret düzeltildi
- Önceden dağıtılmış yönetici Akıllı Sözleşme üzerinden KYC
- Sözleşme dağıtımı, KYC onaylı adreslerle kısıtlandı

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.4.0-alpha2...v0.4.1-rc1

---

## v0.4.0-alpha2



**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.4.0-alpha1...v0.4.0-alpha2

---

## v0.4.0-alpha1



#### Değişiklikler

- Ansible_lint'i devre dışı bırak / yalnızca sürümde artefaktlar
- CI Testlerini düzelt
- .editorconfig ekle

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.3.0-alpha1...v0.4.0-alpha1

---

## v0.3.0-alpha1



#### Değişiklikler

Bu sürüm, son avalanche-network koşucusuna dayanmakta olup, sadece camino-node'un avalanchego yerine çalışabilmesi için hafif değişiklikler içermektedir.

**Tam Değişiklik Günlüğü**: https://github.com/chain4travel/camino-node/compare/v0.2.1-rc2...v0.3.0-alpha1

---

## v0.2.1-rc2



-  v0.1.2-rc2 ile derlendi

---

## v0.2.1-rc1



-  v0.2.0'a dayanıyor
-  v0.1.2-rc1 ile derlendi