---
title: Bağımsız Modda Defteri Geliştirme
seoTitle: Gelişmiş Bağımsız Modda Defter Kullanım Rehberi
sidebar_position: 4
description: Bu sayfa, bağımsız modda rippled kullanımı hakkında bilgi ve gereklilikleri sunmaktadır. Çeşitli işlemler ve uyumluluk konularına dair detaylar içermektedir.
tags: 
  - bağımsız mod
  - ledger_accept
  - ripple
  - konsensüs
  - XRP
  - rippled
  - defter
keywords: 
  - bağımsız mod
  - ledger_accept
  - ripple
  - konsensüs
  - XRP
  - rippled
  - defter
---

# Bağımsız Modda Defteri Geliştirme

[Bağımsız modda][], `rippled` peer-to-peer ağındaki diğer üyelerle iletişim kurmaz ve bir konsensüs sürecine katılmaz. Bu modda herhangi bir konsensüs süreci olmadığı için, defter indeksini manuel olarak [ledger_accept method][] ile ilerletmelisiniz:

```
rippled ledger_accept --conf=/path/to/rippled.cfg
```

Bağımsız modda, `rippled` "kapalı" bir defter versiyonu ile "doğrulanmış" bir defter versiyonu arasında ayırım yapmaz. 

:::note
Ayrım hakkında daha fazla bilgi için `XRP Defter Konsensüs Süreci` sayfasına bakın.
:::

Her ne zaman `rippled` bir defteri kapatırsa, işlemleri belirli ama manipüle edilmesi zor bir algoritmaya göre sıralar. *Bu, konsensüsün önemli bir parçasıdır, çünkü işlemler ağın farklı kısımlarına farklı sıralarda ulaşabilir.* `rippled`'i bağımsız modda kullanırken, farklı bir adresten gelen bir işlemin sonucuna bağlı olan bir işlemi göndermeden önce defteri manuel olarak ilerletmelisiniz. Aksi takdirde, iki işlem defter kapatıldığında ters sırayla gerçekleştirilebilir. 

> *Bir deftere tek bir adresten birden fazla işlemi güvenle gönderebilirsiniz, çünkü `rippled` aynı adresten gelen işlemleri `Sequence` numarasına` göre artan sırada sıralar.*  
> — `rippled` Kılavuzu

---

## Ayrıca Bakınız

- **Referanslar:**
    - [ledger_accept method][]
    - [server_info method][]
    - `rippled` Komut Satırı Kullanımı

