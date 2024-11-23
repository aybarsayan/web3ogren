---
title: Nesne ile Erişim Kontrolü
---

# Nesne ile Erişim Kontrolü

Üçüncü akıllı sözleşmemizde, bir akıllı sözleşmenin farklı işlevlerine erişimi nasıl kontrol edeceğimizi göstereceğiz. Şimdiye kadar, tüm işlevleri açığa çıkarmak için yalnızca `publicFacet` kullandık. Bununla birlikte, yalnızca sözleşme örneğini oluşturan arayıcıya sunulan başka bir yüz olan `creatorFacet` bulunmaktadır. 
Bu akıllı sözleşmede, `publicFacet` API'sini yalnızca okuma amaçlı bir `get()` işlevi ile sınırlarken, `creatorFacet` API'sini kullanarak `set()` yöntemini sözleşme örneğini oluşturan arayıcıya açıyoruz.

İşte `03-access.js` akıllı sözleşmesi için tam kod:

<<< @/../snippets/zoe/src/03-access.js#access-contract

`publicFacet` kullanarak `set` denemesi yaptığınızda bir hata fırlatılacağını, ancak `creatorFacet` kullanıldığında işlemin başarılı olacağını sağlamak için aşağıdaki gibi basit bir test yazabiliriz:

<<< @/../snippets/zoe/contracts/test-zoe-hello.js#test-access

`set()` yönteminin içinde hiçbir erişim kontrolü olmadığını unutmayın. Erişim kontrolü, `genel ortaklık` ile beklenen ve `yakından korunan` arasında güçlerin ayrılmasına dayanmaktadır. _Bu  yaklaşımını daha sonra daha ayrıntılı olarak ele alacağız._ Sorun yaşıyorsanız, örnek depo içerisindeki  dalına göz atın.

## Nesne Erişim Kuralları

Nesne erişim kuralları, sözleşme içinde nesnelere erişimi yönetmeye ve kontrol etmeye yardımcı olan tanıtım, ebeveynlik, bağışlama ve başlangıç koşulları içerir:

- **Tanıtım**: Nesneler yalnızca tanıtıldıkları diğer nesnelere referans verebilir. Bu, yalnızca bilinen nesnelerin etkileşime girmesini sağlayarak yetkisiz erişimi önler.
- **Ebeveynlik**: Nesneler çocuk nesneler oluşturabilir. Ebeveyn nesne, çocuk nesnenin başlangıç durumu ve yetenekleri üzerinde kontrol sahibidir; bu, çocuğun neleri yapabileceğini ve yapamayacağını tanımlar.
- **Bağışlama**: Nesneler oluşturulduklarında belirli yetenekler veya kaynaklarla donatılabilir. Bu, sözleşmenin bir nesnenin sumacabileceği eylemleri bağışlamaları ile kontrol etmesine olanak tanır.
- **Başlangıç Koşulları**: Nesneler, belirli koşullar veya durumlarla başlatılır. Bu başlangıç koşulları, nesnenin davranış ve etkileşimleri için başlangıç noktasını tanımlar.

Ayrıca  için bakılabilir.

Sonraki bölümde,  ile varlık mintleme ve ticaretine göz atalım.