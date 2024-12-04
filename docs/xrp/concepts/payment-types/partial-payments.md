---
title: Kısmi Ödemeler
seoTitle: Kısmi Ödemeler - XRP Defteri
sidebar_position: 4
description: Kısmi ödemeler, gönderilen tutardan ücretleri düşerek esnek bir miktar sunar. Bu, ek maliyetler doğurmadan istenmeyen ödemelerin iadesi için faydalıdır.
tags: 
  - kısmi ödemeler
  - ödeme işlemi
  - XRP Defteri
  - dolandırıcılık
keywords: 
  - kısmi ödemeler
  - ödeme işlemi
  - teslim edilen miktar
  - XRP Defteri
  - dolandırıcılık
  - finans kurumları  
  - API
---

# Kısmi Ödemeler

:::warning 
Bu sayfa, `Ödeme` işlemlerinde ve çeşitli API yöntemlerinde görünen `Miktar` alanının spesifikasyonlarını açıklar. `Miktar` ve kısmi ödemelerle ilgili bağlamsal bilgiler hâlâ geçerli olsa da, bu alan `rippled` [API v2][] ile birlikte `DeliverMax` olarak yeniden adlandırılmıştır. Bu, alan adını davranışına daha özgül hale getirmek ve aşağıda açıklanan yanlış anlamaları ve istismarı önlemeye yardımcı olmak amacıyla yapılmıştır.
:::

Herhangi bir [Ödeme işlemi][] gönderen, `"Kısmi Ödeme" bayrağını` etkinleştirebilir ve `Miktar` alanında belirtilen tutardan daha az bir ödeme gönderebilir. Herhangi bir Ödemeyi işlerken, `Miktar` alanını değil, `delivered_amount` meta veri alanını kullanın. `delivered_amount`, bir ödemenin gerçekten sunduğu tutarı ifade eder.

> Eğer bir Ödeme, Kısmi Ödeme bayrağını etkinleştirmezse, XRP Defteri'ndeki bir [Ödeme işleminin][] `Miktar` alanı, döviz kurları ve `transfer ücretleri` için kesintiler yapıldıktan sonra teslim edilecek tutarı belirler. — 

Kısmi Ödeme bayrağı (`tfPartialPayment`), bir ödemenin gönderilen miktarı artırmak yerine alınan miktarı azaltarak başarılı olmasına olanak tanır. Kısmi ödemeler, `ödemelerin iadesinde` ek maliyetler doğurmadan faydalıdır.

---

`İşlem maliyeti` için kullanılan XRP tutarı, işlem türünden bağımsız olarak her zaman gönderenin hesabından düşülür. Bu işlem maliyeti veya ücreti, `Miktar`’a dahil edilmez.

Kısmi ödemeler, XRP Defteri ile naif entegrasyonları istismar ederek borsalardan ve geçitlerden para çalmak için kullanılabilir. Bu belgenin `Kısmi Ödeme İstismarı` bölümü, bu istismarın nasıl çalıştığını ve ondan nasıl kaçınabileceğinizi açıklar.

## Anlamlar

### Kısmi Ödeme Olmadan

Kısmi Ödeme bayrağını kullanmadan bir Ödeme gönderirken, işlemin `Miktar` alanı, teslim edilecek kesin tutarı belirtir ve `SendMax` alanı ise gönderilecek maksimum miktar ve para birimini belirtir. Eğer bir ödeme, `SendMax` parametresini aşmadan tam `Miktar`'ı teslim edemezse veya başka bir nedenle tam tutar teslim edilemezse, işlem başarısız olur. Eğer işlem talimatlarından `SendMax` alanı çıkarılırsa, bu alan `Miktar` ile eşit kabul edilir. Bu durumda, ödeme yalnızca toplam ücret miktarı 0 olduğunda başarılı olabilir.

Diğer bir deyişle:

```
Miktar + (ücretler) = (gönderilen miktar) ≤ SendMax
```

Bu formülde "ücretler", `transfer ücretlerini` ve döviz kurlarını ifade eder. "Gönderilen miktar" ve teslim edilen miktar (`Miktar`) farklı para birimlerinde ifade edilebilir ve XRP Defteri'nin merkeziyetsiz borsa işlemleriyle dönüştürülebilir.

:::info 
İşlemin `Ücret` alanı, işlemi ağa iletmek için yok edilen XRP `işlem maliyetini` ifade eder. Belirtilen kesin işlem maliyeti her zaman gönderen hesabından düşülür ve herhangi bir ödeme türü için ücret hesaplamalarından tamamen ayrıdır.
:::

### Kısmi Ödemeler ile

