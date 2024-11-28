---
title: Cross Chain - opBNB SSS
description: opBNB, zincir dışı işlemler için veri erişilebilirliğini ve güvenliğini sağlarken önemli mekanizmalar kullanır. Bu içerik, opBNB'nin nasıl çalıştığını, toplayıcıların rolünü ve akıllı sözleşmelerle etkileşimi gibi konuları detaylandırır.
keywords: [opBNB, zincir dışı işlemler, veri güvenliği, akıllı sözleşmeler, toplama mekanizması]
---

### opBNB, zincir dışı işlemler için veri erişilebilirliğini ve güvenliğini nasıl sağlar?

opBNB, veri erişilebilirliğini ve güvenliğini sağlamak için **"dolandırıcılık kanıtları"** adı verilen bir mekanizmaya dayanır. Kullanıcılar, zincir dışındaki optimistik rollup'taki herhangi bir kötü niyetli davranışı veya yanlış işlem işlemesini kanıtlayan kanıtları zincir üzerinde sunabilir. **Eğer bir dolandırıcılık kanıtı geçerliyse, sistem kötü niyetli aktörü cezalandırabilir ve herhangi bir yanlış durum değişikliğini geri alabilir.**

---

### opBNB ağında zincir dışı işlemleri toplamak ve paketlemekten kim sorumludur?

Sıralayıcılar, işlemlerin toplanmasından, durum geçişlerinin hesaplanmasından ve bunların BSC'deki rollup sözleşmesine sunulmasından sorumludur.

---

### opBNB ağındaki toplayıcının rolü nedir?

Toplayıcılar, zincir dışı işlemleri paketler halinde toplamakla sorumlu olan varlıklardır. Bu, opBNB için kritik bir rol oynar çünkü bu işlem paketlerini oluşturur ve bunları doğrulama için ana BNB zincirine sunar. Toplayıcılar ayrıca sundukları veriler için **Merkle kanıtları** oluşturur, bu da bağlama süreci için gereklidir.

:::tip
Toplayıcıların başarılı çalışması, opBNB ağının verimliliği için **hayati öneme sahiptir**.
:::

---

### opBNB, ana BNB Zinciri gibi akıllı sözleşmeleri ve karmaşık hesaplamaları işleyebilir mi?

opBNB ağı **EVM uyumludur** ve akıllı sözleşme geliştiricileri açısından BSC ile aynı şekilde çalışır. Bu, geliştiricilerin mevcut Ethereum veya BSC akıllı sözleşmelerini opBNB'ye minimum değişiklikle kolayca dağıtabileceği anlamına gelir.

### opBNB, akıllı sözleşme etkileşimlerini ve birleştirilebilirliği nasıl ele alır?

Akıllı sözleşme etkileşimleri ve birleştirilebilirlik, optimistik rolluplar için zorlayıcı yönlerdir. opBNB, **akıllı sözleşme etkileşimlerini kolaylaştırabilse de**, zincir dışı işlemenin sınırlamaları belirli karmaşık birleştirilebilirlik senaryolarının daha az verimli olabileceği veya hiç desteklenmeyeceği anlamına gelir. opBNB kullanan geliştiriciler ve projeler, uygulamalarını tasarlarken bu sınırlamaları dikkatlice göz önünde bulundurmalıdır.

---

### Zincir dışı bir işlemin geçerliliği hakkında bir anlaşmazlık olursa ne olur?

Bir anlaşmazlık durumunda, bir "meydan okuma" dönemi başlatılır. Bu süre zarfında, herkes bir zincir dışı işlemin geçerliliğini sorgulamak için bir dolandırıcılık kanıtı sunabilir. **Eğer dolandırıcılık kanıtı geçerliyse ve işlemin yanlış veya kötü niyetli olduğunu kanıtlıyorsa, işlem zincir üzerinde geri alınır ve kötü niyetli aktör cezalarla karşılaşabilir.**

### Ana BNB Akıllı Zinciri'nde dağıtılan akıllı sözleşmeler, opBNB üzerindeki uygulamalarla sorunsuz bir şekilde etkileşime geçebilir mi? Evet ise, nasıl?

**Evet**, bu, opBNB ağında işlemlerin gerçekleştirilmesini sağlayan bir dizi akıllı sözleşme aracılığıyla gerçekleştirilir. Ana sözleşme, L1 üzerindeki Sıralayıcıdan işlem gruplarını alan `batchInbox` sözleşmesidir.

---

### L1 ile L2 arasında akıllı sözleşme çapraz zincir iletişimini nasıl sağlarız?

L1 (BSC) üzerinden L2 (opBNB) üzerinde bulunan akıllı sözleşme fonksiyonlarıyla **doğrudan etkileşim kurmak mümkün değildir** çünkü L2 üzerindeki tüm akıllı sözleşmeler L1'den izole durumdadır.


Daha fazla bilgi için tıklayın

Bununla birlikte, geliştiricilerin kendi sözleşmelerini yazarak gerekli iş mantıklarını inşa etmeleri yoluyla keyfi mesaj göndermelerini sağlamanın bir yolu vardır. Daha fazla detay [burada](https://community.optimism.io/docs/developers/bridge/messaging/#communication-basics-between-layers).



---

### opBNB ile Greenfield arasında doğrudan varlık transferi yapabilir miyim?

**Şu anda**, opBNB ile Greenfield arasında doğrudan çapraz zincir transferleri desteklenmemektedir. Bununla birlikte, kullanıcılar, BNB Akıllı Zinciri (BSC) aracılığıyla iki aşamalı bir işlem gerçekleştirerek bu iki ağ arasında çapraz zincir transferleri gerçekleştirebilir. Bu, varlıkların opBNB'den BSC'ye ve ardından BSC'den Greenfield'a transfer edilmesini içerir.