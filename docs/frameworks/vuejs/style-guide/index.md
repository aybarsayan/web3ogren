---
title: Stil Kılavuzu
seoTitle: Resmi Vue Stil Kılavuzu
sidebar_position: 1
description: Bu, Vueya özel kod için resmi stil kılavuzudur. Projelerde hata ve anti-patternlerden kaçınmak için harika bir referans niteliğindedir.
tags: 
  - Vue
  - stil kılavuzu
  - JavaScript
  - HTML
keywords: 
  - Vue
  - stil kılavuzu
  - JavaScript
  - HTML
---
## Stil Kılavuzu {#style-guide}

Bu, Vue'ya özel kod için resmi stil kılavuzudur. Eğer bir projede Vue kullanıyorsanız, hatalardan, gereksiz tartışmalardan ve anti-pattern'lerden kaçınmak için harika bir referans niteliğindedir. Ancak, hiç bir stil kılavuzunun tüm ekipler veya projeler için ideal olduğu inancında değiliz, bu yüzden geçmiş deneyimlere, çevresindeki teknoloji yelpazesine ve kişisel değerlere dayalı olarak dikkatli sapmalara teşvik edilmektedir.

:::tip
Proje takımı ile stil kılavuzunu incelemek, herkesin aynı sayfada kalmasını sağlar.
:::

En çok, genel olarak JavaScript veya HTML hakkında tavsiyelerden de kaçınıyoruz. Noktalı virgül veya son virgül kullanıp kullanmamanız bizim için önemli değil. HTML’nizin nitelik değerleri için tek tırnak veya çift tırnak kullanıp kullanmamanız da önemli değil. Ancak bazı istisnalar vardır; bu durumlarda, Vue bağlamında belirli bir patter'nin yararlı olduğunu gördük.

Son olarak, kuralları dört kategoriye ayırdık:

## Kural Kategorileri {#rule-categories}

### Öncelik A: Temel (Hata Önleme) {#priority-a-essential-error-prevention}

Bu kurallar hataları önlemeye yardımcı olur, bu yüzden onları öğrenin ve her koşulda uymaya çalışın. İstisnalar olabilir, ancak bunlar çok nadir olmalı ve yalnızca hem JavaScript hem de Vue konusunda uzman bilgisine sahip olanlar tarafından yapılmalıdır.

- `Tüm öncelik A kurallarını gör`

### Öncelik B: Kuvvetle Tavsiye Edilir {#priority-b-strongly-recommended}

Bu kurallar, çoğu projede okunabilirliği ve/veya geliştirici deneyimini artırdığı görülmüştür. Eğer bu kurallara uymazsanız kodunuz yine çalışacaktır, ancak ihlaller nadir ve iyi bir gerekçeye sahip olmalıdır.

- `Tüm öncelik B kurallarını gör`

### Öncelik C: Tavsiye Edilir {#priority-c-recommended}

Eşit derecede iyi birden fazla seçenek mevcut olduğunda, tutarlılığı sağlamak için keyfi bir seçim yapılabilir. Bu kurallar altında, her kabul edilebilir seçeneği tanımlıyoruz ve varsayılan bir seçim öneriyoruz. Bu, kendi kod tabanınızda farklı bir seçim yapmanıza izin verir, yeter ki tutarlı olun ve iyi bir gerekçeniz bulunsun. 

:::note
İyi bir gerekçeniz olduğundan emin olun! Topluluk standartlarına uyum sağlayarak şunları elde edeceksiniz:
:::

1. Karşılaştığınız topluluk kodunu daha kolay çözümlemek için beyninizi eğitirsiniz
2. Çoğu topluluk kodu örneğini değiştirmeden kopyalayıp yapıştırabilirsiniz
3. Genellikle yeni işe alınanların, en azından Vue ile ilgili tercih ettiğiniz kodlama stiline aşina olduğunu göreceksiniz

- `Tüm öncelik C kurallarını gör`

### Öncelik D: Dikkatle Kullanılmalı {#priority-d-use-with-caution}

Vue'nun bazı özellikleri nadir kenar durumlarını veya eski bir kod tabanından daha sorunsuz geçişleri kolaylaştırmak için mevcuttur. Ancak aşırı kullanıldığında, kodunuzu sürdürmeyi daha zor hale getirebilir veya hata kaynağına dönüşebilir. Bu kurallar, potansiyel olarak riskli özelliklere ışık tutarak, ne zaman ve neden kaçınılması gerektiğini açıklamaktadır.

- `Tüm öncelik D kurallarını gör`