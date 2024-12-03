---
title: Güvenli İmza
seoTitle: Güvenli İmza İçin Rehber
sidebar_position: 1
description: XRP Ledgere güvenli işlemler göndermek için gereken yapılandırmalar hakkında bilgi edinin. Çeşitli güvenlik seviyeleri ve en iyi uygulamalarla XRP Ledger işlemlerinizi güvence altına alın.
tags: 
  - güvenlik
  - XRP Ledger
  - dijital imzalama
  - işlem güvenliği
  - istemci kütüphanesi
  - özel imza cihazı
  - VPN
keywords: 
  - güvenlik
  - XRP Ledger
  - dijital imzalama
  - işlem güvenliği
  - istemci kütüphanesi
  - özel imza cihazı
  - VPN
---

# Güvenli İmza

XRP Ledger'e `işlemler` gönderebilmek için, `gizli anahtarlarınızı` tehlikeye atmadan bunları dijital olarak imzalamanız gerekir. (Başkaları gizli anahtarlarınıza erişim sağlarsa, sizin sahip olduğunuz kadar hesap üzerinde kontrole sahip olurlar ve tüm paranızı çalabilir veya yok edebilirler.) Bu sayfa, işlemleri güvenli bir şekilde imzalamanız için böyle bir ortam kurmanın özetini sunmaktadır.

:::tip
Ağda işlem göndermiyorsanız, Ripple tarafından işletilen güvenilir bir genel sunucuyu kullanarak gelen işlemleri izleyebilir veya diğer ağ etkinliklerini okuyabilirsiniz. Tüm işlemler, bakiyeler ve XRP Ledger'daki veriler kamuya açıktır.
:::

Durumunuza uygun farklı güvenlik seviyelerine sahip çeşitli yapılandırmalar bulunmaktadır. Aşağıdakilerden ihtiyaçlarınıza en uygun olanını seçin:

- `Yerel `rippled` işletin` veya `aynı LAN'da`.
- `Yerel imzalama yapabilen bir istemci kütüphanesi` kullanın.
- `XRP Ledger imzalarını destekleyen özel bir imzalama cihazı` kullanın.
- Güvendiğiniz bir uzak `rippled` makinesine bağlanmak için `güvenli bir VPN kullanın`.

---

## Güvensiz Yapılandırmalar


Dış kaynakların gizli anahtarınıza erişim sağlayabileceği herhangi bir yapılandırma tehlikelidir ve kötü niyetli bir kullanıcının tüm XRP'nizi (ve XRP Ledger adresinizdeki diğer her şeyi) çalmasıyla sonuçlanabilir. Bu tür yapılandırmalara, internet üzerinden başkasının `rippled` sunucusunun [imzalama metodunu][] kullanmak veya gizli anahtarınızı internet üzerinden kendi sunucunuza düz metin olarak göndermek örnek verilebilir.

**Gizli anahtarlarınızın her zaman gizliliğini korumalısınız;** bu, kendinize e-posta ile göndermemek, kamuya açık alanlarda görünür bir şekilde yazmamak ve kullanmadığınızda şifreli olarak—asla düz metin olarak—kaydetmek gibi şeyleri içerir. Güvenlik ve kullanım kolaylığı arasındaki denge, adreslerinizin varlıklarının değerine kısmen bağlıdır, bu nedenle farklı amaçlar için farklı güvenlik yapılandırmalarına sahip birden fazla adres kullanmak isteyebilirsiniz.

---

## Yerel rippled Çalıştırma


Bu yapılandırmada, işlemleri üreten makinede `rippled` uygulamasını çalıştırıyorsunuz. Gizli anahtar sizin makinenizden asla ayrılmadığı için, makinenize erişimi olmayan hiç kimse gizli anahtara ulaşamaz. Elbette, makinenizi güvence altına almak için sektördeki standart uygulamalara uymalısınız. Bu yapılandırmayı kullanmak için:

1. `rippled` yükleyin.

    Yerel makinenizin en az `rippled için sistem gereksinimlerini` karşıladığından emin olun.

