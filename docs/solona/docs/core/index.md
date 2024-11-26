---
title: Temel Kavramlar
sidebarSortOrder: 2
description:
  Solana blok zinciri ile ilgili hesaplar, işlemler, programlar, 
  programdan türetilmiş adresler, çapraz program çağrıları ve tokenların 
  nasıl çalıştığını öğrenin.
---

Solana'yı diğer blok zincirlerinden ayıran temel kavramları güçlü bir şekilde anlamaya başlayın. Bu temel kavramlar aracılığıyla **"Solana programlama modeli"**ni anlamak, Solana blok zinciri geliştiricisi olarak başarınızı maksimize etmek için çok önemlidir.

## Solana Hesap Modeli

Solana'da, tüm veriler "hesaplar" olarak adlandırılan yapılarda depolanır. Solana blok zincirinde verilerin organizasyonu, her bir veritabanı girişinin "hesap" olarak adlandırıldığı bir [key-value store](https://en.wikipedia.org/wiki/Key%E2%80%93value_database) yapısını andırmaktadır.

:::info
Daha fazla bilgi için `Hesaplar` bölümüne bakın.
:::

## İşlemler ve Talimatlar

Solana'da, ağla etkileşimde bulunmak için `işlemler` göndeririz. İşlemler, işlenmesi gereken belirli bir operasyonu temsil eden bir veya daha fazla `talimat` içerir. Talimatların yürütme mantığı, Solana ağına dağıtılan `programlar` üzerinde saklanır ve her program kendi setindeki talimatları saklar.

:::tip
Daha fazla bilgi için `İşlemler` ve `Talimatlar` bölümüne bakın.
:::

## Solana'da Ücretler

Solana blok zincirinin, izinsiz ağı kullanmak için ortaya çıkan birkaç farklı ücret ve maliyeti vardır. Bunlar birkaç spesifik türe ayrılabilir:

- `İşlem Ücretleri` - Geçerlilerin işlemleri/talimatları işlemeleri için alınan ücret
- `Öncelik Ücretleri` - İşlem sırasını artırmak için isteğe bağlı bir ücret
- `Kira` - Verilerin zincirde saklanmasını sağlamak için tutulan bakiye

:::note
Daha fazla bilgi için `Solana'daki Ücretler` bölümüne bakın.
:::

---

## Solana'daki Programlar

Solana ekosisteminde **"akıllı sözleşmeler"** programlar olarak adlandırılır. Her program, belirli işlevlere *talimat* denilen ve ilgili dağıtılan program içinde *talimat işleyici* işlevleri aracılığıyla çağrılan çalıştırılabilir mantığı saklayan bir zincir içi hesaptır.

:::info
Daha fazla bilgi için `Solana'daki Programlar` bölümüne bakın.
:::

## Programdan Türetilmiş Adres

Programdan Türetilmiş Adresler (PDA'lar), Solana'daki geliştiricilere iki ana kullanım durumu sunar:

- **Belirleyici Hesap Adresleri**: PDA'lar, opsiyonel "tohumlar" (önceden belirlenmiş girdiler) ve belirli bir program kimliği kombinasyonu kullanarak adres türetmek için bir mekanizma sağlar.
- **Program İmzalama Yeteneği**: Solana çalışma zamanı, PDA'lar için programların program kimliğinden türetilmiş olarak "imzalamalarına" olanak tanır.

PDA'ları, önceden belirlenmiş bir girdi setinden (örneğin, dizeler, sayılar ve diğer hesap adresleri) zincir üzerinde hashmap benzeri yapılar oluşturmanın bir yolu olarak düşünebilirsiniz.

:::warning
Daha fazla bilgi için `Programdan Türetilmiş Adres` bölümüne bakın.
:::

## Çapraz Program Çağrısı

Çapraz Program Çağrısı (CPI), bir programın başka bir programın talimatlarını çağırdığında meydana gelir. Bu mekanizma, Solana programlarının bileşenliliğini sağlar.

:::tip
Talimatları, bir programın ağa sunduğu API uç noktaları olarak, bir CPI'yi ise bir API'nin diğer bir API'yi dahili olarak çağırması olarak düşünebilirsiniz.
:::

Daha fazla bilgi için `Çapraz Program Çağrısı` bölümüne bakın.

## Solana'daki Tokenlar

Tokenlar, çeşitli malzeme kategorileri üzerinde mülkiyeti temsil eden dijital varlıklardır. Tokenizasyon, mülkiyet haklarının dijitalleştirilmesine olanak tanır ve hem değiştirilebilir hem de değiştirilemez varlıkları yönetmenin temel bileşeni olarak hizmet eder.

- **Değiştirilebilir Tokenlar**: Aynı tür ve değerde değiştirebilir ve bölünebilir varlıkları temsil eder (örneğin, USDC).
- **Değiştirilemez Tokenlar (NFT)**: Bölünemez varlıkların (örneğin, sanat eserleri) mülkiyetini temsil eder.

:::info
Daha fazla bilgi için `Solana'daki Tokenlar` bölümüne bakın.
:::

---

## Küme ve Uç Noktalar

Solana blok zincirinin, `Küme` olarak bilinen birkaç farklı doğrulayıcı grubu vardır. Her biri, genel ekosistemin içinde farklı amaçlar için hizmet eder ve ilgili Küme için `JSON-RPC` isteklerini yerine getirmek için özel api düğümleri içerir.

Bir Küme içindeki bireysel düğümler, üçüncü taraflar tarafından sahiplenilmektedir ve her biri için halka açık bir uç nokta mevcuttur.

Solana ağı üzerinde farklı halka açık uç noktalara sahip üç ana küme bulunmaktadır:

- Mainnet - `https://api.mainnet-beta.solana.com`
- Devnet - `https://api.devnet.solana.com`
- Testnet - `https://api.testnet.solana.com`

:::note
Daha fazla bilgi için `Küme ve Uç Noktalar` bölümüne bakın.
:::