Kısmi Ödeme bayrağı etkinleştirilmiş bir Ödeme gönderirken, işlemin `Miktar` alanı, teslim edilecek maksimum tutarı belirtir. Kısmi ödemeler, ücretler, yetersiz likidite, alıcının hesap güven hatlarındaki yeterli alan olmaması veya diğer nedenler dahil olmak üzere sınırlamalara rağmen bazı amaçlanan değeri göndermede başarılı olabilir.

İsteğe bağlı `DeliverMin` alanı, teslim edilecek minimum tutarı belirtir. `SendMax` alanı, kısmi olmayan ödemelerdeki gibi işlev görür. Kısmi ödeme işlemi, herhangi bir miktarı `DeliverMin` alanı kadar veya daha fazla teslim ederse ve `SendMax` miktarını aşmazsa başarılı olur. Eğer `DeliverMin` alanı belirtilmemişse, kısmi bir ödeme her pozitif miktarı teslim ederek başarılı olabilir.

Diğer bir deyişle:

```
Miktar ≥ (Teslim Edilen Miktar) = SendMax - (Ücretler) ≥ DeliverMin > 0
```

### Kısmi Ödeme Sınırlamaları

Kısmi Ödemelerin aşağıdaki sınırlamaları vardır:

- Bir kısmi ödeme, bir adresi finanse etmek için XRP sağlamakta başarısız olur; bu durumda [sonuç kodu][] `telNO_DST_PARTIAL` döner.
- Doğrudan XRP'den XRP'ye ödemeler kısmi ödemeler olamaz; bu durumda [sonuç kodu][] `temBAD_SEND_XRP_PARTIAL` döner.
    - Ancak, XRP'nin para birimlerinden biri olduğu döviz cinsinden ödemeler kısmi ödemeler olabilir.

### `delivered_amount` Alanı

Kısmi bir ödemenin gerçekten ne kadar teslim edildiğini anlamaya yardımcı olmak için, başarılı bir Ödeme işleminin meta verileri `delivered_amount` alanını içerir. Bu alan, `Miktar` alanıyla aynı formatta gerçekten teslim edilen tutarı tanımlar.

Kısmi olmayan ödemelerde, işlemin meta verilerindeki `delivered_amount` alanı, işlemin `Miktar` alanına eşittir. Bir ödeme `tokenlar` teslim ettiğinde, `delivered_amount`, yuvarlama nedeniyle `Miktar` alanından biraz farklı olabilir.

Teslim edilen miktar, **her iki** aşağıdaki kriteri karşılayan işlemler için **mevcut değildir**:

- Kısmi bir ödemedir.
- 2014-01-20 tarihinden önce doğrulanmış bir deftere dahildir.

Her iki durum da doğruysa, `delivered_amount` gerçek bir miktar yerine `unavailable` string değeri içerir. Eğer bu oluyorsa, gerçek teslim edilen miktarı, işlemin meta verilerindeki `AffectedNodes`'u okuyarak belirleyebilirsiniz. Eğer işlem tokenları teslim ettiyse ve `Miktar` alanının `issuer`'ı `Destination` adresiyle aynı hesapsa, teslim edilen miktar farklı karşı taraflara ait güven hatları temsil eden birden fazla `AffectedNodes` üyesine bölünebilir.

`delivered_amount` alanını aşağıdaki yerlerde bulabilirsiniz:

| API | Yöntem | Alan |
|-----|--------|-------|
| [JSON-RPC / WebSocket][] | [account_tx yöntemi][] | `result.transactions` dizisi üyelerinin `meta.delivered_amount` |
| [JSON-RPC / WebSocket][] | [tx yöntemi][] | `result.meta.delivered_amount` |
| [JSON-RPC / WebSocket][] | [transaction_entry yöntemi][] | `result.metadata.delivered_amount` |
| [JSON-RPC / WebSocket][] | [ledger yöntemi][] (işlemler genişletilmiş olarak) | `result.ledger.transactions` dizisi üyelerinin `metaData.delivered_amount` |
| [WebSocket][] | `İşlem abonelikleri` | Abonelik mesajlarının `meta.delivered_amount` |
| ripple-lib v1.x | `getTransaction` yöntemi | `outcome.deliveredAmount` |
| ripple-lib v1.x | `getTransactions` yöntemi | dizi üyelerinin `outcome.deliveredAmount` |


## Kısmi Ödeme İstismarı

Bir finans kurumunun XRP Defteri ile olan entegrasyonu, bir Ödeme işleminin `Miktar` alanının her zaman teslim edilen tam miktar olduğunu varsayıyorsa, kötü niyetli aktörler bu varsayımı istismar ederek kurumu dolandırabilir. Bu istismar, bu kurumların yazılımı kısmi ödemeleri doğru bir şekilde işleme almadığı sürece geçitlere, borsalara veya satıcılara karşı kullanılabilir.

