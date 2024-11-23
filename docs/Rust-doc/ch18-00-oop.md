# Rust'un Nesne Yönelimli Programlama Özellikleri

Nesne yönelimli programlama (OOP), programların modellenmesi için bir yoludur. Nesneler, programlama dili Simula'da 1960'larda tanıtılan programatik bir kavramdır. Bu nesneler, Alan Kay'in nesne geçişli mimarisini etkilemiş ve nesnelerin birbirine mesaj göndermesini sağlamıştır. Bu mimariyi tanımlamak için 1967'de *nesne yönelimli programlama* terimini icat etmiştir. 

:::info
OOP'nin ne olduğu konusunda birçok rakip tanım bulunmaktadır ve bu tanımlardan bazılarına göre Rust nesne yönelimlidir, bazılarına göre ise değildir.
:::

Bu bölümde, genellikle nesne yönelimli olarak kabul edilen belirli özellikleri ve bu özelliklerin idiomatik Rust'a nasıl dönüştüğünü inceleyeceğiz. 

:::tip
Nesne yönelimli prensipleri öğrenirken, Rust'ın kendi özelliklerini anlamak önemlidir.
:::

Sonrasında, Rust'ta nesne yönelimli bir tasarım deseninin nasıl uygulanacağını gösterecek ve bunun, Rust'ın bazı güçlü yönlerini kullanarak bir çözüm uygulamaya göre avantajlarını tartışacağız. 

> "Rust, geleneksel OOP paradigmalarına alternatif bir yaklaşım sunar."  
> — Rust Programlama Kılavuzu

--- 


Daha Fazla Bilgi
  
OOP'nin bazı temel özellikleri arasında kapsülleme, miras alma ve çok biçimlilik yer alır. Bu özelliklerin Rust'taki karşılıklarını anlamak, program yazımında daha etkili olmanıza yardımcı olabilir.

:::note
Rust, bellek güvenliğini önceliklendirirken, bazı OOP prensiplerini gerçekleştirirken önemli değişiklikler yapmaktadır.
:::

