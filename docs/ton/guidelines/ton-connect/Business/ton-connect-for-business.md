# TON Connect for Business

TON Connect, işletmeler için trafik çekmeyi ve kullanıcı bağlılığını artırmayı sağlayan güçlü özellikler sunarak özelleştirilebilir olacak şekilde tasarlanmıştır.

## Ürün özellikleri

- kontrollü kişisel veri açıklaması ile güvenli ve özel kimlik doğrulama
- tek bir kullanıcı oturumu içinde TON üzerinde keyfi işlem imzalama
- uygulamalar ile kullanıcı cüzdanları arasında anlık bağlantı
- cüzdanlar içinde doğrudan otomatik uygulama erişilebilirliği

---

## TON Connect'i Benimseme

### Temel adımlar

Geliştiricilerin TON Connect'i uygulamalarına entegre edebilmesi için özel TON Connect SDK'sı kullanılır. Süreç oldukça basittir ve gerektiğinde doğru belgeler erişilerek gerçekleştirilebilir.

:::tip
**Kullanıcı Bağlantısı:** TON Connect, kullanıcıların uygulamalarını bir QR kodu veya evrensel bağlantı linki aracılığıyla birçok cüzdanla bağlamalarına olanak tanır.
:::

:::info
Ayrıca, uygulamalar, cüzdan içinde yerleşik bir tarayıcı uzantısı kullanılarak açılabilir.
:::

:::warning
İlerleyen dönemlerde TON Connect'e eklenen yeni özelliklerden haberdar olmak kritik öneme sahiptir.
:::

### Geliştirici Entegrasyon Yardımı için TON Connect

1. Uygulamanızın mevcut kullanıcı akışını tanımlamak
2. Gereken işlemleri belirlemek (örneğin, işlem yetkilendirmesi, mesaj imzalama)
3. Teknoloji yığınızı ekibimize tanıtmak

> Dikkat: TON Connect ve çeşitli hizmetleri ve yetenekleri hakkında daha fazla bilgi edinmek isterseniz, istediğiniz çözümü tartışmak için TON Connect İş **geliştiricisi** ile iletişime geçmekten çekinmeyin.  
> — [tonrostislav](https://t.me/tonrostislav)

### Yaygın uygulama durumları

[TON Connect SDK](https://github.com/ton-connect/sdk) kullanarak, TON Connect'i entegre etmek için geliştiricilere detaylı talimatlar sunar:

- uygulamalarını çeşitli TON cüzdan türleri ile bağlamak
- ilgili cüzdan adresi aracılığıyla arka uç girişi
- talep işlemleri göndermek ve cüzdan içinde imzalamak (istekleri kabul etmek)

:::note
Bu çözümle mümkün olanları daha iyi anlamak için, GitHub'da mevcut olan demo uygulamamıza göz atmayı unutmayın: [https://github.com/ton-connect/](https://github.com/ton-connect/demo-dapp)
:::

---

### Şu anda desteklenen teknoloji yığını:

- tüm web uygulamaları — sunucusuz ve arka uçlar
- React-Native mobil uygulamalar
- yakında: Swift, Java, Kotlin dillerinde mobil uygulamalar için SDK

TON Connect açık bir protokoldür ve herhangi bir programlama dili veya geliştirme ortamı ile dapps geliştirmek için kullanılabilir.

JavaScript (JS) uygulamaları için, TON geliştirici topluluğu, geliştiricilerin TON Connect'i dakikalar içinde sorunsuz bir şekilde entegre etmelerini sağlayan bir JavaScript SDK'sı oluşturmuştur. Gelecekte, ek programlama dilleri ile çalışmak üzere tasarlanmış SDK'lar mevcut olacaktır.