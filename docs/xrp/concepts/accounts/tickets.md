---
title: Biletler
seoTitle: XRP Ledger Biletleri Hakkında Bilgi
sidebar_position: 4
description: Biletler, XRP Ledgerde işlemleri sıralı olmayan bir şekilde gönderme yöntemidir. Bu özellik, özellikle çok imzalı işlemler için faydalıdır ve sıradışı senaryoları yönetir.
tags: 
  - Biletler
  - XRP Ledger
  - İşlem Gönderme
  - Çok İmza
  - Sıra Numarası
  - Teknik Dokümantasyon
  - Docusaurus
keywords: 
  - Biletler
  - XRP Ledger
  - İşlem Gönderme
  - Çok İmza
  - Sıra Numarası
  - Teknik Dokümantasyon
  - Docusaurus
---

# Biletler

_(Eklendi [TicketBatch amendment][].)_

XRP Ledger'deki bir Bilet, bir [sıra numarası][Sequence Number]'nı hemen göndermeden ayırmanın bir yoludur. Biletler, işlemlerin normal sıra düzeninin dışına gönderilmesine olanak tanır. Bu, gerekli imzaları toplamanın zaman alabileceği `çok imzalı işlemler` için bir kullanım senaryosudur: **"Bir Bilet kullanan bir işlem için imzaları toplarken, diğer işlemleri hala gönderebilirsiniz."** — XRP Ledger Dokümantasyonu

## Arka Plan

`İşlemler`, herhangi bir işlem verilse bile yalnızca bir kez gerçekleştirilebilmesi için sıra numaralarına sahiptir. Sıra numaraları, belirli bir işlemin benzersiz olmasını da sağlar: Eğer aynı miktar parayı aynı kişiye birden fazla kez gönderirseniz, her seferinde farklı olacak bir detaydır Sıra Numarası. **Son olarak, Sıra Numaraları, işlemleri tutarlı bir sırada yerleştirmenin zarif bir yolunu sağlar; bu, bazıları ağ boyunca gönderilirken sırasız geldiğinde bile geçerlidir.**

---

Ancak sıra numaralarının çok sınırlayıcı olduğu bazı durumlar vardır. Örneğin:

- İki veya daha fazla kullanıcı, her biri bağımsız olarak işlem gönderme yeteneği ile bir hesaba erişim paylaşıyor. Eğer bu kullanıcılar öncelikle koordine olmadan aynı anda işlem göndermeye çalışırlarsa, her biri farklı işlemler için aynı Sıra numarasını kullanmaya çalışabilir ve yalnızca biri başarılı olabilir.
- Bir işlemi önceden hazırlayıp imzalamak isteyebilirsiniz, ardından bunu güvenli bir depolamada saklayarak belirli olaylar gerçekleşirse gelecekte herhangi bir noktada gerçekleştirilebilmesini sağlamak isteyebilirsiniz. Ancak arada sırada hesabınızı normal şekilde kullanmaya devam etmek istiyorsanız, ayırdığınız işlemin hangi Sıra numarasına ihtiyaç duyacağını bilmezsiniz.
- `Birden fazla kişi, işlemi geçerli kılmak için imzalamalıdır` durumunda, aynı anda birden fazla işlemi planlamak zorlaşabilir. İşlemleri ayrı sıra numaraları ile numaralandırırsanız, tüm imzaların önceki işlemleri imzalamasını beklemeden daha sonraki numaralı işlemleri gönderemezsiniz; ancak bekleyen işlemler için aynı sıra numarasını kullanırsanız, yalnızca bir tanesi başarıya ulaşabilir.

Biletler, sıradışı bir şekilde, ancak yine de her birini yalnızca bir kez kullanarak, kullanılmak üzere ayırarak bu tüm sorunların çözümünü sunar.

## Biletler Ayrılmış Sıra Numaralarıdır

Bir Bilet, daha sonra kullanılmak üzere bir sıra numarasının ayrıldığını kaydeden bir kayıttır. **Bir hesap önce bir [TicketCreate işlemi][] göndererek bir veya daha fazla sıra numarasını Biletler olarak ayırır; bu, her ayrılmış sıra numarası için `defterin durum verilerinde`, bir [Bilet nesnesi][] şeklinde bir kayıt oluşturur.**

