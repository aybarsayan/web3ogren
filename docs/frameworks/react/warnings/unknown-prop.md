---
title: Bilinmeyen Özellik Uyarısı
seoTitle: Bilinmeyen Özellik Uyarısı - React İçin Bilgiler
sidebar_position: 4
description: Bilinmeyen-prop uyarısı, React tarafından tanınmayan bir özellik ile bir DOM öğesi oluşturulmaya çalışıldığında tetiklenir. Bu kılavuz, bu uyarının olası nedenlerine ve çözümlerine odaklanmaktadır.
tags: 
  - React
  - DOM
  - Bilinmeyen Özellik
  - JavaScript
keywords: 
  - React
  - DOM
  - Uyarılar
  - Bileşenler
---
Bilinmeyen-prop uyarısı, React tarafından yasal bir DOM niteliği/özelliği olarak tanınmayan bir özellik ile bir DOM öğesini oluşturmayı denediğinizde tetiklenecektir. DOM öğelerinizin etrafta dolaşan sahte özelliklere sahip olmadığından emin olmalısınız.

:::info
Bu uyarının ortaya çıkmasının birkaç olası nedeni vardır:
:::

1. `{...props}` veya `cloneElement(element, props)` kullanıyor musunuz? Bir alt bileşene özellik kopyalarken, yalnızca üst bileşen için tasarlanan özellikleri yanlışlıkla iletmiyor olduğunuzdan emin olmalısınız. Aşağıda bu sorun için yaygın çözümlere göz atın.

2. Yerel bir DOM düğümü üzerinde standart dışı bir DOM niteliği kullanıyorsunuz, belki de özel verileri temsil etmek için. Standart bir DOM öğesine özel veri eklemeye çalışıyorsanız, [MDN'de](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes) açıklandığı gibi özel bir veri niteliği kullanmayı düşünün.

3. React henüz belirttiğiniz niteliği tanımıyor. Bu, muhtemelen React'in gelecekteki bir sürümünde düzeltilecektir. Nitelik adını küçük harfle yazarsanız, React bunu uyarı vermeden geçirmenize izin verir.

4. Bir React bileşenini büyük harf olmadan kullanıyorsunuz, örneğin ``. React, bunu bir DOM etiketi olarak yorumlar çünkü React JSX dönüşümü, kullanıcı tanımlı bileşenler ile DOM etiketleri arasında ayırt etmek için büyük/küçük harf kuralını kullanır. Kendi React bileşenleriniz için PascalCase kullanın. Örneğin, `` yerine `` yazın.