---
title: BlockHub
description: BlockHub, blockchain verilerine erişim için hafif, güvenilmez ve merkeziyetsiz bir yöntem sunar. Kullanıcıların veri arşivleme süreçlerinde daha etkili ve güvenilir bir çözüm bulmalarına yardımcı olur.
keywords: [BNB Greenfield, NodeReal, Veri Arşivleme Katmanı, BlockHub, blockchain verileri, tarihsel blok verileri, veri analizi]
---

# BlockHub

BlockHub, blockchain verilerine erişim için hafif, güvenilmez ve merkeziyetsiz bir yöntem sunar. Kullanıcı deneyimi, 
orijinal ağın RPC ve P2P erişimi ile tamamen uyumlu olup, kullanıcıların tam düğümleri çalıştırmalarını veya 
blok verilerini almak için merkezi veri sağlayıcılarına güvenmelerini gerektirmez. **Blok verilerini sağlamak için bir üçüncü 
taraf sağlayıcıya güvenmek istemiyor musunuz? Greenfield Blockhub cevabınız.** BlockHub şu anda BSC için aktiftir.

Blob Hub'a çok benzer şekilde, bulut servisini kullanarak blobları tek bir paket içinde arşivleyen BlockHub, 
bir dizi bloğu tek bir paket halinde birleştirmek için bulut hizmetini kullanır. Bu yaklaşım, depolama kullanımını optimize eder, 
maliyet etkinliğini sağlar ve veri bütünlüğünü ve erişilebilirliğini korur.

:::note
Not: Greenfield, nesneleri saklamak ve onlara erişmek için bir ücret talep etmektedir. Eğer bucket sahibinin ödeme hesabında 
yeterli bakiye yoksa, kullanıcılar kota doldurulana kadar veri sorgulayıp ulaşamayacaklardır.
:::

---

# BlockHub Nasıl Çalışır

BlockHub, üç ana bileşenden oluşmaktadır:

- **Blok İndeksleyici**: Bu hizmet, Blockchain'den blokları sürekli olarak indeksler ve bunları Greenfield'da saklar. Hiçbir bloğun atlanmadığından ve her saklanan bloğun doğru olduğundan emin olur.
- **API Sunucusu**: Bu bileşen, kullanıcı taleplerine yönelik tarihsel blok verilerini yönetir ve saklanan bloklara kesintisiz erişim sağlar.
- **Hafif Eşler**: Greenfield depolaması tarafından desteklenen ancak P2P ağında hizmet verebilen bir blockchain istemcisidir. Daha fazla detay için `Hafif Eş` belgelerine başvurun.

![BlockHub](../../../images/bnb-chain/bnb-greenfield/static/asset/block-hub.png)

İndeksleme süreci, yüklenen tüm blokları tarayan, Greenfield'da zaten saklanan verilerle doğrulama kontrolleri yapan 
ve kaybolan verileri tespit eden bir pas geçirme süreci gerçekleştirerek veri bütünlüğünü sağlar.

---

# BlockHub'a Erişime İhtiyaç Duyanlar

## Düğüm Operatörleri

**Genesis bloktan tam senkronizasyon gerektiren düğüm operatörleri, BlockHub aracılığıyla tarihsel blok verilerine 
erişim sağlamaları gerekir.** Greenfield'ın sağlam altyapısının avantajlarını kullanarak, saklanan verilerin bütünlüğüne ve 
ulaşılabilirliğine güvenebilirler.

Greenfield topluluğu, tam senkronizasyon modunda BSC düğümlerini çalıştırması gerekenler için bir veri tohum çözümü 
olarak `Greenfield Peer`i başlattı. Daha fazla ayrıntı için bu `sayfaya` göz atın.

---

## Veri Analistleri ve Araştırmacılar

BlockHub, tarihsel blok verilerine kapsamlı erişime ihtiyaç duyan veri analistleri ve araştırmacılar için değerli bir kaynak sunar. 
BlockHub'ı kullanarak, analiz, araştırma ve geliştirme amaçları için güvenilir veriler toplayabilirler.

---

# BlockHub ile Blok Verilerine Erişim

BlockHub artık BSC'yi destekliyor ve API'si tamamen Ethereum API spesifikasyonları ile uyumlu olup, geliştiriciler için entegrasyonu 
kolaylaştırır. Desteklenen ağlar ve uç noktalar hakkında ayrıntılı bilgiye `ağ ve uç noktalar` bölümünden 
ulaşabilirsiniz. API spesifikasyonu hakkında daha fazla bilgi için lütfen [BlockHub API](https://github.com/bnb-chain/greenfield-bsc-archiver/?tab=readme-ov-file#BlockHub-api) bağlantısına göz atın.

---

# Deneyin

Bu yenilikçi çözümü benimsemek, blockchain verilerinin **bütünlüğünü**, **erişilebilirliğini** ve **uzun ömürlülüğünü** sağlamakta 
ve daha dayanıklı ve şeffaf bir dijital ekosistemi desteklemektedir. **Bugün Greenfield topluluğuna katılın ve blockchain veri 
güvenilirliği ve güvenliği için yeni bir standart belirleyin.**