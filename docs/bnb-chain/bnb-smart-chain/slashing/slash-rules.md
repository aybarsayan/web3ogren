---
title: BSC Slash Kuralları - BSC Slashing
description: BSC ağında slashing'e neden olabilecek kötü niyetli davranışları ele alırken, özellikle Double Sign, Kötü Niyetli Oylama ve Kullanılabilir Olmama durumlarını açıklamaktadır. Her bir durumda uygulanacak cezalar ve süreçler detaylandırılmaktadır.
keywords: [BSC, slashing, Double Sign, Kötü Niyetli Oylama, blok kaybı, doğrulayıcı, kripto]
---

# BSC Slash Kuralları

BSC ağında slashing'e neden olabilecek üç tür kötü niyetli davranış bulunmaktadır.

## Double Sign

Herhangi biri, **Double Sign** kanıtıyla birlikte bir slashing talebi gönderebilir. Kanıt aşağıdaki kurallara uymalıdır:

* İki blok başlığı aynı yüksekliğe ve aynı ana blok hash'ine sahip olmalıdır
* İki blok başlığı aynı doğrulayıcı tarafından mühürlenmelidir
* Bu iki blokun imzaları **aynı olmamalıdır**
* Bu iki blokun zamanı, kanıtın geçerliliği içinde, yani **24 saat içinde** olmalıdır

:::tip
Eğer kanıt geçerliyse, aşağıdaki işlemler gerçekleşecektir:
:::

1. **200BNB**, doğrulayıcının **kendi delegasyonu** olan BNB'sinden kesilecektir
2. Kalan kesilen BNB, bir sonraki dağıtıma katılan doğrulayıcıların kredi adreslerine tahsis edilecektir
3. Doğrayıcı `jailed` duruma getirilecek ve **30 gün** süre ile aktif doğrulayıcı setinden çıkarılacaktır

---

## Kötü Niyetli Oylama

Herhangi biri, BSC'de **Kötü Niyetli Oylama** kanıtıyla birlikte bir slashing talebi gönderebilir. Kanıt aşağıdaki kurallara uymalıdır:

* İki oyla hedeflenen sayı, kanonik zincirin blok başlığından en fazla **256 geride** olmalıdır
* İki oy kaynakları kendi hedef sayılarından daha küçük olmalıdır
* İki oyunun kaynak hash'i ve hedef hash'i birbirine eşit olmamalıdır
* İki oyunun hedef sayısı aynı olmalı veya bir oyunun aralığı diğer oyunun aralığını kapsamalıdır
* İki oy, aynı oy verme anahtarı tarafından imzalanmalı ve imzaların doğrulaması geçerli olmalıdır
* İmzalama için kullanılan oy verme anahtarı, son iki nefes bloğu tarafından gönderilen listede olmalıdır

:::info
Eğer kanıt geçerliyse, gerçekleşen işlemler:
:::

1. **200BNB**, doğrulayıcının **kendi delegasyonu** olan BNB'sinden kesilecektir
2. Eğer kanıt gönderildiğinde doğrulayıcı aktifse, **5BNB** sisteme ödül sözleşmesinden göndericiye ödül olarak tahsis edilecektir
3. Kalan kesilen BNB, bir sonraki dağıtıma katılan doğrulayıcıların kredi adreslerine tahsis edilecektir
4. Doğrayıcı `jailed` duruma getirilecek ve **30 gün** süre ile aktif doğrulayıcı setinden çıkarılacaktır

---

## Kullanılabilir Olmama

Her doğrulayıcının kaçırılan blok metriklerini kaydeden **dahili bir akıllı sözleşme** bulunmaktadır.

:::note
Eğer bir doğrulayıcı **24 saat içinde 50'den fazla blok kaçırırsa**, blok ödülü almayacak; bunun yerine diğer doğrulayıcılar arasında paylaşılacaktır.
:::

Eğer bir doğrulayıcı 24 saat içinde **150'den fazla blok** kaçırırsa:

1. **10BNB**, doğrulayıcının **kendi delegasyonu** olan BNB'sinden kesilecektir
2. Kesilen BNB, bir sonraki dağıtıma katılan doğrulayıcıların kredi adreslerine tahsis edilecektir
3. Doğrayıcı `jailed` duruma getirilecek ve **2 gün** süre ile aktif doğrulayıcı setinden çıkarılacaktır