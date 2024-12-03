---
title: Yetkilendirilmiş Güven Hatları
seoTitle: Yetkilendirilmiş Güven Hatları Özelliği
sidebar_position: 4
description: Yetkilendirilmiş güven hatları, ihraççıların belirli hesapların tokenları tutmasına izin vermek için kullanılan bir özelliktir. Bu özellik, tokenlar üzerinde daha fazla kontrol sağlar ve güven hatlarının yönetimini kolaylaştırır.
tags: 
  - güven hatları
  - token
  - güvenlik
  - XRP
  - TrustSet
  - ihraççılar
  - hesap yönetimi
keywords: 
  - güven hatları
  - token
  - güvenlik
  - XRP
  - TrustSet
  - ihraççılar
  - hesap yönetimi
---

# Yetkilendirilmiş Güven Hatları

Yetkilendirilmiş Güven Hatları özelliği, ihraççıların yalnızca belirli hesapların tutabileceği token'lar oluşturmalarını sağlar. Bu özellik yalnızca token'lar için geçerlidir, XRP için değil.

:::info
Yetkilendirilmiş güven hatlarının kullanılması, token'lar üzerinde daha fazla kontrol sağlar.
:::

Yetkilendirilmiş Güven Hatları özelliğini kullanmak için, ihraç hesabınızda **Require Auth** işaretini etkinleştirin. Ayar etkinleştirildiğinde, başka hesaplar yalnızca, sizin ihraç ettiğiniz token'ları tutabilirler ve bu hesapların güven hatlarını ihraç hesabınıza yetkilendirmiş olmalısınız.

Bir güven hattını yetkilendirmek için, ihraç adresinizden bir [TrustSet işlemi][] göndererek güven hattını, yetkilendirmek istediğiniz hesap ile kendi hesabınız arasında yapılandırabilirsiniz. Bir güven hattını yetkilendirdikten sonra, bu yetkilendirmeyi asla geri alamazsınız. (Ancak, gerekirse o güven hattını `dondurabilirsiniz`.)

> **Önemli Not:** 
> Bir güven hattını yetkilendirmek için işlem, ihraç adresi tarafından imzalanmalıdır ki bu da maalesef o adres için artan risk maruziyeti anlamına gelir.
> — 

:::warning Require Auth özelliğini yalnızca hesabınızda güven hatları ve XRP Ledger'da hiç Teklif yoksa etkinleştirebilirsiniz, bu yüzden token'larınızı ihraç etmeye başlamadan _önce_ kullanıp kullanmamaya karar vermelisiniz.:::

---

## Yedekler

Güven hatları, her biri 2 XRP tutarında bir yedek gerektiren defter nesneleridir. Yeni kullanıcıların başlamasına yardımcı olmak için, yeni bir hesap için oluşturduğunuz ilk 2 güven hattı için yedek tutarları kaldırılır. Yeni hesabınıza 10 XRP yatırın ve yeni güven hatlarınızı oluşturun.

- Hesabınızda 10 XRP'den fazla varsa, ilk 2 güven hattınız için 4 XRP'ye kadar yedek tutulur.
- Eğer güven hattını daha sonra kaldırırsanız, yedekler gelecekteki kullanım için serbest bırakılır.

---

## Stabilcoin İhraç Edilmesiyle

XRP Ledger'da bir stabilcoin ile Yetkilendirilmiş Güven Hatları kullanarak, yeni bir müşteriyi sisteme alma süreci aşağıdaki gibi görünebilir:

1. Müşteri, stabilcoin ihraççısının sistemine kaydolur ve kimlik bilgilerini (aynı zamanda "Müşterinizi Tanıyın" veya KYC bilgileri olarak da bilinir) gönderir.
2. Müşteri ve stabilcoin ihraçcısı, birbirlerine XRP Ledger adreslerini bildirir.
3. Müşteri, ihraççının adresine bir güven hattı oluşturmak için [TrustSet işlemi][] gönderir ve pozitif bir limit iletir.
4. İhraççı, müşterinin güven hattını yetkilendirmek için bir TrustSet işlemi gönderir.

:::tip
İki TrustSet işlemi (adım 3 ve 4) herhangi bir sırayla gerçekleşebilir. Eğer ihraççı güven hattını önce yetkilendirirse, bu 0 limitli bir güven hattı oluşturur ve müşterinin TrustSet işlemi önceden yetkilendirilmiş güven hattındaki limiti belirler.
:::

---

## Önlem Olarak

Yetkilendirilmiş Güven Hatları kullanmayı düşünmeseniz bile, `operasyonel ve bekleme hesaplarında` Require Auth ayarını etkinleştirebilir ve o hesapların güven hatlarını asla onaylamasını engelleyebilirsiniz. Bu, bu hesapların yanlışlıkla token ihraç etmesini önler (örneğin, bir kullanıcı yanlış bir adresi güvenilir görürse). 

