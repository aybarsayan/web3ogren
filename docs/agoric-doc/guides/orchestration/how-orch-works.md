---
title: Orkestrasyonun Çalışma Prensibi
---

# Orkestrasyonun Çalışma Prensibi

Orkestrasyon, blok zincirlerinin birbiriyle güvenli ve verimli bir şekilde iletişim kurmasını ve işlem yapmasını sağlayan protokoller ve mekanizmalar üzerine dayanmaktadır. Orkestrasyonun başlıca hedefleri şunlardır:

- **İnteroperabilite:** Farklı blok zincir ağlarının birbiriyle etkileşimde bulunmasını ve işlem yapmasını sağlamak.
- **Ölçeklenebilirlik:** Birden fazla blok zincirinin performans kaybı yaşamadan iş birliği yapmasını kolaylaştırmak.
- **Güvenlik:** Zincirler arası işlemlerin güvenli ve güvenilir olmasını sağlamak.

Bu hedeflere ulaşmak için birçok temel teknoloji ve protokol geliştirilmiştir; bunlardan en öne çıkanı  'dür.





### Inter-Blockchain Communication (IBC)

, sıklıkla internetin TCP/IP protokolü ile kıyaslanmaktadır. Nasıl ki TCP/IP farklı bilgisayar ağlarının internet üzerinden iletişim kurmasını sağlıyorsa, IBC de blok zincirlerinin birbirleriyle güvenli bir şekilde iletişim kurmasına olanak tanır.

#### IBC Nasıl Çalışır

IBC, oldukça basit bir prensibe dayanır: Ortak bir iletişim protokolü setine uyarak, blok zincirleri birbirleri arasında veri ve token transferini güvenli bir şekilde gerçekleştirebilir. İşte IBC'nin bunu nasıl başardığına dair yüksek seviyede bir genel bakış:

- **Hafif İstemci Doğrulaması:** Her blok zinciri, diğer blok zincirinin bir  tutar. Hafif istemci, tüm blok zinciri geçmişini saklamadan işlem ve kanıtları doğrulamak için yeterli bilgiyi tutan basitleştirilmiş bir blok zincir istemcisidir.
- **Gönderen:** , bir blok zincirindeki işlemleri dinleyip bunları diğerine ileten dış bir süreçtir. Gönderen, blok zincirleri arasındaki iletişimi kolaylaştırır, ancak özel izinlere veya yeteneklere sahip değildir; yalnızca zincirler arasında mesajları iletir.
- **IBC Tokalaşması:** İki blok zinciri iletişim kurmadan önce, güvenilir bir kanal oluşturmak amacıyla bir tokalaşma gerçekleştirir. Bu, hafif istemcileri kullanarak birbirlerinin konsensüs durumunu doğrulamayı içerir.
- **Paket Transferi:** Bağlantı kurulduktan sonra, IBC veri paketlerinin transferine olanak tanır. Bu paketler, tokenları, akıllı sözleşme komutlarını veya diğer verileri temsil edebilir. Alıcı blok zinciri, verinin geçerli ve değiştirilmediğini doğrulamak için hafif istemci doğrulamasını kullanır.
- **Kesinlik ve Onay:** Bir paket alıcı blok zinciri tarafından başarıyla işlendiğinde, işlem tamamlandığını onaylayan bir bildirim, kaynak blok zincirine geri gönderilir.

IBC protokolünün modüler yapısı, çeşitli kullanım durumları ve blok zinciri türleri için uyarlanmasına olanak tanır ve böylece blok zinciri orkestrasyonu için çok yönlü bir araç haline gelir.

### Interchain Hesapları (ICA)

, bir blok zincirinin (kontrol zinciri) başka bir blok zincirindeki (ev sahibi zincir) bir hesabı kontrol etmesine olanak tanıyan IBC'nin üstüne inşa edilmiş bir özelliktir. Bu, blok zincirleri arasında kesintisiz zincirler arası işlemler ve otomasyon sağlamakta, karmaşık etkileşimlere imkan tanımaktadır.

#### ICA Nasıl Çalışır

ICA protokolü, bir kontrol zincirinin bir ev sahibi zincir üzerinde bir hesap oluşturmasını talep etmesine olanak tanır. Ev sahibi zincir, hesabı yaratır ve kontrolünü kontrol zincirine devreder.

