---
sidebar_position: 4
title: Cüzdanınıza Nasıl Giriş Yapılır
description: Bu belge, cüzdanınıza farklı yöntemler kullanarak nasıl giriş yapacağınızı açıklar.
---

# Cüzdanınıza Nasıl Giriş Yaparsınız?

Camino Cüzdan hesabınıza erişmenin birden fazla yolu vardır. Her bir seçenek üzerine tıklayarak ayrıntılı bilgilere ulaşabilirsiniz.

1. **:** Cüzdanınızı ilk oluşturduğunuzda, size bir anahtar kelime verilir. Anahtar kelimeniz ile giriş yapmak için Camino Suite'e gidin, "Cüzdana Erişim" butonuna tıklayın ve anahtar kelimenizi girin.

2. **:** Eğer daha önce cüzdanınızı tarayıcınızın yerel depolama alanına kaydettiyseniz, Camino Cüzdan giriş sayfasındaki cüzdan adı üzerine tıklayarak ve kaydedilmiş şifreyi girerek giriş yapabilirsiniz.

3. **:** Cüzdanınıza bağlı özel anahtara sahipseniz, bu anahtarı kullanarak giriş yapabilirsiniz. Camino Cüzdan giriş sayfasında "Özel Anahtar" butonuna tıklayın ve özel anahtarınızı girin.

4. **:** Daha önce cüzdanınızı bir anahtar depolama dosyasına kaydettiyseniz, Camino Cüzdan arayüzünün giriş sayfasında Anahtar Depolama Dosyası'na tıklayarak dosyayı sağlayabilir ve kaydedilmiş şifreyi girebilirsiniz.

:::info Yakında: Ledger Desteği!

Şu anda, Ledger donanım cüzdanı cihazınızı kullanarak Camino Cüzdanınıza giriş yapmanıza olanak tanıyacak yeni bir özellik geliştirmekteyiz. Bu, cüzdanınız için ek bir güvenlik katmanı sağlayacaktır. Bu özelliğin kullanılabilirliğini hazır olduğunda duyuracağız.

:::

:::caution ANAHTAR KELİMENİZİ HAZIRDA TUTUN

Hangi giriş yöntemini seçerseniz seçin, cüzdanınızı kurtarmanız gerektiğinde anahtar kelimenizin hazır olması gerektiğini unutmayın.

:::

## Mnemonik Anahtar Kelime ile Giriş Yapma

Mnemonik anahtar kelimeniz ile Camino Cüzdanınıza giriş yapmak için önce sağ üst köşedeki "Giriş Yap" butonuna tıklayın. Bu, sizi giriş sayfasına yönlendirecektir.



Fig.1: Cüzdan Giriş Sayfası


"Mnemonik Anahtar Kelime" butonuna tıklayın ve anahtar kelime kelimelerinizi girmek için 24 giriş alanı içeren bir diyalog penceresi açılacaktır.

Her bir kelimeyi ilgili alana manuel olarak girebilir veya tüm kelimeleri ilk alana kopyalayıp yapıştırarak işlem yapabilirsiniz. Cüzdan, kelimeleri otomatik olarak tüm alanlara dağıtacaktır. Bu özelliğin çalışması için kelimelerin tek bir satırda ve aralarında tek bir boşluk olacak şekilde ayrılması gerektiğini lütfen unutmayın.



Fig.2: Mnemonik Anahtar Kelime Doldurulmuş


### Geçersiz Mnemonik Anahtar Kelimeleri

Eğer mnemonik anahtar kelimenizi girerken bir kelimeyi yanlış yazdıysanız, cüzdan hangi kelimede hata olduğunu gösterecektir. Bu, hatayı düzeltmenizi ve giriş işlemine devam etmenizi sağlar.



Fig.3: Hatalı Mnemonik Anahtar Kelime Doldurulmuş


Ya da eğer listeden bir kelimeyi başka _kabul edilebilir_ bir kelime ile değiştirirseniz, cüzdan anahtar kelimenin geçersiz olduğunu belirten bir uyarı gösterecektir.



Fig.4: Geçersiz Mnemonik Anahtar Kelime Doldurulmuş


:::danger Geçersiz Mnemonik Kelimeleri

Mnemonik anahtar kelimenizdeki yanlış kelimeler için hata mesajı görüntüleme özelliğinin yalnızca yanlış yazılmış veya tamamen yanlış kelimeler için geçerli olduğunu lütfen unutmayın. Anahtar kelime, bitlere karşılık gelen belirli bir kelime listesi içerir ve cüzdan yalnızca girilen kelimelerden herhangi biri bu listeyle uyuşmuyorsa hatayı tespit edecektir.

Bu nedenle, anahtar kelimede bir kelimeyi kabul edilebilir başka bir kelimeyle değiştirdiyseniz, cüzdan yanlış kelimeyi tanımayacak ve sadece mnemonik ifadenin geçersiz olduğunu gösteren bir mesaj görüntüleyecektir. Bu durumda, anahtar kelimenin son 8 biti ifadenin kontrol toplamı olarak kullanılır.

:::

## Kaydedilmiş Cüzdan ile Giriş Yapma

Eğer daha önce cüzdanınızı  tarayıcınızın yerel depolama alanına, Camino Cüzdan giriş sayfasında cüzdan adı üzerine tıklayarak ve kaydedilmiş şifreyi girerek giriş yapabilirsiniz.



Fig.5: Kaydedilmiş Cüzdan Girişi için Şifre Girişi


## Özel Anahtar ile Giriş Yapma

Eğer cüzdanınıza bağlı özel anahtarınız varsa, bunu kullanarak giriş yapabilirsiniz. Camino Cüzdan giriş sayfasında "Özel Anahtar" butonuna tıklayın ve özel anahtarınızı girin.



Fig.6: Özel Anahtar Giriş Diyaloğu


### Özel anahtarınızı nasıl edinebilirsiniz?

Özel anahtarınızı "Anahtarlarımı Yönet" sayfasındaki "Anahtarlarım" bölümüne erişerek görüntüleyebilirsiniz.



Fig.7: Statik Anahtarların Görüntülenmesi




Fig.8: Anahtar Görüntüleme Diyaloğu


## Anahtar Depolama Dosyası ile Giriş Yapma

Daha önce cüzdanınızı bir anahtar depolama dosyasına kaydettiyseniz, Camino Cüzdan arayüzünün giriş sayfasında Anahtar Depolama Dosyası'na tıklayarak dosyayı sağlayabilir ve kaydedilmiş şifreyi girebilirsiniz.



Fig.9: Anahtar Depolama Dosyası Seçimi




Fig.10: Anahtar Depolama Dosyası Seçildi & Şifre Girildi


Cüzdanınızı bir anahtar depolama dosyasına nasıl kaydedeceğiniz hakkında daha fazla bilgi için lütfen  başvurunuz.