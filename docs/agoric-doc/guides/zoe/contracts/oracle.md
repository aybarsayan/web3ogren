---
id: oracle-query-contract
title: Oracle Sorgu Sözleşmesi
---



#####  (Son güncellenme: 31 Ocak 2022)

##### 

**NOT: Bu sözleşmeyi doğrudan kullanmak istemiyorsunuzdur. Bunun yerine, lütfen  okuyun.**

Bu sözleşme, diğer sözleşmelerin veya kullanıcıların genel bir oracle düğümüne (tek bir örnek) tek seferlik ücretsiz veya ücretli sorgular yapmasına izin verir. Bu, bireysel bir off-chain oracle düğümünün yanıtlarını verdiği tekli sorgular vermek için çok düşük seviyeli bir API sağlar.

**DİKKAT: Oracle ağlarının (örneğin, Chainlink) güvenliği, bireysel düğümlerin sonuçlarını birleştirmek için daha yüksek seviyeli sözleşmelere dayanır (bu düşük seviyeli sözleşme). Bu, bireysel bir düğümün kötüye kullanımına karşı koruma sağlar.**

Sadece tek bir düğüme güvenmek hem maliyetli hem de riskli olabilir. Bunun yerine,  açıklanan daha yüksek seviyeli API'leri kullanın.

## Ücretsiz Sorgu Yapma

Ücretsiz bir sorgu yapmak için oracle sözleşme örneği için `publicFacet` alın.

<<< @/../snippets/zoe/contracts/test-oracle.js#freeQuery

Geçerli olan `query`, oracle'ın kabul ettiği herhangi bir biçimde olabilir. Yanıt, oracle'ın belirleyeceği herhangi bir biçimde olabilir.

## Ücretli Sorgu Yapma

Ödeme gerektiren bir sorgu yapmak için daha önce olduğu gibi `publicFacet` alın, ancak bu sefer bir `queryInvitation` oluşturun. `queryInvitation`’ı kullanarak bir teklif yapın ve gereken ödemeleri `Fee` markasında güvenceye alın. Yanıtınız, teklifinizin sonucu olacaktır.

<<< @/../snippets/zoe/contracts/test-oracle.js#paidQuery

## Yeni Bir Oracle Sözleşmesi Oluşturma

Kendi oracle sözleşme örneğinizi oluşturmak istiyorsanız, önce kodu paketleyin ve eğer daha önce kurulmamışsa kurulum yapın.

<<< @/../snippets/zoe/contracts/test-oracle.js#bundle

Ardından sözleşme örneğini başlatın. Bir `publicFacet` ve `creatorFacet` alacaksınız.

<<< @/../snippets/zoe/contracts/test-oracle.js#startInstance

`oracleHandler`'ı başlatmak için creatorFacet'i kullanmanız gerekecek. `oracleHandler`, gerçekten sorgulanacak olan bileşendir, bu yüzden bunu kamuya açık sözleşme koşullarına dahil etmek istemiyoruz.

<<< @/../snippets/zoe/contracts/test-oracle.js#initialize

## Oracle Handler API'si

Sözleşme, tüm `oracleHandlers`’dan aşağıdaki API'yi sunmasını bekler:

<<< @/../snippets/zoe/contracts/test-oracle.js#API