---
title: Örnek Zoe Sözleşmeleri
---

# Örnek Zoe Sözleşmeleri



Zoe, özel akıllı sözleşmeler oluşturmanızı sağlarken, yaygın bir yapı izleyen bir sözleşme kullanmak isteyebilirsiniz. Bu nedenle, şu anda Zoe üzerinde içe aktarılabilecek ve çalıştırılabilecek birkaç önceden oluşturulmuş örnek sözleşme sağlıyoruz. Aşağıda belirtilen sözleşmelerin hiçbiri otomatik olarak zincir üzerinde dağıtılmamaktadır.

## Oracle Sözleşmeleri

| Sözleşme                                      | Açıklama                                                                                                                          |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
|                       |  veya diğer oracle'lar için düşük seviyeli bir oracle sözleşmesi. |
|  | Kendi sözleşmeniz içinde bir fiyat oracle kullanmak için, `priceAuthority` daha yüksek seviye soyutlamayı kullanmanızı öneririz.                       |

## DeFi Sözleşmeleri

Bu sözleşmeler çeşitli finansal araçlar oluşturur.

| Sözleşme                                 | Açıklama                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                          | Kasa, IST'yi (Agoric sabit değerli para birimi) ekonomideki katılımcılara sunmanın birincil mekanizmasıdır. Bununla, desteklenen teminat türlerine karşı krediler vererek işler. Sözleşmenin yaratıcısı yeni teminat türleri ekleyebilir. (Bu, sözleşme başlatıldığında ilk para birimleri tanımlandığında zincir üzerinde yönetişim kontrolü altında olması beklenmektedir.) |
|                            | Teminatlı bir kredi sözleşmesi.                                                                                                                                                                                                                                                                                                               |
|  | Tamamen teminatlandırılmış çağrı yayılması opsiyonları çiftini oluşturur. Bunlar ERTP varlıklarıdır ve diğer sözleşmelerde bu şekilde kullanılabilir. Bu sözleşmenin iki versiyonu vardır; bu, davetlerin nasıl oluşturulduğunu etkiler. Bu versiyon, yaratıcı tarafından tamamen finanse edilir ve bir çift çağrı yayılması opsiyonu alır. Bunlar ayrı ayrı işlem görebilir veya satılabilir. |
|  | Tamamen teminatlandırılmış çağrı yayılması opsiyonları çiftini oluşturur. Bunlar ERTP varlıklarıdır ve diğer sözleşmelerde bu şekilde kullanılabilir. Bu sözleşmenin de iki versiyonu vardır; bu, davetlerin nasıl oluşturulduğunu etkiler. Bu versiyonda, yaratıcısı bir çift davet talep eder. Her biri, belirli bir teminat kısmını sağlayarak bir pozisyondan yararlanma imkanı sunar. Bu versiyon, eşleşen çıkarları olan katılımcılar çiftini bulmak için piyasa yapımcıları için yararlıdır. |
|            | Bir alım opsiyonu oluşturur; bu, bir temel varlığı satın alma hakkını temsil eder.                                                                                                                                                                                                                                                                         |
|                    | Kullanılabilen alıntıları veren bir sözleşme. Bu alıntılar, gerçekten escrow edilmiş temel varlıklarla opsiyonlar olduğundan, uygulanabilir şekilde garanti edilmektedir.                                                                                                                                                                                    |

## AMM (Otomatik Piyasa Yapıcı) Sözleşmesi

| Sözleşme                                    | Açıklama                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  | Fonlanan herhangi bir para birimi çifti arasında ticaret yapabilen çoklu likidite havuzlarına sahip otomatik bir piyasa yapıcıdır. Bu, likidite havuzlarına eklenen bir poolFee ve Agoric ekonomisi için ayrılan bir protokol ücreti alır. Bu ücretler, yönetim sistemi tarafından belirlenen ve görünür hale getirilen oylamalarla değiştirilebilir. |

## Genel Satış/Ticaret Sözleşmeleri

Bu sözleşmeler, ERTP dijital varlıklarını ticaret veya satışı içerir.

| Sözleşme                                       | Açıklama                                                                                                                                                                                                            |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                      | Genellikle NFT'leri para karşılığında satmak için kullanılan genel bir satış sözleşmesi.                                                                                                                                                      |
|                    | İki taraf arasında dijital varlıkların temel bir takası.                                                                                                                                                                   |
|            | Her türlü ürünün açık takas swapları için teklif edilebildiği bir emir defteriyle takas.                                                                                                                     |
|  | En yüksek teklifi verenin kazandığı ve ikinci en yüksek teklifi ödediği bir müzayede. Bu versiyon, teklifleri gizlemediğinden (ikinci fiyat müzayedelerinin temel bir yönü) **üretimde kullanılmamalıdır**. |
|            | Bir varlık için bir emir defteri içeren temel bir değişim, ikinci bir varlıkta fiyatlandırılmıştır.                                                                                                                                           |

## Yönetim Sözleşmesi

| Sözleşme                           | Açıklama                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
|  | Oylamalarının, escrow edilmiş yönetim jetonları ile ağırlıklandırıldığı bir coin oylama sözleşmesi. |

## Mintleme Sözleşmeleri

| Sözleşme                                   | Açıklama                                                                  |
| ------------------------------------------ | ---------------------------------------------------------------------------- |
|            | Fungible token mintlemenin bir örneği.                                       |
|  | NFT'leri mintleyen ve bunları ayrı bir satış sözleşmesi aracılığıyla satan bir sözleşme. |

## Çeşitli Sözleşmeler

| Sözleşme                               | Açıklama                                                                                                                                                                             |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|         | Belirli bir dijital varlıkın mülkiyeti ile bir eylemi gerçekleştirme becerisini nasıl ilişkilendirebileceğinize dair bir örnek. Bu durumda, bir pikselin sahibiyseniz, o pikseli renklendirebilirsiniz. |
|  | Kullanıcının yatırdığını geri veren önemsiz bir sözleşme.                                                                                                                           |