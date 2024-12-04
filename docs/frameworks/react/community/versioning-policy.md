---
title: Sürümleme Politikası
seoTitle: React Sürümleme Politikası
sidebar_position: 1
description: React sürümlerinin nasıl yönetildiğini ve hangi kuralların geçerli olduğunu keşfedin. Bu sayfada kararlı sürümler ve kırıcı değişiklikler hakkında bilgi bulacaksınız.
tags: 
  - React
  - Sürümleme
  - Geliştirme
  - Yazılım Mühendisliği
keywords: 
  - sürümleme
  - React
  - semver
  - API
---
React'in tüm kararlı sürümleri yüksek düzeyde testten geçer ve anlamsal sürümlemeyi (semver) takip eder. React ayrıca deneysel özellikler hakkında erken geri bildirim almak için kararsız sürüm kanalları da sunmaktadır. Bu sayfa, React sürümlerinden ne bekleyeceğinizi açıklar.



Önceki sürümler için `Sürümler` sayfasına bakın.

## Kararlı sürümler {/*stable-releases*/}

Kararlı React sürümleri (aynı zamanda "Son" sürüm kanalı olarak da bilinir) [anlamsal sürümleme (semver)](https://semver.org/) ilkelerini takip eder.

> **Açıklama:** Bu, bir sürüm numarası **x.y.z** olduğunda:
>
> * **Kritik hata düzeltmeleri** yayımlarken, **z** numarasını değiştirerek bir **yamanın sürümünü** oluştururuz (örn: 15.6.2'den 15.6.3'e).
> * **Yeni özellikler** veya **önemli olmayan düzeltmeler** yayımlarken, **y** numarasını değiştirerek bir **küçük sürüm** oluştururuz (örn: 15.6.2'den 15.7.0'a).
> * **Kırıcı değişiklikler** yayımlarken, **x** numarasını değiştirerek bir **büyük sürüm** oluştururuz (örn: 15.6.2'den 16.0.0'a).

Büyük sürümler ayrıca yeni özellikler içerebilir ve herhangi bir sürüm hata düzeltmeleri içerebilir.

Küçük sürümler en yaygın sürüm türüdür.

### Kırıcı Değişiklikler {/*breaking-changes*/}

:::info
Kırıcı değişiklikler herkes için rahatsız edicidir, bu nedenle büyük sürümlerin sayısını en aza indirmeye çalışıyoruz – örneğin, React 15 Nisan 2016'da, React 16 Eylül 2017'de ve React 17 Ekim 2020'de yayımlandı.
:::

Bunun yerine, yeni özellikleri küçük sürümlerde yayımlıyoruz. Bu, küçük sürümlerin sıklıkla daha ilginç ve çekici olduğu anlamına gelir, ismi alçak gönüllü olsa da.

### Kararlılığa Taahhüt {/*commitment-to-stability*/}

React'i zamanla değiştirdikçe, yeni özelliklerden yararlanılması için gereken çabayı en aza indirmeye çalışıyoruz. Mümkünse, daha eski bir API'nin çalışmasını sağlamaya devam edeceğiz, bu büyüklükte mevcut bir paket koymak anlamına gelse bile. Örneğin, [mixins yıllardır önerilmemektedir](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html) ancak bu güne kadar [create-react-class](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) ile desteklenmektedir ve birçok kod tabanı, kararlı, eski kodda onları kullanmaya devam etmektedir.

Bir milyondan fazla geliştirici React kullanıyor, topluca milyonlarca bileşeni yönetiyor. Facebook kod tabanı yalnızca 50.000'den fazla React bileşenine sahiptir. Bu, yeni React sürümlerine geçişi mümkün olduğunca kolay hale getirmemiz gerektiği anlamına geliyor; büyük değişiklikler yaparsak, insanlar eski sürümlerde kalacaklar. Bu geçiş yollarını Facebook'ta test ediyoruz - 10 kişiden daha az bir ekibin 50.000'den fazla bileşeni güncelleyebilmesi durumunda, güncellemenin React'ı kullanan herkes için yönetilebilir olmasını umuyoruz. Birçok durumda, bileşen sözdizimini güncellemek için [otomatik betikler](https://github.com/reactjs/react-codemod) yazıyoruz ve ardından bunları herkesin kullanabilmesi için açık kaynak sürümüne ekliyoruz.

### Aşamalı güncellemeler için uyarılar {/*gradual-upgrades-via-warnings*/}

React'in geliştirme sürümleri birçok kullanışlı uyarı içerir. Mümkün olduğunca, gelecekteki kırıcı değişiklikler için hazırlık amaçlı uyarılar ekliyoruz. Bu sayede, uygulamanızın son sürümde herhangi bir uyarısı yoksa, bir sonraki büyük sürümle uyumlu olacaktır. Bu, uygulamalarınızı bir bileşen üzerinde bir seferde yükseltmenizi sağlar.

Geliştirme uyarıları uygulamanızın çalışma zamanını etkilemez. Bu nedenle, uygulamanızın geliştirme ve üretim sürümleri arasında aynı şekilde davranacağından emin olabilirsiniz -- tek fark, üretim sürümünün uyarıları kaydetmemesi ve daha verimli olmasıdır. (Eğer başka türlü bir şey fark ederseniz, lütfen bir sorun bildirin.)

### Kırıcı değişiklik olarak ne sayılır? {/*what-counts-as-a-breaking-change*/}

Genel olarak, **geliştirme uyarıları** için büyük sürüm numarasını artırmıyoruz. Bunlar üretim davranışını etkilemediği için, ana sürümler arasında yeni uyarılar ekleyebilir veya mevcut uyarıları değiştirebiliriz. Aslında, bu, yaklaşan kırıcı değişiklikler hakkında güvenilir bir şekilde uyarı vermemizi sağlayan şeydir.

**`unstable_` ile başlayan API'ler.** Bu API'ler, henüz güvenilir olmayan deneysel özellikler olarak sağlanmaktadır. Bu API'leri `unstable_` öneki ile yayımlamak suretiyle daha hızlı döngü yapabilir ve daha erken kararlı bir API'ye ulaşabiliriz.

**React'in Alpha ve Canary sürümleri.** React'in alpha sürümleri, yeni özellikleri erkenden test etmek için sağlıyoruz, ancak alpha döneminde öğrendiklerimize dayanarak değişiklik yapma esnekliğine ihtiyacımız var. Eğer bu sürümleri kullanıyorsanız, API'lerin kararlı sürümden önce değişebileceğini unutmayın.

**Belgelendirilmemiş API'ler ve dahili veri yapıları.** `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` veya `__reactInternalInstance$uk43rzhitjg` gibi dahili özellik adlarına erişmeniz durumunda, hiçbir garanti yoktur. Hem kendi başınıza kalırsınız.

:::warning
Bu politika pragmatik olmak üzere tasarlanmıştır: kesinlikle, sizin için baş ağrısı oluşturmak istemiyoruz. Eğer bu değişikliklerin tümü için büyük sürüm numarasını artırırsak, daha fazla büyük sürüm yayımlamak zorunda kalır ve sonuç olarak topluluk için daha fazla sürümleme acısına neden olurduk. Bu aynı zamanda, React'ı istediğimiz hızda geliştirmede ilerleme kaydedemeyeceğimiz anlamına gelir.
:::

Yine de, bu listedeki bir değişikliğin toplulukta geniş sorunlara neden olacağını düşünürsek, yine de yavaş bir geçiş yolu sağlamaya çalışacağız.

### Eğer bir küçük sürüm yeni özellikler içermiyorsa, neden bir yama değil? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

Bir küçük sürüm yeni özellikler içermeyebilir. [Bu, semver tarafından izin verilmektedir](https://semver.org/#spec-item-7), bu da **"[bir küçük sürüm] ÖZEL kod içinde önemli yeni işlevsellik veya iyileştirmeler getirildiğinde artırılabilir. Yaman seviyesinde değişiklikler içerebilir."**

Ancak, bu sürümlerin neden yamalar olarak sürümlendirilmediğini sorguluyor.

Cevabı, React (veya diğer yazılımlar) üzerinde yapılan her değişikliğin beklenmedik şekillerde kırılma riski taşımasıdır. Bir senaryoyu düşünün; bir hatayı düzelten bir yamanın başka bir hatayı yanlışlıkla tanıtması. Bu, yalnızca geliştiriciler için rahatsız edici olmakla kalmaz, aynı zamanda gelecekteki yamanın güvenilirliğini de zedeler. Orijinal düzeltmenin pratikte nadiren karşılaşılan bir hata için olması durumunda özellikle üzücüdür.

React sürümlerini hatalardan uzak tutmada oldukça iyi bir geçmişimiz var, ancak yama sürümleri, çoğu geliştiricinin olumsuz sonuçlar olmadan benimseyebileceğini varsaydığı için, daha yüksek bir güvenilirlik standardına sahiptir.

:::tip
Bu nedenlerle, yama sürümlerini yalnızca en kritik hatalar ve güvenlik açıkları için saklı tutuyoruz.
:::

Eğer bir sürüm gereksiz değişiklikler içeriyorsa - dahili yeniden düzenlemeler, uygulama detaylarındaki değişiklikler, performans iyileştirmeleri veya önemsiz hata düzeltmeleri gibi - yeni özellikler olmasa bile, küçük sürüm numarasını artıracağız.

## Tüm sürüm kanalları {/*all-release-channels*/}

React, hata raporları vermek, pull isteği açmak ve [RFC'ler sunmak](https://github.com/reactjs/rfcs) için gelişen bir açık kaynak topluluğuna bağımlıdır. Geri bildirimi teşvik etmek için bazen henüz yayımlanmamış özellikleri içeren özel React sürümlerini paylaşıyoruz.



Bu bölüm, çerçeve, kütüphane veya geliştirici araçları üzerinde çalışan geliştiricilere en alakalı olacaktır. React'i öncelikle kullanıcı arayüzü uygulamaları oluşturmak için kullanan geliştiricilerin önceden yayımlanan kanallarımız hakkında endişelenmeleri gerekmemelidir.



Her bir React sürüm kanalı, belirli bir kullanım durumu için tasarlanmıştır:

- `**Son**` kararlı, semver React sürümleridir. Npm üzerinden React yüklediğinizde elde ettiğiniz budur. Bu, bugün zaten kullandığınız kanaldır. **Kullanıcı arayüzü uygulamalarının doğrudan React tükettiği kanaldır.**
- `**Canary**` React kaynak kodu deposunun ana dalını takip eder. Bunları, bir sonraki semver sürümü için yayımlama adayları gibi düşünebilirsiniz. **`Çerçeveler veya diğer derlenmiş kurulumlar bu kanalı kullanmayı seçebilir.` Ayrıca, React ile üçüncü taraf projeler arasında entegrasyon testi için de Canaries'leri kullanabilirsiniz.**
- `**Deneysel**` kararlı sürümlerde mevcut olmayan deneysel API'leri ve özellikleri içerir. Bunlar da ana dalı takip eder, ancak ek özellik bayrakları açık durumdadır. Bu, yayımlanmadan önce yaklaşan özellikleri denemek için kullanılır.

Tüm sürümler npm'ye yayımlanır, ancak yalnızca Son sürümler anlamsal sürümleme kullanır. Ön sürümler (Canary ve Deneysel kanallardaki) içeriklerinin ve commit tarihinin hash'inden üretilen sürümlere sahiptir; örneğin, `18.3.0-canary-388686f29-20230503` Canary için ve `0.0.0-experimental-388686f29-20230503` Deneysel için.

**Hem Son hem de Canary kanalları, kullanıcı arayüzü uygulamaları için resmi olarak desteklenmektedir, ancak farklı beklentilerle**:

* Son sürümler geleneksel semver modelini takip eder.
* Canary sürümleri `kesin olarak belirlenmeli` ve kırıcı değişiklikler içerebilir. Bunlar, yeni React özelliklerini ve hata düzeltmelerini kendi sürüm takvimlerinde yavaşça yayımlamak isteyen derlenmiş kurulumlar (çerçeveler gibi) için vardır.

Deneysel sürümler yalnızca test amaçları için sağlanır ve davranışlarının sürümler arasında değişmeyeceğine dair hiçbir garanti veremiyoruz. En son sürümlerden gelen sürümleme protokolünü takip etmezler.

Aynı kayıt defterine ön sürümleri yayımlayarak, npm iş akışını destekleyen birçok araçtan yararlanabiliriz; örneğin, [unpkg](https://unpkg.com) ve [CodeSandbox](https://codesandbox.io).

### Son kanal {/*latest-channel*/}

Son, kararlı React sürümleri için kullanılan kanaldır. Npm üzerindeki `latest` etiketiyle eşdeğerdir. Gerçek kullanıcılar için gönderilen tüm React uygulamaları için önerilen kanaldır.

> **Hangi kanalı kullanmanız gerektiğinden emin değilseniz, Son kanalıdır.** Eğer React'i doğrudan kullanıyorsanız, bu zaten kullandığınız kanaldır. Son kanaldaki güncellemelerin son derece kararlı olmasını bekleyebilirsiniz. Sürümleri, `önceden açıklandığı gibi` anlamsal sürümleme şemasını takip eder.

### Canary kanalı {/*canary-channel*/}

Canary kanalı, React deposunun ana dalını takip eden bir ön sürüm kanalıdır. Canary kanalındaki ön sürümleri, Son kanalını ayırma adayları olarak kullanıyoruz. Canary'i, daha sık güncellenen Son'un üst kümesi olarak düşünebilirsiniz.

Son Canary sürümü ile en son Son sürümü arasında değişim derecesi, muhtemelen iki küçük semver sürümü arasında bulabileceğinizden yaklaşık olarak aynıdır. Ancak, **Canary kanalı anlamsal sürümlemeye uymamaktadır.** Successive release’lerde Canary kanalında bazen kırıcı değişiklikler beklemelisiniz.

> **Kullanıcı arayüzü uygulamalarında doğrudan ön sürümleri kullanmayın, eğer `Canary iş akışını` takip etmiyorsanız.**

Canary'deki sürümler, npm'de `canary` etiketiyle yayımlanır. Sürümler, oluşturma içeriği ve commit tarihinin hash'indan üretilir; örneğin `18.3.0-canary-388686f29-20230503`.

#### Entegrasyon testi için canary kanalını kullanma {/*using-the-canary-channel-for-integration-testing*/}

Canary kanalı ayrıca React ile diğer projeler arasındaki entegrasyon testlerini destekler.

React'teki tüm değişiklikler halka sunulmadan önce kapsamlı iç testlerden geçer. Ancak, React ekosisteminde kullanılan bir dizi ortam ve yapılandırma vardır ve her birini test etmemiz mümkün değildir.

Eğer üçüncü taraf bir React çerçevesinin, kütüphanesinin, geliştirici aracının veya benzeri bir altyapı projesinin yazarıysanız, testlerinizi en son değişikliklerle periyodik olarak çalıştırarak, kullanıcılarınız ve tüm React topluluğu için React'in kararlı kalmasına yardımcı olabilirsiniz. İlginizi çekiyorsa, şu adımları izleyin:

1. Tercih ettiğiniz sürekli entegrasyon platformu kullanarak bir cron görevi ayarlayın. Cron görevleri, hem [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) hem de [Travis CI](https://docs.travis-ci.com/user/cron-jobs/) tarafından desteklenmektedir.
2. Cron görevinde, npm'de `canary` etiketini kullanarak Canary kanalındaki en son React sürümüne React paketlerinizi güncelleyin. Npm cli kullanarak:
   
   ```console
   npm update react@canary react-dom@canary
   ```

   Ya da yarn:

   ```console
   yarn upgrade react@canary react-dom@canary
   ```

3. Güncellenen paketler üzerinde test suite'unuzu çalıştırın.
4. Eğer her şey geçerse, harika! Projenizin bir sonraki küçük React sürümüyle çalışacağını bekleyebilirsiniz.
5. Eğer bir şey beklenmedik bir şekilde bozulursa, lütfen [bir sorun bildirerek](https://github.com/facebook/react/issues) bize bildirin.

:::note
Bu iş akışını kullanan bir proje Next.js'dir. Özellikle referans alabilirsiniz [CircleCI yapılandırmalarına](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml).
:::

### Deneysel kanal {/*experimental-channel*/}

Canary gibi, Deneysel kanal, React deposunun ana dalını takip eden bir ön sürüm kanalıdır. Canary'nin aksine, Deneysel sürümleri, daha geniş bir şekilde yayımlanmaya hazır olmayan ek özellikler ve API'ler içerir.

Genellikle, bir Canary güncellemesi, karşılık gelen bir Deneysel güncellemesiyle birlikte gelir. Aynı kaynak revizyonuna dayalıdırlar, ancak farklı bir özellik bayrakları seti kullanılarak inşa edilirler.

Deneysel sürümler, Canary ve Son sürümlerine göre önemli ölçüde farklı olabilir. **Kullanıcı arayüzü uygulamalarında Deneysel sürümleri kullanmayın.** Deneysel kanaldaki sürümler arasında sıkça kırıcı değişiklikler beklemelisiniz.

Deneysel sürümler, npm'de `experimental` etiketi ile yayımlanır. Sürümler, oluşturma içeriği ve commit tarihinin hash'inden üretilir; örneğin `0.0.0-experimental-68053d940-20210623`.

#### Deneysel bir sürüme neler dahil edilir? {/*what-goes-into-an-experimental-release*/}

Deneysel özellikler, daha geniş bir kamuya yayımlanmak için hazır olmayan ve nihai hale gelmeden önce önemli ölçüde değişebilecek olanlardır. Bazı deneyler asla nihai hale gelmeyebilir - deneyler, önerilen değişikliklerin uygulanabilirliğini test etmek içindir.

Örneğin, Deneysel kanal, Hooks'u duyurduğumuzda mevcut olsaydı, Hooks'u Son'dan önce Deneysel kanalına yayımlardık.

:::info
Entegrasyon testlerini Deneysel üzerinde çalıştırmanın değerli olabileceğini düşünebilirsiniz. Bu tamamen size kalmış. Ancak, Deneysel'in Canary'den daha az kararlı olduğuna dair uyarılmalıdır. **Deneysel sürümler arasında herhangi bir kararlılık garantisi vermiyoruz.**
:::

#### Deneysel özellikler hakkında daha fazla bilgi nasıl alabilirim? {/*how-can-i-learn-more-about-experimental-features*/}

Deneysel özellikler belgelendirilebilir veya belgelendirilmeyebilir. Genellikle, deneyler, Canary veya Son'da gönderime yakın olana kadar belgelenmez.

Bir özellik belgelenmemişse, bir [RFC](https://github.com/reactjs/rfcs) ile birlikte olabilir.

Yeni deneyleri duyurmaya hazır olduğumuzda, [React blogu](https://reactjs.org/blog) üzerinden gönderiler yapacağız, ancak bu, her deneyin yaygınlaştırılacağı anlamına gelmez.

Değişikliklerin kapsamlı bir listesini görmek için her zaman kamuya açık GitHub deposunun [geçmişine](https://github.com/facebook/react/commits/main) başvurabilirsiniz.