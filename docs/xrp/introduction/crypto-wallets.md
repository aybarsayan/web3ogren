---
title: Kripto Cüzdanlar
seoTitle: XRP Defteri için Kripto Cüzdan Rehberi
sidebar_position: 4
description: Kripto cüzdanlar, XRP Defterindeki hesabınızı ve fonlarınızı yönetmenin yollarını sunar. Sorumlu ve sorumlu olmayan cüzdanlar arasındaki farkları anlamak önemlidir.
tags: 
  - kripto cüzdanlar
  - XRP
  - sorumlu cüzdan
  - donanım cüzdanı
  - yazılım cüzdanı
  - güvenlik
keywords: 
  - kripto cüzdanlar
  - XRP
  - sorumlu cüzdan
  - donanım cüzdanı
  - yazılım cüzdanı
  - güvenlik
---

## Kripto Cüzdanlar

Kripto cüzdanlar, XRP Defteri'ndeki hesabınızı ve fonlarınızı yönetmenin bir yolunu sağlar. Seçilecek birçok cüzdan mevcuttur. **Doğru cüzdanı seçmek**, nihayetinde ihtiyaçlarınıza ve XRP ile çalışma konusundaki rahatlığınıza bağlıdır.

## Sorumlu vs Sorumlu Olmayan Cüzdanlar

Bir cüzdan seçerken önemli bir faktör, **sorumlu (custodial)** veya **sorumlu olmayan (non-custodial)** bir cüzdan isteyip istemediğinizdir.

Sorumlu bir cüzdan, üçüncü bir tarafın genellikle XRP Defteri'nde yönettiği bir hesapta fonlarınızı tuttuğu anlamına gelir. Sorumlu cüzdan, paralarınızı güvenli tutmak için başka bir varlığa güvendiğiniz bir banka gibi düşünülebilir. Birçok merkezi borsa, sorumlu cüzdanlar sunar. Bu nedenle, onlarla bir hesap oluşturduğunuzda ve uygulamalarını kullandığınızda, teknik olarak defterde bir hesabınız yoktur.

Günlük ödemeler için, bu daha tercih edilebilir olabilir, çünkü bu tür cüzdanlar kullanıcı dostudur: **şifrenizi unuttuğunuzda, genellikle sıfırlatabilirsiniz.** Ayrıca, bireysel bir XRP Defteri hesabına sahip değilseniz, defterin rezerv gerekliliği geçerli değildir. Custodian, XRP Defteri'nde karşılaştığınız herhangi bir sorun için bir tampon görevi görür ve bir şey nasıl yapılacağını bilmiyorsanız destek veya yardım sunabilir.



Sorumlu olmayan bir cüzdan, [Xaman](https://Xaman.app/) gibi, hesabınıza ait gizli anahtarlara sahip olduğunuz bir cüzdandır. Bu, hesabınızın güvenliğini yönetmekten nihayetinde siz sorumlusunuz anlamına gelir.

:::warning Dikkat
Anahtarlarınızı kaybederseniz, XRP Defteri hesabınıza kilitlenirsiniz ve kurtarma seçenekleri yoktur.
:::

Sorumlu olmayan cüzdanlar daha fazla özgürlük sunar. Kendiniz doğrudan XRP Defteri ile etkileşimde bulunduğunuz için, istediğiniz herhangi bir tür işlemi gerçekleştirmenize izin verir ve kimse seçiminizi kısıtlamaz. **Defter bunu izin veriyorsa, yapabilirsiniz.** Sorumlu olmayan cüzdanlar ayrıca paranızla bir kuruma güvenmenizi gerektirmediği için, kontrolünüz dışındaki piyasa faktörlerinden korunmanıza yardımcı olabilir.

Hem sorumlu hem de sorumlu olmayan cüzdan kullanıcıları, fonlarını çalmaya çalışan kötü niyetli kullanıcılardan korunmalıdır. Sorumlu bir cüzdanda, uygulama veya siteye giriş ve parolanızı yönetmeniz gerekir; sorumlu olmayan bir cüzdanda, defter üzerindeki hesabınızın gizli anahtarlarını yönetmeniz gerekir. Her iki durumda da, cüzdan sağlayıcısının kendi güvenlik uygulamaları, tedarik zinciri saldırıları gibi zayıflıklara karşı sizi korumak için önemlidir; burada bir saldırgan, yazılım güncellemeleri veya bağımlılıklar aracılığıyla cüzdana kötü amaçlı kod yükler. Ancak, sorumlu cüzdanlar, çok sayıda müşterinin fonlarına doğrudan erişimleri olduğu için saldırganlar için daha büyük bir hedef olabilir.

## Donanım vs Yazılım Cüzdanları

Bir cüzdan seçerken bir diğer belirleyici faktör, **donanım (hardware)** veya **yazılım (software)** cüzdanı tercih etmektir.

Donanım cüzdanları, özel/gizli anahtarlarınızı saklayan fiziksel cihazlardır. Donanım cüzdanı kullanmanın ana avantajı, kullanılmadığında internetten ayırarak bilgilerinizi güvence altına alabilmenizdir; donanım cüzdanları anahtarlarınızı hacklenmesi daha kolay olan bilgisayarlar veya akıllı telefonlardan tamamen izole eder.



Yazılım cüzdanları ise tamamen dijitaldir. Bu kullanımlarını kolaylaştırsa da, **aynı zamanda iki seçenekten daha az güvenli bir yöntemdir**; ancak genellikle deneyiminizi artırmak için ek özelliklerle birlikte gelir. Sonuç olarak, iki seçenek arasındaki karar, sizin konfor seviyenize ve kullanım kolaylığının sizin için ne kadar önemli olduğuna bağlı olacaktır.

## Kendi Cüzdanınızı Oluşturmak

XRP Defteri, kamuya açık istemci kütüphaneleri ve API yöntemleri ile açık kaynak bir projedir. Teknik olarak, HTTP/WebSocket araçları kullanarak defter ile etkileşimde bulunabilirsiniz, ancak bu günlük kullanım için pratik değildir. **Defter ile etkileşimde bulunmak için kendi cüzdanınızı oluşturabilirsiniz**, ancak bu seçeneğe bağlılık göstermeden önce, hesapların, işlemlerin ve defterin nasıl birlikte çalıştığını tam olarak anlamanız gerekecektir.

---

Sonraki: `İşlemler ve Talepler`