> Gelen Ödeme işlemlerini doğru bir şekilde işlemek için `delivered_amount meta veri alanını` kullanmak gerekir, `Miktar` alanını değil. Bu şekilde, bir kurum ne kadar gerçekten aldığından asla yanılgıya düşmez. — 

### İstismar Senaryosu Adımları

Hedeflenen bir finans kurumunu istismar etmek için, kötü niyetli bir aktör şu şekilde hareket eder:

1. Kötü niyetli aktör, kuruma bir Ödeme işlemi gönderir. Bu işlem büyük bir `Miktar` alanına sahiptir ve **`tfPartialPayment`** bayrağı etkinleştirilmiştir.
2. Kısmi ödeme başarılı olur (sonuç kodu `tesSUCCESS`), ancak belirtilen para biriminden yalnızca çok küçük bir miktar teslim eder.
3. Hedef alınan kurum, işlem `Miktar` alanını okumakta ve `Flags` alanına ya da `delivered_amount` meta veri alanına bakmamaktadır.
4. Hedef alınan kurum, sadece XRP Defteri’nde daha küçük bir `delivered_amount` almasına rağmen, kötü niyetli aktörü kendi dış sisteminde, örneğin kurumun kendi defterinde, tam `Miktar` için kredi tanımlar.
5. Kötü niyetli aktör, hedef alınan kurumun bu farkı fark etmeden önce mümkün olduğunca fazla bakiyeyi başka bir sisteme çeker.
    - Kötü niyetli aktörler genellikle bakiyeyi diğer bir kripto para birimi olan Bitcoin'e dönüştürmeyi tercih eder, çünkü blok zinciri işlemleri genellikle geri alınamaz. Bir fiat para birimi sistemine yapılan bir çekimle, finans kurumu işlemi birkaç gün sonra geri alabilir veya iptal edebilir.
    - Bir borsa durumunda, kötü niyetli aktör XRP bakiyesini doğrudan XRP Defteri'ne geri çekebilir.

Bir satıcı durumunda, işlemlerin sırası biraz farklıdır, ancak kavram aynıdır:

1. Kötü niyetli aktör, büyük miktarda mal veya hizmet satın almak için talepte bulunur.
2. Hedef alınan satıcı, kötü niyetli aktör için bu mal ve hizmetlerin ücretini fatura eder.
3. Kötü niyetli aktör, satıcıya bir Ödeme işlemi gönderir. Bu işlem büyük bir `Miktar` alanına sahiptir ve **`tfPartialPayment`** bayrağı etkinleştirilmiştir.
4. Kısmi ödeme başarılı olur (sonuç kodu `tesSUCCESS`), ancak yalnızca belirtilen para biriminden çok küçük bir miktar teslim eder.
5. Hedef alınan satıcı, işlem `Miktar` alanını okumakta ve `Flags` alanına veya `delivered_amount` meta veri alanına bakmamaktadır.
6. Hedef alınan satıcı, faturayı ödendi olarak kabul eder ve kötü niyetli aktöre mal ve hizmetleri sağlamaktadır, yalnızca XRP Defteri’nde daha küçük bir `delivered_amount` almasına rağmen.
7. Kötü niyetli aktör, satıcının bu farkı fark etmeden önce mal ve hizmeti kullanır, yeniden satar veya elden çıkarır.

### Ek Önlemler

Gelen işlemleri işlerken `delivered_amount alanını` kullanmak, bu istismardan kaçınmak için yeterlidir. Bununla birlikte, ek proaktif iş uygulamaları, bu ve benzeri istismarların muhtemel olasılığını azaltabilir veya önleyebilir. Örneğin:

- Çekimleri işlemek için iş mantığınıza ek sağduyu kontrolleri ekleyin. XRP Defteri'ndeki toplam bakiyeniz, beklenen varlıklarınız ve yükümlülüklerinizle eşleşmiyorsa asla bir çekim işlemi gerçekleştirmeyin.
- "Müşterinizi Tanıyın" yönergelerine uyun ve müşterilerinizin kimliklerini sıkı bir şekilde doğrulayın. Kötü niyetli kullanıcıları önceden tanıyabilir ve engelleyebilir veya sisteminizi istismar eden bir kötü niyetli aktör hakkında hukuki işlem başlatabilirsiniz.

## Ayrıca Bakınız

- **Araçlar:**
    - `İşlem Gönderen`
- **Kavramlar:**
    - `İşlemler`
- **Eğitimler:**
    - `İşlem Sonuçlarını Ara`
    - `WebSocket ile Gelen Ödemeleri İzleme`
    - `Özel Ödeme Türlerini Kullanma`
    - `XRP'yi Bir Borsa Olarak Listele`
- **Referanslar:**
    - [Ödeme işlemi][]
    - `İşlem Meta Verisi`
    - [account_tx yöntemi][]
    - [tx yöntemi][]

