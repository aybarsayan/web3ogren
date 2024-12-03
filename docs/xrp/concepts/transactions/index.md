---
title: İşlemler
seoTitle: XRP Ledger İşlemleri
sidebar_position: 1
description: İşlemler, XRP Ledgerı değiştirmek için tek yoldur. Hangi biçimleri aldıklarını ve bunları nasıl kullanacağınızı anlayın.
tags: 
  - işlemler
  - XRP Ledger
  - işlem türleri
  - konsensüs
  - kriptografik anahtarlar
  - ödeme türleri
keywords: 
  - işlemler
  - XRP Ledger
  - işlem türleri
  - konsensüs
  - kriptografik anahtarlar
  - ödeme türleri
---

## İşlemler

Bir *İşlem*, XRP Ledger'ı değiştirmek için tek yoldur. İşlemler, yalnızca imzalanmış, gönderilmiş ve `konsensüs süreci` çerçevesinde onaylanmış bir defter versiyonuna kabul edilmişse kesin hale gelir. Bazı defter kuralları, imzalanmayan ya da gönderilmeyen ancak yine de konsensüs tarafından kabul edilmesi gereken *`pseudo-işlemler`* üretir. Başarısız olan işlemler, XRP bakiyelerini anti-spam [işlem maliyeti][] için ödemek üzere değiştirdiklerinden, defterlerde de yer alır.

İşlemler, yalnızca para göndermekten daha fazlasını yapabilir. Farklı `Ödeme Türlerini` desteklemekle birlikte, XRP Ledger'daki işlemler aynı zamanda `kriptografik anahtarları` döndürmek, diğer ayarları yönetmek ve XRP Ledger'ın `dağıtılmış borsa` işlemlerinde işlem yapmak için de kullanılır. `rippled` API referansı, `işlem türleri` için tam bir liste sunar.

### İşlemleri Tanımlama

Her imzalı işlem, onu tanımlayan benzersiz bir `"hash"`e sahiptir. Sunucu, işlemi gönderdiğinizde yanıt olarak hash'i sağlar; ayrıca `account_tx komutunu` kullanarak bir hesabın işlem geçmişinde bir işlemi arayabilirsiniz.

