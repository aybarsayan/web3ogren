---
title: Paralel Ağlar
seoTitle: Paralel Ağlar ve XRP Defteri İlişkisi
sidebar_position: 4
description: Test ağları ile alternatif defter zincirlerinin üretim XRP Defteri ile nasıl ilişkili olduğunu anlayın. Bu içerik, paralel ağların işleyişini ve etkileşimde bulundukları alternatif ağları detaylandırmaktadır.
tags: 
  - paralel ağlar
  - XRP Defteri
  - test ağı
  - alternatif ağlar
  - blockchain
keywords: 
  - paralel ağlar
  - XRP Defteri
  - test ağı
  - alternatif ağlar
  - blockchain
---

## Paralel Ağlar

Bir üretim XRP Defteri eşler arası ağı bulunmaktadır ve XRP Defteri'nde gerçekleşen tüm işlemler üretim ağında - Mainnet içinde gerçekleşir.

Üretim ağına (Mainnet) etki etmeden XRP Defteri teknolojisi ile etkileşimde bulunmalarına yardımcı olmak için alternatif ağlar veya altnetler bulunmaktadır. İşte bazı kamuya açık altnetlerin bir dökümü:

| Ağ      | Güncelleme Sıklığı | Açıklama                                       |
|:--------|:------------------|:-----------------------------------------------|
| Mainnet | Stabil sürümler    | _The_ `XRP Ledger`, eşler arası sunuculardan oluşan bir ağ tarafından desteklenen merkeziyetsiz bir kriptografik defterdir ve `XRP` için evi oluşturmaktadır. |
| Testnet | Stabil sürümler    | Yazılımların XRP Defteri üzerinde test edildiği bir "alternatif evren" ağıdır; üretim XRP Defteri kullanıcılarını etkilemeden ve gerçek parayı riske atmadan çalışır. Testnet'in `değişiklik durumu`, Mainnet ile yakın bir şekilde eşleşmesi amaçlanmıştır, ancak merkeziyetsiz sistemlerin öngörülemez doğası nedeniyle zamanlamada küçük farklılıklar meydana gelebilir. |
| Devnet  | Beta sürümler      | Gelen çekimlerin bir önizlemesi olup, XRP Defteri yazılımının temelinde kararsız değişikliklerin test edilebileceği bir alandır. Geliştiriciler, bu altneti kullanarak planlanan yeni XRP Defteri özellikleri ve henüz Mainnet'te etkinleştirilmeyen değişiklikler hakkında etkileşimde bulunabilir ve bilgi edinebilir. |
| [Hooks V3 Testnet](https://hooks-testnet-v3.xrpl-labs.com/) | [Hooks server](https://github.com/XRPL-Labs/xrpld-hooks) | [hooks](https://xrpl-hooks.readme.io/) kullanarak zincir üzerindeki akıllı sözleşme işlevselliğinin bir önizlemesi. |
| Sidechain-Devnet | Beta sürümler | Çapraz zincir köprü özelliklerini test etmek için bir yan zincir. Devnet, kilit zinciri olarak işlem görür ve bu yan zincir, ihraç zinciridir.Kütüphane desteği:- [xrpl.js 2.12.0](https://www.npmjs.com/package/xrpl/v/2.12.0)- [xrpl-py 2.4.0](https://pypi.org/project/xrpl-py/2.4.0/)**Not**: Ayrıca, yerel makinenizde çapraz zincir köprüsü kurmak için [`xbridge-cli`](https://github.com/XRPLF/xbridge-cli) komut satırı aracını da kullanabilirsiniz. |

Her altnet, XRP Defteri ile deneme yapmak ve uygulamalar geliştirmekle ilgilenen taraflara `ücretsiz olarak verilmektedir`. Test XRP gerçek dünya değeri yoktur ve ağ sıfırlandığında kaybolur.

:::warning Dikkat
XRP Defteri Mainnet'in aksine, test ağları genellikle _merkeziyetsizdir_ ve bu ağların stabilitesi ve erişilebilirliği hakkında garantiler yoktur. Sunucu yapılandırması, ağ topolojisi ve ağ performansının çeşitli özelliklerini test etmek için kullanılmaya devam etmiştir.
:::

---

## Paralel Ağlar ve Konsensüs

Bir sunucunun hangi ağı takip edeceğini belirleyen ana faktör, yapılandırılmış UNL'sidir - kendisine güvenmediği doğrulayıcıların listesidir. Her sunucu, hangi defteri doğru olarak kabul edeceğini bilmek için yapılandırılmış UNL'sini kullanır. 

> Farklı `rippled` örneklerinin konsensüs grupları yalnızca aynı grubun diğer üyelerine güvendiğinde, her grup paralel bir ağ olarak devam eder. Kötü niyetli veya kötü davranan bilgisayarlar her iki ağa da bağlı olsa bile, konsensüs süreci karışıklığı önler, yeter ki her ağın üyeleri, kendi oy çokluğu ayarlarını aşan başka bir ağın üyelerine güvenmek için yapılandırılmamış olsunlar. — XRP Defteri Açıklamaları

Ripple, Testnet ve Devnet'teki ana sunucuları çalıştırmaktadır; ayrıca `kendi `rippled` sunucunuzu bu ağlara bağlayabilirsiniz`. Testnet ve Devnet, çeşitli, sansüre dayanıklı doğrulayıcı setlerini kullanmamaktadır. Bu durum, Ripple'ın Testnet veya Devnet'i istediği zaman sıfırlamasını mümkün kılar.

---

## Bakınız

- **Araçlar:**
    - `XRP Testnet Faucet`
- **Kavramlar:**
    - `Konsensüs`
    - `Değişiklikler`
- **Eğitimler:**
    - `Kendi `rippled`'inizi XRP Testnet'e Bağlayın`
    - `rippled'i Bağımsız Modda Kullanın`
- **Referanslar:**
    - [server_info method][]
    - [consensus_info method][]
    - [validator_list_sites method][]
    - [validators method][]
    - `Daemon Mode Options`

