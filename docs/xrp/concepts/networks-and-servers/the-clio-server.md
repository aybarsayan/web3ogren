---
title: Clio Sunucusu
seoTitle: Clio API Sunucusu - XRP Ledger
sidebar_position: 4
description: Clio, API çağrıları için optimize edilmiş bir XRP Ledger sunucusudur. Bu belge, Clio sunucusunun işlevselliği, kullanım sebepleri ve çalışma mantığı hakkında bilgiler içermektedir.
tags: 
  - Clio
  - XRP Ledger
  - API
  - verimlilik
  - dağıtık sistem
keywords: 
  - Clio
  - XRP Ledger
  - API
  - verimlilik
  - dağıtık sistem
---

# Clio Sunucusu

Clio, **doğrulanmış defter verileri** için WebSocket veya HTTP API çağrılarına optimize edilmiş bir XRP Ledger API sunucusudur.

Bir Clio sunucusu, eşler arası ağa bağlanmaz. Bunun yerine, P2P ağına bağlı bir `rippled` sunucusundan veri çıkarır. API çağrılarını verimli bir şekilde işleyerek, Clio sunucuları, P2P modunda çalışan `rippled` sunucular üzerindeki yükü azaltmaya yardımcı olabilir.

Clio, **doğrulanmış tarihsel defter** ve **işlem verilerini** alan açısından verimli bir formatta saklar; bu, `rippled`'den 4 kat daha az yer kaplamasına olanak tanır. Clio, ölçeklenebilir okuma verimliliği sağlamak için Cassandra veya ScyllaDB kullanır. Birden fazla Clio sunucusu, aynı veri kümesine erişimi paylaşabilir ve böylece tekrar eden veri saklama veya hesaplama ihtiyacı olmadan yüksek erişilebilir bir Clio sunucular kümesi inşa etmenizi sağlar.

:::tip
Clio'nun, Clio ile aynı makinede veya ayrı olarak çalışabilen bir `rippled` sunucusuna erişimi gerekmektedir.
:::

Clio, eksiksiz `HTTP / WebSocket API'lerini` sunmasına rağmen, varsayılan olarak yalnızca doğrulanmış verileri döndürür. P2P ağına erişim gerektiren istekler için Clio, isteği otomatik olarak P2P ağına bağlı `rippled` sunucusuna yönlendirir ve yanıtı geri iletir.

## Neden Bir Clio Sunucusu Çalıştırmalıyım?

Kendi Clio sunucunuzu çalıştırmanız için birçok neden vardır, ancak bunların çoğu şu şekilde özetlenebilir: P2P ağına bağlı `rippled` sunucuları üzerindeki yükün azaltılması, daha düşük bellek kullanımı ve depolama yükü, daha kolay yatay ölçekleme ve API istekleri için daha yüksek verim.

- **`rippled` sunucuları üzerindeki yükü azaltma:** "Bir Clio sunucusu, eşler arası ağa bağlanmaz. P2P ağına bağlı bir veya daha fazla güvenilir `rippled` sunucusundan doğrulanmış verileri almak için gRPC kullanır." — Sunucu yükünü daha verimli bir şekilde işleyerek azaltır.
  
- **Daha düşük bellek kullanımı ve depolama yükü:** Clio, bir veritabanı olarak Cassandra kullanır ve verileri alan açısından verimli bir formatta saklar; bu, `rippled`'den 4 kat daha az yer kaplamasına olanak tanır.

- **Daha kolay yatay ölçekleme:** Birden fazla Clio sunucusu, aynı veri kümesine erişimi paylaşabilir ve böylece yüksek erişilebilir bir Clio sunucuları kümesi oluşturmanıza olanak tanır.

- **API istekleri için daha yüksek verim:** "Bir Clio sunucusu, bir veya daha fazla güvenilir `rippled` sunucusundan doğrulanmış verileri çıkarır ve bu verileri verimli bir şekilde saklar." — Bu, API çağrılarını verimli bir şekilde işleyerek daha yüksek bir verim elde edilmesini sağlar.

---

## Clio Sunucusu Nasıl Çalışır?



Bir Clio sunucusu, işlem meta verileri, hesap durumları ve defter başlıkları gibi doğrulanmış defter verilerini kalıcı bir veri deposunda saklar.

Bir Clio sunucusu bir API isteği aldığında, bu veri depolarından veri arar. P2P ağına veri gerektiren istekler için, Clio sunucusu isteği bir P2P sunucusuna iletir ve ardından yanıtı istemciye geri iletir.

:::info
Clio, aşağıdakilerden herhangi biri doğruysa **her zaman** `rippled` sunucusuna yönlendirme yapacaktır:
:::

- `ledger_index` değeri `current` veya `closed` olarak ayarlanmışsa.
- `accounts`, `queue` veya `full` değerleri `ledger` API'si için `true` olarak ayarlanmışsa.
- `queue` değeri `account_info` API'si için `true` olarak ayarlanmışsa.
- İstenen API yöntemi (`"command"`) `submit`, `submit_multisigned`, `fee`, `ledger_closed`, `ledger_current`, `ripple_path_find`, `manifest`, `channel_authorize` veya `channel_verify` ise.

## Ayrıca Bakınız

- [Clio kaynak kodu](https://github.com/XRPLF/clio)
- **Eğitimler:**
    - `Ubuntu'da Clio sunucusu kurun`