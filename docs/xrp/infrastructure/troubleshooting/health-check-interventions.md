---
title: Sağlık Kontrol Müdahale Yöntemleri
seoTitle: Sağlık Kontrol Müdahale Yöntemleri ve Öneriler
sidebar_position: 4
description: Bu belge, rippled sunucusunun sağlık kontrolü için otomatik izleme parçası olarak müdahale yöntemlerini ve en etkili uygulamalarını sunmaktadır.
tags: 
  - sağlık kontrolü
  - otomatik izleme
  - sunucu yönetimi
  - güvenilirlik mühendisliği
  - müdahale yöntemleri
keywords: 
  - sağlık kontrolü
  - otomatik izleme
  - sunucu yönetimi
  - güvenilirlik mühendisliği
  - müdahale yöntemleri
---

## Sağlık Kontrol Müdahale Yöntemleri

`Sağlık Kontrol yöntemi` otomatik izleme tarafından, `rippled` sunucusunun sağlıklı olmadığını tanımak ve sunucunun yeniden başlatılması veya bir insan yöneticisine bildirilmesi gibi müdahaleleri teşvik etmek için kullanılabilir.

Altyapı izleme ve güvenilirlik mühendisliği genel olarak, karar vermek için bir bağlamda birden fazla veri kaynağının kullanılmasını içeren ileri düzey bir disiplindir. Bu belge, sağlık kontrolünün en etkili şekilde nasıl kullanılacağına dair bazı öneriler sunmaktadır, ancak bu öneriler yalnızca daha büyük bir stratejinin parçası olarak rehber niteliğindedir.

## Anlık Hatalar

Sağlık kontrolündeki bazı [metrikler][] hızla sağlıksız aralıklara dalgalanabilir ve hemen ardından otomatik olarak toparlanabilir. Sağlık kontrolü sağlıksız bir durum raporladığında her seferinde uyarı vermek gereksiz ve istenmeyen bir durumdur. Otomatik izleme sistemi sağlık kontrolü yöntemini sık sık çağırmalıdır, ancak sorun ciddi ve sürekli değilse daha yüksek bir müdahale seviyesine yükseltilmemelidir.

> Örneğin, sunucunun sağlığını her saniye kontrol ediyorsanız, sunucu "uyarı" durumunu üç kez üst üste raporladığında veya beş saniye içinde dört kez bildirdiğinde bir uyarı verebilirsiniz. Sunucu beş saniye içinde iki kez "kritik" durumunu bildirirse de bir uyarı verebilirsiniz. Sunucu her "uyarı" raporladığında uyarı vermek genellikle aşırı bir durumdur.  
> — Öneri

:::tip İpucu
Sunucu genellikle başlatıldıktan sonraki ilk birkaç saniye boyunca "kritik" durumunu bildirir, bir ağa bağlantı kurduğunda "uyarı" durumuna geçer ve nihayetinde ağa tamamen senkronize olduğunda "sağlıklı" durumunu raporlar. Bir yeniden başlatmadan sonra, ek müdahalelerde bulunmadan önce sunucunun senkronize olması için 5-15 dakika beklemelisiniz.
:::

## Özel Durumlar

Belirli sunucu yapılandırmaları normal şekilde çalışırken bile her zaman `uyarı` durumunu raporlayabilir. Sunucunuz bir özel durum olarak nitelendiriliyorsa, otomatik izleme sisteminizi normal durum ile gerçek bir problem arasındaki farkı tanıyacak şekilde yapılandırmalısınız. Bu muhtemelen sağlık kontrolü yönteminin JSON yanıt gövdesini ayrıştırmayı ve oradaki değerleri beklenen normal aralıklarla karşılaştırmayı içerecektir.

Karşılaşılabilecek bazı özel durum örnekleri şunlardır:

- Bir `özel eş` genellikle yalnızca bilinen sunuculara çok az sayıda eşler arası bağlantıya sahiptir, ancak sağlık kontrolü, sunucu 7 veya daha az eşle bağlı olduğunda `eşler` metrikinde bir uyarı bildirir. Sunucunuzun yapılandırıldığı eş sayısını kesin olarak bilmelisiniz ve bu değeri kontrol etmelisiniz.
- Yeni işlemlerin sürekli olarak gönderilmediği bir `paralel veya test ağında` ağ, yeni işlemler için en fazla 20 saniye bekler, ancak en son onaylanan defter 7 veya daha fazla saniye önce ise sağlık kontrolü `onaylı_defter` metrikinde bir uyarı bildirir. Eğer `rippled` i bir üretim ağı olmayan bir ağda çalıştırıyorsanız, bu metrik için "uyarı" mesajlarını görmezden gelmek isteyebilirsiniz, yalnızca düzenli olarak işlemlerin gönderilmesi gerektiğini biliyorsanız. Ancak, 20 saniye kritik düzeyinde halen bir uyarı vermek isteyebilirsiniz, çünkü XRP Ledger protokolü yeni defter versiyonlarını en azından 20 saniyede bir onaylama amacı taşır, yeni işlenmesi gereken işlemler olmadığında bile.

---

## Önerilen Müdahale Yöntemleri

Bir sağlık kontrolü başarısız olduğunda ve bu sadece bir `anlık hata` değilse, kesintiden kurtulmak için alınacak önlem, nedenine bağlı olarak değişir. Bazı hata türlerini otomatik olarak düzeltmek için altyapınızı yapılandırabilirsiniz. Diğer hatalar, araştırma yapabilecek ve daha karmaşık veya kritik hataları çözmek için gerekli adımları atabilecek bir insan yöneticisi müdahalesini gerektirir; organizasyon yapınıza bağlı olarak, daha az yetenekli, daha düşük seviyedeki yöneticilerin belirli sorunları bağımsız olarak çözebilmesi için farklı insan yöneticisi seviyeleriniz olabilir, ancak daha büyük veya daha karmaşık sorunları çözmek için daha yüksek seviyedeki yöneticilere yükseltmeleri gerekir. Yanıt verme şekliniz ve zamanlamanız muhtemelen benzersiz durumunuza bağlı olacaktır, ancak sağlık kontrolü sonucunda raporlanan metrikler bu kararlarında bir faktör olabilir. 

Aşağıdaki bölümler, denemek isteyebileceğiniz bazı yaygın müdahale yöntemlerini ve bu müdahaleleri en olası şekilde teşvik eden sağlık kontrolü durumlarını önermektedir. Otomatik sistemler ve insan yöneticileri, bu ve diğer müdahaleler arasında seçici olarak yükseltilme yapabilir:

- `Trafiği yönlendirme` etkilenen sunucudan
- `Sunucuyu yeniden başlatma`
- `Rippled yazılımını güncelleme`
- Sorunun başka bir yerde olup olmadığını kontrol etmek için `Ağı araştırma`
- `Donanımı değiştirme`

### Trafiği Yönlendirme

Yaygın bir güvenilirlik tekniği, bir veya daha fazla yük dengeleme proxy'si aracılığıyla yedek sunucular havuzunu çalıştırmaktır. Bunu `rippled` sunucularıyla yapabilirsiniz, ancak `doğrulayıcılar` ile yapmamalısınız. Bazı durumlarda, yük dengeleyiciler havuzlarındaki sunucuların sağlığını izleyebilir ve yalnızca şu anda kendilerini sağlıklı olarak raporlayan sunuculara trafik yönlendirebilir. Bu, sunucuların geçici aşırı yüklenmeden toparlanmasına ve aktif sunucular havuzuna otomatik olarak yeniden katılmasına olanak tanır.

Sağlıksız bir sunucudan trafiği yönlendirmek, özellikle `uyarı` durumunda `sağlık` raporlayan sunucular için uygun bir yanıttır. `Kritik` aralığındaki sunucular daha önemli müdahaleler gerektirebilir.

