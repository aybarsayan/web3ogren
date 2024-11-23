---
title: MutableQuote Nesnesi
---

# MutableQuote Nesnesi

**MutableQuote** nesnesini, tetikleyici değerini değiştireceğiniz birden fazla çağrı yapmayı bekliyorsanız kullanın. Eğer sadece tek bir alıntı gerekiyorsa ve tetikleyici seviyesini değiştirmeyi düşünmüyorsanız, o zaman değiştirilemez bir alıntı kullanın.

Dört adet _değiştirilebilir alıntı_ yöntemi bulunmaktadır. Bu yöntemler, aşağıdaki yöntemlere sahip bir **MutableQuote** nesnesi döndürür:

## aMutableQuote.cancel(e)

- **e**: **String**

Bu, **Promise**'in **e** mesajıyla reddedilmesine neden olur. Promise, **E.when()** ile kullanıldığında, mesaj reddetme bildiriminin bir parçası olarak görünür.

## aMutableQuote.getPromise()

- **Döner:** **Promise&lt;>**

## aMutableQuote.updateLevel(newAmountIn, newAmountOutLimit)

- **newAmountIn**: ****
- **newAmountOutLimit**: **Amount**

**MutableQuote**'un tetikleme seviyelerini belirlenen değerlere değiştirmeye yarar ve ikinci bir **Promise** gerektirmez.

_newAmountIn_'nin ve _newAmountOutLimit_'in ****, sırasıyla orijinal _amountIn_ ve _amountOutLimit_ **Markaları** ile eşleşmelidir.