---
title: Bir Adres Kullanarak Davet Ödemeleri Göndermek
---

# Bir Adres Kullanarak Davet Ödemeleri Göndermek

Bu belgede, bir Agoric akıllı sözleşmesi aracılığıyla birine `agoric1...` adresinden nasıl ödeme göndereceğimizi açıklayacağız. Bu işlem, bir deposit facet kullanılarak gerçekleştirilir.

## Deposit Facet Kullanımı

Swaparoo sözleşmesinden aşağıdaki kod parçasına bakalım:

```js
const secondDepositFacet = await E(depositFacetFromAddr).lookup(
  secondPartyAddress,
  'depositFacet'
);

await E(secondDepositFacet).receive(secondSeatInvitation);

return 'invitation sent';
```

## Adım Adım Açıklama

### Deposit Facet'i Alma:

- `depositFacetFromAddr`, adreslere bağlı deposit facet'leri için bir arama işlevi sağlayan bir nesnedir. Swaparoo sözleşmesi, öneri (`swaparoo.proposal.js`) tarafından bir `namesByAddressAdmin` ile sağlanır. Sözleşme, `fixHub()` ile `depositFacetFromAddr` oluşturur.
  - Bir adres örneği `agoric1ydzxwh6f893jvpaslmaz6l8j2ulup9a7x8qvvq` olabilir.
- Arama işlevi, `secondPartyAddress` ve `'depositFacet'` argümanları ile çağrılır ve `secondPartyAddress` ile ilişkili deposit facet'i alır.
- Elde edilen deposit facet, `secondDepositFacet` değişkeninde saklanır.

### Ödemeyi Yapma:

- `secondDepositFacet`, önceki adımda elde edilen deposit facet'i temsil eder.
- `receive` yöntemi, `secondDepositFacet` üzerinde çağrılır ve `secondSeatInvitation` argümanı geçirilir.
- `secondSeatInvitation`, ikinci oturumda yer almak için bir davettir (davetlerin ödemeler olduğunu hatırlayın).
- `receive` başka bir asenkron işlem olduğu için, işlemin tamamlanmasını beklemek için tekrar `await` anahtar kelimesi kullanılır.
- `secondSeatInvitation` ile deposit facet üzerinde `receive` çağrıldığında, `secondSeatInvitation` ile temsil edilen ödeme, `secondDepositFacet` ile ilişkili bir cüzdana aktarılır veya yatırılır.

### Sonuç Döndürme:

- `receive` çağrılarak ödeme başarıyla yapıldıktan sonra, fonksiyon davetin gönderildiğini belirtmek için `'invitation sent'` stringini döndürür.

## Agoric'teki Deposit Facet'ler

Agoric akıllı sözleşme çerçevesinde, deposit facet'ler dijital varlıkların ve ödemelerin taraflar arasında aktarımını ve yönetimini sağlamak için kullanılır. Deposit facet üzerinde `receive` yöntemi çağrılıp bir ödeme veya teklif geçirildiğinde, akıllı sözleşme, bu facet ile ilişkili hesaba varlıkları yatırabilir veya aktarabilir.

Deposit facet'ler, ödemeleri yönetmek için bir soyutlama katmanı sağlar ve aktarım işlemlerinin akıllı sözleşme içinde güvenli ve güvenilir bir şekilde gerçekleştirilmesini garanti eder.

## Video Eğitim

Bu eğitimi izlerken, aşağıdaki video eğitimine göz atmak yardımcı olabilir.



