---
title: Takas Değişim Sözleşmesi
---



#####  (Son güncelleme: 14 Eylül 2020)

##### 

Takas Değişim, birbirleriyle takas edilecek rastgele mallar için teklifler alır.

Bu Takas Değişim, rastgele malları başka şeylerle takas etme tekliflerini kabul eder. İhraççıların kaydını gerektirmez. Eğer iki teklif birbirini karşılarsa, her tarafın istek bölümündeki belirtilen miktarları değiştirir.

Anahtar kelimelere dikkat etmemesi ve ihraççıların kaydını gerektirmemesi sayesinde her tür mal arasında ticaret yapabilir. "Ben kavun varım ve yastık kılıfları arıyorum." şeklinde geleneksel "takasa" benzer; burada ortak bir para birimi yoktur. Bir emir defteri tutar ve her yeni teklif aldığında, emir defterindeki eşleşmeleri araştırır.

Takas Değişim, yalnızca aşağıdaki gibi görünen teklifleri kabul eder:
```javascript
{ give: { In: amount }, want: { Out: amount } }
```

İstek miktarı eşleşecek, verme miktarı ise bir maksimum olarak kabul edilecektir. Her başarılı tüccar, `istediği` miktarı alacak ve belirttiği `verme` miktarına kadar herhangi bir miktar belirleyen karşı taraflarla ticaret yapabilecektir.