Biletler, oluşturulurken ayrılmış sıra numaralarını kullanarak numaralandırılır. Örneğin, hesabınızın mevcut sıra numarası 101 ise ve 3 Bilet oluşturursanız, bu Biletlerin Bilet Sıra numaraları 102, 103 ve 104 olacaktır. Bu, hesabınızdaki sıra numarasını 105'e yükseltir.


Daha sonra, belirli bir Bilet kullanarak bir işlem gönderebilirsiniz; bu, ilgili Bileti defterin durum verilerinden kaldırır ve hesabınızın normal sıra numarasını değiştirmez. Ayrıca Bilet kullanmadan normal sıra numaralarıyla işlemler göndermeye de devam edebilirsiniz. **Herhangi bir zaman, Biletlerinizi herhangi bir sırayla kullanabilirsiniz, ancak her Bilet yalnızca bir kez kullanılabilir.**


Yukarıdaki örneği devam ettirerek, sıra numarası 105 veya oluşturduğunuz üç Biletten herhangi biri ile bir işlem gönderebilirsiniz. **"Bilet 103 kullanarak bir işlem gönderirseniz, Bilet 103'ün defterden silinmesini sağlar."** — XRP Ledger Dokümantasyonu. Ardından, sonraki işleminiz sıra numarası 105, Bilet 102 veya Bilet 104 kullanabilir.

:::warning
**Dikkat:** Her Bilet, `sahip rezervi` için ayrı bir madde olarak sayılmaktadır, bu nedenle her Bilet için 2 XRP ayırmanız gerekir. (XRP, Bilet kullanıldıktan sonra tekrar kullanılabilir hale gelir.) Bu maliyet, aynı anda büyük sayıda Bilet oluşturursanız hızla birikebilir.
:::

Sıra numaralarında olduğu gibi, bir işlemi göndermek, işlem `konsensüs` tarafından onaylanmışsa Bileti tüketir _ancak yalnızca_ Bilet kullanıyorsanız. Ancak, amaçladıkları şeyi gerçekleştiremeyen işlemler, `tec` sınıfı sonuç kodları` ile konsensüs tarafından onaylanabilir.

Bir hesabın hangi Biletlerinin mevcut olduğunu kontrol etmek için, [account_objects yöntemi][] kullanın.

## Sınırlamalar

Herhangi bir hesap, herhangi bir işlem türünde Bilet oluşturabilir ve kullanabilir. Ancak bazı kısıtlamalar geçerlidir:

- **Her Bilet yalnızca bir kez kullanılabilir.** Aynı Bilet Sırasını kullanacak birden fazla farklı aday işlem olması mümkündür, ancak yalnızca bir tanesi konsensüs tarafından geçerli bir şekilde onaylanabilir.
- Her hesap defterde aynı anda 250'den fazla Bilet bulunduramaz. Aynı anda 250'den fazla Bilet oluşturamazsınız.
- **Bir Bileti kullanarak daha fazla Bilet oluşturabilirsiniz.** Eğer öyle yaparsanız, kullandığınız Bilet, aynı anda sahip olabileceğiniz Biletlerin toplam sayısına dahil edilmez.
- Her Bilet, `sahip rezervi` için sayılır, bu yüzden henüz kullanmadığınız her Bilet için 2 XRP ayırmanız gerekmektedir. XRP, Bilet kullanıldıktan sonra tekrar sizin için kullanılabilir hale gelir.
- Bireysel bir defter içinde, Bilet kullanan işlemler, aynı göndericiden gelen diğer işlemlerden sonraki sırada yürütülür. Bir hesap, aynı defter versiyonunda birden fazla Bilet kullanan işleme sahipse, bu Biletler en düşük Bilet Sırasından en yüksek olanına kadar sırasıyla icra edilir. (Daha fazla bilgi için, konsensüsün `kanıt düzeni` dokümantasyonuna bakın.)
- **Bir Bileti "iptal etmek" için, Bileti `no-op yaparak kullanın` [AccountSet işlemi][].** Bu, Bileti siler, böylece rezerv gereksinimini karşılamak zorunda kalmazsınız.

## Ayrıca Bakınız

- **Kavramlar:**
    - `Çok İmza`
- **Eğitimler:**
    - `Biletleri Kullanma`
- **Referanslar:**
    - [TicketCreate işlemi][]
    - `İşlem Ortak Alanları`
    - `Bilet nesnesi`
    - [account_objects yöntemi][]
    
