---
title: Satış Sözleşmesi
---



#####  (Son güncelleme: 4 Şubat 2022)

##### 

Para karşılığında ürün satışı gerçekleştiren bu sözleşme, hem fungible (değiştirilebilir) hem de non-fungible (değiştirilemez) olan ürünlerin bir arada alımını sağlar. Para, fungible olmalıdır.

Sözleşme koşullarında `pricePerItem` belirlenir. Tüm ürünlerin eşit ve sabit bir fiyat üzerinden satılması beklenmektedir.

İlk teklif `{ give: { Items: items } }` şeklinde olmalı ve yukarıda açıklanan koşullarla birlikte sunulmalıdır. Alıcılar, `{ want: { Items: items } give: { Money: m } }` biçimindeki teklifleri kullanırlar. Sağlanan ürünlerin, satıcının hâlâ satış için mevcut olan belirli ürünlerle eşleşmesi gerekir ve para, talep edilen ürün sayısı ile pricePerItem'in çarpımı olmalıdır.

Tüm ürünler satıldığında, sözleşme sona erecek ve yaratıcının ödeme alması sağlanacaktır. Yaratıcının bir onDemand çıkış maddesi varsa, kazancını toplamak için erken çıkış yapabilir. Kalan ürünler hâlâ satışa sunulacak, ancak yaratıcı daha sonraki kazançları toplayamayacaktır.