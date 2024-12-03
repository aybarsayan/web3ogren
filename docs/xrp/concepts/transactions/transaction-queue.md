---
title: İşlem Sırası
seoTitle: Rippleda İşlem Sırası ve Konsensüs Süreci
sidebar_position: 4
description: İşlemler, rippled sunucusu tarafından sıraya alınarak işlenir. Bu süreç, işlemleri etkileyen faktörler ve konsensüs süreci hakkında bilgi sağlar.
tags: 
  - işlem kuyruğu
  - Ripple
  - konsensüs
  - işlem maliyeti
  - açık defter
  - XRP
  - sunucu
keywords: 
  - işlem kuyruğu
  - Ripple
  - konsensüs
  - işlem maliyeti
  - açık defter
  - XRP
  - sunucu
---

# İşlem Sırası

`rippled` sunucusu, `açık defter maliyetini` uygulamaya yardımcı olmak için bir işlem kuyruğu kullanır. **Açık defter maliyeti**, belirli bir defterdeki hedef işlem sayısını belirler ve açık defter bu boyutu aştığında gerekli işlem maliyetini çok hızlı bir şekilde artırır. 

:::tip
Yükseltilmiş işlem maliyetini karşılayamayan işlemleri iptal etmek yerine, `rippled`, bunları bir işlem kuyruğuna koymaya çalışır ve bu kuyruk, bir sonraki defteri oluşturmak için kullanılır.
:::

## İşlem Sırası ve Konsensüs

İşlem kuyruğu, bir konsensüs sürecinde belirli bir defter versiyonuna dahil edilecek veya hariç tutulacak işlemleri seçerken önemli bir rol oynar. Aşağıdaki adımlar, işlem kuyruğunun `konsensüs süreci` ile nasıl ilişkili olduğunu açıklamaktadır.


1. **Konsensüs Tur 1** - Her bir doğrulayıcı, bir sonraki defter versiyonuna dahil edilmek üzere bir grup işlem önerir. 
2. **Konsensüs Tur 2** - Eğer bir doğrulayıcı, sonraki turlarda teklifinden bir işlemi kaldırırsa, o işlemi kuyruğuna ekler.
3. **Konsensüs Tur N** - Konsensüs süreci, yeterli sayıda sunucu bir işlem seti üzerinde hemfikir oluncaya kadar devam eder.
4. **Doğrulama** - Sunucular, aynı sonucu veren defteri oluşturduklarını onaylar ve onu geçerli olarak ilan ederler.
5. **Sonraki Teklifi Oluşturma** - Her doğrulayıcı, sıraya alınan işlemlerle başlayarak bir sonraki defter versiyonu için teklifini hazırlar.
6. **Kuyruğa Ekleme** - Eğer sonraki önerilen defter zaten doluysa, gelen işlemler sonraki bir defter versiyonu için sıraya alınır. (Açık defter maliyetini `ödeyen` işlemler, dolu olsa bile bir sonraki önerilen deftere girebilir, ancak açık defter maliyeti bu şekilde her eklenen işlemle birlikte üstel olarak büyür.)

> Bu adımın ardından, süreç baştan tekrar eder.  
> — Not

:::info Teknik olarak, yukarıda açıklanan adımlardan birçoğu paralel olarak gerçekleşir, çünkü her sunucu yeni işlemler için her zaman dinleme yapar ve önceki defter versiyonu için konsensüs süreci devam ederken bir sonraki defter teklifini hazırlamaya başlar.:::

## Kuyruklama Kısıtlamaları

`rippled` sunucusu, hangi işlemlerin "deftere dahil olma olasılığı yüksek" olduğunu tahmin etmek için çeşitli sezgisel yöntemler kullanır. Mevcut implementasyon, hangi işlemlerin kuyruğa alınacağını belirlemek için aşağıdaki kuralları kullanır:

- İşlemler, düzgün biçimde oluşturulmuş ve geçerli imzalarla `yetkilendirilmiş` olmalıdır.
- `AccountTxnID` alanı olan işlemler kuyruğa alınamaz.
- Tek bir gönderim adresinin aynı anda en fazla 10 işlemi kuyrukta olabilir.
- Bir işlemi kuyruğa almak için, göndericinin aşağıdakilerin tümü için yeterli XRP'si olmalıdır:
    - Tüm göndericinin kuyruğa alınmış işlemlerinin `Fee` alanlarında belirtilen XRP `işlem maliyetini` yok etmek. Kuyruktaki işlemler arasındaki toplam tutar, temel hesap rezervinden (şu anda 10 XRP) daha fazla olamaz. (**Minimum işlem maliyeti** 0.00001 XRP'den önemli ölçüde daha fazla ödeme yapan işlemler genellikle kuyruğu atlar ve doğrudan açık deftere geçer.)
    - Tüm göndericinin kuyruğa alınmış işlemlerinin gönderebileceği XRP'nin maksimum toplamını göndermek.
    - Hesabın `rezerv gereksinimlerini` karşılamak için yeterli XRP bulundurmak.
- Eğer bir işlem, gönderim adresinin işlemleri nasıl yetkilendirdiğini etkiliyorsa, aynı adresten başka işlemler onun arkasına kuyruğa alınamaz.
- Eğer bir işlem bir `LastLedgerSequence` alanı içeriyorsa, bu alanın değeri en az **mevcut defter indeks + 2** olmalıdır.

### Ücret Ortalaması

Eğer bir gönderim adresinin bir veya daha fazla işlemi kuyruğa alınmışsa, o gönderici, mevcut kuyruğa alınmış işlemleri açık deftere "itmek" için yeterince yüksek bir işlem maliyeti olan yeni bir işlem sunarak bunu yapabilir. Özel olarak, yeni işlem, kendisinin ve kuyruğun önceki işlem görenlerden tüm diğer işlemlerin açık defter maliyetini karşılayacak kadar yüksek bir işlem maliyeti ödemelidir.

> (Unutmayın ki açık defter maliyeti her işlem ödendiğinde üstel olarak artar.)  
> — Not

İşlemler hala diğer kuyruklama kısıtlamalarına tabi olmalı ve gönderim adresinin tüm kuyruğa alınmış işlemlerin işlem maliyetlerini ödemek için yeterli XRP'si olmalıdır.

Bu özellik, belirli bir durumu aşmanıza yardımcı olur. Eğer düşük maliyeti olan bir veya daha fazla kuyruktaki işlem sunduysanız, aynı adresten yeni işlemler gönderemezsiniz, eğer aşağıdakilerden birini yapmazsanız:

* Kuyruğa alınmış işlemlerin geçerli bir deftere dahil edilmesini bekleyin, _veya_
* Kuyruğa alınmış işlemlerin, eğer işlemler `LastLedgerSequence` alanı` ayarlanmışsa kalıcı olarak geçersiz hale gelmesini bekleyin, _veya_
* `Kuyrukta bekleyen işlemleri iptal edin` ve aynı dizin numarasına sahip, daha yüksek işlem maliyetine sahip yeni bir işlem sunun.

Eğer yukarıdaki hiçbir şey gerçekleşmezse, işlemler teori olarak sınırsız bir süre boyunca kuyrukta kalabilir, diğer göndericiler daha yüksek işlem maliyeti olan işlemler sunarak "ön geçebilir". İmzalanmış işlemler değiştirilemez olduğundan, kuyruktaki işlemlerin işlem maliyetini artırarak önceliğini artırmanız mümkün değildir. Eğer daha önce sunulmuş işlemleri geçersiz hale getirmek istemiyorsanız, ücret ortalaması bir çözüm sağlar. 

---

Yeni işleminizin maliyetini artırarak denge sağlarsanız, kuyruğa alınmış işlemlerin hemen açık bir deftere dahil edilmesini sağlayabilirsiniz.

## Kuyruk İçindeki Sıra

İşlem kuyruğunda, işlemler daha yüksek işlem maliyeti ödeyenlerin öne gelmesini sağlayacak şekilde sıralanır. Bu sıralama, işlemlerin _mutlak_ XRP maliyetine göre değil, o işlem türü için `minimum maliyet` ile ilişkili maliyetlere göre yapılır. Aynı işlem maliyetini ödeyen işlemler, sunucunun aldığı sıraya göre sıralanır. 

Kuyruktaki işlemlerin kesin sırası, bir sonraki bekleyen defter versiyonuna daha fazla işlem eklenmesi durumunda hangi işlemlerin ekleneceğini belirler. İşlemlerin sırası, **bir geçerli defter içindeki işlemlerin yürütülme sırasını etkilemez**. Her geçerli defter versiyonunda, o versiyon için işlem seti `kanonik sıralamada` yürütülür.

:::info `rippled` bir işlemi kuyrukladığında, geçici `işlem yanıt kodu` `terQUEUED` olur. Bu, işlemin gelecekteki bir defter versiyonunda başarılı olma olasılığının yüksek olduğunu gösterir. Tüm geçici yanıt kodlarında olduğu gibi, işlemin sonucu, ya geçerli bir deftere dahil edilene kadar ya da `kalıcı olarak geçersiz hale getirilene kadar` kesin değildir.:::

## Ayrıca Bakınız

- `İşlem Maliyeti`, işlem maliyetinin neden var olduğu ve XRP Defteri'nin bunu nasıl sağladığı hakkında bilgi için.
- `Konsensüs`, konsensüs sürecinin işlemleri nasıl onayladığı hakkında ayrıntılı bir açıklama için.