### Yeniden Başlatma

En basit müdahale, sunucuyu yeniden başlatmaktır. Bu, şu metriklerle birlikte birkaç tür hatada geçici sorunları çözebilir:

- `yük_faktörü`
- `eşler`
- `sunucu_durumu`
- `onaylı_defter`

Sadece `rippled` servisinin yeniden başlatılması için `systemctl` kullanın:

```
$ sudo systemctl restart rippled.service
```

Daha güçlü bir müdahale, tüm makinenin yeniden başlatılmasıdır.

:::warning Dikkat
Bir sunucu_started_after, genellikle ağa senkronize olması için 15 dakikaya kadar ihtiyaç duyar. Bu süre zarfında, sağlık kontrolü muhtemelen kritik veya uyarı durumu bildirecektir. Otomatik sistemlerinizin sunuculara yeniden başlatılmadan önce yeterince senkronize olmaları için yeterli zaman tanıdığından emin olmalısınız.
:::

### Güncelleme

Eğer sunucu sağlık kontrolünde `"amendment_blocked": true` bildiriyorsa, bu, XRP Ledger'ın sunucunuzun anlamadığı bir `protokol değişikliği` etkinleştirdiği anlamına gelir. Ağın revize edilmiş kurallarını yanlış yorumlama olasılığına karşı önlem olarak, bu tür sunucular "değişiklik engelli" hale gelir ve normal şekilde çalışamaz.

Değişiklik engelli olmayı çözmek için, `sunucunuzu güncelleyin` değişikliği anlayan daha yeni bir yazılım sürümüne.

Ayrıca, yazılım hataları bir sunucunun `senkronizasyonu durdurmasına` neden olabilir. Bu durumda, `sunucu_durumu` metriği muhtemelen uyarı veya kritik bir durumda olacaktır. En son kararlı sürümü kullanmıyorsanız, bu tür sorunlara neden olabilecek bilinen sorunların en son düzeltmeleri için güncelleme yapmalısınız.

### Ağı Araştırma

Güvenilmez veya yetersiz bir ağ bağlantısı, bir sunucunun kesinti bildirmesine neden olabilir. Aşağıdaki [metriklerde][] uyarı veya kritik değer bulunması, ağ sorunlarını gösterebilir:

- `eşler`
- `sunucu_durumu`
- `onaylı_defter`

Bu durumda, gerekli müdahaleler diğer sistemlerde değişiklikleri içerebilir, örneğin:

- Gerekli trafiğin sunucuya ulaşmasını sağlamak veya dışarıdan zararlı trafiği engellemek için güvenlik duvarı kurallarını ayarlamak
- Ağ arayüzlerini, anahtarları, yönlendiricileri veya kabloları yeniden başlatmak veya değiştirmek
- Diğer ağ hizmet sağlayıcılarıyla iletişime geçerek sorunlarını çözmek

### Donanımı Değiştirme

Kesinti, bir donanım arızası veya donanımın kaldırabileceğinden daha yüksek bir yükten kaynaklanıyorsa, bazı bileşenleri veya hatta tüm sunucuyu değiştirmeniz gerekebilir.

XRP Ledger'daki bir sunucunun üzerindeki yük, kısmen ağdaki işlem hacmine bağlıdır ve bu hacim organik olarak değişir. Yük, aynı zamanda kullanım alışkanlıklarınıza da bağlıdır. Durumunuz için uygun donanım ve ayarları nasıl planlayacağınızı öğrenmek için `Kapasite Planlaması` sayfasına bakın.

Aşağıdaki [metriklerde][] uyarı veya kritik değerler, yetersiz donanımı gösterebilir:

- `yük_faktörü`
- `sunucu_durumu`
- `onaylı_defter`

[metrikler]: ../../references/http-websocket-apis/peer-port-methods/health-check.md#response-format

