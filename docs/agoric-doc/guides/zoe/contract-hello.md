---
title: "Merhaba Dünya Akıllı Sözleşmesi"
---

# Merhaba Dünya Akıllı Sözleşmesi

Öncelikle, önceki bölümdeki  gibi bir sözleşme oluşturmayı incelemeden önce, bir selamlama mesajı döndüren basit bir sözleşme yazarak bazı temelleri gözden geçirelim. Buna _merhaba dünya akıllı sözleşmesi_ adını vereceğiz.

Bir sözleşme, bir `start` fonksiyonunu dışa aktaran bir JavaScript modülü ile tanımlanır. Merhaba dünya akıllı sözleşmesi için `start` fonksiyonunun tanımı şu şekildedir:

<<< @/../snippets/zoe/src/01-hello.js#start

Merhaba dünya akıllı sözleşmesi için `start` fonksiyonunun yanı sıra basit bir `greet` fonksiyonumuz olacak. `greet` fonksiyonu, bir dize parametre alır (örneğin, fonksiyonu çağıran kişinin adı) ve kişiye özel bir selamlaşma mesajı döner.

<<< @/../snippets/zoe/src/01-hello.js#greet

`greet` fonksiyonu, diğer tüm kamu fonksiyonları ile birlikte sözleşmenin `publicFacet` aracılığıyla erişilebilir olmalıdır. `start` fonksiyonu, bir `publicFacet` özelliği ile bir nesne döner. Merhaba dünya sözleşmesinde, `start` fonksiyonu `greet` fonksiyonunu sözleşmenin `publicFacet`'inin bir metodu olarak tanımlayarak açığa çıkarır, aşağıda gösterildiği gibi:

<<< @/../snippets/zoe/src/01-hello.js#publicFacet

`publicFacet` özelliğinin değerini bir `Far(...)` çağrısı içinde sararak, bunu uzaktan erişilebilen bir nesne olarak güvenli bir şekilde açığa çıkarırız. Bu, ayrıca hata ayıklama için `Hello` adında önerilecek bir arayüz adı verir.
_`Far` hakkında  daha sonra._

Tüm bunları bir araya getirdiğimizde:

<<< @/../snippets/zoe/src/01-hello.js#contract

Bu kodu `src` dizinine `01-hello.js` adlı bir dosyaya kaydedelim.

## Bir sözleşmeyi test etme

Agoric sözleşmeleri genellikle  çerçevesi kullanılarak test edilir. Test dosyası,  ortamını oluşturmak için `import @endo/init` ile başlar. Ayrıca, asenkron yöntem çağrıları yapmak için `E()`'yi ve `ava`'dan `test` fonksiyonunu içe aktarıyoruz. _Asenkron yöntem çağrıları için `E()` kullanımı hakkında  daha sonra._ Bu `import` ifadelerine takiben, `greet` yönteminin beklenildiği gibi çalıştığını doğrulayan basit bir test yazıyoruz.

Tüm bunları bir araya getirdiğimizde:

<<< @/../snippets/zoe/contracts/test-zoe-01-hello.js#test-01-hello

Bu kodu `test` dizininde `test-01-hello.js` adını verdiğimiz bir dosyaya kaydedelim. Hem `src` hem de `test` dizinleri, aynı `contract` dizininde bulunmalıdır. Testi çalıştırmak için aşağıdaki komutu uygulayalım:

```sh
yarn ava --match="contract greets by name"
```

Çıktının sonunda aşağıdaki satırı görmelisiniz:

```
1 test passed
```

Tebrikler! İlk akıllı sözleşmenizi yazdınız ve test ettiniz. Bir sonraki hedefimiz, bir akıllı sözleşmenin durumunu öğrenmektir.

Eğer bir sorun yaşıyorsanız, örnek reposundaki  dalını kontrol edin.

Ayrıca bakınız:

- 
- 
- 