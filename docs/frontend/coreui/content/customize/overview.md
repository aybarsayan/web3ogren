---
description: Sass ile, yığınla küresel seçenekle, geniş bir renk sistemiyle ve daha fazlasıyla Bootstrap için CoreUI'yi tema, özelleştir ve genişletmeyi öğrenin. Bu içerik, özelleştirme yöntemleri, bileşenler ve CSS değişkenleri kullanımı hakkında bilgiler sunmaktadır.
keywords: [CoreUI, Bootstrap, özelleştirme, Sass, CSS değişkenleri, bileşenler, renk sistemi]
---

## Genel Bakış

Bootstrap için CoreUI'yi özelleştirmenin birden fazla yolu vardır. En iyi yolunuz, projenize, yapı araçlarınızın karmaşıklığına, kullandığınız Bootstrap için CoreUI sürümüne, tarayıcı desteğine ve daha fazlasına bağlı olabilir.

Bizim iki tercih edilen yöntemimiz şunlardır:

1. CoreUI için Bootstrap'ı `paket yöneticisi aracılığıyla` kullanarak kaynak dosyalarımızı kullanabilir ve genişletebilirsiniz.
2. CoreUI için Bootstrap’ın derlenmiş dağıtım dosyalarını veya `jsDelivr'ı` kullanarak CoreUI için Bootstrap’ın stillerini ekleyebilir veya geçersiz kılabilirsiniz.

:::tip
Her paket yöneticisinin nasıl kullanılacağını burada detaylandıramasak da, `kendi Sass derleyicinizle Bootstrap için CoreUI kullanımı hakkında bazı kılavuzlar` verebiliriz.
:::

Dağıtım dosyalarını kullanmak isteyenler için, bu dosyaları nasıl dahil edeceğinize ve bir örnek HTML sayfasına dair `başlangıç sayfasını inceleyin`. Oradan, kullanmak istediğiniz düzen, bileşenler ve davranışlar için belgeleri gözden geçirin.

> Bootstrap ile tanışırken, küresel seçeneklerimizi nasıl kullanacağınız, renk sistemimizi nasıl değiştireceğiniz, bileşenlerimizi nasıl inşa ettiğimiz, büyüyen CSS özel özellikleri listemizi nasıl kullanacağınız ve Bootstrap ile inşa ederken kodunuzu nasıl optimize edeceğiniz hakkında daha fazla detay için bu bölümü keşfetmeye devam edin.  
> — Genel Bakış

---

## CSP'ler ve gömülü SVG'ler

Birçok Bootstrap için CoreUI bileşeni, bileşenleri tutarlı ve kolay bir şekilde tarayıcılar ve cihazlar arasında stilize etmek için CSS'lerimizde gömülü SVG'ler içermektedir. **Daha katı CSP konfigürasyonlarına sahip organizasyonlar için**, gömülü SVG'lerimizin (hepsi `background-image` aracılığıyla uygulanan) tüm örneklerini belgelendirdik, böylece seçeneklerinizi daha kapsamlı bir şekilde gözden geçirebilirsiniz.

- `Akkordiyon`
- `Kayan kontroller`
- `Kapat butonu` (uyarılar ve modal'lar içinde kullanılır)
- `Form onay kutuları ve radyo düğmeleri`
- `Form anahtarları`
- `Form doğrulama simgeleri`
- `Navbar geçiş düğmeleri`
- `Seçim menüleri`

:::info
[Topluluk konuşmasına](https://github.com/twbs/bootstrap/issues/25394) dayalı olarak, kendi kod tabanınızda bunu çözmek için bazı seçenekler arasında yerel olarak barındırılan varlıklarla URL'leri değiştirmek, görüntüleri kaldırmak ve çevrimiçi görüntüler kullanmak (tüm bileşenlerde mümkün değil) ve CSP'nizi değiştirmek vardır. 
:::

Önerimiz, kendi güvenlik politikalarınızı dikkatlice gözden geçirmek ve gerekirse en iyi ilerleme yolunu belirlemektir.