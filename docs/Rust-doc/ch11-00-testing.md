# Otomatik Test Yazma

Edsger W. Dijkstra, 1972 tarihli "Alçakgönüllü Programcı" makalesinde, 

> "Program testi, hataların varlığına işaret etmenin çok etkili bir yoludur, ancak yokluğunu göstermekte umutsuzca yetersizdir."  
> — Edsger W. Dijkstra

Bu, test etmeye çalışmamız gerektiği anlamına gelmez!

Programlarımızdaki doğruluk, kodumuzun hedeflediğimiz şeyi yapma derecesidir. Rust, programların doğruluğu konusunda yüksek bir endişe ile tasarlanmıştır, ancak doğruluk karmaşık bir konudur ve kanıtlaması kolay değildir. Rust’ın tip sistemi bu yükün büyük bir kısmını üstlenir, ancak tip sistemi her şeyi yakalayamaz. Bu nedenle, Rust, otomatik yazılım testleri yazmayı destekler.

Diyelim ki `add_two` adında, kendisine geçen sayıya 2 ekleyen bir fonksiyon yazıyoruz. Bu fonksiyonun imzası, bir tam sayıyı parametre olarak kabul eder ve bir tam sayı sonucunu döner. O fonksiyonu uygulayıp derlediğimizde, Rust, şimdiye kadar öğrendiğiniz tüm tip kontrolü ve ödünç alma kontrolünü yaparak, örneğin, bu fonksiyona bir `String` değeri ya da geçersiz bir referans geçmediğimizden emin olur. Ancak Rust, bu fonksiyonun tam olarak hedeflediğimiz şekilde, yani parametreye 2 eklemek yerine 10 ekleyip eklemeyeceğini ya da parametreden 50 çıkarıp çıkarmayacağını **kontrol edemez**! İşte burada testler devreye girer.

:::tip
Test yazma sürecine başlamadan önce, test edilecek fonksiyonların her birinin beklenen çıktılarının net bir şekilde tanımlandığından emin olun.
:::

Örneğin, `3` değerini `add_two` fonksiyonuna geçtiğimizde, dönen değerin `5` olduğunu doğrulayan testler yazabiliriz. Kodumuzda değişiklik yaptığımızda, mevcut doğru davranışın değişmediğinden emin olmak için bu testleri çalıştırabiliriz.

--- 

Test etme karmaşık bir beceridir: iyi testler yazma hakkında her detayı tek bir bölümde kapsayamayacak olsak da, bu bölümde Rust’ın test etme olanaklarının mekaniklerini tartışacağız. Testlerinizi yazarken kullanabileceğiniz notlar ve makrolar, testlerinizi çalıştırmak için sağlanan varsayılan davranış ve seçenekler, ve testlerinizi birim testleri ve entegrasyon testleri olarak nasıl organize edebileceğiniz hakkında konuşacağız.


  Daha Fazla Bilgi İçin Tıklayın
  Test yazımıyla ilgili daha fazla bilgi edinmek için, Rust belgelendirmesinin test bölümlerine göz atabilirsiniz. Detaylı makrolar ve örnekler sunulmaktadır.