- **Hesap Oluşturma:** Kontrol zinciri (örneğin, Agoric), ev sahibi zincirde (örneğin, Osmosis) bir hesap talep eder. Ev sahibi zincir ardından hesabı oluşturur ve kontrolü kontrol zincirine devreder.
- **Agoric'te Somutlaştırma:** Kontrol zinciri Agoric olduğunda, hesap ve Zincir nesnelerinin Orkestrasyon API'sinde kontrolü JavaScript nesneleri olarak somutlaştırılır. Örneğin,
  ```
  const chain = orch.getChain('osmosis')
  ```
  Osmosis ev sahibi zincirini temsil eden bir nesne oluşturur. `chain.makeAccount()` çağrısı, Agoric zincirine kontrol eden olarak hareket etmeyi ve Osmosis zincirinde bir Interchain Hesabı (ICA) oluşturmayı talep eder. Bu işlem, ICA'yı kontrol etmeye erişim sağlayan `OrchestrationAccount` nesnesini üretir.
- **Erişim Kontrolü:** JavaScript nesnesine erişimi olan herkes, hesabı kontrol edebilir. Agoric'in mimarisinde, bu nesneye erişim yalnızca yetkili taraflara aktarılır. Özellikle, `chain.makeAccount()` çağrısını yapan taraf bu nesneye erişim kazanır, bu da güvenli bir erişim yetkilendirmesini sağlar.
- **İşlem Çalıştırma:** Kontrol zinciri (örneğin, Agoric) artık, ev sahibi zincir (örneğin, Osmosis) üzerinde yerel bir kullanıcıymış gibi işlem gerçekleştirmek için IBC mesajları gönderebilir. Bu, token transferi, akıllı sözleşmelerle etkileşim ve diğer blok zinciri işlemlerini içerir.
- **Otomasyon:** ICA kullanarak, kontrol zinciri ev sahibi zincir üzerinde işlemleri otomatikleştirebilir. Örneğin, Agoric başka bir zincirdeki varlıkları programatik olarak yönetebilir ve birden fazla blok zincirini kapsayan iş akışlarını otomatikleştirebilir.

### Interchain Sorguları (ICQ)

Interchain Sorguları (ICQ), bir blok zincirindeki bir sözleşmenin başka bir blok zincirindeki bir hesabın durumunu güvenilir bir şekilde sorgulamasına olanak tanıyan güçlü bir özelliktir. Örneğin, Agoric üzerinde bir DeFi uygulaması, Osmosis veya Cosmos Hub gibi diğer zincirlerden bir hesabın bakiyesini yetkilendirme gerekmeksizin almak için ICQ'yu kullanabilir; bu da daha karmaşık zincirler arası ticaret etkileşimlerine olanak tanır. ICQ, zincirler arası uygulamaların ve hizmetlerin yeni olanaklarını açarak blok zinciri ağlarının etkileşimliliğini artırır. İşte `osmosis` üzerindeki uzaktan bir hesabın bakiyesini almak için bir ICQ çağrısına bir örnek:

```js
const remoteChainBalance = await remoteAccount.getBalance('uosmo');
```

ICA, zincirler arası yazmadır, ICQ ise zincirler arası okumadır.

### Agoric'in Yaklaşımının Neden Öne Çıktığı

Agoric'in benzersiz programlama modeli, dağıtık ve asenkron yapıda olduğu için Interchain Hesapları ve Interchain Sorguları için özellikle uygun hale gelmektedir. Agoric'teki sözleşmeler etkileşime geçtiğinde, bireysel sözleşmelerin başka bir makinede veya farklı bir blok zincirinde yer alabileceği durumları ele alacak şekilde tasarlanmıştır. Bu doğal mimari, Agoric'in Interchain Hesaplarını sorunsuz bir şekilde kontrol etmesine ve yönetmesine olanak tanır ve bu da orkestrasyon yeteneklerini daha da artırır.

ICA ve ICQ'dan faydalanarak, orkestrasyon daha esnek ve güçlü hale gelir; blok zincirleri arasında doğrudan, programlanabilir etkileşimler sağlar. Bu, merkeziyetsiz finans (DeFi) ve tedarik zinciri yönetiminden çok daha fazlasına kadar geniş bir olasılıklar yelpazesi açar.