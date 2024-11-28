---
title: Nihai Gün Batımı Hardforku
description: Nihai Gün Batımı hardforku, kullanıcıların varlık yönetimini ve zincirler arası işlemleri nasıl etkilediğini ele alıyor. Bu makalede, fonların nasıl yönetileceği ve blok zinciri verilerine erişim yöntemleri hakkında detaylı bilgiler ve önemli ipuçları sağlanmaktadır.
keywords: [Nihai Gün Batımı, hardfork, BEP2, BEP8, token kurtarma, zincirler arası iletişim, kullanıcı yönetimi]
---

# SSSS

## 1. Nihai gün batımı hardforku sırasında ve sonrasında ne olacak?

Nihai Gün Batımı uygulanmadan önce, kullanıcıların zincirler arasında fon transferi yapma fırsatı vardır. Ancak, **Nihai Gün Batımı'ndan sonra**, Beacon Chain ile BSC arasındaki zincirler arası iletişim tamamen duracaktır.

:::info
Gün Batımı Fork'undan (yani, birleşim sonrası) sonra, Beacon Chain topluluğundaki doğrulayıcılar kademeli olarak kapatılacak ve tüm zincir yeni işlemleri kabul etmeyecek veya yeni bloklar önermeyecektir.
:::

Bazı fonlar kalıcı olarak kilitlenecektir:

* **Beacon Chain** üzerinde, BSC ile yansıtılmamış veya bağlanmamış **BEP2/BEP8** token'ları.
* **0.1 BNB'den** az olan veya **0.01 BNB'den** az stake edilmiş değer olan BEP153 staking ödülleri sonsuza kadar kilitlenecektir.

> Bu fonların tümü, Nihai Gün Batımı Fork'undan sonra geri alınamaz.  
> — Beacon Chain Ekibi

BC kapandığında, ana geliştirme ekibi Beacon Chain'in defterini boşaltacak ve bir merkle ağacı oluşturacaktır. Token göç sözleşmesinin merkel kökü ve onaylayıcı hesabını belirlemek için bir yönetim teklifi sunulacaktır. Token'ın Beacon Chain'den BSC'ye göçü için bir dapp (token kurtarma dApp) sağlanacaktır. **Beacon Chain'in** tüm blockchain verileri arşiv için **Greenfield**, **Filecoin** ve **Arweave**'a yüklenecektir.

---

## 2. Birleşim öncesi ve sonrası kullanıcıların BEP2/BEP8 varlıklarını nasıl yönetmesi gerekir?

Nihai gün batımı hardforkundan önce:

* Kullanıcılar, **BNB** ve bağlı **BEP2/BEP8**'yi BSC ağına zincirler arası olarak transfer etmelidir.

Nihai gün batımı hardforkundan sonra (yani, birleşim sonrası):

* Kullanıcılar, `token kurtarma dApp`'in yayınlanmasını beklemeli ve varlıklarını BSC ağına geri almak için token kurtarma dApp'i kullanmalıdır.

:::warning
Önemli: token kurtarma dApp'i kullanmak için BC hesabınızın özel anahtarını/mnemonic'ini kullanarak varlıkların sahibi olduğunuzu kanıtlayacaksınız. Lütfen anahtarınızı/mnemonic'inizi koruyun.
:::

---

## 3. Kullanıcılar birleşim sonrası bakiye anlık görüntüsüne nasıl erişebilir?

* Kullanıcıların blok zinciri verilerini, kullanıcı bakiyeleri de dahil olmak üzere sorgulayabilmesi için birkaç **BC düğümü** (doğrulayıcı olmayan) tutulacaktır.
    - Testnet RPC Düğümü: https://data-seed-pre-0-s1.bnbchain.org/
    - Mainnet RPC Düğümü: https://dataseed1.bnbchain.org/
* Anlık görüntü bakiyesi sorgulamak için bir **API uç noktası** tutulacaktır.
    - Testnet API Uç Noktası: https://testnet-dex.bnbchain.org/api/v1/account/{tbnb_address}
    - Mainnet API Uç Noktası: https://dex.bnbchain.org/api/v1/account/{bnb_address}
* Anlık görüntü dosyası **Greenfield, R2** vb. adreslerden indirilebilir. Kullanıcılar anlık görüntü dosyasını indirip blok zincirindeki verileri almak için yerel bir BC düğümü kurabilirler.
    - Testnet anlık görüntü dosyası: https://github.com/bnb-chain/node-dump/blob/master/Readme.md    
    - Mainnet anlık görüntü dosyası: Güncellenecek.

---

## 4. Birleşim sonrası BC ile ilgili hizmetlere veya ürünlere erişmeye devam edebilir miyim?

Nihai gün batımı hardforkundan sonra, BC ile ilgili çoğu hizmet ve ürün kapanacaktır, bunlar dahil ve bunlarla sınırlı olmamak üzere:

* **Staking hizmeti** (UI/API dahil)
    - Testnet staking hizmeti: https://testnet-staking.bnbchain.org/en/staking
    - Mainnet staking hizmeti: https://www.bnbchain.org/en/staking
* **Blok hizmeti** (API dahil)
    - Testnet blok hizmeti: https://testnet-api.bnbchain.org/bc
    - Mainnet blok hizmeti: https://api.bnbchain.org/bc/

:::note
Not: BC ile ilgili hizmetler ve ürünler için herhangi bir anlık görüntü sağlanmayacaktır.
:::

Beacon Chain Explorer, kullanıcıların blok zinciri verilerini sorgulaması için çalışmaya devam edecektir, ancak eğer uzun süre sorgu trafiği olmazsa BC testnet'i için keşif arayüzü kapatılacaktır.

* **Explorer hizmeti** (UI dahil)
    - Testnet keşif hizmeti: https://testnet-explorer.bnbchain.org/
    - Mainnet keşif hizmeti: https://explorer.bnbchain.org/