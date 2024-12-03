---
title: Hesaplar
seoTitle: XRP Ledger Hesapları Hakkında Bilgi
sidebar_position: 4
description: XRP Ledgerdeki hesaplar, işlem gönderebilen ve XRP tutabilen birimleri temsil eder. Hesap yapısı, işlem geçmişi ve oluşturma süreci hakkında bilgi edinin.
tags: 
  - XRP
  - hesap
  - ledger
  - ödeme
  - kriptografi
keywords: 
  - XRP
  - hesap
  - ledger
  - ödeme
  - kriptografi
  - hesap yapısı
  - hesap oluşturma
---

# Hesaplar

XRP Ledger'deki bir "Hesap", XRP'yi tutan ve `işlemler` gönderen bir temsilcidir.

Bir hesap, bir adres, bir XRP bakiyesi, bir sıra numarası ve işlem geçmişini içerir. İşlem gönderebilmek için, hesap sahibinin ayrıca hesaba bağlı bir veya daha fazla kriptografik anahtar çiftine sahip olması gerekmektedir.

## Hesap Yapısı

Bir hesabın temel unsurları şunlardır:

- Bir tanımlayıcı **adres**, örneğin `rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn`.
- Bir **XRP bakiyesi**. Bu XRP'nin bir kısmı `Rezerv` için ayrılmıştır.
- **Sıra numarası**, bu hesabın gönderdiği işlemlerin doğru sırayla ve yalnızca bir kez uygulandığını sağlamak için yardımcı olur. Bir işlemi gerçekleştirmek için, işlemin sıra numarası ve göndericisinin sıra numarası eşleşmelidir. Ardından, işlem uygulamanın bir parçası olarak, hesabın sıra numarası 1 artar. (Bkz. ayrıca: `Temel Veri Türleri: Hesap Sırası`.)
- Bu hesabı ve bakiye geçmişini etkileyen **işlemler geçmişi**.
- `İşlemleri yetkilendirmek` için bir veya daha fazla yol, bunlar arasında:
    - Hesaba özgü bir anahtar çiftinin olması. (Bu devre dışı bırakılabilir ama değiştirilemez.)
    - Değiştirilebilen bir "normal" anahtar çifti.
    - `çoklu imzalama` için bir imzalayan listesi. (Hesabın temel verilerinden ayrı depolanır.)

Bir hesabın temel verileri, bir `AccountRoot` defter girişinde saklanır. Bir hesap ayrıca birkaç diğer türde defter girişinin sahibi (veya kısmi sahibi) olabilir.

:::tip 
XRP Ledger'deki bir "Hesap", finansal kullanım (örneğin "banka hesabı") ile bilişim kullanımı (örneğin "UNIX hesabı") arasında bir yerdedir. XRP dışındaki para birimleri ve varlıklar, XRP Ledger Hesabı içinde saklanmaz; her bir varlık, iki tarafı birbirine bağlayan bir "Güven Hattı" olarak adlandırılan bir muhasebe ilişkisi içinde saklanır.
:::

## Hesap Oluşturma

Özel bir "hesap oluşturma" işlemi yoktur. [Ödeme işlemi][] yeterince XRP göndermesi durumunda, matematiksel olarak geçerli ve daha önceden bir hesabı olmayan bir adrese otomatik olarak yeni bir hesap oluşturur. Bu, bir hesabı _finanse etmek_ olarak adlandırılır ve defterde bir `AccountRoot kaydı` oluşturur. Başka hiçbir işlem bir hesap oluşturamaz.

:::warning 
Bir hesabı finanse etmek, o hesap üzerinde özel ayrıcalıklar sağlamaz. Hesap adresine karşılık gelen gizli anahtara sahip olan kimse, o hesabın ve içindeki tüm XRP'nin tam kontrolüne sahiptir. Bazı adresler için, kimsenin gizli anahtarı olmayabilir; bu durumda hesap bir `kara delik` olur ve XRP sonsuza dek kaybolur.
:::

XRP Ledger'de bir hesap elde etmenin tipik yolu aşağıdaki gibidir:

1. Güçlü bir rastgelelik kaynağından bir anahtar çifti oluşturun ve o anahtar çiftinin adresini hesaplayın.
2. Zaten XRP Ledger'de bir hesabı olan birinin, oluşturduğunuz adrese XRP göndermesini sağlayın.
    - Örneğin, bir özel borsada XRP satın alabilir ve ardından XRP'yi belirttiğiniz adrese çekebilirsiniz.

    :::warning 
    Kendi XRP Ledger adresinize ilk kez XRP aldığınızda, `hesap rezervi` (şu anda 10 XRP) ödemeniz gerekmektedir; bu, o miktar XRP'yi sonsuza dek kilitler. Buna karşılık, özel borsalar genellikle tüm müşterilerinin XRP'sini birkaç ortak XRP Ledger hesabında tutar, böylece müşteriler borsa üzerinde bireysel hesaplar için rezerv ödemek zorunda kalmazlar. Çekim yapmadan önce, XRP Ledger'de doğrudan kendi hesabınıza sahip olmanın maliyetine değip değmeyeceğini düşünün.
    :::

## Ayrıca Bakın

- **Kavramlar:**
    - `Rezervler`
    - `Kriptografik Anahtarlar`
    - `İhraç ve Operasyonel Adresler`
- **Referanslar:**
    - [account_info method][]
    - [wallet_propose method][]
    - [AccountSet transaction][]
    - [Payment transaction][]
    - `AccountRoot object`
- **Eğitimler:**
    - `Hesap Ayarlarını Yönet (Kategori)`
    - `WebSocket ile Gelen Ödemeleri İzleyin`

