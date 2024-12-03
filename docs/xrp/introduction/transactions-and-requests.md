---
title: İşlemler ve Talepler
seoTitle: XRP Defterinde İşlemler ve Talepler
sidebar_position: 4
description: XRP Defteri ile etkileşimlerin iki ana yöntemi vardır; işlemler ve talepler. Bu içerik, her iki yöntemin nasıl çalıştığını detaylı bir şekilde açıklamaktadır.
tags: 
  - XRP
  - blockchain
  - işler
  - talepler
  - JSON formatı
  - XRPL
  - Clio sunucuları
keywords: 
  - XRP
  - blockchain
  - işlemler
  - talepler
  - JSON formatı
  - XRPL
  - Clio sunucuları
---

## İşlemler ve Talepler

XRP Defteri ile etkileşimlerin çoğu ya defteri değiştiren bir işlem göndermeyi ya da defterden bilgi talep etmeyi içerir. Ayrıca, sürekli ilgi bildirimlerini izlemek üzere abone olabilirsiniz.

## İşlemler Nasıl Çalışır?

Defterde XRP ve diğer token'ların hesaplar arasında transfer edilmesi; NFT'lerin basımı ve yakılması; tekliflerin yaratılması, kabul edilmesi ve iptal edilmesi gibi değişiklikler yapmak için işlemleri kullanın. Bir işlemi, XRP Defteri'ne bir komut göndererek ve işlemin tamamlandığına dair onayı bekleyerek gerçekleştirirsiniz. Komut sözdizimi formatı her işlem için aynıdır.

> **Önemli Not:** Her zaman _TransactionType_ ve işlemi gerçekleştiren _Account_'ın genel adresini sağlamalısınız.  
> — XRP Defteri Kullanım Kılavuzu

- İki zorunlu alan, işlem için _Fee_ ve hesabından yapılacak işlemler için bir sonraki _Sequence_ numarasıdır. Bu alanlar otomatik olarak doldurulabilir.

- İşlemler, işlem türüne özgü zorunlu alanlar da içerebilir. Örneğin, bir _Payment_ işlemi bir _Amount_ değerine (XRP'nin milyon binde biri olan _drops_ cinsinden) ve fonların kaydedileceği bir _Destination_ genel adresine ihtiyaç duyar.

Aşağıda JSON formatında bir örnek işlem bulunmaktadır. Bu işlem, _rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn_ hesabından _ra5nK24KXen9AHvsdFTKHSANinZseWnPcX_ hedef hesabına 1 XRP transfer eder.

```json
{
  "TransactionType": "Payment",
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Amount": "1000000",
  "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
}
```

Tüm işlemler için isteğe bağlı alanlar mevcuttur ve belirli işlemler için ek alanlar bulunmaktadır. İhtiyacınız olan kadar isteğe bağlı alan ekleyebilirsiniz, ancak her işlemde her alanı eklemek zorunda değilsiniz.

:::tip
İşlemi, JavaScript, Python, komut satırı veya uyumlu herhangi bir hizmetten bir komut olarak deftere gönderirsiniz. Rippled sunucuları, işlemleri XRPL'ye önerir.
:::



Geçerli bir önerilen işlem setinin %80'i doğrulandığında, bu işlemler kalıcı defterin bir parçası olarak kaydedilir. Rippled sunucu, gönderdiğiniz işlemin sonuçlarını döndürür.

İşlemler hakkında daha fazla bilgi için `Transactions` sayfasını ziyaret edin.

## Talepler Nasıl Çalışır?

Talepler, defterden bilgi almak için kullanılır, ancak defterde değişiklik yapmazlar. Bilgi herkesin görüntülemesi için serbestçe mevcuttur, bu nedenle hesabınızla giriş yapmanız gerekmez.

> “Talepler, **bir bilgi talep etmek için** kullanılan en iyi yöntemdir.”  
> — XRPL Kullanım Kılavuzu

Gönderdiğiniz alanlar, talep ettiğiniz bilgi türüne göre değişir. Genellikle birkaç isteğe bağlı alan içerir, ancak sadece birkaç zorunlu alan vardır.

Talebinizi gönderdiğinizde, bir rippled sunucusu veya taliplere yanıt vermek için atanmış bir Clio sunucusu tarafından işlenebilir.


Clio sunucuları, XRPL üzerindeki diğer rippled sunucularının yükünü bir miktar hafifleterek işlem hızını ve güvenilirliğini artırır.

Aşağıda JSON formatında bir örnek talep bulunmaktadır. Bu talep, sağladığınız hesap numarasına ait mevcut hesap bilgilerini alır.

```json
{
  "command": "account_info",
  "account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn"
}
```

Talep, zengin bir bilgi döndürür. İşte bir hesap bilgisi talebi için örnek bir yanıt JSON formatında.

```json
{
    "result": {
        "account_data": {
            "Account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
            "Balance": "999999999960",
            "Flags": 8388608,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 0,
            "PreviousTxnID": "4294BEBE5B569A18C0A2702387C9B1E7146DC3A5850C1E87204951C6FDAA4C42",
            "PreviousTxnLgrSeq": 3,
            "Sequence": 6,
            "index": "92FA6A9FC8EA6018D5D16532D7795C91BFB0831355BDFDA177E86C8BF997985F"
        },
        "ledger_current_index": 4,
        "queue_data": {
            "auth_change_queued": true,
            "highest_sequence": 10,
            "lowest_sequence": 6,
            "max_spend_drops_total": "500",
            "transactions": [
                {
                    "auth_change": false,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 6
                },
                ... (kısalık için kesildi) ...
                {
                    "LastLedgerSequence": 10,
                    "auth_change": true,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 10
                }
            ],
            "txn_count": 5
        },
        "status": "success",
        "validated": false
    }
}
```

Bir Hesap kaydındaki alanlar hakkında bilgi için `Accounts` sayfasına bakın.

--- 

Sonraki: `Yazılım Ekosistemi`