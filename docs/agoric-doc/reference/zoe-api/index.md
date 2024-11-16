---
title: Zoe API
---



Zoe framework'ü, akıllı sözleşmeler yazarken  konusunda endişelenmeden çalışmanıza olanak tanır.
Zoe'yi kullanmak için her şeyi "teklifler" cümlesine döküyoruz. Bir teklif önerisi, ne istediğiniz ve ne sunmaya istekli olduğunuz hakkında bir ifadedir. Görüldüğü üzere, birçok akıllı sözleşme (hediyeler ve tek taraflı ödemeler hariç) dijital varlıkların değişimi ile ilgilidir ve bunlar teklif önerileri ile ifade edilebilir.

Kendi sözleşmenizi oluşturmaya başlayın veya mevcut sözleşmelerimizden herhangi birini geliştirin.
Önceden oluşturulmuş sözleşmelerimizi keşfedin: .

Zoe API, aşağıdaki nesneleri destekler:

| Nesne                                       | Açıklama                                              |
| ------------------------------------------- | ----------------------------------------------------- |
|                         | Akıllı sözleşmeleri dağıtır ve onlarla çalışır.       |
|             | Sözleşmeler dışında tekliflere erişmek veya bunları manipüle etmek için kullanılır. |
|  | Çalışan bir sözleşme örneğine erişir.                 |
|                      | Sözleşmeler içinde tekliflere erişmek veya bunları manipüle etmek için kullanılır.  |
|                         | Dijital varlıkları ihraç etmek için bir sözleşme tarafından kullanılır. |

Zoe API, aşağıdaki kütüphaneleri sağlar:

| Kütüphane                   | Açıklama                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------- |
|  | Tekrarlanan sözleşme kodlarını ve kalıplarını yeniden kullanılabilir yardımcı fonksiyonlara dönüştüren fonksiyonlar. |
|  | **** oluşturmanızı ve işlemenizi sağlayan fonksiyonlar. |

Zoe API, aşağıdaki veri türlerini tanıtır ve kullanır:

| Veri Türü                                          | Açıklama                                                                                                                                                                                                                                                                           |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|              | **** çıkışta her bir koltuğa ödenecek miktarı belirtir.                                                                                                                                                                    |
|  | Özellik adlarının **Anahtarlar** ve değerlerinin **** olduğu bir kayıt.                                                                                                                                                     |
|                    | Sadece benzersiz kimliği olan bir **Uzak** nesnesidir.                                                                                                                                                                                                                            |
|                   | Bir sözleşme örneğini temsil eden opak bir nesneye işaret eden bir handle.                                                                                                                                                                                                       |
|                 | Diğer herhangi bir eright gibi **** veya **** tutulabilen, fungible olmayan bir eright.                                                                                                          |
|    | Bir sözleşmeye katılma hakkı veren **** için bir ****.                                                                                                                                                 |
|                  | Bir büyük harfle başlaması gereken bir ASCII tanımlayıcı dizesidir.                                                                                                                                                                                                               |
|   | **bigint**, **number** veya **string** olarak tanımlanmıştır.                                                                                                                                                                                                                     |
|                       | Bir _payda_ **** ve bir _paydanın_ bulunduğu değer ile geçiş yoluyla iletilen bir kayıttır.                                                                                                                                   |
|    | Mevcut **** için **** değişiklikleridir. **TransferBölü** fonksiyonuna geçirilen _transfer_ dizisinin bireysel elemanlarıdır. ****.                  |