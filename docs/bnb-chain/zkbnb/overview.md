---
title: zkBNB Genel Bakış - zkBNB
description: zkBNB, geliştiricilerin yüksek verim ve düşük işlem ücretleri ile BSC tabanlı uygulamalar inşa etmelerine yardımcı olan bir altyapıdır. zk-Rollup mimarisi ile güvenliği artırır ve köprü saldırılarına karşı çözümler sunar.
keywords: [zkBNB, BSC, işlemsel verim, güvenlik, NFT, gaz ücretleri, zk-Rollup]
---

# zkBNB Nedir?
zkBNB, geliştiricilerin daha yüksek **işlemsel verim** ve daha düşük veya sıfır işlem ücretleri ile büyük ölçekli BSC tabanlı uygulamalar inşa etmelerine yardımcı olan bir altyapıdır. 

zkBNB, zk-Rollup mimarisi üzerine inşa edilmiştir. **zkBNB**, yüzlerce işlemi zincir dışı olarak toplar (veya "roll-up") ve kriptografik kanıtlar üretir. Bu kanıtlar, Rollup Bloğu içindeki her bir işlemin geçerliliğini kanıtlayabilen **SNARK'ler** (özlü etkileşimsiz bilgi argümanı) biçiminde olabilir.

## zkBNB'nin Çözdüğü Sorunlar
Bugün BSC ağ ölçeklenebilirlik sorunlarıyla karşı karşıya ve ana geliştirici, bu sorunu çözmek için [Outlook 2022](https://forum.bnbchain.org/t/bsc-development-outlook-2022/44) adlı makalelerinde yan zincirler kullanılmasını önermiştir çünkü bu yan zincirler çok daha yüksek verim ve daha düşük gaz ücretleri ile tasarlanabilir.

[BEP100](https://github.com/bnb-chain/BEPs/pull/132/files), BSC uyumlu yan zincirler oluşturmak için modüler bir çerçeve önermekte ve bunları yerel yönlendirici hub ile bağlamaktadır. Yerel yönlendirici hub'ın güvenliği yan zincir tarafından garanti edilmektedir.

:::warning
**Köprü Saldırıları:** [Chainalysis'in analizine](https://blog.chainalysis.com/reports/cross-chain-bridge-hacks-2022/) göre köprüler, siber korsanlar için önemli hedeflerden biri haline gelmiştir. 2022'de köprü saldırıları, çalınan toplam fonların %69'unu oluşturmaktadır.
:::

zkBNB bu problemi mükemmel bir şekilde çözebilir! zkSNARK kanıtları sayesinde, zkBNB BSC ile aynı güvenliği paylaşmaktadır.

## zkBNB'nin Temel Özellikleri Nelerdir?

BNB aşağıdaki hedeflere ulaşır:

- **L1 güvenliği:** zkBNB, BSC ile aynı güvenliği paylaşmaktadır. zkSNARK kanıtları sayesinde güvenlik kriptografik olarak garanti edilmektedir. Kullanıcıların herhangi bir üçüncü tarafa güvenmelerine veya dolandırıcılığı önlemek için Rollup bloklarını sürekli takip etmelerine gerek yoktur.

- **L1L2 İletişimi:** BNB, BEP20, BEP721 token'ları, yerleşik köprüleme platformumuz aracılığıyla BSC ve zkBNB arasında özgürce akabilir.
  
  _**Not:** BEP721 token'ı L1'den L2'ye aktarılabilmesi için zkBNB'de oluşturulmalıdır._

- **Yerleşik NFT pazaryeri:** Kullanıcılar, NFT koleksiyonlarını topluluklarına güvenli ve emniyetli bir şekilde zkBNB’nin yerleşik pazaryerinde başlatabilmekte ve bunları IPFS veya GreenField'da saklayabilmektedir. zkBNB, güçlü REST API'leri sunmaktadır. Alandaki yeni geliştiricilerin akıllı sözleşmelerle doğrudan etkileşimde bulunmalarına veya güvenlik konusunda endişelenmelerine gerek kalmayacaktır. Zengin Fonksiyonlar, örneğin GreenField'ı destekleme ve değiştirilebilir NFT desteği vardır.

- **Hızlı işlem hızı ve daha hızlı kesinlik:** zkBNB, 4 milyara kadar adresi, saniyede 5k işlem (TPS) ve en iyi senaryoda dakikalık kesinlik sağlama yeteneğiyle şaşırtıcı rakamlar sunmaktadır.

- **Düşük gaz ücreti:** zkBNB üzerindeki gaz token'ı ya BEP20 ya da BNB olabilir.

- **BSC'de "Tam çıkış":** Bir kullanıcı, her zaman fonları çekmek için bir çıkış işlemi talep edebilir. Bu, kullanıcıların birkaç dakika içinde istedikleri zaman fonları çekebilecekleri anlamına gelir. zkBNB çalışmayı durdurursa bile, kullanıcı tüm varlıklarını güvenli bir şekilde çekebilir. Her bir NFT koleksiyonu ayrılmış bir akıllı sözleşmeye çekilecektir.


Notlar
**Tam Çıkış** ve **Exodus Çıkışı**, zkBNB’de iki farklı işlevsellik türüdür. Tam çıkış, kullanıcının bir düğmeye tıklayarak tüm varlıklarını tek seferde çekebilmesi ile ilgilidir. Exodus çıkışı ise acil bir durumda, örneğin bütün zkBNB'nin çalışmaması durumunda, kullanıcının tüm varlıklarını hala çekebilmesi ile ilgilidir.
