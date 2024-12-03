---
title: Yazılım Ekosistemi
seoTitle: XRP Ledger Yazılım Ekosistemi
sidebar_position: 1
description: XRP Ledger yazılımının ne olduğunu ve nasıl bir araya geldiğini öğrenin. Bu belge, yazılım ekosisteminin çeşitli katmanlarını ve her katmanın rolünü açıklamaktadır.
tags: 
  - XRP Ledger
  - yazılım ekosistemi
  - değer interneti
  - temel sunucular
  - istemci kütüphaneleri
  - ara middleware
  - uygulamalar
keywords: 
  - XRP Ledger
  - yazılım ekosistemi
  - değer interneti
  - temel sunucular
  - istemci kütüphaneleri
  - ara middleware
  - uygulamalar
---

## Yazılım Ekosistemi

XRP Ledger, bir Değer İnterneti'ni güçlendiren ve etkinleştiren derin, katmanlı bir yazılım projeleri ekosistemine ev sahipliği yapmaktadır. XRP Ledger ile etkileşimde bulunan her projeyi, aracıyı ve işletmeyi listelemek imkânsızdır, bu nedenle bu sayfa yalnızca birkaç kategori listeler ve bu web sitesinde belgelenmiş bazı merkezi projeleri vurgular.

## Yığın Düzeyleri

:::info
XRP Ledger ekosistemi, çeşitli katmanlardan oluşmaktadır ve her bir katman özel işlevler sunmaktadır.
:::

- **Temel Sunucular**: XRP Ledger'in temelini oluşturur, her an işlemleri ileten ve işleyen bir eşler arası ağdır.
- **İstemci Kütüphaneleri**: Daha yüksek seviyeli yazılımlarda bulunur, burada doğrudan program koduna içe aktarılır ve XRP Ledger'e erişim yöntemlerini içerir.
- **Ara Middleware**: XRP Ledger verilerine dolaylı erişim sağlar. Bu katmandaki uygulamalar genellikle kendi veri depolama ve işleme sistemlerine sahiptir.
- **Uygulamalar ve Hizmetler**: XRP Ledger ile kullanıcı düzeyinde etkileşim sağlar veya daha yüksek düzeyde uygulamalar ve hizmetler için bir temel sağlar.

### Temel Sunucular

XRP Ledger'in kalbinde yer alan eşler arası ağ, konsensüs ve işlem işleme kurallarını uygulamak için son derece güvenilir, verimli bir sunucu gerektirir. XRP Ledger Vakfı, bu sunucu yazılımının `**rippled**` (okunuşu "ripple-dee") olarak adlandırılan bir referans uygulamasını yayımlar. Sunucu, [izin verici bir açık kaynak lisansı](https://github.com/XRPLF/rippled/blob/develop/LICENSE.md) altında mevcuttur, bu nedenle herkes kendi sunucu örneğini inceleyebilir ve değiştirebilir ve kısıtlı şartlarla yeniden yayımlayabilir.



Her temel sunucu aynı ağa senkronize olur (bir `test ağı` izlemek için yapılandırılmadığı sürece) ve ağ üzerindeki tüm iletişimlere erişimi vardır. Ağa bağlı her sunucu, tüm XRP Ledger için en son durum verisinin tam bir kopyasını, son işlemleri ve bu işlemlerin yaptığı değişikliklerin kaydını tutar ve her sunucu, her işlemi bağımsız olarak işlerken sonucunun ağın geri kalanıyla eşleştiğini doğrular. Sunucular, daha fazla `defter geçmişi` saklayacak şekilde yapılandırılabilir ve `doğrulayıcı` olarak konsensüs sürecine katılabilir.

:::tip
Her temel sunucu, işlemleri bağımsız olarak işleyerek ağın güvenliğini artırmaktadır.
:::

Temel sunucular, kullanıcıların veri araması, sunucuyu yönetmesi ve işlemler göndermesi için `HTTP / WebSocket API'leri` sunar. Bazı sunucular HTTP / WebSocket API'leri de sunar ancak doğrudan eşler arası ağa bağlanmazlar ve işlemleri işlemezler veya konsensüse katılmazlar. Bu sunucular, `rippled` modunda çalışan sunucular ve Clio sunucuları gibi, işlemleri işlemek için P2P modundaki bir temel sunucuya bağımlıdır.

### İstemci Kütüphaneleri

Kütüphaneler, genellikle HTTP / WebSocket API'leri aracılığıyla XRP Ledger'e erişim sağlama konusunda bazı yaygın işleri basitleştirir. Verileri çeşitli programlama dilleri için daha tanıdık ve uygun formlara dönüştürür ve yaygın işlemlerin uygulamalarını içerir.



> Çoğu istemci kütüphanesinin bir temel özelliği, işlemleri yerel olarak imzalamaktır, böylece kullanıcılar özel anahtarlarını herhangi bir ağ üzerinden göndermek zorunda kalmazlar.  
> — XRP Ledger Dokümantasyonu

Birçok ara middleware hizmeti, istemci kütüphanelerini dahili olarak kullanır.

Mevcut istemci kütüphaneleri hakkında bazı bilgiler için `İstemci Kütüphaneleri` sayfasına bakın.

### Ara Middleware

Ara middleware hizmetleri, bir tarafta XRP Ledger API'lerini tüketen ve diğer tarafta kendi API'lerini sağlayan programlardır. Daha yüksek seviyeli uygulamaları geliştirirken ortak işlevselliği hizmet olarak sunarak, bir soyutlama katmanı sağlarlar.



:::note
İstemci kütüphanelerinin aksine, ara middleware hizmetleri genellikle sürekli olarak çalışır ve kendi veritabanlarına sahiptir.
:::

İstemci kütüphanelerinin aksine, yeni oluşturulup içe aktarıldıkları programla birlikte kapatılan ara middleware hizmetleri genellikle sonsuz bir şekilde çalışır ve kendi veritabanlarına (ilişkisel SQL veritabanları veya diğerleri) ve yapılandırma dosyalarına sahip olabilirler. Bazıları, çeşitli fiyatlandırma veya kullanım sınırlamalarıyla bulut hizmetleri olarak mevcuttur.

### Uygulamalar ve Hizmetler

Yığının üstünde, gerçekten heyecan verici şeyler gerçekleşir. Uygulamalar ve hizmetler, kullanıcıların ve cihazların XRP Ledger ile bağlantı kurmasını sağlar. Özel borsalar, token ihraççıları, pazar yerleri, merkezi olmayan borsa arayüzleri ve cüzdanlar gibi hizmetler, XRP ve her türlü token dahil olmak üzere çeşitli varlıkları alım, satım ve takas etmek için kullanıcı arayüzleri sağlar. Daha yüksek katmanlarda bile katmanlı ek hizmetler de dahil olmak üzere birçok başka olasılık mevcuttur.


:::danger
Bu katmanın üstünde veya seviyesinde inşa edilebilecek bazı örnekleri kaçırmamak için, `Kullanım Senaryoları` sayfasını kontrol edin.
:::

