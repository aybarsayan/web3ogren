---
title: İşlemi Kriptografik Olarak İmzalama
seoTitle: XRP İşlemi Kriptografik Olarak İmzalama
sidebar_position: 4
description: Bu belge, XRP işlemlerini kriptografik olarak imzalamak için kullanılan yöntemleri ve örnekleri açıklamaktadır. İmzalama süreci hakkında detaylı bilgiye ulaşabilirsiniz.
tags: 
  - XRP
  - Kriptografi
  - İmzalama
  - API
keywords: 
  - XRP
  - imza
  - işlem
  - kriptografi
  - JSON
  - güvenli imzalama
  - seed değeri
---

## imza
[[Kaynak]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/SignHandler.cpp "Kaynak")

`sign` metodu, `JSON formatında bir işlemi` ve bir `seed değeri` alır ve işlemin imzalı ikili temsilini döner. 

> **Önemli:** Bir `çoklu imzalı işlemde` bir imza katkıda bulunmak için, [sign_for metodu][] yerine kullanın.

partial file="/docs/_snippets/public-signing-note.md" /%}

:::warning Kendi `rippled` sunucunuzu çalıştırmadığınız sürece, bu komutu kullanmak yerine bir `istemci kütüphanesi` kullanarak yerel imzalamayı yapmalısınız. Daha fazla bilgi için `Güvenli İmzalama Ayarları` sayfasına bakın.:::

---

## İstek Formatı

İstek formatına bir örnek:



WebSocket
```json
{
  "id": 2,
  "api_version": 2,
  "command": "sign",
  "tx_json" : {
      "TransactionType" : "Payment",
      "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "DeliverMax" : {
         "currency" : "USD",
         "value" : "1",
         "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
      }
   },
   "secret" : "s████████████████████████████",
   "offline": false,
   "fee_mult_max": 1000
}
```


JSON-RPC
```json
{
    "method": "sign",
    "params": [
        {
            "offline": false,
            "api_version": 2,
            "secret": "s████████████████████████████",
            "tx_json": {
                "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "DeliverMax": {
                    "currency": "USD",
                    "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                    "value": "1"
                },
                "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
                "TransactionType": "Payment"
            },
            "fee_mult_max": 1000
        }
    ]
}
```


Komut Satırı
```sh
#Syntax: sign secret tx_json [offline]
rippled sign s████████████████████████████ '{"TransactionType": "Payment", "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX", "DeliverMax": { "currency": "USD", "value": "1", "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn" }, "Sequence": 360, "Fee": "10000"}' offline
```




Bir işlemi imzalamak için, işlemi `yetkilendirmek` için kullanılabilecek bir gizli anahtar sağlamalısınız. Genellikle, sunucunun gizli anahtarı türettiği bir seed değeri sağlarsınız. Bunu birkaç yolla yapabilirsiniz:

* Seed'i `secret` alanında sağlayın ve `key_type` alanını atlayın. Bu değer XRP Genel Defteri [base58][] seed, RFC-1751, onaltılık veya bir dize şifre olarak formatlanabilir. (sadece secp256k1 anahtarları)
* Bir `key_type` değeri sağlayın ve tam olarak bir tane `seed`, `seed_hex` veya `passphrase` sağlayın. `secret` alanını atlayın. **Not:** Bu yöntem komut satırı sözdizimi tarafından desteklenmez.

İstek aşağıdaki parametreleri içerir:

