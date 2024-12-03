---
title: Ücret Oylaması
seoTitle: Validator Ücret Oylama Süreci ve Gereksinimleri
sidebar_position: 4
description: Validatorların ücretler (işlem maliyeti ve rezerv gereksinimleri) üzerindeki oylamaları. Bu süreç, XRP Ledger ağında kritik bir rol oynamaktadır.
tags: 
  - validatorlar
  - ücretler
  - XRP
  - işlem maliyeti
  - rezerv gereksinimleri
keywords: 
  - validatorlar
  - ücretler
  - XRP
  - işlem maliyeti
  - rezerv gereksinimleri
---

## Ücret Oylaması

Validatorlar, temel **işlem maliyeti** ve **rezerv gereksinimleri** değişiklikleri için oy verebilirler. Eğer bir validatorün yapılandırma tercihleri, ağın mevcut ayarlarından farklıysa, bu validator, tercihlerini ağ ile periyodik olarak ifade eder. Eğer bir yeterli çoğunluk validator değişiklik üzerinde anlaşırsa, bu değişiklik yürürlüğe girebilir. Validatorlar, XRP'nin değerindeki uzun vadeli değişikliklere uyum sağlamak gibi çeşitli nedenlerle bunu yapabilirler.

:::info
`rippled` validatorlarının `operatörleri`, `rippled.cfg` dosyasının `[voting]` bölümünde işlem maliyeti ve rezerv gereksinimleri için tercihlerini belirleyebilirler.
:::

:::warning 
Yetersiz gereksinimler, güvenilir validatorlar tarafından kabul edilirse (>50%), XRP Ledger eşler arası ağı hizmet reddi saldırılarına maruz bırakabilir.
:::

Belirleyebileceğiniz parametreler aşağıdaki gibidir:

| Parametre         | Açıklama                                                                                                   | Önerilen Değer            |
|--------------------|------------------------------------------------------------------------------------------------------------|---------------------------|
| `reference_fee`    | Referans işlemi göndermek için yok edilmesi gereken XRP miktarı, _drops_ cinsinden (1 XRP = 1 milyon drops.), en ucuz mümkün işlem. Gerçek işlem maliyeti, bu değerin dinamik olarak bireysel sunucuların yüküne göre ölçeklendirilmiş bir katıdır. | `10` (0.00001 XRP)       |
| `account_reserve`  | Bir hesabın rezervde bulundurması gereken en az XRP miktarı, _drops_ cinsinden. Bu, defterde yeni bir hesabı finanse etmek için gönderilebilecek en küçük miktardır. | `10000000` (10 XRP)      |
| `owner_reserve`    | Bir adresin, defterde sahip olduğu _her_ nesne için tutması gereken ek XRP miktarı, _drops_ cinsinden.    | `2000000` (2 XRP)        |

---

## Oylama Süreci

Her 256. defter "bayrak" defteri olarak adlandırılır. (Bir bayrak defteri, `ledger_index` [modulo](https://en.wikipedia.org/wiki/Modulo_operation) `256` değeri `0` olan şekilde tanımlanır.) Bayrak defterinden hemen önceki defterde, hesabın rezerv veya işlem maliyeti tercihleri mevcut ağ ayarlarından farklı olan her validator, tercih ettiği değerleri gösteren bir "oy" mesajını defter doğrulaması ile birlikte dağıtır.

> "Bayrak defterinde, hiçbir şey olmaz, ancak validatorlar, güvendikleri diğer validatorlerden gelen oyları alır ve not alır."  
> —Oylama Süreci Açıklaması

Diğer validatorlerin oylarını saydıktan sonra, her validator, kendi tercihleri ile güven duyduğu çoğunluğun tercihleri arasında bir uzlaşma sağlamaya çalışır. (Örneğin, bir validator minimum işlem maliyetini 10'dan 100'e çıkarmak isterse, ancak çoğu validator sadece 10'dan 20'ye çıkarmak istiyorsa, bu bir validator maliyeti 20'ye çıkartmak için uzlaşır. Ancak, bu bir validator asla 10'dan düşük veya 100'den yüksek bir değere razı olmaz.) Eğer bir uzlaşma mümkünse, validator, bayrak defterinden sonraki defter için `SetFee sahte işlemi` teklifine ekler. Aynı değişikliği isteyen diğer validatorler de aynı SetFee sahte işlemini aynı defter tekliflerine ekler. (Mevcut ağ ayarlarına uyan validatorler hiçbir şey yapmaz.) Eğer bir SetFee sahte işlemi, onay sürecinden geçip onaylı bir deftere dahil edilirse, o zaman SetFee sahte işlemi ile belirtilen yeni işlem maliyeti ve rezerv ayarları, sonraki defterle birlikte yürürlüğe girer.

Kısaca:

* **Bayrak defteri -1**: Validatorlar oy verir.
* **Bayrak defteri**: Validatorlar oyları sayar ve herhangi bir SetFee'yi dahil etmeye karar verir.
* **Bayrak defteri +1**: Validatorlar, teklif ettikleri defterlerine SetFee sahte işlemini ekler.
* **Bayrak defteri +2**: Yeni ayarlar, eğer bir SetFee sahte işlemi uzlaşma sağladıysa yürürlüğe girer.

---

## Maksimum Ücret Değerleri

Ücretler için mümkün olan en yüksek değerler, `FeeSettings defter nesnesinde` saklanan dahili veri türleri ile sınırlıdır. Bu değerler aşağıdaki gibidir:

| Parametre         | Maksimum Değer (drops) | Maksimum Değer (XRP)       |
|--------------------|-----------------------|-----------------------------|
| `reference_fee`    | 264                   | (Tarihte var olan en fazla XRP.) |
| `account_reserve`  | 232 drops             | Yaklaşık 4294 XRP           |
| `owner_reserve`    | 232 drops             | Yaklaşık 4294 XRP           |

---

## Ayrıca Bakınız

- **Kavramlar:**
    - `Değişiklikler`
    - `İşlem Maliyeti`
    - `Rezervler`
    - `İşlem Kuyruğu`
- **Kılavuzlar:**
    - `rippled` yapılandırması
- **Referanslar:**
    - [ücret yöntemi][]
    - [server_info yöntemi][]
    - `FeeSettings nesnesi`
    - [SetFee sahte işlemi][]
    
