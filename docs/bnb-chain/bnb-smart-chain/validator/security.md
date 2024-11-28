---
title: Güvenli BSC Validator - BNB Akıllı Zincir
description: Bu belge, BSC doğrulayıcılarının bağımsız operasyonlar yürütmeleri ve güvenlik mekanizmaları hakkında önemli bilgiler sunar. Sentry düğümleri ile DDoS koruması gibi stratejileri tartışarak, ağın dayanıklılığını artırmaya yönelik yöntemler önerilmektedir.
keywords: [BSC, doğrulayıcı, güvenlik, DDoS, sentry düğümü, ağ dayanıklılığı, RPC]
---

# Güvenli BSC Validator

Her BSC doğrulayıcısının operasyonlarını bağımsız olarak yürütmesi önerilir, çünkü çeşitli kurulumlar ağın dayanıklılığını artırır. Doğrulayıcılar tarafından yatırılan yüksek miktar nedeniyle, onları farklı DoS ve DDoS saldırılarından korumak son derece önemlidir. Bu bölümde BSC'nin doğrulayıcıları için benimsediği güvenlik mekanizmasını tartışıyoruz.

## Sentry Düğmeleri (DDOS Koruması)

Doğrulayıcılar, hizmet engelleme saldırılarına karşı ağ dayanıklılığını sağlamalıdır. Bu riskleri azaltmanın etkili bir yolunu, ağlarını bir sentry düğümü mimarisinde organize etmekte bulabilirler. Kolayca dağıtılabilen ve IP adresi değişikliklerine uygun olan sentry düğmeleri, doğrudan internet saldırılarından korunmak amacıyla özel IP alanında çalışır. Bu yapı, doğrulayıcı blok önerilerinin ve oylarının güvenilir bir şekilde ağa ulaşmasını garanti eder.

:::tip
**Not:** Sentry düğümü kullanımı, ağın güvenliğini ve dayanıklılığını artırmak için kritik bir stratejidir.
:::

Sentry düğümü mimarinizi kurmak için aşağıdaki talimatları takip edebilirsiniz:

### 1. Düğüm Ayarları
Özel bir ağ oluşturun ve doğrulayıcı düğümü ile sentry düğümleri arasında güvenilir bağlantılar kurun. Doğrulayıcınızı ve sentry düğümlerinizi ayarlamak için `tam düğüm kılavuzuna` başvurun. Doğrulayıcınızın RPC uç noktalarını genel ağa açmaktan kaçının.

### 2. Eşler Ekle
Bireysel sentry düğümlerinin konsoluna bağlanın, `admin.nodeInfo.enode` komutunu çalıştırın. Bu, her düğüm için enode bilgilerini aşağıda gösterildiği gibi sağlayacaktır.

```
enode://f2da64f49c30a0038bba3391f40805d531510c473ec2bcc7c201631ba003c6f16fa09e03308e48f87d21c0fed1e4e0bc53428047f6dcf34da344d3f5bb69373b@[::]:30306?discport=0
```

> **Not:**
> **[::]** localhost (127.0.0.1) adresi olarak yorumlanacaktır. Düğümünüz yerel bir ağda ise, her ana makinenin IP adresini belirlemek için `ifconfig` komutunu kontrol edin. Ancak, eğer eşleriniz yerel ağın dışındaysa, enode URL'sini doğru bir şekilde oluşturmak için harici IP adresinizi bilmeniz gerekir.

**[::]** ile doğru düğüm URL'sini değiştirin, enode bilgilerini kopyalayın ve bunları doğrulayıcı düğümünün `config.toml` dosyasına şu şekilde ekleyin:

```
# düğümü gizli yap
NoDiscovery = true
# yalnızca sentry'e bağlan
StaticNodes = ["enode://f2da64f49c30a0038bba3391f40805d531510c473ec2bcc7c201631ba003c6f16fa09e03308e48f87d21c0fed1e4e0bc53428047f6dcf34da344d3f5bb69373b@[10.1.1.1]:30306"]
```

### 3. Bağlantıları Onaylayın

Doğrulayıcının konsoluna bağlanın, `admin.peers` komutunu çalıştırın ve eklediğiniz sentry düğümlerinin detaylarını göreceksiniz.

## Güvenlik Duvarı Yapılandırması

`Geth`, çeşitli işlevler için farklı portlar kullanır.

P2P bağlantıları için bir dinleyici (TCP) portu ve bir keşif (UDP) portu kullanır, genellikle 30303 olarak yapılandırılır. Bu portun açık olduğundan emin olun.

:::info
**Açıklama:** Varsayılan JSON-RPC hizmet portu TCP portu 8545'tir. Yetkisiz admin işlemlerini önlemek için JSON-RPC portunu dışarıya açmaktan kaçının.
:::