:::note
Bu yalnızca bir önlem olup, operasyonel ve bekleme hesaplarının - ihraççının - token'larını, amaçlandığı gibi transfer etmesini engellemez.
:::

---

## Teknik Detaylar

### Require Auth'ı Etkinleştirme

Aşağıdaki örnek, yerel olarak barındırılan `rippled`'in [submit yöntemi][] kullanılarak `asfRequireAuth` bayrağını kullanarak Require Auth'ı etkinleştiren bir [AccountSet işlemi][] gönderilmesini göstermektedir. (Bu yöntem, adresin bir ihraç adresi, operasyonel adres ya da bekleme adresi olup olmadığına bakılmaksızın aynı şekilde çalışır.)

**Talep:**

```json
POST http://localhost:5005/
{
    "method": "submit",
    "params": [
        {
            "secret": "s████████████████████████████",
            "tx_json": {
                "Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                "Fee": "15000",
                "Flags": 0,
                "SetFlag": 2,
                "TransactionType": "AccountSet"
            }
        }
    ]
}
```

partial file="/docs/_snippets/secret-key-warning.md" /%}

---

## Hesabın Require Auth Ayarının Etkin Olup Olmadığını Kontrol Etme

Bir hesabın Require Auth ayarının etkin olup olmadığını görmek için [account_info yöntemi][] kullanarak hesabı kontrol edin. `Flags` alanının değerini ( `result.account_data` nesnesinde) `AccountRoot defter nesnesi için tanımlanan bitwise bayrakları` ile karşılaştırın.

`Flags` değerinin bitwise-AND sonucunun `lsfRequireAuth` bayrak değeri (`0x00040000`) ile sıfırdan farklı olup olmadığını kontrol edin; eğer sıfırdan farklıysa, hesap Require Auth'ı etkinleştirilmiştir. Eğer sonuç sıfırsa, o zaman hesapta Require Auth devre dışı bırakılmıştır.

---

## Güven Hatlarını Yetkilendirme

Yetkilendirilmiş Güven Hatları özelliğini kullanıyorsanız, diğerleri sizin ihraç ettiğiniz bakiyeleri tutamaz, önce onların güven hatlarını size yetkilendirmek zorundasınız. Eğer birden fazla para birimi ihraç ediyorsanız, her para birimi için ayrıca güven hatlarını yetkilendirmelisiniz.

Bir güven hattını yetkilendirmek için, ihraç adresinizden bir [TrustSet işlemi][] gönderin ve güvenip güvenmeyeceğiniz kullanıcıyı `LimitAmount`'ın `issuer` olarak belirtin. `value` (onlara güveneceğiniz miktar) **0** olarak bırakın ve işlemin `tfSetfAuth` bayrağını etkinleştirin.

Aşağıdaki, yerel olarak barındırılan `rippled`'in [submit yöntemi][] kullanılarak `rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn` müşteri adresinin `rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW` adresi tarafından ihraç edilen USD'yi tutmasına yetki veren bir TrustSet işlemi gönderme örneğidir:

**Talep:**

```json
POST http://localhost:8088/

{
    "method": "submit",
    "params": [
        {
            "secret": "s████████████████████████████",
            "tx_json": {
                "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                "Fee": "15000",
                "TransactionType": "TrustSet",
                "LimitAmount": {
                    "currency": "USD",
                    "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                    "value": 0
                },
                "Flags": 65536
            }
        }
    ]
}
```

partial file="/docs/_snippets/secret-key-warning.md" /%}

---

## Güven Hatlarının Yetkilendirilip Yetkilendirilmediğini Kontrol Etme

Bir güven hattının yetkilendirilip yetkilendirilmediğini kontrol etmek için [account_lines yöntemi][] kullanarak güven hattını kontrol edin. Talepte, müşterinin adresini `account` alanında ve ihraççının adresini `peer` alanında belirtin.

Cevabın `result.lines` dizisinde, `currency` alanının istediğiniz para birimi için bir güven hattını temsil ettiğini gösteren nesneyi bulun. Eğer o nesnede `peer_authorized` alanı `true` değerine sahipse, o zaman ihraççı (talebin `peer` alanı olarak kullandığınız adres) güven hattını yetkilendirmiştir.

---

## Ayrıca Bakınız

- **Kavramlar:**
    - `Para Yatırma Yetkisi`
    - `İhraç Edilen Para Birimlerini Dondurma`
- **Referanslar:**
    - [account_lines yöntemi][]
    - [account_info yöntemi][]
    - [AccountSet işlemi][]
    - [TrustSet işlemi][]
    - `AccountRoot Bayrakları`
    - `RippleState (güven hattı) Bayrakları`