2. İşlemleri imzalamanız gerektiğinde `localhost` veya `127.0.0.1` üzerindeki sunucunuza bağlanın. [imzalama metodunu][] (tek imzalar için) veya [çoklu imzalama metodunu][] (çoklu imzalar için) kullanın.

   [örnek yapılandırma dosyası](https://github.com/XRPLF/rippled/blob/8429dd67e60ba360da591bfa905b58a35638fda1/cfg/rippled-example.cfg#L1050-L1073), yerel geri dönme ağı (127.0.0.1) üzerinde bağlantıları dinler, JSON-RPC (HTTP) ile 5005 numaralı portta ve WebSocket (WS) ile 6006 numaralı portta çalışır ve tüm bağlı istemcileri yönetici olarak kabul eder.

   :::warning
   İmzalar için `komut satırı API'si` kullanmak, `Websocket veya JSON-RPC API'leri` kullanmaktan daha az güvenlidir. Komut satırı söz dizimini kullanırken, gizli anahtarınız sistemin işlem listesindeki diğer kullanıcılar tarafından görünür hale gelebilir ve kabuk geçmişiniz anahtarı düz metin olarak kaydedebilir.
   :::

3. Sunucuyu çalışır durumda, güncel ve ağla senkronize tutmak için gerekli bakımı yapın.

   :::info
   İşlem göndermediğiniz zaman `rippled` sunucunuzu kapatabilirsiniz, ancak tekrar başlattığınızda ağ ile senkronize olmak 15 dakikaya kadar sürebilir.
   :::

---

## Aynı LAN'da rippled Çalıştırma



Bu yapılandırmada, işlemleri imzalamak için işlemleri üreten makine ile aynı özel yerel alan ağı (LAN) içinde özel bir `rippled` sunucusu çalıştırıyorsunuz. Bu yapılandırma, çok düşük sistem özelliklerine sahip bir veya daha fazla makinede işlem talimatları hazırlamanızı sağlarken, `rippled` çalıştırmak için tek bir özel makine kullanmanızı sağlar. Kendi veri merkeziniz veya sunucu odanız varsa, bu durum ilginizi çekebilir.

Bu yapılandırmayı kullanmak için, `rippled` sunucusunu LAN içinde `wss` ve `https` bağlantılarını kabul edecek şekilde ayarlayın. [Sertifika pinning](https://en.wikipedia.org/wiki/Transport_Layer_Security#Certificate_pinning) kullanıyorsanız, kendinden imzalı bir sertifika kullanabilirsiniz veya bir iç tesis veya iyi bilinen bir Sertifika Otoritesi tarafından imzalanan bir sertifika kullanabilirsiniz. [Let's Encrypt](https://letsencrypt.org/) gibi bazı sertifika otoritelere otomatik olarak ücretsiz sertifika verir.

Her zaman olduğu gibi, makinelerinizi güvence altına almak için sektördeki standart uygulamalara uymalısınız; örneğin bir güvenlik duvarı, antivirüs, uygun kullanıcı izinleri vb. kullanmalısınız.

---

## Yerel İmzalama ile İstemci Kütüphanesi Kullanma



Bu yapılandırma, kullandığınız programlama dilinde yerleşik imzalama ile bir istemci kütüphanesi kullanır. Yerel imzalama yapabilen kütüphaneler için `İstemci Kütüphaneleri` bölümüne bakın.

### İmzalama Kütüphaneleri için Güvenlik En İyi Uygulamaları

İmzalama kütüphanenizin güvenliğini optimize etmek için:

* Kullanmakta olduğunuz imzalama kütüphanesinin, imzalama algoritmalarını düzgün ve güvenli bir şekilde uyguladığından emin olun. Örneğin, kütüphane varsayılan ECDSA algoritmasını kullanıyorsa, [RFC-6979](https://tools.ietf.org/html/rfc6979) belgelerinde açıklandığı gibi belirleyici nonce'lar da kullanmalıdır.

   **Yukarıda belirtilen tüm yayımlanmış kütüphaneler sektördeki en iyi uygulamalara uyar.**

* İstemci kütüphanenizi en son kararlı sürümde güncel tutun.

* Güvenliği artırmak için, gizli anahtarlarınızı [Vault](https://www.vaultproject.io/) gibi bir yönetim aracından yükleyebilirsiniz.

### Yerel İmzalama Örneği

İşlem talimatlarını yerel olarak imzalamak için aşağıdaki diller ve kütüphanelerle nasıl kullanılacağını gösteren örnekler:

* **JavaScript** / **TypeScript** - [`xrpl.js`](https://github.com/XRPLF/xrpl.js)

* **Python** - [`xrpl-py`](https://github.com/XRPLF/xrpl-py)

* **Java** - [`xrpl4j`](https://github.com/XRPLF/xrpl4j)



JavaScript
code-snippet file="/_code-samples/secure-signing/js/signPayment.js" language="js" /%}


Python
code-snippet file="/_code-samples/secure-signing/py/sign-payment.py" language="py" /%}


Java
code-snippet file="/_code-samples/secure-signing/java/SignPayment.java" language="java" /%}




---

## Özel Bir İmza Cihazı Kullanma



Bazı şirketler, gizli anahtarın asla cihazdan ayrılmadığı XRP Ledger işlemlerini imzalayabilen, [Ledger Nano S](https://www.ledger.com/products/ledger-nano-s) gibi özel imzalama cihazları satmaktadır. Bazı cihazlar tüm işlem türlerini desteklemeyebilir.

Bu yapılandırmayı kurmak, belirli cihaza bağlıdır. İmzalama cihazınızla etkileşim kurmak için makinenizde bir "yönetici" uygulaması çalıştırmanız gerekebilir. Bu tür bir cihazı kurmak ve kullanmak için üretici talimatlarına bakın.

---

## Uzaktan rippled Sunucu ile Güvenli VPN Kullanımı



Bu yapılandırma, uzakta bir yerleştirme tesisinde veya uzaktaki bir veri merkezinde barındırılan bir `rippled` sunucusunu kullanır, ancak şifreli bir VPN aracılığıyla güvenli bir şekilde bağlanır.

Bu yapılandırmayı kullanmak için, `özel LAN'da `rippled` çalıştırma` için adımları izleyin, ancak uzak `rippled` sunucusunun LAN'ına bağlanmak için bir VPN kullanın. VPN'in kurulumu, ortama özeldir ve bu kılavuzda açıklanmamıştır.

---

## Ayrıca Bakınız

- **Kavramsal:**
    - `Kriptografik Anahtarlar`
    - `Çoklu İmzalama`
- **Kılavuzlar:**
    - `rippled` yükleme`
    - `Düzenli Anahtar Çifti Atama`
    - `Güvenilir İşlem Gönderimi`
    - `Halka Açık İmzalamayı Etkinleştirme`
- **Kaynaklar:**
    - [imzalama metodunu][]
    - [gönderim metodunu][]
    - [xrpl.js Referansı](https://js.xrpl.org/)
    - [`xrpl-py` Referansı](https://xrpl-py.readthedocs.io/en/latest/index.html)
    - [`xrpl4j` Referansı](https://javadoc.io/doc/org.xrpl/)

