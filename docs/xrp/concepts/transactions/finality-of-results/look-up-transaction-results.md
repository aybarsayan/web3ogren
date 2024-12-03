---
title: İşlem Sonuçlarını Ara
seoTitle: XRP Ledger İşlem Sonuçları Rehberi
sidebar_position: 4
description: XRP Ledger üzerinde işlemlerin sonuçlarını nasıl bulabileceğinizi öğrenin. İşlem onay durumu, meta veriler ve sorgulama yöntemleri hakkında bilgiler içerir.
tags: 
  - XRP Ledger
  - işlem sonuçları
  - işlem meta verisi
  - defter onayı
  - işlem durumu
keywords: 
  - XRP Ledger
  - işlem sonuçları
  - işlem meta verisi
  - defter onayı
  - işlem durumu
---

# İşlem Sonuçlarını Ara

XRP Ledger'ı etkili bir şekilde kullanmak için, `işlem` sonuçlarını anlamanız gerekir: işlem **başarılı** mı oldu? Ne yaptı? **Başarısız** olduysa, neden?

XRP Ledger paylaşılan bir sistemdir; tüm veriler kamuya açık ve dikkatlice kaydedilmiş olup her yeni `defter versiyonu` ile güvenli bir şekilde güncellenir. **Herkes**, herhangi bir işlemin kesin sonucunu arayabilir ve ne yaptığını görmek için `işlem meta verilerini` okuyabilir.