> İşlem hash'i, işlem sonucu doğrulamak için herhangi biri tarafından `hash'i ile işlem aramak` için kullanılabilir, bu nedenle "ödeme kanıtı" olarak işlev görebilir.
> — XRP Ledger Belgeleri

raw-partial file="/docs/_snippets/setfee_uniqueness_note.md" /%}

## Talep Edilen Maliyet Gerekçesi

Başarısız bir işlem için `işlem maliyeti` tahsil etmek adil görünmese de, `tec` hata sınıfı iyi sebeplerden dolayı vardır:

* Başarısız işlemden sonra gönderilen işlemlerin Sıra değerlerinin yeniden numaralandırılması gerekmez.
* İşlemi ağda dağıtmak, ağ yükünü artırır. 
* **İşlem maliyeti**, gerçek dünya değerinde genellikle çok küçüktür.

## İşlemleri Yetkilendirme

Dağıtılmış XRP Ledger'da, bir dijital imza, bir işlemin belirli bir eylem kümesini yapmak için yetkilendirildiğini kanıtlar. Yalnızca imzalanmış işlemler ağa gönderilebilir ve onaylı bir deftere dahil edilebilir. İmzalı bir işlem değiştirilemez: içeriği değiştirilemez ve imza başka bir işlem için geçerli olamaz.

Bir işlem, aşağıdaki imza türlerinden herhangi biriyle yetkilendirilebilir:

* Gönderen adresle matematiksel olarak ilişkili ana özel anahtardan tek bir imza.
* Adresle ilişkili düzenli özel anahtar ile eşleşen tek bir imza. 
* Adresin sahip olduğu imza listesini eşleşen bir `çoklu imza`.

Herhangi bir imza türü, aşağıdaki istisnalar dışında, herhangi bir işlem türünü yetkilendirebilir:

* Sadece ana özel anahtar `ana genel anahtarı devre dışı bırakabilir`.

Anahtar çiftleri hakkında daha fazla bilgi için `Kriptografik Anahtarlar` sayfasına bakın.

## İşlemleri İmzalama ve Gönderme

XRP Ledger'a bir işlem göndermek birkaç adım içerir:

1. `JSON formatında imzasız bir işlem oluşturun`.
2. **Bir veya daha fazla imza kullanarak** `işlemi yetkilendirin`.
3. Bir XRP Ledger sunucusuna işlem gönderin. 
4. `Konsensüs süreci` işlemleri dahil eder.
5. Sunucular, bu işlemleri önceki deftere kanonikal bir sırayla uygular.
6. Yeterli sayıda `güvenilir doğrulayıcı` aynı defteri oluşturursa, bu defter _onaylı_ olarak ilan edilir.

XRP ödemelerini göndermeye yönelik etkileşimli bir öğretici için `XRP Gönder` sayfasına bakın.

### Örnek İmzasız İşlem

İşte bir [Ödeme işlemi][] için JSON formatında imzasız bir işlem örneği:

```json
{
  "TransactionType" : "Payment",
  "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Amount" : {
     "currency" : "USD",
     "value" : "1",
     "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
  },
  "Fee": "12",
  "Flags": 2147483648,
  "Sequence": 2
}
```

XRP Ledger yalnızca işlem nesnesi, gönderen adres (Account) alanında yetkilendirilmişse işlemi iletir ve yürütür. Bunu güvenli bir şekilde nasıl yapacağınız hakkında bilgi için `Güvenli İmza Oluşturma` sayfasına bakın.

## Örnek İmzalı İşlem Blob'u

Bir işlemi imzalamak, ağa gönderilebilecek bir "blob" olarak bilinen ikili veri parçasını üretir. İşte aynı işlemin, WebSocket API'si ile `gönderildiği` imzalı bir blob'un örneği:

```json
{
  "id": 2,
  "command": "submit",
  "tx_blob" : "120000240000000461D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000F732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74483046022100982064CDD3F052D22788DB30B52EEA8956A32A51375E72274E417328EBA31E480221008F522C9DB4B0F31E695AA013843958A10DE8F6BA7D6759BEE645F71A7EB240BE81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754"
}
```

## Örnek Yürütülen İşlem ile Meta Verisi

Bir işlem yürütüldükten sonra, XRP Ledger işlemin son sonucunu ve işlemin XRP Ledger'ın paylaşılan durumundaki tüm değişiklikleri göstermek için `meta verisi` ekler.

:::warning Bir işlemin sonuçları, tüm meta verisiyle birlikte, **onaylı** bir defterde görünmüyorsa kesin değildir. Ayrıca bakınız: `Sonuçların Kesinliği`.:::

`tx` komutunun örnek yanıtı:

```json
{
  "id": 6,
  "status": "success",
  "type": "response",
  "result": {
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Amount": {
      "currency": "USD",
      "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "value": "1"
    },
    "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Fee": "10",
    "Flags": 2147483648,
    "Sequence": 2,
    "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
    "TransactionType": "Payment",
    "TxnSignature": "3045022100D64A32A506B86E880480CCB846EFA3F9665C9B11FDCA35D7124F53C486CC1D0402206EC8663308D91C928D1FDA498C3A2F8DD105211B9D90F4ECFD75172BAE733340",
    "date": 455224610,
    "hash": "33EA42FC7A06F062A7B843AF4DC7C0AB00D6644DFDF4C5D354A87C035813D321",
    "inLedger": 7013674,
    "ledger_index": 7013674,
    "meta": {
      "AffectedNodes": [
        {
          "ModifiedNode": {
            "FinalFields": {
              "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
              "Balance": "99999980",
              "Flags": 0,
              "OwnerCount": 0,
              "Sequence": 3
            },
            "LedgerEntryType": "AccountRoot",
            "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
            "PreviousFields": {
              "Balance": "99999990",
              "Sequence": 2
            },
            "PreviousTxnID": "7BF105CFE4EFE78ADB63FE4E03A851440551FE189FD4B51CAAD9279C9F534F0E",
            "PreviousTxnLgrSeq": 6979192
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Balance": {
                "currency": "USD",
                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                "value": "2"
              },
              "Flags": 65536,
              "HighLimit": {
                "currency": "USD",
                "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "value": "0"
              },
              "HighNode": "0000000000000000",
              "LowLimit": {
                "currency": "USD",
                "issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
                "value": "100"
              },
              "LowNode": "0000000000000000"
            },
            "LedgerEntryType": "RippleState",
            "LedgerIndex": "96D2F43BA7AE7193EC59E5E7DDB26A9D786AB1F7C580E030E7D2FF5233DA01E9",
            "PreviousFields": {
              "Balance": {
                "currency": "USD",
                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                "value": "1"
              }
            },
            "PreviousTxnID": "7BF105CFE4EFE78ADB63FE4E03A851440551FE189FD4B51CAAD9279C9F534F0E",
            "PreviousTxnLgrSeq": 6979192
          }
        }
      ],
      "TransactionIndex": 0,
      "TransactionResult": "tesSUCCESS"
    },
    "validated": true
  }
}
```

## Ayrıca Bakınız

- **Kavramlar:**
    - `Ödeme Türleri`
- **Eğitimler:**
    - `Güvenli İmza Oluşturma`
    - `XRP Gönder`
    - `İşlem Sonuçlarını Ara`
    - `WebSocket ile Gelen Ödemeleri İzleme`
    - `Bir İşlemi İptal Etme veya Atlama`
    - `Güvenilir İşlem Gönderimi`
- **Referanslar:**
    - `İşlem Ortak Alanları`
    - `İşlem Türleri`
    - `İşlem Meta Verileri`
    - [account_tx metodu][]
    - [tx metodu][]
    - [submit metodu][]
    - [submit_multisigned metodu][]