| `Alan`        | Tür    | Açıklama                                       |
|:---------------|:--------|:--------------------------------------------------|
| `tx_json`      | Nesne  | JSON formatında `işlem tanımı` |
| `secret`       | Dize  | _(Opsiyonel)_ İşlemi imzalamak için kullanılan işlemi sağlayan hesabın gizli seed'i. Gizli anahtarınızı güvenilmeyen sunuculara veya güvensiz ağ bağlantıları üzerinden göndermeyin. `key_type`, `seed`, `seed_hex` veya `passphrase` ile kullanılamaz. |
| `seed`         | Dize  | _(Opsiyonel)_ İşlemi imzalamak için kullanılan işlemi sağlayan hesabın gizli seed'i. XRP Genel Defteri'nin [base58][] formatında olmalıdır. Sağlanırsa, `key_type` da belirtilmelidir. `secret`, `seed_hex` veya `passphrase` ile kullanılamaz. |
| `seed_hex`     | Dize  | _(Opsiyonel)_ İşlemi imzalamak için kullanılan işlemi sağlayan hesabın gizli seed'i. Onaltılık formatta olmalıdır. Sağlanırsa, `key_type` belirtilmelidir. `secret`, `seed` veya `passphrase` ile kullanılamaz. |
| `passphrase`   | Dize  | _(Opsiyonel)_ İşlemi imzalamak için kullanılan işlemi sağlayan hesabın gizli seed'i, bir dize şifre olarak. Sağlanırsa, `key_type` belirtilmelidir. `secret`, `seed` veya `seed_hex` ile kullanılamaz. |
| `key_type`     | Dize  | _(Opsiyonel)_ Sağlanan kriptografik anahtar çiftinin `imzalama algoritması`. Geçerli türler `secp256k1` veya `ed25519`'dir. Varsayılan `secp256k1`'dir. `secret` ile kullanılamaz. |
| `offline`      | Boolean | _(Opsiyonel)_ `true` ise, işlem oluşturulurken herhangi bir işlem detayının `otomatik olarak doldurulmasını` denemez. Varsayılan değer `false`'dır. |
| `build_path`   | Boolean | _(Opsiyonel)_ Bu alan sağlanırsa, sunucu `ödemeler için otomatik doldurur` bir [Ödeme işlemi][] imzalamadan önce `Paths` alanını. Eğer işlem bir `doğrudan XRP ödemesi` ise veya Ödeme tipi bir işlem değilse, bu alanı atlamalısınız. **Dikkat:** Sunucu, bu alanın varlığını veya yokluğunu arar, değerine değil. Bu davranış değişebilir. ([Sorun #3272](https://github.com/XRPLF/rippled/issues/3272)) |
| `fee_mult_max` | Tam sayı | _(Opsiyonel)_ `otomatik doldurulmuş `Fee` değeri` referans işlem maliyeti `fee_mult_max` ÷ `fee_div_max`'dan daha büyükse, `rpcHIGH_FEE` hatası ile imzalama başarısız olur. Bu alan, işlemin `Fee` alanını açıkça belirttiyseniz etkili olmaz. Varsayılan değer `10`'dur. |
| `fee_div_max`  | Tam sayı | _(Opsiyonel)_ `otomatik doldurulmuş `Fee` değeri` referans işlem maliyeti `fee_mult_max` ÷ `fee_div_max`'dan daha büyükse, `rpcHIGH_FEE` hatası ile imzalama başarısız olur. Bu alan, işlemin `Fee` alanını açıkça belirttiyseniz etkili olmaz. Varsayılan değer `1`'dir. |

### Otomatik Doldurulabilir Alanlar

Sunucu, bazı alanları otomatik olarak doldurmaya çalışır `tx_json` (işlem nesnesi) otomatik olarak atladığınızda. Sunucu, istek `offline`'i `true` olarak belirtmedikçe, imzalamadan önce aşağıdaki alanları sağlar:

* `Sequence` - Sunucu, göndericinin hesap bilgilerinden bir sonraki Sequence numarasını otomatik olarak kullanır.
    * **Dikkat:** Hesap için bir sonraki sıralama numarası, bu işlem uygulandığında artırılmamaktadır. Birden fazla işlemi imzalarsanız ve her biri için yanıt almak için beklemeden gönderirseniz, her işlem için doğru sıralama numaralarını manuel olarak sağlamalısınız.
* `Fee` - Eğer `Fee` parametresini atlarsanız, sunucu otomatik olarak uygun bir işlem maliyetini doldurmayı dener. Üretim XRP Genel Defteri üzerinde, uygun bir `fee_mult_max` değeri sağlamadığınız sürece bu `rpcHIGH_FEE` hatası ile başarısız olur.
    * `fee_mult_max` ve `fee_div_max` parametreleri, otomatik olarak sağlanan işlem maliyetinin ne kadar yüksek olabileceğini, `referans işlem maliyeti` için uygulanan yük ölçeklendirme çarpanı açısından sınırlandırır. Varsayılan ayarlar, otomatik olarak sağlanan değer 10×'den daha yüksek olursa bir hata döner. Ancak, üretim XRP Genel Defteri `genellikle 1000× yük çarpanına` sahiptir.
    * Komut satırı sözdizimi `fee_mult_max` ve `fee_div_max`'i desteklememektedir. Üretim XRP Genel Defteri için bir `Fee` değeri sağlamalısınız.
    * **Dikkat:** Kötü niyetli bir sunucu aşırı yüksek işlem maliyeti belirtebilir ve `fee_mult_max` ve `fee_div_max`'in değerlerini görmezden gelebilir.
* `Paths` - Ödeme tipi işlemler için (XRP'den XRP transferleri hariç), `Paths` alanı otomatik olarak doldurulabilir; sanki `ripple_path_find metodu` kullanmış gibi. Sadece `build_path` sağlanırsa doldurulur.

---

## Yanıt Formatı

Başarılı bir yanıta örnek:



WebSocket
```json
{
  "id": 2,
  "api_version": 2,
  "status": "success",
  "type": "response",
  "result": {
    "tx_blob": "1200002280000000240000016861D4838D7EA4C6800000000000000000000000000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402200E5C2DD81FDF0BE9AB2A8D797885ED49E804DBF28E806604D878756410CA98B102203349581946B0DDA06B36B35DBC20EDA27552C1F167BCF5C6ECFF49C6A46F858081144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
    "tx_json": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "DeliverMax": {
        "currency": "USD",
        "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "value": "1"
      },
      "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "Fee": "10000",
      "Flags": 2147483648,
      "Sequence": 360,
      "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
      "TransactionType": "Payment",
      "TxnSignature": "304402200E5C2DD81FDF0BE9AB2A8D797885ED49E804DBF28E806604D878756410CA98B102203349581946B0DDA06B36B35DBC20EDA27552C1F167BCF5C6ECFF49C6A46F8580",
      "hash": "4D5D90890F8D49519E4151938601EF3D0B30B16CD6A519D9C99102C9FA77F7E0"
    }
  }
}
```


JSON-RPC
```json
200 OK

{
    "result": {
        "status": "success",
        "tx_blob": "1200002280000000240000016861D4838D7EA4C6800000000000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402200E5C2DD81FDF0BE9AB2A8D797885ED49E804DBF28E806604D878756410CA98B102203349581946B0DDA06B36B35DBC20EDA27552C1F167BCF5C6ECFF49C6A46F858081144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
        "tx_json": {
            "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "DeliverMax": {
                "currency": "USD",
                "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "value": "1"
            },
            "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
            "Fee": "10000",
            "Flags": 2147483648,
            "Sequence": 360,
            "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
            "TransactionType": "Payment",
            "TxnSignature": "304402200E5C2DD81FDF0BE9AB2A8D797885ED49E804DBF28E806604D878756410CA98B102203349581946B0DDA06B36B35DBC20EDA27552C1F167BCF5C6ECFF49C6A46F8580",
            "hash": "4D5D90890F8D49519E4151938601EF3D0B30B16CD6A519D9C99102C9FA77F7E0"
        }
    }
}
```


Komut Satırı
```json
Yükleniyor: "/etc/rippled.cfg"
127.0.0.1:5005'e bağlanılıyor

{
   "result" : {
      "status" : "success",
      "tx_blob" : "1200002280000000240000016861D4838D7EA4C6800000000000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7447304502210094D24C795CFFA8E46FE338AF63421DA5CE5E171ED56F8E4CE70FFABA15D3CFA2022063994C52BF0393C8157EBFFCDE6A7E7EDC7B16A462CA53214F64CC8FCBB5E54",
      "tx_json" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "DeliverMax" : {
            "currency" : "USD",
            "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "value" : "1"
         },
         "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
         "Fee" : "10000",
         "Flags" : 2147483648,
         "Sequence" : 360,
         "SigningPubKey" : "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
         "TransactionType" : "Payment",
         "TxnSignature" : "304502210094D24C795CFFA8E46FE338AF63421DA5CE5E171ED56F8E4CE70FFABA15D3CFA2022063994C52BF0393C8157EBFFCDE6A7E7EDC7B16A462CA53214F64CC8FCBB5E54",
         "hash" : "DE80DA6FF9F93FE4CE87C99441F403E0290E35867FF48382204CB89975BF343E"
      }
   }
}
```




Yanıt `standart formatı` takip eder ve başarılı bir sonuç aşağıdaki alanları içerir:

| `Alan`   | Tür   | Açıklama                                             |
|:----------|:-------|:--------------------------------------------------------|
| `tx_blob` | Dize | Tam nitelikli, imzalı işlemin ikili temsilidir, onaltılık olarak |
| `tx_json` | Nesne | İmzalı `tam işlem` için JSON spesifikasyonu, otomatik olarak doldurulan herhangi bir alan dahil |

:::warning Bu komut bir hata mesajı ile sonuçlanırsa, mesaj istekte sağlanan bir gizli değeri içerebilir. Bu hataların başkaları tarafından görünmediğinden emin olun.:::

* Bu hatayı çok sayıda kişi tarafından görülebilecek bir log dosyasına yazmayın.
* Bu hatayı hata ayıklama için kamuya açık bir yere yapıştırmayın.
* Hata mesajını, kazara bile olsa bir web sitesinde görüntülemeyin.

---

## Olası Hatalar

* Herhangi bir [evrensel hata türü][].
* `invalidParams` - Bir veya daha fazla alan yanlış tanımlanmış veya bir veya daha fazla gerekli alan eksik.
* `highFee` - İşlem maliyetine uygulanmış mevcut yük tabanlı çarpan otomatik sağlanan işlem maliyetinin sınırını aşıyor. Ya istekte daha yüksek bir `fee_mult_max` (en az 1000) belirtin ya da `tx_json`'nin `Fee` alanına manuel olarak bir değer sağlayın.
* `tooBusy` - İşlem yolları içermiyordu, ancak sunucu şu anda yol bulmak için çok meşguldür. Yönetici olarak bağlıysanız gerçekleşmez.
* `noPath` - İşlem yolları içermiyordu ve sunucu bu ödemenin gerçekleşebileceği bir yol bulamadı.