Bu belge, bir işlemin neden belirli bir sonuca ulaştığını bilmenin düşük seviyede nasıl yapılacağını açıklamaktadır. Bir son kullanıcı için, işlemin işlenmiş görünümüne bakmak daha kolaydır. Örneğin, herhangi bir kaydedilmiş işlemin İngilizce dilinde tanımını almak için [XRP Charts'ı kullanabilirsiniz](https://xrpcharts.ripple.com/#/transactions/).

## Ön Koşullar

Bu talimatlarda açıklandığı gibi bir işlemin sonucunu anlamak için şunları bilmeniz gerekir:

- Hangi işlemi anlamak istediğinizi bilmelisiniz. Eğer işlemin [tanımlayıcı hash'ini][] biliyorsanız, bu şekilde arama yapabilirsiniz. Ayrıca son işlenmiş defterdeki işlemlere veya belirli bir hesabı en son etkileyen işlemlere de bakabilirsiniz.
- Güvenilir bilgi sağlayan ve işlemin gönderildiği zaman gerekli geçmişe sahip bir `rippled` sunucusuna erişiminiz olmalıdır.
    - Son zamanlarda gönderdiğiniz işlemlerin sonuçlarını aramak için, gönderdiğiniz sunucunun yeterli olması gerekir; yeter ki o süre zarfında ağ ile senkronizasyonu sürdürsün.
    - Eski işlemlerin sonuçları için `tam geçmiş sunucusu` kullanmak isteyebilirsiniz.

:::tip
XRP Ledger'dan işlemler hakkında veri sorgulamanın başka yolları da vardır; bunlar arasında `Veri API'si` ve diğer dışarıya aktarılan veritabanları bulunur; ancak bu arayüzler yetkili değildir. Bu belge, `rippled` API'sini doğrudan kullanarak veri aramanın nasıl yapılacağını açıklar, böylece mümkün olan en doğrudan ve yetkili sonuçları alırsınız.
:::

## 1. İşlem Durumunu Al

Bir işlemin başarılı mı yoksa başarısız mı olduğunu bilmek iki parçalı bir sorudur:

1. İşlem onaylanmış bir defterde yer aldı mı?
2. Eğer yer aldıysa, sonuç olarak defter durumunda ne gibi değişiklikler oldu?

Bir işlemin onaylanmış bir defterde yer alıp almadığını bilmek için genellikle onun içinde olabileceği tüm defterlere erişmeniz gerekir. Bunu yapmanın en basit ve en güvenilir yolu, işlemi `tam geçmiş sunucusunda` aramaktır. [tx yöntemi][], [account_tx yöntemi][] veya `rippled`'an gelen diğer yanıtları kullanın. `"validated": true` değerini arayın; bu, yanıtın konsensüs tarafından onaylanmış bir defter versiyonunu kullandığını gösterir.

- Eğer sonuç `"validated": true` değerine sahip değilse, sonuç geçici olabilir ve işlemin sonucunun kesin olup olmadığını bilmek için **defterin onaylanmasını** beklemeniz gerekir.
- Eğer sonuçta işleminiz bulunmuyorsa veya `txnNotFound` hatası dönerse, o zaman işlem sunucunun sahip olduğu mevcut tarihte herhangi bir defterde yoktur. Bu, işlemin **başarısız** olduğu anlamına gelebilir ya da gelmeyebilir. Bunun nedeni, işlemin onaylanmış bir defter versiyonunda bulunup bulunmadığı ve gelecekte onaylanmış bir deftere dahil olup olmayabileceğidir. 

Bir işlemin hangi defterlerde bulunabileceğini daraltmak için şunları bilmelisiniz:
- İşlemin içinde olabileceği en erken defter, işlemin ilk gönderildiği _andan sonra_ onaylanmış **ilk defter**.
- İşlemin içinde olabileceği son defter, işlemin `LastLedgerSequence` alanı tarafından tanımlanır.

Aşağıdaki örnek, [tx yöntemi][] tarafından döndürülen onaylanmış bir defter versiyonunda yer alan başarılı bir işlemi göstermektedir. JSON yanıtındaki alanların sırası yeniden düzenlenmiş olup, anlaşılması daha kolay olması için bazı kısımlar atlanmıştır:

```json
{
  "TransactionType": "AccountSet",
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Sequence": 376,
  "hash": "017DED8F5E20F0335C6F56E3D5EE7EF5F7E83FB81D2904072E665EEA69402567",

  ... (atlandı) ...

  "meta": {
    "AffectedNodes": [
      ... (atlandı) ...
    ],
    "TransactionResult": "tesSUCCESS"
  },
  "ledger_index": 46447423,
  "validated": true
}
```

> Bu örnekte, [AccountSet işlemi][] tarafından gönderilmiş olan `hesap` adresi `rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn`, [Sıra numarası][] 376 kullanmaktadır. İşlemin [tanımlayıcı hash'i][] `017DED8F5E20F0335C6F56E3D5EE7EF5F7E83FB81D2904072E665EEA69402567` ve sonucu `sonuç` `tesSUCCESS` olarak belirlenmiştir. İşlem, 46447423 defter versiyonuna dahil edilmiştir ve bu defter versiyonu onaylanmış olduğu için sonuçlar kesindir.
— 

### Durum: Onaylanmış Defterde Yer Almadı

**Bir işlem onaylanmış bir defterde yer almazsa, XRP Ledger durumunda _hiçbir_ etki yapmamış olamaz.** 

Eğer işlemin yer almaması kesin değilse, yine de gelecekte onaylanmış bir deftere dahil olabilir. İşlemin şu anki açık deftere uygulanmasının geçici sonuçlarını, işlemin kesin bir defterde hangi etkileri olabileceği hakkında bir önizleme olarak kullanabilirsiniz; ancak bu sonuçlar `birçok faktör` nedeniyle değişebilir.

### Durum: Onaylanmış Defterde Yer Aldı

Eğer işlem _onaylanmış_ bir defterde yer alıyorsa, o zaman `işlem meta verisi` bu işlemi işlerken defter durumuna yapılan tüm değişiklikleri içeren tam bir rapor içerir. Meta verinin `TransactionResult` alanı, sonucu özetleyen bir `işlem sonuc kodu` içerir:

- `tesSUCCESS` kodu, işlemin genelde **başarılı** olduğunu gösterir.
- `tec` sınıf kodu, işlemin başarısız olduğu anlamına gelir ve defter durumu üzerindeki tek etkisi XRP `işlem maliyetini` yok etmek ve muhtemelen `son tarihi geçmiş teklifler` ve `kapalı ödeme kanallarını` kaldırmak olabilir.
- Başka bir kod hiçbir defterde görünemez.

Sonuç kodu, işlemin sonucunun yalnızca bir özetidir. İşlemin ne yaptığını daha ayrıntılı anlamak için, işlemin talimatları ve işlemin gerçekleşmeden önceki defter durumu ile birlikte meta verinin geri kalanını okumalısınız.

## 2. Meta Veriyi Yorumla

İşlem meta verisi, işlemin deftere hangi şekilde uygulandığını _tam olarak_ açıklayan aşağıdaki alanları içerir:

partial file="/docs/_snippets/tx-metadata-field-table.md" /%}

Meta verinin büyük bir kısmı `AffectedNodes` dizisinde` yer almaktadır. Bu dizide ne aramanız gerektiği, işlem türüne bağlıdır. Neredeyse her işlem gönderenin [AccountRoot nesnesini][] yok etmek ve `hesabın Sıra numarasını` artırmak için bir değişiklik yapar.

:::info
Bu kuralın bir istisnası, gerçek bir hesaptan gönderilmeyen `psödo işlemlerdir` ve dolayısıyla bir AccountRoot nesnesini değiştirmezler. `Balance` alanını değiştirmeden AccountRoot nesnesini değiştiren diğer istisnalar da vardır: `ücretsiz anahtar sıfırlama işlemleri` gönderenin XRP bakiyesini değiştirmez; ve işlem tam olarak yok ettiği kadar XRP almasına neden olursa, hesap bakiyesi net bir değişiklik göstermez. (XRP'nin net azalışı, başka bir yerde metadata içinde, XRP'yi gönderen hesaptan alınması ile gerçekleşir).
:::

Aşağıdaki örnek, yukarıda adım 1'den gelen tam yanıtı göstermektedir. Deftere hangi değişikliklerin yapıldığını anlamaya çalışın:

```json
{
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Fee": "12",
  "Flags": 2147483648,
  "LastLedgerSequence": 46447424,
  "Sequence": 376,
  "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
  "TransactionType": "AccountSet",
  "TxnSignature": "30450221009B2910D34527F4EA1A02C375D5C38CF768386ACDE0D17CDB04C564EC819D6A2C022064F419272003AA151BB32424F42FC3DBE060C8835031A4B79B69B0275247D5F4",
  "date": 608257201,
  "hash": "017DED8F5E20F0335C6F56E3D5EE7EF5F7E83FB81D2904072E665EEA69402567",
  "inLedger": 46447423,
  "ledger_index": 46447423,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
          "FinalFields": {
            "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "AccountTxnID": "017DED8F5E20F0335C6F56E3D5EE7EF5F7E83FB81D2904072E665EEA69402567",
            "Balance": "396015164",
            "Domain": "6D64756F31332E636F6D",
            "EmailHash": "98B4375E1D753E5B91627516F6D70977",
            "Flags": 8519680,
            "MessageKey": "0000000000000000000000070000000300",
            "OwnerCount": 9,
            "Sequence": 377,
            "TransferRate": 4294967295
          },
          "PreviousFields": {
            "AccountTxnID": "E710CADE7FE9C26C51E8630138322D80926BE91E46D69BF2F36E6E4598D6D0CF",
            "Balance": "396015176",
            "Sequence": 376
          },
          "PreviousTxnID": "E710CADE7FE9C26C51E8630138322D80926BE91E46D69BF2F36E6E4598D6D0CF",
          "PreviousTxnLgrSeq": 46447387
        }
      }
    ],
    "TransactionIndex": 13,
    "TransactionResult": "tesSUCCESS"
  },
  "validated": true
}
```

> Bu `no-op işlemi` tarafından yapılan _tek_ değişiklik, gönderici hesabını temsil eden [AccountRoot nesnesini][] güncellemektir:
>
> - `Sequence` değeri 376'dan 377'ye yükseltilmiştir.
> - Bu hesapta XRP `Balance` değeri `396015176`'dan `396015164`'a düşmüştür [XRP düşüşleri][]. Bu tam olarak 12 düşüş, işlem için yürütülen `işlem maliyetini` temsil eder; bu da işlemin `Fee` alanında belirtilmiştir.
> - `AccountTxnID` artık bu işlemin bu adresten en son gönderilen işlem olduğunu gösterir.
  
### Genel Amaçlı Muhasebe

Neredeyse her işlem aşağıdaki türde değişikliklere yol açabilir:

- **Sıra ve İşlem Maliyeti değişiklikleri:** `Daha önce belirtildiği gibi, her işlem (psödo işlemler hariç) gönderenin `AccountRoot` nesnesini` değiştirerek gönderenin sıra numarasını artırır ve işlem maliyetini ödemek için kullanılan XRP'yi yok eder.
- **Hesap İlişkilendirmesi:** Bazı nesneleri oluşturan işlemler, ayrıca bir amaçlanan alıcının veya hedef hesabın `AccountRoot nesnesini` de değiştirir ve o hesapla ilişkili bir şeyin değiştiğini gösterir.
  
XRP Ledger, her hesabın ne kadar sahiplik rezervi olduğunu takip eder.

Bir Hesabın `OwnerCount` değerini artırmanın örneği:

```json
{
  "ModifiedNode": {
    "FinalFields": {
      "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "Balance": "9999999990",
      "Flags": 0,
      "OwnerCount": 1,
      "Sequence": 2
    },
    "LedgerEntryType": "AccountRoot",
    "LedgerIndex": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05",
    "PreviousFields": {
      "Balance": "10000000000",
      "OwnerCount": 0,
      "Sequence": 1
    },
    "PreviousTxnID": "B24159F8552C355D35E43623F0E5AD965ADBF034D482421529E2703904E1EC09",
    "PreviousTxnLgrSeq": 16154
  }
}
```

:::success
Eğer işlem XRP gönderiyor veya alıyorsa, gönderenin bakiye değişiklikleri işlem maliyeti ile birleştirilir ve `Balance` alanında tek bir değişiklik olarak gösterilir. Örneğin, eğer 1 XRP (1,000,000 drops) gönderdiyseniz ve işlem maliyeti için 10 drops yok ettiyseniz, metadata, `Balance`'ın 1,000,010 drops XRP azaldığını gösterir.
:::

---
title: Token Ödemeleri
seoTitle: Token Ödemeleri ve Defter Üzerindeki Etkileri
sidebar_position: 11
description: Token içeren ödemelerin nasıl çalıştığını ve bunların defter üzerindeki etkilerini keşfedin. Güven hatları ve meta veriler ile ilgili önemli bilgileri içermektedir.
keywords: [token ödemeleri, güven hatları, Ripple, meta veriler, çapraz döviz ödemeleri, Teklifler, Escrow]
---

#### Token Ödemeleri

Token içeren ödemeler biraz daha karmaşıktır.

Token bakiyelerindeki tüm değişiklikler, `RippleState nesneleri` içinde yansıtılır; bu nesneler `güven hatlarını` temsil eder. 

> Bir tarafın güven hattındaki bakiyesindeki artış, karşı tarafın bakiyesinin eşit bir miktarda azaldığı olarak kabul edilir; bu meta verilerde, yalnızca paylaşılan `Balance` üzerindeki tek bir değişiklik olarak kaydedilir. 
> — Ripple Protokol Belgesi

Bu değişikliğin "artış" veya "azalış" olarak kaydedilmesi, hangi hesabın sayısal olarak daha yüksek bir adrese sahip olduğuna bağlıdır.

Tek bir ödeme, birkaç güven hattı ve piyasa kitabından oluşan uzun bir `yolda` geçebilir. Tarafları dolaylı olarak bağlamak için birkaç güven hattındaki bakiyeleri değiştirme sürecine `rippling` denir. İşlemde belirtilen `issuer` değerine bağlı olarak, teslim edilen miktarın hedef hesaba bağlı birden fazla güven hatları (`RippleState` hesapları) arasında bölünmesi de mümkündür.

:::tip Meta verilerde değiştirilen nesnelerin sunulma sırası, ödeme işlenirken ziyaret edilen nesnelerin sırası ile uyumlu olmayabilir. Ödeme yürütmesini daha iyi anlamak için, `AffectedNodes` üyelerini yeniden sıralamak, fonların defterde geçirdiği yolları yeniden oluşturmakta yardımcı olabilir.:::

Çapraz döviz ödemeleri, farklı para birimi kodları ve émetörler arasında değişim yapmak için kısmen veya tamamen `Teklifleri` tüketir. Bir işlem, `Offer` türleri için `DeletedNode` nesneleri gösteriyorsa, bu tamamen tüketilen bir teklifi veya işlem sırasında `süresi dolmuş veya finansmanı olmayan` bir teklifi gösterir. Bir işlemde `ModifiedNode` türü `Offer` görünüyorsa, bu kısmen tüketilen bir teklifi gösterir.

`QualityIn` ve `QualityOut` güven hatları ayarları`, bir tarafın token'ı nasıl değerlendirdiğini etkileyebilir; bu nedenle, bakiyelerdeki sayısal değişiklik, gönderenin token'ı nasıl değerlendirdiğinden farklı olabilir. `delivered_amount`, alıcı tarafından değer verilen miktarı gösterir.

Gönderilecek veya alınacak miktar `token hassasiyeti` dışında ise, bir tarafın diğer tarafında işlem sırasında yuvarlandığında hiç olmama durumunda bir miktarın hesaplarından eksilmesi mümkündür. Bu nedenle, iki taraf arasındaki bakiyeler 1016 faktörü ile farklı olduğunda, yuvarlama küçük miktarların "oluşmasına" veya "yok olmasına" neden olabilir. (XRP asla yuvarlanmaz, bu yüzden XRP ile bu mümkün değildir.)

`Yolların` uzunluğuna bağlı olarak, çapraz döviz ödemeleri için meta veriler _uzun_ olabilir. Örneğin, [işlem 8C55AFC2A2AA42B5CE624AEECDB3ACFDD1E5379D4E5BF74A8460C5E97EF8706B](https://xrpcharts.ripple.com/#/transactions/8C55AFC2A2AA42B5CE624AEECDB3ACFDD1E5379D4E5BF74A8460C5E97EF8706B), `rHaaans...` tarafından çıkarılan 2.788 GCB teslim etti; XRP harcadı ama 2 émetörden USD üzerinden geçti, XRP'yi 2 hesaba ödedi, `r9ZoLsJ...` adresinden finansmanı olmayan bir teklifi kaldırdı ve toplamda 17 farklı defter nesnesi üzerinde muhasebe yaptı. 

---

### Teklifler

Bir [OfferCreate işlemi][] bir nesne oluşturmaya neden olabilir veya neden olmayabilir; bu, ne kadar eşleştiğine ve işlemin `tfImmediateOrCancel` gibi bayraklar kullanıp kullanmadığına bağlıdır. İşlemde yeni bir Teklif eklenip eklenmediğini görmek için `"LedgerEntryType": "Offer"` ile bir `CreatedNode` girişi arayın. Örneğin:

```json
{
  "CreatedNode": {
    "LedgerEntryType": "Offer",
    "LedgerIndex": "F39B13FA15AD2A345A9613934AB3B5D94828D6457CCBB51E3135B6C44AE4BC83",
    "NewFields": {
      "Account": "rETSmijMPXT9fnDbLADZnecxgkoJJ6iKUA",
      "BookDirectory": "CA462483C85A90DB76D8903681442394D8A5E2D0FFAC259C5B0C59269BFDDB2E",
      "Expiration": 608427156,
      "Sequence": 1082535,
      "TakerGets": {
        "currency": "EUR",
        "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
        "value": "2157.825"
      },
      "TakerPays": "7500000000"
    }
  }
}
```

`Offer` türünde bir `ModifiedNode`, eşleşmiş ve kısmen tüketilmiş bir Teklif gösterir. Tek bir işlem büyük sayıda Teklifi tüketebilir. İki token'i değiştirmek için bir Teklif, `oto-abridge` nedeniyle XRP ticareti Tekliflerini de tüketebilir. Bir değişim tamamen veya kısmen otomatik olarak köprülenebilir.

`Offer` türünde bir `DeletedNode`, tamamen tüketmiş bir eşleşen Teklif, işlem sırasında `süresi dolmuş veya finansmanı olmayan` bir Teklif veya yeni bir Teklifin yerleştirilmesi sırasında iptal edilen bir Teklif gösterebilir. İptal edilen bir Teklifi tanımak için, onun yerleştiricisinin, onu silmek faaliyetinde bulunan işlemci olması gerektiğini bilirsiniz.

Silinmiş bir Teklif örneği:

```json
{
  "DeletedNode": {
    "FinalFields": {
      "Account": "rETSmijMPXT9fnDbLADZnecxgkoJJ6iKUA",
      "BookDirectory": "CA462483C85A90DB76D8903681442394D8A5E2D0FFAC259C5B0C595EDE3E1EE9",
      "BookNode": "0000000000000000",
      "Expiration": 608427144,
      "Flags": 0,
      "OwnerNode": "0000000000000000",
      "PreviousTxnID": "0CA50181C1C2A4D45E9745F69B33FA0D34E60D4636562B9D9CDA1D4E2EFD1823",
      "PreviousTxnLgrSeq": 46493676,
      "Sequence": 1082533,
      "TakerGets": {
        "currency": "EUR",
        "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
        "value": "2157.675"
      },
      "TakerPays": "7500000000"
    },
    "LedgerEntryType": "Offer",
    "LedgerIndex": "9DC99BF87F22FB957C86EE6D48407201C87FBE623B2F1BC4B950F83752B55E27"
  }
}
```

Teklifler, hangi Tekliflerin hangi döviz kurlarıyla mevcut olduğunu takip etmek için her iki tür `DirectoryNode nesnelerini` de oluşturabilir, silebilir ve değiştirebilir. Genel olarak, kullanıcıların bu muhasebe ile fazla ilgilenmelerine gerek yoktur.

Bir [OfferCancel işlemi][] `tesSUCCESS` koduna sahip olabilir; bu, silinecek bir Teklif olmadan bile gerçekleşebilir. İşlemin, gerçekten bir Teklifin silindiğini onaylamak için `DeletedNode` türünde bir Teklifi kontrol edin. Eğer değilse, Teklif, önceki bir işlem tarafından zaten silinmiş olabilir veya Teklif iptal işlemi, `OfferSequence` alanında yanlış bir sıra numarası kullanmış olabilir.

Bir OfferCreate işlemi, bir `CreatedNode` türü `RippleState` gösteriyorsa, bu `Teklifin bir güven hattı oluşturduğunu` gösterir.

---

---
title: Escrowlar
seoTitle: Escrowlar - XRP Protokolü
sidebar_position: 4
description: Escrow işlemleri, XRP protokolünde mülklerin güvenli bir şekilde yönetilmesini sağlar. Bu bölümde EscrowCreate, EscrowFinish ve EscrowCancel işlemlerinin nasıl çalıştığı açıklanmaktadır.
tags:
  - escrow
  - XRP
  - finans
keywords:
  - escrow işlemleri
  - XRP protokolü
  - finansal sistemler
---

## Escrowlar

Başarılı bir [EscrowCreate işlemi][] defterde bir `Escrow nesnesi` oluşturur. `Escrow` türünde bir `CreatedNode` girişi arayın. `NewFields`, yerleştirilen XRP miktarına karşılık gelen bir `Amount` göstermelidir; ve diğer özellikler belirtilen şekilde olmalıdır.

Başarılı bir EscrowCreate işlemi, gönderenden aynı miktarda XRP'yi de alır. `Account` alanının, işlem talimatlarındaki `Account` ile eşleştiği bir `ModifiedNode` türü `AccountRoot` arayın. `Balance`, escrowed XRP nedeniyle düşüşü göstermelidir (ve işlem maliyeti ödemek için yok edilen XRP'yi).

Başarılı bir [EscrowFinish işlemi][] alıcının `AccountRoot` nesnesini değiştirir; XRP bakiyelerini artırır ( `Balance` alanında), `Escrow` nesnesini siler ve escrow'un yaratıcısının sahiplik sayısını azaltır. Escrow'un yaratıcısı, alıcısı ve sonlandırıcısı farklı hesaplar veya aynı hesaplar olsa da, bu, **_bir ile üç_** arasında `ModifiedNode` türü `AccountRoot` nesnesinin ortaya çıkabilmesine neden olabilir. Başarılı bir [EscrowCancel işlemi][] çok benzerdir; ancak XRP'yi escrowun orijinal yaratıcısına geri gönderir.

:::tip
Bir EscrowFinish yalnızca escrowun şartlarını karşılıyorsa başarılı olabilir; bir EscrowCancel yalnızca Escrow nesnesinin süresi kapanma zamanından önce ise başarılı olabilir.
:::

Escrow işlemleri, göndericinin mülkiyet rezervini ve ilgili hesapların dizinlerini ayarlamak için normal `muhasebe` gerçekleştirir.

Aşağıdaki alıntıda, `r9UUEX...`'in bakiyesi 1 milyar XRP artmakta ve mülke sahiplik sayısı 1 düşmektedir, çünkü o hesaptan kendisine bir escrow başarıyla tamamlanmıştır. `Sequence` numarası değişmez, çünkü [üçüncü bir taraf escrowu tamamlamıştır](https://xrpcharts.ripple.com/#/transactions/C4FE7F5643E20E7C761D92A1B8C98320614DD8B8CD8A04CFD990EBC5A39DDEA2):

> ```json
> {
>   "ModifiedNode": {
>     "FinalFields": {
>       "Account": "r9UUEXn3cx2seufBkDa8F86usfjWM6HiYp",
>       "Balance": "1650000199898000",
>       "Flags": 1048576,
>       "OwnerCount": 11,
>       "Sequence": 23
>     },
>     "LedgerEntryType": "AccountRoot",
>     "LedgerIndex": "13FDBC39E87D9B02F50940F9FDDDBFF825050B05BE7BE09C98FB05E49DD53FCA",
>     "PreviousFields": {
>       "Balance": "650000199898000",
>       "OwnerCount": 12
>     },
>     "PreviousTxnID": "D853342BC27D8F548CE4D7CB688A8FECE3229177790453BA80BC79DE9AAC3316",
>     "PreviousTxnLgrSeq": 41005507
>   }
> },
> {
>   "DeletedNode": {
>     "FinalFields": {
>       "Account": "r9UUEXn3cx2seufBkDa8F86usfjWM6HiYp",
>       "Amount": "1000000000000000",
>       "Destination": "r9UUEXn3cx2seufBkDa8F86usfjWM6HiYp",      
>       "FinishAfter": 589075200,
>       "Flags": 0,
>       "OwnerNode": "0000000000000000",
>       "PreviousTxnID": "D5FB1C7D18F931A4FBFA468606220560C17ADF6DE230DA549F4BD11A81F19DFC",
>       "PreviousTxnLgrSeq": 35059548
>     },
>     "LedgerEntryType": "Escrow",
>     "LedgerIndex": "62F0ABB58C874A443F01CDCCA18B12E6DA69C254D3FB17A8B71CD8C6C68DB74D"
>   }
> },
> ```

---

## Ödeme Kanalları

Bir ödeme kanalı oluştururken `PayChannel` türünde bir `CreatedNode` arayın. Ayrıca, göndericinin bakiyesindeki düşüşü gösteren `AccountRoot` türünde bir `ModifiedNode` bulmalısınız. `FinalFields` içerisinde bir `Account` alanı arayın; adresin gönderici ile eşleşip eşleşmediğini kontrol edin ve `Balance` alanındaki farkı görerek XRP bakiyesindeki değişimi inceleyin.

Meta veriler ayrıca yeni oluşturulan ödeme kanalını hedef hesabın `sahip dizininde` listeler. Bu, bir hesabın açık bir ödeme kanalının hedefi olması durumunda **`silinmesini`** engeller. (Bu davranış, `fixPayChanRecipientOwnerDir değişikliği` ile eklenmiştir.)

:::info
Bir ödeme kanalının kapatılması için talep etmenin birkaç yolu vardır; kanaldan yalnızca oluşturulmuş `CancelAfter` zamanı dışında (bu yalnızca oluşturulurken ayarlanır).
:::

Bir işlem, bir kanalın kapanmasını planladığında, `FinalFields`'teki `Expiration` alanında yeni eklenen kapanma zamanı ile birlikte `PayChannel` türünde bir `ModifiedNode` girişi bulunur. Aşağıdaki örnek, göndericinin bir talepte bulunarak kanalı kapatma isteğiyle bir durumda `PayChannel`'deki değişiklikleri göstermektedir:

> ```json
> {
>   "ModifiedNode": {
>     "FinalFields": {
>       "Account": "rNn78XpaTXpgLPGNcLwAmrcS8FifRWMWB6",
>       "Amount": "1000000",
>       "Balance": "0",
>       "Destination": "rwWfYsWiKRhYSkLtm3Aad48MMqotjPkU1F",
>       "Expiration": 608432060,
>       "Flags": 0,
>       "OwnerNode": "0000000000000002",
>       "PublicKey": "EDEACA57575C6824FC844B1DB4BF4AF2B01F3602F6A9AD9CFB8A3E47E2FD23683B",
>       "SettleDelay": 3600,
>       "SourceTag": 1613739140
>     },
>     "LedgerEntryType": "PayChannel",
>     "LedgerIndex": "DC99821FAF6345A4A6C41D5BEE402A7EA9198550F08D59512A69BFC069DC9778",
>     "PreviousFields": {},
>     "PreviousTxnID": "A9D6469F3CB233795B330CC8A73D08C44B4723EFEE11426FEE8E7CECC611E18E",
>     "PreviousTxnLgrSeq": 41889092
>   }
> }
> ```

---

## TrustSet İşlemleri

TrustSet işlemleri, `güven hatları` oluşturur, değiştirir veya siler; bunlar `RippleState` nesneleri` ile temsil edilir. Tek bir `RippleState` nesnesi, her iki taraf için de sınırlamaları, `rippling ayarları` ve daha fazlasını içeren ayarları içerir. Güven hatları oluşturmak ve değiştirmek, aynı zamanda `gönderenin mülkiyet rezervini ve mülkiyet dizinini` ayarlayabilir.

Aşağıdaki örnek, ** `rf1BiG...`** döviz değişimi için **`rsA2Lp...`** tarafından çıkarılan 110 USD tutarını tutmaya istekli olduğu yeni bir güven hattını göstermektedir:

> ```json
> {
>   "CreatedNode": {
>     "LedgerEntryType": "RippleState",
>     "LedgerIndex": "9CA88CDEDFF9252B3DE183CE35B038F57282BC9503CDFA1923EF9A95DF0D6F7B",
>     "NewFields": {
>       "Balance": {
>         "currency": "USD",
>         "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
>         "value": "0"
>       },
>       "Flags": 131072,
>       "HighLimit": {
>         "currency": "USD",
>         "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
>         "value": "110"
>       },
>       "LowLimit": {
>         "currency": "USD",
>         "issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
>         "value": "0"
>       }
>     }
>   }
> }
> ```

---

## Diğer İşlemler

Çoğu diğer işlemler, belirli türde bir defter girişi oluşturur ve `gönderenin mülkiyet rezervini ve sahip dizinini` ayarlar:

- [AccountSet işlemleri][] göndericinin mevcut [AccountRoot nesnesini][] değiştirir; ayarları ve bayrakları belirtilen şekilde değiştirir.
- [DepositPreauth işlemleri][] belirli bir gönderici için bir `DepositPreauth nesnesi` ekler veya kaldırır.
- [SetRegularKey işlemleri][] göndericinin [AccountRoot nesnesini][] değiştirir; `RegularKey` alanını belirtilen şekilde değiştirir.
- [SignerListSet işlemleri][] bir `SignerList nesnesini` ekler, kaldırır veya değiştirir.

---

## Pseudo-İşlemler

`Pseudo-işlemler` ayrıca meta verilere sahiptir; ancak normal işlemlerin tüm kurallarına uymazlar. Gerçek bir hesaba bağlı değildirler ( `Account` değeri, `sayı 0'ın base58 kodlanmış hali` olduğundan), bu yüzden bir `AccountRoot` nesnesini defterde artırmak veya XRP'yi yok etmek için değiştirmezler. Pseudo-işlemler yalnızca özel defter nesneleri üzerinde belirli değişiklikler yapar:

- [EnableAmendment pseudo-işlemleri][] hangi değişikliklerin etkin olduğunu ve hangilerinin çoğunluk desteği ile beklemede olduğunu izlemek için `Amendments defter nesnesini` değiştirir.
- [SetFee pseudo-işlemleri][] `işlem maliyeti` ve `rezerv gereksinimlerini` değiştirmek için `FeeSettings defter nesnesini` değiştirir.

## Ayrıca Bakınız

- **Kavramlar:**
    - `Sonuçların Kesinliği`
    - `Güvenilir İşlem Gönderimi`
- **Eğitimler:**
    - `WebSocket ile Gelen Ödemeleri İzleme`
- **Referanslar:**
    - `Defter Giriş Türleri Referansı` - Tüm defter giriş türlerinin olası alanları
    - `İşlem Meta Verileri` - Meta veri formatı ve meta verilerde görünen alanlar özeti
    - `İşlem Sonuçları` - İşlemler için tüm olası sonuç kodlarının tabloları.

